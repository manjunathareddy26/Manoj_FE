import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { toast } from 'react-toastify';
import { orderService, paymentService } from '../services/index';

const PaymentPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!orderId) {
          setError('Order ID is missing');
          setLoading(false);
          return;
        }

        const response = await orderService.getOrder(orderId);
        setOrderData(response.data);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError(err.response?.data?.message || 'Failed to load order details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleCashfreePayment = async () => {
    if (!orderData) {
      toast.error('Order details not loaded');
      return;
    }

    setProcessing(true);

    try {
      // Step 1: Create Cashfree order on backend
      console.log('[Payment] Requesting Cashfree session for order:', orderData.id);
      
      const res = await paymentService.createCashfreeOrder({
        amount:        Number(orderData.total_amount),
        appOrderId:    orderData.id,
        customerName:  orderData.customer_name  || 'Customer',
        customerEmail: orderData.customer_email || 'customer@farmbridgemarket.com',
        customerPhone: orderData.customer_phone || '9999999999',
      });

      console.log('[Payment] Backend response:', { 
        has_session: !!res.data.payment_session_id,
        has_order: !!res.data.cf_order_id,
      });

      const { cf_order_id, payment_session_id } = res.data;

      if (!payment_session_id) {
        throw new Error('Backend did not return a payment session. Response: ' + JSON.stringify(res.data));
      }

      if (typeof payment_session_id !== 'string' || payment_session_id.trim() === '') {
        throw new Error('Invalid payment_session_id format: ' + typeof payment_session_id);
      }

      console.log('[Payment] Got valid session, storing order ID and redirecting...');
      
      // Store cf_order_id for verification on the return page
      sessionStorage.setItem('cf_order_id_' + orderData.id, cf_order_id);

      // Redirect directly to Cashfree's hosted checkout URL
      // Must match production/sandbox mode configured on backend
      const env = process.env.REACT_APP_CASHFREE_ENV || 'production';
      const baseUrl = env === 'production'
        ? 'https://payments.cashfree.com/order'
        : 'https://sandbox.cashfreepayments.com/order';
      
      const checkoutUrl = `${baseUrl}?session_id=${payment_session_id}`;
      console.log('[Payment] Checkout URL:', checkoutUrl);
      console.log('[Payment] Session ID length:', payment_session_id.length);
      
      // Redirect IMMEDIATELY to avoid session expiry (no setTimeout delay)
      // Cashfree session IDs have short TTL; delaying can cause "client session is invalid" error
      sessionStorage.setItem('cf_order_id_' + orderData.id, cf_order_id);
      window.location.href = checkoutUrl;

    } catch (err) {
      console.error('[Payment] Error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      
      const errorMsg = err.response?.data?.cf_error_message 
        || err.response?.data?.message 
        || err.message 
        || 'Payment failed. Please try again.';
      
      toast.error(errorMsg);
      setProcessing(false);
    }
  };

  const handleCODPayment = async () => {
    try {
      setProcessing(true);
      await orderService.updatePaymentStatus(orderData.id, 'pending_payment');
      toast.success('Order confirmed! You will pay on delivery.');
      setTimeout(() => navigate('/orders'), 2000);
    } catch (err) {
      console.error('COD error:', err);
      toast.error('Failed to confirm order. Please try again.');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#E8EFF7] flex items-center justify-center">
        <div className="text-center">
          <Loader size={48} className="text-[#10b981] animate-spin mx-auto mb-4" />
          <p className="text-[#64748B] text-lg">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#E8EFF7] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center">
          <AlertCircle size={64} className="text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#0F172A] mb-2">Order Not Found</h1>
          <p className="text-[#64748B] mb-6">{error || 'Unable to load order details'}</p>
          <button
            onClick={() => navigate('/consumer')}
            className="w-full px-6 py-3 bg-gradient-to-r from-[#10b981] to-[#059669] text-white font-bold rounded-xl hover:shadow-lg transition-all"
          >
            Return to Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#E8EFF7] py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center gap-2 text-[#10b981] font-semibold mb-8 hover:text-[#059669]"
        >
          Back to Cart
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Payment Header */}
          <div className="bg-gradient-to-r from-[#10b981] to-[#059669] text-white p-8">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard size={32} />
              <h1 className="text-3xl font-bold">Payment</h1>
            </div>
            <p className="text-[#10b98180]">Complete your order by making a payment</p>
          </div>

          {/* Order Summary */}
          <div className="p-8 border-b border-[#E2E8F0]">
            <h2 className="text-xl font-bold text-[#0F172A] mb-6">Order Summary</h2>

            <div className="bg-[#F1F5F9] rounded-lg p-4 mb-6">
              <p className="text-sm text-[#64748B]">Order ID</p>
              <p className="text-lg font-bold text-[#0F172A]">#{orderData.id}</p>
            </div>

            {/* Items */}
            <div className="mb-6">
              <h3 className="font-semibold text-[#0F172A] mb-4">Items</h3>
              <div className="space-y-3">
                {orderData.items && orderData.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-[#F8FAFC] rounded-lg">
                    <div>
                      <p className="font-semibold text-[#0F172A]">{item.name}</p>
                      <p className="text-sm text-[#64748B]">
                        {item.quantityType === 'bags' ? `${item.quantity} bags` : `${item.quantity}kg`}
                      </p>
                    </div>
                    <p className="font-bold text-[#10b981]">
                      {(item.price * (item.quantityType === 'kg' ? item.quantity / item.weight_per_bag : item.quantity)).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="mb-6">
              <h3 className="font-semibold text-[#0F172A] mb-3">Delivery Address</h3>
              <p className="text-[#64748B] leading-relaxed">{orderData.delivery_address}</p>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 pt-6 border-t border-[#E2E8F0]">
              <div className="flex justify-between text-[#64748B]">
                <span>Subtotal</span>
                <span>{(orderData.total_amount * 0.95).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#64748B]">
                <span>Delivery</span>
                <span className="text-[#10b981] font-semibold">FREE</span>
              </div>
              <div className="flex justify-between text-[#64748B]">
                <span>Tax & Charges</span>
                <span>{(orderData.total_amount * 0.05).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-[#0F172A] pt-3 border-t border-[#E2E8F0]">
                <span>Total Amount</span>
                <span className="text-[#10b981]">{Number(orderData.total_amount).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="p-8">
            <h2 className="text-xl font-bold text-[#0F172A] mb-6">Choose Payment Method</h2>

            <div className="space-y-4">
              {/* Cashfree Online Payment */}
              <button
                onClick={handleCashfreePayment}
                disabled={processing}
                className="w-full p-6 border-2 border-[#E2E8F0] rounded-xl hover:border-[#10b981] hover:bg-[#10b98105] transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#10b98120] rounded-lg flex items-center justify-center group-hover:bg-[#10b98140] transition-colors">
                    <CreditCard size={24} className="text-[#10b981]" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-[#0F172A]">UPI / Debit Card / Credit Card / Net Banking</h3>
                    <p className="text-sm text-[#64748B]">Pay securely using Cashfree</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#10b981]">â‚¹{Number(orderData.total_amount).toLocaleString()}</p>
                    {processing && <Loader size={20} className="text-[#10b981] animate-spin ml-auto mt-2" />}
                  </div>
                </div>
              </button>

              {/* Cash on Delivery */}
              <button
                onClick={handleCODPayment}
                disabled={processing}
                className="w-full p-6 border-2 border-[#E2E8F0] rounded-xl hover:border-[#059669] hover:bg-[#05966905] transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#05966920] rounded-lg flex items-center justify-center group-hover:bg-[#05966940] transition-colors">
                    <CheckCircle size={24} className="text-[#059669]" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-[#0F172A]">Cash on Delivery (COD)</h3>
                    <p className="text-sm text-[#64748B]">Pay when your order is delivered</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Security Info */}
          <div className="bg-[#10b98110] border-t-2 border-[#10b981] p-6 text-center">
            <p className="text-sm text-[#10b981] font-semibold">
              Your transaction is secure and encrypted
            </p>
            <p className="text-xs text-[#64748B] mt-2">
              Payments are processed securely by Cashfree Payments. Your data is protected with industry-standard encryption.
            </p>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg p-6 text-center text-sm text-[#64748B]">
          <p>Need help? Contact us at <span className="font-semibold text-[#0F172A]">support@farmbridgemarketplace.com</span></p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;


