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

    // Product lookup and cart lookup don't depend on each other — run them
    // concurrently instead of back-to-back round trips.
    const [product, existingCart] = await Promise.all([
      Product.findById(productId).select("_id name price discountPrice images stock isActive"),
      Cart.findOne({ user: req.user!._id }),
    ]);
    if (!product || !product.isActive) {
      return next(new AppError("Product not found.", 404));
    }

    const cart = existingCart ?? new Cart({ user: req.user!._id, items: [] });

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

    // Populate the in-memory doc we already have instead of re-fetching the
    // cart from scratch — saves a full DB round trip on the hot path.
    await cart.populate("items.product", "name price discountPrice images stock");

    res.status(200).json({
      success: true,
      message: "Item added to cart",
      data: { cart },
    });
  }
);

// ─── Update Cart Item Qty ─────────────────────────────────────────────────────
export const updateCartItem = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { quantity } = req.body;
    const { productId } = req.params;

    if (quantity < 0) {
      return next(new AppError("Quantity cannot be negative.", 400));
    }

    const [product, cart] = await Promise.all([
      Product.findById(productId).select("_id stock price discountPrice"),
      Cart.findOne({ user: req.user!._id }),
    ]);
    if (!product) return next(new AppError("Product not found.", 404));
    if (quantity > 0 && quantity > product.stock) {
      return next(new AppError(`Insufficient stock. Only ${product.stock} left.`, 400));
    }
    if (!cart) return next(new AppError("Cart not found.", 404));

    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) return next(new AppError("Item not in cart.", 404));

    if (quantity === 0) {
      // 0 means "unselect it" — drop the line instead of erroring.
      cart.items = cart.items.filter((i) => i.product.toString() !== productId);
    } else {
      item.quantity = quantity;
      item.price = product.discountPrice ?? product.price;
    }
    await cart.save();

    await cart.populate("items.product", "name price discountPrice images stock");
    res.status(200).json({
      success: true,
      message: "Cart updated",
      data: { cart },
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

    await cart.populate("items.product", "name price discountPrice images stock");
    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: { cart },
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
