# Spending Analytics - Credit & Health Score System

A comprehensive financial analytics platform that calculates credit scores, health scores, and provides spending insights through detailed financial metrics and predictions.

## Table of Contents
1. [Overview](#overview)
2. [Health Score Calculation](#health-score-calculation)
3. [Credit Score Estimation](#credit-score-estimation)
4. [Component Scoring Systems](#component-scoring-systems)
5. [Key Financial Metrics](#key-financial-metrics)
6. [Formulas & Mathematical Details](#formulas--mathematical-details)
7. [Features](#features)
8. [Project Structure](#project-structure)

---
<img width="1440" height="900" alt="Screenshot 2026-04-18 at 6 03 10 PM" src="https://github.com/user-attachments/assets/c5ca56c3-7ab3-41d5-bb26-c186c2a7a9a3" />



## Overview

The health and credit scoring system analyzes user transaction data to provide:
- **Health Score**: Overall financial health assessment (0-100)
- **Credit Score Estimate**: FICO-like credit score projection (300-850)
- **Sub-component Scores**: Detailed breakdown of financial dimensions
- **Anomaly Detection**: Unusual spending patterns
- **Predictions**: Future spending forecasts

The system processes transaction history across multiple months to identify patterns, calculate ratios, and estimate creditworthiness.

---

## Health Score Calculation

### Overview Formula

The **Overall Health Score** is a composite metric (0-100) that combines three key dimensions of financial health:

$$\text{Overall Health Score} = (0.4 \times \text{Savings Score}) + (0.35 \times \text{Debt Score}) + (0.25 \times \text{Discipline Score})$$

**Weight Distribution:**
- **Savings Score**: 40% weight (most important)
- **Debt Score**: 35% weight
- **Discipline Score**: 25% weight (least important)

This weighting reflects that savings ability is the primary indicator of financial health, followed by debt management capability, and then spending consistency.

---

## Component Scoring Systems

### 1. Savings Score (0-100)

**Purpose**: Measures the user's ability to save money relative to income.

**Formula**:
$$\text{Savings Score} = \min(100, \max(0, \text{Average Savings Rate} \times 2))$$

**Where Average Savings Rate is calculated as**:
$$\text{Monthly Savings Rate} = \frac{\text{Monthly Income} - \text{Monthly Expenses}}{\text{Monthly Income}} \times 100\%$$

$$\text{Average Savings Rate} = \frac{\sum_{i=1}^{n} \text{Savings Rate}_i}{n}$$

**Example Interpretation**:
- Average Savings Rate of 30% → Savings Score = 30 × 2 = **60**
- Average Savings Rate of 50% → Savings Score = 50 × 2 = **100** (capped)
- Average Savings Rate of 10% → Savings Score = 10 × 2 = **20**
- Negative savings (spending > income) → Savings Score = **0**

**Key Insights**:
- A 2x multiplier means you need only 50% average savings rate to achieve a perfect score
- Reflects that a 30% average savings rate is considered healthy
- Users cannot exceed 100 points or go below 0 (clamped range)

---

### 2. Debt Score (0-100)

**Purpose**: Measures the user's ability to service debt obligations relative to income.

**Formula**:
$$\text{Debt Ratio} = \frac{\text{Total Monthly EMI}}{\text{Average Monthly Income}} \times 100$$

$$\text{Debt Score} = \min(100, \max(0, 100 - (\text{Debt Ratio} \times 1.5)))$$

**Where**:
- **Total Monthly EMI** = Sum of all regular EMI (Equated Monthly Installment) payments
- **Average Monthly Income** = Mean of monthly income across all months in dataset

**Example Calculations**:
- Debt Ratio of 20% → Debt Score = 100 - (20 × 1.5) = 100 - 30 = **70**
- Debt Ratio of 30% → Debt Score = 100 - (30 × 1.5) = 100 - 45 = **55**
- Debt Ratio of 50% → Debt Score = 100 - (50 × 1.5) = 100 - 75 = **25**
- Debt Ratio of 67%+ → Debt Score = **0** (unsustainable debt levels)

**Key Insights**:
- Multiplier of 1.5 penalizes high debt ratios more heavily
- Industry standard: Debt-to-income ratio should be <36% for healthy finances
- A 30% debt ratio (typical for someone with a car loan) yields a 55/100 score

---

### 3. Discipline Score (0-100)

**Purpose**: Measures spending consistency and financial discipline month-to-month.

**Formula**:
$$\text{Coefficient of Variation} = \frac{\text{Standard Deviation of Monthly Expenses}}{\text{Mean of Monthly Expenses}} \times 100$$

$$\text{Discipline Score} = \min(100, \max(0, 100 - \text{Coefficient of Variation}))$$

**Where**:
- **Standard Deviation** = Statistical measure of variability in monthly spending
- **Mean** = Average monthly spend across all months

**Example Calculations**:

**Scenario 1 - High Discipline**:
- Monthly expenses: ₹50,000, ₹51,000, ₹49,000, ₹50,500
- Mean = ₹50,125
- Std Dev ≈ ₹804
- Coefficient of Variation = (804 / 50,125) × 100 ≈ 1.6%
- **Discipline Score = 100 - 1.6 = 98.4 → 98/100**

**Scenario 2 - Moderate Discipline**:
- Monthly expenses: ₹40,000, ₹55,000, ₹45,000, ₹60,000
- Mean = ₹50,000
- Std Dev ≈ ₹8,514
- Coefficient of Variation = (8,514 / 50,000) × 100 ≈ 17%
- **Discipline Score = 100 - 17 = 83**

**Scenario 3 - Low Discipline**:
- Monthly expenses: ₹30,000, ₹70,000, ₹20,000, ₹80,000
- Mean = ₹50,000
- Std Dev ≈ ₹25,600
- Coefficient of Variation = (25,600 / 50,000) × 100 = 51.2%
- **Discipline Score = 100 - 51.2 = 48.8 → 49/100**

**Key Insights**:
- Measures volatility in spending patterns
- Higher variability = Lower discipline score
- Consistent month-to-month spending (CV < 10%) is considered disciplined
- Highly erratic spending (CV > 50%) indicates poor financial discipline

---

## Credit Score Estimation

### Credit Score Range (300-850)

The system estimates a FICO-like credit score in the standard 300-850 range used by major credit bureaus.

**Formula**:
$$\text{Credit Raw Score} = (0.5 \times \text{EMI Regularity}) + (0.3 \times \text{Income Stability}) + (0.2 \times \text{Savings Score})$$

$$\text{Credit Estimate} = 300 + (\text{Credit Raw Score} \times 550)$$

**Weight Distribution**:
- **EMI Regularity**: 50% weight (most important - payment history)
- **Income Stability**: 30% weight (income consistency)
- **Savings Score**: 20% weight (existing financial health)

---

### 1. EMI Regularity (0-100%)

**Purpose**: Measures how consistently EMI payments are made on the expected dates.

**Formula**:
$$\text{EMI Regularity} = \frac{\text{Number of Months EMI was Paid}}{\text{Total Number of Months in Dataset}} \times 100\%$$

**Example Calculations**:
- EMI paid in 11 out of 12 months → EMI Regularity = (11/12) × 100 = **91.67%**
- EMI paid in 6 out of 12 months → EMI Regularity = (6/12) × 100 = **50%**
- EMI paid in all months → EMI Regularity = (12/12) × 100 = **100%**

**Key Insights**:
- Based on actual payment history, not just loan existence
- Missing even one payment significantly impacts score
- If multiple EMIs exist, average is calculated
- Payment history is the largest factor in real credit scores (FICO: 35%)

---

### 2. Income Stability (0-100%)

**Purpose**: Measures how predictable and consistent income is month-to-month.

**Formula**:
$$\text{Income Stability} = 100 - \text{Coefficient of Variation of Monthly Income}$$

**Coefficient of Variation for Income**:
$$\text{CV}_{\text{Income}} = \frac{\text{Std Dev of Monthly Income}}{\text{Mean of Monthly Income}} \times 100$$

**Example Calculations**:

**Scenario 1 - Stable Income (Salaried Employee)**:
- Monthly income: ₹100,000, ₹100,000, ₹100,000, ₹100,000
- Mean = ₹100,000
- Std Dev = 0
- CV = 0%
- **Income Stability = 100 - 0 = 100%**
- **Contribution to Credit = 100% × 0.3 = 0.3**

**Scenario 2 - Variable Income (Freelancer)**:
- Monthly income: ₹80,000, ₹120,000, ₹70,000, ₹130,000
- Mean = ₹100,000
- Std Dev ≈ ₹26,457
- CV ≈ 26.5%
- **Income Stability = 100 - 26.5 = 73.5%**
- **Contribution to Credit = 73.5% × 0.3 = 0.22**

---

### 3. Savings Score Integration

See [Savings Score (0-100)](#1-savings-score-0-100) section for details. In credit calculation, it contributes 20% weight.

---

### Complete Credit Score Example

**Scenario: Regular Salaried Employee**

**Input Data** (12 months):
- Consistent monthly income: ₹100,000
- Monthly expenses: ₹70,000
- Car EMI: ₹15,000/month (paid consistently all 12 months)

**Calculations**:

**Step 1: Calculate Sub-metrics**
- Total EMI = ₹15,000
- Average Monthly Income = ₹100,000
- Debt Ratio = (₹15,000 / ₹100,000) × 100 = 15%
- Average Savings Rate = ((₹100,000 - ₹70,000) / ₹100,000) × 100 = 30%

**Step 2: Calculate Scores**
- Savings Score = 30 × 2 = **60/100**
- Debt Score = 100 - (15 × 1.5) = 100 - 22.5 = **77.5 → 78/100**
- Discipline Score (assuming low variability) = **85/100**
- EMI Regularity = (12/12) × 100 = **100%**
- Income Stability = **100%**

**Step 3: Calculate Overall Health Score**
$$\text{Overall} = (0.4 \times 60) + (0.35 \times 78) + (0.25 \times 85)$$
$$= 24 + 27.3 + 21.25 = 72.55 → 73/100$$
**Health Score Label: Good** (60-79 range)

**Step 4: Calculate Credit Estimate**
$$\text{Credit Raw} = (0.5 \times 1.00) + (0.3 \times 1.00) + (0.2 \times 0.60)$$
$$= 0.50 + 0.30 + 0.12 = 0.92$$

$$\text{Credit Estimate} = 300 + (0.92 \times 550) = 300 + 506 = 806$$

**Final Result**:
- Overall Health Score: **73/100 (Good)**
- Credit Score Estimate: **806/850**

---

## Key Financial Metrics

### 1. Monthly Cash Flow

**Income**: Total amount received in a month (salary, bonus, business income, etc.)

**Expenses**: Total spending across all categories except Income

**Savings**: 
$$\text{Savings} = \text{Income} - \text{Expenses}$$

**Savings Rate**:
$$\text{Savings Rate} = \frac{\text{Savings}}{\text{Income}} \times 100\%$$

### 2. EMI Tracking

**EMI (Equated Monthly Installment)**: Fixed monthly payment for loans (car, home, education, etc.)

**Tracked Metrics**:
- Description: Name/type of loan
- Amount: Fixed monthly payment
- Day of Month: Consistent payment date
- Months: Which months payment was made
- Regularity: Percentage of months payment was made (0-100%)

### 3. Category Breakdown

Expenses are categorized (e.g., Food, Transport, Entertainment, EMI, Subscription, etc.)

**For Each Category**:
- Total Amount: Sum of all transactions in category
- Count: Number of transactions
- Percentage: % of total spending

### 4. Anomaly Detection

Identifies unusual spending patterns using statistical methods.

**Formula**:
$$\text{Threshold} = \text{Mean} + (2 \times \text{Std Dev})$$

If transaction amount > threshold:
- Marked as anomaly
- Severity: "medium" if > (Mean + 2σ), "high" if > (Mean + 3σ)

---

## Formulas & Mathematical Details

### Statistical Functions Used

**Mean (Average)**:
$$\bar{x} = \frac{\sum_{i=1}^{n} x_i}{n}$$

**Standard Deviation**:
$$\sigma = \sqrt{\frac{\sum_{i=1}^{n} (x_i - \bar{x})^2}{n}}$$

**Coefficient of Variation**:
$$CV = \frac{\sigma}{\bar{x}} \times 100\%$$

Measures relative variability - useful for comparing datasets with different scales.

---

## Features

### Dashboard & Analytics
- **Health Score Gauge**: Visual representation of overall financial health
- **KPI Cards**: Key Performance Indicators at a glance
- **Cash Flow Chart**: Monthly income/expense trends
- **Category Pie Chart**: Breakdown of spending by category
- **EMI Tracker**: Monitor all loan payments
- **Subscription Detector**: Identify recurring charges
- **Anomaly Feed**: Unusual spending alerts

### Budget Management
- Set spending limits by category
- Track budget vs. actual spending
- Receive alerts for budget overruns

### Predictions
- Project end-of-month savings
- Calculate daily burn rate
- Estimate days until cash runs out

### Insights
- Personalized financial recommendations
- Spending pattern analysis
- Health score improvement suggestions

---

## Project Structure

```
spending_analytics/
├── backend/                 # Next.js API & server
│   ├── lib/
│   │   ├── analytics.ts    # Score calculations & metrics
│   │   ├── loadData.ts     # Data loading & filtering
│   │   └── types.ts        # TypeScript interfaces
│   ├── pages/api/
│   │   ├── health-score.ts # Health score endpoint
│   │   ├── cashflow.ts     # Cash flow endpoint
│   │   ├── categories.ts   # Category breakdown endpoint
│   │   ├── emi.ts          # EMI tracking endpoint
│   │   ├── insights.ts     # Financial insights endpoint
│   │   └── budget.ts       # Budget management endpoint
│   └── data/
│       └── transactions.csv # Transaction data
│
├── frontend/               # React + Vite UI
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   └── store/          # State management
│   └── public/             # Static assets
│
└── data/
    ├── data_generation.py  # Generate sample data
    └── transactions.csv    # Raw transaction data
```

---

## Score Ranges & Labels

| Overall Score | Label | Financial Status |
|---|---|---|
| 80-100 | Excellent | Outstanding financial health |
| 60-79 | Good | Healthy financial practices |
| 40-59 | Fair | Adequate but needs improvement |
| 0-39 | Poor | Financial stress, urgent attention needed |

---

## Credit Score Ranges & Interpretations

| Credit Score | Description | Lending Impact |
|---|---|---|
| 750-850 | Excellent | Best rates, easy approval |
| 700-749 | Good | Favorable rates, standard approval |
| 650-699 | Fair | Higher rates, conditional approval |
| 600-649 | Poor | Much higher rates, strict conditions |
| 300-599 | Very Poor | Difficult to get credit, need alternatives |

---

## Data Input Requirements

### Transaction CSV Format
```
transaction_id, user_id, user_name, spend_date, price, category, description
1, user1, John, 2023-01-01, 50, Food, Groceries
2, user1, John, 2023-01-02, 15000, EMI, Car EMI
```

**Fields**:
- `spend_date`: Format YYYY-MM-DD
- `price`: Amount in currency (₹)
- `category`: Income, EMI, Subscription, Food, Transport, Entertainment, etc.
- `description`: Details of transaction

---

## How to Use

1. **Upload Transaction Data**: Provide CSV with transaction history (minimum 3 months recommended)
2. **View Dashboard**: Check overall health score and sub-components
3. **Analyze Categories**: See spending breakdown
4. **Track EMIs**: Monitor loan payment regularity
5. **Review Predictions**: Understand cash flow forecast
6. **Set Budgets**: Create spending limits
7. **Get Insights**: Receive personalized recommendations

---

## Performance Considerations

- Minimum recommended data: **3 months** of transactions
- Optimal data: **12+ months** for reliable score estimation
- Anomaly detection requires **5+ transactions** per category
- Score stability: More data = More accurate scores

---

## Future Enhancements

- [ ] Multi-currency support
- [ ] Advanced ML-based anomaly detection
- [ ] Goal-based savings planning
- [ ] Investment recommendations
- [ ] Tax optimization insights
- [ ] Credit score comparison benchmarks
- [ ] Mobile app
- [ ] Real-time notifications

---

## Technical Stack

- **Backend**: Next.js (TypeScript)
- **Frontend**: React + TypeScript + Vite
- **Data**: CSV-based transaction storage
- **Analysis**: Statistical calculations (mean, std dev, CV)

---

## License

MIT License - Feel free to use and modify this project.

---

## Contributing

Contributions are welcome! Please ensure:
- Code follows TypeScript standards
- Calculations are verified mathematically
- New features maintain backward compatibility

---

## Questions & Support

For detailed understanding of any metric or formula, refer to the specific section in this README.

---

**Last Updated**: April 2026
**Version**: 1.0.0
