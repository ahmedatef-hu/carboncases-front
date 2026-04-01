import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const CompleteProfile = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [formData, setFormData] = useState({
    phone: '',
    address: ''
  });
  const [user, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    
    console.log('🔍 CompleteProfile - Token from URL:', token);
    
    if (!token) {
      console.log('❌ No token found, redirecting to login');
      navigate('/login');
      return;
    }

    // Save token and fetch user data
    localStorage.setItem('token', token);
    console.log('✅ Token saved to localStorage');
    
    // Fetch user info
    api.get('/user/profile')
      .then(response => {
        console.log('✅ User profile fetched:', response.data);
        if (response.data.user) {
          setUserData(response.data.user);
          // If user already has phone and address, skip this page
          if (response.data.user.phone && response.data.user.address) {
            setUser(response.data.user);
            navigate('/');
          }
        } else {
          console.log('❌ No user data in response');
          navigate('/login');
        }
      })
      .catch(error => {
        console.error('❌ Error fetching profile:', error);
        navigate('/login');
      });
  }, [searchParams, navigate, setUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.put('/user/profile', formData);
      
      // Fetch updated user data
      const response = await api.get('/user/profile');
      setUser(response.data.user);
      
      // Force page reload to update navbar
      window.location.href = '/';
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 fade-in">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">👋</span>
          </div>
          <h1 className="font-serif text-4xl font-bold mb-2">Welcome, {user.name}!</h1>
          <p className="text-gray-400">Complete your profile to continue</p>
        </div>

        <div className="bg-secondary rounded-2xl p-8 border border-gray-800">
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="bg-primary/50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-400 mb-1">Email</p>
              <p className="text-white font-medium">{user.email}</p>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                Phone Number <span className="text-gray-500">(Optional)</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-primary border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-accent transition-colors"
                placeholder="01234567890"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium mb-2">
                Shipping Address <span className="text-gray-500">(Optional)</span>
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className="w-full bg-primary border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-accent transition-colors"
                placeholder="Street, City, Country"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-primary py-3 rounded-lg hover:bg-accent-hover transition-colors font-semibold disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Complete Profile'}
            </button>

            <button
              type="button"
              onClick={() => {
                setUser(user);
                window.location.href = '/';
              }}
              className="w-full text-gray-400 hover:text-accent transition-colors text-sm"
            >
              Skip for now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;
