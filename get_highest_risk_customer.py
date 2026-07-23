import pandas as pd
from model_manager import load_model
import model_manager

# Load model and feature columns
model, feature_cols, _ = load_model()
model_manager.FEATURE_COLUMNS = feature_cols

# Import preprocessing after setting FEATURE_COLUMNS
from preprocess import preprocess

# Load dataset
df = pd.read_csv('dataset.csv')
# Convert TotalCharges to numeric (as in training)
df['TotalCharges'] = pd.to_numeric(df.get('TotalCharges', 0), errors='coerce')
# For tenure == 0 replace TotalCharges with MonthlyCharges
df.loc[df['tenure'] == 0, 'TotalCharges'] = df.loc[df['tenure'] == 0, 'MonthlyCharges']

# Preprocess data
X = preprocess(df)

# Predict churn probabilities
probs = model.predict_proba(X)[:, 1]
idx = probs.argmax()
cust = df.iloc[idx]

# Determine risk level
risk = 'Low' if probs[idx] < 0.33 else ('Medium' if probs[idx] < 0.66 else 'High')

# Output required fields
print(cust['customerID'])
print(f"{probs[idx]*100:.2f}%")
print(int(cust['tenure']))
print(cust['Contract'])
print(cust['MonthlyCharges'])
print(cust['TotalCharges'])
print(risk)
