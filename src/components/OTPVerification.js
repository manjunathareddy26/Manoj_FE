import React, { useState } from 'react';

const OTPVerification = ({ email, onSubmit, loading, onBack, isSignup = false }) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length < 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      await onSubmit(otp);
    } catch (err) {
      setError(err.message || 'OTP verification failed');
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-[#0F172A] font-bold text-xl mb-2">Verify Email</h2>
        <p className="text-[#64748B] text-sm">
          We've sent a 6-digit code to<br />
          <strong>{email}</strong>
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-[#0F172A] font-semibold mb-2 text-sm">
            Enter 6-digit code
          </label>
          <input
            type="text"
            maxLength="6"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value.replace(/\D/g, ''));
              setError('');
            }}
            placeholder="000000"
            className="w-full px-4 py-3 border-2 border-[#E2E8F0] rounded-xl text-center text-xl font-bold tracking-widest focus:outline-none focus:border-[#2563EB] transition-colors text-[#0F172A]"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || otp.length < 6}
          className="w-full bg-[#2563EB] text-white py-3 rounded-xl font-bold hover:bg-[#1d4ed8] shadow-[0_4px_14px_rgba(37,99,235,0.3)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-3"
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>

        <button
          type="button"
          onClick={onBack}
          className="w-full py-2 text-[#2563EB] font-semibold hover:bg-blue-50 rounded-lg transition-colors"
        >
          Back
        </button>
      </form>

      <div className="mt-4 text-center text-[#64748B] text-xs">
        <p>Didn't receive the code? <button className="text-[#2563EB] font-semibold hover:underline">Resend</button></p>
      </div>
    </div>
  );
};

export default OTPVerification;
