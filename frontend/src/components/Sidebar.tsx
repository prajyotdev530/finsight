import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, ArrowLeftRight, BarChart2,
  Wallet, Lightbulb, Zap
} from 'lucide-react';

const navItems = [
  { to: '/',             icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/transactions', icon: ArrowLeftRight,  label: 'Transactions' },
  { to: '/analytics',    icon: BarChart2,       label: 'Analytics' },
  { to: '/budget',       icon: Wallet,          label: 'Budget' },
  { to: '/insights',     icon: Lightbulb,       label: 'Insights' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon"><span style={{ fontSize: 18 }}>📊</span></div>
        <span className="logo-text">FinSight</span>
      </div>

      <span className="nav-section-label">Navigation</span>
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
        >
          <Icon size={17} className="nav-icon" />
          {label}
        </NavLink>
      ))}

      <div className="sidebar-footer">
        <div style={{
          padding: '12px',
          background: 'rgba(0,200,83,0.1)',
          borderRadius: '10px',
          border: '1px solid rgba(0,200,83,0.2)'
        }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#00C853', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Zap size={11} /> Live Data
          </div>
          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>
            2,151 transactions · 12 months
          </div>
        </div>
      </div>
    </aside>
  );
}
