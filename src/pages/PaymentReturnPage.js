import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';
import axios from 'axios';

const PaymentReturnPage = () => {
  const { appOrderId } = useParams();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  const [syncing, setSyncing] = useState(true);
  const [syncStatus, setSyncStatus] = useState('checking'); // 'checking', 'paid', 'pending', 'error'

  // Verify payment status with backend (which checks Cashfree)
  const verifyPaymentStatus = useCallback(async (retryCount = 0) => {
    try {
      setSyncing(true);
      const response = await axios.post(
        `/api/payments/cashfree/sync/${appOrderId}`,
        {},
        { 
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          timeout: 10000,
        }
      );

      console.log('[PaymentReturn] Sync response:', response.data);

      if (response.data.success || response.data.status === 'PAID') {
        console.log('[PaymentReturn] ✅ Payment confirmed as PAID');
        setSyncStatus('paid');
        setSyncing(false);
        return true;
      } else if (response.data.status === 'PENDING' && retryCount < 3) {
        // Payment still pending, retry in 2 seconds
        console.log('[PaymentReturn] ⏳ Payment still pending, retrying...');
        setTimeout(() => verifyPaymentStatus(retryCount + 1), 2000);
        return false;
      } else {
        // Payment not yet confirmed
        setSyncStatus('pending');
        setSyncing(false);
        return false;
      }
    } catch (error) {
      console.error('[PaymentReturn] Verification error:', error);
      setSyncStatus('error');
      setSyncing(false);
      return false;
    }
  }, [appOrderId]);

  useEffect(() => {
    // Clean up sessionStorage
    sessionStorage.removeItem(`cf_order_id_${appOrderId}`);

    console.log('[PaymentReturn] ✅ Payment completed for order:', appOrderId);
    console.log('[PaymentReturn] Verifying payment status...');

    // Verify payment status immediately
    verifyPaymentStatus();

    // Countdown timer (still redirect even if verification not done)
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate('/orders?refresh=1');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [appOrderId, navigate, verifyPaymentStatus]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#E8EFF7] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-10 text-center">
        {syncing ? (
          <>
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <Loader size={48} className="text-blue-500 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-[#0F172A] mb-2">Verifying Payment...</h1>
            <p className="text-[#64748B] mb-6">
              Confirming with payment gateway. This may take a few seconds.
            </p>
          </>
        ) : syncStatus === 'paid' ? (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={48} className="text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-[#0F172A] mb-2">✅ Payment Confirmed!</h1>
            <p className="text-[#64748B] mb-2">
              Your order <span className="font-semibold text-[#0F172A]">#{appOrderId}</span> is paid and confirmed.
            </p>
            <p className="text-sm text-[#64748B] mb-6">
              Redirecting to your orders in <span className="font-bold text-green-600">{countdown}</span> seconds...
            </p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <AlertCircle size={48} className="text-yellow-600" />
            </div>
            <h1 className="text-2xl font-bold text-[#0F172A] mb-2">Payment Status: Pending</h1>
            <p className="text-[#64748B] mb-2">
              We're still confirming your payment for order <span className="font-semibold">#{appOrderId}</span>.
            </p>
            <p className="text-sm text-[#64748B] mb-6">
              Your payment has been submitted. It may take a moment to process.
            </p>
            <button
              onClick={() => verifyPaymentStatus()}
              className="w-full px-6 py-2 mb-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all"
            >
              Check Payment Status
            </button>
          </>
        )}

        {/* Progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-green-500 h-full rounded-full transition-all duration-1000"
            style={{ width: `${(countdown / 5) * 100}%` }}
          />
        </div>

        <button
          onClick={() => navigate('/orders?refresh=1')}
          className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-[#10b981] to-[#059669] text-white font-bold rounded-xl hover:shadow-lg transition-all"
        >
          Go to Orders Now
        </button>
      </div>
    </div>
  );
};

export default PaymentReturnPage;
