import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';

interface Props {
  data: Array<{ month: string; income: number; expenses: number; savings: number }>;
}

const fmt = (v: number) => `₹${(v / 1000).toFixed(0)}k`;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#0A0A0A',
      borderRadius: 12,
      padding: '12px 16px',
      fontSize: '0.8rem',
      boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
      border: 'none',
      minWidth: 160,
    }}>
      <div style={{ fontWeight: 700, marginBottom: 10, color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 5 }}>
          <span style={{ color: p.color, fontSize: '0.78rem', fontWeight: 600 }}>{p.name}</span>
          <span style={{ color: 'white', fontWeight: 800, fontSize: '0.88rem' }}>₹{Number(p.value).toLocaleString('en-IN')}</span>
        </div>
      ))}
    </div>
  );
};

export default function CashFlowChart({ data }: Props) {
  const formatted = data.map(d => ({
    ...d,
    month: new Date(d.month + '-01').toLocaleString('default', { month: 'short', year: '2-digit' })
  }));

  return (
    <motion.div
      className="card chart-container"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="card-header">
        <div>
          <div className="card-title">Cash Flow</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>Income vs Expenses over 12 months</div>
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: '0.75rem', fontWeight: 600 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: '#00C853', display: 'inline-block' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Income</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: '#EF4444', display: 'inline-block' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Expenses</span>
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={formatted} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
          <defs>
            <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="10%" stopColor="#00C853" stopOpacity={0.18} />
              <stop offset="95%" stopColor="#00C853" stopOpacity={0.01} />
            </linearGradient>
            <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="10%" stopColor="#EF4444" stopOpacity={0.14} />
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 500 }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={fmt} tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 500 }} axisLine={false} tickLine={false} width={44} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="income" stroke="#00C853" strokeWidth={2.5} fill="url(#incGrad)" dot={false} name="Income" activeDot={{ r: 5, fill: '#00C853', stroke: 'white', strokeWidth: 2 }} />
          <Area type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} fill="url(#expGrad)" dot={false} name="Expenses" activeDot={{ r: 4, fill: '#EF4444', stroke: 'white', strokeWidth: 2 }} />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
