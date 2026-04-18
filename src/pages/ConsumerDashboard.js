import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag, ShoppingCart, Package, CheckCircle, XCircle, Truck,
  Search, LogOut, User, Menu, X, Trash2, Eye, MapPin, CreditCard,
  Calendar, AlertCircle, RefreshCw, ChevronRight, Clock, Star,
  Leaf, Bell,
} from 'lucide-react';
import { toast } from 'react-toastify';
import useAuthStore from '../context/authStore';
import useCartStore from '../context/cartStore';
import { productService, orderService } from '../services/index';

// ─── Sidebar Nav Item ─────────────────────────────────────────────────────────
const NavItem = ({ icon: Icon, label, view, active, onClick, badge, badgeColor = 'bg-harvest-300' }) => {
  const isActive = active === view;
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
        <Icon
          size={18}
          className={isActive ? 'text-white' : 'text-farm-200 group-hover:text-white transition-colors'}
        />
        <span className="text-sm">{label}</span>
      </div>
      {badge > 0 && (
        <span
          className={`${badgeColor} text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center`}
        >
          {badge}
        </span>
      )}
    </button>
  );
};

// ─── Status & Payment Config ──────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending:   { label: 'Pending Review', bg: 'bg-amber-100',   text: 'text-amber-800',   border: 'border-amber-300',   dot: 'bg-amber-500'   },
  accepted:  { label: 'Accepted',       bg: 'bg-blue-100',    text: 'text-blue-800',    border: 'border-blue-300',    dot: 'bg-blue-500'    },
  confirmed: { label: 'Confirmed',      bg: 'bg-purple-100',  text: 'text-purple-800',  border: 'border-purple-300',  dot: 'bg-purple-500'  },
  packed:    { label: 'Packed',         bg: 'bg-indigo-100',  text: 'text-indigo-800',  border: 'border-indigo-300',  dot: 'bg-indigo-500'  },
  shipped:   { label: 'Shipped',        bg: 'bg-orange-100',  text: 'text-orange-800',  border: 'border-orange-300',  dot: 'bg-orange-500'  },
  delivered: { label: 'Delivered',      bg: 'bg-green-100',   text: 'text-green-800',   border: 'border-green-300',   dot: 'bg-green-500'   },
  rejected:  { label: 'Rejected',       bg: 'bg-red-100',     text: 'text-red-800',     border: 'border-red-300',     dot: 'bg-red-500'     },
};

const PAYMENT_CONFIG = {
  unpaid:          { label: 'Unpaid',           bg: 'bg-red-50',    text: 'text-red-700',    icon: '❌' },
  pending_payment: { label: 'Pending Payment',  bg: 'bg-yellow-50', text: 'text-yellow-700', icon: '⏳' },
  paid:            { label: 'Paid',             bg: 'bg-green-50',  text: 'text-green-700',  icon: '✅' },
  failed:          { label: 'Payment Failed',   bg: 'bg-red-50',    text: 'text-red-700',    icon: '❌' },
};

