import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  Plus, Package, TrendingUp, User as UserIcon, Menu, AlertCircle,
  LogOut, Leaf, X, Home, ShoppingBag, IndianRupee, Clock,
  CheckCircle, RefreshCw, BarChart3, ChevronRight, List,
} from 'lucide-react';
import { toast } from 'react-toastify';
import useAuthStore from '../context/authStore';
import { dashboardService, orderService } from '../services/index';
import AddProductPage from './farmer/AddProductPage';
import MyProductsPage from './farmer/MyProductsPage';
import FarmerOrdersPage from './farmer/FarmerOrdersPage';
import EarningsPage from './farmer/EarningsPage';

// ─── Sidebar Nav Item ─────────────────────────────────────────────────────────
const NavItem = ({ icon: Icon, label, path, active, onClick, badge }) => {
  const isActive = active === path;
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group ${
        isActive
          ? 'bg-white/20 text-white shadow-sm font-semibold border border-white/20'
          : 'text-farm-100 hover:bg-white/10 hover:text-white'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={18} className={isActive ? 'text-white' : 'text-farm-200 group-hover:text-white transition-colors'} />
        <span className="text-sm">{label}</span>
      </div>
      {badge > 0 && (
        <span className="bg-harvest-300 text-farm-900 text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
          {badge}
        </span>
      )}
    </button>
  );
};

