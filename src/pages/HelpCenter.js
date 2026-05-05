import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, ArrowLeft, Search, ShoppingBag, Truck, CreditCard, User, Leaf } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const faqs = [
  {
    category: 'For Consumers',
    icon: ShoppingBag,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    items: [
      {
        q: 'How do I buy products on FarmBridge?',
        a: 'Sign up or log in, select "Consumer" as your role. Browse available farm products, add items to your cart (choose per bag or per kg), and proceed to checkout. You can pay online via UPI/cards or choose Cash on Delivery.',
      },
      {
        q: 'Can I buy products per kg instead of per bag?',
        a: 'Yes! FarmBridge supports both per-bag and per-kg purchasing. When adding a product to your cart, you can select your preferred quantity type and enter the amount you need.',
      },
      {
        q: 'How do I track my order?',
        a: 'After placing an order, go to your Consumer Dashboard → Orders section. Each order shows real-time status: Pending → Accepted → Packed → Shipped → Delivered.',
      },
      {
        q: 'What payment methods are accepted?',
        a: 'We accept UPI, credit/debit cards, and net banking via Cashfree payment gateway. Cash on Delivery (COD) is also available for eligible orders.',
      },
      {
        q: 'Can I cancel my order?',
        a: 'Orders can be cancelled before the farmer accepts them. Once the farmer accepts, please contact the farmer directly through the order details.',
      },
    ],
  },
  {
    category: 'For Farmers',
    icon: Leaf,
    color: 'text-green-600',
    bg: 'bg-green-50',
    items: [
      {
        q: 'How do I list my products?',
        a: 'Log in as a Farmer → go to My Products → click "Add Product". Fill in the product name, price per bag, number of bags, weight per bag, description, and upload a photo.',
      },
      {
        q: 'How do I manage incoming orders?',
        a: 'Go to Farmer Dashboard → Orders. You can Accept or Reject each order. Once accepted, update the status as you pack and ship: Accepted → Packed → Shipped → Delivered.',
      },
      {
        q: 'When do I receive payment?',
        a: 'For online payments, Cashfree settles the amount to your registered bank account within 2–3 working days after order delivery is confirmed.',
      },
      {
        q: 'Can I update or delete my product listings?',
        a: 'Yes. Go to Farmer Dashboard → My Products. You can edit product details or delete listings that are no longer available.',
      },
    ],
  },
  {
    category: 'Shipping & Delivery',
    icon: Truck,
    color: 'text-orange-500',
    bg: 'bg-orange-50',
    items: [
      {
        q: 'How long does delivery take?',
        a: 'Delivery time depends on the farmer\'s location and your delivery address. Typical delivery is 2–5 business days. The farmer will update the order status as it progresses.',
      },
      {
        q: 'What is the delivery area?',
        a: 'FarmBridge currently serves orders across Andhra Pradesh and Telangana. We are expanding to more states soon.',
      },
      {
        q: 'Are there any delivery charges?',
        a: 'Delivery charges vary by order size and distance. The applicable charge is shown at checkout before you place your order.',
      },
    ],
  },
  {
    category: 'Payments & Refunds',
    icon: CreditCard,
    color: 'text-purple-500',
    bg: 'bg-purple-50',
    items: [
      {
        q: 'Is my payment information secure?',
        a: 'Yes. All payments are processed through Cashfree, a PCI-DSS compliant payment gateway. FarmBridge never stores your card or bank details.',
      },
      {
        q: 'What if my payment fails?',
        a: 'If a payment fails, no amount is deducted. You can retry the payment from the Orders page or choose COD instead.',
      },
      {
        q: 'How do I get a refund?',
        a: 'For prepaid orders that are cancelled or undelivered, refunds are processed within 5–7 business days to your original payment method. Contact us at support@farmbridge.com for assistance.',
      },
    ],
  },
  {
    category: 'Account & Profile',
    icon: User,
    color: 'text-teal-500',
    bg: 'bg-teal-50',
    items: [
      {
        q: 'How do I update my profile?',
        a: 'Log in → click your profile icon (top right) → Profile. You can update your name, phone number, WhatsApp number, and location.',
      },
      {
        q: 'Can I use Google to sign in?',
        a: 'Yes! Click "Sign in with Google" on the login page. Your Google account email is used to create or log into your FarmBridge account.',
      },
      {
        q: 'How do I change my role from Consumer to Farmer?',
        a: 'Roles are set at registration. To change your role, please contact us at support@farmbridge.com and we\'ll update it for you.',
      },
    ],
  },
];

const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden mb-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-800 pr-4">{q}</span>
        {open ? <ChevronUp size={18} className="flex-shrink-0 text-farm-500" /> : <ChevronDown size={18} className="flex-shrink-0 text-gray-400" />}
      </button>
      {open && (
        <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 text-gray-600 leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
};

const HelpCenter = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = faqs.map(cat => ({
    ...cat,
    items: cat.items.filter(
      item =>
        item.q.toLowerCase().includes(search.toLowerCase()) ||
        item.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="min-h-screen bg-sand-50">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-farm-500 to-leaf-400 py-16 px-4 text-white text-center">
        <h1 className="text-4xl font-bold mb-3">Help Center</h1>
        <p className="text-lg text-white/80 mb-8">Find answers to common questions about FarmBridge</p>
        <div className="max-w-xl mx-auto relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search help articles..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl text-gray-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-farm-500 font-medium mb-8 hover:text-farm-600">
          <ArrowLeft size={18} /> Back
        </button>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Search size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg">No results found for "<strong>{search}</strong>"</p>
            <button onClick={() => setSearch('')} className="mt-4 text-farm-500 underline">Clear search</button>
          </div>
        ) : (
          filtered.map(cat => {
            const Icon = cat.icon;
            return (
              <div key={cat.category} className="mb-10">
                <div className={`flex items-center gap-3 ${cat.bg} rounded-xl px-5 py-3 mb-4`}>
                  <Icon size={22} className={cat.color} />
                  <h2 className={`text-lg font-bold ${cat.color}`}>{cat.category}</h2>
                </div>
                {cat.items.map((item, i) => <FAQItem key={i} {...item} />)}
              </div>
            );
          })
        )}

        {/* Still need help */}
        <div className="mt-12 bg-farm-500 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-2">Still need help?</h3>
          <p className="text-white/80 mb-6">Our support team is available Mon–Sat, 9 AM – 6 PM IST</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button onClick={() => navigate('/contact')} className="bg-white text-farm-500 font-semibold px-6 py-2.5 rounded-xl hover:bg-sand-50 transition-colors">
              Contact Us
            </button>
            <a href="mailto:support@farmbridge.com" className="border border-white text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-white/10 transition-colors">
              Email Support
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HelpCenter;
