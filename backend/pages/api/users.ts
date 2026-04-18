import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserIds, loadTransactions } from '../../lib/loadData';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const data = loadTransactions();
    const users = getUserIds();
    const userNames: Record<string, string> = {};
    for (const t of data) {
      if (!userNames[t.user_id]) userNames[t.user_id] = t.user_name;
    }
    res.json(users.map((id) => ({ id, name: userNames[id] || id })));
  } catch (err: any) {
    console.error('[API /users] Error:', err.message);
    res.status(500).json({ error: 'Failed to load users', detail: err.message });
  }
}
