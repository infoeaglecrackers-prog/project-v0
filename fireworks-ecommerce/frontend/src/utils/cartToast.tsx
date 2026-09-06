import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";

/**
 * The add-to-cart confirmation.
 *
 * Deliberately low-contrast: it fires on every tap of a quantity stepper, so a
 * loud success toast becomes visual noise fast. Everything is muted except the
 * quantity, which is the one thing the shopper actually needs to read back.
 *
 * CART_TOAST_CLASS is also how App.tsx knows to hide the dismiss button — at
 * 1.5s the toast is gone before anyone could aim at an X.
 */
export const CART_TOAST_CLASS = "cart-toast";

const DURATION = 1500;

/** Muted shell; only the quantity gets a bright colour. */
const SHELL =
  `${CART_TOAST_CLASS} !bg-gray-50 dark:!bg-gray-800 !text-gray-500 ` +
  `dark:!text-gray-400 !border !border-gray-200 dark:!border-gray-700 !shadow-sm`;

// A plain JSX-returning helper rather than a component: this module exports
// functions, and mixing a component declaration in trips
// react-refresh/only-export-components.
const bright = (value: React.ReactNode) => (
  <span className="font-bold text-primary">{value}</span>
);

const show = (body: React.ReactNode) =>
  toast(<span className="flex items-center gap-1.5 text-sm">{body}</span>, {
    duration: DURATION,
    className: SHELL,
    // A muted cart glyph instead of the default bright green tick.
    icon: <ShoppingCart size={15} className="text-gray-400 dark:text-gray-500 shrink-0" />,
  });

/** First time this product goes into the cart. */
export const toastAdded = (quantity: number, productName: string) =>
  show(
    <>
      {bright(quantity)}
      <span className="truncate max-w-[190px]">× {productName}</span>
      <span>added</span>
    </>
  );

/** Quantity increased on something already in the cart. */
export const toastIncreased = (delta: number, newQuantity: number) =>
  show(
    <>
      {bright(`+${delta}`)}
      <span>added · cart has</span>
      {bright(newQuantity)}
    </>
  );

/** Quantity set to a new absolute value (including decreases). */
export const toastUpdated = (newQuantity: number) =>
  show(
    <>
      <span>Cart updated to</span>
      {bright(newQuantity)}
    </>
  );

/** Stepper tapped but the cart already holds exactly that quantity. */
export const toastUnchanged = (quantity: number) =>
  show(
    <>
      <span>Already have</span>
      {bright(quantity)}
      <span>in cart</span>
    </>
  );
