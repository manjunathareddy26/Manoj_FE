import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const PaymentReturnPage = () => {
  const { appOrderId } = useParams();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Clean up sessionStorage
    sessionStorage.removeItem(`cf_order_id_${appOrderId}`);

    console.log('[PaymentReturn] ✅ Payment completed for order:', appOrderId);
    console.log('[PaymentReturn] Redirecting to orders page...');

    // Countdown and redirect to orders
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate('/orders');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [appOrderId, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#E8EFF7] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-10 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={48} className="text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-[#0F172A] mb-2">✅ Payment Successful!</h1>
        <p className="text-[#64748B] mb-2">
          Your order <span className="font-semibold text-[#0F172A]">#{appOrderId}</span> has been placed.
        </p>
        <p className="text-sm text-[#64748B] mb-6">
          Redirecting to your orders in <span className="font-bold text-green-600">{countdown}</span> seconds...
        </p>

        {/* Progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-green-500 h-full rounded-full transition-all duration-1000"
            style={{ width: `${(countdown / 5) * 100}%` }}
          />
        </div>

        <button
          onClick={() => navigate('/orders')}
          className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-[#10b981] to-[#059669] text-white font-bold rounded-xl hover:shadow-lg transition-all"
        >
          Go to Orders Now
        </button>
      </div>
    </div>
  );
};

export default PaymentReturnPage;
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

        {status === 'pending' && (
          <>
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <Loader size={48} className="text-blue-500 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-[#0F172A] mb-2">Payment Pending</h1>
            <p className="text-[#64748B] mb-2">
              Your payment is being processed for order <span className="font-semibold">#{appOrderId}</span>.
            </p>
            <p className="text-sm text-[#64748B] mb-6">
              We'll redirect you to your orders page in a moment to check the status.
            </p>
            <div className="mt-6 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full animate-[width_5s_linear]" style={{ width: '100%', transition: 'width 5s linear' }} />
            </div>
          </>
        )}

        {status === 'unknown' && (
          <>
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <AlertCircle size={48} className="text-purple-600" />
            </div>
            <h1 className="text-2xl font-bold text-[#0F172A] mb-2">Payment Status Unknown</h1>
            <p className="text-[#64748B] mb-2">
              We couldn't determine the status of your payment for order <span className="font-semibold">#{appOrderId}</span>.
            </p>
            <p className="text-sm text-[#64748B] mb-6">
              Please check your orders page to see the current status.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/orders')}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#10b981] to-[#059669] text-white font-bold rounded-xl hover:shadow-lg transition-all"
              >
                View My Orders
              </button>
            </div>
          </>
        )}

        {status === 'api_error' && (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <AlertCircle size={48} className="text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-[#0F172A] mb-2">Verification Service Unavailable</h1>
            <p className="text-[#64748B] mb-2">
              We're having trouble verifying your payment for order <span className="font-semibold">#{appOrderId}</span>.
            </p>
            <p className="text-sm text-[#64748B] mb-6">
              ✅ Your payment may have been processed successfully. We're redirecting you to check your orders...
            </p>
            <div className="mt-6 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-red-500 h-full rounded-full animate-[width_3s_linear]" style={{ width: '100%', transition: 'width 3s linear' }} />
            </div>
            <p className="text-xs text-[#64748B] mt-4">Auto-redirecting in 3 seconds...</p>
            <div className="space-y-3 mt-6">
              <button
                onClick={() => navigate('/orders')}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#10b981] to-[#059669] text-white font-bold rounded-xl hover:shadow-lg transition-all"
              >
                Check My Orders Now
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentReturnPage;