const sc = (s) => STATUS_CONFIG[s] || { label: s, bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300', dot: 'bg-gray-400' };
const pc = (s) => PAYMENT_CONFIG[s] || { label: s, bg: 'bg-gray-50', text: 'text-gray-700', icon: '' };

// ─── Stage Progress Tracker ───────────────────────────────────────────────────
const StageTracker = ({ status }) => {
  const stages = [
    { key: 'accepted',  label: 'Accepted',  icon: CheckCircle },
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
    { key: 'packed',    label: 'Packed',    icon: Package },
    { key: 'shipped',   label: 'Shipped',   icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle },
  ];
  const order = ['accepted', 'confirmed', 'packed', 'shipped', 'delivered'];
  const currentIdx = order.indexOf(status);

  return (
    <div className="flex items-center w-full">
      {stages.map((stage, i) => {
        const done    = i <= currentIdx;
        const current = i === currentIdx;
        const Icon    = stage.icon;
        return (
          <React.Fragment key={stage.key}>
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  current
                    ? 'bg-blue-500 text-white ring-4 ring-blue-100'
                    : done
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                <Icon size={14} />
              </div>
              <span className={`text-xs font-medium hidden sm:block ${current ? 'text-blue-600' : done ? 'text-green-600' : 'text-gray-400'}`}>
                {stage.label}
              </span>
            </div>
            {i < stages.length - 1 && (
              <div className={`flex-1 h-1 mx-1 rounded-full transition-all ${i < currentIdx ? 'bg-green-400' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ─── Order Card ───────────────────────────────────────────────────────────────
const OrderCard = ({ order, onViewDetails, onNavigate }) => {
  const s   = sc(order.status);
  const p   = pc(order.payment_status || 'unpaid');
  const isActive   = ['accepted', 'confirmed', 'packed', 'shipped'].includes(order.status);
  const isRejected = order.status === 'rejected';
  const isDelivered= order.status === 'delivered';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
      <div className={`h-1.5 w-full ${s.dot}`} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-gray-900">Order #{order.id}</h3>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${s.bg} ${s.text} ${s.border}`}>
                {s.label}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${p.bg} ${p.text}`}>
                {p.icon} {p.label}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
              <Calendar size={12} />
              {new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-2xl font-bold text-farm-500">₹{Number(order.total_amount).toLocaleString('en-IN')}</p>
            <p className="text-xs text-gray-400">{order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {(order.items || []).slice(0, 4).map((item, i) => (
            <span key={i} className="bg-sand-100 text-gray-600 text-xs px-2.5 py-1 rounded-lg border border-sand-200">
              {item.name} × {item.quantity} {item.quantityType}
            </span>
          ))}
          {(order.items || []).length > 4 && (
            <span className="bg-gray-100 text-gray-500 text-xs px-2.5 py-1 rounded-lg">+{order.items.length - 4} more</span>
          )}
        </div>

        {order.delivery_address && (
          <div className="flex items-start gap-2 mb-4 text-xs text-gray-500">
            <MapPin size={12} className="mt-0.5 text-farm-500 flex-shrink-0" />
            <span className="line-clamp-1">{order.delivery_address}</span>
          </div>
        )}

        {isActive && (
          <div className="mb-4 bg-blue-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-blue-600 mb-3">Order Progress</p>
            <StageTracker status={order.status} />
          </div>
        )}

        {isDelivered && (
          <div className="mb-4 flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl p-3">
            <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-green-700">Order Delivered Successfully!</p>
              <p className="text-xs text-green-500">Thank you for shopping with FarmBridge</p>
            </div>
            <Star size={16} className="ml-auto text-harvest-300" />
          </div>
        )}

        {isRejected && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3">
            <div className="flex items-start gap-2">
              <XCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-700">Order Rejected by Farmer</p>
                {order.rejection_reason && (
                  <p className="text-xs text-red-600 mt-1"><span className="font-medium">Reason:</span> {order.rejection_reason}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {(order.payment_status === 'unpaid' || order.payment_status === 'pending_payment') && order.payment_method !== 'cod' && (
          <div className="mb-4 flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
            <AlertCircle size={16} className="text-yellow-600 flex-shrink-0" />
            <p className="text-xs text-yellow-700 font-medium flex-1">Payment pending for this order</p>
            <button onClick={() => onNavigate(`/payment/${order.id}`)} className="text-xs text-yellow-700 font-bold hover:text-yellow-900 underline whitespace-nowrap">
              Pay Now →
            </button>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <CreditCard size={12} />
            <span>{order.payment_method === 'cod' ? 'Cash on Delivery' : `${order.items?.length || 0} item(s)`}</span>
          </div>
          <button
            onClick={() => onViewDetails(order)}
            className="flex items-center gap-1.5 px-4 py-2 bg-farm-50 hover:bg-farm-100 text-farm-500 font-semibold rounded-xl text-sm transition-colors border border-farm-100"
          >
            <Eye size={14} /> View Details <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Order Detail Modal ───────────────────────────────────────────────────────
const OrderDetailModal = ({ order, onClose, onNavigate }) => {
  if (!order) return null;
  const s = sc(order.status);
  const p = pc(order.payment_status || 'unpaid');
  const isActive = ['accepted', 'confirmed', 'packed', 'shipped'].includes(order.status);
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Order #{order.id}</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
            <X size={18} className="text-gray-600" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          <div className="flex flex-wrap gap-3">
            <span className={`px-4 py-2 rounded-xl text-sm font-semibold border ${s.bg} ${s.text} ${s.border}`}>📦 {s.label}</span>
            <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${p.bg} ${p.text}`}>{p.icon} {p.label}</span>
          </div>
          {isActive && (
            <div className="bg-blue-50 rounded-2xl p-5">
              <p className="text-sm font-bold text-blue-700 mb-4">Order Progress</p>
              <StageTracker status={order.status} />
            </div>
          )}
          {order.status === 'rejected' && order.rejection_reason && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
              <XCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-700">Rejection Reason</p>
                <p className="text-sm text-red-600 mt-1">{order.rejection_reason}</p>
              </div>
            </div>
          )}
          {(order.payment_status === 'unpaid' || order.payment_status === 'pending_payment') && order.payment_method !== 'cod' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-center gap-3">
              <AlertCircle size={20} className="text-yellow-600 flex-shrink-0" />
              <p className="text-sm text-yellow-700 font-medium flex-1">Payment is still pending for this order.</p>
              <button onClick={() => { onClose(); onNavigate(`/payment/${order.id}`); }} className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-xl text-sm transition-colors">
                Pay Now
              </button>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Order Date',     value: new Date(order.created_at).toLocaleDateString('en-IN') },
              { label: 'Total Amount',   value: `₹${Number(order.total_amount).toLocaleString('en-IN')}`, highlight: true },
              { label: 'Payment Method', value: order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment' },
              { label: 'Customer',       value: order.customer_name || '—' },
              { label: 'Phone',          value: order.customer_phone || '—' },
              { label: 'Items Count',    value: `${order.items?.length || 0} item(s)` },
            ].map((info) => (
              <div key={info.label} className="bg-sand-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 font-medium">{info.label}</p>
                <p className={`text-sm font-bold mt-0.5 ${info.highlight ? 'text-farm-500 text-base' : 'text-gray-800'}`}>{info.value}</p>
              </div>
            ))}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Package size={16} className="text-farm-500" /> Order Items
            </h3>
            <div className="space-y-2">
              {(order.items || []).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-sand-50 rounded-xl border border-sand-200">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.quantity} {item.quantityType}{item.weight_per_bag ? ` × ${item.weight_per_bag}kg/bag` : ''}</p>
                  </div>
                  <p className="font-bold text-farm-500 text-sm">₹{(Number(item.price) * Number(item.quantity)).toLocaleString('en-IN')}</p>
                </div>
              ))}
              <div className="flex items-center justify-between p-3 bg-farm-50 rounded-xl border border-farm-100">
                <p className="font-bold text-gray-700">Total</p>
                <p className="font-bold text-farm-500 text-lg">₹{Number(order.total_amount).toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
          {order.delivery_address && (
            <div>
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <MapPin size={16} className="text-farm-500" /> Delivery Address
              </h3>
              <div className="p-4 bg-sand-50 rounded-xl border border-sand-200 flex items-start gap-3">
                <MapPin size={18} className="text-farm-500 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700 text-sm leading-relaxed">{order.delivery_address}</p>
              </div>
            </div>
          )}
        </div>
        <div className="p-6 border-t border-gray-100 flex-shrink-0">
          <button onClick={onClose} className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors">Close</button>
        </div>
      </div>
    </div>
  );
};

// ─── Add-to-Cart Modal ────────────────────────────────────────────────────────
const AddToCartModal = ({ product, onClose, onConfirm }) => {
  const [qty, setQty] = useState(1);
  const [type, setType] = useState('bags');
  if (!product) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="relative h-40 bg-gradient-to-br from-farm-50 to-leaf-50 flex items-center justify-center overflow-hidden">
          {product.image ? (
            <img src={`data:image/jpeg;base64,${product.image}`} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <Leaf size={48} className="text-farm-300" />
          )}
          <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow">
            <X size={16} className="text-gray-600" />
          </button>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{product.name}</h3>
          <p className="text-farm-500 font-bold text-lg mb-4">₹{Number(product.price).toLocaleString('en-IN')} / bag</p>
          <div className="flex gap-2 mb-4">
            {['bags', 'kg'].map((t) => (
              <button key={t} onClick={() => setType(t)} className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all ${type === t ? 'bg-farm-500 text-white border-farm-500' : 'bg-white text-gray-600 border-gray-200 hover:border-farm-300'}`}>
                By {t === 'bags' ? 'Bags' : 'Weight (kg)'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 rounded-xl bg-gray-100 font-bold text-gray-700 hover:bg-farm-100 hover:text-farm-600 transition-colors text-lg flex items-center justify-center">−</button>
            <input type="number" value={qty} min={1} onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))} className="flex-1 text-center text-xl font-bold border-2 border-gray-200 rounded-xl py-2 focus:border-farm-400 focus:outline-none" />
            <button onClick={() => setQty(qty + 1)} className="w-10 h-10 rounded-xl bg-gray-100 font-bold text-gray-700 hover:bg-farm-100 hover:text-farm-600 transition-colors text-lg flex items-center justify-center">+</button>
          </div>
          <div className="bg-farm-50 rounded-xl p-3 mb-5 text-center">
            <p className="text-xs text-gray-500">Estimated Total</p>
            <p className="text-xl font-bold text-farm-500">₹{(Number(product.price) * qty).toLocaleString('en-IN')}</p>
          </div>
          <button onClick={() => onConfirm(qty, type)} className="w-full py-3 bg-gradient-to-r from-farm-500 to-farm-600 text-white font-bold rounded-xl hover:shadow-lg shadow-farm-500/25 transition-all">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = ({ icon: Icon, title, subtitle, action, onAction }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <Icon size={36} className="text-gray-300" />
    </div>
    <h3 className="text-lg font-bold text-gray-600 mb-2">{title}</h3>
    {subtitle && <p className="text-sm text-gray-400 mb-6 max-w-xs">{subtitle}</p>}
    {action && (
      <button onClick={onAction} className="px-6 py-3 bg-farm-500 hover:bg-farm-600 text-white font-semibold rounded-xl transition-colors shadow-sm">
        {action}
      </button>
    )}
  </div>
);

const ConsumerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { items: cartItems, total: cartTotal, addItem, removeItem, updateQuantity, clearCart } = useCartStore();

  const [activeView, setActiveView] = useState('shop');
  const [mobileSidebar, setMobileSidebar] = useState(false);

  const [products, setProducts]               = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [search, setSearch]                   = useState('');
  const [addToCartModal, setAddToCartModal]   = useState(null);

  const [orders, setOrders]               = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (user?.role === 'farmer') {
      toast.warning('You are registered as a Farmer. Redirecting to Farmer Dashboard...');
      navigate('/farmer');
    }
  }, [user, navigate]);

  const fetchProducts = useCallback(async (query = '') => {
    setProductsLoading(true);
    try {
      const res = query
        ? await productService.searchProducts(query)
        : await productService.getAllProducts();
      setProducts(res.data || []);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const res = await orderService.getConsumerOrders();
      setOrders(res.data || []);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeView.startsWith('orders')) fetchOrders();
  }, [activeView, fetchOrders]);

  const pendingOrders  = orders.filter(o => o.status === 'pending');
  const acceptedOrders = orders.filter(o => ['accepted', 'confirmed', 'packed', 'shipped'].includes(o.status));
  const rejectedOrders = orders.filter(o => o.status === 'rejected');
  const receivedOrders = orders.filter(o => o.status === 'delivered');

  const ordersForView = {
    'orders-all':      orders,
    'orders-pending':  pendingOrders,
    'orders-accepted': acceptedOrders,
    'orders-rejected': rejectedOrders,
    'orders-received': receivedOrders,
  };

  const VIEW_TITLES = {
    shop:              'Marketplace',
    cart:              'My Cart',
    'orders-all':      'All Orders',
    'orders-pending':  'Pending Orders',
    'orders-accepted': 'Accepted Orders',
    'orders-rejected': 'Rejected Orders',
    'orders-received': 'Received Orders',
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  const handleConfirmAddToCart = (qty, type) => {
    if (!addToCartModal) return;
    addItem({
      id: `${addToCartModal.id}-${Date.now()}`,
      productId: addToCartModal.id,
      name: addToCartModal.name,
      price: Number(addToCartModal.price) || 0,
      weight_per_bag: Number(addToCartModal.weight_per_bag) || 0,
      image: addToCartModal.image,
      quantity: qty,
      quantityType: type,
    });
    toast.success(`✓ ${addToCartModal.name} added to cart!`);
    setAddToCartModal(null);
  };

  const goTo = (view) => {
    setActiveView(view);
    setMobileSidebar(false);
  };

  return (
    <div className="flex h-screen bg-sand-50 overflow-hidden">

      {mobileSidebar && (
        <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setMobileSidebar(false)} />
      )}

      {/* ──── SIDEBAR ──── */}
      <aside className={`fixed md:relative z-40 h-full w-64 flex-shrink-0 bg-gradient-to-b from-farm-900 to-farm-800 flex flex-col shadow-2xl transition-transform duration-300 ${mobileSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-5 border-b border-farm-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-harvest-300 rounded-xl flex items-center justify-center flex-shrink-0">
              <Leaf size={20} className="text-farm-900" />
            </div>
            <div>
              <h1 className="text-white font-bold text-base leading-tight">FarmBridge</h1>
              <p className="text-farm-300 text-xs">Consumer Portal</p>
            </div>
          </div>
        </div>

        <div className="mx-3 mt-4 mb-2 p-3 bg-white/10 rounded-xl border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-harvest-300 rounded-full flex items-center justify-center text-farm-900 font-bold text-sm flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm truncate">{user?.name || 'Consumer'}</p>
              <p className="text-farm-300 text-xs truncate">{user?.email || ''}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          <NavItem icon={ShoppingBag} label="Marketplace" view="shop" active={activeView} onClick={() => goTo('shop')} />
          <NavItem icon={ShoppingCart} label="My Cart" view="cart" active={activeView} onClick={() => goTo('cart')} badge={cartItems.length} badgeColor="bg-red-400" />

          <div className="pt-4 pb-1.5 px-3">
            <p className="text-farm-400 text-xs font-semibold uppercase tracking-widest">My Orders</p>
          </div>

          <NavItem icon={Package} label="All Orders" view="orders-all" active={activeView} onClick={() => goTo('orders-all')} badge={orders.length} badgeColor="bg-farm-400" />
          <NavItem icon={Clock} label="Pending" view="orders-pending" active={activeView} onClick={() => goTo('orders-pending')} badge={pendingOrders.length} badgeColor="bg-amber-400" />
          <NavItem icon={CheckCircle} label="Accepted / Active" view="orders-accepted" active={activeView} onClick={() => goTo('orders-accepted')} badge={acceptedOrders.length} badgeColor="bg-blue-400" />
          <NavItem icon={XCircle} label="Rejected" view="orders-rejected" active={activeView} onClick={() => goTo('orders-rejected')} badge={rejectedOrders.length} badgeColor="bg-red-400" />
          <NavItem icon={Truck} label="Received" view="orders-received" active={activeView} onClick={() => goTo('orders-received')} badge={receivedOrders.length} badgeColor="bg-green-400" />
        </nav>

        <div className="p-3 border-t border-farm-700 space-y-0.5">
          <button onClick={() => navigate('/profile')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-farm-100 hover:bg-white/10 hover:text-white transition-all text-sm">
            <User size={18} className="text-farm-200" />
            <span>Profile</span>
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-300 hover:bg-red-900/30 hover:text-red-200 transition-all text-sm">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ──── MAIN ──── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-5 py-3.5 flex items-center justify-between flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileSidebar(true)} className="md:hidden p-2 hover:bg-gray-100 rounded-xl text-gray-600">
              <Menu size={20} />
            </button>
            {activeView === 'shop' ? (
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search products, crops..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); fetchProducts(e.target.value); }}
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-farm-400 focus:ring-2 focus:ring-farm-100 w-72 transition-all"
                />
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-bold text-gray-900">{VIEW_TITLES[activeView]}</h2>
                {activeView.startsWith('orders') && (
                  <p className="text-xs text-gray-400">{(ordersForView[activeView] || []).length} order(s)</p>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {activeView.startsWith('orders') && (
              <button onClick={fetchOrders} className="flex items-center gap-1.5 px-3 py-2 text-sm text-farm-600 hover:bg-farm-50 rounded-xl transition-colors font-medium">
                <RefreshCw size={14} /> Refresh
              </button>
            )}
            <button
              onClick={() => navigate('/checkout')}
              disabled={cartItems.length === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-semibold text-sm ${cartItems.length > 0 ? 'bg-farm-500 hover:bg-farm-600 text-white shadow-sm' : 'bg-gray-100 text-gray-400 cursor-default'}`}
            >
              <ShoppingCart size={16} />
              Checkout
              {cartItems.length > 0 && (
                <span className="bg-white text-farm-600 text-xs font-bold px-1.5 py-0.5 rounded-full ml-1">{cartItems.length}</span>
              )}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-5">

          {/* ── SHOP ── */}
          {activeView === 'shop' && (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Total Products', value: products.length,                              icon: ShoppingBag, color: 'text-farm-500',    bg: 'bg-farm-50'    },
                  { label: 'In Cart',         value: cartItems.length,                             icon: ShoppingCart, color: 'text-blue-500',   bg: 'bg-blue-50'    },
                  { label: 'Total Orders',    value: orders.length,                               icon: Package,      color: 'text-purple-500',  bg: 'bg-purple-50'  },
                  { label: 'Cart Value',      value: `₹${cartTotal.toLocaleString('en-IN')}`,     icon: CreditCard,   color: 'text-harvest-400', bg: 'bg-harvest-50' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
                    <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <stat.icon size={18} className={stat.color} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                      <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {productsLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="animate-spin w-10 h-10 border-4 border-farm-200 border-t-farm-500 rounded-full mx-auto mb-4" />
                    <p className="text-gray-500">Loading fresh products...</p>
                  </div>
                </div>
              ) : products.length === 0 ? (
                <EmptyState icon={ShoppingBag} title="No products found" subtitle={search ? `No results for "${search}"` : 'No products available right now.'} action={search ? 'Clear Search' : undefined} onAction={() => { setSearch(''); fetchProducts(); }} />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {products.map((product) => (
                    <div key={product.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden group">
                      <div className="relative h-44 bg-gradient-to-br from-farm-50 to-leaf-50 overflow-hidden">
                        {product.image ? (
                          <img src={`data:image/jpeg;base64,${product.image}`} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><Leaf size={48} className="text-farm-200" /></div>
                        )}
                        {product.bags <= 5 && product.bags > 0 && (
                          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">Only {product.bags} left!</span>
                        )}
                        {product.bags === 0 && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="bg-red-500 text-white font-bold px-3 py-1 rounded-full text-sm">Out of Stock</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 text-base mb-1 truncate">{product.name}</h3>
                        {product.description && <p className="text-xs text-gray-500 mb-3 line-clamp-2">{product.description}</p>}
                        <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                          <div className="bg-sand-50 rounded-lg p-2">
                            <p className="text-gray-400">Price/bag</p>
                            <p className="font-bold text-farm-500">₹{Number(product.price).toLocaleString()}</p>
                          </div>
                          <div className="bg-sand-50 rounded-lg p-2">
                            <p className="text-gray-400">Weight</p>
                            <p className="font-bold text-gray-700">{product.weight_per_bag}kg</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mb-3">{product.bags > 0 ? `${product.bags} bags available` : 'Out of stock'}</p>
                        <button
                          onClick={() => product.bags > 0 && setAddToCartModal(product)}
                          disabled={product.bags === 0}
                          className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${product.bags > 0 ? 'bg-farm-500 hover:bg-farm-600 text-white shadow-sm' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                        >
                          {product.bags > 0 ? '+ Add to Cart' : 'Out of Stock'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── CART ── */}
          {activeView === 'cart' && (
            <div className="max-w-3xl mx-auto">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">My Cart</h2>
                  <p className="text-gray-500 text-sm mt-1">Review your items before checkout</p>
                </div>
              </div>

              {cartItems.length === 0 ? (
                <EmptyState icon={ShoppingCart} title="Your cart is empty" subtitle="Browse the marketplace and add fresh farm products to your cart." action="Go to Marketplace" onAction={() => goTo('shop')} />
              ) : (
                <>
                  <div className="space-y-3 mb-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
                        <div className="w-16 h-16 bg-farm-50 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <img src={`data:image/jpeg;base64,${item.image}`} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <Leaf size={24} className="text-farm-300" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">₹{Number(item.price).toLocaleString('en-IN')} per bag</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeItem(item.id)} className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-600 hover:bg-farm-100 hover:text-farm-600 transition-colors">−</button>
                            <span className="font-bold text-gray-900 w-8 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-600 hover:bg-farm-100 hover:text-farm-600 transition-colors">+</button>
                            <span className="text-xs text-gray-400 ml-1">{item.quantityType}</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-farm-500 text-lg">₹{(Number(item.price) * item.quantity).toLocaleString('en-IN')}</p>
                          <button onClick={() => removeItem(item.id)} className="mt-1 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
                    <div className="space-y-2 mb-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm text-gray-600">
                          <span>{item.name} × {item.quantity}</span>
                          <span>₹{(Number(item.price) * item.quantity).toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                      <p className="font-bold text-gray-900 text-lg">Total</p>
                      <p className="font-bold text-farm-500 text-2xl">₹{cartTotal.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="mt-4 flex gap-3">
                      <button onClick={() => { clearCart(); toast.info('Cart cleared'); }} className="flex-1 py-3 border-2 border-red-200 text-red-500 hover:bg-red-50 font-semibold rounded-xl transition-colors">
                        Clear Cart
                      </button>
                      <button onClick={() => navigate('/checkout')} className="flex-grow py-3 bg-gradient-to-r from-farm-500 to-farm-600 text-white font-bold rounded-xl hover:shadow-lg transition-all">
                        Proceed to Checkout →
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── ORDERS ── */}
          {activeView.startsWith('orders') && (
            <div>
              <div className="flex gap-2 overflow-x-auto pb-3 mb-5">
                {[
                  { view: 'orders-all',      label: 'All',      count: orders.length,        color: 'bg-farm-500'   },
                  { view: 'orders-pending',  label: 'Pending',  count: pendingOrders.length,  color: 'bg-amber-500'  },
                  { view: 'orders-accepted', label: 'Accepted', count: acceptedOrders.length, color: 'bg-blue-500'   },
                  { view: 'orders-rejected', label: 'Rejected', count: rejectedOrders.length, color: 'bg-red-500'    },
                  { view: 'orders-received', label: 'Received', count: receivedOrders.length, color: 'bg-green-500'  },
                ].map((tab) => (
                  <button
                    key={tab.view}
                    onClick={() => goTo(tab.view)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm whitespace-nowrap transition-all border ${activeView === tab.view ? `${tab.color} text-white border-transparent shadow-sm` : 'bg-white text-gray-600 border-gray-200 hover:border-farm-300'}`}
                  >
                    {tab.label}
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${activeView === tab.view ? 'bg-white/30 text-white' : 'bg-gray-100 text-gray-600'}`}>{tab.count}</span>
                  </button>
                ))}
              </div>

              {ordersLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="animate-spin w-10 h-10 border-4 border-farm-200 border-t-farm-500 rounded-full mx-auto mb-4" />
                    <p className="text-gray-500">Loading your orders...</p>
                  </div>
                </div>
              ) : (ordersForView[activeView] || []).length === 0 ? (
                <EmptyState
                  icon={activeView === 'orders-rejected' ? XCircle : activeView === 'orders-received' ? Truck : activeView === 'orders-accepted' ? CheckCircle : Package}
                  title={activeView === 'orders-rejected' ? 'No rejected orders' : activeView === 'orders-received' ? 'No received orders yet' : activeView === 'orders-accepted' ? 'No accepted orders' : activeView === 'orders-pending' ? 'No pending orders' : 'No orders yet'}
                  subtitle={activeView === 'orders-all' ? 'Start shopping to place your first order!' : `You don't have any ${VIEW_TITLES[activeView].toLowerCase()} right now.`}
                  action={activeView === 'orders-all' ? 'Start Shopping' : undefined}
                  onAction={() => goTo('shop')}
                />
              ) : (
                <div className="space-y-4">
                  {(ordersForView[activeView] || []).map((order) => (
                    <OrderCard key={order.id} order={order} onViewDetails={setSelectedOrder} onNavigate={navigate} />
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      <AddToCartModal product={addToCartModal} onClose={() => setAddToCartModal(null)} onConfirm={handleConfirmAddToCart} />
      <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onNavigate={navigate} />
    </div>
  );
};

export default ConsumerDashboard;
