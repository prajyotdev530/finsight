import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const BUDGET_FILE = path.join(process.cwd(), 'budgets.json');

function readBudgets(): Record<string, Record<string, number>> {
  try {
    return JSON.parse(fs.readFileSync(BUDGET_FILE, 'utf-8'));
  } catch {
    return {};
  }
}

function saveBudgets(data: Record<string, Record<string, number>>) {
  fs.writeFileSync(BUDGET_FILE, JSON.stringify(data, null, 2));
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { user } = req.query;

  if (req.method === 'GET') {
    const budgets = readBudgets();
    return res.json(budgets[user as string] || {});
  }

  if (req.method === 'POST') {
    const { category, limit } = req.body;
    const budgets = readBudgets();
    if (!budgets[user as string]) budgets[user as string] = {};
    budgets[user as string][category] = limit;
    saveBudgets(budgets);
    return res.json({ success: true });
  }

  res.status(405).end();
}
