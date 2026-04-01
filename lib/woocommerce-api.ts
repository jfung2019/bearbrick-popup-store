// WooCommerce REST API client setup and product fetcher using @woocommerce/woocommerce-rest-api
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';

// Types for WooCommerce products
export type WooCommerceProductCategory = {
  id: number;
  name: string;
  slug: string;
};

export type WooCommerceProduct = {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price: string;
  sale_price: string;
  images: Array<{ id: number; src: string; alt: string }>;
  stock_status: string;
  categories: WooCommerceProductCategory[];
};

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WORDPRESS_URL || '',
  consumerKey: process.env.WC_CONSUMER_KEY || '',
  consumerSecret: process.env.WC_CONSUMER_SECRET || '',
  version: 'wc/v3',
  queryStringAuth: true, // Required for HTTP, set to false if using HTTPS
});

export async function getProducts(params = {}) {
  try {
    const { data } = await api.get('products', params);
    return data;
  } catch (error) {
    // You can add more detailed error handling/logging here
    throw new Error(
       // @ts-ignore
      'WooCommerce API error: ' + (error.response?.data?.message || error.message)
    );
  }
}
