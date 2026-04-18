import React from 'react';
import { Heart, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Company */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-farm-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">FB</span>
              </div>
              <span className="text-xl font-poppins font-bold">FarmBridge</span>
            </div>
            <p className="text-gray-400 mb-4">
              Connecting farmers directly to consumers with fresh, fair produce.
            </p>
            <div className="flex gap-4">
              <Facebook size={20} className="cursor-pointer hover:text-farm-500" />
              <Twitter size={20} className="cursor-pointer hover:text-farm-500" />
              <Instagram size={20} className="cursor-pointer hover:text-farm-500" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-farm-500">Home</a></li>
              <li><span className="cursor-not-allowed hover:text-farm-500">About Us</span></li>
              <li><span className="cursor-not-allowed hover:text-farm-500">Products</span></li>
              <li><span className="cursor-not-allowed hover:text-farm-500">Pricing</span></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li><span className="cursor-not-allowed hover:text-farm-500">Help Center</span></li>
              <li><span className="cursor-not-allowed hover:text-farm-500">Privacy Policy</span></li>
              <li><span className="cursor-not-allowed hover:text-farm-500">Terms of Service</span></li>
              <li><span className="cursor-not-allowed hover:text-farm-500">Contact Us</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-4 text-gray-400">
              <div className="flex items-center gap-2">
                <Mail size={18} />
                <span>info@farmbr idge.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={18} />
                <span>+1 (800) 123-4567</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={18} className="mt-1" />
                <span>123 Farm Road, Agriculture City, AC 12345</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p className="flex items-center justify-center gap-1">
            Made with <Heart size={16} className="text-farm-500" /> by FarmBridge Team
          </p>
          <p className="mt-2">&copy; 2024 FarmBridge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
