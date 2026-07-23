import os
import pandas as pd
import sqlite3

# Paths
PROJECT_ROOT = os.path.abspath(os.path.dirname(__file__))
DATA_CSV = os.path.join(PROJECT_ROOT, "dataset.csv")
DB_PATH = os.path.join(PROJECT_ROOT, "churn_data.db")

def create_database(csv_path=DATA_CSV, db_path=DB_PATH):
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"CSV file not found at {csv_path}")
    df = pd.read_csv(csv_path)
    # Ensure correct column types
    df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
    # Connect to SQLite and write table
    conn = sqlite3.connect(db_path)
    df.to_sql('customers', conn, if_exists='replace', index=False)
    conn.close()
    print(f"Database created at {db_path} with table 'customers' ({len(df)} rows)")

if __name__ == "__main__":
    create_database()
