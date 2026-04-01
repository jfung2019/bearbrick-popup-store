import { getProducts } from '@/lib/woocommerce-api';

export async function fetchProductsPageData(params = {}) {
  return await getProducts(params);
}
