import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, AlertCircle, Loader } from 'lucide-react';
import { toast } from 'react-toastify';
import { paymentService } from '../services/index';

const PaymentReturnPage = () => {
  const { appOrderId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying | success | failed | timeout
  const [verificationAttempts, setVerificationAttempts] = useState(0);

  useEffect(() => {
    const verify = async () => {
      // cf_order_id comes from return_url query param OR sessionStorage fallback
      const cfOrderIdFromUrl = searchParams.get('cf_order_id');
      const cfOrderIdFromStorage = sessionStorage.getItem(`cf_order_id_${appOrderId}`);
      const cf_order_id = cfOrderIdFromUrl || cfOrderIdFromStorage;

      console.log('[PaymentReturn] Verifying payment for order:', appOrderId);
      console.log('[PaymentReturn] cf_order_id from URL:', cfOrderIdFromUrl);
      console.log('[PaymentReturn] cf_order_id from storage:', cfOrderIdFromStorage);
      console.log('[PaymentReturn] Using cf_order_id:', cf_order_id);

      if (!cf_order_id) {
        console.error('[PaymentReturn] No cf_order_id found - cannot verify payment');
        setStatus('failed');
        return;
      }

      try {
        const res = await paymentService.verifyCashfreePayment({ cf_order_id, appOrderId });
        console.log('[PaymentReturn] Verification response:', res.data);
        sessionStorage.removeItem(`cf_order_id_${appOrderId}`);

        if (res.data.success && res.data.status === 'PAID') {
          console.log('[PaymentReturn] Payment verified successfully');
          setStatus('success');
          toast.success('Payment successful!');
          setTimeout(() => navigate('/orders'), 3000);
        } else {
          console.log('[PaymentReturn] Payment not in PAID status:', res.data.status);
          setStatus('failed');
          toast.error('Payment could not be verified. Please check your order status.');
        }
      } catch (err) {
        console.error('[PaymentReturn] Verification error:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
        
        // If verification fails, but we have an order ID, allow manual navigation
        if (verificationAttempts < 2) {
          setVerificationAttempts(prev => prev + 1);
          // Retry once after 2 seconds
          setTimeout(verify, 2000);
        } else {
          setStatus('timeout');
        }
      }
    };

    verify();
  }, [appOrderId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#E8EFF7] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-10 text-center">
        {status === 'verifying' && (
          <>
            <Loader size={64} className="text-[#10b981] animate-spin mx-auto mb-5" />
            <h1 className="text-2xl font-bold text-[#0F172A] mb-2">Verifying Payment</h1>
            <p className="text-[#64748B]">Please wait while we confirm your payment...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={48} className="text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-[#0F172A] mb-2">Payment Successful!</h1>
            <p className="text-[#64748B] mb-6">
              Your order <span className="font-semibold text-[#0F172A]">#{appOrderId}</span> has been confirmed.
            </p>
            <p className="text-sm text-[#64748B]">Redirecting to your dashboard in a moment...</p>
            <div className="mt-6 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-green-500 h-full rounded-full animate-[width_3s_linear]" style={{ width: '100%', transition: 'width 3s linear' }} />
            </div>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <XCircle size={48} className="text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-[#0F172A] mb-2">Payment Failed</h1>
            <p className="text-[#64748B] mb-2">
              We could not verify your payment for order <span className="font-semibold">#{appOrderId}</span>.
            </p>
            <p className="text-sm text-[#64748B] mb-6">
              If money was deducted from your account, please contact support with your order ID.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate(`/payment/${appOrderId}`)}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#10b981] to-[#059669] text-white font-bold rounded-xl hover:shadow-lg transition-all"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/orders')}
                className="w-full px-6 py-3 border border-gray-200 text-[#64748B] font-semibold rounded-xl hover:bg-gray-50 transition-all"
              >
                Go to Orders
              </button>
            </div>
          </>
        )}

        {status === 'timeout' && (
          <>
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <AlertCircle size={48} className="text-yellow-600" />
            </div>
            <h1 className="text-2xl font-bold text-[#0F172A] mb-2">Taking Longer Than Expected</h1>
            <p className="text-[#64748B] mb-2">
              We're still verifying your payment for order <span className="font-semibold">#{appOrderId}</span>.
            </p>
            <p className="text-sm text-[#64748B] mb-6">
              Your payment may have been processed. You can check your order status below.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/orders')}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#10b981] to-[#059669] text-white font-bold rounded-xl hover:shadow-lg transition-all"
              >
                View My Orders
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full px-6 py-3 border border-gray-200 text-[#64748B] font-semibold rounded-xl hover:bg-gray-50 transition-all"
              >
                Refresh & Retry
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentReturnPage;
