import { Request, Response, NextFunction } from "express";
import Order from "../models/Order";
import Product from "../models/Product";
import Cart from "../models/Cart";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import sendEmail from "../utils/sendEmail";
import { orderConfirmationTemplate, paymentRequestTemplate } from "../templates/email.templates";
import { buildUpiIntent, upiQrBuffer } from "../utils/upi";
import { generateInvoicePDF } from "../utils/generateInvoice";
import { resolvePromoDiscount } from "../utils/applyPromo";
import { sendWhatsAppInvoice } from "../utils/sendWhatsAppInvoice";
import { IOrderItem, PaymentMethod } from "../models/Order";

const GST_RATE = 0;
// Shipping is collected at the point of delivery, not added to the upfront total
// that the customer pays during checkout.
const FREE_SHIPPING_THRESHOLD = 0;
const SHIPPING_CHARGE = 0;

interface OrderItemInput {
  productId: string;
  quantity: number;
}

// ─── Place Order ──────────────────────────────────────────────────────────────
export const placeOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { shippingAddress, paymentMethod, items, promoCode } = req.body as {
      shippingAddress: IOrderItem;
      paymentMethod: PaymentMethod;
      items: OrderItemInput[];
      promoCode?: string;
    };

    // Fetch all products in one round trip instead of one findById per cart
    // line — a 5-item cart previously meant 5 sequential queries here.
    const orderItems: IOrderItem[] = [];
    let itemsPrice = 0;

    const products = await Product.find({ _id: { $in: items.map((i) => i.productId) } }).select(
      "_id name price discountPrice stock images isActive"
    );
    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product || !product.isActive) {
        return next(new AppError(`Product not found: ${item.productId}`, 404));
      }
      if (item.quantity > product.stock) {
        return next(
          new AppError(`Insufficient stock for: ${product.name}. Only ${product.stock} left.`, 400)
        );
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
    const totalAmount = parseFloat((taxableAmount + taxAmount).toFixed(2));

    // Both self-hosted rails land in the same state: the order exists, nothing is
    // paid yet, and payment happens out-of-band via UPI. They differ only in how
    // the customer is prompted — `upi` opens the pay panel straight away,
    // `pay_later` says "pay by <date>". The 2-day window applies to both, so a
    // customer who abandons the UPI screen can still come back and finish.
    const isPayLater = paymentMethod === "pay_later";
    const awaitsPayment = isPayLater || paymentMethod === "upi";
    const paymentDueDate = awaitsPayment
      ? new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 48 hours from now
      : undefined;

    const order = await Order.create({
      user: req.user!._id,
      orderItems,
      shippingAddress,
      paymentInfo: {
        method: paymentMethod,
        status: "pending",
      },
      itemsPrice,
      promoCode: promo?.code,
      discountAmount,
      taxAmount,
      shippingPrice,
      totalAmount,
      orderStatus: awaitsPayment ? "AwaitingPayment" : "Pending",
      paymentDueDate,
      statusHistory: awaitsPayment
        ? [{
            status: "AwaitingPayment",
            updatedAt: new Date(),
            note: isPayLater
              ? "Order placed — awaiting payment within 2 days"
              : "Order placed — awaiting UPI payment",
          }]
        : [{ status: "Pending", updatedAt: new Date() }],
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

    const queueOrderNotifications = async () => {
      if (awaitsPayment) {
        const dueDate = paymentDueDate!.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
        const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        const payUrl = `${baseUrl}/orders/${order._id}?pay=1`;

        let qrPng: Buffer | undefined;
        let upiVpa = "";
        try {
          const intent = buildUpiIntent(order._id.toString(), totalAmount);
          upiVpa = intent.vpa;
          qrPng = await upiQrBuffer(intent.uri);
        } catch (err) {
          console.error("UPI QR for payment email failed:", err);
        }

        const qrCid = qrPng ? "upiqr@elite" : undefined;

        try {
          await sendEmail({
            to: req.user!.email,
            subject: `Your order is reserved — complete payment by ${dueDate}`,
            html: paymentRequestTemplate(
              req.user!.name,
              payUrl,
              totalAmount,
              dueDate,
              upiVpa,
              qrCid
            ),
            attachments: qrPng
              ? [{ filename: "upi-qr.png", content: qrPng, cid: qrCid, contentType: "image/png" }]
              : undefined,
          });
        } catch (err) {
          console.error("Payment-request email failed:", err);
        }
        return;
      }

      let invoicePdf: Buffer | undefined;
      try {
        invoicePdf = await generateInvoicePDF(order, req.user!);
      } catch (err) {
        console.error("Invoice PDF generation failed:", err);
      }

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
          attachments: invoicePdf
            ? [{ filename: `Invoice-${order._id}.pdf`, content: invoicePdf, contentType: "application/pdf" }]
            : undefined,
        });
      } catch (err) {
        console.error("Order confirmation email failed:", err);
      }

      if (invoicePdf && req.user!.phone) {
        try {
          await sendWhatsAppInvoice(req.user!.phone, req.user!.name, order._id.toString(), invoicePdf);
        } catch (err) {
          console.error("WhatsApp invoice send failed:", err);
        }
      }
    };

    void queueOrderNotifications();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: { order },
    });
  }
);

