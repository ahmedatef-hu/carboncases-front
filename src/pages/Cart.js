import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Prevent admin from accessing cart
  useEffect(() => {
    const isAdmin = !!localStorage.getItem('adminToken');
    if (isAdmin) {
      window.location.href = '/admin/dashboard';
    }
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
      <div className="min-h-screen flex items-center justify-center px-4 fade-in">
        <div className="text-center">
          <FiShoppingBag size={64} className="mx-auto mb-4 text-gray-600" />
          <h2 className="font-serif text-3xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-400 mb-8">Discover our premium carbon fiber collection</p>
          <Link
            to="/products"
            className="inline-block bg-accent text-primary px-8 py-3 rounded-lg hover:bg-accent-hover transition-colors font-semibold"
          >
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-serif text-4xl font-bold">Shopping Cart</h1>
          <button
            onClick={clearCart}
            className="text-gray-400 hover:text-red-500 transition-colors text-sm"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <div key={item.id} className="bg-secondary rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors">
                <div className="flex gap-6">
                  {/* Product Image */}
                  <Link to={`/products/${item.id}`} className="flex-shrink-0">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </Link>

                  {/* Product Info */}
                  <div className="flex-grow">
                    <Link to={`/products/${item.id}`}>
                      <h3 className="font-semibold text-lg mb-2 hover:text-accent transition-colors">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-accent font-bold text-xl mb-4">${item.price}</p>

                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="bg-primary border border-gray-800 w-8 h-8 rounded-lg hover:border-accent transition-colors"
                        >
                          -
                        </button>
                        <span className="font-semibold w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="bg-primary border border-gray-800 w-8 h-8 rounded-lg hover:border-accent transition-colors"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <p className="font-bold text-xl">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-secondary rounded-xl p-6 border border-gray-800 sticky top-24">
              <h2 className="font-serif text-2xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t border-gray-800 pt-4 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-accent">${getCartTotal().toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-accent text-primary py-4 rounded-lg hover:bg-accent-hover transition-all transform hover:scale-105 font-semibold text-lg"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/products"
                className="block text-center mt-4 text-gray-400 hover:text-accent transition-colors"
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
