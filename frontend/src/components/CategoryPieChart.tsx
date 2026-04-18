import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface Item { category: string; amount: number; percentage: number; }
interface Props { data: Item[]; }

const COLORS: Record<string, string> = {
  Food: '#F59E0B', Utilities: '#3B82F6', Transport: '#8B5CF6',
  Entertainment: '#EC4899', Shopping: '#6366F1', EMI: '#EF4444', Subscription: '#14B8A6',
};
const DEFAULT_COLORS = ['#6366F1','#8B5CF6','#EF4444','#3B82F6','#F59E0B','#00C853','#EC4899','#14B8A6'];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div style={{
      background: '#0A0A0A', borderRadius: 12, padding: '10px 14px', fontSize: '0.8rem',
      boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
    }}>
      <div style={{ fontWeight: 700, color: 'white' }}>{item.category}</div>
      <div style={{ color: '#00C853', marginTop: 3, fontWeight: 800 }}>₹{item.amount.toLocaleString('en-IN')}</div>
      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', marginTop: 2 }}>{item.percentage}% of total</div>
    </div>
  );
};

export default function CategoryPieChart({ data }: Props) {
  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="card-header">
        <div>
          <div className="card-title">Breakdown</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>By category</div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data} dataKey="amount" nameKey="category"
            cx="50%" cy="50%" outerRadius={88} innerRadius={52}
            strokeWidth={0} paddingAngle={2}
          >
            {data.map((entry, i) => (
              <Cell key={entry.category} fill={COLORS[entry.category] || DEFAULT_COLORS[i % DEFAULT_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      {/* Custom legend */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12 }}>
        {data.slice(0, 5).map((item, i) => (
          <div key={item.category} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: COLORS[item.category] || DEFAULT_COLORS[i % DEFAULT_COLORS.length], flexShrink: 0 }} />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{item.category}</span>
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--black)' }}>{item.percentage}%</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
