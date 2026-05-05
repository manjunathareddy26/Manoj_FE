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
          // Navigate with refresh flag to force OrdersPage to refetch
          navigate('/orders?refresh=1');
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
