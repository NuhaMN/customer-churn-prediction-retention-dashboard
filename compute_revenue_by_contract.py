import pandas as pd

def main():
    # Load dataset
    df = pd.read_csv('dataset.csv')
    # Ensure MonthlyCharges is numeric
    df['MonthlyCharges'] = pd.to_numeric(df['MonthlyCharges'], errors='coerce')
    # Group by Contract and sum MonthlyCharges
    revenue = df.groupby('Contract')['MonthlyCharges'].sum()
    # Extract values for expected contract types, default 0 if missing
    month_to_month = revenue.get('Month-to-month', 0)
    one_year = revenue.get('One year', 0)
    two_year = revenue.get('Two year', 0)
    # Print required format
    print(f"Month-to-month: {int(month_to_month)}")
    print(f"One year: {int(one_year)}")
    print(f"Two year: {int(two_year)}")
    # JavaScript snippet
    print("\n--- JavaScript Snippet ---\n")
    print(f"export const revenueImpact = [\n  {{ month: 'Month-to-month', revenue: {int(month_to_month)} }},\n  {{ month: 'One year', revenue: {int(one_year)} }},\n  {{ month: 'Two year', revenue: {int(two_year)} }},\n];")

if __name__ == "__main__":
    main()
