import { useEffect, useState } from "react";
import axios from "axios";

export default function Recommendations({ selectedCustomer }) {
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        axios
            .get(`http://127.0.0.1:5000/customer/${selectedCustomer}`)
            .then((res) => {
                const c = res.data;
                const recs = [];

                if (c.churnRisk > 70) {
                    recs.push({
                        title: "Immediate Personal Outreach",
                        impact: "Critical",
                        color: "text-red-400",
                        bg: "bg-red-500/10",
                    });
                }

                if (c.contract === "Month-to-month") {
                    recs.push({
                        title: "Upgrade to Annual Contract",
                        impact: "High",
                        color: "text-purple-400",
                        bg: "bg-purple-500/10",
                    });
                }

                if (c.monthlyCharges > 70) {
                    recs.push({
                        title: "Offer Loyalty Discount",
                        impact: "High",
                        color: "text-emerald-400",
                        bg: "bg-emerald-500/10",
                    });
                }

                if (c.tenure < 12) {
                    recs.push({
                        title: "Provide Onboarding Support",
                        impact: "Medium",
                        color: "text-cyan-400",
                        bg: "bg-cyan-500/10",
                    });
                }

                setRecommendations(recs);
            })
            .catch(console.error);
    }, [selectedCustomer]);

    if (recommendations.length === 0) {
        return (
            <div className="glass-card p-4 text-white">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-bold">
                        AI Recommendations
                    </h2>

                    <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs">
                        Healthy Customer
                    </span>
                </div>

                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <p className="text-emerald-300">
                        No retention action required.
                    </p>

                    <p className="text-gray-400 text-sm mt-1">
                        Customer is currently at low churn risk.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-card p-4 text-white">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold">
                    AI Recommendations
                </h2>

                <span className="px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs">
                    {recommendations.length} Actions
                </span>
            </div>

            <div className="space-y-2">
                {recommendations.map((item, index) => (
                    <div
                        key={index}
                        className="p-2 rounded-lg bg-white/5 border border-white/10"
                    >
                        <div className="flex items-center justify-between gap-2">
                            <h3 className="text-sm font-medium">
                                {item.title}
                            </h3>

                            <span
                                className={`px-2 py-1 rounded text-[10px] whitespace-nowrap ${item.bg} ${item.color}`}
                            >
                                {item.impact}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-3 p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <p className="text-cyan-300 text-xs">
                    Recommendations generated from customer profile
                </p>
            </div>
        </div>
    );
}