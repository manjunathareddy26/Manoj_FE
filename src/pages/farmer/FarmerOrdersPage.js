import React, { useEffect, useState } from 'react';
import { Check, X, Package, Eye, Calendar, User, MessageCircle, Send, MapPin, CreditCard } from 'lucide-react';
import { toast } from 'react-toastify';
import { orderService } from '../../services/index';

const FarmerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('pending');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getFarmerOrders();
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      confirmed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pending',
      accepted: 'Accepted',
      confirmed: 'Confirmed',
      rejected: 'Rejected',
    };
    return labels[status] || status;
  };

  const handleAcceptOrder = async (orderId) => {
    setProcessing(true);
    try {
      await orderService.acceptOrder(orderId);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'accepted' } : o));
      toast.success('Order accepted successfully!');
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error accepting order:', error);
      toast.error('Failed to accept order');
    } finally {
      setProcessing(false);
    }
  };

  const handleRejectOrder = async (orderId) => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setProcessing(true);
    try {
      await orderService.rejectOrder(orderId, rejectReason);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'rejected' } : o));
      toast.success('✅ Order rejected. Consumer notified via email.');
      setSelectedOrder(null);
      setRejectReason('');
      setShowRejectModal(false);
    } catch (error) {
      console.error('Error rejecting order:', error);
      toast.error('Failed to reject order');
    } finally {
      setProcessing(false);
    }
  };

  const handleContactViaWhatsApp = (order) => {
    const phone = order.customer_phone?.replace(/\D/g, '');
    if (!phone) {
      toast.warning('Customer phone number not available');
      return;
    }

    const message = `Hi ${order.customer_name}, I have received your order #${order.id}. I will confirm the availability and send you updates shortly. Thank you!`;
    const encodedMessage = encodeURIComponent(message);
    
    // Open WhatsApp Web - support both 10-digit and 12-digit formats
    const whatsappUrl = phone.length === 10 
      ? `https://wa.me/91${phone}?text=${encodedMessage}`
      : `https://wa.me/${phone}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    toast.info('Opening WhatsApp Web...');
  };

  const handleContactViaMail = (order) => {
    const subject = `Order #${order.id} - Confirmation`;
    const body = `Hi ${order.customer_name},\n\nThank you for placing your order #${order.id}. I have received it and will confirm the availability shortly.\n\nOrder Details:\n- Total Amount: ₹${order.total_amount}\n- Items: ${order.items?.length || 0}\n\nBest regards,\nFarmer`;
    
    const mailtoLink = `mailto:${order.customer_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
    toast.info('Opening email client...');
  };

  const handleUpdateDeliveryStatus = async (orderId, newStatus) => {
    setProcessing(true);
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      toast.success(`Order marked as ${newStatus}!`);
    } catch (error) {
      console.error('Error updating delivery status:', error);
      toast.error('Failed to update delivery status');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#E8EFF7] py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="inline-block animate-spin mb-4">
                <Package size={40} className="text-[#10b981]" />
              </div>
              <p className="text-[#64748B] text-lg">Loading orders...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredOrders = orders.filter(order => order.status === filterStatus);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#E8EFF7] py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#0F172A]">Received Orders</h1>
          <p className="text-[#64748B] mt-2">Manage and fulfill consumer orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Package size={64} className="mx-auto mb-4 text-[#CBD5E1]" />
            <p className="text-xl text-[#64748B] mb-6">No orders received yet</p>
          </div>
        ) : (
          <>
            {/* Filter Tabs */}
            <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
              {['pending', 'accepted', 'confirmed', 'packed', 'shipped', 'delivered', 'rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                    filterStatus === status
                      ? 'bg-[#10b981] text-white'
                      : 'bg-white text-[#64748B] border border-[#E2E8F0]'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)} ({orders.filter(o => o.status === status).length})
                </button>
              ))}
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                  <Package size={48} className="mx-auto mb-3 text-[#CBD5E1]" />
                  <p className="text-[#64748B]">No orders with status "{filterStatus}"</p>
                </div>
              ) : (
                filteredOrders.map((order) => (
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

                    {/* Status Badge */}
                    <div className="mb-4">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </div>

                    {/* Items Summary */}
                    <div className="mb-4 p-3 bg-[#F1F5F9] rounded-lg">
                      <p className="text-sm font-semibold text-[#0F172A] mb-2">
                        Items ({order.items?.length || 0})
                      </p>
                      <div className="space-y-1">
                        {order.items?.slice(0, 3).map((item, idx) => (
                          <p key={idx} className="text-sm text-[#64748B]">
                            • {item.name} × {item.quantity} {item.quantityType || 'unit'}
                          </p>
                        ))}
                        {order.items?.length > 3 && (
                          <p className="text-sm text-[#10b981] font-semibold">
                            + {order.items.length - 3} more item(s)
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm font-semibold text-[#0F172A]">Customer: {order.customer_name}</p>
                      <p className="text-sm text-[#64748B]">📞 {order.customer_phone}</p>
                      <p className="text-sm text-[#64748B]">📧 {order.customer_email}</p>
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
                  <div className="flex flex-col items-end gap-3 md:w-56">
                    {/* Total Amount */}
                    <div className="text-right">
                      <p className="text-sm text-[#64748B]">Total</p>
                      <p className="text-3xl font-bold text-[#10b981]">
                        ₹{order.total_amount?.toLocaleString('en-IN')}
                      </p>
                    </div>

                    {/* Payment Status */}
                    <div className="flex items-center gap-2 text-sm">
                      <CreditCard size={16} />
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.payment_status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.payment_status === 'paid' ? '✓ Paid' : '⏳ ' + (order.payment_status || 'Unpaid')}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    {order.status === 'pending' && (
                      <div className="w-full space-y-2 pt-2">
                        <button
                          onClick={() => handleAcceptOrder(order.id)}
                          disabled={processing}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                          <Check size={16} />
                          {processing ? 'Accepting...' : 'Accept'}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowRejectModal(true);
                          }}
                          disabled={processing}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                        >
                          <X size={16} />
                          Reject
                        </button>
                      </div>
                    )}

                    {/* Communication Buttons */}
                    {(order.status === 'accepted' || order.status === 'confirmed' || order.status === 'packed') && (
                      <div className="w-full space-y-2 pt-2 border-t border-[#E2E8F0]">
                        <button
                          onClick={() => handleContactViaMail(order)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors text-sm"
                        >
                          <Send size={14} />
                          Email
                        </button>
                        <button
                          onClick={() => handleContactViaWhatsApp(order)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          <MessageCircle size={14} />
                          WhatsApp
                        </button>
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
                  </div>
                </div>
              </div>
            </div>
          )))}
        </div>
      </>
        )}
      </div>

      {/* Reject Reason Modal */}
      {showRejectModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-[#0F172A] mb-4">
              Reject Order #{selectedOrder.id}
            </h2>
            <p className="text-[#64748B] mb-4">
              Please provide a reason for rejection. The consumer will receive this message.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="E.g., Items out of stock, Unable to deliver to this location, etc."
              className="w-full px-4 py-3 border-2 border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent mb-4"
              rows="4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                  setSelectedOrder(null);
                }}
                className="flex-1 px-4 py-2 border-2 border-[#E2E8F0] text-[#64748B] font-semibold rounded-lg hover:bg-[#F1F5F9] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRejectOrder(selectedOrder.id)}
                disabled={processing}
                className="flex-1 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {processing ? 'Rejecting...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && !showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 max-h-96 overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => {
                setSelectedOrder(null);
                setRejectReason('');
              }}
              className="float-right text-[#64748B] hover:text-[#0F172A] text-2xl"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Order Details</h2>

            {/* Order Header */}
            <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-[#E2E8F0]">
              <div>
                <p className="text-sm text-[#64748B]">Order ID</p>
                <p className="font-semibold text-[#0F172A]"># {selectedOrder.id}</p>
              </div>
              <div>
                <p className="text-sm text-[#64748B]">Status</p>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold inline-block ${getStatusColor(
                    selectedOrder.status
                  )}`}
                >
                  {getStatusLabel(selectedOrder.status)}
                </span>
              </div>
            </div>

            {/* Customer Info */}
            <div className="mb-6">
              <h3 className="font-bold text-[#0F172A] mb-3">Customer Information</h3>
              <div className="space-y-2 text-sm text-[#64748B]">
                <p><strong>Name:</strong> {selectedOrder.customer_name}</p>
                <p><strong>Email:</strong> {selectedOrder.customer_email}</p>
                <p><strong>Phone:</strong> {selectedOrder.customer_phone}</p>
                <p><strong>Delivery Address:</strong> {selectedOrder.delivery_address}</p>
              </div>
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
                        {item.quantityType === 'bags'
                          ? `${item.quantity} bags`
                          : `${item.quantity}kg`} @ ₹{item.price?.toLocaleString()}/bag
                      </p>
                    </div>
                    <p className="font-bold text-[#10b981]">
                      ₹
                      {(
                        item.price *
                        (item.quantityType === 'weight'
                          ? item.quantity / item.weight_per_bag
                          : item.quantity)
                      ).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reject Reason (if status is pending) */}
            {selectedOrder.status === 'pending' && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                  Reject Reason (optional)
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Explain why you're rejecting this order..."
                  className="w-full px-4 py-2 border-2 border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#10b981] transition-colors"
                  rows="3"
                />
              </div>
            )}

            {/* Total */}
            <div className="pt-4 border-t border-[#E2E8F0] mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-[#0F172A]">Total Amount</span>
                <span className="text-2xl font-bold text-[#10b981]">
                  ₹{selectedOrder.total_amount?.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            {selectedOrder.status === 'pending' && (
              <div className="flex gap-3">
                <button
                  onClick={() => handleRejectOrder(selectedOrder.id)}
                  disabled={processing}
                  className="flex-1 px-6 py-3 bg-red-100 text-red-600 font-bold rounded-xl hover:bg-red-200 transition-colors disabled:opacity-50"
                >
                  {processing ? 'Processing...' : 'Reject Order'}
                </button>
                <button
                  onClick={() => handleAcceptOrder(selectedOrder.id)}
                  disabled={processing}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#10b981] to-[#059669] text-white font-bold rounded-xl hover:shadow-lg disabled:opacity-50"
                >
                  {processing ? 'Processing...' : 'Accept Order'}
                </button>
              </div>
            )}

            {selectedOrder.status === 'accepted' && (
              <div className="space-y-3">
                <button
                  onClick={() => handleUpdateDeliveryStatus(selectedOrder.id, 'confirmed')}
                  disabled={processing}
                  className="w-full px-6 py-3 bg-gradient-to-r from-[#10b981] to-[#059669] text-white font-bold rounded-xl hover:shadow-lg disabled:opacity-50"
                >
                  {processing ? 'Processing...' : '✓ Confirm Order'}
                </button>
              </div>
            )}

            {selectedOrder.status === 'confirmed' && (
              <div className="space-y-3">
                <button
                  onClick={() => handleUpdateDeliveryStatus(selectedOrder.id, 'packed')}
                  disabled={processing}
                  className="w-full px-6 py-3 bg-blue-100 text-blue-700 font-bold rounded-xl hover:bg-blue-200 transition-colors disabled:opacity-50"
                >
                  {processing ? 'Processing...' : '📦 Mark as Packed'}
                </button>
              </div>
            )}

            {selectedOrder.status === 'packed' && (
              <div className="space-y-3">
                <button
                  onClick={() => handleUpdateDeliveryStatus(selectedOrder.id, 'shipped')}
                  disabled={processing}
                  className="w-full px-6 py-3 bg-orange-100 text-orange-700 font-bold rounded-xl hover:bg-orange-200 transition-colors disabled:opacity-50"
                >
                  {processing ? 'Processing...' : '🚚 Mark as Shipped'}
                </button>
              </div>
            )}

            {selectedOrder.status === 'shipped' && (
              <div className="space-y-3">
                <button
                  onClick={() => handleUpdateDeliveryStatus(selectedOrder.id, 'delivered')}
                  disabled={processing}
                  className="w-full px-6 py-3 bg-green-100 text-green-700 font-bold rounded-xl hover:bg-green-200 transition-colors disabled:opacity-50"
                >
                  {processing ? 'Processing...' : '✓ Mark as Delivered'}
                </button>
              </div>
            )}

            {(selectedOrder.status === 'delivered' || selectedOrder.status === 'rejected') && (
              <button
                onClick={() => {
                  setSelectedOrder(null);
                  setRejectReason('');
                }}
                className="w-full px-6 py-3 bg-[#10b981] text-white font-bold rounded-xl hover:bg-[#059669]"
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerOrdersPage;
