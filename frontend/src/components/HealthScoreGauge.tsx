import { motion } from 'framer-motion';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

interface HealthScore {
  overall: number;
  savingsScore: number;
  debtScore: number;
  disciplineScore: number;
  creditEstimate: number;
  label: 'Excellent' | 'Good' | 'Fair' | 'Poor';
}

interface Props { score: HealthScore; }

const LABEL_COLOR: Record<string, string> = {
  Excellent: '#00C853', Good: '#3B82F6', Fair: '#F59E0B', Poor: '#EF4444',
};

const CREDIT_COLOR = (s: number) => s >= 750 ? '#00A844' : s >= 650 ? '#3B82F6' : s >= 550 ? '#F59E0B' : '#EF4444';

export default function HealthScoreGauge({ score }: Props) {
  if (!score) return null;

  const col = LABEL_COLOR[score.label] || '#00C853';
  const radarData = [{ name: 'Score', value: score.overall, fill: col }];

  const bars = [
    { label: 'Savings', value: score.savingsScore, color: '#00C853' },
    { label: 'Debt', value: score.debtScore, color: '#3B82F6' },
    { label: 'Discipline', value: score.disciplineScore, color: '#8B5CF6' },
  ];

  return (
    <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
      <div className="card-header">
        <div className="card-title">Financial Health</div>
        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: col }}>
          {score.label}
        </span>
      </div>

      <div className="health-grid">
        <div className="gauge-wrap">
          <ResponsiveContainer width={110} height={110}>
            <RadialBarChart
              cx="50%" cy="50%"
              innerRadius="68%" outerRadius="100%"
              data={radarData}
              startAngle={90}
              endAngle={90 - (score.overall * 3.6)}
            >
              <RadialBar dataKey="value" cornerRadius={6} background={{ fill: '#F3F4F6' }} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="gauge-label" style={{ color: col, marginTop: -6 }}>{score.overall}</div>
          <div className="gauge-sub">out of 100</div>
        </div>

        <div className="score-bars">
          {bars.map((bar) => (
            <div key={bar.label} className="score-bar-item">
              <div className="score-bar-header">
                <span className="score-bar-label">{bar.label}</span>
                <span className="score-bar-val">{bar.value}</span>
              </div>
              <div className="score-bar-track">
                <motion.div
                  className="score-bar-fill"
                  style={{ background: bar.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${bar.value}%` }}
                  transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="credit-score-display" style={{ marginTop: 18 }}>
        <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>
          Estimated Credit Score
        </div>
        <div className="credit-score-num" style={{ color: CREDIT_COLOR(score.creditEstimate) }}>
          {score.creditEstimate}
        </div>
        <div className="credit-score-label">Scale: 300 – 850</div>
        <div className="credit-score-range">Based on EMI regularity & income stability</div>
      </div>
    </motion.div>
  );
}
