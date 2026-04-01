import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchProductsPageData } from '@/app/[locale]/products/actions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const data = await fetchProductsPageData(req.query);
  res.status(200).json(data);
}
