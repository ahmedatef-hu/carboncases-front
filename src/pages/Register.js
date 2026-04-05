import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiPhone, FiMapPin, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Register = () => {
  const [showVerification, setShowVerification] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    verificationCode: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for this field when user starts typing
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      await api.post('/auth/send-verification', { email: formData.email });
      setShowVerification(true);
      setLoading(false);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to send verification code';
      // Check if it's an email-specific error
      if (errorMsg.toLowerCase().includes('email')) {
        setErrors({ email: errorMsg });
      } else {
        setErrors({ general: errorMsg });
      }
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      window.location.href = '/';
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Verification or registration failed';
      // Check what kind of error it is
      if (errorMsg.toLowerCase().includes('verification') || errorMsg.toLowerCase().includes('code')) {
        setErrors({ verificationCode: errorMsg });
      } else if (errorMsg.toLowerCase().includes('email')) {
        setErrors({ email: errorMsg });
      } else {
        setErrors({ general: errorMsg });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500/20 to-red-600/20 backdrop-blur-sm rounded-2xl mb-6 border border-orange-500/30" style={{
            boxShadow: '0 10px 40px rgba(255, 107, 53, 0.3)'
          }}>
            <img 
              src="/logo.PNG" 
              alt="Carbon Case" 
              className="w-12 h-12 object-contain"
            />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-black text-white mb-3" style={{
            textShadow: '0 0 40px rgba(255, 107, 53, 0.4)'
          }}>
            {showVerification ? 'Verify Your Email' : 'Create Account'}
          </h1>
          <p className="text-xl text-white/70 font-light">
            {showVerification ? 'Enter the code sent to your email' : 'Join the Carbon Case family'}
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-orange-500/20 shadow-lg" style={{
          boxShadow: '0 20px 60px rgba(255, 107, 53, 0.2)'
        }}>
          {errors.general && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm font-medium backdrop-blur-sm mb-6">
              {errors.general}
            </div>
          )}

          {/* Registration Form */}
          {!showVerification ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-semibold text-orange-400 uppercase tracking-wider flex items-center space-x-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                  <span>Full Name</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-orange-400/50" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`w-full bg-black/50 backdrop-blur-md border-2 ${errors.name ? 'border-red-500/50' : 'border-orange-500/30'} rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium text-white placeholder-white/40 hover:border-orange-500/50`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1 flex items-center space-x-1">
                    <span>⚠️</span>
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-orange-400 uppercase tracking-wider flex items-center space-x-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                  <span>Email Address</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-orange-400/50" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full bg-black/50 backdrop-blur-md border-2 ${errors.email ? 'border-red-500/50' : 'border-orange-500/30'} rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium text-white placeholder-white/40 hover:border-orange-500/50`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1 flex items-center space-x-1">
                    <span>⚠️</span>
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-orange-400 uppercase tracking-wider flex items-center space-x-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                  <span>Password</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-orange-400/50" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={`w-full bg-black/50 backdrop-blur-md border-2 ${errors.password ? 'border-red-500/50' : 'border-orange-500/30'} rounded-xl pl-12 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium text-white placeholder-white/40 hover:border-orange-500/50`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-orange-400/50 hover:text-orange-400 transition-colors"
                  >
                    {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1 flex items-center space-x-1">
                    <span>⚠️</span>
                    <span>{errors.password}</span>
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-orange-400 uppercase tracking-wider flex items-center space-x-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                  <span>Confirm Password</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-orange-400/50" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className={`w-full bg-black/50 backdrop-blur-md border-2 ${errors.confirmPassword ? 'border-red-500/50' : 'border-orange-500/30'} rounded-xl pl-12 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium text-white placeholder-white/40 hover:border-orange-500/50`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-orange-400/50 hover:text-orange-400 transition-colors"
                  >
                    {showConfirmPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-sm mt-1 flex items-center space-x-1">
                    <span>⚠️</span>
                    <span>{errors.confirmPassword}</span>
                  </p>
                )}
              </div>

              {/* Phone (Optional) */}
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-semibold text-orange-400 uppercase tracking-wider flex items-center space-x-2">
                  <span className="w-2 h-2 bg-orange-500/50 rounded-full"></span>
                  <span>Phone <span className="text-white/40 text-xs">(Optional)</span></span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiPhone className="h-5 w-5 text-orange-400/50" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-black/50 backdrop-blur-md border-2 border-orange-500/30 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium text-white placeholder-white/40 hover:border-orange-500/50"
                    placeholder="01234567890"
                  />
                </div>
              </div>

              {/* Address (Optional) */}
              <div className="space-y-2">
                <label htmlFor="address" className="block text-sm font-semibold text-orange-400 uppercase tracking-wider flex items-center space-x-2">
                  <span className="w-2 h-2 bg-orange-500/50 rounded-full"></span>
                  <span>Address <span className="text-white/40 text-xs">(Optional)</span></span>
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-0 pl-4 flex items-start pointer-events-none">
                    <FiMapPin className="h-5 w-5 text-orange-400/50" />
                  </div>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="2"
                    className="w-full bg-black/50 backdrop-blur-md border-2 border-orange-500/30 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium text-white placeholder-white/40 hover:border-orange-500/50 resize-none"
                    placeholder="Street, City, Country"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 rounded-xl hover:from-red-600 hover:to-orange-500 transition-all duration-500 transform hover:scale-105 font-bold text-lg tracking-wide uppercase disabled:opacity-50 disabled:transform-none shadow-lg relative overflow-hidden group"
                style={{
                  boxShadow: '0 10px 40px rgba(255, 107, 53, 0.4)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                <span className="relative z-10">
                  {loading ? 'Sending Code...' : 'Create Account'}
                </span>
              </button>
            </form>
          ) : (
            /* Verification Code Form */
            <form onSubmit={handleVerifyAndRegister} className="space-y-5">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-500/30">
                  <span className="text-3xl">📧</span>
                </div>
                <p className="text-white/70 mb-2">
                  تم إرسال كود التأكيد إلى
                </p>
                <p className="text-orange-400 font-semibold">{formData.email}</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="verificationCode" className="block text-sm font-semibold text-orange-400 uppercase tracking-wider flex items-center space-x-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                  <span>Verification Code</span>
                </label>
                <input
                  type="text"
                  id="verificationCode"
                  name="verificationCode"
                  value={formData.verificationCode}
                  onChange={handleChange}
                  required
                  maxLength="6"
                  className={`w-full bg-black/50 backdrop-blur-md border-2 ${errors.verificationCode ? 'border-red-500/50' : 'border-orange-500/30'} rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-bold text-2xl text-center text-white placeholder-white/40 hover:border-orange-500/50 tracking-widest`}
                  placeholder="000000"
                />
                {errors.verificationCode && (
                  <p className="text-red-400 text-sm mt-1 flex items-center space-x-1">
                    <span>⚠️</span>
                    <span>{errors.verificationCode}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 rounded-xl hover:from-red-600 hover:to-orange-500 transition-all duration-500 transform hover:scale-105 font-bold text-lg tracking-wide uppercase disabled:opacity-50 disabled:transform-none shadow-lg relative overflow-hidden group"
                style={{
                  boxShadow: '0 10px 40px rgba(255, 107, 53, 0.4)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                <span className="relative z-10">
                  {loading ? 'Verifying...' : 'Verify & Register'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setShowVerification(false)}
                className="w-full text-white/60 hover:text-orange-400 transition-colors text-sm py-2"
              >
                ← Back to registration
              </button>
            </form>
          )}

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-white/60">
              Already have an account?{' '}
              <Link to="/login" className="text-orange-400 hover:text-orange-300 transition-colors font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-6 text-sm text-white/50">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Secure Registration</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Email Verified</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span>Privacy First</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
