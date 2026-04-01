import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiHeart, FiMenu, FiX, FiSearch, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdown, setProductsDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Banner */}
      <div className="bg-black text-white text-center py-2 text-sm font-medium tracking-wide overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          BUY 2 GET 1 FREE | FREE SHIPPING &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; BUY 2 GET 1 FREE | FREE SHIPPING &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; BUY 2 GET 1 FREE | FREE SHIPPING &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; BUY 2 GET 1 FREE | FREE SHIPPING &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; BUY 2 GET 1 FREE | FREE SHIPPING &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; BUY 2 GET 1 FREE | FREE SHIPPING &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; BUY 2 GET 1 FREE | FREE SHIPPING &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; BUY 2 GET 1 FREE | FREE SHIPPING &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; BUY 2 GET 1 FREE | FREE SHIPPING &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; BUY 2 GET 1 FREE | FREE SHIPPING &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; BUY 2 GET 1 FREE | FREE SHIPPING &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; BUY 2 GET 1 FREE | FREE SHIPPING
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-black text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Desktop Left Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link to="/" className="text-white hover:text-orange-500 transition-colors font-medium uppercase tracking-wide text-sm">
                HOME
              </Link>
              
              {/* Products Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setProductsDropdown(true)}
                onMouseLeave={() => setProductsDropdown(false)}
              >
                <button className="flex items-center space-x-1 text-white hover:text-orange-500 transition-colors font-medium uppercase tracking-wide text-sm">
                  <span>PHONE CASES</span>
                  <FiChevronDown size={14} />
                </button>
                
                {productsDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white text-black shadow-xl border border-gray-200 z-50">
                    <div className="py-2">
                      <Link to="/products?category=phone-covers" className="block px-4 py-3 hover:bg-gray-100 transition-colors text-sm font-medium">
                        iPhone Cases
                      </Link>
                      <Link to="/products?category=phone-covers" className="block px-4 py-3 hover:bg-gray-100 transition-colors text-sm font-medium">
                        Samsung Cases
                      </Link>
                      <Link to="/products?category=phone-covers" className="block px-4 py-3 hover:bg-gray-100 transition-colors text-sm font-medium">
                        Carbon Fiber Cases
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link to="/products?category=wallets" className="text-white hover:text-orange-500 transition-colors font-medium uppercase tracking-wide text-sm">
                WALLETS
              </Link>
              
              <Link to="/products?category=airpods-covers" className="text-white hover:text-orange-500 transition-colors font-medium uppercase tracking-wide text-sm">
                AIRPODS CASES
              </Link>
              
              <Link to="/products" className="text-white hover:text-orange-500 transition-colors font-medium uppercase tracking-wide text-sm">
                NEW ARRIVALS
              </Link>
              
              <Link to="/products" className="text-white hover:text-orange-500 transition-colors font-medium uppercase tracking-wide text-sm">
                ACCESSORIES
              </Link>
            </div>

            {/* Mobile Left - Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white hover:text-orange-500 transition-colors"
              >
                {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>

            {/* Logo - Center on mobile, left-center on desktop */}
            <Link to="/" className="flex items-center justify-center lg:justify-start">
              <img 
                src="/logo.PNG" 
                alt="Carbon Cases Logo" 
                className="h-14 w-auto object-contain"
              />
            </Link>

            {/* Right Navigation */}
            <div className="flex items-center space-x-4 lg:space-x-6">
              {/* Search - Desktop only */}
              <button className="hidden lg:block text-white hover:text-orange-500 transition-colors">
                <FiSearch size={20} />
              </button>

              {/* Account */}
              {isAuthenticated ? (
                <div className="relative group">
                  <button className="flex items-center space-x-1 text-white hover:text-orange-500 transition-colors">
                    <FiUser size={20} />
                    <span className="hidden lg:block text-sm font-medium uppercase tracking-wide">ACCOUNT</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <div className="py-2">
                      <Link to="/profile" className="block px-4 py-3 hover:bg-gray-100 transition-colors text-sm font-medium">
                        My Profile
                      </Link>
                      <Link to="/profile?tab=orders" className="block px-4 py-3 hover:bg-gray-100 transition-colors text-sm font-medium">
                        My Orders
                      </Link>
                      <Link to="/wishlist" className="block px-4 py-3 hover:bg-gray-100 transition-colors text-sm font-medium">
                        Wishlist
                      </Link>
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors text-sm font-medium">
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="flex items-center space-x-1 text-white hover:text-orange-500 transition-colors">
                  <FiUser size={20} />
                  <span className="hidden lg:block text-sm font-medium uppercase tracking-wide">LOGIN</span>
                </Link>
              )}

              {/* Wishlist - Desktop only */}
              {isAuthenticated && (
                <Link to="/wishlist" className="hidden lg:block text-white hover:text-orange-500 transition-colors">
                  <FiHeart size={20} />
                </Link>
              )}

              {/* Cart */}
              <Link to="/cart" className="relative text-white hover:text-orange-500 transition-colors">
                <FiShoppingCart size={20} />
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-800">
              <div className="space-y-2">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-white hover:text-orange-500 transition-colors font-medium uppercase tracking-wide">
                  HOME
                </Link>
                <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-white hover:text-orange-500 transition-colors font-medium uppercase tracking-wide">
                  PHONE CASES
                </Link>
                <Link to="/products?category=wallets" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-white hover:text-orange-500 transition-colors font-medium uppercase tracking-wide">
                  WALLETS
                </Link>
                <Link to="/products?category=airpods-covers" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-white hover:text-orange-500 transition-colors font-medium uppercase tracking-wide">
                  AIRPODS CASES
                </Link>
                <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-white hover:text-orange-500 transition-colors font-medium uppercase tracking-wide">
                  NEW ARRIVALS
                </Link>
                {isAuthenticated && (
                  <>
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-white hover:text-orange-500 transition-colors font-medium uppercase tracking-wide">
                      PROFILE
                    </Link>
                    <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-white hover:text-orange-500 transition-colors font-medium uppercase tracking-wide">
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
