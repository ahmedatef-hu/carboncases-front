import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Register = () => {
  const [showVerification, setShowVerification] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    verificationCode: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Send verification code
      await api.post('/auth/send-verification', { email: formData.email });
      setShowVerification(true);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send verification code');
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Register with verification code (backend will verify it)
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      // Force page reload to update navbar
      window.location.href = '/';
    } catch (error) {
      setError(error.response?.data?.message || 'Verification or registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 fade-in">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl font-bold mb-2">
            {showVerification ? 'Verify Your Email' : 'Create Account'}
          </h1>
          <p className="text-gray-400">
            {showVerification ? 'Enter the code sent to your email' : 'Join the Carbon Cases family'}
          </p>
        </div>

        <div className="bg-secondary rounded-2xl p-8 border border-gray-800">
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}

          {/* Registration Form */}
          {!showVerification ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-primary border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-accent transition-colors"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-primary border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-accent transition-colors"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">Phone (Optional)</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-primary border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-accent transition-colors"
                  placeholder="555-0123"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium mb-2">Address (Optional)</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="2"
                  className="w-full bg-primary border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-accent transition-colors"
                  placeholder="123 Main St, City, State"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                  className="w-full bg-primary border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-accent transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full bg-primary border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-accent transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-primary py-3 rounded-lg hover:bg-accent-hover transition-colors font-semibold disabled:opacity-50"
              >
                {loading ? 'Sending Code...' : 'Create Account'}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-secondary text-gray-400">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  // Use localhost for development, Vercel for production
                  const backendUrl = process.env.NODE_ENV === 'production' 
                    ? 'https://carboncases-back.vercel.app' 
                    : 'http://localhost:5000';
                  window.location.href = `${backendUrl}/api/auth/google`;
                }}
                className="w-full bg-white text-gray-900 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </form>
          ) : (
            /* Verification Code Form */
            <form onSubmit={handleVerifyAndRegister} className="space-y-5">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📧</span>
                </div>
                <p className="text-gray-300 mb-2">
                  تم إرسال كود التأكيد إلى
                </p>
                <p className="text-accent font-semibold">{formData.email}</p>
              </div>

              <div>
                <label htmlFor="verificationCode" className="block text-sm font-medium mb-2 text-center">
                  Enter Verification Code
                </label>
                <input
                  type="text"
                  id="verificationCode"
                  name="verificationCode"
                  value={formData.verificationCode}
                  onChange={handleChange}
                  required
                  maxLength="6"
                  className="w-full bg-primary border border-gray-800 rounded-lg px-4 py-4 focus:outline-none focus:border-accent transition-colors text-center text-3xl tracking-widest font-bold"
                  placeholder="000000"
                  autoFocus
                />
                <p className="text-xs text-gray-400 text-center mt-2">
                  Code expires in 10 minutes
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-primary py-3 rounded-lg hover:bg-accent-hover transition-colors font-semibold disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify & Complete Registration'}
              </button>

              <button
                type="button"
                onClick={() => setShowVerification(false)}
                className="w-full text-gray-400 hover:text-accent transition-colors text-sm"
              >
                ← Back to Registration
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-accent hover:text-accent-hover transition-colors font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
