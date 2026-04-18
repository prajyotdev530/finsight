import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend, Cell
} from 'recharts';
import { useUserStore } from '../store/userStore';
import { api } from '../api/client';
import Header from '../components/Header';
import { motion } from 'framer-motion';

const fmt = (v: number) => `₹${(v / 1000).toFixed(0)}k`;

const DarkTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#0A0A0A', borderRadius: 12, padding: '10px 14px',
      fontSize: '0.8rem', boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
    }}>
      <div style={{ fontWeight: 600, color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 4 }}>
          <span style={{ color: p.color, fontWeight: 600, fontSize: '0.78rem' }}>{p.name}</span>
          <span style={{ color: 'white', fontWeight: 800 }}>₹{Number(p.value).toLocaleString('en-IN')}</span>
        </div>
      ))}
    </div>
  );
};

const CAT_COLORS: Record<string, string> = {
  Food: '#F59E0B', Utilities: '#3B82F6', Transport: '#8B5CF6',
  Entertainment: '#EC4899', Shopping: '#6366F1', EMI: '#EF4444', Subscription: '#14B8A6',
};
const DEFAULT_COLORS = ['#6366F1','#8B5CF6','#EF4444','#3B82F6','#F59E0B','#00C853','#EC4899'];

export default function Analytics() {
  const { selectedUser } = useUserStore();
  const [cashflow, setCashflow] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = () => {
    setLoading(true);
    setError(null);
    Promise.all([api.cashflow(selectedUser), api.categories(selectedUser)])
      .then(([cf, cat]) => { setCashflow(cf.data); setCategories(cat.data); })
      .catch((err) => {
        console.error('[Analytics] Failed to load data:', err);
        setError('Unable to load analytics. The server may be warming up — please try again.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [selectedUser]);

  const chartData = cashflow.map(d => ({
    ...d,
    month: new Date(d.month + '-01').toLocaleString('default', { month: 'short', year: '2-digit' })
  }));

  const avgSavingsRate = cashflow.length
    ? Math.round(cashflow.reduce((s, m) => s + m.savingsRate, 0) / cashflow.length)
    : 0;

  return (
    <div>
      <Header title="Analytics" subtitle="12 months of spending patterns" />
      <div className="page-body">
        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : error ? (
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <div className="error-message">{error}</div>
            <button className="btn btn-primary" onClick={fetchData} id="analytics-retry">Retry</button>
          </div>
        ) : (
          <>
            {/* Hero stat pills */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
              <div className="stat-pill">📈 Avg Savings Rate: <strong style={{ color: '#00C853', marginLeft: 4 }}>{avgSavingsRate}%</strong></div>
              <div className="stat-pill">📅 {cashflow.length} months tracked</div>
            </div>

            {/* Savings Trend */}
            <motion.div className="card full-width" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <div className="card-header">
                <div>
                  <div className="card-title">Monthly Savings Trend</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>Savings vs Income over time</div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 500 }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={fmt} tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 500 }} axisLine={false} tickLine={false} width={44} />
                  <Tooltip content={<DarkTooltip />} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '0.75rem' }} />
                  <Line type="monotone" dataKey="savings" stroke="#00C853" strokeWidth={2.5} dot={{ r: 3, fill: '#00C853', stroke: 'white', strokeWidth: 1.5 }} name="Savings (₹)" activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="income" stroke="#E5E7EB" strokeWidth={1.5} strokeDasharray="5 5" dot={false} name="Income (₹)" />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Income vs Expenses */}
            <motion.div className="card full-width" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="card-header">
                <div>
                  <div className="card-title">Income vs Expenses</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>Month by month comparison</div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={chartData} barGap={3} barCategoryGap="35%">
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 500 }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={fmt} tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 500 }} axisLine={false} tickLine={false} width={44} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="income"   fill="#00C853" radius={[5,5,0,0]} name="Income" />
                  <Bar dataKey="expenses" fill="#0A0A0A" radius={[5,5,0,0]} name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Category horizontal bars */}
            <motion.div className="card full-width" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="card-header">
                <div className="card-title">Category Breakdown</div>
              </div>
              <ResponsiveContainer width="100%" height={Math.max(200, categories.length * 44)}>
                <BarChart data={categories} layout="vertical" margin={{ left: 90, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tickFormatter={fmt} tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 500 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="category" tick={{ fontSize: 12, fill: '#374151', fontWeight: 500 }} axisLine={false} tickLine={false} width={90} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="amount" radius={[0,6,6,0]} name="Amount">
                    {categories.map((entry, i) => (
                      <Cell key={i} fill={CAT_COLORS[entry.category] || DEFAULT_COLORS[i % DEFAULT_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
