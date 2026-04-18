import { motion } from 'framer-motion';
import { TrendingDown } from 'lucide-react';

interface Prediction {
  projectedSavings: number;
  dailyBurnRate: number;
  daysUntilZero: number | null;
  currentMonthExpenseForecast: number;
}

interface Props { predictions: Prediction; }

export default function PredictiveInsights({ predictions: p }: Props) {
  const positive = p.projectedSavings >= 0;

  return (
    <motion.div
      className="prediction-banner"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: positive ? 'rgba(0,200,83,0.2)' : 'rgba(239,68,68,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 24, flexShrink: 0,
      }}>
        {positive ? '🚀' : '⚠️'}
      </div>
      <div style={{ flex: 1 }}>
        <div className="pred-title">
          {positive
            ? `On track to save ₹${p.projectedSavings.toLocaleString('en-IN')} this month`
            : `Spending exceeds income by ₹${Math.abs(p.projectedSavings).toLocaleString('en-IN')}`}
        </div>
        <div className="pred-desc">
          Based on last 3 months · Forecasted expense ₹{p.currentMonthExpenseForecast.toLocaleString('en-IN')}
        </div>
      </div>
      <div className="pred-stats">
        <div className="pred-stat">
          <div className="pred-stat-val">₹{p.dailyBurnRate.toLocaleString('en-IN')}</div>
          <div className="pred-stat-label">Daily burn</div>
        </div>
        {p.daysUntilZero !== null && (
          <div className="pred-stat">
            <div className="pred-stat-val" style={{ color: '#EF4444' }}>{p.daysUntilZero}d</div>
            <div className="pred-stat-label">Critical</div>
          </div>
        )}
        <div className="pred-stat">
          <div className="pred-stat-val" style={{ color: positive ? '#00C853' : '#EF4444' }}>
            {positive ? '+' : ''}₹{p.projectedSavings.toLocaleString('en-IN')}
          </div>
          <div className="pred-stat-label">Projected</div>
        </div>
      </div>
    </motion.div>
  );
}
