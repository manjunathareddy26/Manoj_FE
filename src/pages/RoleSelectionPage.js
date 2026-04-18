import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Users, Leaf, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import useAuthStore from '../context/authStore';
import { authService } from '../services';
import Navbar from '../components/Navbar';

const RoleSelectionPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showRoleWarning, setShowRoleWarning] = useState(false);
  const { user, setUser } = useAuthStore();

  // Check if user is trying to access wrong role
  const handleRoleSelection = async (role) => {
    // If user has an existing role and tries to select a different role
    if (user?.role && user.role !== role) {
      setSelectedRole(role);
      setShowRoleWarning(true);
      toast.warning(`You are registered as a ${user.role}, not a ${role}!`);
      return;
    }

    // If no existing role or role matches, proceed
    setSelectedRole(role);
    setLoading(true);
    setShowRoleWarning(false);

    try {
      const response = await authService.completeProfile({ role });
      setUser(response.data.user);
      toast.success(`✅ Welcome ${response.data.user.first_name || ''}! Entering ${role} portal...`);
      navigate(`/${role}`);
    } catch (error) {
      toast.error(t('errors.submit_error'));
      setLoading(false);
      setSelectedRole(null);
    }
  };

  const handleContinueCorrectRole = async () => {
    setLoading(true);
    setShowRoleWarning(false);

    try {
      const response = await authService.completeProfile({ role: user.role });
      setUser(response.data.user);
      toast.success(`✅ Welcome ${user.first_name || ''}! Accessing your ${user.role} dashboard...`);
      navigate(`/${user.role}`);
    } catch (error) {
      toast.error(t('errors.submit_error'));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-farm-50 to-leaf-50">
      <Navbar />

      {/* Role Warning Alert */}
      {showRoleWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle size={32} className="text-red-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">Role Mismatch</h2>
            <p className="text-gray-600 text-center mb-6 leading-relaxed">
              Your account is registered as a <strong className="text-farm-500">{user?.role?.toUpperCase()}</strong>
              , but you're trying to access as a <strong>{selectedRole?.toUpperCase()}</strong>.
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>ℹ️ Important:</strong> Each account can only be used for the role it was created with.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowRoleWarning(false);
                  setSelectedRole(null);
                }}
                className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={handleContinueCorrectRole}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-farm-500 text-white font-semibold rounded-lg hover:bg-farm-600 transition-colors disabled:opacity-50"
              >
                {loading ? 'Accessing...' : `Access as ${user?.role}`}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-12">
            <h1 className="heading-hero text-farm-500 mb-4">{t('auth.select_role')}</h1>
            <p className="text-xl text-gray-600">
              {user?.role
                ? `Access your ${user.role} dashboard or create a new account`
                : 'Choose how you want to use FarmBridge'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Farmer Card */}
            <div
              className={`card card-hover cursor-pointer transition-all relative ${
                selectedRole === 'farmer' ? 'ring-2 ring-farm-500 scale-105' : ''
              } ${user?.role === 'farmer' ? 'border-2 border-farm-500' : ''}`}
              onClick={() => handleRoleSelection('farmer')}
            >
              {user?.role === 'farmer' && (
                <div className="absolute top-4 right-4 p-2 bg-green-100 rounded-full">
                  <CheckCircle size={20} className="text-green-600" />
                </div>
              )}
              <div className="flex justify-center mb-6">
                <div className="p-6 bg-farm-50 rounded-full">
                  <Leaf className="w-16 h-16 text-farm-500" />
                </div>
              </div>
              <h2 className="heading-md text-center mb-4">{t('auth.farmer')}</h2>
              <p className="text-center text-gray-600 mb-6">{t('auth.farmer_desc')}</p>
              {user?.role === 'farmer' && (
                <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 rounded">
                  <p className="text-sm text-green-800">✓ Your registered role</p>
                </div>
              )}
              <button
                disabled={loading && selectedRole === 'farmer'}
                className="btn-primary w-full disabled:opacity-50"
              >
                {loading && selectedRole === 'farmer' ? 'Loading...' : 'Select'}
              </button>
            </div>

            {/* Consumer Card */}
            <div
              className={`card card-hover cursor-pointer transition-all relative ${
                selectedRole === 'consumer' ? 'ring-2 ring-leaf-300 scale-105' : ''
              } ${user?.role === 'consumer' ? 'border-2 border-green-500' : ''}`}
              onClick={() => handleRoleSelection('consumer')}
            >
              {user?.role === 'consumer' && (
                <div className="absolute top-4 right-4 p-2 bg-green-100 rounded-full">
                  <CheckCircle size={20} className="text-green-600" />
                </div>
              )}
              <div className="flex justify-center mb-6">
                <div className="p-6 bg-leaf-50 rounded-full">
                  <Users className="w-16 h-16 text-leaf-300" />
                </div>
              </div>
              <h2 className="heading-md text-center mb-4">{t('auth.consumer')}</h2>
              <p className="text-center text-gray-600 mb-6">{t('auth.consumer_desc')}</p>
              {user?.role === 'consumer' && (
                <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 rounded">
                  <p className="text-sm text-green-800">✓ Your registered role</p>
                </div>
              )}
              <button
                disabled={loading && selectedRole === 'consumer'}
                className="btn-primary w-full disabled:opacity-50"
              >
                {loading && selectedRole === 'consumer' ? 'Loading...' : 'Select'}
              </button>
            </div>
          </div>

          {user && (
            <div className="mt-8 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>👤 Logged in as:</strong> {user.first_name} {user.last_name} ({user.email})
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
