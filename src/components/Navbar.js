import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiHeart, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Check if user is admin
  const isAdmin = !!localStorage.getItem('adminToken');

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-secondary border-b border-gray-800 sticky top-0 z-50 backdrop-blur-lg bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent-hover rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform">
              <span className="text-primary font-bold text-xl">C</span>
            </div>
            <span className="font-serif text-xl font-bold tracking-tight">Carbon Cases</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-300 hover:text-accent transition-colors">Home</Link>
            <Link to="/products" className="text-gray-300 hover:text-accent transition-colors">Products</Link>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <Link to="/wishlist" className="text-gray-300 hover:text-accent transition-colors hidden md:block">
                <FiHeart size={22} />
              </Link>
            )}
            
            <Link to="/cart" className="relative text-gray-300 hover:text-accent transition-colors">
              <FiShoppingCart size={22} />
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-primary text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative group">
                <button className="text-gray-300 hover:text-accent transition-colors">
                  <FiUser size={22} />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-secondary border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-800 transition-colors">Profile</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-800 transition-colors">Logout</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="bg-accent text-primary px-4 py-2 rounded-lg hover:bg-accent-hover transition-colors font-medium">
                Login
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-300 hover:text-accent transition-colors"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800 slide-in">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-300 hover:text-accent transition-colors">Home</Link>
            <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-300 hover:text-accent transition-colors">Products</Link>
            {isAuthenticated && (
              <>
                <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-300 hover:text-accent transition-colors">Wishlist</Link>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-300 hover:text-accent transition-colors">Profile</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
