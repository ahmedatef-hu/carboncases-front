import React, { useEffect, useState } from 'react';
import { FiDollarSign, FiShoppingBag, FiUsers, FiTrendingUp, FiAlertCircle } from 'react-icons/fi';
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Sales',
      value: `$${parseFloat(stats?.totalSales || 0).toFixed(2)}`,
      icon: FiDollarSign,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: FiShoppingBag,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: FiUsers,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      title: 'Low Stock Items',
      value: stats?.lowStock?.length || 0,
      icon: FiAlertCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10'
    }
  ];

  return (
    <div className="fade-in">
      <h1 className="font-serif text-4xl font-bold mb-8">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-secondary rounded-xl p-6 border border-gray-800 hover:border-accent transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon size={24} className={stat.color} />
                </div>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Selling Products */}
        <div className="bg-secondary rounded-xl p-6 border border-gray-800">
          <h2 className="font-serif text-2xl font-bold mb-6 flex items-center">
            <FiTrendingUp className="mr-2 text-accent" />
            Top Selling Products
          </h2>
          <div className="space-y-4">
            {stats?.topProducts?.map((product, index) => (
              <div key={product.id} className="flex items-center space-x-4 p-4 bg-primary rounded-lg border border-gray-800">
                <div className="flex-shrink-0 w-12 h-12 bg-accent text-primary rounded-lg flex items-center justify-center font-bold">
                  #{index + 1}
                </div>
                <img src={product.image_url} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
                <div className="flex-grow">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-400">{product.total_sold} sold</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-accent">${parseFloat(product.revenue).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-secondary rounded-xl p-6 border border-gray-800">
          <h2 className="font-serif text-2xl font-bold mb-6 flex items-center">
            <FiAlertCircle className="mr-2 text-red-500" />
            Low Stock Alerts
          </h2>
          <div className="space-y-4">
            {stats?.lowStock?.length === 0 ? (
              <p className="text-gray-400 text-center py-8">All products are well stocked</p>
            ) : (
              stats?.lowStock?.map(product => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-primary rounded-lg border border-gray-800">
                  <div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-red-500">Only {product.stock} left</p>
                  </div>
                  <span className="bg-red-500/20 text-red-500 px-3 py-1 rounded-full text-sm font-semibold">
                    Low Stock
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-secondary rounded-xl p-6 border border-gray-800 mt-8">
        <h2 className="font-serif text-2xl font-bold mb-6">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Order ID</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Customer</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Total</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentOrders?.map(order => (
                <tr key={order.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                  <td className="py-3 px-4">#{order.id}</td>
                  <td className="py-3 px-4">{order.user_name}</td>
                  <td className="py-3 px-4 font-semibold">${parseFloat(order.total_price).toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                      order.status === 'shipped' ? 'bg-blue-500/20 text-blue-500' :
                      order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                      'bg-red-500/20 text-red-500'
                    }`}>
                      {order.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-400">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
