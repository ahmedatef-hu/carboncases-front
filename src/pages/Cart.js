import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    // Remove admin check from cart page - users should be able to access cart
    // Only redirect if user is not authenticated and trying to checkout
  }, []);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center px-4">
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

        <div className="text-center space-y-6 relative z-10">
          <div className="w-32 h-32 bg-gradient-to-br from-orange-500/20 to-red-600/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto border border-orange-500/30 animate-float" style={{
            boxShadow: '0 20px 60px rgba(255, 107, 53, 0.3)',
            animationDuration: '6s'
          }}>
            <FiShoppingBag size={48} className="text-orange-400" />
          </div>
          <h2 className="font-serif text-4xl font-bold text-white" style={{textShadow: '0 0 40px rgba(255, 107, 53, 0.4)'}}>Your cart is empty</h2>
          <p className="text-xl text-white/70 max-w-md mx-auto">Discover our premium carbon fiber collection and find the perfect case for your device</p>
          <Link
            to="/products"
            className="inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-xl hover:from-red-600 hover:to-orange-500 transition-all duration-500 font-semibold text-lg tracking-wide uppercase transform hover:scale-105 relative overflow-hidden group"
            style={{boxShadow: '0 10px 40px rgba(255, 107, 53, 0.4)'}}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            <span className="relative z-10">Shop Now</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden py-12 px-4">
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

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-12">
          <h1 className="font-serif text-5xl font-black text-white" style={{textShadow: '0 0 40px rgba(255, 107, 53, 0.4)'}}>Shopping Cart</h1>
          <button
            onClick={clearCart}
            className="text-white/60 hover:text-red-400 transition-colors text-sm font-medium uppercase tracking-wide hover:scale-110 transform duration-300"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map(item => (
              <div key={item.cartItemId || item.id} className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-2xl p-6 border border-orange-500/20 hover:border-orange-500/40 transition-all shadow-lg relative overflow-hidden group" style={{
                boxShadow: '0 20px 60px rgba(255, 107, 53, 0.2)'
              }}>
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                
                <div className="flex gap-6 relative z-10">
                  {/* Product Image */}
                  <Link to={`/products/${item.id}`} className="flex-shrink-0">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-32 h-32 object-cover rounded-xl border border-orange-500/20 group-hover:border-orange-500/40 transition-all group-hover:scale-105 transform duration-300"
                      style={{boxShadow: '0 10px 30px rgba(255, 107, 53, 0.2)'}}
                    />
                  </Link>

                  {/* Product Info */}
                  <div className="flex-grow">
                    <Link to={`/products/${item.id}`}>
                      <h3 className="font-serif text-2xl font-bold text-white mb-2 hover:text-orange-400 transition-colors">
                        {item.name}
                      </h3>
                    </Link>
                    {item.variant && (
                      <div className="mb-2">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          item.variant === 'with_magsafe' 
                            ? 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-400 border border-blue-500/30' 
                            : 'bg-gradient-to-r from-gray-700/20 to-gray-800/20 text-gray-400 border border-gray-600/30'
                        }`}>
                          {item.variant === 'with_magsafe' ? '⚡ With MagSafe' : 'Without MagSafe'}
                        </span>
                      </div>
                    )}
                    <p className="text-3xl font-black text-white mb-6" style={{textShadow: '0 0 20px rgba(255, 107, 53, 0.3)'}}>LE {parseFloat(item.price).toLocaleString()}</p>

                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1, item.variant)}
                          className="w-12 h-12 bg-gradient-to-br from-gray-800/80 to-black/80 hover:from-orange-500/20 hover:to-red-600/20 border border-orange-500/30 rounded-lg flex items-center justify-center transition-all text-white hover:scale-110 transform duration-300"
                        >
                          -
                        </button>
                        <span className="text-xl font-bold w-12 text-center text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant)}
                          className="w-12 h-12 bg-gradient-to-br from-gray-800/80 to-black/80 hover:from-orange-500/20 hover:to-red-600/20 border border-orange-500/30 rounded-lg flex items-center justify-center transition-all text-white hover:scale-110 transform duration-300"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id, item.variant)}
                        className="w-12 h-12 bg-gradient-to-br from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 text-red-400 hover:text-red-300 rounded-lg flex items-center justify-center transition-all border border-red-500/30 hover:scale-110 transform duration-300"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <p className="text-2xl font-black text-white" style={{textShadow: '0 0 20px rgba(255, 107, 53, 0.3)'}}>LE {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-2xl p-8 border border-orange-500/20 sticky top-24 relative overflow-hidden" style={{
              boxShadow: '0 20px 60px rgba(255, 107, 53, 0.2)'
            }}>
              {/* Background Effects */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-2xl"></div>
              
              <h2 className="font-serif text-3xl font-bold text-white mb-8 relative z-10" style={{textShadow: '0 0 20px rgba(255, 107, 53, 0.3)'}}>Order Summary</h2>
              
              <div className="space-y-6 mb-8 relative z-10">
                <div className="flex justify-between text-white/70 text-lg">
                  <span>Subtotal</span>
                  <span className="text-white font-semibold">LE {getCartTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-white/70 text-lg">
                  <span>Shipping</span>
                  <span className="text-green-400 font-semibold">Free</span>
                </div>
                <div className="border-t border-orange-500/20 pt-6 flex justify-between text-2xl font-black text-white">
                  <span>Total</span>
                  <span style={{textShadow: '0 0 20px rgba(255, 107, 53, 0.3)'}}>LE {getCartTotal().toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 rounded-xl hover:from-red-600 hover:to-orange-500 transition-all duration-500 transform hover:scale-105 font-bold text-lg tracking-wide uppercase mb-4 relative overflow-hidden group"
                style={{boxShadow: '0 10px 40px rgba(255, 107, 53, 0.4)'}}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                <span className="relative z-10">Proceed to Checkout</span>
              </button>

              <Link
                to="/products"
                className="block text-center text-white/60 hover:text-white transition-colors font-medium relative z-10"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
