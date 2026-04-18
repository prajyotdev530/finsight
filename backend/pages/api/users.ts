import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserIds } from '../../lib/loadData';
import { loadTransactions } from '../../lib/loadData';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const data = loadTransactions();
  const users = getUserIds();
  const userNames: Record<string, string> = {};
  for (const t of data) {
    if (!userNames[t.user_id]) userNames[t.user_id] = t.user_name;
  }
  res.json(users.map((id) => ({ id, name: userNames[id] || id })));
}
