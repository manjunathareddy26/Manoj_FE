import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';
import { authService } from '../services/index';
import useAuthStore from '../context/authStore';
import Navbar from '../components/Navbar';
import { Leaf, Users } from 'lucide-react';

const SignUp = () => {
  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore();
  const [step, setStep] = useState('role'); // 'role' or 'signup'
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    
    try {
      // Send token with role information
      const response = await authService.googleLogin(
        credentialResponse.credential,
        selectedRole
      );
      
      if (response.data.token && response.data.user) {
        localStorage.setItem('token', response.data.token);
        setToken(response.data.token);
        setUser(response.data.user);
        
        toast.success(`Welcome to FarmBridge as a ${selectedRole === 'farmer' ? 'Farmer' : 'Consumer'}!`);
        
        // Redirect based on role
        navigate(`/${selectedRole}`);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Signup failed';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = (error) => {
    console.error('Google signup error:', error);
    toast.error('Google signup failed. Please try again.');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col relative overflow-hidden">
      {/* Brand radial gradient background */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(37,99,235,0.08) 0%, transparent 60%)',
      }} />

      <Navbar />

      {/* Main container */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {step === 'role' ? (
            <>
              {/* Role Selection Screen */}
              <div className="bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,1)] border border-[#E2E8F0] overflow-hidden">
                {/* Header */}
                <div className="bg-[#0F172A] px-8 py-8 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                    <span className="text-white text-xl font-bold">🌾</span>
                  </div>
                  <p className="text-[#94A3B8] text-[11px] font-semibold uppercase tracking-[0.08em] mb-1">WELCOME</p>
                  <h1 className="text-white text-2xl font-bold">Join FarmBridge</h1>
                  <p className="text-[#94A3B8] text-sm mt-2">Choose how you want to participate</p>
                </div>

                {/* Content */}
                <div className="px-8 py-8">
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="space-y-4 mb-6">
                    {/* Farmer Option */}
                    <button
                      onClick={() => setSelectedRole('farmer')}
                      className={`w-full p-5 rounded-xl border-2 transition-all ${
                        selectedRole === 'farmer'
                          ? 'border-[#10b981] bg-green-50'
                          : 'border-[#E2E8F0] hover:border-[#10b981] hover:bg-green-50'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#10b981] text-white flex-shrink-0">
                          <Leaf size={24} />
                        </div>
                        <div className="text-left flex-1">
                          <h3 className="font-bold text-[#0F172A] mb-1">I'm a Farmer</h3>
                          <p className="text-sm text-[#64748B]">
                            Sell your fresh farm products directly to consumers
                          </p>
                        </div>
                        {selectedRole === 'farmer' && (
                          <div className="w-6 h-6 rounded-full bg-[#10b981] flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold">✓</span>
                          </div>
                        )}
                      </div>
                    </button>

                    {/* Consumer Option */}
                    <button
                      onClick={() => setSelectedRole('consumer')}
                      className={`w-full p-5 rounded-xl border-2 transition-all ${
                        selectedRole === 'consumer'
                          ? 'border-[#2563EB] bg-blue-50'
                          : 'border-[#E2E8F0] hover:border-[#2563EB] hover:bg-blue-50'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#2563EB] text-white flex-shrink-0">
                          <Users size={24} />
                        </div>
                        <div className="text-left flex-1">
                          <h3 className="font-bold text-[#0F172A] mb-1">I'm a Consumer</h3>
                          <p className="text-sm text-[#64748B]">
                            Browse and buy fresh products from local farmers
                          </p>
                        </div>
                        {selectedRole === 'consumer' && (
                          <div className="w-6 h-6 rounded-full bg-[#2563EB] flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold">✓</span>
                          </div>
                        )}
                      </div>
                    </button>
                  </div>

                  {/* Continue Button */}
                  <button
                    onClick={() => setStep('signup')}
                    disabled={!selectedRole || loading}
                    className="w-full bg-gradient-to-r from-[#2563EB] to-[#1d4ed8] text-white py-3 rounded-xl font-bold hover:shadow-lg shadow-[0_4px_14px_rgba(37,99,235,0.3)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue as {selectedRole === 'farmer' ? 'Farmer' : selectedRole === 'consumer' ? 'Consumer' : 'Selected'}
                  </button>

                  {/* Footer */}
                  <div className="mt-6 pt-6 border-t border-[#E2E8F0] text-center">
                    <p className="text-[#64748B]">
                      Already have an account?{' '}
                      <Link to="/signin" className="text-[#2563EB] font-semibold hover:text-[#1d4ed8] transition-colors">
                        Sign in
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Signup Screen with Google Login */}
              <div className="bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,1)] border border-[#E2E8F0] overflow-hidden">
                {/* Header */}
                <div className="bg-[#0F172A] px-8 py-8 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-xl" style={{
                    background: selectedRole === 'farmer'
                      ? 'linear-gradient(135deg, #10b981, #059669)'
                      : 'linear-gradient(135deg, #2563EB, #1d4ed8)'
                  }}>
                    <span className="text-white text-xl font-bold">
                      {selectedRole === 'farmer' ? '🌱' : '🛒'}
                    </span>
                  </div>
                  <p className="text-[#94A3B8] text-[11px] font-semibold uppercase tracking-[0.08em] mb-1">CREATE ACCOUNT</p>
                  <h1 className="text-white text-2xl font-bold">Register as {selectedRole === 'farmer' ? 'Farmer' : 'Consumer'}</h1>
                  <p className="text-[#94A3B8] text-sm mt-2">Join thousands of {selectedRole === 'farmer' ? 'farmers' : 'consumers'} on FarmBridge</p>
                </div>

                {/* Content */}
                <div className="px-8 py-8">
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Role Badge */}
                  <div className="mb-6 p-3 rounded-lg bg-[#F1F5F9] border border-[#E2E8F0]">
                    <p className="text-sm text-[#0F172A]">
                      <span className="font-semibold">Registering as:</span>{' '}
                      <span className={selectedRole === 'farmer' ? 'text-[#10b981]' : 'text-[#2563EB]'}>
                        {selectedRole === 'farmer' ? 'Farmer' : 'Consumer'}
                      </span>
                    </p>
                  </div>

                  {/* Google Sign Up Button */}
                  <div className="mb-6">
                    <div className="flex justify-center">
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        text="signup"
                        size="large"
                        width="100%"
                      />
                    </div>
                  </div>

                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#E2E8F0]"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-[#94A3B8]">or</span>
                    </div>
                  </div>

                  {/* Back Button */}
                  <button
                    onClick={() => setStep('role')}
                    className="w-full py-2 px-4 rounded-lg font-medium text-[#2563EB] hover:bg-blue-50 transition-all duration-200"
                  >
                    ← Back to Role Selection
                  </button>

                  {/* Footer */}
                  <div className="mt-6 pt-6 border-t border-[#E2E8F0] text-center">
                    <p className="text-[#64748B] text-sm">
                      Already have an account?{' '}
                      <Link to="/signin" className="text-[#2563EB] font-semibold hover:text-[#1d4ed8] transition-colors">
                        Sign in
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
