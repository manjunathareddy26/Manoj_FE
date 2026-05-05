import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Eye, MapPin, CreditCard, Calendar, AlertCircle, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { orderService } from '../services/index';

// ── Order Tracking ────────────────────────────────────────────────────────────

const TRACKING_STEPS = [
  { key: 'booked',   label: 'Booked',   shortLabel: 'Book', icon: '🛒' },
  { key: 'payment',  label: 'Payment',  shortLabel: 'Pay',  icon: '💳' },
  { key: 'accepted', label: 'Accepted', shortLabel: 'Acpt', icon: '✅' },
  { key: 'packed',   label: 'Packed',   shortLabel: 'Pack', icon: '📦' },
  { key: 'shipped',  label: 'Shipped',  shortLabel: 'Ship', icon: '🚚' },
  { key: 'received', label: 'Received', shortLabel: 'Rcvd', icon: '🏠' },
];

const getTrackingStep = (status, paymentStatus) => {
  if (status === 'delivered') return 5;
  if (status === 'shipped')   return 4;
  if (status === 'packed')    return 3;
  if (status === 'confirmed' || status === 'accepted') return 2;
  if (paymentStatus === 'paid') return 1;
  return 0;
};

const OrderTracker = ({ order, compact = false }) => {
  if (order.status === 'rejected') return null;
  const currentStep = getTrackingStep(order.status, order.payment_status);

  return (
    <div className="w-full">
      <div className="flex items-center w-full">
        {TRACKING_STEPS.map((step, i) => {
          const done   = i <= currentStep;
          const active = i === currentStep;
          const isLast = i === TRACKING_STEPS.length - 1;
          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <div
                  className={`
                    ${compact ? 'w-7 h-7 text-xs' : 'w-11 h-11 text-sm'}
                    rounded-full flex items-center justify-center font-bold transition-all
                    ${active
                      ? 'bg-[#10b981] text-white ring-4 ring-[#d1fae5] shadow-md scale-110'
                      : done
                      ? 'bg-[#10b981] text-white'
                      : 'bg-gray-100 text-gray-400'}
                  `}
                >
                  {done && !active ? '✓' : step.icon}
                </div>
                <span
                  className={`${
                    compact ? 'text-[9px]' : 'text-[11px]'
                  } font-semibold text-center leading-tight ${
                    active ? 'text-[#059669]' : done ? 'text-[#10b981]' : 'text-gray-300'
                  }`}
                >
                  {compact ? step.shortLabel : step.label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={`flex-1 ${
                    compact ? 'h-0.5 mb-4' : 'h-1 mb-5'
                  } mx-1 rounded-full transition-all ${
                    i < currentStep ? 'bg-[#10b981]' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
      {!compact && (
        <div className="text-center mt-4">
          <span
            className={`text-xs font-bold px-4 py-1.5 rounded-full ${
              order.status === 'delivered'
                ? 'bg-green-100 text-green-700'
                : 'bg-[#d1fae5] text-[#059669]'
            }`}
          >
            {order.status === 'delivered'
              ? '🎉 Your order has been delivered!'
              : `Currently: ${TRACKING_STEPS[currentStep]?.label}`}
          </span>
        </div>
      )}
    </div>
  );
};

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState(null); // order to confirm deletion
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getConsumerOrders();
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    try {
      await orderService.deleteOrder(deleteConfirm.id);
      setOrders(prev => prev.filter(o => o.id !== deleteConfirm.id));
      toast.success('Order deleted successfully');
      setDeleteConfirm(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete order');
    } finally {
      setDeleting(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      confirmed: 'bg-purple-100 text-purple-800',
      packed: 'bg-indigo-100 text-indigo-800',
      shipped: 'bg-orange-100 text-orange-800',
      delivered: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: '⏳ Pending',
      accepted: '✓ Farmer Accepted',
      confirmed: '✓ Confirmed',
      packed: '📦 Packed',
      shipped: '🚚 Shipped',
      delivered: '✓ Delivered',
      rejected: '✗ Rejected',
    };
    return labels[status] || status;
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      unpaid: 'bg-red-100 text-red-800 border-red-300',
      pending_payment: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      paid: 'bg-green-100 text-green-800 border-green-300',
      failed: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusLabel = (status) => {
    const labels = {
      unpaid: '❌ Unpaid',
      pending_payment: '⏳ Pending',
      paid: '✅ Paid',
      failed: '❌ Failed',
    };
    return labels[status] || status;
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#E8EFF7] py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="inline-block animate-spin mb-4">
                <Package size={40} className="text-[#10b981]" />
              </div>
              <p className="text-[#64748B] text-lg">Loading your orders...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#E8EFF7] py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/consumer')}
            className="text-[#10b981] font-semibold mb-4 hover:text-[#059669] flex items-center gap-2"
          >
            ← Back to Shop
          </button>
          <h1 className="text-4xl font-bold text-[#0F172A]">My Orders</h1>
          <p className="text-[#64748B] mt-2">Track and manage your applied orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Package size={64} className="mx-auto mb-4 text-[#CBD5E1]" />
            <p className="text-xl text-[#64748B] mb-6">No orders yet</p>
            <button
              onClick={() => navigate('/consumer')}
              className="px-8 py-3 bg-gradient-to-r from-[#10b981] to-[#059669] text-white font-bold rounded-xl hover:shadow-lg transition-shadow"
            >
              Start Shopping Now
            </button>
          </div>
        ) : (
          <>
            {/* Filter Tabs */}
            <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                  filterStatus === 'all'
                    ? 'bg-[#10b981] text-white'
                    : 'bg-white text-[#64748B] border border-[#E2E8F0]'
                }`}
              >
                All ({orders.length})
              </button>
              {['pending', 'confirmed', 'shipped', 'delivered'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                    filterStatus === status
                      ? 'bg-[#10b981] text-white'
                      : 'bg-white text-[#64748B] border border-[#E2E8F0]'
                  }`}
                >
                  {getStatusLabel(status).split(' ')[1]} ({orders.filter(o => o.status === status).length})
                </button>
              ))}
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                      {/* Left Side - Order Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-[#0F172A]">
                              Order #{order.id}
                            </h3>
                            <p className="text-sm text-[#64748B] flex items-center gap-1 mt-1">
                              <Calendar size={16} />
                              {new Date(order.created_at).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>

                        {/* Status Badges */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span
                            className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {getStatusLabel(order.status)}
                          </span>
                          <span
                            className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${getPaymentStatusColor(
                              order.payment_status || 'unpaid'
                            )}`}
                          >
                            {getPaymentStatusLabel(order.payment_status || 'unpaid')}
                          </span>
                        </div>

                        {/* Order Tracking Strip */}
                        {order.status !== 'rejected' && (
                          <div className="mb-4 p-3 bg-[#F0FDF4] rounded-xl border border-[#BBF7D0]">
                            <p className="text-[10px] font-bold text-[#059669] uppercase tracking-wide mb-2">Order Tracking</p>
                            <OrderTracker order={order} compact />
                          </div>
                        )}

                        {/* Items Summary */}
                        <div className="mb-4 p-3 bg-[#F1F5F9] rounded-lg">
                          <p className="text-sm font-semibold text-[#0F172A] mb-2">
                            Items ({order.items?.length || 0})
                          </p>
                          <div className="space-y-1">
                            {order.items?.slice(0, 3).map((item, idx) => (
                              <p key={idx} className="text-sm text-[#64748B]">
                                • {item.name} × {item.quantity} {item.quantityType}
                              </p>
                            ))}
                            {order.items?.length > 3 && (
                              <p className="text-sm text-[#10b981] font-semibold">
                                + {order.items.length - 3} more item(s)
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Address */}
                        {order.delivery_address && (
                          <div className="text-sm text-[#64748B] flex items-start gap-2">
                            <MapPin size={16} className="mt-0.5 flex-shrink-0 text-[#10b981]" />
                            <span>{order.delivery_address}</span>
                          </div>
                        )}
                      </div>

                      {/* Right Side - Amount & Actions */}
                      <div className="flex flex-col items-end gap-4 md:w-48">
                        {/* Total Amount */}
                        <div className="text-right">
                          <p className="text-sm text-[#64748B]">Total</p>
                          <p className="text-3xl font-bold text-[#10b981]">
                            ₹{order.total_amount?.toLocaleString('en-IN')}
                          </p>
                        </div>

                        {/* Payment Method */}
                        <div className="flex items-center gap-2 text-sm text-[#64748B]">
                          <CreditCard size={16} />
                          <span>
                            {order.payment_method === 'cod'
                              ? 'COD'
                              : 'Card/UPI'}
                          </span>
                        </div>

                        {/* Need Payment Alert */}
                        {order.payment_status === 'unpaid' && order.payment_method === 'upi' && (
                          <div className="w-full p-3 bg-red-50 border border-red-300 rounded-lg flex items-start gap-2">
                            <AlertCircle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-semibold text-red-700">Payment Pending</p>
                              <button
                                onClick={() => navigate(`/payment/${order.id}`)}
                                className="text-xs text-red-600 hover:text-red-800 font-semibold mt-1 hover:underline"
                              >
                                Complete Payment →
                              </button>
                            </div>
                          </div>
                        )}

                        {/* View Details Button */}
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#10b98120] text-[#10b981] font-semibold rounded-lg hover:bg-[#10b98130] transition-colors"
                        >
                          <Eye size={16} />
                          View Details
                        </button>

                        {/* Delete Button — only for delivered or rejected */}
                        {(order.status === 'delivered' || order.status === 'rejected') && (
                          <button
                            onClick={() => setDeleteConfirm(order)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-500 font-semibold rounded-lg hover:bg-red-100 transition-colors"
                          >
                            <Trash2 size={16} />
                            Delete Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setSelectedOrder(null)}
              className="float-right text-[#64748B] hover:text-[#0F172A] text-3xl font-light"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold text-[#0F172A] mb-6">
              Order #{selectedOrder.id} Details
            </h2>

            {/* Order Tracking */}
            <div className="mb-6 pb-6 border-b border-[#E2E8F0]">
              <p className="text-sm font-semibold text-[#64748B] mb-4">Order Tracking</p>
              <div className="bg-[#F0FDF4] rounded-2xl p-5 border border-[#BBF7D0]">
                <OrderTracker order={selectedOrder} />
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedOrder.status)}`}>
                  {getStatusLabel(selectedOrder.status)}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${getPaymentStatusColor(selectedOrder.payment_status || 'unpaid')}`}>
                  {getPaymentStatusLabel(selectedOrder.payment_status || 'unpaid')}
                </span>
              </div>
            </div>

            {/* Order Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-[#E2E8F0]">
              <div>
                <p className="text-sm text-[#64748B] font-semibold">Order Date</p>
                <p className="text-[#0F172A] font-semibold">
                  {new Date(selectedOrder.created_at).toLocaleDateString('en-IN')}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#64748B] font-semibold">Total Amount</p>
                <p className="text-[#10b981] font-bold text-lg">
                  ₹{selectedOrder.total_amount?.toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#64748B] font-semibold">Payment Method</p>
                <p className="text-[#0F172A] font-semibold">
                  {selectedOrder.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#64748B] font-semibold">Customer</p>
                <p className="text-[#0F172A] font-semibold">{selectedOrder.customer_name}</p>
              </div>
              {selectedOrder.customer_phone && (
                <div className="col-span-2">
                  <p className="text-sm text-[#64748B] font-semibold">Contact</p>
                  <p className="text-[#0F172A] font-semibold">{selectedOrder.customer_phone}</p>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="mb-6">
              <h3 className="font-bold text-[#0F172A] mb-3">Order Items</h3>
              <div className="space-y-2">
                {selectedOrder.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-3 bg-[#F1F5F9] rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-[#0F172A]">{item.name}</p>
                      <p className="text-sm text-[#64748B]">
                        {item.quantity} {item.quantityType}
                      </p>
                    </div>
                    <p className="font-bold text-[#10b981]">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            {selectedOrder.delivery_address && (
              <div>
                <h3 className="font-bold text-[#0F172A] mb-3">Delivery Address</h3>
                <div className="p-4 bg-[#F1F5F9] rounded-lg flex items-start gap-3">
                  <MapPin size={20} className="text-[#10b981] flex-shrink-0 mt-1" />
                  <p className="text-[#0F172A]">{selectedOrder.delivery_address}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Trash2 size={24} className="text-red-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#0F172A]">Delete Order?</h2>
                <p className="text-sm text-[#64748B]">Order #{deleteConfirm.id}</p>
              </div>
            </div>
            <p className="text-[#64748B] mb-6">
              This will permanently remove this order from your history. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                className="flex-1 px-6 py-3 border-2 border-[#E2E8F0] text-[#0F172A] font-semibold rounded-xl hover:bg-[#F8FAFC] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteOrder}
                disabled={deleting}
                className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
