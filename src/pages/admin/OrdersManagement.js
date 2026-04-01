import React, { useEffect, useState } from 'react';
import { FiPackage } from 'react-icons/fi';
import api from '../../utils/api';

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
      pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500',
      shipped: 'bg-blue-500/20 text-blue-500 border-blue-500',
      completed: 'bg-green-500/20 text-green-500 border-green-500',
      canceled: 'bg-red-500/20 text-red-500 border-red-500'
    };
    return colors[status] || colors.pending;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="flex items-center mb-8">
        <FiPackage size={32} className="mr-3 text-accent" />
        <h1 className="font-serif text-4xl font-bold">Orders Management</h1>
      </div>

      <div className="bg-secondary rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Order ID</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Customer</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Email</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Phone</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Total</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Status</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Date</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                  <td className="py-4 px-4 font-semibold">#{order.id}</td>
                  <td className="py-4 px-4">{order.user_name}</td>
                  <td className="py-4 px-4 text-gray-400 text-sm">{order.user_email}</td>
                  <td className="py-4 px-4 text-gray-400 text-sm">{order.user_phone || 'N/A'}</td>
                  <td className="py-4 px-4 font-semibold text-accent">${parseFloat(order.total_price).toFixed(2)}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                      {order.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-400 text-sm">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      className="bg-primary border border-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
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
      </div>
    </div>
  );
};

export default OrdersManagement;
