import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiShield, FiMail, FiEye, FiEyeOff } from 'react-icons/fi';
import api from '../../utils/api';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Check if admin is already logged in
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/admin/login', formData);
      
      // Set authorization header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('admin', JSON.stringify(response.data.admin));
      
      navigate('/admin/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Admin login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl mb-6 shadow-2xl">
            <FiShield size={40} className="text-white" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-black text-white mb-3">Admin Portal</h1>
          <p className="text-xl text-gray-300 font-light">Secure access for administrators</p>
          <div className="flex items-center justify-center space-x-2 mt-4">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-400 uppercase tracking-wide">Restricted Area</span>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-gray-800 rounded-3xl p-8 md:p-10 shadow-2xl border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-xl text-sm font-medium flex items-center space-x-2">
                <FiLock className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-300 uppercase tracking-wide">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-700 border-2 border-gray-600 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium text-white placeholder-gray-400"
                  placeholder="admin@carboncases.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-300 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-700 border-2 border-gray-600 rounded-xl pl-12 pr-12 py-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium text-white placeholder-gray-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 rounded-xl hover:from-orange-600 hover:to-red-700 transition-all transform hover:scale-105 font-bold text-lg tracking-wide uppercase disabled:opacity-50 disabled:transform-none shadow-xl"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <FiShield className="w-5 h-5" />
                  <span>Admin Sign In</span>
                </div>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-8 p-4 bg-gray-700/50 rounded-xl border border-gray-600">
            <div className="flex items-center space-x-2 text-yellow-400 mb-2">
              <FiLock className="w-4 h-4" />
              <span className="text-sm font-semibold">Security Notice</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              This is a restricted area. All access attempts are logged and monitored. 
              Unauthorized access is strictly prohibited.
            </p>
          </div>
        </div>

        {/* Security Indicators */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Encrypted</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span>Monitored</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
