# FinSight - Personal Finance Analytics

FinSight is a modern, modular web application that processes personal financial transactions to deliver elegant visual insights natively through a lightweight React + Vite frontend and a Next.js Serverless Backend.

## Features
- **Cash Flow Analytics**: Track income vs expenses vs savings per month.
- **Categorization**: Auto-categorized pie charts and historical aggregations.
- **EMI & Subscription Detection**: Automatically finds recurring payments using intelligent heuristics.
- **AI-Driven Health Score**: Estimates your financial health based on savings rates, debt ratios, and financial discipline.
- **Predictive Insights**: Forecasts your monthly burn rate and predicts savings depletion dates.

---

## 🛠 Prerequisites
You need Node.js installed to run the application (Version 18 or above is recommended). Ensure you have `git` and `npm` mapped.

## 🚀 How to Run Locally

### 1. Clone the project
```bash
git clone https://github.com/prajyotdev530/finsight.git
cd finsight
```

### 2. Run the Backend API
The backend is a Next.js API that streams and computes the financial analytics.
```bash
cd backend
npm install
npm run dev
```
By default, the backend will run at `http://localhost:3000`. Leave this terminal tab open.

### 3. Run the Frontend App
The frontend is a React + Vite application that connects to the backend API.
Open a new terminal tab and run:
```bash
cd frontend
npm install
npm run dev
```
By default, the frontend will be served at `http://localhost:5173`. 

### 4. View the App
Open `http://localhost:5173` in your browser. 
The application will automatically fetch local data processed from `backend/data/transactions.csv` via your local Next.js proxy!

---

## 🌍 Production Environment
The project is completely optimized for Vercel. Live versions stream to:
- **Frontend**: [finsight-app-nu.vercel.app](https://finsight-app-nu.vercel.app/)
- **Backend**: [finsight-api-five.vercel.app](https://finsight-api-five.vercel.app/)

*Locally, development handles CORS natively through Vite proxies, whereas in production Vercel enforces strict headers over cross-origin HTTP traffic to permit standard transactions seamlessly.*
