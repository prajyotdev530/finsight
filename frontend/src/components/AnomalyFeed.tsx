import { motion } from 'framer-motion';
import { AlertTriangle, Zap } from 'lucide-react';

interface Anomaly {
  transaction_id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  expectedMax: number;
  severity: 'high' | 'medium';
}

interface Props { anomalies: Anomaly[]; }

export default function AnomalyFeed({ anomalies }: Props) {
  const top = anomalies.slice(0, 6);

  return (
    <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      <div className="card-header">
        <div className="card-title">
          <AlertTriangle size={16} style={{ color: 'var(--rose-400)' }} />
          Anomaly Detection
        </div>
        {anomalies.length > 0 && (
          <span className="badge badge-anomaly-high">{anomalies.length} detected</span>
        )}
      </div>
      {top.length === 0 ? (
        <div className="empty">✅ No anomalies detected! Spending looks normal.</div>
      ) : (
        <div className="anomaly-list">
          {top.map((a, i) => (
            <motion.div
              key={a.transaction_id}
              className={`anomaly-item ${a.severity}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="anomaly-icon">
                {a.severity === 'high'
                  ? <Zap size={16} style={{ color: 'var(--rose-400)' }} />
                  : <AlertTriangle size={14} style={{ color: 'var(--amber-400)' }} />}
              </div>
              <div className="anomaly-details">
                <div className="anomaly-title truncate">{a.description}</div>
                <div className="anomaly-meta">
                  {a.category} · {a.date} · expected max ₹{a.expectedMax.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="anomaly-amount">₹{a.amount.toLocaleString('en-IN')}</div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
