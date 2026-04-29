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
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-blue-500/30" style={{
            boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)'
          }}>
            <FiUsers className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="font-serif text-3xl lg:text-4xl font-black text-white" style={{
              textShadow: '0 0 40px rgba(59, 130, 246, 0.4)'
            }}>Users Management</h1>
            <p className="text-white/70 mt-1">Manage registered users and their information</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-xl border border-green-500/30 rounded-xl px-4 py-2 shadow-sm" style={{
          boxShadow: '0 0 20px rgba(34, 197, 94, 0.2)'
        }}>
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{
            boxShadow: '0 0 10px rgba(34, 197, 94, 0.6)'
          }}></div>
          <span className="text-sm font-medium text-green-400">{users.length} Total Users</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-xl p-6 border border-blue-500/20 shadow-lg relative overflow-hidden" style={{
        boxShadow: '0 20px 60px rgba(59, 130, 246, 0.2)'
      }}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-blue-400" />
          </div>
          <input
            type="text"
            placeholder="Search users by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/50 backdrop-blur-md border-2 border-blue-500/30 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-white placeholder-white/40 hover:border-blue-500/50"
            style={{
              textShadow: '0 0 10px rgba(59, 130, 246, 0.3)'
            }}
          />
        </div>
      </div>

      {/* Users Grid/Table */}
      <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-xl border border-blue-500/20 shadow-lg overflow-hidden relative" style={{
        boxShadow: '0 20px 60px rgba(59, 130, 246, 0.2)'
      }}>
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-2xl"></div>
        
        {/* Mobile Cards View */}
        <div className="block lg:hidden relative z-10">
          <div className="p-4 border-b border-blue-500/20 bg-gradient-to-r from-gray-800/50 to-black/50 backdrop-blur-sm">
            <h3 className="font-semibold text-white">Users ({filteredUsers.length})</h3>
          </div>
          <div className="divide-y divide-white/5">
            {filteredUsers.map(user => (
              <div key={user.id} className="p-4 space-y-4 hover:bg-white/5 transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs font-bold text-white/50 bg-gradient-to-r from-blue-500/20 to-blue-600/20 backdrop-blur-sm px-2 py-1 rounded-full border border-blue-500/30">
                        #{user.id}
                      </span>
                      <h4 className="font-bold text-white">{user.name}</h4>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-white/70">
                        <FiMail className="w-4 h-4" />
                        <span>{user.email}</span>
                      </div>
                      
                      {user.phone && (
                        <div className="flex items-center space-x-2 text-sm text-white/70">
                          <FiPhone className="w-4 h-4" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                      
                      {user.address && (
                        <div className="flex items-center space-x-2 text-sm text-white/70">
                          <FiMapPin className="w-4 h-4" />
                          <span className="truncate">{user.address}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2 text-sm text-white/70">
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
                    className="w-10 h-10 bg-gradient-to-br from-red-500/20 to-red-600/20 text-red-400 rounded-lg hover:from-red-500/30 hover:to-red-600/30 transition-all duration-300 flex items-center justify-center border border-red-500/30"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto relative z-10">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-800/50 to-black/50 backdrop-blur-sm border-b border-blue-500/20">
              <tr>
                <th className="text-left py-4 px-6 text-blue-400 font-bold text-sm uppercase tracking-wide">ID</th>
                <th className="text-left py-4 px-6 text-blue-400 font-bold text-sm uppercase tracking-wide">User</th>
                <th className="text-left py-4 px-6 text-blue-400 font-bold text-sm uppercase tracking-wide">Contact</th>
                <th className="text-left py-4 px-6 text-blue-400 font-bold text-sm uppercase tracking-wide">Address</th>
                <th className="text-left py-4 px-6 text-blue-400 font-bold text-sm uppercase tracking-wide">Joined</th>
                <th className="text-left py-4 px-6 text-blue-400 font-bold text-sm uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-white/5 transition-all duration-300 group">
                  <td className="py-4 px-6">
                    <span className="font-bold text-white">#{user.id}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-semibold text-white">{user.name}</p>
                      <p className="text-sm text-white/50">{user.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm text-white/70">
                        <FiMail className="w-4 h-4" />
                        <span>{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center space-x-2 text-sm text-white/70">
                          <FiPhone className="w-4 h-4" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {user.address ? (
                      <div className="flex items-center space-x-2 text-sm text-white/70">
                        <FiMapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="max-w-xs truncate">{user.address}</span>
                      </div>
                    ) : (
                      <span className="text-white/30 text-sm">No address</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2 text-sm text-white/70">
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
                      className="w-8 h-8 bg-gradient-to-br from-red-500/20 to-red-600/20 text-red-400 rounded-lg hover:from-red-500/30 hover:to-red-600/30 transition-all duration-300 flex items-center justify-center border border-red-500/30 hover:scale-110 transform"
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
          <div className="text-center py-12 relative z-10">
            <FiUsers className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No users found</h3>
            <p className="text-white/50">
              {searchTerm ? 'Try adjusting your search terms' : 'No users have registered yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersManagement;