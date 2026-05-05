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
            <div className="relative bg-white rounded-2xl shadow-2xl h-full flex items-center justify-center overflow-hidden">
              <img
                src={`${process.env.PUBLIC_URL}/farmer.png`}
                alt="Farmer using FarmBridge"
                className="h-full w-full object-contain object-center"
              />
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

          {/* Auto-scrolling product strip */}
          <div className="overflow-hidden relative">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-sand-50 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-sand-50 to-transparent z-10 pointer-events-none" />

            <style>{`
              @keyframes scroll-products {
                0%   { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .scroll-track {
                display: flex;
                width: max-content;
                animation: scroll-products 28s linear infinite;
              }
              .scroll-track:hover { animation-play-state: paused; }
            `}</style>

            <div className="scroll-track gap-6 flex">
              {[
                { name: 'Red Chillies',  qty: '1 kg bag',  price: '₹120', color: 'from-red-100 to-orange-100',    icon: '🌶️', img: 'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?auto=format&fit=crop&w=400&q=80' },
                { name: 'Tomatoes',      qty: '5 kg bag',  price: '₹80',  color: 'from-red-50 to-rose-100',       icon: '🍅', img: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=400&q=80' },
                { name: 'Paddy (Rice)',  qty: '25 kg bag', price: '₹850', color: 'from-yellow-50 to-amber-100',   icon: '🌾', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80' },
                
                
                { name: 'Wheat',         qty: '50 kg bag', price: '₹1400',color: 'from-yellow-100 to-lime-100',   icon: '🌿', img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80' },
                { name: 'Spices',      qty: '500 g',     price: '₹95',  color: 'from-yellow-200 to-orange-100', icon: '🟡', img: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=400&q=80' },
                { name: 'Maize (Corn)',  qty: '20 kg bag', price: '₹480', color: 'from-yellow-50 to-green-100',   icon: '🌽', img: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=400&q=80' },
                { name: 'Apple',     qty: '10 kg',     price: '₹180', color: 'from-green-50 to-emerald-100',  icon: '�', img: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=400&q=80' },
                { name: 'Potato',        qty: '10 kg bag', price: '₹260', color: 'from-stone-100 to-amber-50',    icon: '🥔', img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80' },
                // duplicate for seamless loop
                { name: 'Red Chillies',  qty: '1 kg bag',  price: '₹120', color: 'from-red-100 to-orange-100',    icon: '🌶️', img: 'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?auto=format&fit=crop&w=400&q=80' },
                { name: 'Tomatoes',      qty: '5 kg bag',  price: '₹80',  color: 'from-red-50 to-rose-100',       icon: '🍅', img: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=400&q=80' },
                { name: 'Paddy (Rice)',  qty: '25 kg bag', price: '₹850', color: 'from-yellow-50 to-amber-100',   icon: '🌾', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80' },
                
                
                { name: 'Wheat',         qty: '50 kg bag', price: '₹1400',color: 'from-yellow-100 to-lime-100',   icon: '🌿', img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80' },
                { name: 'Spices',      qty: '500 g',     price: '₹95',  color: 'from-yellow-200 to-orange-100', icon: '🟡', img: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=400&q=80' },
                { name: 'Maize (Corn)',  qty: '20 kg bag', price: '₹480', color: 'from-yellow-50 to-green-100',   icon: '🌽', img: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=400&q=80' },
                { name: 'Apple',     qty: '10 kg',     price: '₹180', color: 'from-green-50 to-emerald-100',  icon: '🎋', img: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=400&q=80' },
                { name: 'Potato',        qty: '10 kg bag', price: '₹260', color: 'from-stone-100 to-amber-50',    icon: '🥔', img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80' },
              ].map((product, i) => (
                <div key={i} className="flex-shrink-0 w-52 card card-hover cursor-pointer">
                  <div className={`h-36 bg-gradient-to-br ${product.color} rounded-xl mb-4 overflow-hidden flex items-center justify-center`}>
                    <img
                      src={product.img}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display='none'; e.target.parentNode.classList.add('text-6xl'); e.target.parentNode.innerText = product.icon; }}
                    />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">{product.qty} • <span className="text-farm-500 font-bold">{product.price}</span></p>
                  <button
                    onClick={navigateToLogin}
                    className="btn-secondary w-full text-sm py-1.5"
                  >
                    {t('products.add_to_cart')}
                  </button>
                </div>
              ))}
            </div>
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
