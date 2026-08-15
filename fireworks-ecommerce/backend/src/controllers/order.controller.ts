import { Request, Response, NextFunction } from "express";
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

const GST_RATE = 0.18;
const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_CHARGE = 99;

interface OrderItemInput {
  productId: string;
  quantity: number;
}

// ─── Place Order ──────────────────────────────────────────────────────────────
export const placeOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { shippingAddress, paymentMethod, items, promoCode } = req.body as {
      shippingAddress: IOrderItem;
      paymentMethod: "razorpay" | "cod" | "pay_later";
      items: OrderItemInput[];
      promoCode?: string;
    };

    // Fetch all products and validate stock
    const orderItems: IOrderItem[] = [];
    let itemsPrice = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
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
    const totalAmount = parseFloat((taxableAmount + taxAmount + shippingPrice).toFixed(2));

    const isPayLater = paymentMethod === "pay_later";
    const paymentDueDate = isPayLater
      ? new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 48 hours from now
      : undefined;

    const order = await Order.create({
      user: req.user!._id,
      orderItems,
      shippingAddress,
      paymentInfo: {
        method: paymentMethod,
        status: paymentMethod === "cod" ? "pending" : "pending",
      },
      itemsPrice,
      promoCode: promo?.code,
      discountAmount,
      taxAmount,
      shippingPrice,
      totalAmount,
      orderStatus: isPayLater ? "AwaitingPayment" : "Pending",
      paymentDueDate,
      statusHistory: isPayLater
        ? [{ status: "AwaitingPayment", updatedAt: new Date(), note: "Order placed — awaiting payment within 2 days" }]
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

    // Send confirmation email + WhatsApp invoice — both non-blocking, independent of each other
    if (isPayLater) {
      // Pay-later: send a payment reminder email — no invoice yet
      const dueDate = paymentDueDate!.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
      try {
        await sendEmail({
          to: req.user!.email,
          subject: `Order Placed — Pay by ${dueDate} to confirm #${order._id.toString().slice(-8).toUpperCase()}`,
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px">
              <h2 style="color:#c9184a">Order Placed — Payment Pending</h2>
              <p>Hi <strong>${req.user!.name}</strong>,</p>
              <p>Your order <strong>#${order._id.toString().slice(-8).toUpperCase()}</strong> has been placed successfully.</p>
              <div style="background:#fff7ed;border-left:4px solid #f97316;padding:16px;border-radius:8px;margin:16px 0">
                <p style="margin:0;font-weight:bold;color:#f97316">⏰ Payment Due by ${dueDate}</p>
                <p style="margin:8px 0 0">Please complete payment within <strong>2 days</strong> to confirm your order. Packing will begin only after payment is received.</p>
              </div>
              <p>Total Amount: <strong>₹${totalAmount.toFixed(2)}</strong></p>
              <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/orders/${order._id}"
                style="display:inline-block;background:#c9184a;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:8px">
                Pay Now →
              </a>
              <p style="margin-top:24px;color:#6b7280;font-size:13px">If payment is not received by the due date, the order will be automatically cancelled and stock will be released.</p>
            </div>
          `,
        });
      } catch (err) {
        console.error("Pay-later reminder email failed:", err);
      }
    } else {
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
    }

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
      Order.find(filter).sort("-createdAt").skip(skip).limit(limit),
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
