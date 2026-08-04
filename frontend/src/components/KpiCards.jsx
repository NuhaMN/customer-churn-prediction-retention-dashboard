import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { mockStats } from '../utils/mockData';

const cards = [
  {
    title: 'Customers At Risk',
    value: mockStats.highRisk,
    color: 'text-red-400',
    width: '19%'
  },
  {
    title: 'Revenue At Risk',
    value: `$${mockStats.revenueAtRisk.toLocaleString()}`,
    color: 'text-emerald-400',
    width: '45%'
  },
  {
    title: 'Retention Opportunities',
    value: mockStats.retentionOps,
    color: 'text-cyan-400',
    width: '80%'
  },
  {
    title: 'Model Performance',
    value: `${mockStats.modelAccuracy}%`,
    color: 'text-purple-400',
    width: '84%'
  }
];

export default function KpiCards() {
  const [modelPerformance, setModelPerformance] = useState(mockStats.modelAccuracy);

useEffect(() => {
  fetch("http://127.0.0.1:5000/model-performance")
    .then((res) => res.json())
    .then((data) => setModelPerformance(data.performance))
    .catch((err) => console.error(err));
}, []);

const cards = [
  {
    title: 'Customers At Risk',
    value: mockStats.highRisk,
    color: 'text-red-400',
    width: '19%'
  },
  {
    title: 'Revenue At Risk',
    value: `$${mockStats.revenueAtRisk.toLocaleString()}`,
    color: 'text-emerald-400',
    width: '45%'
  },
  {
    title: 'Retention Opportunities',
    value: mockStats.retentionOps,
    color: 'text-cyan-400',
    width: '80%'
  },
  {
    title: 'Model Performance',
    value: `${modelPerformance}%`,
    color: 'text-purple-400',
    width: '84%'
  }
];
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
      {cards.map((card) => (
        <motion.div
          key={card.title}
          whileHover={{ y: -2 }}
          className="glass-card p-3"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs">
              {card.title}
            </span>
          </div>

          <div className={`text-xl xl:text-2xl font-bold ${card.color}`}>
            {typeof card.value === 'string' ? (
              card.value
            ) : (
              <CountUp
                end={card.value}
                duration={2}
                separator=","
              />
            )}
          </div>

          <div className="mt-2 h-1 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-purple-500"
              style={{ width: card.width }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}