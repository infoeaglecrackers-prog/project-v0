export const ORDER_STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Refunded"] as const;

export const ORDER_STATUS_COLORS: Record<string, string> = {
  Pending: "yellow",
  pending: "yellow",
  confirmed: "blue",
  Confirmed: "blue",
  Processing: "blue",
  processing: "blue",
  Shipped: "purple",
  shipped: "purple",
  Delivered: "green",
  delivered: "green",
  Cancelled: "red",
  cancelled: "red",
  Refunded: "gray",
  refunded: "gray",
};

export const PAYMENT_STATUS_COLORS: Record<string, string> = {
  pending: "yellow",
  paid: "green",
  failed: "red",
  refunded: "gray",
};

export const SORT_OPTIONS = [
  { label: "Newest First", value: "-createdAt" },
  { label: "Price: Low to High", value: "price" },
  { label: "Price: High to Low", value: "-price" },
  { label: "Best Rated", value: "-ratings" },
  { label: "Best Sellers", value: "-sold" },
];

export const ITEMS_PER_PAGE = 12;
export const ADMIN_ITEMS_PER_PAGE = 10;
