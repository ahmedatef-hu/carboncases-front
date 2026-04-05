import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCreditCard, FiLock } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import api from '../utils/api';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    governorate: '',
    phone: ''
  });

  const handleChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  // No need to check for admin token here - ProtectedRoute already handles authentication

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to place an order');
        setLoading(false);
        navigate('/login');
        return;
      }

      const orderData = {
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          variant: item.variant ? item.variant.replace(/-/g, '_') : null, // Convert hyphen to underscore
          selectedColor: item.selectedColor || null,
          selectedModel: item.selectedModel || null
        })),
        shippingAddress: `${shippingInfo.fullName}, ${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.governorate}, Phone: ${shippingInfo.phone}`
      };

      console.log('Submitting order:', orderData);
      console.log('API Base URL:', process.env.REACT_APP_API_URL);
      
      const response = await api.post('/orders', orderData);
      console.log('Order response:', response.data);
      
      clearCart();
      alert('Order placed successfully!');
      navigate('/profile?tab=orders');
    } catch (error) {
      console.error('Order error:', error);
      console.error('Error response:', error.response);
      
      if (error.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Please make sure the backend is running.');
      } else {
        setError(error.response?.data?.message || 'Order failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen py-8 px-4 fade-in">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-serif text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Shipping Information */}
              <div className="bg-secondary rounded-xl p-6 border border-gray-800">
                <h2 className="font-serif text-2xl font-bold mb-6">Shipping Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={shippingInfo.fullName}
                      onChange={handleChange}
                      required
                      className="w-full bg-primary border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleChange}
                      required
                      className="w-full bg-primary border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">City</label>
                      <input
                        type="text"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleChange}
                        required
                        className="w-full bg-primary border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-accent transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Governorate</label>
                      <select
                        name="governorate"
                        value={shippingInfo.governorate}
                        onChange={handleChange}
                        required
                        className="w-full bg-primary border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-accent transition-colors"
                      >
                        <option value="">Select Governorate</option>
                        <option value="Cairo">Cairo</option>
                        <option value="Giza">Giza</option>
                        <option value="Alexandria">Alexandria</option>
                        <option value="Dakahlia">Dakahlia</option>
                        <option value="Red Sea">Red Sea</option>
                        <option value="Beheira">Beheira</option>
                        <option value="Fayoum">Fayoum</option>
                        <option value="Gharbiya">Gharbiya</option>
                        <option value="Ismailia">Ismailia</option>
                        <option value="Menofia">Menofia</option>
                        <option value="Minya">Minya</option>
                        <option value="Qaliubiya">Qaliubiya</option>
                        <option value="New Valley">New Valley</option>
                        <option value="Suez">Suez</option>
                        <option value="Aswan">Aswan</option>
                        <option value="Assiut">Assiut</option>
                        <option value="Beni Suef">Beni Suef</option>
                        <option value="Port Said">Port Said</option>
                        <option value="Damietta">Damietta</option>
                        <option value="Sharkia">Sharkia</option>
                        <option value="South Sinai">South Sinai</option>
                        <option value="Kafr El Sheikh">Kafr El Sheikh</option>
                        <option value="Matrouh">Matrouh</option>
                        <option value="Luxor">Luxor</option>
                        <option value="Qena">Qena</option>
                        <option value="North Sinai">North Sinai</option>
                        <option value="Sohag">Sohag</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleChange}
                      required
                      className="w-full bg-primary border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-secondary rounded-xl p-6 border border-gray-800">
                <h2 className="font-serif text-2xl font-bold mb-6 flex items-center">
                  <FiCreditCard className="mr-2" />
                  Payment Information
                </h2>
                
                <div className="bg-accent/10 border border-accent/30 rounded-lg p-6 text-center">
                  <FiLock className="mx-auto mb-3 text-accent" size={32} />
                  <p className="text-gray-300 mb-2">Secure Payment Integration</p>
                  <p className="text-sm text-gray-400">
                    Stripe/PayPal integration placeholder. In production, this would connect to your payment processor.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-primary py-4 rounded-lg hover:bg-accent-hover transition-all transform hover:scale-105 font-semibold text-lg disabled:opacity-50"
              >
                {loading ? 'Processing...' : `Place Order - LE ${getCartTotal().toFixed(2)}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-secondary rounded-xl p-6 border border-gray-800 sticky top-24">
              <h2 className="font-serif text-2xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cart.map(item => (
                  <div key={`${item.id}-${item.variant || 'default'}`} className="text-sm">
                    <div className="flex justify-between mb-1">
                      <div className="flex-1">
                        <span className="text-gray-400">
                          {item.name} x {item.quantity}
                        </span>
                        {item.variant && (
                          <span className={`ml-2 text-xs px-2 py-0.5 rounded ${
                            item.variant === 'with_magsafe' 
                              ? 'bg-blue-500/20 text-blue-400' 
                              : 'bg-orange-500/20 text-orange-400'
                          }`}>
                            {item.variant === 'with_magsafe' ? '⚡ With MagSafe' : 'Without MagSafe'}
                          </span>
                        )}
                      </div>
                      <span className="font-semibold">LE {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    {(item.selectedColor || item.selectedModel) && (
                      <div className="ml-2 text-xs text-gray-500 space-y-0.5">
                        {item.selectedColor && (
                          <div>Color: <span className="text-orange-400">{item.selectedColor}</span></div>
                        )}
                        {item.selectedModel && (
                          <div>Model: <span className="text-orange-400">{item.selectedModel}</span></div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-800 pt-4 space-y-3">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>LE {getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tax</span>
                  <span>LE 0.00</span>
                </div>
                <div className="border-t border-gray-800 pt-3 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-accent">LE {getCartTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
