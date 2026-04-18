import {
  Transaction,
  Monthlysummary,
  CategoryBreakdown,
  EMIRecord,
  Anomaly,
  Subscription,
  HealthScore,
  Prediction,
} from './types';

// ─── Helpers ────────────────────────────────────────────────────

function getMonth(date: string) {
  return date.substring(0, 7); // "YYYY-MM"
}

function mean(arr: number[]) {
  return arr.reduce((s, v) => s + v, 0) / (arr.length || 1);
}

function std(arr: number[]) {
  const m = mean(arr);
  return Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / (arr.length || 1));
}

// ─── Cash Flow / Summary ─────────────────────────────────────────

export function computeCashFlow(transactions: Transaction[]): Monthlysummary[] {
  const byMonth: Record<string, { income: number; expenses: number }> = {};

  for (const t of transactions) {
    const m = getMonth(t.spend_date);
    if (!byMonth[m]) byMonth[m] = { income: 0, expenses: 0 };
    if (t.category === 'Income') {
      byMonth[m].income += t.price;
    } else {
      byMonth[m].expenses += t.price;
    }
  }

  return Object.entries(byMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, { income, expenses }]) => {
      const savings = income - expenses;
      return {
        month,
        income,
        expenses,
        savings,
        savingsRate: income > 0 ? Math.round((savings / income) * 100) : 0,
      };
    });
}

// ─── Category Breakdown ──────────────────────────────────────────

