"""Train a simple demand prediction model.
Run: python training/train_model.py
"""
from pathlib import Path
import joblib
import numpy as np
from sklearn.linear_model import LinearRegression

# Example synthetic training data: [ad_spend, season_index, last_month_sales]
X = np.array([
    [5, 1, 100],
    [8, 1, 120],
    [12, 2, 140],
    [15, 2, 160],
    [18, 3, 200],
    [20, 3, 210],
], dtype=float)
y = np.array([105, 122, 145, 168, 208, 220], dtype=float)

model = LinearRegression()
model.fit(X, y)

output = Path(__file__).resolve().parents[1] / 'model' / 'demand_model.joblib'
output.parent.mkdir(parents=True, exist_ok=True)
joblib.dump(model, output)
print(f'Model saved to: {output}')
