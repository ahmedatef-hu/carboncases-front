import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { FiHome, FiPackage, FiShoppingBag, FiUsers, FiLogOut, FiShield } from 'react-icons/fi';
import api from '../../utils/api';

// Admin sub-components
import DashboardHome from './DashboardHome';
import ProductsManagement from './ProductsManagement';
import OrdersManagement from './OrdersManagement';
import UsersManagement from './UsersManagement';

const AdminDashboard = () => {
  const location = useLocation();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminAuth = async () => {
      const adminToken = localStorage.getItem('adminToken');
      const savedAdmin = localStorage.getItem('admin');
      
      console.log('🔍 Checking admin auth...', { 
        hasToken: !!adminToken, 
        hasAdmin: !!savedAdmin 
      });
      
      if (!adminToken || !savedAdmin) {
        console.log('❌ No admin credentials, redirecting to login...');
        window.location.href = '/admin/login';
        return;
      }

      try {
        // Set authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${adminToken}`;
        console.log('✅ Admin token found, setting admin data...');
        setAdmin(JSON.parse(savedAdmin));
      } catch (error) {
        console.error('❌ Error parsing admin data:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
        delete api.defaults.headers.common['Authorization'];
        window.location.href = '/admin/login';
      } finally {
        setLoading(false);
      }
    };

    checkAdminAuth();
  }, []);

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
    console.log('🚪 Admin logout initiated');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    delete api.defaults.headers.common['Authorization'];
    console.log('✅ Admin credentials cleared, redirecting to login...');
    window.location.href = '/admin/login';
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
            onClick={() => window.location.href = '/admin/login'}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Go to Admin Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Floating Particles Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="floating-particles">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 20}s`,
                animationDuration: `${15 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-full blur-3xl animate-float" style={{animationDuration: '10s'}}></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-full blur-3xl animate-float" style={{animationDuration: '15s', animationDelay: '5s'}}></div>
      </div>

      <div className="flex relative z-10">
        {/* Sidebar */}
        <aside className="w-64 lg:w-72 bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-xl border-r border-orange-500/20 min-h-screen sticky top-0 hidden md:block">
          <div className="p-4 lg:p-6 border-b border-orange-500/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center relative group" style={{
                boxShadow: '0 10px 30px rgba(255, 107, 53, 0.3)'
              }}>
                <FiShield className="w-4 h-4 lg:w-6 lg:h-6 text-white relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
              </div>
              <div>
                <h2 className="font-bold text-white text-base lg:text-lg" style={{textShadow: '0 0 20px rgba(255, 107, 53, 0.3)'}}>Admin Panel</h2>
                <p className="text-xs text-orange-400">Carbon Cases</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-800/80 to-black/80 backdrop-blur-sm rounded-xl p-3 border border-orange-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full blur-xl"></div>
              <p className="text-sm font-medium text-white truncate relative z-10">{admin.name}</p>
              <p className="text-xs text-gray-400 truncate relative z-10">{admin.email}</p>
              <span className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs px-3 py-1 rounded-full mt-2 font-semibold relative z-10" style={{
                boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)'
              }}>
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
                  className={`flex items-center space-x-3 px-3 lg:px-4 py-3 rounded-xl mb-2 transition-all duration-300 relative overflow-hidden group ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold'
                      : 'text-gray-300 hover:text-white'
                  }`}
                  style={isActive ? {
                    boxShadow: '0 10px 30px rgba(255, 107, 53, 0.4)'
                  } : {}}
                >
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 to-red-500/0 group-hover:from-orange-500/10 group-hover:to-red-500/10 transition-all duration-300"></div>
                  )}
                  <Icon size={18} className="lg:w-5 lg:h-5 relative z-10" />
                  <span className="text-sm lg:text-base relative z-10">{item.label}</span>
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                </Link>
              );
            })}

            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-3 lg:px-4 py-3 rounded-xl mb-2 text-gray-300 hover:text-white transition-all duration-300 w-full mt-6 lg:mt-8 relative overflow-hidden group border border-red-500/30 hover:border-red-500/60"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 to-red-500/0 group-hover:from-red-600/80 group-hover:to-red-500/80 transition-all duration-300"></div>
              <FiLogOut size={18} className="lg:w-5 lg:h-5 relative z-10" />
              <span className="text-sm lg:text-base relative z-10">Logout</span>
            </button>
          </nav>
        </aside>

        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 bg-gradient-to-r from-gray-900/95 to-black/95 backdrop-blur-xl border-b border-orange-500/20 z-50">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center" style={{
                boxShadow: '0 8px 20px rgba(255, 107, 53, 0.3)'
              }}>
                <FiShield className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-white text-sm" style={{textShadow: '0 0 15px rgba(255, 107, 53, 0.3)'}}>Admin Panel</h2>
                <p className="text-xs text-orange-400">Carbon Cases</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-xs font-medium text-white">{admin.name}</p>
                <p className="text-xs text-orange-400">Admin</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-8 h-8 bg-gradient-to-r from-red-600 to-red-500 rounded-lg flex items-center justify-center text-white hover:from-red-700 hover:to-red-600 transition-all"
                style={{boxShadow: '0 4px 15px rgba(220, 38, 38, 0.4)'}}
              >
                <FiLogOut size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900/95 to-black/95 backdrop-blur-xl border-t border-orange-500/20 z-50">
          <div className="flex">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex-1 flex flex-col items-center justify-center py-3 transition-all duration-300 relative ${
                    isActive
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600" style={{
                      boxShadow: '0 -4px 20px rgba(255, 107, 53, 0.4)'
                    }}></div>
                  )}
                  <Icon size={20} className="relative z-10" />
                  <span className="text-xs mt-1 font-medium relative z-10">{item.label.split(' ')[0]}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 bg-black min-h-screen relative">
          <div className="p-1.5 sm:p-6 lg:p-8 pt-20 pb-20 md:pt-8 md:pb-8 relative z-10">
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
