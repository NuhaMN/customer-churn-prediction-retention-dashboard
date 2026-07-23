import { useEffect, useState } from "react";
import axios from "axios";

export default function RiskGauge({ selectedCustomer }) {
    const [risk, setRisk] = useState(0);

    useEffect(() => {
        axios
            .get(`http://127.0.0.1:5000/customer/${selectedCustomer}`)
            .then((res) => setRisk(res.data.churnRisk))
            .catch((err) => console.error(err));
    }, [selectedCustomer]);

    return (
        <div className="glass-card p-4 text-white">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold">
                    Churn Risk Score
                </h2>

                <span className="px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-xs">
                    {risk > 65 ? "High Risk" : "Low Risk"}
                </span>
            </div>

            <div className="text-center mb-4">
                <div className="text-4xl font-bold text-red-400">
                    {risk}%
                </div>

                <p className="text-xs text-gray-400">
                    {risk > 65 ? "High Churn Probability" : "Low Churn Probability"}
                </p>
            </div>

            <div>
                <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Low</span>
                    <span className="text-gray-400">High</span>
                </div>

                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-emerald-400 via-yellow-400 to-red-500"
                        style={{ width: `${risk}%` }}
                    />
                </div>
            </div>

            <div className="mt-3 p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-red-300 text-xs font-medium">
                    {risk >= 70
                         ? "Immediate retention action recommended"
                        : risk >= 40
                        ? "Retention action recommended"
                        : "No immediate action required"}
                </p>

                <p className="text-gray-400 text-xs mt-1">
                    {risk >= 70
                        ? "Customer has high churn probability."
                        : risk >= 40
                        ? "Customer should be monitored closely."
                        : "Customer currently has low churn probability."}
                </p>
            </div>
        </div>
    );
}