import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiPackage, FiShoppingBag, FiUsers, FiLogOut, FiShield } from 'react-icons/fi';
import api from '../../utils/api';

// Admin sub-components
import DashboardHome from './DashboardHome';
import ProductsManagement from './ProductsManagement';
import OrdersManagement from './OrdersManagement';
import UsersManagement from './UsersManagement';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminAuth = async () => {
      const adminToken = localStorage.getItem('adminToken');
      const savedAdmin = localStorage.getItem('admin');
      
      if (!adminToken || !savedAdmin) {
        navigate('/admin/login');
        return;
      }

      try {
        // Verify token with backend
        api.defaults.headers.common['Authorization'] = `Bearer ${adminToken}`;
        await api.get('/admin/stats'); // Test admin endpoint
        setAdmin(JSON.parse(savedAdmin));
      } catch (error) {
        console.error('Admin authentication failed:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
        delete api.defaults.headers.common['Authorization'];
        navigate('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAdminAuth();
  }, [navigate]);

  // Block access if user tries to access admin routes without proper authentication
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Clear admin session on page refresh if not properly authenticated
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        localStorage.removeItem('admin');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    delete api.defaults.headers.common['Authorization'];
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/admin/products', icon: FiPackage, label: 'Products' },
    { path: '/admin/orders', icon: FiShoppingBag, label: 'Orders' },
    { path: '/admin/users', icon: FiUsers, label: 'Users' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-white font-medium">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <FiShield className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold text-white">Access Denied</h2>
          <p className="text-gray-400">You don't have permission to access this area.</p>
          <button 
            onClick={() => navigate('/admin/login')}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Go to Admin Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 lg:w-72 bg-gray-800 border-r border-gray-700 min-h-screen sticky top-0 hidden md:block">
          <div className="p-4 lg:p-6 border-b border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <FiShield className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-white text-base lg:text-lg">Admin Panel</h2>
                <p className="text-xs text-gray-400">Carbon Cases</p>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3">
              <p className="text-sm font-medium text-white truncate">{admin.name}</p>
              <p className="text-xs text-gray-400 truncate">{admin.email}</p>
              <span className="inline-block bg-green-500 text-white text-xs px-2 py-1 rounded-full mt-2">
                {admin.role || 'Administrator'}
              </span>
            </div>
          </div>

          <nav className="px-3 lg:px-4 py-4 lg:py-6">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 lg:px-4 py-3 rounded-lg mb-2 transition-colors ${
                    isActive
                      ? 'bg-orange-500 text-white font-semibold shadow-lg'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon size={18} className="lg:w-5 lg:h-5" />
                  <span className="text-sm lg:text-base">{item.label}</span>
                </Link>
              );
            })}

            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-3 lg:px-4 py-3 rounded-lg mb-2 text-gray-300 hover:bg-red-600 hover:text-white transition-colors w-full mt-6 lg:mt-8"
            >
              <FiLogOut size={18} className="lg:w-5 lg:h-5" />
              <span className="text-sm lg:text-base">Logout</span>
            </button>
          </nav>
        </aside>

        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 bg-gray-800 border-b border-gray-700 z-50">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <FiShield className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-white text-sm">Admin Panel</h2>
                <p className="text-xs text-gray-400">Carbon Cases</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-xs font-medium text-white">{admin.name}</p>
                <p className="text-xs text-gray-400">Admin</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white hover:bg-red-700 transition-colors"
              >
                <FiLogOut size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 z-50">
          <div className="flex">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex-1 flex flex-col items-center justify-center py-3 transition-colors ${
                    isActive
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-xs mt-1 font-medium">{item.label.split(' ')[0]}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 bg-gray-50 min-h-screen">
          <div className="p-4 sm:p-6 lg:p-8 pt-20 pb-20 md:pt-8 md:pb-8">
            <Routes>
              <Route path="/dashboard" element={<DashboardHome />} />
              <Route path="/products" element={<ProductsManagement />} />
              <Route path="/orders" element={<OrdersManagement />} />
              <Route path="/users" element={<UsersManagement />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
