import { motion } from 'framer-motion';

interface EMI {
  description: string;
  amount: number;
  dayOfMonth: number;
  months: string[];
  regularity: number;
}

interface Props {
  emis: EMI[];
  totalMonthlyEMI: number;
}

export default function EMITracker({ emis, totalMonthlyEMI }: Props) {
  return (
    <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
      <div className="card-header">
        <div className="card-title">🏦 EMI & Loan Tracker</div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--rose-400)' }}>
            ₹{totalMonthlyEMI.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.73rem', color: 'var(--text-secondary)' }}>Total monthly burden</div>
        </div>
      </div>
      {emis.length === 0 ? (
        <div className="empty">🎉 No EMI payments found</div>
      ) : (
        <div className="emi-list">
          {emis.map((emi, i) => (
            <motion.div
              key={i} className="emi-item"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="emi-top">
                <span className="emi-name">{emi.description}</span>
                <span className="emi-amount">₹{emi.amount.toLocaleString('en-IN')}/mo</span>
              </div>
              <div className="emi-bottom">
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Due every {emi.dayOfMonth}th · {emi.months.length} months
                </div>
                <div className="regularity-bar" style={{ flex: 1, margin: '0 10px' }}>
                  <div className="regularity-fill" style={{ width: `${emi.regularity}%` }} />
                </div>
                <span className="regularity-text">{emi.regularity}% regular</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
