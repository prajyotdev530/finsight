import type { NextApiRequest, NextApiResponse } from 'next';
import { filterTransactions } from '../../lib/loadData';
import { computeCategoryBreakdown } from '../../lib/analytics';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { user, month } = req.query;
    const data = filterTransactions(user as string, month as string);
    const breakdown = computeCategoryBreakdown(data);
    res.json(breakdown);
  } catch (err: any) {
    console.error('[API /categories] Error:', err.message);
    res.status(500).json({ error: 'Failed to compute categories', detail: err.message });
  }
}
