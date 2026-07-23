import pandas as pd
from model_manager import load_model
import importlib

# Load model and obtain feature columns
model, feature_cols, _ = load_model()
# Dynamically set FEATURE_COLUMNS in model_manager for preprocess import
import model_manager
model_manager.FEATURE_COLUMNS = feature_cols

# Now import preprocess after FEATURE_COLUMNS is set
from preprocess import preprocess

def main():
    # Load raw dataset
    df_raw = pd.read_csv('dataset.csv')
    # Convert TotalCharges to numeric (as in training)
    df_raw['TotalCharges'] = pd.to_numeric(df_raw.get('TotalCharges', 0), errors='coerce')
    # For tenure == 0, replace TotalCharges with MonthlyCharges
    df_raw.loc[df_raw['tenure'] == 0, 'TotalCharges'] = df_raw.loc[df_raw['tenure'] == 0, 'MonthlyCharges']
    # Preprocess to match training features
    X = preprocess(df_raw)
    # Predict probabilities
    probs = model.predict_proba(X)[:, 1]
    # Classify risk levels
    low = (probs < 0.33).sum()
    medium = ((probs >= 0.33) & (probs < 0.66)).sum()
    high = (probs >= 0.66).sum()
    # Print results
    print(f"Low Risk: {low}")
    print(f"Medium Risk: {medium}")
    print(f"High Risk: {high}")
    # JavaScript snippet
    print("\n--- JavaScript Snippet ---\n")
    print(f"export const mockCharts = {{\n  churnDistribution: [\n    {{ name: 'Low', value: {low} }},\n    {{ name: 'Medium', value: {medium} }},\n    {{ name: 'High', value: {high} }},\n  ]\n}};\n")

if __name__ == "__main__":
    main()
