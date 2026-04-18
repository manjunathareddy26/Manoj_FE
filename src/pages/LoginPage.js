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
          {/* Sign In Card */}
          <div className="card shadow-2xl mb-6">
            <div className="text-center mb-8">
              <h1 className="heading-md text-farm-500 mb-2">Sign In</h1>
              <p className="text-gray-600">Sign in with your existing account</p>
            </div>

            <div className="flex justify-center mb-8">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                locale={localStorage.getItem('language') || 'en'}
              />
            </div>
          </div>

          {/* Sign Up Card */}
          <div className="card shadow-lg mb-6 border-2 border-leaf-300">
            <div className="text-center">
              <h2 className="heading-sm text-leaf-600 mb-3">New to FarmBridge?</h2>
              <p className="text-gray-600 text-sm mb-4">
                Create your account using Google - it's quick and secure!
              </p>
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  text="signup"
                  locale={localStorage.getItem('language') || 'en'}
                />
              </div>
            </div>
          </div>

          <div className="text-center text-gray-500 text-xs">
            <p>✅ First time? Create account | 🔄 Returning? Sign in</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
