import type { NextApiRequest, NextApiResponse } from 'next';
import { filterTransactions } from '../../lib/loadData';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { user, month, category, page = '1', limit = '50' } = req.query;

  const data = filterTransactions(
    user as string,
    month as string,
    category as string
  );

  const pageNum = parseInt(page as string);
  const pageSize = parseInt(limit as string);
  const start = (pageNum - 1) * pageSize;
  const paginated = data.slice(start, start + pageSize);

  res.json({
    total: data.length,
    page: pageNum,
    pageSize,
    data: paginated,
  });
}
