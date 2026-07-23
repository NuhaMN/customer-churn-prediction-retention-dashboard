import { useEffect, useState } from "react";
import axios from "axios";

export default function CustomerProfile({ selectedCustomer }) {
    const [customer, setCustomer] = useState(null);

    useEffect(() => {
        axios
            .get(`http://127.0.0.1:5000/customer/${selectedCustomer}`)
            .then((res) => setCustomer(res.data))
            .catch((err) => console.error(err));
    }, [selectedCustomer]);

    if (!customer) {
        return (
            <div className="glass-card p-4 text-white">
                Loading customer...
            </div>
        );
    }

    return (
        <div className="glass-card p-4 text-white">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold">Customer Intelligence</h2>

                <span className="px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-xs">
                    {customer.churnRisk > 65 ? "High Risk" : "Low Risk"}
                </span>
            </div>

            <div className="mb-3">
                <h3 className="text-base font-semibold">
                    Customer Profile
                </h3>

                <p className="text-gray-400 text-xs">
                    Customer ID: {customer.customerID}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-white/5 rounded-lg p-2">
                    <p className="text-gray-400 text-[10px]">
                        Churn Probability
                    </p>

                    <p className="text-lg font-bold text-red-400">
                        {customer.churnRisk}%
                    </p>
                </div>

                <div className="bg-white/5 rounded-lg p-2">
                    <p className="text-gray-400 text-[10px]">
                        Monthly Charges
                    </p>

                    <p className="text-lg font-bold text-cyan-400">
                        ${customer.monthlyCharges}
                    </p>
                </div>

                <div className="bg-white/5 rounded-lg p-2">
                    <p className="text-gray-400 text-[10px]">
                        Tenure
                    </p>

                    <p className="text-sm font-semibold">
                        {customer.tenure} Month(s)
                    </p>
                </div>

                <div className="bg-white/5 rounded-lg p-2">
                    <p className="text-gray-400 text-[10px]">
                        Contract
                    </p>

                    <p className="text-sm font-semibold">
                        {customer.contract}
                    </p>
                </div>
            </div>
        </div>
    );
}