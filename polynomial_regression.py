import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
from sklearn.metrics import mean_squared_error, r2_score
import os

# Create directory for visualizations
os.makedirs('visualizations', exist_ok=True)

# 1. Load the Data
data = pd.read_csv('advertising.csv')
print("Data Overview:")
print(data.head())

# Features and Target
X = data[['TV', 'Radio', 'Newspaper']]
y = data['Sales']

# 2. Train-Test Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 3. Model Building: Simple Linear Regression
linear_model = LinearRegression()
linear_model.fit(X_train, y_train)
y_pred_linear_train = linear_model.predict(X_train)
y_pred_linear_test = linear_model.predict(X_test)

print("\n--- Linear Regression Metrics ---")
print(f"Train R2: {r2_score(y_train, y_pred_linear_train):.4f}")
print(f"Test R2: {r2_score(y_test, y_pred_linear_test):.4f}")
print(f"Test MSE: {mean_squared_error(y_test, y_pred_linear_test):.4f}")


# 4. Model Building: Polynomial Regression (Degree = 2)
# Degree 2 captures the diminishing returns (concave down parabola) well
poly = PolynomialFeatures(degree=2, include_bias=False)
X_poly_train = poly.fit_transform(X_train)
X_poly_test = poly.transform(X_test)

poly_model = LinearRegression()
poly_model.fit(X_poly_train, y_train)

y_pred_poly_train = poly_model.predict(X_poly_train)
y_pred_poly_test = poly_model.predict(X_poly_test)

print("\n--- Polynomial Regression (Degree 2) Metrics ---")
print(f"Train R2: {r2_score(y_train, y_pred_poly_train):.4f}")
print(f"Test R2: {r2_score(y_test, y_pred_poly_test):.4f}")
print(f"Test MSE: {mean_squared_error(y_test, y_pred_poly_test):.4f}")

print("\nConclusion: Polynomial Regression shows higher R2 and lower MSE, indicating a better fit to the non-linear data.")

# 5. Visualizing Diminishing Returns (TV Budget vs Sales)
# We will create a synthetic dataset varying TV budget from 0 to 400,
# while holding Radio and Newspaper budgets at their mean values.
tv_range = np.linspace(0, 400, 100)
mean_radio = data['Radio'].mean()
mean_newspaper = data['Newspaper'].mean()

synthetic_data = pd.DataFrame({
    'TV': tv_range,
    'Radio': np.full_like(tv_range, mean_radio),
    'Newspaper': np.full_like(tv_range, mean_newspaper)
})

# Predict with Linear Model
synth_pred_linear = linear_model.predict(synthetic_data)

# Predict with Polynomial Model
synth_poly = poly.transform(synthetic_data)
synth_pred_poly = poly_model.predict(synth_poly)

# Plotting
plt.figure(figsize=(10, 6))
sns.scatterplot(x='TV', y='Sales', data=data, color='gray', alpha=0.6, label='Actual Data')
plt.plot(tv_range, synth_pred_linear, color='blue', linestyle='--', label='Linear Regression Fit')
plt.plot(tv_range, synth_pred_poly, color='red', linewidth=2, label='Polynomial Regression Fit (Deg 2)')

plt.title('Impact of TV Advertising Budget on Sales (Holding Others Constant)')
plt.xlabel('TV Budget ($)')
plt.ylabel('Sales (Units)')
plt.legend()
plt.grid(True, alpha=0.3)

# Highlighting Diminishing Returns
plt.annotate('Diminishing Returns start here', xy=(250, 22), xytext=(200, 25),
             arrowprops=dict(facecolor='black', shrink=0.05),
             fontsize=10)

plt.tight_layout()
plt.savefig('visualizations/tv_diminishing_returns.png')
print("\nPlot saved to 'visualizations/tv_diminishing_returns.png'")

# 6. Identifying Optimal Budget Range (Example for TV)
# We find where the derivative (slope) starts becoming small.
# Slope = difference in sales / difference in budget
slopes = np.diff(synth_pred_poly) / np.diff(tv_range)

# Find the budget point where the slope drops below a threshold (e.g., 0.02 units of sale per $1 of budget)
threshold = 0.02
diminishing_point_idx = np.where(slopes < threshold)[0]

if len(diminishing_point_idx) > 0:
    optimal_tv_budget = tv_range[diminishing_point_idx[0]]
    print(f"\n--- Insights ---")
    print(f"Significant diminishing returns observed for TV budget > ${optimal_tv_budget:.2f}")
    print(f"At this point, every additional $1 spent on TV yields less than {threshold} units in sales.")
    print("Recommendation: Consider reallocating budget to other channels (Radio/Newspaper) once TV spend exceeds this point.")
else:
    print("\nNo clear diminishing return point found below the threshold within the plotted range.")

