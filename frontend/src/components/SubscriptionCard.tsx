import { motion } from 'framer-motion';

interface Subscription {
  name: string;
  amount: number;
  months: string[];
  dayOfMonth: number;
  category: string;
}

interface Props { subscriptions: Subscription[]; }

const SUB_ICONS: Record<string, string> = {
  Netflix: '🎬', Spotify: '🎵', 'Amazon Prime': '📦',
  Hotstar: '🏏', 'Gym Membership': '💪', 'Swiggy One': '🍔',
  'Zomato Gold': '⭐',
};

export default function SubscriptionCard({ subscriptions }: Props) {
  const totalMonthly = subscriptions.reduce((s, sub) => s + sub.amount, 0);

  return (
    <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      <div className="card-header">
        <div className="card-title">🔁 Subscriptions</div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--violet-400)' }}>
            ₹{totalMonthly.toLocaleString('en-IN')}/mo
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Annual: ₹{(totalMonthly * 12).toLocaleString('en-IN')}</div>
        </div>
      </div>
      {subscriptions.length === 0 ? (
        <div className="empty">No recurring subscriptions detected</div>
      ) : (
        <div className="sub-grid">
          {subscriptions.map((sub, i) => (
            <motion.div
              key={i} className="sub-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07 }}
            >
              <div className="sub-icon">{SUB_ICONS[sub.name] || '📱'}</div>
              <div className="sub-name">{sub.name}</div>
              <div className="sub-amount">₹{sub.amount}</div>
              <div className="sub-freq">{sub.months.length} months · {sub.dayOfMonth}th</div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
