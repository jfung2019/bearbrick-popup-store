import { getProducts } from '@/server/woocommerce';

export async function fetchProductsPageData(params = {}) {
  return await getProducts(params);
}
