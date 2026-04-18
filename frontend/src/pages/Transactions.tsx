import { useEffect, useState, useCallback } from 'react';
import { useUserStore } from '../store/userStore';
import { api } from '../api/client';
import Header from '../components/Header';
import { motion } from 'framer-motion';

const CATEGORIES = ['All', 'Income', 'Food', 'Utilities', 'Transport', 'Entertainment', 'Shopping', 'EMI', 'Subscription'];
const MONTHS = ['All', '2023-01','2023-02','2023-03','2023-04','2023-05','2023-06','2023-07','2023-08','2023-09','2023-10','2023-11','2023-12'];

const CAT_COLORS: Record<string, string> = {
  Income: 'badge-income', Food: 'badge-food', EMI: 'badge-emi',
  Shopping: 'badge-shopping', Utilities: 'badge-utilities', Transport: 'badge-transport',
  Entertainment: 'badge-entertainment', Subscription: 'badge-subscription',
};

export default function Transactions() {
  const { selectedUser } = useUserStore();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('All');
  const [month, setMonth] = useState('All');
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    api.transactions(
      selectedUser, page,
      category !== 'All' ? category : undefined,
      month !== 'All' ? month : undefined
    ).then(r => {
      setTransactions(r.data.data);
      setTotal(r.data.total);
    }).finally(() => setLoading(false));
  }, [selectedUser, page, category, month]);

  useEffect(() => { setPage(1); }, [selectedUser, category, month]);
  useEffect(() => { load(); }, [load]);

  const totalPages = Math.ceil(total / 20);

  return (
    <div>
      <Header title="Transactions" subtitle={`${total} total transactions`} />
      <div className="page-body">
        <div className="filter-bar">
          {CATEGORIES.map(c => (
            <button
              key={c}
              className={`filter-chip${category === c ? ' active' : ''}`}
              onClick={() => setCategory(c)}
              id={`cat-filter-${c}`}
            >{c}</button>
          ))}
          <select
            className="filter-select"
            value={month}
            onChange={e => setMonth(e.target.value)}
            id="month-filter"
          >
            {MONTHS.map(m => <option key={m}>{m}</option>)}
          </select>
        </div>

        <div className="card">
          {loading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t, i) => (
                    <motion.tr
                      key={t.transaction_id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                    >
                      <td><span className="tx-description">{t.description}</span></td>
                      <td><span className={`badge ${CAT_COLORS[t.category] || 'badge-income'}`}>{t.category}</span></td>
                      <td><span className="tx-date">{t.spend_date}</span></td>
                      <td style={{ textAlign: 'right' }}>
                        <span className={t.category === 'Income' ? 'tx-amount-pos' : 'tx-amount-neg'}>
                          {t.category === 'Income' ? '+' : '-'}₹{t.price.toLocaleString('en-IN')}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Page {page} of {totalPages} · {total} results
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-ghost" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
              <button className="btn btn-ghost" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
