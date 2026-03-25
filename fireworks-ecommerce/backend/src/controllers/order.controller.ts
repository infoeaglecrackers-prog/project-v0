import { Request, Response, NextFunction } from "express";
import Order from "../models/Order";
import Product from "../models/Product";
import Cart from "../models/Cart";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import sendEmail from "../utils/sendEmail";
import { orderConfirmationTemplate } from "../templates/email.templates";
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
    const { shippingAddress, paymentMethod, items } = req.body as {
      shippingAddress: IOrderItem;
      paymentMethod: "razorpay" | "cod";
      items: OrderItemInput[];
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

    const taxAmount = parseFloat((itemsPrice * GST_RATE).toFixed(2));
    const shippingPrice = itemsPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE;
    const totalAmount = parseFloat((itemsPrice + taxAmount + shippingPrice).toFixed(2));

    const order = await Order.create({
      user: req.user!._id,
      orderItems,
      shippingAddress,
      paymentInfo: {
        method: paymentMethod,
        status: paymentMethod === "cod" ? "pending" : "pending",
      },
      itemsPrice,
      taxAmount,
      shippingPrice,
      totalAmount,
      statusHistory: [{ status: "Pending", updatedAt: new Date() }],
    });

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

    // Send confirmation email
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
      });
    } catch {
      // Non-blocking — don't fail order if email fails
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

    if (!["Pending", "Processing"].includes(order.orderStatus)) {
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

// ─── Get Invoice ──────────────────────────────────────────────────────────────
export const getInvoice = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const order = await Order.findById(req.params.id);
    if (!order) return next(new AppError("Order not found.", 404));

    if (
      order.user.toString() !== req.user!._id.toString() &&
      req.user!.role !== "admin"
    ) {
      return next(new AppError("Not authorized.", 403));
    }

    // Return existing invoice URL or a placeholder
    const invoiceUrl = order.invoiceUrl || `/api/orders/${order._id}/invoice-generate`;

    res.status(200).json({
      success: true,
      data: { invoiceUrl },
    });
  }
);
