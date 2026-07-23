import streamlit as st

# MUST BE FIRST STREAMLIT COMMAND
st.set_page_config(page_title="Churn Prediction Dashboard", layout="wide")

import pandas as pd
import numpy as np
import plotly.express as px
import shap
from pathlib import Path

# Local imports
from model_manager import load_model

# ---------------------------------------------------------------------------
# Global CSS & Theme
# ---------------------------------------------------------------------------
st.markdown(
    """
    <style>
    .stApp {
        background-color: #0B0D17;
        color: #A0AEC0;
        font-family: 'Inter', sans-serif;
    }
    [data-testid="stSidebar"] {
        background-color: #161A2B;
    }
    .metric-card {
        background-color: #1A1A24;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 1rem;
        position: relative;
        overflow: hidden;
    }
    .metric-card::after {
        content: "";
        position: absolute;
        top: -2px; left: -2px; right: -2px; bottom: -2px;
        border: 2px solid;
        border-image-slice: 1;
        border-image-source: linear-gradient(45deg, #00F2FE, #FF00FF, #00E676);
        border-radius: 10px;
        pointer-events: none;
    }
    .metric-title { font-size: 1rem; color: #E0E0E0; }
    .metric-value { font-size: 2rem; font-weight: bold; color: #FFFFFF; }
    </style>
    """,
    unsafe_allow_html=True,
)

# ---------------------------------------------------------------------------
# Load Model
# ---------------------------------------------------------------------------
model, feature_cols, model_name = load_model()

# ---------------------------------------------------------------------------
# Load Data
# ---------------------------------------------------------------------------
DATA_PATH = Path(__file__).parent / "dataset.csv"

if DATA_PATH.exists():
    df_data = pd.read_csv(DATA_PATH)
else:
    df_data = pd.DataFrame()

customer_ids = df_data["customerID"].dropna().unique().tolist() if not df_data.empty else []

# ---------------------------------------------------------------------------
# FEATURE ENGINEERING (single source of truth)
# ---------------------------------------------------------------------------
def build_features(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()

    df["TotalCharges"] = pd.to_numeric(df.get("TotalCharges", 0), errors="coerce")
    df.loc[df["tenure"] == 0, "TotalCharges"] = df.loc[df["tenure"] == 0, "MonthlyCharges"]

    df["TotalCharges_to_MonthlyCharges_ratio"] = (
        df["TotalCharges"] / df["MonthlyCharges"].replace(0, np.nan)
    ).fillna(0.0)

    df["StreamingServices"] = (
        (df.get("StreamingTV") == "Yes").astype(int) +
        (df.get("StreamingMovies") == "Yes").astype(int)
    )

    df["OnlineSecurity_TechSupport"] = (
        (df.get("OnlineSecurity") == "Yes") &
        (df.get("TechSupport") == "Yes")
    ).astype(int)

    df = df.drop(columns=["customerID", "Churn"], errors="ignore")

    df = pd.get_dummies(df, drop_first=True)
    df = df.reindex(columns=feature_cols, fill_value=0)

    return df

# ---------------------------------------------------------------------------
# Prediction
# ---------------------------------------------------------------------------
def predict_risk(features: dict) -> float:
    df = pd.DataFrame([features])
    X = build_features(df)
    return model.predict_proba(X)[:, 1][0]

# ---------------------------------------------------------------------------
# Sidebar
# ---------------------------------------------------------------------------
st.sidebar.header("🔧 Controls")

selected_customer = st.sidebar.selectbox(
    "Select Customer ID",
    options=customer_ids if customer_ids else ["No Data"],
)

risk_threshold = st.sidebar.slider(
    "Risk Threshold (%)", 0, 100, 65
)

what_if = st.sidebar.checkbox("What-If Simulation")
monthly_adj = st.sidebar.number_input(
    "Adjust Monthly Charges", value=0.0
) if what_if else 0.0

# ---------------------------------------------------------------------------
# Get customer data
# ---------------------------------------------------------------------------
def get_customer(customer_id):
    if df_data.empty or customer_id == "No Data":
        return {}
    row = df_data[df_data["customerID"] == customer_id]
    if row.empty:
        return {}
    return row.drop(columns=["customerID", "Churn"], errors="ignore").iloc[0].to_dict()

# ---------------------------------------------------------------------------
# Main UI
# ---------------------------------------------------------------------------
st.title("📊 Churn Prediction Dashboard")

col1, col2, col3 = st.columns(3)

if selected_customer and selected_customer != "No Data":
    raw = get_customer(selected_customer)

    if what_if:
        raw["MonthlyCharges"] = raw.get("MonthlyCharges", 0) + monthly_adj

    risk = predict_risk(raw) * 100

    with col1:
        st.markdown(f"<div class='metric-card'><div class='metric-title'>Model</div><div class='metric-value'>{model_name}</div></div>", unsafe_allow_html=True)

    with col2:
        st.markdown(f"<div class='metric-card'><div class='metric-title'>Risk %</div><div class='metric-value'>{risk:.2f}%</div></div>", unsafe_allow_html=True)

    with col3:
        st.markdown(f"<div class='metric-card'><div class='metric-title'>Threshold</div><div class='metric-value'>{risk_threshold}%</div></div>", unsafe_allow_html=True)

# ---------------------------------------------------------------------------
# Risk distribution (cached safely)
# ---------------------------------------------------------------------------
@st.cache_data
def compute_all_risks():
    risks = []
    for cid in customer_ids:
        feats = get_customer(cid)
        if feats:
            risks.append(predict_risk(feats) * 100)
    return risks

if customer_ids:
    risks = compute_all_risks()

    fig = px.histogram(
        x=risks,
        nbins=30,
        range_x=[0, 100],
        title="Churn Risk Distribution",
        color_discrete_sequence=["#00F2FE"]
    )

    fig.update_layout(
        paper_bgcolor="#0B0D17",
        plot_bgcolor="#0B0D17",
        font_color="#A0AEC0"
    )

    st.plotly_chart(fig, use_container_width=True)

# ---------------------------------------------------------------------------
# SHAP EXPLANATION (safe version)
# ---------------------------------------------------------------------------
st.subheader("Feature Importance (SHAP)")

if selected_customer and selected_customer != "No Data":
    try:
        explainer = shap.TreeExplainer(model)

        raw = get_customer(selected_customer)
        df = build_features(pd.DataFrame([raw]))

        shap_values = explainer.shap_values(df)

        if isinstance(shap_values, list):
            shap_values = shap_values[1]

        importance = np.abs(shap_values[0])

        shap_df = pd.DataFrame({
            "feature": feature_cols,
            "importance": importance
        }).sort_values("importance", ascending=False)

        fig = px.bar(
            shap_df,
            x="importance",
            y="feature",
            orientation="h",
            color_discrete_sequence=["#FF00FF"]
        )

        fig.update_layout(
            paper_bgcolor="#0B0D17",
            plot_bgcolor="#0B0D17",
            font_color="#A0AEC0"
        )

        st.plotly_chart(fig, use_container_width=True)

    except Exception as e:
        st.warning(f"SHAP not available for this model: {str(e)}")

else:
    st.info("Select a customer to view explanation.")

# ---------------------------------------------------------------------------
# Footer
# ---------------------------------------------------------------------------
st.markdown("---")
st.markdown(
    "<div style='text-align:center;color:#A0AEC0'>Churn Dashboard • Streamlit + ML</div>",
    unsafe_allow_html=True
)