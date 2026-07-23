export default function Dashboard() {
  return (
    <>
      <h1 style={{ color: 'red', fontSize: '60px' }}>
        DASHBOARD TEST
      </h1>

      <div className="space-y-6">
        <Hero />

        <KpiCards />

        <ChartsSection />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <CustomerProfile />
          <Recommendations />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <RiskGauge />
          <WhatIfSimulator />
        </div>
      </div>
    </>
  );
}