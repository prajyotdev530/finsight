import pandas as pd
import random
import uuid
from datetime import datetime, timedelta

# ─────────────────────────────────────────────────────────────────
#  Merchant pools per category
# ─────────────────────────────────────────────────────────────────
MERCHANTS = {
    "Food":          ["Zomato", "Swiggy", "Dominos", "McDonald's", "Starbucks", "Local Dhaba", "BigBasket", "Blinkit"],
    "Utilities":     ["MSEB Electric Bill", "Tata Power", "Jio Broadband", "Airtel Postpaid", "Water Tax", "Gas Pipeline"],
    "Transport":     ["Ola", "Uber", "Rapido", "Metro Card", "Petrol Pump", "IRCTC Train", "IndiGo Flight"],
    "Entertainment": ["BookMyShow", "PVR Cinemas", "Goa Trip", "Amusement Park", "Sports Club"],
    "Shopping":      ["Amazon", "Flipkart", "Myntra", "Reliance Trends", "H&M", "Croma Electronics", "DMart"],
    "EMI":           ["HDFC Home Loan EMI", "SBI Car Loan EMI", "Bajaj Finserv EMI", "ICICI Personal Loan EMI"],
    "Income":        ["Salary Credit", "Freelance Payment", "Consulting Fee", "Bonus Credit"],
    "Subscription":  ["Netflix", "Spotify", "Amazon Prime", "Hotstar", "Gym Membership", "Swiggy One", "Zomato Gold"],
}

# ─────────────────────────────────────────────────────────────────
#  5 Personas (amounts in INR ₹)
# ─────────────────────────────────────────────────────────────────
personas = {
    "U001_Frugal": {
        "name": "Rahul Sharma",
        "Salary": 60000, "EMI": 0,
        "Food": (4000, 6000), "Utilities": (2000, 2500),
        "Transport": (1000, 1500), "Entertainment": (500, 1000), "Shopping": (0, 500)
    },
    "U002_HighEMI": {
        "name": "Priya Mehta",
        "Salary": 85000, "EMI": 60000,
        "Food": (8000, 10000), "Utilities": (3000, 4000),
        "Transport": (2000, 3000), "Entertainment": (1000, 2000), "Shopping": (1000, 2000)
    },
    "U003_Wealthy": {
        "name": "Vikram Oberoi",
        "Salary": 350000, "EMI": 40000,
        "Food": (30000, 50000), "Utilities": (10000, 15000),
        "Transport": (10000, 20000), "Entertainment": (40000, 60000), "Shopping": (50000, 80000)
    },
    "U004_Poor": {
        "name": "Sunita Devi",
        "Salary": 18000, "EMI": 0,
        "Food": (8000, 10000), "Utilities": (2000, 3000),
        "Transport": (1500, 2500), "Entertainment": (0, 500), "Shopping": (0, 500)
    },
    "U005_Freelancer": {
        "name": "Arjun Kapoor",
        "Salary": (30000, 120000), "EMI": 15000,
        "Food": (10000, 20000), "Utilities": (4000, 5000),
        "Transport": (3000, 6000), "Entertainment": (5000, 15000), "Shopping": (2000, 10000)
    }
}

# ─────────────────────────────────────────────────────────────────
#  Subscription plans per user (fixed monthly amount)
# ─────────────────────────────────────────────────────────────────
subscriptions = {
    "U001_Frugal":    [("Spotify", 119), ("Hotstar", 299)],
    "U002_HighEMI":   [("Netflix", 649), ("Amazon Prime", 299), ("Gym Membership", 1500)],
    "U003_Wealthy":   [("Netflix", 649), ("Spotify", 119), ("Amazon Prime", 299), ("Gym Membership", 5000), ("Swiggy One", 299)],
    "U004_Poor":      [],
    "U005_Freelancer":[("Hotstar", 299), ("Spotify", 119), ("Zomato Gold", 199)],
}

# ─────────────────────────────────────────────────────────────────
#  Settings
# ─────────────────────────────────────────────────────────────────
start_date = datetime(2023, 1, 1)
months_to_generate = 12
transactions = []


def pick_merchant(category):
    pool = MERCHANTS.get(category, ["Unknown"])
    return random.choice(pool)


def generate_random_dates(year, month, num_transactions):
    days_in_month = pd.Period(f'{year}-{month}').days_in_month
    return [datetime(year, month, random.randint(1, days_in_month)) for _ in range(num_transactions)]


