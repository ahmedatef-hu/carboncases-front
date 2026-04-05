import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiHeart, FiMenu, FiX, FiSearch } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  // Check if link is active
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname === path;
  };

  // Check if specific category is active
  const isCategoryActive = (category) => {
    return location.pathname === '/products' && location.search.includes(category);
  };

  return (
    <>
      {/* Top Banner with Glow Effect */}
      <div className="relative bg-black text-white text-center py-2 text-sm font-medium tracking-wide overflow-hidden">
        {/* Animated Glow Line */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-scan-horizontal"></div>
        
        <div className="animate-marquee whitespace-nowrap relative z-10">
          BUY 2 GET 1 FREE | FREE SHIPPING &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; BUY 2 GET 1 FREE | FREE SHIPPING &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; BUY 2 GET 1 FREE | FREE SHIPPING &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; BUY 2 GET 1 FREE | FREE SHIPPING &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; BUY 2 GET 1 FREE | FREE SHIPPING &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; BUY 2 GET 1 FREE | FREE SHIPPING &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; BUY 2 GET 1 FREE | FREE SHIPPING &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; BUY 2 GET 1 FREE | FREE SHIPPING &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; BUY 2 GET 1 FREE | FREE SHIPPING &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; BUY 2 GET 1 FREE | FREE SHIPPING &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; BUY 2 GET 1 FREE | FREE SHIPPING &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; BUY 2 GET 1 FREE | FREE SHIPPING
        </div>
        
        {/* Bottom Glow Line */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500 to-transparent" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Main Navigation with Advanced Effects */}
      <nav className="relative bg-black text-white sticky top-0 z-50">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Floating Orbs */}
          <div className="absolute top-1/2 left-10 w-32 h-32 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-full blur-2xl animate-float" style={{animationDuration: '6s'}}></div>
          <div className="absolute top-1/2 right-10 w-40 h-40 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-full blur-2xl animate-float" style={{animationDuration: '8s', animationDelay: '2s'}}></div>
          
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(rgba(255, 107, 53, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 107, 53, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px'
            }}></div>
          </div>
        </div>
        
        {/* Bottom Border Glow */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center h-20 lg:justify-between">
            
            {/* Mobile Left - Menu Button with Glow */}
            <div className="lg:hidden flex-shrink-0">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="icon-glow-hover text-white hover:text-orange-500 transition-all duration-500 p-2 rounded-lg hover:bg-orange-500/10"
              >
                {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>

            {/* Desktop Left Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link to="/" className={`nav-link-glow group relative transition-all duration-500 font-medium uppercase tracking-wide text-sm ${
                isActive('/') ? 'text-orange-500' : 'text-white hover:text-orange-500'
              }`}>
                <span className="relative z-10">HOME</span>
                <span className={`nav-link-underline ${isActive('/') ? 'w-full' : ''}`}></span>
              </Link>
              
              <Link to="/products?category=phone-covers" className={`nav-link-glow group relative transition-all duration-500 font-medium uppercase tracking-wide text-sm ${
                isCategoryActive('phone-covers') ? 'text-orange-500' : 'text-white hover:text-orange-500'
              }`}>
                <span className="relative z-10">PHONE CASES</span>
                <span className={`nav-link-underline ${isCategoryActive('phone-covers') ? 'w-full' : ''}`}></span>
              </Link>

              <Link to="/products?category=wallets" className={`nav-link-glow group relative transition-all duration-500 font-medium uppercase tracking-wide text-sm ${
                isCategoryActive('wallets') ? 'text-orange-500' : 'text-white hover:text-orange-500'
              }`}>
                <span className="relative z-10">WALLETS</span>
                <span className={`nav-link-underline ${isCategoryActive('wallets') ? 'w-full' : ''}`}></span>
              </Link>
              
              <Link to="/products?category=airpods-covers" className={`nav-link-glow group relative transition-all duration-500 font-medium uppercase tracking-wide text-sm ${
                isCategoryActive('airpods') ? 'text-orange-500' : 'text-white hover:text-orange-500'
              }`}>
                <span className="relative z-10">AIRPODS CASES</span>
                <span className={`nav-link-underline ${isCategoryActive('airpods') ? 'w-full' : ''}`}></span>
              </Link>
            </div>

            {/* Logo - Centered on mobile, left-center on desktop with Glow */}
            <Link to="/" className="absolute left-1/2 transform -translate-x-1/2 lg:relative lg:left-auto lg:transform-none flex items-center justify-center group">
              <div className="relative">
                {/* Logo Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <img 
                  src="/logo.PNG" 
                  alt="Carbon Cases Logo" 
                  className="h-14 w-auto object-contain relative z-10 transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </Link>

            {/* Right Navigation with Enhanced Icons */}
            <div className="flex items-center space-x-4 lg:space-x-6 ml-auto lg:ml-0">
              {/* Search - Desktop only with Glow */}
              <button className="icon-glow-hover hidden lg:block text-white hover:text-orange-500 transition-all duration-500 p-2 rounded-lg hover:bg-orange-500/10">
                <FiSearch size={20} />
              </button>

              {/* Account with Enhanced Dropdown */}
              {isAuthenticated ? (
                <div className="relative group">
                  <button className="icon-glow-hover flex items-center space-x-1 text-white hover:text-orange-500 transition-all duration-500 p-2 rounded-lg hover:bg-orange-500/10">
                    <FiUser size={20} />
                    <span className="hidden lg:block text-sm font-medium uppercase tracking-wide">ACCOUNT</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-gradient-to-br from-gray-900 to-black text-white shadow-2xl border border-orange-500/30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 rounded-lg overflow-hidden backdrop-blur-xl">
                    {/* Dropdown Background Effects */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full blur-xl"></div>
                      <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-red-500/20 to-transparent rounded-full blur-xl"></div>
                    </div>
                    
                    <div className="py-2 relative z-10">
                      <Link to="/profile" className="dropdown-item-glow block px-4 py-3 hover:bg-orange-500/20 transition-all duration-300 text-sm font-medium border-l-2 border-transparent hover:border-orange-500">
                        My Profile
                      </Link>
                      <Link to="/profile?tab=orders" className="dropdown-item-glow block px-4 py-3 hover:bg-orange-500/20 transition-all duration-300 text-sm font-medium border-l-2 border-transparent hover:border-orange-500">
                        My Orders
                      </Link>
                      <Link to="/wishlist" className="dropdown-item-glow block px-4 py-3 hover:bg-orange-500/20 transition-all duration-300 text-sm font-medium border-l-2 border-transparent hover:border-orange-500">
                        Wishlist
                      </Link>
                      <button onClick={handleLogout} className="dropdown-item-glow block w-full text-left px-4 py-3 hover:bg-orange-500/20 transition-all duration-300 text-sm font-medium border-l-2 border-transparent hover:border-orange-500">
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="icon-glow-hover flex items-center space-x-1 text-white hover:text-orange-500 transition-all duration-500 p-2 rounded-lg hover:bg-orange-500/10">
                  <FiUser size={20} />
                  <span className="hidden lg:block text-sm font-medium uppercase tracking-wide">LOGIN</span>
                </Link>
              )}

              {/* Wishlist - Desktop only with Glow */}
              {isAuthenticated && (
                <Link to="/wishlist" className="icon-glow-hover hidden lg:block text-white hover:text-orange-500 transition-all duration-500 p-2 rounded-lg hover:bg-orange-500/10">
                  <FiHeart size={20} />
                </Link>
              )}

              {/* Cart with Enhanced Badge */}
              <Link to="/cart" className="icon-glow-hover relative text-white hover:text-orange-500 transition-all duration-500 p-2 rounded-lg hover:bg-orange-500/10">
                <FiShoppingCart size={20} />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse-glow">
                    {getCartCount()}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile Menu with Enhanced Styling */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-orange-500/30 relative">
              {/* Mobile Menu Background Effects */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-red-500/10 to-transparent rounded-full blur-2xl"></div>
              </div>
              
              <div className="space-y-2 relative z-10">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className={`mobile-nav-link block py-3 px-4 hover:bg-orange-500/10 transition-all duration-300 font-medium uppercase tracking-wide rounded-lg border-l-2 hover:border-orange-500 ${
                  isActive('/') ? 'text-orange-500 bg-orange-500/10 border-orange-500' : 'text-white border-transparent'
                }`}>
                  HOME
                </Link>
                <Link to="/products?category=phone-covers" onClick={() => setMobileMenuOpen(false)} className={`mobile-nav-link block py-3 px-4 hover:bg-orange-500/10 transition-all duration-300 font-medium uppercase tracking-wide rounded-lg border-l-2 hover:border-orange-500 ${
                  isCategoryActive('phone-covers') ? 'text-orange-500 bg-orange-500/10 border-orange-500' : 'text-white border-transparent'
                }`}>
                  PHONE CASES
                </Link>
                <Link to="/products?category=wallets" onClick={() => setMobileMenuOpen(false)} className={`mobile-nav-link block py-3 px-4 hover:bg-orange-500/10 transition-all duration-300 font-medium uppercase tracking-wide rounded-lg border-l-2 hover:border-orange-500 ${
                  isCategoryActive('wallets') ? 'text-orange-500 bg-orange-500/10 border-orange-500' : 'text-white border-transparent'
                }`}>
                  WALLETS
                </Link>
                <Link to="/products?category=airpods-covers" onClick={() => setMobileMenuOpen(false)} className={`mobile-nav-link block py-3 px-4 hover:bg-orange-500/10 transition-all duration-300 font-medium uppercase tracking-wide rounded-lg border-l-2 hover:border-orange-500 ${
                  isCategoryActive('airpods') ? 'text-orange-500 bg-orange-500/10 border-orange-500' : 'text-white border-transparent'
                }`}>
                  AIRPODS CASES
                </Link>
                {isAuthenticated && (
                  <>
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className={`mobile-nav-link block py-3 px-4 hover:bg-orange-500/10 transition-all duration-300 font-medium uppercase tracking-wide rounded-lg border-l-2 hover:border-orange-500 ${
                      isActive('/profile') ? 'text-orange-500 bg-orange-500/10 border-orange-500' : 'text-white border-transparent'
                    }`}>
                      PROFILE
                    </Link>
                    <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className={`mobile-nav-link block py-3 px-4 hover:bg-orange-500/10 transition-all duration-300 font-medium uppercase tracking-wide rounded-lg border-l-2 hover:border-orange-500 ${
                      isActive('/wishlist') ? 'text-orange-500 bg-orange-500/10 border-orange-500' : 'text-white border-transparent'
                    }`}>
                      WISHLIST
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
