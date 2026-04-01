import { useEffect, useState } from 'react';
import { WooCommerceProduct } from '@/lib/woocommerce-api';

export function useProductsPage(params = {}) {
  const [data, setData] = useState<WooCommerceProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const query = new URLSearchParams(params as Record<string, string>).toString();
    fetch(`/api/products${query ? `?${query}` : ''}`)
      .then(res => res.json())
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [JSON.stringify(params)]);

  return { data, loading, error };
}
