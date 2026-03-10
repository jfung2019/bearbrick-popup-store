const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

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

export async function getProductBySlug(slug: string) {
  const products = await wooCommerceFetch<WooCommerceProduct[]>("products", {
    query: { slug },
    revalidate: 60,
  });

  return products[0] ?? null;
}
