import { Request, Response, NextFunction } from "express";
import Order from "../models/Order";
import Product from "../models/Product";
import User from "../models/User";
import Category from "../models/Category";
import Cart from "../models/Cart";
import Wishlist from "../models/Wishlist";
import Address from "../models/Address";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import sendEmail from "../utils/sendEmail";
import {
  orderShippedTemplate,
  orderDeliveredTemplate,
} from "../templates/email.templates";
import { OrderStatus } from "../models/Order";

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
export const getDashboardStats = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const period = (req.query.period as string) || "month";
    const now = new Date();
    let startDate = new Date();
    if (period === "today") startDate.setHours(0, 0, 0, 0);
    else if (period === "week") startDate.setDate(now.getDate() - 7);
    else if (period === "month") startDate.setMonth(now.getMonth() - 1);
    else if (period === "year") startDate.setFullYear(now.getFullYear() - 1);

    const [
      totalOrders,
      totalUsers,
      totalProducts,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      lowStockProducts,
      revenueData,
      recentOrders,
      topProducts,
    ] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: startDate } }),
      User.countDocuments({ role: "user" }),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments({ orderStatus: "Pending" }),
      Order.countDocuments({ orderStatus: "Processing" }),
      Order.countDocuments({ orderStatus: "Shipped" }),
      Order.countDocuments({ orderStatus: "Delivered" }),
      Order.countDocuments({ orderStatus: "Cancelled" }),
      Product.countDocuments({ stock: { $lte: 10 }, isActive: true }),
      Order.aggregate([
        { $match: { createdAt: { $gte: startDate }, "paymentInfo.status": "paid" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      Order.find().populate("user", "name email").sort("-createdAt").limit(5),
      Product.find({ isActive: true }).sort("-sold").limit(5).select("name sold images price"),
    ]);

    const totalRevenue = revenueData[0]?.total || 0;

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalRevenue,
          totalOrders,
          totalUsers,
          totalProducts,
          pendingOrders,
          processingOrders,
          shippedOrders,
          deliveredOrders,
          cancelledOrders,
          lowStockProducts,
        },
        recentOrders,
        topProducts,
      },
    });
  }
);

// ─── Get All Orders (Admin) ───────────────────────────────────────────────────
export const getAllOrders = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (req.query.status) filter.orderStatus = req.query.status;
    if (req.query.paymentStatus) filter["paymentInfo.status"] = req.query.paymentStatus;
    if (req.query.startDate || req.query.endDate) {
      filter.createdAt = {
        ...(req.query.startDate && { $gte: new Date(req.query.startDate as string) }),
        ...(req.query.endDate && { $lte: new Date(req.query.endDate as string) }),
      };
    }

    const sortField = (req.query.sort as string) || "-createdAt";

    let query = Order.find(filter)
      .populate("user", "name email")
      .sort(sortField)
      .skip(skip)
      .limit(limit);

    // Search by order ID or user name/email handled via populate filter
    const [orders, total] = await Promise.all([query, Order.countDocuments(filter)]);

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

// ─── Get Order Detail (Admin) ─────────────────────────────────────────────────
export const getOrderDetail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const order = await Order.findById(req.params.id).populate("user", "name email phone");
    if (!order) return next(new AppError("Order not found.", 404));
    res.status(200).json({ success: true, data: { order } });
  }
);

// ─── Update Order Status ──────────────────────────────────────────────────────
export const updateOrderStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { status, trackingNumber, note } = req.body as {
      status: OrderStatus;
      trackingNumber?: string;
      note?: string;
    };

    const validStatuses: OrderStatus[] = [
      "Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Refunded",
    ];
    if (!validStatuses.includes(status)) {
      return next(new AppError("Invalid order status.", 400));
    }

    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) return next(new AppError("Order not found.", 404));

    order.orderStatus = status;
    order.statusHistory.push({ status, updatedAt: new Date(), note });

    if (status === "Shipped" && trackingNumber) {
      order.trackingNumber = trackingNumber;
    }
    if (status === "Delivered") {
      order.deliveredAt = new Date();
      order.paymentInfo.status = "paid";
    }
    if (status === "Cancelled") {
      order.cancelledAt = new Date();
      // Restore stock
      await Promise.all(
        order.orderItems.map((item) =>
          Product.findByIdAndUpdate(item.product, {
            $inc: { stock: item.quantity, sold: -item.quantity },
          })
        )
      );
    }

    await order.save();

    // Email notification
    const user = order.user as unknown as { name: string; email: string };
    try {
      if (status === "Shipped" && trackingNumber) {
        await sendEmail({
          to: user.email,
          subject: `Your Order Has Been Shipped — #${order._id}`,
          html: orderShippedTemplate(user.name, order._id.toString(), trackingNumber),
        });
      }
      if (status === "Delivered") {
        await sendEmail({
          to: user.email,
          subject: `Your Order Has Been Delivered — #${order._id}`,
          html: orderDeliveredTemplate(user.name, order._id.toString()),
        });
      }
    } catch {
      // Non-blocking
    }

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: { order },
    });
  }
);

// ─── Get All Users (Admin) ────────────────────────────────────────────────────
export const getAllUsers = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const sortField = (req.query.sort as string) || "-createdAt";
    const [users, total] = await Promise.all([
      User.find(filter).sort(sortField).skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: { users },
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        limit,
      },
    });
  }
);

// ─── Get User Detail (Admin) ──────────────────────────────────────────────────
export const getUserDetail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError("User not found.", 404));

    const orderStats = await Order.aggregate([
      { $match: { user: user._id } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$totalAmount" },
          lastOrderDate: { $max: "$createdAt" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        user,
        orderStats: orderStats[0] || { totalOrders: 0, totalSpent: 0, lastOrderDate: null },
      },
    });
  }
);

