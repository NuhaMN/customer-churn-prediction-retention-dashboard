import React, { useState } from 'react';
import MainLayout from './layouts/MainLayout';

import Hero from './components/Hero';
import KpiCards from './components/KpiCards';
import ChartsSection from './components/ChartsSection';
import RiskGauge from './components/RiskGauge';
import CustomerProfile from './components/CustomerProfile';
import Recommendations from './components/Recommendations';
import WhatIfSimulator from './components/WhatIfSimulator';

export default function App() {
  const [selectedCustomer, setSelectedCustomer] = useState("6567-HOOPW");

  return (
    <MainLayout>
      <div className="space-y-6">

        <Hero
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
        />

        <KpiCards />

        <ChartsSection />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <CustomerProfile selectedCustomer={selectedCustomer} />
          <Recommendations selectedCustomer={selectedCustomer} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <RiskGauge selectedCustomer={selectedCustomer} />
          <WhatIfSimulator selectedCustomer={selectedCustomer} />
        </div>

      </div>
    </MainLayout>
  );
}