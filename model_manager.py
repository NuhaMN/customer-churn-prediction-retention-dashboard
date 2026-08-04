import os
import pickle
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score
)
import sqlite3

# Paths
PROJECT_ROOT = os.path.abspath(os.path.dirname(__file__))
MODEL_PATH = os.path.join(PROJECT_ROOT, "best_model.pkl")


def _load_data(db_path=os.path.join(PROJECT_ROOT, "churn_data.db")):
    """Load and preprocess churn dataset from SQLite database."""

    conn = sqlite3.connect(db_path)
    df = pd.read_sql_query("SELECT * FROM customers", conn)
    conn.close()

    # Basic cleaning
    df["TotalCharges"] = pd.to_numeric(df["TotalCharges"], errors="coerce")
    df.loc[df["tenure"] == 0, "TotalCharges"] = df.loc[
        df["tenure"] == 0, "MonthlyCharges"
    ]

    # Feature engineering
    df["TotalCharges_to_MonthlyCharges_ratio"] = (
        df["TotalCharges"] /
        df["MonthlyCharges"].replace(0, np.nan)
    ).fillna(0.0)

    df["StreamingServices"] = (
        (df["StreamingTV"] == "Yes").astype(int) +
        (df["StreamingMovies"] == "Yes").astype(int)
    )

    df["OnlineSecurity_TechSupport"] = (
        (df["OnlineSecurity"] == "Yes") &
        (df["TechSupport"] == "Yes")
    ).astype(int)

    # Target encoding
    df["Churn"] = df["Churn"].apply(
        lambda x: 1 if x == "Yes" else 0
    )

    X = df.drop(columns=["customerID", "Churn"])
    y = df["Churn"]

    X_encoded = pd.get_dummies(X, drop_first=True)

    return X_encoded, y


def train_and_save_best_model(
    test_size: float = 0.3,
    random_state: int = 42
    ):


    X, y = _load_data()

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=test_size,
        random_state=random_state,
        stratify=y
    )

    models = {
        "Random Forest": RandomForestClassifier(
            n_estimators=250,
            max_depth=20,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            class_weight="balanced"
        ),

        "XGBoost": XGBClassifier(
            n_estimators=300,
            max_depth=6,
            learning_rate=0.05,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42,
            eval_metric="logloss"
        )
    }

    best_model = None
    best_name = None
    best_auc = 0
    best_metrics = {}

    for name, model in models.items():

        model.fit(X_train, y_train)

        y_pred = model.predict(X_test)
        y_prob = model.predict_proba(X_test)[:, 1]

        accuracy = accuracy_score(y_test, y_pred)
        precision = precision_score(y_test, y_pred)
        recall = recall_score(y_test, y_pred)
        f1 = f1_score(y_test, y_pred)
        roc_auc = roc_auc_score(y_test, y_prob)

        print(f"\n===== {name} =====")
        print(f"Accuracy : {accuracy:.4f}")
        print(f"Precision: {precision:.4f}")
        print(f"Recall   : {recall:.4f}")
        print(f"F1 Score : {f1:.4f}")
        print(f"ROC-AUC  : {roc_auc:.4f}")

        if roc_auc > best_auc:
            best_auc = roc_auc
            best_model = model
            best_name = name

            best_metrics = {
            "roc_auc": roc_auc
    }

    print("\n===================================")
    print(f"Final Model : {best_name}")
    print("===================================\n")

    with open(MODEL_PATH, "wb") as f:
        pickle.dump(
    {
        "model": best_model,
        "features": X.columns.tolist(),
        "name": best_name,
        "metrics": best_metrics
    },
    f
    )

    print(f"Saved {best_name} model to:\n{MODEL_PATH}")

    return best_model, X.columns.tolist()


def load_model():
    """Load persisted model."""

    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(
            "Model not found. Run train_and_save_best_model() first."
        )

    with open(MODEL_PATH, "rb") as f:
        data = pickle.load(f)

    return (
        data["model"],
        data["features"],
        data.get("name", "Random Forest"),
        data.get("metrics", {})
    )


def predict(customer_dict: dict):
    """
    Predict churn probability for a single customer.
    """

    model, feature_cols, _, _ = load_model()

    df = pd.DataFrame([customer_dict])

    df["TotalCharges"] = pd.to_numeric(
        df.get("TotalCharges", 0),
        errors="coerce"
    )

    df.loc[df["tenure"] == 0, "TotalCharges"] = df.loc[
        df["tenure"] == 0,
        "MonthlyCharges"
    ]

    df["TotalCharges_to_MonthlyCharges_ratio"] = (
        df["TotalCharges"] /
        df["MonthlyCharges"].replace(0, np.nan)
    ).fillna(0.0)

    df["StreamingServices"] = (
        (df.get("StreamingTV") == "Yes").astype(int) +
        (df.get("StreamingMovies") == "Yes").astype(int)
    )

    df["OnlineSecurity_TechSupport"] = (
        (df.get("OnlineSecurity") == "Yes") &
        (df.get("TechSupport") == "Yes")
    ).astype(int)

    df = df.drop(
        columns=["customerID", "Churn"],
        errors="ignore"
    )

    df_enc = pd.get_dummies(df, drop_first=True)

    df_enc = df_enc.reindex(
        columns=feature_cols,
        fill_value=0
    )

    prob = model.predict_proba(df_enc)[:, 1][0]

    return prob


if __name__ == "__main__":
    train_and_save_best_model()