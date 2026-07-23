import React from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import KpiCards from '../components/KpiCards';
import ChartsSection from '../components/ChartsSection';
import CustomerProfile from '../components/CustomerProfile';
import RiskGauge from '../components/RiskGauge';
import Recommendations from '../components/Recommendations';
import WhatIfSimulator from '../components/WhatIfSimulator';
import LiveActivity from '../components/LiveActivity';

const Overview = () => (
  <motion.div
    className="p-4 space-y-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <Hero />
    <KpiCards />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2">
        <ChartsSection />
      </div>
      <div className="flex flex-col gap-4">
        <RiskGauge />
        <CustomerProfile />
        <Recommendations />
        <WhatIfSimulator />
        <LiveActivity />
      </div>
    </div>
  </motion.div>
);

export default Overview;