export function computeCategoryBreakdown(
  transactions: Transaction[]
): CategoryBreakdown[] {
  const spend = transactions.filter((t) => t.category !== 'Income');
  const totals: Record<string, { amount: number; count: number }> = {};
  let grandTotal = 0;

  for (const t of spend) {
    if (!totals[t.category]) totals[t.category] = { amount: 0, count: 0 };
    totals[t.category].amount += t.price;
    totals[t.category].count += 1;
    grandTotal += t.price;
  }

  return Object.entries(totals)
    .map(([category, { amount, count }]) => ({
      category,
      amount,
      count,
      percentage: grandTotal > 0 ? Math.round((amount / grandTotal) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
}

// ─── EMI Tracking ────────────────────────────────────────────────

export function computeEMIs(transactions: Transaction[]): EMIRecord[] {
  const emis = transactions.filter((t) => t.category === 'EMI');
  const groups: Record<string, EMIRecord> = {};

  for (const t of emis) {
    const key = `${t.description}__${t.price}`;
    const dayOfMonth = parseInt(t.spend_date.split('-')[2]);
    const month = getMonth(t.spend_date);

    if (!groups[key]) {
      groups[key] = {
        description: t.description,
        amount: t.price,
        dayOfMonth,
        months: [],
        regularity: 0,
      };
    }
    if (!groups[key].months.includes(month)) {
      groups[key].months.push(month);
    }
  }

  // Compute regularity
  const allMonths = Array.from(new Set(transactions.map((t) => getMonth(t.spend_date))));

  return Object.values(groups).map((emi) => ({
    ...emi,
    regularity: Math.round((emi.months.length / allMonths.length) * 100),
  }));
}

// ─── Subscription Detection ──────────────────────────────────────

export function detectSubscriptions(transactions: Transaction[]): Subscription[] {
  const subs = transactions.filter((t) => t.category === 'Subscription');
  const groups: Record<string, Subscription> = {};

  for (const t of subs) {
    const key = `${t.description}__${t.price}`;
    const month = getMonth(t.spend_date);
    const dayOfMonth = parseInt(t.spend_date.split('-')[2]);

    if (!groups[key]) {
      groups[key] = {
        name: t.description,
        amount: t.price,
        months: [],
        dayOfMonth,
        category: t.category,
      };
    }
    if (!groups[key].months.includes(month)) {
      groups[key].months.push(month);
    }
  }

  return Object.values(groups).filter((s) => s.months.length >= 2);
}

// ─── Anomaly Detection ───────────────────────────────────────────

export function detectAnomalies(transactions: Transaction[]): Anomaly[] {
  const spend = transactions.filter(
    (t) => t.category !== 'Income' && t.category !== 'EMI' && t.category !== 'Subscription'
  );

  // Build per-category stats
  const categoryAmounts: Record<string, number[]> = {};
  for (const t of spend) {
    if (!categoryAmounts[t.category]) categoryAmounts[t.category] = [];
    categoryAmounts[t.category].push(t.price);
  }

  const anomalies: Anomaly[] = [];

  for (const t of spend) {
    const amounts = categoryAmounts[t.category] || [];
    if (amounts.length < 5) continue;

    const m = mean(amounts);
    const s = std(amounts);
    const threshold = m + 2 * s;

    if (t.price > threshold) {
      anomalies.push({
        transaction_id: t.transaction_id,
        date: t.spend_date,
        description: t.description,
        category: t.category,
        amount: t.price,
        expectedMax: Math.round(threshold),
        severity: t.price > m + 3 * s ? 'high' : 'medium',
      });
    }
  }

  return anomalies.sort((a, b) => b.amount - a.amount);
}

// ─── Health Score ────────────────────────────────────────────────

export function computeHealthScore(
  transactions: Transaction[]
): HealthScore {
  const cashflow = computeCashFlow(transactions);
  if (!cashflow.length) {
    return { overall: 0, savingsScore: 0, debtScore: 0, disciplineScore: 0, creditEstimate: 300, label: 'Poor' };
  }

  const avgSavingsRate = mean(cashflow.map((m) => m.savingsRate));
  const totalIncome = cashflow.reduce((s, m) => s + m.income, 0);
  const totalExpenses = cashflow.reduce((s, m) => s + m.expenses, 0);
  const emis = computeEMIs(transactions);
  const totalEMI = emis.reduce((s, e) => s + e.amount, 0);
  const avgMonthlyIncome = mean(cashflow.map((m) => m.income));
  const debtRatio = avgMonthlyIncome > 0 ? (totalEMI / avgMonthlyIncome) * 100 : 100;

  // Spending discipline: how consistent is monthly spend
  const expenseStdDev = std(cashflow.map((m) => m.expenses));
  const expenseMean = mean(cashflow.map((m) => m.expenses));
  const coefficientOfVariation = expenseMean > 0 ? (expenseStdDev / expenseMean) * 100 : 100;

  // Scores 0-100
  const savingsScore = Math.min(100, Math.max(0, avgSavingsRate * 2));
  const debtScore = Math.min(100, Math.max(0, 100 - debtRatio * 1.5));
  const disciplineScore = Math.min(100, Math.max(0, 100 - coefficientOfVariation));

  const overall = Math.round(0.4 * savingsScore + 0.35 * debtScore + 0.25 * disciplineScore);

  // Credit score estimate 300-850
  const emiRegularity = emis.length > 0 ? mean(emis.map((e) => e.regularity)) : 100;
  const incomeStability = Math.max(0, 100 - coefficientOfVariation);
  const creditRaw = (emiRegularity * 0.5 + incomeStability * 0.3 + savingsScore * 0.2) / 100;
  const creditEstimate = Math.round(300 + creditRaw * 550);

  const label =
    overall >= 80 ? 'Excellent' : overall >= 60 ? 'Good' : overall >= 40 ? 'Fair' : 'Poor';

  return {
    overall,
    savingsScore: Math.round(savingsScore),
    debtScore: Math.round(debtScore),
    disciplineScore: Math.round(disciplineScore),
    creditEstimate,
    label,
  };
}

// ─── Predictions ─────────────────────────────────────────────────

export function computePredictions(transactions: Transaction[]): Prediction {
  const cashflow = computeCashFlow(transactions);
  if (cashflow.length < 2) {
    return { projectedSavings: 0, dailyBurnRate: 0, daysUntilZero: null, currentMonthExpenseForecast: 0 };
  }

  // Use last 3 months for burn rate
  const recent = cashflow.slice(-3);
  const avgMonthlyExpense = mean(recent.map((m) => m.expenses));
  const avgMonthlyIncome = mean(recent.map((m) => m.income));
  const dailyBurnRate = avgMonthlyExpense / 30;

  // Current month
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const currentData = cashflow.find((m) => m.month === currentMonth);

  let daysUntilZero: number | null = null;
  let currentMonthExpenseForecast = avgMonthlyExpense;
  let projectedSavings = avgMonthlyIncome - avgMonthlyExpense;

  if (currentData) {
    const dayOfMonth = now.getDate();
    const daysRemaining = 30 - dayOfMonth;
    const projectedRemainingExpense = dailyBurnRate * daysRemaining;
    currentMonthExpenseForecast = currentData.expenses + projectedRemainingExpense;
    projectedSavings = currentData.income - currentMonthExpenseForecast;

    if (currentData.savings < 0) {
      daysUntilZero = Math.round(Math.abs(currentData.savings) / dailyBurnRate);
    }
  }

  return {
    projectedSavings: Math.round(projectedSavings),
    dailyBurnRate: Math.round(dailyBurnRate),
    daysUntilZero,
    currentMonthExpenseForecast: Math.round(currentMonthExpenseForecast),
  };
}
