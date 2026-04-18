import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, List, Package, TrendingUp, User as UserIcon, Menu, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import useAuthStore from '../context/authStore';
import Navbar from '../components/Navbar';
import DashboardStats from '../components/DashboardStats';
import AddProductPage from './farmer/AddProductPage';
import MyProductsPage from './farmer/MyProductsPage';
import FarmerOrdersPage from './farmer/FarmerOrdersPage';
import EarningsPage from './farmer/EarningsPage';

const FarmerDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showRoleWarning, setShowRoleWarning] = useState(false);

  // Role protection
  useEffect(() => {
    if (user && user.role === 'consumer') {
      setShowRoleWarning(true);
      toast.error('⚠️ You are a Consumer, not a Farmer! Redirecting...');
      setTimeout(() => {
        navigate('/consumer');
      }, 2000);
    }
  }, [user, navigate]);

  if (showRoleWarning && user?.role === 'consumer') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-orange-50 flex items-center justify-center">
        <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-xl text-center">
          <div className="mb-4 flex justify-center">
            <div className="p-4 bg-red-100 rounded-full">
              <AlertCircle size={40} className="text-red-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You are logged in as a <strong>Consumer</strong>, but tried to access the Farmer Dashboard.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 text-left">
            <p className="text-sm text-blue-800">
              <strong>ℹ️ Different Accounts:</strong> Farmers and Consumers need separate accounts. Please log in with your farmer account to access this area.
            </p>
          </div>
          <button
            onClick={() => navigate('/consumer')}
            className="w-full px-6 py-3 bg-farm-500 text-white font-bold rounded-lg hover:bg-farm-600 transition-colors"
          >
            Go to Consumer Dashboard
          </button>
        </div>
      </div>
    );
  }

  const sidebarItems = [
    { label: t('farmer_dashboard.title'), icon: Package, path: '/farmer' },
    { label: t('farmer_dashboard.add_product'), icon: Plus, path: '/farmer/add-product' },
    { label: t('farmer_dashboard.my_products'), icon: List, path: '/farmer/products' },
    { label: t('farmer_dashboard.orders'), icon: Package, path: '/farmer/orders' },
    { label: t('farmer_dashboard.earnings_page'), icon: TrendingUp, path: '/farmer/earnings' },
    { label: t('farmer_dashboard.profile'), icon: UserIcon, path: '/profile' },
  ];

  return (
    <div className="min-h-screen bg-sand-50">
      <Navbar />

      <div className="flex">
        {/* Sidebar */}
        <div className={`fixed md:relative w-64 bg-white shadow-lg h-[calc(100vh-80px)] overflow-y-auto z-40 transform transition-transform md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 space-y-4">
            {sidebarItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-farm-50 text-gray-700 hover:text-farm-500 transition"
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 md:ml-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden m-4 p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={24} />
          </button>

          <div className="p-8">
            <Routes>
              <Route
                index
                element={
                  <>
                    <div className="mb-8">
                      <h1 className="heading-lg mb-2 text-farm-500">{t('farmer_dashboard.title')}</h1>
                      <p className="text-gray-600">{t('farmer_dashboard.welcome', { name: 'Farmer' })}</p>
                    </div>
                    <DashboardStats userRole="farmer" />
                  </>
                }
              />
              <Route path="/add-product" element={<AddProductPage />} />
              <Route path="/products" element={<MyProductsPage />} />
              <Route path="/orders" element={<FarmerOrdersPage />} />
              <Route path="/earnings" element={<EarningsPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
