import React, { useEffect, useState } from 'react';
import { FiUsers, FiTrash2, FiSearch, FiMail, FiPhone, FiMapPin, FiCalendar } from 'react-icons/fi';
import api from '../../utils/api';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.phone && user.phone.includes(searchTerm))
  );

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
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <FiUsers className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="font-serif text-3xl lg:text-4xl font-black text-gray-900">Users Management</h1>
            <p className="text-gray-600 mt-1">Manage registered users and their information</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700">{users.length} Total Users</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Users Grid/Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
        {/* Mobile Cards View */}
        <div className="block lg:hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-900">Users ({filteredUsers.length})</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredUsers.map(user => (
              <div key={user.id} className="p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        #{user.id}
                      </span>
                      <h4 className="font-bold text-gray-900">{user.name}</h4>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <FiMail className="w-4 h-4" />
                        <span>{user.email}</span>
                      </div>
                      
                      {user.phone && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <FiPhone className="w-4 h-4" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                      
                      {user.address && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <FiMapPin className="w-4 h-4" />
                          <span className="truncate">{user.address}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <FiCalendar className="w-4 h-4" />
                        <span>Joined {new Date(user.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="w-10 h-10 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center"
                  >
                    <FiTrash2 size={16} />
                  </button>
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
                <th className="text-left py-4 px-6 text-gray-700 font-bold text-sm uppercase tracking-wide">ID</th>
                <th className="text-left py-4 px-6 text-gray-700 font-bold text-sm uppercase tracking-wide">User</th>
                <th className="text-left py-4 px-6 text-gray-700 font-bold text-sm uppercase tracking-wide">Contact</th>
                <th className="text-left py-4 px-6 text-gray-700 font-bold text-sm uppercase tracking-wide">Address</th>
                <th className="text-left py-4 px-6 text-gray-700 font-bold text-sm uppercase tracking-wide">Joined</th>
                <th className="text-left py-4 px-6 text-gray-700 font-bold text-sm uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="font-bold text-gray-900">#{user.id}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <FiMail className="w-4 h-4" />
                        <span>{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <FiPhone className="w-4 h-4" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {user.address ? (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <FiMapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="max-w-xs truncate">{user.address}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">No address</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <FiCalendar className="w-4 h-4" />
                      <span>{new Date(user.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="w-8 h-8 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <FiUsers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search terms' : 'No users have registered yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersManagement;