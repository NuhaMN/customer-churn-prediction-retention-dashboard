import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { mockStats } from '../utils/mockData';

const Hero = ({ selectedCustomer, setSelectedCustomer }) => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    axios
      .get('http://127.0.0.1:5000/customers')
      .then((res) => setCustomers(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <section className="glass-card p-8 mb-6 text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-3xl rounded-full" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-3xl rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <div className="flex justify-between items-center flex-wrap gap-4 mb-4">

          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-medium">
              ● System Operational
            </span>

            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-sm font-medium">
              AI Prediction Engine Active
            </span>
          </div>

          <select
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            className="bg-slate-800 border border-cyan-500 rounded px-3 py-2 text-white"
          >
            {customers.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>

        </div>

        <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-3">
          Customer Churn
          <span className="text-cyan-400"> Intelligence </span>
          Dashboard
        </h1>

        <p className="text-gray-400 max-w-3xl text-lg">
          Monitor churn risk, identify revenue exposure, and
          generate AI-powered retention strategies in real time.
        </p>

        <div className="flex flex-wrap gap-6 mt-6">
          <div>
            <p className="text-gray-400 text-sm">Model Performance</p>
            <p className="text-2xl font-bold text-cyan-400">
              {mockStats.modelAccuracy}%
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-sm">Prediction Confidence</p>
            <p className="text-2xl font-bold text-purple-400">
              {mockStats.predictionConfidence}%
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-sm">Customers Monitored</p>
            <p className="text-2xl font-bold text-emerald-400">
              {mockStats.totalCustomers}
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;