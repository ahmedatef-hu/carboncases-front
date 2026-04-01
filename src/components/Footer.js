import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-secondary border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-serif text-2xl font-bold mb-4">Carbon Cases</h3>
            <p className="text-gray-400 mb-4">
              Premium carbon fiber products crafted for those who demand excellence. 
              Lightweight, durable, and elegantly designed.
            </p>
            <div className="flex space-x-4">
              <button className="text-gray-400 hover:text-accent transition-colors" aria-label="Instagram">
                <FiInstagram size={20} />
              </button>
              <button className="text-gray-400 hover:text-accent transition-colors" aria-label="Twitter">
                <FiTwitter size={20} />
              </button>
              <button className="text-gray-400 hover:text-accent transition-colors" aria-label="Facebook">
                <FiFacebook size={20} />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-gray-400 hover:text-accent transition-colors">Shop All</Link></li>
              <li><Link to="/products?category=phone-covers" className="text-gray-400 hover:text-accent transition-colors">Phone Cases</Link></li>
              <li><Link to="/products?category=wallets" className="text-gray-400 hover:text-accent transition-colors">Wallets</Link></li>
              <li><Link to="/products?category=airpods-covers" className="text-gray-400 hover:text-accent transition-colors">AirPods Cases</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><button className="text-gray-400 hover:text-accent transition-colors">Contact Us</button></li>
              <li><button className="text-gray-400 hover:text-accent transition-colors">Shipping Info</button></li>
              <li><button className="text-gray-400 hover:text-accent transition-colors">Returns</button></li>
              <li><button className="text-gray-400 hover:text-accent transition-colors">FAQ</button></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 Carbon Cases. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
