import type { NextApiRequest, NextApiResponse } from 'next';
import { filterTransactions } from '../../lib/loadData';
import { computeEMIs } from '../../lib/analytics';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { user } = req.query;
  const data = filterTransactions(user as string);
  const emis = computeEMIs(data);
  const totalEMI = emis.reduce((s, e) => s + e.amount, 0);
  res.json({ emis, totalMonthlyEMI: totalEMI });
}
