import { useEffect, useState } from "react";
import axios from "axios";

export default function WhatIfSimulator({ selectedCustomer }) {
    const [currentRisk, setCurrentRisk] = useState(0);
    const [predictedRisk, setPredictedRisk] = useState(0);
    const [actions, setActions] = useState([]);

    useEffect(() => {
        if (!selectedCustomer) return;

        axios
            .get(`http://127.0.0.1:5000/customer/${selectedCustomer}`)
            .then((res) => {
                const c = res.data;
                const risk = c.churnRisk;

                setCurrentRisk(risk);

                let simulatedRisk = risk;
                const selectedActions = [];

                if (c.contract === "Month-to-month") {
                    selectedActions.push(
                        "Upgrade Contract to Two Year"
                    );
                    simulatedRisk -= 20;
                }

                if (c.monthlyCharges > 70) {
                    selectedActions.push(
                        "Offer Loyalty Discount"
                    );
                    simulatedRisk -= 10;
                }

                if (c.tenure < 12) {
                    selectedActions.push(
                        "Provide Premium Support"
                    );
                    simulatedRisk -= 5;
                }

                if (selectedActions.length === 0) {
                    selectedActions.push(
                        "No Action Required"
                    );
                }

                simulatedRisk = Math.max(
                    5,
                    simulatedRisk
                );

                setActions(selectedActions);
                setPredictedRisk(
                    simulatedRisk.toFixed(2)
                );
            })
            .catch(console.error);
    }, [selectedCustomer]);

    const improvement = Math.max(
        0,
        (currentRisk - predictedRisk).toFixed(2)
    );

    return (
        <div className="glass-card p-4 text-white">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold">
                    What-If Simulator
                </h2>

                <span className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs">
                    Live Simulation
                </span>
            </div>

            <div className="p-2 rounded-lg bg-white/5 mb-3">
                <p className="text-[10px] text-gray-400">
                    Retention Actions
                </p>

                <div className="mt-2 space-y-1">
                    {actions.map((action, index) => (
                        <p
                            key={index}
                            className="text-sm"
                        >
                            ✓ {action}
                        </p>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-white/5 rounded-lg p-2">
                    <p className="text-[10px] text-gray-400">
                        Current Risk
                    </p>

                    <p className="text-xl font-bold text-red-400">
                        {currentRisk}%
                    </p>
                </div>

                <div className="bg-white/5 rounded-lg p-2">
                    <p className="text-[10px] text-gray-400">
                        Predicted Risk
                    </p>

                    <p className="text-xl font-bold text-emerald-400">
                        {predictedRisk}%
                    </p>
                </div>
            </div>

            <div className="mb-3">
                <p className="text-xs text-gray-400 mb-1">
                    Risk Reduction
                </p>

                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-purple-500 to-cyan-400"
                        style={{
                            width: `${Math.min(
                                improvement,
                                100
                            )}%`,
                        }}
                    />
                </div>

                <p className="mt-1 text-xs text-emerald-400 font-medium">
                    {improvement}% improvement
                </p>
            </div>
        </div>
    );
}
