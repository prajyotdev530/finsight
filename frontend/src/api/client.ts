import axios from 'axios';

const BASE = (import.meta as any).env.VITE_API_URL || '/api';

export const api = {
  users: () => axios.get(`${BASE}/users`),
  cashflow: (user: string) => axios.get(`${BASE}/cashflow?user=${user}`),
  categories: (user: string, month?: string) =>
    axios.get(`${BASE}/categories?user=${user}${month ? `&month=${month}` : ''}`),
  transactions: (user: string, page = 1, category?: string, month?: string) =>
    axios.get(`${BASE}/transactions?user=${user}&page=${page}&limit=20${category ? `&category=${category}` : ''}${month ? `&month=${month}` : ''}`),
  emi: (user: string) => axios.get(`${BASE}/emi?user=${user}`),
  insights: (user: string) => axios.get(`${BASE}/insights?user=${user}`),
  healthScore: (user: string) => axios.get(`${BASE}/health-score?user=${user}`),
  getBudget: (user: string) => axios.get(`${BASE}/budget?user=${user}`),
  setBudget: (user: string, category: string, limit: number) =>
    axios.post(`${BASE}/budget?user=${user}`, { category, limit }),
};
