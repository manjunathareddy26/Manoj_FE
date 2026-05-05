import React, { useEffect, useState, useCallback } from 'react';
import {
  Check, X, Package, Eye, User, MessageCircle, Send,
  RefreshCw, AlertCircle, IndianRupee,
  ArrowRight, XCircle, Truck, CheckCircle, Bell, Settings,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { orderService } from '../../services/index';

// COD Workflow Steps
const COD_STEPS = [
  { key: 'pending',   label: 'Received',  Icon: Bell,        desc: 'New order received' },
  { key: 'accepted',  label: 'Accepted',  Icon: CheckCircle, desc: 'Availability confirmed' },
  { key: 'confirmed', label: 'Preparing', Icon: Settings,    desc: 'Items being prepared' },
  { key: 'packed',    label: 'Packed',    Icon: Package,     desc: 'Order packed & ready' },
  { key: 'shipped',   label: 'Shipped',   Icon: Truck,       desc: 'Out for delivery' },
  { key: 'delivered', label: 'Delivered', Icon: IndianRupee, desc: 'Delivered · Cash collected' },
];

const STATUS_ORDER = ['pending', 'accepted', 'confirmed', 'packed', 'shipped', 'delivered'];

// â”€â”€â”€ Workflow Stepper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const WorkflowStepper = ({ order, compact = false }) => {
  if (order.status === 'rejected') {
    return (
      <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
        <XCircle size={16} className="text-red-500 flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-red-700">Order Rejected</p>
          {order.rejection_reason && (
            <p className="text-xs text-red-500 mt-0.5">Reason: {order.rejection_reason}</p>
          )}
        </div>
      </div>
    );
  }

  const currentIdx = STATUS_ORDER.indexOf(order.status);
  const isCOD = order.payment_method === 'cod';

  return (
    <div className="w-full">
      <div className="flex items-start w-full">
        {COD_STEPS.map((step, i) => {
          const done     = i < currentIdx;
          const active   = i === currentIdx;
          const isLast   = i === COD_STEPS.length - 1;
          const StepIcon = step.Icon;
          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <div
                  className={`
                    ${compact ? 'w-8 h-8 text-sm' : 'w-10 h-10 text-base'}
                    rounded-full flex items-center justify-center font-bold transition-all
                    ${active
                      ? 'bg-[#10b981] text-white ring-4 ring-[#d1fae5] shadow-lg scale-110'
                      : done
                      ? 'bg-[#10b981] text-white'
                      : 'bg-gray-100 text-gray-300'}
                  `}
                >
                  {done ? <Check size={compact ? 12 : 14} /> : <StepIcon size={compact ? 14 : 16} />}
                </div>
                <span className={`${compact ? 'text-[8px]' : 'text-[10px]'} font-semibold text-center leading-tight max-w-[50px] ${
                  active ? 'text-[#059669]' : done ? 'text-[#10b981]' : 'text-gray-300'
                }`}>
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div className={`flex-1 ${compact ? 'h-0.5 mt-4' : 'h-1 mt-5'} mx-0.5 rounded-full transition-all ${
                  i < currentIdx ? 'bg-[#10b981]' : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
      {!compact && (
        <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
          <span className="text-xs bg-[#d1fae5] text-[#059669] font-bold px-4 py-1.5 rounded-full">
            {order.status === 'delivered'
              ? isCOD ? 'COD Collected · Order Complete' : 'Delivered Successfully'
              : `Now: ${COD_STEPS[currentIdx]?.desc || order.status}`}
          </span>
          {isCOD && order.status !== 'delivered' && (
            <span className="text-xs bg-orange-100 text-orange-700 font-semibold px-3 py-1.5 rounded-full">
              COD · Collect Cash at Door
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// â”€â”€â”€ Per-status next action config â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const NEXT_ACTION = {
  pending:   { label: 'Accept Order',              bg: 'bg-green-500 hover:bg-green-600',       next: 'accept'    },
  accepted:  { label: 'Confirm & Start Preparing', bg: 'bg-blue-500 hover:bg-blue-600',         next: 'confirmed' },
  confirmed: { label: 'Mark as Packed',            bg: 'bg-indigo-500 hover:bg-indigo-600',     next: 'packed'    },
  packed:    { label: 'Mark as Shipped',           bg: 'bg-orange-500 hover:bg-orange-600',     next: 'shipped'   },
  shipped:   { label: 'Mark Delivered & Collect Cash', bg: 'bg-emerald-600 hover:bg-emerald-700', next: 'delivered' },
};

// â”€â”€â”€ Status Config â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const STATUS_CFG = {
  pending:   { label: 'Pending',   bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300', strip: 'bg-yellow-400'  },
  accepted:  { label: 'Accepted',  bg: 'bg-blue-100',   text: 'text-blue-800',   border: 'border-blue-300',   strip: 'bg-blue-400'    },
  confirmed: { label: 'Preparing', bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300', strip: 'bg-purple-400'  },
  packed:    { label: 'Packed',    bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-300', strip: 'bg-indigo-400'  },
  shipped:   { label: 'Shipped',   bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300', strip: 'bg-orange-400'  },
  delivered: { label: 'Delivered', bg: 'bg-green-100',  text: 'text-green-800',  border: 'border-green-300',  strip: 'bg-green-500'   },
  rejected:  { label: 'Rejected',  bg: 'bg-red-100',    text: 'text-red-800',    border: 'border-red-300',    strip: 'bg-red-400'     },
};
const sc = (s) => STATUS_CFG[s] || { label: s, bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300', strip: 'bg-gray-300' };

const FarmerOrdersPage = () => {
  const [orders,        setOrders]        = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [refreshing,    setRefreshing]    = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [rejectModal,   setRejectModal]   = useState(null);
  const [rejectReason,  setRejectReason]  = useState('');
  const [processing,    setProcessing]    = useState(false);
  const [filterStatus,  setFilterStatus]  = useState('all');

  // â”€â”€ Fetch â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const fetchOrders = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      const response = await orderService.getFarmerOrders();
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (!silent) toast.error('Failed to load orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial load + auto-refresh every 30 s
  useEffect(() => {
    fetchOrders(false);
    const interval = setInterval(() => fetchOrders(true), 30000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const updateOrderInState = (id, patch) =>
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...patch } : o));

  // â”€â”€ Actions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleAction = async (order, nextStatus) => {
    setProcessing(true);
    try {
      if (nextStatus === 'accept') {
        await orderService.acceptOrder(order.id);
        updateOrderInState(order.id, { status: 'accepted' });
        setSelectedOrder(prev => prev?.id === order.id ? { ...prev, status: 'accepted' } : prev);
        toast.success('Order accepted! Start preparing the items.');
      } else if (nextStatus === 'delivered') {
        await orderService.updateOrderStatus(order.id, 'delivered');
        if (order.payment_method === 'cod') {
          // Auto-mark COD payment as paid when delivered
          await orderService.updatePaymentStatus(order.id, 'paid');
          updateOrderInState(order.id, { status: 'delivered', payment_status: 'paid' });
          setSelectedOrder(prev => prev?.id === order.id ? { ...prev, status: 'delivered', payment_status: 'paid' } : prev);
          toast.success('Delivered! COD cash payment marked as collected.');
        } else {
          updateOrderInState(order.id, { status: 'delivered' });
          setSelectedOrder(prev => prev?.id === order.id ? { ...prev, status: 'delivered' } : prev);
          toast.success('Order marked as delivered!');
        }
      } else {
        await orderService.updateOrderStatus(order.id, nextStatus);
        updateOrderInState(order.id, { status: nextStatus });
        setSelectedOrder(prev => prev?.id === order.id ? { ...prev, status: nextStatus } : prev);
        const msg = {
          confirmed: 'Confirmed - start preparing items!',
          packed:    'Packed - ready for dispatch!',
          shipped:   'Shipped - out for delivery!',
        };
        toast.success(msg[nextStatus] || `Status updated to ${nextStatus}`);
      }
    } catch (error) {
      console.error('Action error:', error);
      toast.error('Action failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    setProcessing(true);
    try {
      await orderService.rejectOrder(rejectModal.id, rejectReason);
      updateOrderInState(rejectModal.id, { status: 'rejected', rejection_reason: rejectReason });
      toast.success('Order rejected. Consumer notified.');
      setRejectModal(null);
      setRejectReason('');
      setSelectedOrder(null);
    } catch (error) {
      toast.error('Failed to reject order');
    } finally {
      setProcessing(false);
    }
  };

  // â”€â”€ Filter counts â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const counts = orders.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc; }, {});

  const FILTER_TABS = [
    { key: 'all',       label: 'All',        count: orders.length },
    { key: 'pending',   label: 'New',       count: counts.pending   || 0 },
    { key: 'accepted',  label: 'Accepted',  count: counts.accepted  || 0 },
    { key: 'confirmed', label: 'Preparing', count: counts.confirmed || 0 },
    { key: 'packed',    label: 'Packed',    count: counts.packed    || 0 },
    { key: 'shipped',   label: 'Shipped',   count: counts.shipped   || 0 },
    { key: 'delivered', label: 'Delivered', count: counts.delivered || 0 },
    { key: 'rejected',  label: 'Rejected',  count: counts.rejected  || 0 },
  ];

  const filteredOrders = (filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus))
    .slice()
    .sort((a, b) => {
      const p = { pending: 0, accepted: 1, confirmed: 2, packed: 3, shipped: 4, delivered: 5, rejected: 6 };
      if (p[a.status] !== p[b.status]) return p[a.status] - p[b.status];
      return new Date(b.created_at) - new Date(a.created_at);
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#10b981] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-5xl mx-auto px-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Received Orders</h1>
            <p className="text-gray-500 text-sm mt-1">Manage the full COD delivery cycle for each order</p>
          </div>
          <button
            onClick={() => fetchOrders(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 shadow-sm text-sm"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* COD Workflow Banner */}
        <div className="mb-6 bg-white border border-[#BBF7D0] rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-bold text-[#059669] uppercase tracking-wide mb-3">COD Delivery Workflow</p>
          <div className="flex items-center gap-1 flex-wrap">
            {COD_STEPS.map((step, i) => {
              const StepIcon = step.Icon;
              return (
              <React.Fragment key={step.key}>
                <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-2.5 py-1.5 border border-gray-100">
                  <StepIcon size={12} className="text-[#10b981]" />
                  <span className="text-xs font-semibold text-gray-700">{step.label}</span>
                </div>
                {i < COD_STEPS.length - 1 && <ArrowRight size={11} className="text-gray-300 flex-shrink-0" />}
              </React.Fragment>
              );
            })}            <span className="text-xs text-gray-400 ml-2 italic">Last step auto-marks COD payment as collected</span>
          </div>
        </div>

        {/* New Orders Alert */}
        {(counts.pending || 0) > 0 && (
          <div className="mb-4 flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-2xl px-4 py-3">
            <AlertCircle size={18} className="text-yellow-600 flex-shrink-0" />
            <p className="text-sm font-bold text-yellow-800">
              {counts.pending} new order{counts.pending > 1 ? 's' : ''} waiting for your response!
            </p>
            <button onClick={() => setFilterStatus('pending')} className="ml-auto text-xs font-bold text-yellow-700 underline whitespace-nowrap">
              View now &rarr;
            </button>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
            <Package size={56} className="mx-auto mb-4 text-gray-200" />
            <p className="text-xl font-bold text-gray-400">No orders yet</p>
            <p className="text-sm text-gray-400 mt-2">Once consumers place orders, they will appear here.</p>
          </div>
        ) : (
          <>
            {/* Filter Tabs */}
            <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
              {FILTER_TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFilterStatus(tab.key)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all border ${
                    filterStatus === tab.key
                      ? 'bg-[#10b981] text-white border-[#10b981] shadow-sm'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-[#10b981] hover:text-[#10b981]'
                  }`}
                >
                  {tab.label}
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${filterStatus === tab.key ? 'bg-white/20' : 'bg-gray-100'}`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                <Package size={40} className="mx-auto mb-3 text-gray-200" />
                <p className="text-gray-400 font-medium">No orders with this status</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {filteredOrders.map(order => {
                  const s     = sc(order.status);
                  const isCOD = order.payment_method === 'cod';
                  const next  = NEXT_ACTION[order.status];

                  return (
                    <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                      {/* Color strip */}
                      <div className={`h-1.5 w-full ${s.strip}`} />

                      <div className="p-5">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-base font-bold text-gray-900">Order #{order.id}</h3>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${s.bg} ${s.text} ${s.border}`}>
                                {s.label}
                              </span>
                            </div>
                            {/* COD / Payment Badge */}
                            <div className="mt-1">
                              {isCOD ? (
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                  order.payment_status === 'paid'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-orange-100 text-orange-700'
                                }`}>
                                  {order.payment_status === 'paid' ? 'COD Collected' : 'COD · Pay at door'}
                                </span>
                              ) : (
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                  order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {order.payment_status === 'paid' ? 'Paid Online' : 'Payment Pending'}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xl font-black text-[#10b981]">₹{Number(order.total_amount).toLocaleString('en-IN')}</p>
                            <p className="text-xs text-gray-400">{isCOD ? 'COD' : 'Online'}</p>
                          </div>
                        </div>

                        {/* Compact Stepper */}
                        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 mb-3">
                          <WorkflowStepper order={order} compact />
                        </div>

                        {/* Items */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {(order.items || []).slice(0, 2).map((item, i) => (
                            <span key={i} className="bg-emerald-50 text-emerald-700 text-xs px-2 py-0.5 rounded-lg border border-emerald-100 font-medium">
                              {item.name} ×{item.quantity}
                            </span>
                          ))}
                          {(order.items || []).length > 2 && (
                            <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-lg">+{order.items.length - 2} more</span>
                          )}
                        </div>

                        {/* Customer */}
                        <div className="flex items-center gap-2 mb-3 p-2.5 bg-blue-50 rounded-xl border border-blue-100">
                          <User size={13} className="text-blue-600 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-gray-800 truncate">{order.customer_name}</p>
                            <p className="text-xs text-gray-500 truncate">{order.customer_phone}</p>
                          </div>
                        </div>

                        {/* COD cash reminder on shipped */}
                        {isCOD && order.status === 'shipped' && (
                          <div className="mb-3 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl p-2.5">
                            <IndianRupee size={14} className="text-amber-600 flex-shrink-0" />
                            <p className="text-xs font-bold text-amber-800">
                              Collect ₹{Number(order.total_amount).toLocaleString('en-IN')} cash at delivery
                            </p>
                          </div>
                        )}

                        {/* Action Row */}
                        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                          {/* Primary action */}
                          {next && order.status !== 'rejected' && (
                            <button
                              onClick={() => handleAction(order, next.next)}
                              disabled={processing}
                              className={`flex-1 py-2.5 px-3 ${next.bg} text-white font-bold rounded-xl text-xs transition-all disabled:opacity-50`}
                            >
                              {processing ? '...' : next.label}
                            </button>
                          )}
                          {/* Reject (pending only) */}
                          {order.status === 'pending' && (
                            <button
                              onClick={() => setRejectModal(order)}
                              disabled={processing}
                              className="px-3 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-sm border border-red-200 disabled:opacity-50"
                            >
                              <X size={13} />
                            </button>
                          )}
                          {/* WhatsApp */}
                          {!['delivered', 'rejected', 'pending'].includes(order.status) && (
                            <button
                              onClick={() => {
                                const phone = order.customer_phone?.replace(/\D/g, '');
                                if (!phone) return toast.warning('No phone number');
                                const msg = `Hi ${order.customer_name}, your FarmBridge order #${order.id} is now: ${sc(order.status).label}. Total: ₹${order.total_amount}`;
                                const url = phone.length === 10 ? `https://wa.me/91${phone}?text=${encodeURIComponent(msg)}` : `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
                                window.open(url, '_blank');
                              }}
                              className="p-2.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl border border-green-200"
                              title="WhatsApp Customer"
                            >
                              <MessageCircle size={13} />
                            </button>
                          )}
                          {/* View Details */}
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl border border-gray-200"
                            title="View Details"
                          >
                            <Eye size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* â”€â”€ Reject Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle size={20} className="text-red-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Reject Order #{rejectModal.id}?</h2>
                <p className="text-xs text-gray-400">The consumer will be notified with your reason.</p>
              </div>
            </div>
            <div className="mb-4 p-3 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-700">
              <strong>Customer:</strong> {rejectModal.customer_name} &nbsp;&middot;&nbsp;
              <strong>Amount:</strong> ₹{Number(rejectModal.total_amount).toLocaleString('en-IN')}
            </div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Reason for Rejection <span className="text-red-500">*</span>
            </label>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="e.g., Item out of stock, Cannot deliver to this location..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-400 resize-none text-sm"
              rows={3}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => { setRejectModal(null); setRejectReason(''); }}
                className="flex-1 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                disabled={processing}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl disabled:opacity-50"
              >
                {processing ? 'Rejecting...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* â”€â”€ Order Detail Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {selectedOrder && !rejectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">

            <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Order #{selectedOrder.id}</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(selectedOrder.created_at).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <X size={16} className="text-gray-600" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6 space-y-5">

              {/* Full Stepper */}
              <div className="bg-[#F0FDF4] rounded-2xl p-5 border border-[#BBF7D0]">
                <p className="text-xs font-bold text-[#059669] uppercase tracking-wide mb-4">Delivery Progress</p>
                <WorkflowStepper order={selectedOrder} compact={false} />
              </div>

              {/* COD Payment Banner */}
              {selectedOrder.payment_method === 'cod' && (
                <div className={`flex items-center gap-3 rounded-2xl p-4 border ${
                  selectedOrder.payment_status === 'paid' ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'
                }`}>
                  <IndianRupee size={20} className={selectedOrder.payment_status === 'paid' ? 'text-green-600' : 'text-orange-500'} />
                  <div>
                    <p className={`text-sm font-bold ${selectedOrder.payment_status === 'paid' ? 'text-green-700' : 'text-orange-700'}`}>
                      {selectedOrder.payment_status === 'paid'
                        ? `COD Collected - ₹${Number(selectedOrder.total_amount).toLocaleString('en-IN')}`
                        : `COD Order · Collect ₹${Number(selectedOrder.total_amount).toLocaleString('en-IN')} at delivery`}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {selectedOrder.payment_status === 'paid'
                        ? 'Payment auto-marked when order was delivered'
                        : 'Payment will auto-update to "collected" when you tap Mark Delivered'}
                    </p>
                  </div>
                </div>
              )}

              {/* Primary Action Button */}
              {NEXT_ACTION[selectedOrder.status] && (
                <button
                  onClick={() => handleAction(selectedOrder, NEXT_ACTION[selectedOrder.status].next)}
                  disabled={processing}
                  className={`w-full py-4 ${NEXT_ACTION[selectedOrder.status].bg} text-white font-bold rounded-2xl text-base disabled:opacity-50 shadow-sm`}
                >
                  {processing ? 'Processing...' : NEXT_ACTION[selectedOrder.status].label}
                </button>
              )}

              {/* Customer Info */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-2">
                  <User size={14} className="text-[#10b981]" /> Customer Information
                </h3>
                <div className="bg-blue-50 rounded-2xl p-4 space-y-2">
                  {[
                    ['Name',    selectedOrder.customer_name],
                    ['Phone',   selectedOrder.customer_phone],
                    ['Email',   selectedOrder.customer_email],
                    ['Address', selectedOrder.delivery_address],
                  ].map(([label, value]) => (
                    <div key={label} className="flex gap-2 text-sm">
                      <span className="font-semibold text-blue-700 w-14 flex-shrink-0">{label}:</span>
                      <span className="text-gray-700">{value || '-'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-2">
                  <Package size={14} className="text-[#10b981]" /> Order Items
                </h3>
                <div className="space-y-2">
                  {(selectedOrder.items || []).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.quantity} {item.quantityType}</p>
                      </div>
                      <p className="font-bold text-[#10b981] text-sm">₹{(Number(item.price) * Number(item.quantity)).toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                  <div className="flex justify-between p-3 bg-[#F0FDF4] rounded-xl border border-[#BBF7D0]">
                    <p className="font-bold text-gray-700">Total</p>
                    <p className="font-black text-[#10b981] text-lg">₹{Number(selectedOrder.total_amount).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>

              {/* Contact Buttons */}
              {!['delivered', 'rejected'].includes(selectedOrder.status) && (
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      const phone = selectedOrder.customer_phone?.replace(/\D/g, '');
                      if (!phone) return toast.warning('No phone number');
                      const msg = `Hi ${selectedOrder.customer_name}, your FarmBridge order #${selectedOrder.id} (₹${selectedOrder.total_amount}) is now: ${sc(selectedOrder.status).label}`;
                      const url = phone.length === 10 ? `https://wa.me/91${phone}?text=${encodeURIComponent(msg)}` : `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
                      window.open(url, '_blank');
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl text-sm"
                  >
                    <MessageCircle size={15} /> WhatsApp
                  </button>
                  <button
                    onClick={() => {
                      const sub = `Order #${selectedOrder.id} Update - FarmBridge`;
                      const body = `Hi ${selectedOrder.customer_name},\n\nYour order #${selectedOrder.id} is now: ${sc(selectedOrder.status).label}\nTotal: ₹${selectedOrder.total_amount}\n\nThank you!\nFarmBridge`;
                      window.location.href = `mailto:${selectedOrder.customer_email}?subject=${encodeURIComponent(sub)}&body=${encodeURIComponent(body)}`;
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl text-sm"
                  >
                    <Send size={15} /> Email
                  </button>
                </div>
              )}

              {/* Reject option for pending */}
              {selectedOrder.status === 'pending' && (
                <button
                  onClick={() => { setSelectedOrder(null); setRejectModal(selectedOrder); }}
                  className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-2xl border border-red-200"
                >
                  Reject This Order
                </button>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 flex-shrink-0">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerOrdersPage;