# ─────────────────────────────────────────────────────────────────
#  Main generation loop
# ─────────────────────────────────────────────────────────────────
for i in range(months_to_generate):
    current_date = start_date + pd.DateOffset(months=i)
    year, month = current_date.year, current_date.month

    for user_id, profile in personas.items():

        # ── 1. Salary Credit ─────────────────────────────────────
        salary = (random.randint(*profile["Salary"])
                  if isinstance(profile["Salary"], tuple)
                  else profile["Salary"])
        transactions.append({
            "transaction_id": str(uuid.uuid4()),
            "user_id": user_id,
            "user_name": profile["name"],
            "spend_date": datetime(year, month, 1).strftime("%Y-%m-%d"),
            "price": salary,
            "category": "Income",
            "description": pick_merchant("Income"),
        })

        # ── 2. Fixed EMIs (always 5th) ───────────────────────────
        if profile["EMI"] > 0:
            transactions.append({
                "transaction_id": str(uuid.uuid4()),
                "user_id": user_id,
                "user_name": profile["name"],
                "spend_date": datetime(year, month, 5).strftime("%Y-%m-%d"),
                "price": profile["EMI"],
                "category": "EMI",
                "description": pick_merchant("EMI"),
            })

        # ── 3. Subscriptions (always 10th) ───────────────────────
        for sub_name, sub_amount in subscriptions.get(user_id, []):
            transactions.append({
                "transaction_id": str(uuid.uuid4()),
                "user_id": user_id,
                "user_name": profile["name"],
                "spend_date": datetime(year, month, 10).strftime("%Y-%m-%d"),
                "price": sub_amount,
                "category": "Subscription",
                "description": sub_name,
            })

        # ── 4. Variable Spending ──────────────────────────────────
        variable_categories = ["Food", "Utilities", "Transport", "Entertainment", "Shopping"]
        for category in variable_categories:
            min_spend, max_spend = profile[category]
            total_monthly_spend = random.randint(min_spend, max_spend)
            if total_monthly_spend <= 0:
                continue

            num_swipes = random.randint(3, 10)
            swipe_amounts = [total_monthly_spend // num_swipes] * num_swipes
            swipe_dates = generate_random_dates(year, month, num_swipes)

            for date, amount in zip(swipe_dates, swipe_amounts):
                final_amount = amount + random.randint(-50, 50)
                if final_amount > 0:
                    transactions.append({
                        "transaction_id": str(uuid.uuid4()),
                        "user_id": user_id,
                        "user_name": profile["name"],
                        "spend_date": date.strftime("%Y-%m-%d"),
                        "price": final_amount,
                        "category": category,
                        "description": pick_merchant(category),
                    })

# ─────────────────────────────────────────────────────────────────
#  Inject anomaly spikes (2 per user across the year)
# ─────────────────────────────────────────────────────────────────
anomaly_months_used = {uid: [] for uid in personas}
for user_id, profile in personas.items():
    for _ in range(2):
        # pick a random month not already used for this user
        avail = [m for m in range(1, months_to_generate + 1)
                 if m not in anomaly_months_used[user_id]]
        if not avail:
            break
        anomaly_month = random.choice(avail)
        anomaly_months_used[user_id].append(anomaly_month)

        year = (start_date + pd.DateOffset(months=anomaly_month - 1)).year
        category = random.choice(["Shopping", "Entertainment", "Food"])
        normal_max = profile[category][1]
        spike_amount = int(normal_max * random.uniform(3, 5))  # 3x–5x spike

        transactions.append({
            "transaction_id": str(uuid.uuid4()),
            "user_id": user_id,
            "user_name": profile["name"],
            "spend_date": datetime(year, anomaly_month, random.randint(12, 25)).strftime("%Y-%m-%d"),
            "price": spike_amount,
            "category": category,
            "description": f"ANOMALY - {pick_merchant(category)}",
        })

# ─────────────────────────────────────────────────────────────────
#  Save CSV
# ─────────────────────────────────────────────────────────────────
df = pd.DataFrame(transactions)
df = df.sort_values(by=["spend_date", "user_id"]).reset_index(drop=True)
df.to_csv("data/transactions.csv", index=False)

print(f"Successfully generated {len(df)} realistic transactions!")
print(f"Columns: {list(df.columns)}")
print(f"Date range: {df['spend_date'].min()} → {df['spend_date'].max()}")
print(f"Users: {df['user_id'].unique().tolist()}")
print(f"Categories: {df['category'].unique().tolist()}")
print("Saved to 'data/transactions.csv'")