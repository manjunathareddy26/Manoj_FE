import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Clock, Send, CheckCircle, MessageSquare, HelpCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ContactUs = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate form submission — in production, hook to an email service
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-sand-50">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-farm-500 to-leaf-400 py-14 px-4 text-white text-center">
        <MessageSquare size={48} className="mx-auto mb-4 text-white/80" />
        <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
        <p className="text-white/80">We're here to help. Reach out anytime.</p>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-farm-500 font-medium mb-8 hover:text-farm-600">
          <ArrowLeft size={18} /> Back
        </button>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Get in touch</h2>
              <p className="text-gray-500">Whether you're a farmer or consumer, our team is ready to assist you.</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail size={20} className="text-farm-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Email</p>
                  <a href="mailto:support@farmbridge.com" className="text-farm-500 text-sm hover:underline">support@farmbridge.com</a>
                  <p className="text-xs text-gray-400 mt-0.5">We reply within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone size={20} className="text-blue-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Phone / WhatsApp</p>
                  <a href="tel:+918464001960" className="text-farm-500 text-sm hover:underline">+91 84640 01960</a>
                  <p className="text-xs text-gray-400 mt-0.5">Mon–Sat, 9 AM – 6 PM IST</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin size={20} className="text-orange-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Address</p>
                  <p className="text-sm text-gray-500">FarmBridge,<br />Gudur, Andhra Pradesh,<br />India – 524101</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock size={20} className="text-purple-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Support Hours</p>
                  <p className="text-sm text-gray-500">Monday – Saturday<br />9:00 AM – 6:00 PM IST</p>
                </div>
              </div>
            </div>

            {/* Quick links */}
            <div className="bg-farm-50 border border-farm-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <HelpCircle size={18} className="text-farm-500" />
                <p className="font-semibold text-farm-700">Quick Help</p>
              </div>
              <ul className="space-y-2 text-sm">
                <li>
                  <button onClick={() => navigate('/help')} className="text-farm-500 hover:underline">
                    → Browse our Help Center
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/privacy')} className="text-farm-500 hover:underline">
                    → Read Privacy Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/terms')} className="text-farm-500 hover:underline">
                    → Read Terms of Service
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Message Sent!</h3>
                <p className="text-gray-500 mb-6">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                  className="px-6 py-2.5 bg-farm-500 text-white rounded-xl font-semibold hover:bg-farm-600 transition-colors"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-gray-800 mb-6">Send us a message</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                      <input
                        name="name" value={form.name} onChange={handleChange} required
                        placeholder="Your name"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-farm-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        name="email" type="email" value={form.email} onChange={handleChange} required
                        placeholder="you@email.com"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-farm-300 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                    <select
                      name="subject" value={form.subject} onChange={handleChange} required
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-farm-300 text-sm bg-white"
                    >
                      <option value="">Select a topic</option>
                      <option>Order Issue</option>
                      <option>Payment Problem</option>
                      <option>Product Listing Help</option>
                      <option>Account Issue</option>
                      <option>Refund Request</option>
                      <option>Technical Bug</option>
                      <option>Partnership / Business</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                    <textarea
                      name="message" value={form.message} onChange={handleChange} required
                      rows={5} placeholder="Describe your issue or question in detail..."
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-farm-300 text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit" disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-farm-500 to-leaf-400 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-70"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <><Send size={18} /> Send Message</>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactUs;
