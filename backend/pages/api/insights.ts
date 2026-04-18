import type { NextApiRequest, NextApiResponse } from 'next';
import { filterTransactions } from '../../lib/loadData';
import {
  detectAnomalies,
  detectSubscriptions,
  computePredictions,
  computeHealthScore,
} from '../../lib/analytics';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { user } = req.query;
  const data = filterTransactions(user as string);

  res.json({
    anomalies: detectAnomalies(data),
    subscriptions: detectSubscriptions(data),
    predictions: computePredictions(data),
    healthScore: computeHealthScore(data),
  });
}
