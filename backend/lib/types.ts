export interface Transaction {
  transaction_id: string;
  user_id: string;
  user_name: string;
  spend_date: string;
  price: number;
  category: string;
  description: string;
}

export interface Monthlysummary {
  month: string; // "2023-01"
  income: number;
  expenses: number;
  savings: number;
  savingsRate: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  count: number;
}

export interface EMIRecord {
  description: string;
  amount: number;
  dayOfMonth: number;
  months: string[];
  regularity: number; // 0-100%
}

export interface Anomaly {
  transaction_id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  expectedMax: number;
  severity: 'high' | 'medium';
}

export interface Subscription {
  name: string;
  amount: number;
  months: string[];
  dayOfMonth: number;
  category: string;
}

export interface HealthScore {
  overall: number;         // 0-100
  savingsScore: number;
  debtScore: number;
  disciplineScore: number;
  creditEstimate: number;  // 300-850
  label: 'Excellent' | 'Good' | 'Fair' | 'Poor';
}

export interface Prediction {
  projectedSavings: number;
  dailyBurnRate: number;
  daysUntilZero: number | null;
  currentMonthExpenseForecast: number;
}
