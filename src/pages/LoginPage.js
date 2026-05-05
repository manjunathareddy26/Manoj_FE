import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';
import useAuthStore from '../context/authStore';
import { authService } from '../services';
import Navbar from '../components/Navbar';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setUser, setToken, setLoading, setError } = useAuthStore();

  const handleGoogleSuccess = useCallback(async (credentialResponse) => {
    setLoading(true);
    try {
      const response = await authService.googleLogin(credentialResponse.credential);
      
      if (response.data.token) {
        setToken(response.data.token);
        setUser(response.data.user);
        
        if (response.data.user.role) {
          navigate(`/${response.data.user.role}`);
        } else {
          navigate('/select-role');
        }
        
        toast.success('Login successful!');
      }
    } catch (error) {
      setError(error.message);
      toast.error(t('errors.auth_error'));
    } finally {
      setLoading(false);
    }
  }, [setUser, setToken, setLoading, setError, navigate, t]);

  const handleGoogleError = () => {
    toast.error(t('errors.auth_error'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-farm-50 to-leaf-50">
      <Navbar />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="w-full max-w-md">
          <div className="card shadow-2xl mb-6">
            <div className="text-center mb-8">
              <h1 className="heading-md text-farm-500 mb-2">Sign In / Sign Up</h1>
              <p className="text-gray-600">Use your Google account to get started</p>
            </div>

            <div className="flex justify-center mb-4">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                locale={localStorage.getItem('language') || 'en'}
                size="large"
              />
            </div>

            <p className="text-center text-gray-500 text-xs">
              ✅ New here? An account will be created automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
