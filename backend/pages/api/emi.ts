import type { NextApiRequest, NextApiResponse } from 'next';
import { filterTransactions } from '../../lib/loadData';
import { computeEMIs } from '../../lib/analytics';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { user } = req.query;
    const data = filterTransactions(user as string);
    const emis = computeEMIs(data);
    const totalEMI = emis.reduce((s, e) => s + e.amount, 0);
    res.json({ emis, totalMonthlyEMI: totalEMI });
  } catch (err: any) {
    console.error('[API /emi] Error:', err.message);
    res.status(500).json({ error: 'Failed to compute EMIs', detail: err.message });
  }
}
