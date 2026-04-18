import { useEffect, useState } from 'react';
import { useUserStore } from '../store/userStore';
import { api } from '../api/client';
import Header from '../components/Header';
import KPICard from '../components/KPICard';
import CashFlowChart from '../components/CashFlowChart';
import CategoryPieChart from '../components/CategoryPieChart';
import AnomalyFeed from '../components/AnomalyFeed';
import PredictiveInsights from '../components/PredictiveInsights';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function Dashboard() {
  const { selectedUser } = useUserStore();
  const [cashflow, setCashflow] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = () => {
    setLoading(true);
    setError(null);
    Promise.all([
      api.cashflow(selectedUser),
      api.categories(selectedUser),
      api.insights(selectedUser),
    ]).then(([cf, cat, ins]) => {
      setCashflow(cf.data);
      setCategories(cat.data);
      setInsights(ins.data);
    }).catch((err) => {
      console.error('[Dashboard] Failed to load data:', err);
      setError('Unable to load dashboard data. The server may be warming up — please try again.');
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [selectedUser]);

  const latest = cashflow[cashflow.length - 1];
  const prev   = cashflow[cashflow.length - 2];
  const income   = latest?.income   ?? 0;
  const expenses = latest?.expenses  ?? 0;
  const savings  = latest?.savings   ?? 0;
  const rate     = latest?.savingsRate ?? 0;
  const hs       = insights?.healthScore ?? {};
  const topCat   = categories[0];

  const pctChange = (curr: number, prev: number) =>
    prev > 0 ? `${((curr - prev) / prev * 100).toFixed(0)}% vs last month` : '';

  return (
    <div>
      <Header title="Overview" subtitle={`Your financial snapshot · ${new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}`} />
      <div className="page-body">
        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : error ? (
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <div className="error-message">{error}</div>
            <button className="btn btn-primary" onClick={fetchData} id="dashboard-retry">Retry</button>
          </div>
        ) : (
          <>
            {insights?.predictions && <PredictiveInsights predictions={insights.predictions} />}

            {/* KPI Row */}
            <div className="kpi-grid">
              <KPICard
                label="Monthly Income"
                value={`₹${income.toLocaleString('en-IN')}`}
                sub={pctChange(income, prev?.income)}
                badge={prev ? `${prev?.income > income ? '↓' : '↑'} vs last month` : undefined}
                badgeType={income >= (prev?.income ?? 0) ? 'up' : 'down'}
                color="green"
                icon="💵"
                delay={0}
              />
              <KPICard
                label="Total Expenses"
                value={`₹${expenses.toLocaleString('en-IN')}`}
                sub={pctChange(expenses, prev?.expenses)}
                badge={prev ? pctChange(expenses, prev.expenses) : undefined}
                badgeType={expenses <= (prev?.expenses ?? Infinity) ? 'up' : 'down'}
                color="dark"
                icon="💸"
                delay={0.06}
              />
              <KPICard
                label="Net Savings"
                value={`₹${savings.toLocaleString('en-IN')}`}
                sub={`${rate}% savings rate`}
                badgeType={rate >= 30 ? 'up' : rate >= 15 ? 'neutral' : 'down'}
                badge={rate >= 30 ? 'Excellent rate' : rate >= 15 ? 'Moderate' : 'Low savings'}
                color="white"
                icon="🏦"
                delay={0.12}
              />
              <KPICard
                label="Health Score"
                value={String(hs.overall ?? '--')}
                sub={hs.label || ''}
                badge={`Credit ~${hs.creditEstimate}`}
                badgeType={hs.overall >= 70 ? 'up' : hs.overall >= 50 ? 'neutral' : 'down'}
                color="white"
                icon="❤️"
                delay={0.18}
              />
              {topCat && (
                <KPICard
                  label="Top Spend"
                  value={topCat.category}
                  sub={`₹${topCat.amount.toLocaleString('en-IN')} · all time`}
                  badge={`${topCat.percentage}% of spend`}
                  badgeType="neutral"
                  color="white"
                  icon="📊"
                  delay={0.24}
                />
              )}
            </div>

            {/* Charts row */}
            <div className="chart-grid">
              <CashFlowChart data={cashflow} />
              <CategoryPieChart data={categories} />
            </div>

            {/* Anomaly Feed */}
            <AnomalyFeed anomalies={insights?.anomalies || []} />
          </>
        )}
      </div>
    </div>
  );
}
