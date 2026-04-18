import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, TrendingUp, DollarSign, Package } from 'lucide-react';
import { dashboardService } from '../services';
import { toast } from 'react-toastify';

const DashboardStats = ({ userRole }) => {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = userRole === 'farmer'
          ? await dashboardService.getFarmerStats()
          : await dashboardService.getConsumerStats();
        setStats(response.data);
      } catch (error) {
        toast.error(t('errors.loading_error'));
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userRole, t]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const statCards = userRole === 'farmer'
    ? [
        { label: t('farmer_dashboard.total_products'), value: stats?.totalProducts || 0, icon: Package, color: 'farm' },
        { label: t('farmer_dashboard.orders_received'), value: stats?.ordersReceived || 0, icon: TrendingUp, color: 'leaf' },
        { label: t('farmer_dashboard.earnings'), value: `₹${stats?.earnings || 0}`, icon: DollarSign, color: 'harvest' },
        { label: t('farmer_dashboard.pending_orders'), value: stats?.pendingOrders || 0, icon: BarChart3, color: 'farm' },
      ]
    : [
        { label: 'Total Orders', value: stats?.totalOrders || 0, icon: Package, color: 'farm' },
        { label: 'Total Spent', value: `₹${stats?.totalSpent || 0}`, icon: DollarSign, color: 'leaf' },
        { label: 'Favorite Sellers', value: stats?.favoriteSellers || 0, icon: TrendingUp, color: 'harvest' },
        { label: 'Saved Items', value: stats?.savedItems || 0, icon: BarChart3, color: 'farm' },
      ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        const colorClass = `${stat.color === 'farm' ? 'farm' : stat.color === 'leaf' ? 'leaf' : 'harvest'}`;
        return (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 bg-${colorClass}-50 rounded-lg`}>
                <Icon className={`text-${colorClass}-500`} size={24} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
