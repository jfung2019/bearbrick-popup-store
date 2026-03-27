const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

/**
 * Maps next-intl locale codes to WP Multilang language codes.
 * WP Multilang uses short ISO codes (e.g. [:tw], [:ja]) as set in
 * Settings → WP Multilang in the WordPress admin.
 */
export const WP_LANG_MAP: Record<string, string> = {
  en: "en",
  "zh-hant": "tw",
  "zh-hans": "zh",
  ja: "ja",
  ko: "ko",
};

/** Returns the WP Multilang lang code for a given next-intl locale. */
export function toWpLang(locale: string): string {
  return WP_LANG_MAP[locale] ?? "en";
}

/**
 * Parses WP Multilang inline translation markers.
 * WP Multilang stores content as: [:en]English[:tw]中文[:]  
 * This is needed for headless/SSR setups where the lang query param
 * causes WP Multilang to filter out products with translated content.
 *
 * Falls back to English if the requested language has no translation,
 * then strips all markers if no language block is found at all.
 */
export function parseWpMultilang(content: string, lang: string): string {
  if (!content || !content.includes("[:")) return content;

  // Try requested language first
  const langMatch = content.match(
    new RegExp(`\\[:${lang}\\]([\\s\\S]*?)(?=\\[:|$)`, "i")
  );
  if (langMatch?.[1]?.trim()) return langMatch[1].trim();

  // Fall back to English
  const enMatch = content.match(/\[:en\]([\s\S]*?)(?=\[:|$)/i);
  if (enMatch?.[1]?.trim()) return enMatch[1].trim();

  // Strip all markers as last resort
  return content.replace(/\[:[^\]]*\]/g, "").trim();
}

export type WooCommerceProduct = {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price: string;
  sale_price: string;
  images: Array<{ id: number; src: string; alt: string }>;
  stock_status: string;
};

type WooCommerceQuery = Record<string, string | number | boolean | undefined>;

function getBaseUrl() {
  if (!WORDPRESS_URL) {
    throw new Error("NEXT_PUBLIC_WORDPRESS_URL is not configured");
  }

  return `${WORDPRESS_URL.replace(/\/$/, "")}/wp-json/wc/v3`;
}

function getAuthHeader() {
  if (!WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
    throw new Error("WC_CONSUMER_KEY or WC_CONSUMER_SECRET is not configured");
  }

  const encoded = Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString(
    "base64"
  );

  return `Basic ${encoded}`;
}

function buildQueryParams(query?: WooCommerceQuery) {
  const params = new URLSearchParams();

  if (!query) {
    return params.toString();
  }

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) {
      params.set(key, String(value));
    }
  }

  return params.toString();
}

export async function wooCommerceFetch<T>(
  endpoint: string,
  options?: {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    query?: WooCommerceQuery;
    body?: unknown;
    revalidate?: number;
  }
): Promise<T> {
  const queryString = buildQueryParams(options?.query);
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/${endpoint.replace(/^\//, "")}${
    queryString ? `?${queryString}` : ""
  }`;

  const response = await fetch(url, {
    method: options?.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: getAuthHeader(),
    },
    body: options?.body ? JSON.stringify(options.body) : undefined,
    next: options?.revalidate ? { revalidate: options.revalidate } : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`WooCommerce request failed (${response.status}): ${errorText}`);
  }

  return (await response.json()) as T;
}

export async function getProducts(query?: WooCommerceQuery) {
  return wooCommerceFetch<WooCommerceProduct[]>("products", {
    query,
    revalidate: 60,
  });
}

/**
 * Fetches products with correct localised names for headless WP Multilang setups.
 *
 * WP Multilang strips inline markers and returns the default language when no
 * `lang` param is set, so we can't rely on client-side marker parsing.
 * Instead we fetch twice:
 *   1. Without lang  → every product in the default language (en)
 *   2. With lang=XX  → only translated products, but with the correct names
 * Then we merge by product ID so untranslated products still appear (in English)
 * while translated ones show the correct localised name/description.
 */
export async function getProductsLocalized(
  locale: string,
  query?: WooCommerceQuery
): Promise<WooCommerceProduct[]> {
  const lang = toWpLang(locale);
  const allProducts = await getProducts(query);

  if (lang === "en") return allProducts;

  try {
    const translatedProducts = await getProducts({ ...query, lang });
    const translatedMap = new Map(translatedProducts.map((p) => [p.id, p]));
    // Prefer translated version; fall back to default-language version
    return allProducts.map((p) => translatedMap.get(p.id) ?? p);
  } catch {
    return allProducts;
  }
}

export async function getProductBySlug(slug: string) {
  const products = await wooCommerceFetch<WooCommerceProduct[]>("products", {
    query: { slug },
    revalidate: 60,
  });

  return products[0] ?? null;
}
