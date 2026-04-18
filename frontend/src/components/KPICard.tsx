import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface Props {
  label: string;
  value: string;
  sub?: string;
  badge?: string;
  badgeType?: 'up' | 'down' | 'neutral';
  color?: 'white' | 'green' | 'dark';
  icon?: ReactNode;
  delay?: number;
}

export default function KPICard({
  label, value, sub, badge, badgeType = 'neutral',
  color = 'white', icon, delay = 0
}: Props) {
  return (
    <motion.div
      className={`kpi-card ${color}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {icon && (
        <div style={{
          width: 36, height: 36,
          borderRadius: 10,
          background: color === 'white' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, marginBottom: 14
        }}>
          {icon}
        </div>
      )}
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      {sub && <div className="kpi-sub">{sub}</div>}
      {badge && (
        <div className={`kpi-badge ${badgeType}`} style={{ marginTop: 10 }}>
          {badgeType === 'up' ? '↑' : badgeType === 'down' ? '↓' : '·'} {badge}
        </div>
      )}
    </motion.div>
  );
}
