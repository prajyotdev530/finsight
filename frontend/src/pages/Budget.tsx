import { useEffect, useState, useCallback } from 'react';
import { useUserStore } from '../store/userStore';
import { api } from '../api/client';
import Header from '../components/Header';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Target } from 'lucide-react';

const EXPENSE_CATS = ['Food', 'Utilities', 'Transport', 'Entertainment', 'Shopping', 'EMI', 'Subscription'];
const CAT_ICONS: Record<string, string> = {
  Food: '🍔', Utilities: '⚡', Transport: '🚗',
  Entertainment: '🎭', Shopping: '🛍️', EMI: '🏦', Subscription: '📱',
};

export default function Budget() {
  const { selectedUser } = useUserStore();
  const [categories, setCategories] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<Record<string, number>>({});
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);

  const load = useCallback(() => {
    Promise.all([api.categories(selectedUser), api.getBudget(selectedUser)])
      .then(([cat, bud]) => { setCategories(cat.data); setBudgets(bud.data); });
  }, [selectedUser]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (cat: string) => {
    const val = parseFloat(inputs[cat]);
    if (isNaN(val) || val <= 0) return;
    setSaving(cat);
    await api.setBudget(selectedUser, cat, val);
    setBudgets(prev => ({ ...prev, [cat]: val }));
    setSaving(null);
  };

  const totalBudget = Object.values(budgets).reduce((s, v) => s + v, 0);
  const totalSpend  = categories.filter(c => EXPENSE_CATS.includes(c.category)).reduce((s, c) => s + c.amount, 0);
  const overallPct  = totalBudget > 0 ? Math.min(100, (totalSpend / totalBudget) * 100) : 0;

  return (
    <div>
      <Header title="Budget" subtitle="Set category limits and track against actuals" />
      <div className="page-body">

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
          <motion.div className="kpi-card green" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="kpi-label">Total Budget</div>
            <div className="kpi-value">₹{totalBudget.toLocaleString('en-IN')}</div>
            <div className="kpi-sub">across {Object.keys(budgets).length} categories</div>
          </motion.div>
          <motion.div className="kpi-card dark" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}>
            <div className="kpi-label">Total Spent</div>
            <div className="kpi-value">₹{totalSpend.toLocaleString('en-IN')}</div>
            <div className="kpi-sub">all-time across categories</div>
          </motion.div>
          <motion.div className="kpi-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
            <div className="kpi-label">Budget Used</div>
            <div className="kpi-value">{totalBudget > 0 ? `${overallPct.toFixed(0)}%` : '—'}</div>
            {totalBudget > 0 && (
              <div style={{ marginTop: 10 }}>
                <div className="budget-bar-track">
                  <motion.div
                    className={`budget-bar-fill ${overallPct >= 100 ? 'budget-bar-exceeded' : overallPct >= 80 ? 'budget-bar-warning' : 'budget-bar-safe'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${overallPct}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Per-category budgets */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><Target size={16} /> Category Budgets</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Type an amount and click Set</span>
          </div>
          <div className="budget-list">
            {EXPENSE_CATS.map((cat, i) => {
              const catData  = categories.find(c => c.category === cat);
              const spent    = catData?.amount ?? 0;
              const budget   = budgets[cat] ?? 0;
              const pct      = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0;
              const exceeded = budget > 0 && spent > budget;
              const warning  = !exceeded && budget > 0 && pct >= 80;

              return (
                <motion.div
                  key={cat} className="budget-item"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <div className="budget-header">
                    <div className="budget-cat">
                      <span style={{ fontSize: 18 }}>{CAT_ICONS[cat]}</span>
                      <span>{cat}</span>
                      {exceeded && <XCircle size={14} style={{ color: '#EF4444', marginLeft: 2 }} />}
                      {warning  && <span style={{ fontSize: '0.7rem', background: '#FEF9C3', color: '#D97706', padding: '1px 7px', borderRadius: 20, fontWeight: 700 }}>Near limit</span>}
                    </div>
                    <div className="budget-amounts">
                      <span style={{ fontWeight: 700, color: exceeded ? '#EF4444' : '#0A0A0A' }}>
                        ₹{spent.toLocaleString('en-IN')}
                      </span>
                      {budget > 0 && (
                        <span style={{ color: '#9CA3AF' }}> / ₹{budget.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                  </div>

                  {budget > 0 && (
                    <>
                      <div className="budget-bar-track">
                        <motion.div
                          className={`budget-bar-fill ${exceeded ? 'budget-bar-exceeded' : warning ? 'budget-bar-warning' : 'budget-bar-safe'}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                      <div className="budget-footer">
                        <span>{pct.toFixed(0)}% used</span>
                        {exceeded
                          ? <span style={{ color: '#EF4444', fontWeight: 700 }}>Over by ₹{(spent - budget).toLocaleString('en-IN')}</span>
                          : <span style={{ color: '#00A844', fontWeight: 600 }}>₹{(budget - spent).toLocaleString('en-IN')} free</span>}
                      </div>
                    </>
                  )}

                  <div className="budget-input-row">
                    <input
                      id={`budget-input-${cat}`}
                      className="budget-input"
                      type="number"
                      placeholder={`Set limit for ${cat}…`}
                      value={inputs[cat] || ''}
                      onChange={e => setInputs(prev => ({ ...prev, [cat]: e.target.value }))}
                    />
                    <button
                      className="btn btn-dark"
                      id={`budget-save-${cat}`}
                      onClick={() => handleSave(cat)}
                      disabled={saving === cat}
                      style={{ padding: '8px 20px', borderRadius: 10 }}
                    >
                      {saving === cat ? '...' : 'Set'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
