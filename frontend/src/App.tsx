import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Analytics from './pages/Analytics';
import Budget from './pages/Budget';
import Insights from './pages/Insights';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/"             element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/analytics"    element={<Analytics />} />
            <Route path="/budget"       element={<Budget />} />
            <Route path="/insights"     element={<Insights />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