// ─── Get My Orders ────────────────────────────────────────────────────────────
export const getMyOrders = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = { user: req.user!._id };
    if (req.query.status) filter.orderStatus = req.query.status;

    const [orders, total] = await Promise.all([
      Order.find(filter).sort("-createdAt").skip(skip).limit(limit).lean(),
      Order.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: { orders },
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalOrders: total,
        limit,
      },
    });
  }
);

// ─── Get All Orders (Admin Only) ─────────────────────────────────────────────
export const getAllOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Admin-only check
    if (req.user!.role !== "admin") {
      return next(new AppError("Not authorized. Admin access required.", 403));
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (req.query.status) filter.orderStatus = req.query.status;

    const [orders, total] = await Promise.all([
      Order.find(filter).sort("-createdAt").skip(skip).limit(limit).lean(),
      Order.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: { orders },
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalOrders: total,
        limit,
      },
    });
  }
);

// ─── Get Order Detail ─────────────────────────────────────────────────────────
export const getOrderDetail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) return next(new AppError("Order not found.", 404));

    if (
      order.user._id.toString() !== req.user!._id.toString() &&
      req.user!.role !== "admin"
    ) {
      return next(new AppError("Not authorized to view this order.", 403));
    }

    res.status(200).json({ success: true, data: { order } });
  }
);

// ─── Cancel Order ─────────────────────────────────────────────────────────────
export const cancelOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const order = await Order.findById(req.params.id);
    if (!order) return next(new AppError("Order not found.", 404));

    if (
      order.user.toString() !== req.user!._id.toString() &&
      req.user!.role !== "admin"
    ) {
      return next(new AppError("Not authorized.", 403));
    }

    if (!["Pending", "AwaitingPayment", "Processing"].includes(order.orderStatus)) {
      return next(new AppError("Order cannot be cancelled after shipping.", 400));
    }

    // Restore stock
    await Promise.all(
      order.orderItems.map((item) =>
        Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity, sold: -item.quantity },
        })
      )
    );

    order.orderStatus = "Cancelled";
    order.cancelledAt = new Date();
    order.cancelReason = req.body.reason || "Cancelled by user";
    order.statusHistory.push({ status: "Cancelled", updatedAt: new Date(), note: req.body.reason });
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: { order },
    });
  }
);

// ─── Get Invoice (PDF download) ────────────────────────────────────────────────
export const getInvoice = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) return next(new AppError("Order not found.", 404));

    if (
      order.user._id.toString() !== req.user!._id.toString() &&
      req.user!.role !== "admin"
    ) {
      return next(new AppError("Not authorized.", 403));
    }

    const invoicePdf = await generateInvoicePDF(order, order.user as unknown as { name: string; email: string });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="Invoice-${order._id}.pdf"`);
    res.status(200).send(invoicePdf);
  }
);
