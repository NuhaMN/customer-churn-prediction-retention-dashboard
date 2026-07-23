import pandas as pd
import numpy as np
from model_manager import FEATURE_COLUMNS

def preprocess(df: pd.DataFrame) -> pd.DataFrame:
    """Apply the same preprocessing steps used during training.
    - Calculates TotalCharges_to_MonthlyCharges_ratio
    - Creates StreamingServices and OnlineSecurity_TechSupport features
    - Drops original raw columns
    - One‑hot encodes categorical variables
    - Reindexes to the saved feature column order.
    """
    df = df.copy()
    # Feature engineering
    df['TotalCharges_to_MonthlyCharges_ratio'] = (
        df['TotalCharges'] / df['MonthlyCharges'].replace(0, np.nan)
    ).fillna(0.0)
    df['StreamingServices'] = (
        (df['StreamingTV'] == 'Yes').astype(int) + (df['StreamingMovies'] == 'Yes').astype(int)
    )
    df['OnlineSecurity_TechSupport'] = (
        (df['OnlineSecurity'] == 'Yes') & (df['TechSupport'] == 'Yes')
    ).astype(int)
    # Drop identifiers and target
    df = df.drop(columns=['customerID', 'Churn'], errors='ignore')
    # One‑hot encode
    df_enc = pd.get_dummies(df, drop_first=True)
    # Align columns with training features
    df_enc = df_enc.reindex(columns=FEATURE_COLUMNS, fill_value=0)
    return df_enc
