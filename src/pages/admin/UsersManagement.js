import React, { useEffect, useState } from 'react';
import { FiUsers, FiTrash2 } from 'react-icons/fi';
import api from '../../utils/api';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This will also delete all their orders.')) {
      return;
    }

    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(users.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
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
        <FiUsers size={32} className="mr-3 text-accent" />
        <h1 className="font-serif text-4xl font-bold">Users Management</h1>
      </div>

      <div className="bg-secondary rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">ID</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Name</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Email</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Phone</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Address</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Joined</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                  <td className="py-4 px-4 font-semibold">#{user.id}</td>
                  <td className="py-4 px-4">{user.name}</td>
                  <td className="py-4 px-4 text-gray-400">{user.email}</td>
                  <td className="py-4 px-4 text-gray-400">{user.phone || 'N/A'}</td>
                  <td className="py-4 px-4 text-gray-400 text-sm max-w-xs truncate">
                    {user.address || 'N/A'}
                  </td>
                  <td className="py-4 px-4 text-gray-400 text-sm">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-500 hover:text-red-400 transition-colors"
                    >
                      <FiTrash2 size={18} />
                    </button>
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

export default UsersManagement;
