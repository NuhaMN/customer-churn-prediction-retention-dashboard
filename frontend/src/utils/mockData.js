export const mockStats = {
  totalCustomers: 7043,
  highRisk: 1368,
  revenueAtRisk: 1_250_000,
  retentionOps: 87,
  modelAccuracy: 83.63,
  predictionConfidence: 88.1,
};

export const mockCharts = {
  churnDistribution: [
    { name: 'Low', value: 4194 },
    { name: 'Medium', value: 1481 },
    { name: 'High', value: 1368 },
  ],
  revenueImpact: [
    { month: 'Month-to-month', revenue: 257294 },
    { month: 'One year', revenue: 95816 },
    { month: 'Two year', revenue: 103005 },
  ],
};

export const mockCustomers = [
  {
    id: 'C001',
    name: 'Alice Johnson',
    risk: 78,
    contract: 'Month-to-month',
    services: ['Streaming', 'Tech Support'],
    charges: 89.99,
  },
  {
    id: 'C002',
    name: 'Bob Smith',
    risk: 34,
    contract: 'One year',
    services: ['Streaming'],
    charges: 56.45,
  },
];

export const mockRecommendations = [
  { title: 'Offer 20% Discount', impact: '-15% churn', type: 'discount' },
  { title: 'Upgrade to Premium Support', impact: '-10% churn', type: 'support' },
];
