import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiUser, FiPackage, FiEdit2, FiSave } from 'react-icons/fi';
import api from '../utils/api';

const Profile = () => {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/user/profile');
      setProfile(response.data.user);
      setFormData(response.data.user);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/my-orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      await api.put('/user/profile', formData);
      setProfile(formData);
      setEditing(false);
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(formData));
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500',
      shipped: 'bg-blue-500/20 text-blue-500 border-blue-500',
      completed: 'bg-green-500/20 text-green-500 border-green-500',
      canceled: 'bg-red-500/20 text-red-500 border-red-500'
    };
    return colors[status] || colors.pending;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 fade-in">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-serif text-4xl font-bold mb-8">My Account</h1>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-gray-800">
          <a
            href="?tab=profile"
            className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === 'profile' ? 'border-accent text-accent' : 'border-transparent text-gray-400 hover:text-accent'
            }`}
          >
            <FiUser />
            <span>Profile</span>
          </a>
          <a
            href="?tab=orders"
            className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === 'orders' ? 'border-accent text-accent' : 'border-transparent text-gray-400 hover:text-accent'
            }`}
          >
            <FiPackage />
            <span>Orders</span>
          </a>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && profile && (
          <div className="bg-secondary rounded-xl p-8 border border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-2xl font-bold">Profile Information</h2>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center space-x-2 text-accent hover:text-accent-hover transition-colors"
                >
                  <FiEdit2 />
                  <span>Edit</span>
                </button>
              ) : (
                <button
                  onClick={handleUpdate}
                  className="flex items-center space-x-2 bg-accent text-primary px-4 py-2 rounded-lg hover:bg-accent-hover transition-colors"
                >
                  <FiSave />
                  <span>Save</span>
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-400">Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!editing}
                  className="w-full bg-primary border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-accent transition-colors disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-400">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full bg-primary border border-gray-800 rounded-lg px-4 py-3 opacity-60 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-400">Phone</label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!editing}
                  className="w-full bg-primary border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-accent transition-colors disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-400">Address</label>
                <textarea
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  disabled={!editing}
                  rows="3"
                  className="w-full bg-primary border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-accent transition-colors disabled:opacity-60"
                />
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="bg-secondary rounded-xl p-12 border border-gray-800 text-center">
                <FiPackage size={48} className="mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400 text-lg">No orders yet</p>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.id} className="bg-secondary rounded-xl p-6 border border-gray-800">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                      <p className="text-sm text-gray-400">
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>

                  {order.items && order.items.length > 0 && (
                    <div className="space-y-3 mb-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-4">
                          <img src={item.imageUrl} alt={item.productName} className="w-16 h-16 object-cover rounded-lg" />
                          <div className="flex-grow">
                            <p className="font-medium">{item.productName}</p>
                            {item.variant && (
                              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold mr-2 ${
                                item.variant === 'with_magsafe' 
                                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                                  : 'bg-gray-700/20 text-gray-400 border border-gray-600/30'
                              }`}>
                                {item.variant === 'with_magsafe' ? '⚡ With MagSafe' : 'Without MagSafe'}
                              </span>
                            )}
                            <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-semibold">LE {(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="border-t border-gray-800 pt-4 flex justify-between items-center">
                    <span className="text-gray-400">Total</span>
                    <span className="text-xl font-bold text-accent">LE {parseFloat(order.total_amount || order.total_price || 0).toFixed(2)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