// ─── Change User Role ─────────────────────────────────────────────────────────
export const changeUserRole = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      return next(new AppError("Invalid role. Must be 'user' or 'admin'.", 400));
    }

    if (req.params.id === req.user!._id.toString()) {
      return next(new AppError("Cannot change your own role.", 400));
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );
    if (!user) return next(new AppError("User not found.", 404));

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      data: { user },
    });
  }
);

// ─── Delete User (Admin) ──────────────────────────────────────────────────────
export const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.params.id === req.user!._id.toString()) {
      return next(new AppError("Cannot delete your own account.", 400));
    }

    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError("User not found.", 404));

    await Promise.all([
      Cart.findOneAndDelete({ user: req.params.id }),
      Wishlist.findOneAndDelete({ user: req.params.id }),
      Address.deleteMany({ user: req.params.id }),
      user.deleteOne(),
    ]);

    res.status(200).json({ success: true, message: "User deleted successfully" });
  }
);

// ─── Low Stock Products ───────────────────────────────────────────────────────
export const getLowStockProducts = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const threshold = Number(req.query.threshold) || 10;
    const products = await Product.find({
      stock: { $lte: threshold },
      isActive: true,
    })
      .populate("category", "name")
      .select("name sku stock images price category")
      .sort("stock");

    res.status(200).json({
      success: true,
      data: { products, count: products.length },
    });
  }
);

// ─── Revenue Analytics ────────────────────────────────────────────────────────
export const getRevenueAnalytics = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const period = (req.query.period as string) || "monthly";
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date();
    const startDate = req.query.startDate
      ? new Date(req.query.startDate as string)
      : new Date(new Date().setMonth(endDate.getMonth() - 11));

    // Group format by period
    let dateFormat: string;
    if (period === "daily") dateFormat = "%Y-%m-%d";
    else if (period === "weekly") dateFormat = "%Y-W%U";
    else if (period === "yearly") dateFormat = "%Y";
    else dateFormat = "%Y-%m"; // monthly

    const [chartData, summaryData, topCategories, topProducts] = await Promise.all([
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate },
            "paymentInfo.status": "paid",
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: dateFormat, date: "$createdAt" } },
            revenue: { $sum: "$totalAmount" },
            orders: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $project: { period: "$_id", revenue: 1, orders: 1, _id: 0 } },
      ]),
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate },
            "paymentInfo.status": "paid",
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" },
            totalOrders: { $sum: 1 },
          },
        },
      ]),
      // Top categories by revenue via product lookup
      Order.aggregate([
        { $match: { "paymentInfo.status": "paid" } },
        { $unwind: "$orderItems" },
        {
          $lookup: {
            from: "products",
            localField: "orderItems.product",
            foreignField: "_id",
            as: "productInfo",
          },
        },
        { $unwind: "$productInfo" },
        {
          $lookup: {
            from: "categories",
            localField: "productInfo.category",
            foreignField: "_id",
            as: "categoryInfo",
          },
        },
        { $unwind: "$categoryInfo" },
        {
          $group: {
            _id: "$categoryInfo.name",
            revenue: { $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] } },
          },
        },
        { $sort: { revenue: -1 } },
        { $limit: 5 },
      ]),
      Product.find({ isActive: true })
        .sort("-sold")
        .limit(5)
        .select("name sold price images"),
    ]);

    const totalRevenue = summaryData[0]?.totalRevenue || 0;
    const totalOrders = summaryData[0]?.totalOrders || 0;

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalRevenue,
          totalOrders,
          averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
        },
        chart: chartData,
        topCategories: topCategories.map((c) => ({
          category: c._id,
          revenue: c.revenue,
          percentage: totalRevenue > 0 ? ((c.revenue / totalRevenue) * 100).toFixed(1) : 0,
        })),
        topProducts,
      },
    });
  }
);

// ─── Get All Categories (Admin) ──────────────────────────────────────────────
export const getAllCategories = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const categories = await Category.find().sort("sortOrder");
    res.status(200).json({
      success: true,
      data: { categories },
    });
  }
);

// ─── Get Category Detail (Admin) ─────────────────────────────────────────────
export const getCategoryDetail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = await Category.findById(req.params.id);
    if (!category) return next(new AppError("Category not found.", 404));
    res.status(200).json({
      success: true,
      data: { category },
    });
  }
);

// ─── Create Category (Admin) ────────────────────────────────────────────────
export const createCategory = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { name, description, sortOrder } = req.body;

    const category = await Category.create({
      name,
      description: description || "",
      sortOrder: sortOrder || 1,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: { category },
    });
  }
);

// ─── Update Category (Admin) ────────────────────────────────────────────────
export const updateCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, sortOrder, isActive } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category) return next(new AppError("Category not found.", 404));

    if (name) {
      category.name = name;
      category.slug = name.toLowerCase().replace(/\s+/g, "-");
    }
    if (description !== undefined) category.description = description;
    if (sortOrder !== undefined) category.sortOrder = sortOrder;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: { category },
    });
  }
);

// ─── Delete Category (Admin) ────────────────────────────────────────────────
export const deleteCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = await Category.findById(req.params.id);
    if (!category) return next(new AppError("Category not found.", 404));

    // Check if any products use this category
    const productCount = await Product.countDocuments({ category: req.params.id });
    if (productCount > 0) {
      return next(
        new AppError(
          `Cannot delete category with ${productCount} associated products.`,
          400
        )
      );
    }

    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  }
);
