import React, { useEffect, useState } from 'react';
import { FiShoppingBag, FiSearch, FiUser, FiMail, FiPhone, FiCalendar, FiDollarSign, FiFilter } from 'react-icons/fi';
import api from '../../utils/api';

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/admin/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}`, { status: newStatus });
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      shipped: 'bg-blue-100 text-blue-700 border-blue-200',
      completed: 'bg-green-100 text-green-700 border-green-200',
      canceled: 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[status] || colors.pending;
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toString().includes(searchTerm) ||
      order.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.user_phone && order.user_phone.includes(searchTerm));
    
    const matchesStatus = statusFilter === '' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      completed: orders.filter(o => o.status === 'completed').length,
      canceled: orders.filter(o => o.status === 'canceled').length,
      totalRevenue: orders.reduce((sum, order) => sum + parseFloat(order.total_price), 0)
    };
    return stats;
  };

  const stats = getOrderStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <FiShoppingBag className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="font-serif text-3xl lg:text-4xl font-black text-gray-900">Orders Management</h1>
            <p className="text-gray-600 mt-1">Track and manage customer orders</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700">{orders.length} Total Orders</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <FiShoppingBag className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{stats.total}</p>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-yellow-200 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FiShoppingBag className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{stats.pending}</p>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pending</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-blue-200 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiShoppingBag className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{stats.shipped}</p>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Shipped</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-green-200 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FiShoppingBag className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{stats.completed}</p>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Completed</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-orange-200 shadow-lg col-span-2 lg:col-span-1">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <FiDollarSign className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">LE {stats.totalRevenue.toLocaleString()}</p>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Revenue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by order ID, customer name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiFilter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all appearance-none"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="shipped">Shipped</option>
              <option value="completed">Completed</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Grid/Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
        {/* Mobile Cards View */}
        <div className="block lg:hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-900">Orders ({filteredOrders.length})</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredOrders.map(order => (
              <div key={order.id} className="p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        #{order.id}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <FiUser className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold text-gray-900">{order.user_name}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <FiMail className="w-4 h-4" />
                        <span>{order.user_email}</span>
                      </div>
                      
                      {order.user_phone && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <FiPhone className="w-4 h-4" />
                          <span>{order.user_phone}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <FiCalendar className="w-4 h-4" />
                        <span>{new Date(order.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <FiDollarSign className="w-4 h-4 text-gray-500" />
                        <span className="font-black text-lg text-gray-900">LE {parseFloat(order.total_price).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Update Status</label>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="completed">Completed</option>
                    <option value="canceled">Canceled</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-gray-700 font-bold text-sm uppercase tracking-wide">Order ID</th>
                <th className="text-left py-4 px-6 text-gray-700 font-bold text-sm uppercase tracking-wide">Customer</th>
                <th className="text-left py-4 px-6 text-gray-700 font-bold text-sm uppercase tracking-wide">Contact</th>
                <th className="text-left py-4 px-6 text-gray-700 font-bold text-sm uppercase tracking-wide">Total</th>
                <th className="text-left py-4 px-6 text-gray-700 font-bold text-sm uppercase tracking-wide">Status</th>
                <th className="text-left py-4 px-6 text-gray-700 font-bold text-sm uppercase tracking-wide">Date</th>
                <th className="text-left py-4 px-6 text-gray-700 font-bold text-sm uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="font-bold text-gray-900">#{order.id}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <FiUser className="w-4 h-4 text-gray-500" />
                      <span className="font-semibold text-gray-900">{order.user_name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <FiMail className="w-4 h-4" />
                        <span>{order.user_email}</span>
                      </div>
                      {order.user_phone && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <FiPhone className="w-4 h-4" />
                          <span>{order.user_phone}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-black text-gray-900">LE {parseFloat(order.total_price).toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <FiCalendar className="w-4 h-4" />
                      <span>{new Date(order.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      className="bg-gray-50 border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="completed">Completed</option>
                      <option value="canceled">Canceled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <FiShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter ? 'Try adjusting your search or filter' : 'No orders have been placed yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersManagement;