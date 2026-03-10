/**
 * Global configuration constants for the application
 */

export const APP_CONFIG = {
  // Currency settings
  currency: {
    code: "HKD",
    symbol: "HK$",
    locale: "en-HK",
  },

  // Product listing settings
  products: {
    perPage: 12,
    defaultImageSize: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  },

  // Cart settings
  cart: {
    maxQuantity: 99,
    minQuantity: 1,
    storageKey: "bearbrick-cart",
  },

  // Shipping settings
  shipping: {
    defaultCost: 0, // Will be replaced with real calculation
  },

  // Cache settings (Next.js revalidation)
  cache: {
    products: 60, // Revalidate products every 60 seconds
    product: 120, // Revalidate single product every 120 seconds
  },

  // API settings
  api: {
    timeout: 10000, // 10 seconds
    retries: 3,
  },
} as const;

export type AppConfig = typeof APP_CONFIG;
