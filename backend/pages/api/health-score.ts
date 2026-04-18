import type { NextApiRequest, NextApiResponse } from 'next';
import { filterTransactions } from '../../lib/loadData';
import { computeHealthScore } from '../../lib/analytics';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { user } = req.query;
  const data = filterTransactions(user as string);
  const score = computeHealthScore(data);
  res.json(score);
}
