from flask import Flask, jsonify
import pandas as pd
from flask_cors import CORS
from flask import request

from model_manager import predict, load_model

app = Flask(__name__)
CORS(app)
df = pd.read_csv("dataset.csv")
@app.route("/customers")
def get_customers():
    return jsonify(df["customerID"].tolist())

@app.route("/customer/<customer_id>")
def get_customer(customer_id):

    row = df[df["customerID"] == customer_id]

    if row.empty:
        return jsonify({"error": "Customer not found"}), 404

    customer = row.iloc[0].to_dict()

    churn_prob = predict(customer)

    return jsonify({
        "customerID": customer["customerID"],
        "monthlyCharges": customer["MonthlyCharges"],
        "tenure": customer["tenure"],
        "contract": customer["Contract"],
        "internetService": customer["InternetService"],
        "paymentMethod": customer["PaymentMethod"],
        "churnRisk": round(churn_prob * 100, 2)
    })
@app.route("/simulate/<customer_id>", methods=["POST"])
def simulate(customer_id):

    row = df[df["customerID"] == customer_id]

    if row.empty:
        return jsonify({"error": "Customer not found"}), 404

    customer = row.iloc[0].to_dict()

    action = request.json.get("action")

    if action == "Upgrade Contract to Two Year":
        customer["Contract"] = "Two year"

    churn_prob = predict(customer)

    return jsonify({
        "churnRisk": round(churn_prob * 100, 2)
    })
@app.route("/model-performance")
def model_performance():

    _, _, model_name, metrics = load_model()

    return jsonify({
        "model": model_name,
        "performance": round(metrics["roc_auc"] * 100, 2)
    })

if __name__ == "__main__":
    app.run(debug=True)