// ─── Farmer Home (Dashboard Index) ───────────────────────────────────────────
const FarmerHome = ({ user }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes] = await Promise.all([
        dashboardService.getFarmerStats(),
        orderService.getFarmerOrders(),
      ]);
      setStats(statsRes.data);
      const raw = ordersRes.data?.orders || ordersRes.data || [];
      setRecentOrders(Array.isArray(raw) ? raw.slice(0, 5) : []);
    } catch {
      // fail silently — stats will show zeros
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const statCards = [
    { label: 'Total Products',   value: stats?.totalProducts ?? 0,                                    icon: Package,      color: 'text-farm-500',    bg: 'bg-farm-50',    border: 'border-farm-100'    },
    { label: 'Orders Received',  value: stats?.ordersReceived ?? 0,                                   icon: ShoppingBag,  color: 'text-blue-500',    bg: 'bg-blue-50',    border: 'border-blue-100'    },
    { label: 'Total Revenue',    value: `₹${Number(stats?.earnings ?? 0).toLocaleString('en-IN')}`,  icon: IndianRupee,  color: 'text-harvest-400', bg: 'bg-harvest-50', border: 'border-harvest-100' },
    { label: 'Pending Orders',   value: stats?.pendingOrders ?? 0,                                    icon: Clock,        color: 'text-amber-500',   bg: 'bg-amber-50',   border: 'border-amber-100'   },
  ];

  const quickActions = [
    { label: 'Add New Product', icon: Plus,       path: '/farmer/add-product', color: 'bg-farm-500 hover:bg-farm-600',   desc: 'List a new crop or product' },
    { label: 'My Products',     icon: List,       path: '/farmer/products',    color: 'bg-blue-500 hover:bg-blue-600',    desc: 'Manage your listings'        },
    { label: 'View Orders',     icon: Package,    path: '/farmer/orders',      color: 'bg-purple-500 hover:bg-purple-600',desc: 'Manage incoming orders'      },
    { label: 'Earnings',        icon: BarChart3,  path: '/farmer/earnings',    color: 'bg-harvest-400 hover:bg-harvest-500', desc: 'Track your income'        },
  ];

  const STATUS_COLORS = {
    pending:   'bg-amber-100 text-amber-800 border-amber-200',
    accepted:  'bg-blue-100 text-blue-800 border-blue-200',
    confirmed: 'bg-purple-100 text-purple-800 border-purple-200',
    packed:    'bg-indigo-100 text-indigo-800 border-indigo-200',
    shipped:   'bg-orange-100 text-orange-800 border-orange-200',
    delivered: 'bg-green-100 text-green-800 border-green-200',
    rejected:  'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0] || 'Farmer'}!
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Here's what's happening on your farm today.</p>
        </div>
        <button
          onClick={loadData}
          className="flex items-center gap-1.5 px-3 py-2 text-sm text-farm-600 hover:bg-farm-50 rounded-xl transition-colors font-medium border border-farm-100"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm animate-pulse h-20" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <div key={stat.label} className={`bg-white rounded-2xl p-4 border ${stat.border} shadow-sm flex items-center gap-3`}>
              <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <stat.icon size={18} className={stat.color} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium leading-tight">{stat.label}</p>
                <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className={`${action.color} text-white rounded-2xl p-4 text-left transition-all shadow-sm hover:shadow-md group`}
            >
              <action.icon size={22} className="mb-2 opacity-90" />
              <p className="font-semibold text-sm">{action.label}</p>
              <p className="text-xs opacity-70 mt-0.5">{action.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Recent Orders</h2>
          <button
            onClick={() => navigate('/farmer/orders')}
            className="flex items-center gap-1 text-sm text-farm-600 hover:text-farm-700 font-medium"
          >
            View all <ChevronRight size={14} />
          </button>
        </div>
        {recentOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <Package size={36} className="mx-auto mb-3 text-gray-200" />
            <p className="text-gray-500 font-medium">No orders yet</p>
            <p className="text-gray-400 text-sm mt-1">Orders from consumers will appear here</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentOrders.map((order) => {
              const statusClass = STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700 border-gray-200';
              return (
                <div
                  key={order.id}
                  onClick={() => navigate('/farmer/orders')}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="w-9 h-9 bg-farm-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Package size={16} className="text-farm-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">Order #{order.id}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusClass} capitalize hidden sm:inline-flex`}>
                    {order.status}
                  </span>
                  <p className="font-bold text-farm-500 flex-shrink-0">
                    ₹{Number(order.total_amount).toLocaleString('en-IN')}
                  </p>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-farm-400 transition-colors flex-shrink-0" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const FarmerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [mobileSidebar, setMobileSidebar] = useState(false);

  // Role protection
  useEffect(() => {
    if (user && user.role === 'consumer') {
      toast.error('Access denied. Redirecting to Consumer Dashboard...');
      navigate('/consumer');
    }
  }, [user, navigate]);

  if (user?.role === 'consumer') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-orange-50 flex items-center justify-center">
        <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-xl text-center">
          <div className="mb-4 flex justify-center">
            <div className="p-4 bg-red-100 rounded-full">
              <AlertCircle size={40} className="text-red-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You are logged in as a <strong>Consumer</strong>. Please use your farmer account.
          </p>
          <button onClick={() => navigate('/consumer')} className="w-full px-6 py-3 bg-farm-500 text-white font-bold rounded-xl hover:bg-farm-600 transition-colors">
            Go to Consumer Dashboard
          </button>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'Dashboard',    icon: Home,        path: '/farmer'             },
    { label: 'Add Product',  icon: Plus,        path: '/farmer/add-product' },
    { label: 'My Products',  icon: List,        path: '/farmer/products'    },
    { label: 'Orders',       icon: Package,     path: '/farmer/orders'      },
    { label: 'Earnings',     icon: TrendingUp,  path: '/farmer/earnings'    },
  ];

  // Determine the active nav path
  const activePath = navItems.find(n => n.path !== '/farmer' && location.pathname.startsWith(n.path))?.path
    ?? (location.pathname === '/farmer' ? '/farmer' : null);

  const PAGE_TITLES = {
    '/farmer':             'My Dashboard',
    '/farmer/add-product': 'Add New Product',
    '/farmer/products':    'My Products',
    '/farmer/orders':      'Orders',
    '/farmer/earnings':    'Earnings',
  };
  const pageTitle = PAGE_TITLES[location.pathname] || 'Farmer Portal';

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  return (
    <div className="flex h-screen bg-sand-50 overflow-hidden">

      {/* Mobile overlay */}
      {mobileSidebar && (
        <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setMobileSidebar(false)} />
      )}

      {/* ──── SIDEBAR ──── */}
      <aside className={`fixed md:relative z-40 h-full w-64 flex-shrink-0 bg-gradient-to-b from-farm-900 to-farm-800 flex flex-col shadow-2xl transition-transform duration-300 ${mobileSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>

        {/* Logo */}
        <div className="p-5 border-b border-farm-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-harvest-300 rounded-xl flex items-center justify-center flex-shrink-0">
                <Leaf size={20} className="text-farm-900" />
              </div>
              <div>
                <h1 className="text-white font-bold text-base leading-tight">FarmBridge</h1>
                <p className="text-farm-300 text-xs">Farmer Portal</p>
              </div>
            </div>
            <button onClick={() => setMobileSidebar(false)} className="md:hidden text-farm-300 hover:text-white">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="mx-3 mt-4 mb-2 p-3 bg-white/10 rounded-xl border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-harvest-300 rounded-full flex items-center justify-center text-farm-900 font-bold text-sm flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'F'}
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm truncate">{user?.name || 'Farmer'}</p>
              <p className="text-farm-300 text-xs truncate">{user?.email || ''}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              active={activePath}
              onClick={() => { navigate(item.path); setMobileSidebar(false); }}
            />
          ))}
        </nav>

        {/* Bottom: Profile & Logout */}
        <div className="p-3 border-t border-farm-700 space-y-0.5">
          <button
            onClick={() => { navigate('/profile'); setMobileSidebar(false); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-farm-100 hover:bg-white/10 hover:text-white transition-all text-sm"
          >
            <UserIcon size={18} className="text-farm-200" />
            <span>Profile</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-300 hover:bg-red-900/30 hover:text-red-200 transition-all text-sm"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ──── MAIN ──── */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Top Header */}
        <header className="bg-white border-b border-gray-100 px-5 py-3.5 flex items-center justify-between flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileSidebar(true)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-xl text-gray-600"
            >
              <Menu size={20} />
            </button>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{pageTitle}</h2>
              <p className="text-xs text-gray-400 hidden sm:block">Farmer Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/farmer/add-product')}
              className="flex items-center gap-2 px-4 py-2 bg-farm-500 hover:bg-farm-600 text-white rounded-xl transition-all font-semibold text-sm shadow-sm"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Add Product</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          <Routes>
            <Route index element={<FarmerHome user={user} />} />
            <Route path="/add-product" element={<AddProductPage />} />
            <Route path="/products"    element={<MyProductsPage />} />
            <Route path="/orders"      element={<FarmerOrdersPage />} />
            <Route path="/earnings"    element={<EarningsPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default FarmerDashboard;
