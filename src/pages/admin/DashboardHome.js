import React, { useEffect, useState } from 'react';
import { FiDollarSign, FiShoppingBag, FiUsers, FiTrendingUp, FiAlertCircle, FiArrowUp, FiArrowDown, FiEye, FiPackage } from 'react-icons/fi';
import api from '../../utils/api';

const DashboardHome = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Sales',
      value: `LE ${parseFloat(stats?.totalSales || 0).toLocaleString()}`,
      icon: FiDollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      change: '+12.5%',
      changeType: 'up'
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: FiShoppingBag,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      change: '+8.2%',
      changeType: 'up'
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: FiUsers,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      change: '+15.3%',
      changeType: 'up'
    },
    {
      title: 'Low Stock Items',
      value: stats?.lowStock?.length || 0,
      icon: FiAlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      change: '-2.1%',
      changeType: 'down'
    }
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-2">Dashboard Overview</h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Welcome back! Here's what's happening with your store today.</p>
        </div>
        <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm self-start sm:self-auto">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs sm:text-sm font-medium text-gray-700">Live Data</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const ChangeIcon = stat.changeType === 'up' ? FiArrowUp : FiArrowDown;
          return (
            <div key={index} className={`bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 border-2 ${stat.borderColor} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
              <div className="flex items-center justify-between mb-3 lg:mb-4">
                <div className={`${stat.bgColor} p-3 lg:p-4 rounded-lg lg:rounded-xl`}>
                  <Icon size={20} className={`${stat.color} sm:w-6 sm:h-6 lg:w-7 lg:h-7`} />
                </div>
                <div className={`flex items-center space-x-1 px-2 py-1 lg:px-3 lg:py-1 rounded-full text-xs lg:text-sm font-semibold ${
                  stat.changeType === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  <ChangeIcon size={12} className="lg:w-3.5 lg:h-3.5" />
                  <span>{stat.change}</span>
                </div>
              </div>
              <h3 className="text-gray-600 text-xs lg:text-sm font-semibold uppercase tracking-wide mb-1 lg:mb-2">{stat.title}</h3>
              <p className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        {/* Top Selling Products */}
        <div className="xl:col-span-2 bg-white rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-200 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 lg:mb-8 space-y-4 sm:space-y-0">
            <h2 className="font-serif text-xl sm:text-2xl font-black text-gray-900 flex items-center">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-orange-100 rounded-lg lg:rounded-xl flex items-center justify-center mr-2 lg:mr-3">
                <FiTrendingUp className="text-orange-600" size={16} />
              </div>
              <span className="hidden sm:inline">Top Selling Products</span>
              <span className="sm:hidden">Top Products</span>
            </h2>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors self-start sm:self-auto">
              <FiEye size={14} className="lg:w-4 lg:h-4" />
              <span className="text-xs sm:text-sm font-medium">View All</span>
            </button>
          </div>
          
          <div className="space-y-3 lg:space-y-4">
            {stats?.topProducts?.length === 0 ? (
              <div className="text-center py-8 lg:py-12">
                <FiPackage className="w-12 h-12 lg:w-16 lg:h-16 text-gray-300 mx-auto mb-3 lg:mb-4" />
                <p className="text-gray-500 font-medium text-sm lg:text-base">No sales data available yet</p>
              </div>
            ) : (
              stats?.topProducts?.map((product, index) => (
                <div key={product.id} className="flex items-center space-x-3 lg:space-x-4 p-3 lg:p-4 bg-gray-50 rounded-lg lg:rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-lg lg:rounded-xl flex items-center justify-center font-bold text-sm lg:text-lg">
                    #{index + 1}
                  </div>
                  <img src={product.image_url} alt={product.name} className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 object-cover rounded-lg lg:rounded-xl border border-gray-200" />
                  <div className="flex-grow min-w-0">
                    <h3 className="font-bold text-gray-900 mb-1 text-sm lg:text-base truncate">{product.name}</h3>
                    <p className="text-xs lg:text-sm text-gray-600 font-medium">{product.total_sold} units sold</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-black text-sm sm:text-lg lg:text-xl text-gray-900">LE {parseFloat(product.revenue).toLocaleString()}</p>
                    <p className="text-xs lg:text-sm text-gray-500">Revenue</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-200 shadow-lg">
          <h2 className="font-serif text-xl sm:text-2xl font-black text-gray-900 mb-6 lg:mb-8 flex items-center">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-red-100 rounded-lg lg:rounded-xl flex items-center justify-center mr-2 lg:mr-3">
              <FiAlertCircle className="text-red-600" size={16} />
            </div>
            <span className="hidden sm:inline">Stock Alerts</span>
            <span className="sm:hidden">Alerts</span>
          </h2>
          
          <div className="space-y-3 lg:space-y-4">
            {stats?.lowStock?.length === 0 ? (
              <div className="text-center py-6 lg:py-8">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
                  <FiPackage className="w-6 h-6 lg:w-8 lg:h-8 text-green-600" />
                </div>
                <p className="text-green-700 font-semibold mb-1 text-sm lg:text-base">All Good!</p>
                <p className="text-gray-500 text-xs lg:text-sm">All products are well stocked</p>
              </div>
            ) : (
              stats?.lowStock?.map(product => (
                <div key={product.id} className="p-3 lg:p-4 bg-red-50 border border-red-200 rounded-lg lg:rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900 text-xs sm:text-sm truncate pr-2">{product.name}</h3>
                    <span className="bg-red-500 text-white px-2 py-1 lg:px-3 lg:py-1 rounded-full text-xs font-bold flex-shrink-0">
                      URGENT
                    </span>
                  </div>
                  <p className="text-red-600 font-semibold text-xs lg:text-sm">Only {product.stock} left in stock</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-200 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 lg:mb-8 space-y-4 sm:space-y-0">
          <h2 className="font-serif text-xl sm:text-2xl font-black text-gray-900 flex items-center">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-100 rounded-lg lg:rounded-xl flex items-center justify-center mr-2 lg:mr-3">
              <FiShoppingBag className="text-blue-600" size={16} />
            </div>
            <span className="hidden sm:inline">Recent Orders</span>
            <span className="sm:hidden">Orders</span>
          </h2>
          <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors self-start sm:self-auto">
            <FiEye size={14} className="lg:w-4 lg:h-4" />
            <span className="text-xs sm:text-sm font-medium">View All Orders</span>
          </button>
        </div>
        
        {/* Mobile Cards View */}
        <div className="block sm:hidden space-y-4">
          {stats?.recentOrders?.length === 0 ? (
            <div className="text-center py-12">
              <FiShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No orders yet</p>
            </div>
          ) : (
            stats?.recentOrders?.map(order => (
              <div key={order.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-gray-900">#{order.id}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                    order.status === 'completed' ? 'bg-green-100 text-green-700' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{order.user_name}</p>
                    <p className="text-xs text-gray-500">{order.user_email}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-black text-gray-900">LE {parseFloat(order.total_price).toLocaleString()}</span>
                    <span className="text-xs text-gray-600 font-medium">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="text-left py-3 lg:py-4 px-2 lg:px-4 text-gray-600 font-bold text-xs lg:text-sm uppercase tracking-wide">Order ID</th>
                <th className="text-left py-3 lg:py-4 px-2 lg:px-4 text-gray-600 font-bold text-xs lg:text-sm uppercase tracking-wide">Customer</th>
                <th className="text-left py-3 lg:py-4 px-2 lg:px-4 text-gray-600 font-bold text-xs lg:text-sm uppercase tracking-wide">Total</th>
                <th className="text-left py-3 lg:py-4 px-2 lg:px-4 text-gray-600 font-bold text-xs lg:text-sm uppercase tracking-wide">Status</th>
                <th className="text-left py-3 lg:py-4 px-2 lg:px-4 text-gray-600 font-bold text-xs lg:text-sm uppercase tracking-wide">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentOrders?.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12">
                    <FiShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No orders yet</p>
                  </td>
                </tr>
              ) : (
                stats?.recentOrders?.map(order => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 lg:py-4 px-2 lg:px-4">
                      <span className="font-bold text-gray-900 text-sm lg:text-base">#{order.id}</span>
                    </td>
                    <td className="py-3 lg:py-4 px-2 lg:px-4">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm lg:text-base">{order.user_name}</p>
                        <p className="text-xs lg:text-sm text-gray-500">{order.user_email}</p>
                      </div>
                    </td>
                    <td className="py-3 lg:py-4 px-2 lg:px-4">
                      <span className="font-black text-gray-900 text-sm lg:text-base">LE {parseFloat(order.total_price).toLocaleString()}</span>
                    </td>
                    <td className="py-3 lg:py-4 px-2 lg:px-4">
                      <span className={`px-2 py-1 lg:px-4 lg:py-2 rounded-full text-xs font-bold uppercase tracking-wide ${
                        order.status === 'completed' ? 'bg-green-100 text-green-700' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 lg:py-4 px-2 lg:px-4 text-gray-600 font-medium text-sm lg:text-base">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
