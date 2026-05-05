import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
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

const TermsOfService = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-sand-50">
      <Navbar />

      <section className="bg-gradient-to-br from-farm-500 to-leaf-400 py-14 px-4 text-white text-center">
        <FileText size={48} className="mx-auto mb-4 text-white/80" />
        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-white/80">Last updated: May 2026</p>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-farm-500 font-medium mb-8 hover:text-farm-600">
          <ArrowLeft size={18} /> Back
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <p className="text-gray-600 leading-relaxed mb-8">
            By accessing or using FarmBridge ("Platform"), you agree to be bound by these Terms of Service. Please read them carefully before registering or making transactions on our platform.
          </p>

          <Section title="1. Acceptance of Terms">
            <p>By creating an account or using any feature of FarmBridge, you confirm that you are at least 18 years old and agree to these Terms of Service and our Privacy Policy. If you do not agree, please do not use the platform.</p>
          </Section>

          <Section title="2. User Roles">
            <p><strong>Consumers</strong> may browse products, place orders, and make payments through FarmBridge.</p>
            <p><strong>Farmers</strong> may list agricultural products for sale, manage inventory, and fulfill orders.</p>
            <p>Each user may only register one account per role. Creating multiple accounts to abuse promotions or circumvent bans is prohibited.</p>
          </Section>

          <Section title="3. Product Listings">
            <p>Farmers are solely responsible for the accuracy of their product listings, including name, description, price, weight, and images.</p>
            <p>All listed products must be genuine agricultural produce. Listing counterfeit, prohibited, or misrepresented goods is strictly prohibited.</p>
            <p>FarmBridge reserves the right to remove any listing that violates these terms without notice.</p>
          </Section>

          <Section title="4. Orders and Payments">
            <p>Orders placed on FarmBridge constitute a binding agreement between the consumer and farmer.</p>
            <p>Payments are processed through Cashfree Payments. FarmBridge does not store payment card information.</p>
            <p>FarmBridge charges a platform service fee on transactions, which may vary and will be displayed at checkout.</p>
            <p>All prices are in Indian Rupees (₹) inclusive of applicable taxes unless stated otherwise.</p>
          </Section>

          <Section title="5. Cancellations and Refunds">
            <p>Consumers may cancel orders before the farmer accepts them.</p>
            <p>Farmers must respond to orders within 24 hours. Unresponsive orders may be auto-cancelled.</p>
            <p>Refunds for prepaid orders are processed within 5–7 business days to the original payment method.</p>
            <p>FarmBridge is not liable for disputes arising from product quality — buyers should verify produce upon delivery.</p>
          </Section>

          <Section title="6. Prohibited Activities">
            <p>Users must not:</p>
            <p>• Use the platform for fraudulent transactions or money laundering</p>
            <p>• Upload false, misleading, or harmful content</p>
            <p>• Attempt to hack, scrape, or reverse-engineer the platform</p>
            <p>• Harass or threaten other users</p>
            <p>• Circumvent payment processing by conducting transactions outside the platform</p>
          </Section>

          <Section title="7. Intellectual Property">
            <p>All content on FarmBridge — including the logo, design, code, and text — is owned by FarmBridge and protected under Indian copyright law. You may not reproduce or redistribute our content without written permission.</p>
            <p>By uploading product images or content, you grant FarmBridge a non-exclusive license to display that content on the platform.</p>
          </Section>

          <Section title="8. Limitation of Liability">
            <p>FarmBridge acts as a marketplace connecting farmers and consumers. We are not responsible for:</p>
            <p>• Product quality, freshness, or accuracy of descriptions</p>
            <p>• Delays in delivery caused by farmers or logistics partners</p>
            <p>• Losses arising from force majeure events (floods, strikes, etc.)</p>
            <p>Our total liability to any user shall not exceed the value of the transaction in question.</p>
          </Section>

          <Section title="9. Termination">
            <p>FarmBridge reserves the right to suspend or permanently ban accounts that violate these terms. Users may also delete their accounts at any time from the Profile settings.</p>
          </Section>

          <Section title="10. Governing Law">
            <p>These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Nellore, Andhra Pradesh.</p>
          </Section>

          <Section title="11. Changes to Terms">
            <p>We may update these Terms periodically. Continued use of the platform after changes constitutes your acceptance of the new terms.</p>
          </Section>

          <Section title="12. Contact">
            <p>For questions about these Terms, contact us at:</p>
            <p>📧 <a href="mailto:legal@farmbridge.com" className="text-farm-500 underline">legal@farmbridge.com</a></p>
            <p>📍 FarmBridge, Gudur, Andhra Pradesh, India – 524101</p>
          </Section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsOfService;
