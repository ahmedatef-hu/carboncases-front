import React, { useEffect, useState } from 'react';
import { FiDollarSign, FiShoppingBag, FiUsers, FiTrendingUp, FiArrowUp, FiArrowDown, FiEye, FiPackage } from 'react-icons/fi';
import api from '../../utils/api';

const DashboardHome = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      console.log('📊 Fetching dashboard stats...');
      const response = await api.get('/admin/stats');
      console.log('✅ Stats received:', response.data);
      setStats(response.data);
    } catch (error) {
      console.error('❌ Error fetching stats:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      
      // Set empty stats to show "No data" messages
      setStats({
        totalSales: 0,
        totalOrders: 0,
        totalUsers: 0,
        topProducts: [],
        recentOrders: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" style={{
          boxShadow: '0 0 30px rgba(255, 107, 53, 0.4)'
        }}></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Sales',
      value: `LE ${parseFloat(stats?.totalSales || 0).toLocaleString()}`,
      icon: FiDollarSign,
      color: 'text-emerald-400',
      bgColor: 'from-emerald-500/20 to-emerald-600/20',
      borderColor: 'border-emerald-500/30',
      glowColor: 'rgba(16, 185, 129, 0.3)',
      change: '+12.5%',
      changeType: 'up'
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: FiShoppingBag,
      color: 'text-blue-400',
      bgColor: 'from-blue-500/20 to-blue-600/20',
      borderColor: 'border-blue-500/30',
      glowColor: 'rgba(59, 130, 246, 0.3)',
      change: '+8.2%',
      changeType: 'up'
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: FiUsers,
      color: 'text-purple-400',
      bgColor: 'from-purple-500/20 to-purple-600/20',
      borderColor: 'border-purple-500/30',
      glowColor: 'rgba(168, 85, 247, 0.3)',
      change: '+15.3%',
      changeType: 'up'
    }
  ];

  return (
    <div className="space-y-2 sm:space-y-4 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
        <div>
          <h1 className="font-serif text-sm sm:text-base lg:text-4xl font-black text-white mb-0.5" style={{
            textShadow: '0 0 40px rgba(255, 107, 53, 0.4)'
          }}>Dashboard</h1>
          <p className="text-white/70 text-xs lg:text-lg hidden sm:block">Welcome back! Here's what's happening with your store today.</p>
          <p className="text-white/70 text-xs sm:hidden">Overview</p>
        </div>
        <div className="flex items-center space-x-1 bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-xl border border-green-500/30 rounded-md px-1.5 py-0.5 sm:py-1 shadow-sm self-start" style={{
          boxShadow: '0 0 20px rgba(34, 197, 94, 0.2)'
        }}>
          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-500 rounded-full animate-pulse" style={{
            boxShadow: '0 0 10px rgba(34, 197, 94, 0.6)'
          }}></div>
          <span className="text-xs font-medium text-green-400">Live</span>
        </div>
      </div>

      {/* Stats Grid - Mobile: Vertical Layout, Desktop: Grid */}
      <div className="space-y-2 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-3 lg:gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const ChangeIcon = stat.changeType === 'up' ? FiArrowUp : FiArrowDown;
          return (
            <div key={index} className={`bg-gradient-to-br ${stat.bgColor} backdrop-blur-xl rounded-lg sm:rounded-lg lg:rounded-2xl p-3 sm:p-3 lg:p-6 border ${stat.borderColor} hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group`}
              style={{
                boxShadow: `0 10px 40px ${stat.glowColor}`
              }}
            >
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              
              {/* Mobile: Horizontal Layout */}
              <div className="flex sm:block items-center sm:items-start relative z-10">
                <div className="flex items-center gap-2 flex-1 sm:flex-none sm:justify-between sm:mb-2 lg:mb-4">
                  <div className={`bg-gradient-to-br ${stat.bgColor} backdrop-blur-sm p-2 sm:p-2 lg:p-4 rounded-md sm:rounded-md lg:rounded-xl border ${stat.borderColor}`}>
                    <Icon className={`${stat.color} w-5 h-5 sm:w-4 sm:h-4 lg:w-7 lg:h-7`} />
                  </div>
                  <div className="flex-1 sm:flex-none ml-2 sm:ml-0">
                    <h3 className="text-white/60 text-xs sm:text-xs font-semibold uppercase tracking-wide mb-1 sm:hidden">{stat.title}</h3>
                    <p className="text-xl sm:text-base lg:text-3xl font-black text-white sm:hidden" style={{
                      textShadow: `0 0 20px ${stat.glowColor}`
                    }}>{stat.value}</p>
                  </div>
                  <div className={`flex items-center gap-1 px-2 sm:px-1.5 lg:px-3 py-1 sm:py-0.5 lg:py-1 rounded-full text-xs font-semibold ${
                    stat.changeType === 'up' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    <ChangeIcon className="w-3 h-3 sm:w-2.5 sm:h-2.5 lg:w-3.5 lg:h-3.5" />
                    <span className="text-xs">{stat.change}</span>
                  </div>
                </div>
                
                {/* Desktop: Vertical Layout */}
                <div className="hidden sm:block">
                  <h3 className="text-white/60 text-xs font-semibold uppercase tracking-wide mb-1">{stat.title}</h3>
                  <p className="text-base lg:text-3xl font-black text-white" style={{
                    textShadow: `0 0 20px ${stat.glowColor}`
                  }}>{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Top Selling Products - Mobile: Card Layout, Desktop: List */}
      <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-lg sm:rounded-lg lg:rounded-2xl p-3 sm:p-4 lg:p-8 border border-orange-500/20 shadow-lg relative overflow-hidden" style={{
          boxShadow: '0 20px 60px rgba(255, 107, 53, 0.2)'
        }}>
          {/* Background Effects */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-2xl"></div>
          
          <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-8 relative z-10">
            <h2 className="font-serif text-sm sm:text-base lg:text-2xl font-black text-white flex items-center">
              <div className="w-7 h-7 sm:w-6 sm:h-6 lg:w-10 lg:h-10 bg-gradient-to-br from-orange-500/20 to-red-600/20 backdrop-blur-sm rounded-md sm:rounded-md lg:rounded-xl flex items-center justify-center mr-2 sm:mr-1 border border-orange-500/30">
                <FiTrendingUp className="text-orange-400 w-4 h-4 sm:w-3.5 sm:h-3.5 lg:w-5 lg:h-5" />
              </div>
              <span style={{textShadow: '0 0 20px rgba(255, 107, 53, 0.3)'}}>Top Products</span>
            </h2>
            <button className="flex items-center space-x-1 text-white/60 hover:text-white transition-colors group">
              <FiEye className="w-3.5 h-3.5 sm:w-3 sm:h-3 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium">All</span>
            </button>
          </div>
          
          {/* Mobile: Card Grid */}
          <div className="grid grid-cols-1 gap-2 sm:hidden relative z-10">
            {stats?.topProducts?.length === 0 ? (
              <div className="text-center py-8">
                <FiPackage className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/50 font-medium text-sm">No sales data available yet</p>
              </div>
            ) : (
              stats?.topProducts?.map((product, index) => (
                <div key={product.id} className="bg-gradient-to-r from-gray-800/50 to-black/50 backdrop-blur-sm rounded-lg p-3 border border-white/5 hover:border-white/10 transition-all duration-300">
                  <div className="flex items-start gap-3">
                    <div className="relative flex-shrink-0">
                      <img src={product.image_url} alt={product.name} className="w-16 h-16 object-cover rounded-lg border border-orange-500/20" />
                      <div className="absolute -top-1 -left-1 w-5 h-5 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-md flex items-center justify-center font-bold text-xs" style={{
                        boxShadow: '0 4px 12px rgba(255, 107, 53, 0.4)'
                      }}>
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white text-sm mb-1 line-clamp-2">{product.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/60">{product.total_sold} sold</span>
                        <span className="font-black text-sm text-white" style={{textShadow: '0 0 15px rgba(255, 107, 53, 0.3)'}}>LE {parseFloat(product.revenue).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Desktop: List View */}
          <div className="hidden sm:block space-y-1.5 lg:space-y-4 relative z-10">
            {stats?.topProducts?.length === 0 ? (
              <div className="text-center py-8 lg:py-12">
                <FiPackage className="w-12 h-12 lg:w-16 lg:h-16 text-white/20 mx-auto mb-3 lg:mb-4" />
                <p className="text-white/50 font-medium text-sm lg:text-base">No sales data available yet</p>
              </div>
            ) : (
              stats?.topProducts?.map((product, index) => (
                <div key={product.id} className="flex items-center gap-1 lg:gap-4 p-1.5 lg:p-4 bg-gradient-to-r from-gray-800/50 to-black/50 backdrop-blur-sm rounded-md lg:rounded-xl hover:from-gray-800/70 hover:to-black/70 transition-all duration-300 border border-white/5 group">
                  <div className="flex-shrink-0 w-5 h-5 lg:w-12 lg:h-12 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-sm lg:rounded-xl flex items-center justify-center font-bold text-xs lg:text-lg group-hover:scale-110 transition-transform" style={{
                    boxShadow: '0 8px 20px rgba(255, 107, 53, 0.3)'
                  }}>
                    {index + 1}
                  </div>
                  <img src={product.image_url} alt={product.name} className="w-8 h-8 lg:w-16 lg:h-16 object-cover rounded-sm lg:rounded-xl border border-orange-500/20 group-hover:border-orange-500/40 transition-colors flex-shrink-0" />
                  <div className="flex-grow min-w-0 px-0.5">
                    <h3 className="font-bold text-white text-xs lg:text-base truncate">{product.name}</h3>
                    <p className="text-xs text-white/60 font-medium">{product.total_sold} sold</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-black text-xs lg:text-xl text-white whitespace-nowrap" style={{textShadow: '0 0 15px rgba(255, 107, 53, 0.3)'}}>LE {parseFloat(product.revenue).toLocaleString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      {/* Recent Orders */}
      <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-md sm:rounded-lg lg:rounded-2xl p-1.5 sm:p-4 lg:p-8 border border-blue-500/20 shadow-lg relative overflow-hidden" style={{
        boxShadow: '0 20px 60px rgba(59, 130, 246, 0.2)'
      }}>
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-2xl"></div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1.5 sm:mb-4 lg:mb-8 space-y-1 sm:space-y-0 relative z-10">
          <h2 className="font-serif text-xs sm:text-base lg:text-2xl font-black text-white flex items-center">
            <div className="w-4 h-4 sm:w-6 sm:h-6 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-sm sm:rounded-md lg:rounded-xl flex items-center justify-center mr-1 border border-blue-500/30">
              <FiShoppingBag className="text-blue-400 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 lg:w-5 lg:h-5" />
            </div>
            <span style={{textShadow: '0 0 20px rgba(59, 130, 246, 0.3)'}}>Orders</span>
          </h2>
          <button className="flex items-center space-x-0.5 sm:space-x-1 text-white/60 hover:text-white transition-colors self-start group">
            <FiEye className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium">All</span>
          </button>
        </div>
        
        {/* Mobile Cards View */}
        <div className="block sm:hidden space-y-1.5 relative z-10">
          {stats?.recentOrders?.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <FiShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 text-white/20 mx-auto mb-3 sm:mb-4" />
              <p className="text-white/50 font-medium text-sm">No orders yet</p>
            </div>
          ) : (
            stats?.recentOrders?.map(order => (
              <div key={order.id} className="bg-gradient-to-r from-gray-800/50 to-black/50 backdrop-blur-sm rounded-lg p-3 border border-white/5 hover:border-white/10 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white text-sm">#{order.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                    order.status === 'completed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    order.status === 'shipped' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                    order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                    'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div>
                    <p className="font-semibold text-white text-xs">{order.user_name}</p>
                    <p className="text-xs text-white/50 truncate">{order.user_email}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-black text-white text-sm" style={{textShadow: '0 0 15px rgba(255, 107, 53, 0.3)'}}>LE {parseFloat(order.total_amount || order.total_price || 0).toLocaleString()}</span>
                    <span className="text-xs text-white/60 font-medium">
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
        <div className="hidden sm:block overflow-x-auto relative z-10">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-white/10">
                <th className="text-left py-3 lg:py-4 px-2 lg:px-4 text-white/60 font-bold text-xs lg:text-sm uppercase tracking-wide">Order ID</th>
                <th className="text-left py-3 lg:py-4 px-2 lg:px-4 text-white/60 font-bold text-xs lg:text-sm uppercase tracking-wide">Customer</th>
                <th className="text-left py-3 lg:py-4 px-2 lg:px-4 text-white/60 font-bold text-xs lg:text-sm uppercase tracking-wide">Total</th>
                <th className="text-left py-3 lg:py-4 px-2 lg:px-4 text-white/60 font-bold text-xs lg:text-sm uppercase tracking-wide">Status</th>
                <th className="text-left py-3 lg:py-4 px-2 lg:px-4 text-white/60 font-bold text-xs lg:text-sm uppercase tracking-wide">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentOrders?.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12">
                    <FiShoppingBag className="w-16 h-16 text-white/20 mx-auto mb-4" />
                    <p className="text-white/50 font-medium">No orders yet</p>
                  </td>
                </tr>
              ) : (
                stats?.recentOrders?.map(order => (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 lg:py-4 px-2 lg:px-4">
                      <span className="font-bold text-white text-sm lg:text-base">#{order.id}</span>
                    </td>
                    <td className="py-3 lg:py-4 px-2 lg:px-4">
                      <div>
                        <p className="font-semibold text-white text-sm lg:text-base">{order.user_name}</p>
                        <p className="text-xs lg:text-sm text-white/50">{order.user_email}</p>
                      </div>
                    </td>
                    <td className="py-3 lg:py-4 px-2 lg:px-4">
                      <span className="font-black text-white text-sm lg:text-base" style={{textShadow: '0 0 15px rgba(255, 107, 53, 0.3)'}}>LE {parseFloat(order.total_amount || order.total_price || 0).toLocaleString()}</span>
                    </td>
                    <td className="py-3 lg:py-4 px-2 lg:px-4">
                      <span className={`px-2 py-1 lg:px-4 lg:py-2 rounded-full text-xs font-bold uppercase tracking-wide ${
                        order.status === 'completed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                        order.status === 'shipped' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                        'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 lg:py-4 px-2 lg:px-4 text-white/60 font-medium text-sm lg:text-base">
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
