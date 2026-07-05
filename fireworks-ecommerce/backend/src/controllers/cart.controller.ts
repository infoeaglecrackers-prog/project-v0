import { Request, Response, NextFunction } from "express";
import Cart from "../models/Cart";
import Product from "../models/Product";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";

// ─── Get Cart ─────────────────────────────────────────────────────────────────
export const getCart = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const cart = await Cart.findOne({ user: req.user!._id }).populate(
      "items.product",
      "name price discountPrice images stock isActive"
    );
    res.status(200).json({
      success: true,
      data: { cart: cart || { items: [], totalItems: 0, totalPrice: 0 } },
    });
  }
);

// ─── Add to Cart ──────────────────────────────────────────────────────────────
export const addToCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return next(new AppError("Product not found.", 404));
    }

    let cart = await Cart.findOne({ user: req.user!._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user!._id, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );
    const requestedQty = existingItem
      ? existingItem.quantity + quantity
      : quantity;

    if (requestedQty > product.stock) {
      return next(
        new AppError(`Insufficient stock. Only ${product.stock} left.`, 400)
      );
    }

    const unitPrice = product.discountPrice ?? product.price;

    if (existingItem) {
      existingItem.quantity = requestedQty;
      existingItem.price = unitPrice;
    } else {
      cart.items.push({ product: product._id, quantity, price: unitPrice });
    }

    await cart.save();

    const populated = await Cart.findById(cart._id).populate(
      "items.product",
      "name price discountPrice images stock"
    );
    res.status(200).json({
      success: true,
      message: "Item added to cart",
      data: { cart: populated },
    });
  }
);

// ─── Update Cart Item Qty ─────────────────────────────────────────────────────
export const updateCartItem = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { quantity } = req.body;
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) return next(new AppError("Product not found.", 404));
    if (quantity > product.stock) {
      return next(new AppError(`Insufficient stock. Only ${product.stock} left.`, 400));
    }

    const cart = await Cart.findOne({ user: req.user!._id });
    if (!cart) return next(new AppError("Cart not found.", 404));

    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) return next(new AppError("Item not in cart.", 404));

    item.quantity = quantity;
    item.price = product.discountPrice ?? product.price;
    await cart.save();

    const populated = await Cart.findById(cart._id).populate(
      "items.product",
      "name price discountPrice images stock"
    );
    res.status(200).json({
      success: true,
      message: "Cart updated",
      data: { cart: populated },
    });
  }
);

// ─── Remove from Cart ─────────────────────────────────────────────────────────
export const removeFromCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const cart = await Cart.findOne({ user: req.user!._id });
    if (!cart) return next(new AppError("Cart not found.", 404));

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== req.params.productId
    );
    await cart.save();

    const populated = await Cart.findById(cart._id).populate(
      "items.product",
      "name price discountPrice images stock"
    );
    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: { cart: populated },
    });
  }
);

// ─── Clear Cart ───────────────────────────────────────────────────────────────
export const clearCart = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    await Cart.findOneAndUpdate(
      { user: req.user!._id },
      { items: [], totalItems: 0, totalPrice: 0 }
    );
    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      data: { cart: { items: [], totalItems: 0, totalPrice: 0 } },
    });
  }
);
