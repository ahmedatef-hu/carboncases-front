import React, { useEffect, useState } from 'react';
import { FiShoppingBag, FiSearch, FiUser, FiMail, FiPhone, FiCalendar, FiDollarSign, FiFilter, FiX, FiMapPin, FiPackage } from 'react-icons/fi';
import api from '../../utils/api';

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

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
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status');
    }
  };

  const fetchOrderDetails = async (orderId) => {
    setLoadingDetails(true);
    try {
      const response = await api.get(`/orders/${orderId}`);
      setOrderDetails(response.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
      alert('Failed to load order details');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    fetchOrderDetails(order.id);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setOrderDetails(null);
  };

  const parseShippingAddress = (address) => {
    if (!address) return {};
    const parts = address.split(',').map(p => p.trim());
    return {
      fullName: parts[0] || '',
      address: parts[1] || '',
      city: parts[2] || '',
      governorate: parts[3] || '',
      phone: parts[4] ? parts[4].replace('Phone:', '').trim() : ''
    };
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      shipped: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      completed: 'bg-green-500/20 text-green-400 border-green-500/30',
      canceled: 'bg-red-500/20 text-red-400 border-red-500/30'
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
      totalRevenue: orders.reduce((sum, order) => sum + parseFloat(order.total_amount || order.total_price || 0), 0)
    };
    return stats;
  };

  const stats = getOrderStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" style={{
          boxShadow: '0 0 30px rgba(255, 107, 53, 0.4)'
        }}></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-purple-500/30" style={{
            boxShadow: '0 10px 30px rgba(168, 85, 247, 0.3)'
          }}>
            <FiShoppingBag className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h1 className="font-serif text-3xl lg:text-4xl font-black text-white" style={{
              textShadow: '0 0 40px rgba(168, 85, 247, 0.4)'
            }}>Orders Management</h1>
            <p className="text-white/70 mt-1">Track and manage customer orders</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-xl border border-green-500/30 rounded-xl px-4 py-2 shadow-sm" style={{
          boxShadow: '0 0 20px rgba(34, 197, 94, 0.2)'
        }}>
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{
            boxShadow: '0 0 10px rgba(34, 197, 94, 0.6)'
          }}></div>
          <span className="text-sm font-medium text-green-400">{orders.length} Total Orders</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-xl p-4 border border-white/10 shadow-lg relative overflow-hidden group hover:border-white/20 transition-all duration-300" style={{
          boxShadow: '0 10px 30px rgba(255, 255, 255, 0.05)'
        }}>
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex items-center space-x-3 relative z-10">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-800/80 to-black/80 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/10">
              <FiShoppingBag className="w-5 h-5 text-white/70" />
            </div>
            <div>
              <p className="text-2xl font-black text-white" style={{textShadow: '0 0 20px rgba(255, 255, 255, 0.3)'}}>{stats.total}</p>
              <p className="text-xs font-semibold text-white/50 uppercase tracking-wide">Total</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 backdrop-blur-xl rounded-xl p-4 border border-yellow-500/30 shadow-lg relative overflow-hidden group hover:border-yellow-500/50 transition-all duration-300" style={{
          boxShadow: '0 10px 30px rgba(234, 179, 8, 0.2)'
        }}>
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex items-center space-x-3 relative z-10">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-yellow-500/30">
              <FiShoppingBag className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-black text-white" style={{textShadow: '0 0 20px rgba(234, 179, 8, 0.3)'}}>{stats.pending}</p>
              <p className="text-xs font-semibold text-yellow-400/70 uppercase tracking-wide">Pending</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-xl rounded-xl p-4 border border-blue-500/30 shadow-lg relative overflow-hidden group hover:border-blue-500/50 transition-all duration-300" style={{
          boxShadow: '0 10px 30px rgba(59, 130, 246, 0.2)'
        }}>
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex items-center space-x-3 relative z-10">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-blue-500/30">
              <FiShoppingBag className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-black text-white" style={{textShadow: '0 0 20px rgba(59, 130, 246, 0.3)'}}>{stats.shipped}</p>
              <p className="text-xs font-semibold text-blue-400/70 uppercase tracking-wide">Shipped</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 backdrop-blur-xl rounded-xl p-4 border border-green-500/30 shadow-lg relative overflow-hidden group hover:border-green-500/50 transition-all duration-300" style={{
          boxShadow: '0 10px 30px rgba(34, 197, 94, 0.2)'
        }}>
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex items-center space-x-3 relative z-10">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-green-500/30">
              <FiShoppingBag className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-black text-white" style={{textShadow: '0 0 20px rgba(34, 197, 94, 0.3)'}}>{stats.completed}</p>
              <p className="text-xs font-semibold text-green-400/70 uppercase tracking-wide">Completed</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500/10 to-red-600/10 backdrop-blur-xl rounded-xl p-4 border border-orange-500/30 shadow-lg col-span-2 lg:col-span-1 relative overflow-hidden group hover:border-orange-500/50 transition-all duration-300" style={{
          boxShadow: '0 10px 30px rgba(255, 107, 53, 0.2)'
        }}>
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex items-center space-x-3 relative z-10">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500/20 to-red-600/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-orange-500/30">
              <FiDollarSign className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-black text-white" style={{textShadow: '0 0 20px rgba(255, 107, 53, 0.3)'}}>LE {stats.totalRevenue.toLocaleString()}</p>
              <p className="text-xs font-semibold text-orange-400/70 uppercase tracking-wide">Revenue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-xl p-6 border border-purple-500/20 shadow-lg relative overflow-hidden" style={{
        boxShadow: '0 20px 60px rgba(168, 85, 247, 0.2)'
      }}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-2xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-purple-400" />
            </div>
            <input
              type="text"
              placeholder="Search by order ID, customer name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/50 backdrop-blur-md border-2 border-purple-500/30 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-white placeholder-white/40 hover:border-purple-500/50"
              style={{
                textShadow: '0 0 10px rgba(168, 85, 247, 0.3)'
              }}
            />
          </div>
          
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiFilter className="h-5 w-5 text-purple-400" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-black/50 backdrop-blur-md border-2 border-purple-500/30 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all appearance-none text-white hover:border-purple-500/50"
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
      <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-xl border border-purple-500/20 shadow-lg overflow-hidden relative" style={{
        boxShadow: '0 20px 60px rgba(168, 85, 247, 0.2)'
      }}>
        {/* Background Effects */}
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-2xl"></div>
        
        {/* Mobile Cards View */}
        <div className="block lg:hidden relative z-10">
          <div className="p-4 border-b border-purple-500/20 bg-gradient-to-r from-gray-800/50 to-black/50 backdrop-blur-sm">
            <h3 className="font-semibold text-white">Orders ({filteredOrders.length})</h3>
          </div>
          <div className="divide-y divide-white/5">
            {filteredOrders.map(order => (
              <div key={order.id} className="p-4 space-y-4 hover:bg-white/5 transition-all duration-300 cursor-pointer" onClick={() => handleOrderClick(order)}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs font-bold text-white/50 bg-gradient-to-r from-purple-500/20 to-purple-600/20 backdrop-blur-sm px-2 py-1 rounded-full border border-purple-500/30">
                        #{order.id}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <FiUser className="w-4 h-4 text-white/50" />
                        <span className="font-semibold text-white">{order.user_name}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-white/70">
                        <FiMail className="w-4 h-4" />
                        <span>{order.user_email}</span>
                      </div>
                      
                      {order.user_phone && (
                        <div className="flex items-center space-x-2 text-sm text-white/70">
                          <FiPhone className="w-4 h-4" />
                          <span>{order.user_phone}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2 text-sm text-white/70">
                        <FiCalendar className="w-4 h-4" />
                        <span>{new Date(order.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <FiDollarSign className="w-4 h-4 text-white/50" />
                        <span className="font-black text-lg text-white" style={{textShadow: '0 0 15px rgba(255, 107, 53, 0.3)'}}>LE {parseFloat(order.total_amount || order.total_price || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div onClick={(e) => e.stopPropagation()}>
                  <label className="text-xs font-semibold text-purple-400 uppercase tracking-wide mb-2 block">Update Status</label>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                    className="w-full bg-black/50 backdrop-blur-md border-2 border-purple-500/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white"
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
        <div className="hidden lg:block overflow-x-auto relative z-10">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-800/50 to-black/50 backdrop-blur-sm border-b border-purple-500/20">
              <tr>
                <th className="text-left py-4 px-6 text-purple-400 font-bold text-sm uppercase tracking-wide">Order ID</th>
                <th className="text-left py-4 px-6 text-purple-400 font-bold text-sm uppercase tracking-wide">Customer</th>
                <th className="text-left py-4 px-6 text-purple-400 font-bold text-sm uppercase tracking-wide">Contact</th>
                <th className="text-left py-4 px-6 text-purple-400 font-bold text-sm uppercase tracking-wide">Total</th>
                <th className="text-left py-4 px-6 text-purple-400 font-bold text-sm uppercase tracking-wide">Status</th>
                <th className="text-left py-4 px-6 text-purple-400 font-bold text-sm uppercase tracking-wide">Date</th>
                <th className="text-left py-4 px-6 text-purple-400 font-bold text-sm uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-white/5 transition-all duration-300 cursor-pointer" onClick={() => handleOrderClick(order)}>
                  <td className="py-4 px-6">
                    <span className="font-bold text-white">#{order.id}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <FiUser className="w-4 h-4 text-white/50" />
                      <span className="font-semibold text-white">{order.user_name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm text-white/70">
                        <FiMail className="w-4 h-4" />
                        <span>{order.user_email}</span>
                      </div>
                      {order.user_phone && (
                        <div className="flex items-center space-x-2 text-sm text-white/70">
                          <FiPhone className="w-4 h-4" />
                          <span>{order.user_phone}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-black text-white" style={{textShadow: '0 0 15px rgba(255, 107, 53, 0.3)'}}>LE {parseFloat(order.total_amount || order.total_price || 0).toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2 text-sm text-white/70">
                      <FiCalendar className="w-4 h-4" />
                      <span>{new Date(order.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      className="bg-black/50 backdrop-blur-md border-2 border-purple-500/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white hover:border-purple-500/50 transition-all"
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
          <div className="text-center py-12 relative z-10">
            <FiShoppingBag className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No orders found</h3>
            <p className="text-white/50">
              {searchTerm || statusFilter ? 'Try adjusting your search or filter' : 'No orders have been placed yet'}
            </p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={closeModal}>
          <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-purple-500/30 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative" 
            onClick={(e) => e.stopPropagation()}
            style={{
              boxShadow: '0 30px 80px rgba(168, 85, 247, 0.4)'
            }}>
            
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 w-10 h-10 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-full flex items-center justify-center transition-all z-10"
            >
              <FiX className="w-5 h-5 text-red-400" />
            </button>

            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 border-b border-purple-500/30 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-3xl font-black text-white mb-2" style={{
                    textShadow: '0 0 40px rgba(168, 85, 247, 0.4)'
                  }}>Order Details</h2>
                  <div className="flex items-center space-x-3">
                    <span className="text-white/70">Order ID:</span>
                    <span className="font-bold text-white bg-purple-500/20 px-3 py-1 rounded-full border border-purple-500/30">
                      #{selectedOrder.id}
                    </span>
                    <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white/70 text-sm mb-1">Order Date</p>
                  <p className="text-white font-semibold">{new Date(selectedOrder.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                </div>
              </div>
            </div>

            {loadingDetails ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {/* Customer Information */}
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-xl p-6">
                  <h3 className="font-serif text-xl font-bold text-white mb-4 flex items-center">
                    <FiUser className="mr-2 text-blue-400" />
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-white/50 text-sm mb-1">Name</p>
                      <p className="text-white font-semibold">{selectedOrder.user_name}</p>
                    </div>
                    <div>
                      <p className="text-white/50 text-sm mb-1">Email</p>
                      <p className="text-white font-semibold flex items-center">
                        <FiMail className="mr-2 w-4 h-4 text-blue-400" />
                        {selectedOrder.user_email}
                      </p>
                    </div>
                    {selectedOrder.user_phone && (
                      <div>
                        <p className="text-white/50 text-sm mb-1">Phone</p>
                        <p className="text-white font-semibold flex items-center">
                          <FiPhone className="mr-2 w-4 h-4 text-blue-400" />
                          {selectedOrder.user_phone}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Shipping Address */}
                {selectedOrder.shipping_address && (
                  <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/30 rounded-xl p-6">
                    <h3 className="font-serif text-xl font-bold text-white mb-4 flex items-center">
                      <FiMapPin className="mr-2 text-green-400" />
                      Shipping Address
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(() => {
                        const addr = parseShippingAddress(selectedOrder.shipping_address);
                        return (
                          <>
                            {addr.fullName && (
                              <div>
                                <p className="text-white/50 text-sm mb-1">Full Name</p>
                                <p className="text-white font-semibold">{addr.fullName}</p>
                              </div>
                            )}
                            {addr.address && (
                              <div>
                                <p className="text-white/50 text-sm mb-1">Address</p>
                                <p className="text-white font-semibold">{addr.address}</p>
                              </div>
                            )}
                            {addr.city && (
                              <div>
                                <p className="text-white/50 text-sm mb-1">City</p>
                                <p className="text-white font-semibold">{addr.city}</p>
                              </div>
                            )}
                            {addr.governorate && (
                              <div>
                                <p className="text-white/50 text-sm mb-1">Governorate</p>
                                <p className="text-white font-semibold">{addr.governorate}</p>
                              </div>
                            )}
                            {addr.phone && (
                              <div>
                                <p className="text-white/50 text-sm mb-1">Phone</p>
                                <p className="text-white font-semibold">{addr.phone}</p>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* Order Items */}
                {orderDetails && orderDetails.items && (
                  <div className="bg-gradient-to-br from-orange-500/10 to-red-600/10 border border-orange-500/30 rounded-xl p-6">
                    <h3 className="font-serif text-xl font-bold text-white mb-4 flex items-center">
                      <FiPackage className="mr-2 text-orange-400" />
                      Order Items
                    </h3>
                    <div className="space-y-4">
                      {orderDetails.items.map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-4 bg-black/30 rounded-lg p-4 border border-white/10">
                          <img 
                            src={item.image_url} 
                            alt={item.product_name} 
                            className="w-20 h-20 object-cover rounded-lg border border-orange-500/30"
                          />
                          <div className="flex-grow">
                            <p className="font-semibold text-white text-lg">{item.product_name}</p>
                            {item.variant && (
                              <div className="mt-1 mb-2">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                                  item.variant === 'with_magsafe' 
                                    ? 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-400 border border-blue-500/30' 
                                    : 'bg-gradient-to-r from-gray-700/20 to-gray-800/20 text-gray-400 border border-gray-600/30'
                                }`}>
                                  {item.variant === 'with_magsafe' ? '⚡ With MagSafe' : 'Without MagSafe'}
                                </span>
                              </div>
                            )}
                            {(item.selected_color || item.selected_model) && (
                              <div className="mt-2 space-y-1">
                                {item.selected_color && (
                                  <p className="text-white/70 text-sm">
                                    <span className="text-orange-400">Color:</span> {item.selected_color}
                                  </p>
                                )}
                                {item.selected_model && (
                                  <p className="text-white/70 text-sm">
                                    <span className="text-orange-400">Model:</span> {item.selected_model}
                                  </p>
                                )}
                              </div>
                            )}
                            <p className="text-white/70 text-sm">Quantity: {item.quantity}</p>
                            <p className="text-white/70 text-sm">Price: LE {parseFloat(item.price).toFixed(2)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-orange-400 font-black text-xl" style={{
                              textShadow: '0 0 20px rgba(255, 107, 53, 0.4)'
                            }}>
                              LE {(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Order Summary */}
                <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-xl p-6">
                  <h3 className="font-serif text-xl font-bold text-white mb-4 flex items-center">
                    <FiDollarSign className="mr-2 text-purple-400" />
                    Order Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-white/70">
                      <span>Subtotal</span>
                      <span>LE {orderDetails && orderDetails.items ? 
                        orderDetails.items.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0).toFixed(2) 
                        : parseFloat(selectedOrder.total_amount || selectedOrder.total_price || 0).toFixed(2)
                      }</span>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="border-t border-purple-500/30 pt-3 flex justify-between">
                      <span className="text-xl font-bold text-white">Total</span>
                      <span className="text-2xl font-black text-purple-400" style={{
                        textShadow: '0 0 20px rgba(168, 85, 247, 0.4)'
                      }}>
                        LE {parseFloat(selectedOrder.total_amount || selectedOrder.total_price || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Update Status */}
                <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/30 rounded-xl p-6">
                  <h3 className="font-serif text-xl font-bold text-white mb-4">Update Order Status</h3>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value)}
                    className="w-full bg-black/50 backdrop-blur-md border-2 border-yellow-500/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white text-lg font-semibold"
                  >
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="completed">Completed</option>
                    <option value="canceled">Canceled</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;