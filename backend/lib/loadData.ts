import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { Transaction } from './types';

let cachedData: Transaction[] | null = null;

export function loadTransactions(): Transaction[] {
  if (cachedData) return cachedData;

  const csvPath = path.join(process.cwd(), 'data', 'transactions.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  const result = Papa.parse<Transaction>(csvContent, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
    transformHeader: (h) => h.trim(),
  });

  cachedData = result.data.map((row) => ({
    ...row,
    price: parseFloat(String(row.price)) || 0,
  }));

  return cachedData;
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
