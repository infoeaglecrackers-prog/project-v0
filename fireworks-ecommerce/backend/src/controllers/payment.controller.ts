import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import razorpayInstance from "../utils/razorpay";
import Order from "../models/Order";
import Product from "../models/Product";
import Cart from "../models/Cart";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import sendEmail from "../utils/sendEmail";
import { orderConfirmationTemplate } from "../templates/email.templates";
import { generateInvoicePDF } from "../utils/generateInvoice";
import { resolvePromoDiscount } from "../utils/applyPromo";
import { sendWhatsAppInvoice } from "../utils/sendWhatsAppInvoice";
import { IOrderItem } from "../models/Order";

interface OrderItemInput {
  productId: string;
  quantity: number;
}

const GST_RATE = 0.18;
const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_CHARGE = 99;

// ─── Create Razorpay Order ────────────────────────────────────────────────────
export const createRazorpayOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { amount } = req.body;
    if (!amount || amount < 100) {
      return next(new AppError("Order amount must be at least ₹1.", 400));
    }

    const options = {
      amount: Math.round(amount), // amount in paise
      currency: "INR",
      // Razorpay caps `receipt` at 40 chars — a full ObjectId + prefix + timestamp overflows that
      receipt: `rcpt_${req.user!._id.toString().slice(-8)}_${Date.now()}`,
    };

    let razorpayOrder;
    try {
      razorpayOrder = await razorpayInstance.orders.create(options);
    } catch (err) {
      // The Razorpay SDK throws a plain object ({ statusCode, error: { description } }),
      // not an Error — surface its real message instead of a generic 500.
      const rzpErr = err as { statusCode?: number; error?: { description?: string } };
      return next(new AppError(rzpErr.error?.description || "Razorpay order creation failed.", rzpErr.statusCode || 400));
    }

    res.status(200).json({
      success: true,
      data: {
        razorpayOrder,
        key: process.env.RAZORPAY_KEY_ID,
      },
    });
  }
);

// ─── Verify Payment & Create Order ───────────────────────────────────────────
export const verifyPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      shippingAddress,
      items,
      promoCode,
    } = req.body as {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
      shippingAddress: object;
      items: OrderItemInput[];
      promoCode?: string;
    };

    // Verify HMAC signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return next(new AppError("Payment verification failed. Invalid signature.", 400));
    }

    // Build order items
    const orderItems: IOrderItem[] = [];
    let itemsPrice = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return next(new AppError(`Product not found: ${item.productId}`, 404));
      if (item.quantity > product.stock) {
        return next(new AppError(`Insufficient stock for: ${product.name}`, 400));
      }
      const unitPrice = product.discountPrice ?? product.price;
      itemsPrice += unitPrice * item.quantity;
      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0]?.url || "",
        price: unitPrice,
        quantity: item.quantity,
      } as IOrderItem);
    }

    const { promo, discountAmount } = await resolvePromoDiscount(promoCode, itemsPrice);

    const taxableAmount = itemsPrice - discountAmount;
    const taxAmount = parseFloat((taxableAmount * GST_RATE).toFixed(2));
    const shippingPrice = taxableAmount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE;
    const totalAmount = parseFloat((taxableAmount + taxAmount + shippingPrice).toFixed(2));

    const order = await Order.create({
      user: req.user!._id,
      orderItems,
      shippingAddress,
      paymentInfo: {
        method: "razorpay",
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        status: "paid",
        paidAt: new Date(),
      },
      itemsPrice,
      promoCode: promo?.code,
      discountAmount,
      taxAmount,
      shippingPrice,
      totalAmount,
      orderStatus: "Processing",
      statusHistory: [
        { status: "Pending", updatedAt: new Date() },
        { status: "Processing", updatedAt: new Date(), note: "Payment received" },
      ],
    });

    if (promo) {
      promo.usedCount += 1;
      await promo.save();
    }

    // Reduce stock
    await Promise.all(
      items.map((item) =>
        Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity, sold: item.quantity },
        })
      )
    );

    // Clear cart
    await Cart.findOneAndUpdate(
      { user: req.user!._id },
      { items: [], totalItems: 0, totalPrice: 0 }
    );

    // Confirmation email + WhatsApp invoice — both non-blocking, independent of each other
    let invoicePdf: Buffer | undefined;
    try {
      invoicePdf = await generateInvoicePDF(order, req.user!);
    } catch (err) {
      console.error("Invoice PDF generation failed:", err);
    }

    if (invoicePdf) {
      try {
        await sendEmail({
          to: req.user!.email,
          subject: `Order Confirmed — #${order._id}`,
          html: orderConfirmationTemplate(
            req.user!.name,
            order._id.toString(),
            orderItems.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
            totalAmount
          ),
          attachments: [
            { filename: `Invoice-${order._id}.pdf`, content: invoicePdf, contentType: "application/pdf" },
          ],
        });
      } catch (err) {
        console.error("Order confirmation email failed:", err);
      }

      if (req.user!.phone) {
        try {
          await sendWhatsAppInvoice(req.user!.phone, req.user!.name, order._id.toString(), invoicePdf);
        } catch (err) {
          console.error("WhatsApp invoice send failed:", err);
        }
      }
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: { orderId: order._id, paymentId: razorpay_payment_id },
    });
  }
);

// ─── Razorpay Webhook ─────────────────────────────────────────────────────────
export const razorpayWebhook = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET as string;
  const signature = req.headers["x-razorpay-signature"] as string;

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(req.body as Buffer)
    .digest("hex");

  if (expectedSignature !== signature) {
    res.status(400).json({ received: false });
    return;
  }

  const event = JSON.parse((req.body as Buffer).toString());

  if (event.event === "payment.captured") {
    const paymentId = event.payload?.payment?.entity?.id;
    const razorpayOrderId = event.payload?.payment?.entity?.order_id;
    await Order.findOneAndUpdate(
      { "paymentInfo.razorpay_order_id": razorpayOrderId },
      {
        "paymentInfo.status": "paid",
        "paymentInfo.razorpay_payment_id": paymentId,
        "paymentInfo.paidAt": new Date(),
        orderStatus: "Processing",
      }
    );
  }

  if (event.event === "payment.failed") {
    const razorpayOrderId = event.payload?.payment?.entity?.order_id;
    await Order.findOneAndUpdate(
      { "paymentInfo.razorpay_order_id": razorpayOrderId },
      { "paymentInfo.status": "failed" }
    );
  }

  res.status(200).json({ received: true });
};
