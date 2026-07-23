import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';
import { mockCharts } from '../utils/mockData';
import { motion } from 'framer-motion';

const tooltipStyle = {
  background: '#111827',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  color: '#fff',
  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
};

const ChartsSection = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
    {/* Churn Distribution */}
    <motion.div
      className="glass-card p-4"
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
    >
      <div className="mb-2">
        <h3 className="text-white font-semibold">
          Churn Distribution
        </h3>
        <p className="text-gray-400 text-xs">
          Customers by risk category
        </p>
      </div>

      <ResponsiveContainer width="100%" height={190}>
        <BarChart data={mockCharts.churnDistribution}>
          <defs>
            <linearGradient id="churnGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22D3EE" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.08)"
          />

          <XAxis
            dataKey="name"
            stroke="#9CA3AF"
            tickLine={false}
            axisLine={false}
            fontSize={11}
          />

          <YAxis
            stroke="#9CA3AF"
            tickLine={false}
            axisLine={false}
            fontSize={11}
          />

          <Tooltip contentStyle={tooltipStyle} />

          <Bar
            dataKey="value"
            fill="url(#churnGradient)"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>

    {/* Revenue Impact */}
    <motion.div
      className="glass-card p-4"
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
    >
      <div className="mb-2">
        <h3 className="text-white font-semibold">
          Revenue Impact
        </h3>
        <p className="text-gray-400 text-xs">
          Revenue exposed to churn
        </p>
      </div>

      <ResponsiveContainer width="100%" height={190}>
        <LineChart data={mockCharts.revenueImpact}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.08)"
          />

          <XAxis
            dataKey="month"
            stroke="#9CA3AF"
            tickLine={false}
            axisLine={false}
            fontSize={11}
          />

          <YAxis
            stroke="#9CA3AF"
            tickLine={false}
            axisLine={false}
            fontSize={11}
          />

          <Tooltip contentStyle={tooltipStyle} />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#8B5CF6"
            strokeWidth={3}
            dot={{ r: 4, fill: '#8B5CF6' }}
            activeDot={{ r: 6, fill: '#22D3EE' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  </div>
);

export default ChartsSection;