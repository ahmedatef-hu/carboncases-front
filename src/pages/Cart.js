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
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center space-y-6">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <FiShoppingBag size={48} className="text-gray-400" />
          </div>
          <h2 className="font-serif text-4xl font-bold text-black">Your cart is empty</h2>
          <p className="text-xl text-gray-600 max-w-md mx-auto">Discover our premium carbon fiber collection and find the perfect case for your device</p>
          <Link
            to="/products"
            className="inline-flex items-center justify-center bg-black text-white px-8 py-4 rounded-xl hover:bg-gray-800 transition-all font-semibold text-lg tracking-wide uppercase transform hover:scale-105"
          >
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="font-serif text-5xl font-black text-black">Shopping Cart</h1>
          <button
            onClick={clearCart}
            className="text-gray-500 hover:text-red-500 transition-colors text-sm font-medium uppercase tracking-wide"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map(item => (
              <div key={item.id} className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-gray-300 transition-all shadow-lg">
                <div className="flex gap-6">
                  {/* Product Image */}
                  <Link to={`/products/${item.id}`} className="flex-shrink-0">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-32 h-32 object-cover rounded-xl border border-gray-200"
                    />
                  </Link>

                  {/* Product Info */}
                  <div className="flex-grow">
                    <Link to={`/products/${item.id}`}>
                      <h3 className="font-serif text-2xl font-bold text-black mb-2 hover:text-orange-500 transition-colors">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-3xl font-black text-black mb-6">LE {parseFloat(item.price).toLocaleString()}</p>

                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-12 h-12 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg flex items-center justify-center transition-colors"
                        >
                          -
                        </button>
                        <span className="text-xl font-bold w-12 text-center text-black">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-12 h-12 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg flex items-center justify-center transition-colors"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-12 h-12 bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <p className="text-2xl font-black text-black">LE {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 sticky top-24">
              <h2 className="font-serif text-3xl font-bold text-black mb-8">Order Summary</h2>
              
              <div className="space-y-6 mb-8">
                <div className="flex justify-between text-gray-600 text-lg">
                  <span>Subtotal</span>
                  <span>LE {getCartTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-lg">
                  <span>Shipping</span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>
                <div className="border-t border-gray-300 pt-6 flex justify-between text-2xl font-black text-black">
                  <span>Total</span>
                  <span>LE {getCartTotal().toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-black text-white py-4 rounded-xl hover:bg-gray-800 transition-all transform hover:scale-105 font-bold text-lg tracking-wide uppercase mb-4"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/products"
                className="block text-center text-gray-600 hover:text-black transition-colors font-medium"
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
