import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiMail, FiPhone } from 'react-icons/fi';
import { FaTiktok, FaFacebook } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="relative bg-black border-t border-orange-500/20 overflow-hidden">
      {/* Advanced Background Effects */}
      <div className="absolute inset-0">
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(255, 107, 53, 0.3) 1px, transparent 1px),
              linear-gradient(rgba(255, 107, 53, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            animation: 'grid-move 20s linear infinite'
          }}></div>
        </div>
        
        {/* Floating Orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-full blur-3xl animate-energy-float" style={{animationDuration: '15s'}}></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-red-500/8 to-orange-500/8 rounded-full blur-3xl animate-energy-float" style={{animationDuration: '20s', animationDelay: '7s'}}></div>
        </div>
        
        {/* Top Glow Line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-gradient-x"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h3 className="font-serif text-3xl font-black mb-4 text-white" style={{
                textShadow: '0 0 30px rgba(255, 107, 53, 0.5)'
              }}>
                CARBON CASE
              </h3>
              <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-6 animate-pulse-glow"></div>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
              Premium carbon fiber products crafted for those who demand excellence. 
              Lightweight, durable, and elegantly designed.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <a 
                href="mailto:carboncase.eg@gmail.com"
                className="flex items-center space-x-3 text-gray-400 hover:text-orange-400 transition-colors duration-300 group"
              >
                <FiMail className="group-hover:scale-110 transition-transform duration-300" size={18} />
                <span>carboncase.eg@gmail.com</span>
              </a>
              <a 
                href="https://wa.me/201094449152"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-gray-400 hover:text-orange-400 transition-colors duration-300 group"
              >
                <FiPhone className="group-hover:scale-110 transition-transform duration-300" size={18} />
                <span>01094449152 (WhatsApp)</span>
              </a>
            </div>
            
            {/* Social Media */}
            <div className="flex space-x-4">
              {[
                { icon: FiInstagram, label: 'Instagram', url: 'https://www.instagram.com/carboncase_eg?igsh=emJ3dDQxbWdvc200&utm_source=qr' },
                { icon: FaTiktok, label: 'TikTok', url: 'https://www.tiktok.com/@carboncase_eg?_r=1&_t=ZS-95NRwhWM8nd' },
                { icon: FaFacebook, label: 'Facebook', url: 'https://www.facebook.com/share/1DaSi9uNv1/?mibextid=wwXIfr' }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative bg-gradient-to-br from-gray-800 to-gray-900 text-gray-400 hover:text-white p-3 rounded-xl transition-all duration-500 hover:scale-110 border border-gray-800 hover:border-orange-500/50"
                  aria-label={social.label}
                  style={{
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 to-red-500/0 group-hover:from-orange-500/20 group-hover:to-red-500/20 rounded-xl transition-all duration-500"></div>
                  <social.icon size={20} className="relative z-10" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white uppercase tracking-wide">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { to: '/products', label: 'Shop All' },
                { to: '/products?category=phone-covers', label: 'Phone Cases' },
                { to: '/products?category=wallets', label: 'Wallets' },
                { to: '/products?category=airpods-covers', label: 'AirPods Cases' }
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.to} 
                    className="group flex items-center text-gray-400 hover:text-orange-400 transition-all duration-300"
                  >
                    <span className="w-0 h-px bg-gradient-to-r from-orange-500 to-red-500 group-hover:w-4 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white uppercase tracking-wide">Support</h4>
            <ul className="space-y-3">
              {[
                'Contact Us',
                'Shipping Info',
                'Returns',
                'FAQ'
              ].map((item, index) => (
                <li key={index}>
                  <button className="group flex items-center text-gray-400 hover:text-orange-400 transition-all duration-300">
                    <span className="w-0 h-px bg-gradient-to-r from-orange-500 to-red-500 group-hover:w-4 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="relative">
          {/* Divider */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent mb-8"></div>
          
          <div className="pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm">
              &copy; 2026 <span className="text-orange-400 font-semibold">Carbon Case</span>. All rights reserved.
            </p>
            
            {/* Payment Methods */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-500 text-sm">We Accept:</span>
              <div className="flex space-x-3">
                {['VISA', 'MC', 'AMEX'].map((card, index) => (
                  <div 
                    key={index}
                    className="bg-gradient-to-br from-gray-800 to-gray-900 px-3 py-1 rounded text-xs font-bold text-gray-400 border border-gray-800"
                  >
                    {card}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
