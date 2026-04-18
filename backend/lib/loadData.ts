import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { Transaction } from './types';

/**
 * Loads transactions from the CSV file.
 * Uses path.join(__dirname, ...) which is reliable in Vercel serverless
 * (process.cwd() is NOT reliable in serverless environments).
 */
export function loadTransactions(): Transaction[] {
  // Try multiple path strategies for maximum reliability
  const pathCandidates = [
    path.join(__dirname, '..', 'data', 'transactions.csv'),        // relative to compiled lib/
    path.join(process.cwd(), 'data', 'transactions.csv'),          // fallback: cwd-based
    path.join(process.cwd(), 'backend', 'data', 'transactions.csv'), // monorepo fallback
  ];

  let csvContent: string | null = null;
  let usedPath = '';

  for (const candidate of pathCandidates) {
    try {
      if (fs.existsSync(candidate)) {
        csvContent = fs.readFileSync(candidate, 'utf-8');
        usedPath = candidate;
        break;
      }
    } catch {
      // Try next candidate
    }
  }

  if (!csvContent) {
    const tried = pathCandidates.join(', ');
    throw new Error(`[loadData] transactions.csv not found. Tried: ${tried}`);
  }

  const result = Papa.parse<Transaction>(csvContent, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
    transformHeader: (h) => h.trim(),
  });

  if (result.errors.length > 0) {
    console.warn('[loadData] CSV parse warnings:', result.errors.slice(0, 3));
  }

  const data = result.data.map((row) => ({
    ...row,
    price: parseFloat(String(row.price)) || 0,
  }));

  console.log(`[loadData] Loaded ${data.length} transactions from ${usedPath}`);
  return data;
}

export function getUserIds(): string[] {
  const data = loadTransactions();
  return Array.from(new Set(data.map((t) => t.user_id))).sort();
}

export function filterTransactions(
  userId?: string,
  month?: string,       // "YYYY-MM"
  category?: string
): Transaction[] {
  let data = loadTransactions();

  if (userId) data = data.filter((t) => t.user_id === userId);
  if (month) data = data.filter((t) => t.spend_date.startsWith(month));
  if (category) data = data.filter((t) => t.category === category);

  return data;
}
