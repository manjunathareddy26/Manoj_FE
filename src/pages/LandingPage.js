import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Users, Leaf, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const LandingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const navigateToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-sand-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-farm-50 via-white to-leaf-50 py-20 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-slideInUp">
            <h1 className="heading-hero text-farm-500 mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={navigateToLogin}
                className="btn-primary flex items-center gap-2 text-lg"
              >
                {t('hero.cta_login')}
                <ArrowRight size={20} />
              </button>
              <button className="btn-secondary text-lg">
                {t('hero.cta_explore')}
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative h-96 animate-fadeIn">
            <div className="absolute inset-0 bg-gradient-to-br from-farm-300 to-leaf-300 rounded-2xl opacity-20 blur-2xl"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 h-full flex items-center justify-center">
              <div className="text-center">
                <Leaf className="w-24 h-24 text-farm-500 mx-auto mb-4" />
                <p className="text-2xl font-poppins font-bold text-farm-500">Fresh Farm Produce</p>
                <p className="text-gray-600 mt-2">Delivered Fresh Daily</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="heading-lg text-center mb-16 text-farm-500">
            {t('features.title')}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card card-hover group">
              <div className="text-farm-500 mb-4 group-hover:scale-110 transition-transform">
                <Leaf size={40} />
              </div>
              <h3 className="heading-sm mb-3">{t('features.fresh')}</h3>
              <p className="text-gray-600">{t('features.fresh_desc')}</p>
            </div>

            {/* Feature 2 */}
            <div className="card card-hover group">
              <div className="text-farm-500 mb-4 group-hover:scale-110 transition-transform">
                <Users size={40} />
              </div>
              <h3 className="heading-sm mb-3">{t('features.direct')}</h3>
              <p className="text-gray-600">{t('features.direct_desc')}</p>
            </div>

            {/* Feature 3 */}
            <div className="card card-hover group">
              <div className="text-harvest-300 mb-4 group-hover:scale-110 transition-transform">
                <ShoppingCart size={40} />
              </div>
              <h3 className="heading-sm mb-3">{t('features.fair')}</h3>
              <p className="text-gray-600">{t('features.fair_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 px-4 bg-sand-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="heading-lg text-center mb-16 text-farm-500">
            {t('products.title')}
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card card-hover">
                <div className="h-40 bg-gradient-to-br from-farm-100 to-leaf-100 rounded-lg mb-4 flex items-center justify-center">
                  <Leaf className="w-16 h-16 text-farm-300" />
                </div>
                <h3 className="font-semibold mb-2">Premium Rice</h3>
                <p className="text-sm text-gray-600 mb-4">20 kg bag • ₹450</p>
                <button className="btn-secondary w-full">
                  {t('products.add_to_cart')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="heading-lg text-center mb-16 text-farm-500">
            {t('how_it_works.title')}
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center animate-slideInUp" style={{animationDelay: '0s'}}>
              <div className="w-16 h-16 bg-farm-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="heading-sm mb-3">{t('how_it_works.step1')}</h3>
              <p className="text-gray-600">{t('how_it_works.step1_desc')}</p>
            </div>

            <div className="text-center animate-slideInUp" style={{animationDelay: '0.1s'}}>
              <div className="w-16 h-16 bg-leaf-300 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="heading-sm mb-3">{t('how_it_works.step2')}</h3>
              <p className="text-gray-600">{t('how_it_works.step2_desc')}</p>
            </div>

            <div className="text-center animate-slideInUp" style={{animationDelay: '0.2s'}}>
              <div className="w-16 h-16 bg-harvest-300 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="heading-sm mb-3">{t('how_it_works.step3')}</h3>
              <p className="text-gray-600">{t('how_it_works.step3_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-farm-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="heading-lg text-white mb-6">Ready to Get Started?</h2>
          <p className="text-white text-lg mb-8">Join FarmBridge today and start supporting local farmers</p>
          <button
            onClick={navigateToLogin}
            className="bg-white text-farm-500 px-8 py-3 rounded-md font-semibold hover:bg-sand-50 transition-colors"
          >
            {t('hero.cta_login')}
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
