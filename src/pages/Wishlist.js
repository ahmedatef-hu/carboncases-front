import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import api from '../utils/api';
import { useCart } from '../context/CartContext';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await api.get('/wishlist');
      setWishlist(response.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}`);
      setWishlist(wishlist.filter(item => item.id !== productId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const handleAddToCart = (product) => {
    // If product has MagSafe options, redirect to product page to select variant
    if (product.has_magsafe_option) {
      navigate(`/products/${product.id}`);
      return;
    }
    addToCart(product);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-3xl animate-float" style={{animationDuration: '8s'}}></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-red-500/15 to-orange-500/15 rounded-full blur-3xl animate-float" style={{animationDuration: '12s', animationDelay: '4s'}}></div>
        </div>
        
        <div className="relative">
          {/* Enhanced Loading Spinner */}
          <div className="w-16 h-16 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-red-500 rounded-full animate-spin" style={{animationDuration: '1.5s', animationDirection: 'reverse'}}></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4 fade-in relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-3xl animate-float" style={{animationDuration: '8s'}}></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-red-500/15 to-orange-500/15 rounded-full blur-3xl animate-float" style={{animationDuration: '12s', animationDelay: '4s'}}></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="relative inline-block mb-6">
            <FiHeart size={80} className="text-orange-500 animate-pulse" style={{
              filter: 'drop-shadow(0 0 20px rgba(255, 107, 53, 0.6))'
            }} />
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-2xl"></div>
          </div>
          <h2 className="font-serif text-4xl font-bold mb-4 text-white" style={{
            textShadow: '0 0 40px rgba(255, 107, 53, 0.4)'
          }}>Your wishlist is empty</h2>
          <p className="text-white/70 mb-8 text-lg">Save your favorite items for later</p>
          <Link
            to="/products"
            className="inline-block bg-gradient-to-r from-orange-500 to-red-600 text-white px-10 py-4 rounded-lg hover:from-red-600 hover:to-orange-500 transition-all duration-500 font-bold text-lg shadow-xl transform hover:scale-105"
            style={{
              boxShadow: '0 10px 30px rgba(255, 107, 53, 0.4)'
            }}
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4 fade-in relative overflow-hidden">
      {/* Floating Particles Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="floating-particles">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 20}s`,
                animationDuration: `${15 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-full blur-3xl animate-float" style={{animationDuration: '10s'}}></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-full blur-3xl animate-float" style={{animationDuration: '15s', animationDelay: '5s'}}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-12">
          <h1 className="font-serif text-5xl md:text-6xl font-black text-white mb-4" style={{
            textShadow: '0 0 40px rgba(255, 107, 53, 0.4)'
          }}>My Wishlist</h1>
          <div className="flex items-center space-x-4">
            <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
            <p className="text-white/70 text-lg">{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {wishlist.map(product => (
            <div key={product.id} className="product-card-dark rounded-2xl overflow-hidden group">
              <Link to={`/products/${product.id}`}>
                <div className="aspect-square overflow-hidden relative bg-gradient-to-br from-gray-900 to-black">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Glow Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Hover Border Glow */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-orange-500/50 transition-all duration-500"></div>
                </div>
              </Link>

              <div className="p-6 space-y-4 bg-gradient-to-b from-gray-900 to-black">
                <Link to={`/products/${product.id}`}>
                  <h3 className="font-semibold text-xl text-white mb-2 group-hover:text-orange-300 transition-colors line-clamp-2 leading-tight">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center space-x-2">
                  {product.has_magsafe_option && product.price_without_magsafe ? (
                    <div className="flex flex-col">
                      <p className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 font-bold text-lg">
                        From LE {parseFloat(product.price_without_magsafe || 0).toLocaleString()}
                      </p>
                      <span className="text-xs text-orange-400">
                        With MagSafe: LE {parseFloat(product.price_with_magsafe || 0).toLocaleString()}
                      </span>
                    </div>
                  ) : product.price ? (
                    <>
                      <p className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 font-bold text-2xl">
                        LE {parseFloat(product.price || 0).toLocaleString()}
                      </p>
                      <span className="text-sm text-white/40 line-through">
                        LE {(parseFloat(product.price || 0) * 1.2).toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <p className="text-orange-400 font-bold text-lg">
                      Price not available
                    </p>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-3 rounded-lg hover:from-red-600 hover:to-orange-500 transition-all duration-500 font-bold flex items-center justify-center space-x-2 shadow-xl transform hover:scale-105"
                    style={{
                      boxShadow: '0 8px 20px rgba(255, 107, 53, 0.3)'
                    }}
                  >
                    <FiShoppingCart size={18} />
                    <span>{product.has_magsafe_option ? 'Select Options' : 'Add to Cart'}</span>
                  </button>
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="bg-gradient-to-br from-gray-900 to-black border-2 border-orange-500/30 hover:border-red-500 px-4 py-3 rounded-lg hover:bg-red-500/20 transition-all duration-300 text-white hover:text-red-400 transform hover:scale-105"
                    title="Remove from wishlist"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
