import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiPackage, FiShoppingBag, FiUsers, FiLogOut } from 'react-icons/fi';
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

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const savedAdmin = localStorage.getItem('admin');
    
    if (!adminToken || !savedAdmin) {
      navigate('/admin/login');
      return;
    }

    setAdmin(JSON.parse(savedAdmin));
  }, [navigate]);

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

  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-secondary border-r border-gray-800 min-h-screen sticky top-0">
          <div className="p-6">
            <h2 className="font-serif text-2xl font-bold mb-2">Admin Panel</h2>
            <p className="text-sm text-gray-400">{admin.name}</p>
          </div>

          <nav className="px-4">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                    isActive
                      ? 'bg-accent text-primary font-semibold'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-accent'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 text-gray-400 hover:bg-gray-800 hover:text-red-500 transition-colors w-full mt-8"
            >
              <FiLogOut size={20} />
              <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Routes>
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/products" element={<ProductsManagement />} />
            <Route path="/orders" element={<OrdersManagement />} />
            <Route path="/users" element={<UsersManagement />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
