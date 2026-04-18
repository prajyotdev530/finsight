import axios from 'axios';

const BASE = (import.meta as any).env.VITE_API_URL || '/api';

/**
 * Axios instance with timeout and automatic retry for resilience.
 * Vercel serverless functions can have cold starts — retry handles this.
 */
const client = axios.create({
  baseURL: BASE,
  timeout: 20000, // 20s timeout (cold starts on free tier can be slow)
});

// Retry interceptor: retries failed requests up to 3 times with exponential backoff
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (!config) return Promise.reject(error);

    config._retryCount = config._retryCount || 0;

    // Only retry on network errors or 5xx server errors, up to 3 times
    const isRetryable =
      !error.response || // network error
      (error.response.status >= 500 && error.response.status < 600);

    if (isRetryable && config._retryCount < 3) {
      config._retryCount += 1;
      const delay = Math.min(1000 * Math.pow(2, config._retryCount - 1), 4000);
      console.warn(`[API] Retry ${config._retryCount}/3 for ${config.url} in ${delay}ms`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return client(config);
    }

    return Promise.reject(error);
  }
);

export const api = {
  users: () => client.get('/users'),
  cashflow: (user: string) => client.get(`/cashflow?user=${user}`),
  categories: (user: string, month?: string) =>
    client.get(`/categories?user=${user}${month ? `&month=${month}` : ''}`),
  transactions: (user: string, page = 1, category?: string, month?: string) =>
    client.get(`/transactions?user=${user}&page=${page}&limit=20${category ? `&category=${category}` : ''}${month ? `&month=${month}` : ''}`),
  emi: (user: string) => client.get(`/emi?user=${user}`),
  insights: (user: string) => client.get(`/insights?user=${user}`),
  healthScore: (user: string) => client.get(`/health-score?user=${user}`),
  getBudget: (user: string) => client.get(`/budget?user=${user}`),
  setBudget: (user: string, category: string, limit: number) =>
    client.post(`/budget?user=${user}`, { category, limit }),
};
