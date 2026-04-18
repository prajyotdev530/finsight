import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Bell, Search } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { api } from '../api/client';

interface User { id: string; name: string; }

const TYPE_MAP: Record<string, string> = {
  U001_Frugal:      'Conservative Saver',
  U002_HighEMI:     'High EMI Burden',
  U003_Wealthy:     'High Net Worth',
  U004_Poor:        'Low Income',
  U005_Freelancer:  'Variable Income',
};

const AV_COLORS = ['#0A0A0A', '#00C853', '#3B82F6', '#EF4444', '#8B5CF6'];

interface Props { title: string; subtitle?: string; }

export default function Header({ title, subtitle }: Props) {
  const { selectedUser, setUser } = useUserStore();
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.users().then(r => setUsers(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = users.find(u => u.id === selectedUser);
  const idx = users.findIndex(u => u.id === selectedUser);
  const initials = current?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '??';

  return (
    <header className="header">
      <div className="header-title">
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="header-right">
        <button className="btn btn-ghost" style={{ padding: '8px 10px', borderRadius: '10px' }}>
          <Search size={15} />
        </button>
        <button className="btn btn-ghost" style={{ padding: '8px 10px', borderRadius: '10px', position: 'relative' }}>
          <Bell size={15} />
          <span style={{
            position: 'absolute', top: 6, right: 6,
            width: 6, height: 6,
            background: '#00C853', borderRadius: '50%',
            border: '1.5px solid white'
          }} />
        </button>
        <div ref={ref} style={{ position: 'relative' }}>
          <div className="user-selector" onClick={() => setOpen(!open)} id="user-selector-btn">
            <div
              className="user-avatar"
              style={{ background: AV_COLORS[idx] || '#0A0A0A', color: idx === 1 ? '#000' : '#00C853' }}
            >
              {initials}
            </div>
            <div className="user-info">
              <div className="user-name">{current?.name || '...'}</div>
              <div className="user-type">{TYPE_MAP[selectedUser] || selectedUser}</div>
            </div>
            <ChevronDown size={13} style={{ color: 'var(--text-secondary)' }} />
          </div>
          {open && (
            <div className="user-dropdown">
              <div style={{ padding: '10px 14px 8px', borderBottom: '1px solid var(--border)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
                Switch User
              </div>
              {users.map((u, i) => (
                <div
                  key={u.id}
                  className={`user-option${u.id === selectedUser ? ' selected' : ''}`}
                  onClick={() => { setUser(u.id); setOpen(false); }}
                  id={`user-option-${u.id}`}
                >
                  <div className="user-avatar" style={{ width: 28, height: 28, fontSize: 10, background: AV_COLORS[i], color: i === 1 ? '#000' : '#00C853' }}>
                    {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <div className="user-option-name">{u.name}</div>
                    <div className="user-option-id">{TYPE_MAP[u.id] || u.id}</div>
                  </div>
                  {u.id === selectedUser && (
                    <div style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', background: '#00C853', flexShrink: 0 }} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
