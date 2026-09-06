import { apiCache } from "./apiCache";

export const invalidateCache = {
  products: () => {
    apiCache.clear("products_featured");
    apiCache.clear("products_bestsellers");
  },
  productList: (filters?: any) => {
    if (filters) {
      apiCache.clear(`products_${JSON.stringify(filters)}`);
    } else {
      const cacheKeys = Array.from((apiCache as any).cache.keys());
      cacheKeys.forEach(key => {
        if (key.startsWith("products_") && !key.includes("featured") && !key.includes("bestsellers")) {
          apiCache.clear(key);
        }
      });
    }
  },
  product: (id: string) => {
    apiCache.clear(`product_${id}`);
  },
  categories: () => {
    apiCache.clear("categories_all");
  },
  category: (id: string) => {
    apiCache.clear(`category_${id}`);
  },
  dropPoints: () => {
    const cacheKeys = Array.from((apiCache as any).cache.keys());
    cacheKeys.forEach(key => {
      if (key.startsWith("drop_points_")) {
        apiCache.clear(key);
      }
    });
  },
  userProfile: () => {
    apiCache.clear("user_profile");
  },
  reviews: (productId?: string) => {
    if (productId) {
      const cacheKeys = Array.from((apiCache as any).cache.keys());
      cacheKeys.forEach(key => {
        if (key.startsWith(`reviews_product_${productId}`)) {
          apiCache.clear(key);
        }
      });
    } else {
      const cacheKeys = Array.from((apiCache as any).cache.keys());
      cacheKeys.forEach(key => {
        if (key.startsWith("reviews_")) {
          apiCache.clear(key);
        }
      });
    }
  },
  all: () => {
    apiCache.clear();
  },
};
