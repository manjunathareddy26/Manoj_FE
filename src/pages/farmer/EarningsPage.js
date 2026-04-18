import React from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, DollarSign } from 'lucide-react';

const EarningsPage = () => {
  const { t } = useTranslation();

  const earnings = [
    { month: 'January', amount: 15000 },
    { month: 'February', amount: 18500 },
    { month: 'March', amount: 12300 },
  ];

  const totalEarnings = earnings.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div>
      <h1 className="heading-lg text-farm-500 mb-8">{t('farmer_dashboard.earnings_page')}</h1>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-2">Total Earnings</p>
              <p className="text-4xl font-bold text-farm-500">₹{totalEarnings}</p>
            </div>
            <div className="p-4 bg-farm-50 rounded-lg">
              <DollarSign className="text-farm-500" size={32} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-2">This Month</p>
              <p className="text-4xl font-bold text-leaf-300">₹{earnings[earnings.length - 1].amount}</p>
            </div>
            <div className="p-4 bg-leaf-50 rounded-lg">
              <TrendingUp className="text-leaf-300" size={32} />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="heading-sm mb-6">Monthly Breakdown</h2>
        <div className="space-y-4">
          {earnings.map((earning, index) => (
            <div key={index} className="flex items-center justify-between pb-4 border-b last:border-b-0">
              <span className="font-semibold">{earning.month}</span>
              <span className="text-2xl font-bold text-farm-500">₹{earning.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EarningsPage;
