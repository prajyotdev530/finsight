import type { NextApiRequest, NextApiResponse } from 'next';
import { filterTransactions } from '../../lib/loadData';
import { computeCategoryBreakdown } from '../../lib/analytics';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { user, month } = req.query;
  const data = filterTransactions(user as string, month as string);
  const breakdown = computeCategoryBreakdown(data);
  res.json(breakdown);
}
