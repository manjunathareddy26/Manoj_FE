import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogOut, User, ShoppingCart, Menu, X } from 'lucide-react';
import useAuthStore from '../context/authStore';
import useCartStore from '../context/cartStore';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const cartItems = useCartStore((state) => state.items);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const isPublicPage = ['/', '/login', '/select-role'].includes(location.pathname);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 bg-farm-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">FB</span>
            </div>
            <span className="text-xl font-poppins font-bold text-farm-500">FarmBridge</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {!isPublicPage && user && (
              <>
                {user.role === 'consumer' && (
                  <>
                    <button
                      onClick={() => navigate('/consumer')}
                      className="text-gray-700 hover:text-farm-500 transition"
                    >
                      {t('consumer_dashboard.title')}
                    </button>
                    <button
                      onClick={() => navigate('/cart')}
                      className="relative text-gray-700 hover:text-farm-500 transition"
                    >
                      <ShoppingCart size={24} />
                      {cartItems.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-farm-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {cartItems.length}
                        </span>
                      )}
                    </button>
                  </>
                )}
                {user.role === 'farmer' && (
                  <button
                    onClick={() => navigate('/farmer')}
                    className="text-gray-700 hover:text-farm-500 transition"
                  >
                    {t('farmer_dashboard.title')}
                  </button>
                )}
              </>
            )}

            {/* Language Selector */}
            <div className="flex gap-2 bg-sand-50 p-1 rounded-lg">
              {['en', 'hi', 'te', 'kn', 'ta'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`px-2 py-1 rounded text-sm font-semibold ${
                    i18n.language === lang
                      ? 'bg-farm-500 text-white'
                      : 'text-gray-600 hover:bg-white'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Auth Buttons */}
            {token && user ? (
              <>
                <button
                  onClick={() => navigate('/profile')}
                  className="flex items-center gap-2 text-gray-700 hover:text-farm-500"
                >
                  <User size={20} />
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 btn-secondary"
                >
                  <LogOut size={20} />
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="btn-primary"
              >
                {t('nav.login')}
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t">
            {!isPublicPage && user && (
              <>
                <button
                  onClick={() => {
                    navigate(user.role === 'consumer' ? '/consumer' : '/farmer');
                    setMobileOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-sand-50"
                >
                  {t('nav.dashboard')}
                </button>
                {user.role === 'consumer' && (
                  <button
                    onClick={() => {
                      navigate('/cart');
                      setMobileOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-sand-50 relative"
                  >
                    {t('nav.cart')} {cartItems.length > 0 && `(${cartItems.length})`}
                  </button>
                )}
              </>
            )}
            <div className="px-4 py-2 flex gap-2">
              {['en', 'hi', 'te', 'kn', 'ta'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    handleLanguageChange(lang);
                    setMobileOpen(false);
                  }}
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    i18n.language === lang
                      ? 'bg-farm-500 text-white'
                      : 'bg-sand-50 text-gray-600'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
            {token && user ? (
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-sand-50 border-t"
              >
                {t('nav.logout')}
              </button>
            ) : (
              <button
                onClick={() => {
                  navigate('/login');
                  setMobileOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-sand-50 border-t"
              >
                {t('nav.login')}
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
