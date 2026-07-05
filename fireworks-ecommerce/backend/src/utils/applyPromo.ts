import Promo, { IPromo } from "../models/Promo";
import AppError from "./AppError";

interface PromoResult {
  promo: IPromo | null;
  discountAmount: number;
}

// Looks up the promo code fresh from the DB and validates it against the
// current cart value — never trust a discount % passed in from the client.
export const resolvePromoDiscount = async (
  promoCode: string | undefined,
  itemsPrice: number
): Promise<PromoResult> => {
  if (!promoCode) return { promo: null, discountAmount: 0 };

  const promo = await Promo.findOne({ code: promoCode.trim().toUpperCase() });

  if (!promo || !promo.isActive) {
    throw new AppError("Promo code is invalid.", 400);
  }
  if (promo.expiresAt && promo.expiresAt < new Date()) {
    throw new AppError("Promo code has expired.", 400);
  }
  if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
    throw new AppError("Promo code usage limit reached.", 400);
  }
  if (itemsPrice < promo.minOrderValue) {
    throw new AppError(`Minimum order value for this promo is ₹${promo.minOrderValue}.`, 400);
  }

  const discountAmount = Math.round(itemsPrice * (promo.discountPercent / 100) * 100) / 100;
  return { promo, discountAmount };
};
