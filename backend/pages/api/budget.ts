import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import os from 'os';

/**
 * Budget API — uses /tmp for writes in serverless (Vercel's filesystem is read-only).
 * Falls back to cwd-based path for local development.
 */
function getBudgetPath(): string {
  // In production/serverless, use /tmp (the only writable directory)
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    return path.join(os.tmpdir(), 'budgets.json');
  }
  return path.join(process.cwd(), 'budgets.json');
}

function readBudgets(): Record<string, Record<string, number>> {
  try {
    const budgetPath = getBudgetPath();
    if (fs.existsSync(budgetPath)) {
      return JSON.parse(fs.readFileSync(budgetPath, 'utf-8'));
    }
    // Also try cwd as fallback to load initial seed data
    const cwdPath = path.join(process.cwd(), 'budgets.json');
    if (fs.existsSync(cwdPath)) {
      return JSON.parse(fs.readFileSync(cwdPath, 'utf-8'));
    }
    return {};
  } catch {
    return {};
  }
}

function saveBudgets(data: Record<string, Record<string, number>>) {
  try {
    fs.writeFileSync(getBudgetPath(), JSON.stringify(data, null, 2));
  } catch (err) {
    console.warn('[budget] Could not write budgets (serverless?)', err);
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
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
  } catch (err: any) {
    console.error('[API /budget] Error:', err.message);
    res.status(500).json({ error: 'Budget operation failed', detail: err.message });
  }
}
