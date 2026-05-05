import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
      <span className="w-1 h-6 bg-farm-500 rounded-full inline-block" />
      {title}
    </h2>
    <div className="text-gray-600 leading-relaxed space-y-2">{children}</div>
  </div>
);

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-sand-50">
      <Navbar />

      <section className="bg-gradient-to-br from-farm-500 to-leaf-400 py-14 px-4 text-white text-center">
        <Shield size={48} className="mx-auto mb-4 text-white/80" />
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-white/80">Last updated: May 2026</p>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-farm-500 font-medium mb-8 hover:text-farm-600">
          <ArrowLeft size={18} /> Back
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <p className="text-gray-600 leading-relaxed mb-8">
            FarmBridge ("we", "us", or "our") operates <strong>farmbridge.in</strong> and its associated mobile applications. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
          </p>

          <Section title="1. Information We Collect">
            <p><strong>Account Information:</strong> When you register, we collect your name, email address, phone number, and role (farmer or consumer).</p>
            <p><strong>Profile Information:</strong> WhatsApp number, city/location, and profile photo (optional).</p>
            <p><strong>Order Information:</strong> Delivery address, order history, and payment status.</p>
            <p><strong>Product Information (Farmers):</strong> Product names, descriptions, prices, images, and inventory data you provide.</p>
            <p><strong>Device & Usage Data:</strong> Browser type, IP address, pages visited, and time spent — collected automatically to improve the platform.</p>
          </Section>

          <Section title="2. How We Use Your Information">
            <p>• To create and manage your account</p>
            <p>• To process orders and payments</p>
            <p>• To connect farmers with consumers</p>
            <p>• To send order status notifications and updates</p>
            <p>• To improve our platform features and performance</p>
            <p>• To comply with legal obligations</p>
          </Section>

          <Section title="3. Sharing of Information">
            <p>We do not sell your personal data. We share information only in these cases:</p>
            <p>• <strong>Between Farmers and Consumers:</strong> Consumer name and delivery address are shared with the farmer fulfilling your order.</p>
            <p>• <strong>Payment Processors:</strong> Payment data is processed by Cashfree Payments, which is PCI-DSS compliant. We never store card details.</p>
            <p>• <strong>Legal Requirements:</strong> We may disclose data if required by law or to protect the rights and safety of users.</p>
          </Section>

          <Section title="4. Data Retention">
            <p>We retain your account data as long as your account is active. Order records are retained for 3 years for accounting and legal compliance. You may request deletion of your account at any time by contacting us.</p>
          </Section>

          <Section title="5. Cookies">
            <p>We use essential cookies for authentication (login sessions). We do not use third-party advertising cookies. You can disable cookies in your browser settings, though this may affect some functionality.</p>
          </Section>

          <Section title="6. Security">
            <p>We use industry-standard security measures including HTTPS encryption, JWT-based authentication, and hashed passwords. However, no system is 100% secure — please use a strong, unique password.</p>
          </Section>

          <Section title="7. Your Rights">
            <p>You have the right to:</p>
            <p>• Access the personal data we hold about you</p>
            <p>• Request correction of inaccurate data</p>
            <p>• Request deletion of your account and data</p>
            <p>• Withdraw consent at any time</p>
            <p>To exercise these rights, email us at <a href="mailto:privacy@farmbridge.com" className="text-farm-500 underline">privacy@farmbridge.com</a></p>
          </Section>

          <Section title="8. Children's Privacy">
            <p>FarmBridge is not intended for users under the age of 18. We do not knowingly collect data from minors. If you believe a minor has registered, please contact us immediately.</p>
          </Section>

          <Section title="9. Changes to This Policy">
            <p>We may update this Privacy Policy periodically. We will notify registered users of significant changes via email. Continued use of the platform after changes constitutes acceptance.</p>
          </Section>

          <Section title="10. Contact Us">
            <p>For privacy-related queries, contact us at:</p>
            <p>📧 <a href="mailto:privacy@farmbridge.com" className="text-farm-500 underline">privacy@farmbridge.com</a></p>
            <p>📍 FarmBridge, Gudur, Andhra Pradesh, India – 524101</p>
          </Section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
