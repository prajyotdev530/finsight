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
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { user } = req.query;
    const data = filterTransactions(user as string);

    res.json({
      anomalies: detectAnomalies(data),
      subscriptions: detectSubscriptions(data),
      predictions: computePredictions(data),
      healthScore: computeHealthScore(data),
    });
  } catch (err: any) {
    console.error('[API /insights] Error:', err.message);
    res.status(500).json({ error: 'Failed to compute insights', detail: err.message });
  }
}
