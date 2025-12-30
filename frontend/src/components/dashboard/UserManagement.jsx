import React, { useState, useEffect, useCallback } from 'react';
import { userAPI } from '../../services/api.js';
import RoleSelector from './RoleSelector.jsx';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    managers: 0,
    users: 0,
    active: 0,
    suspended: 0
  });

  const { user: currentUser } = useAuth();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await userAPI.getUsers();
      
      if (response.data.success) {
        const usersData = response.data.users || [];
        setUsers(usersData);
        updateStats(usersData);
      } else {
        setError(response.data.msg || 'Failed to fetch users');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.msg || err.message || 'Failed to fetch users';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateStats = (userList) => {
    setStats({
      total: userList.length,
      admins: userList.filter(user => user.role === 'admin').length,
      managers: userList.filter(user => user.role === 'manager').length,
      users: userList.filter(user => user.role === 'user').length,
      active: userList.filter(user => !user.suspended).length,
      suspended: userList.filter(user => user.suspended).length
    });
  };

  const handleRoleChange = async (userId, newRole) => {
    setActionLoading(userId);
    
    try {
      const response = await userAPI.updateUserRole(userId, newRole);
      
      if (response.data.success) {
        // Update local state
        const updatedUsers = users.map(user => 
          user._id === userId ? { ...user, role: newRole } : user
        );
        setUsers(updatedUsers);
        updateStats(updatedUsers);
        
        toast.success(`✅ User role updated to ${newRole}`);
      } else {
        toast.error(response.data.msg || 'Failed to update role');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 'Failed to update role';
      toast.error(errorMsg);
    } finally {
      setActionLoading(null);
    }
  };

  const handleQuickRoleChange = async (userId, newRole) => {
    if (actionLoading) return;
    
    setActionLoading(userId);
    
    try {
      const response = await userAPI.updateUserRole(userId, newRole);
      
      if (response.data.success) {
        const updatedUsers = users.map(user => 
          user._id === userId ? { ...user, role: newRole } : user
        );
        setUsers(updatedUsers);
        updateStats(updatedUsers);
        
        toast.success(`✅ User role changed to ${newRole}`);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 'Failed to update role';
      toast.error(errorMsg);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSuspendUser = async (userId, suspend = true) => {
    setActionLoading(`suspend_${userId}`);
    
    try {
      const response = await userAPI.updateUserStatus(userId, { suspended: suspend });
      
      if (response.data.success) {
        const updatedUsers = users.map(user => 
          user._id === userId ? { ...user, suspended: suspend } : user
        );
        setUsers(updatedUsers);
        updateStats(updatedUsers);
        
        toast.success(`✅ User ${suspend ? 'suspended' : 'activated'} successfully`);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 'Failed to update user status';
      toast.error(errorMsg);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    setActionLoading(`delete_${userId}`);
    
    try {
      const response = await userAPI.deleteUser(userId);
      
      if (response.data.success) {
        const updatedUsers = users.filter(user => user._id !== userId);
        setUsers(updatedUsers);
        updateStats(updatedUsers);
        
        toast.success('✅ User deleted successfully');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 'Failed to delete user';
      toast.error(errorMsg);
    } finally {
      setActionLoading(null);
    }
  };

  // Filter and search users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && !user.suspended) ||
      (statusFilter === 'suspended' && user.suspended);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Bulk actions
  const handleBulkAction = async () => {
    if (!bulkAction || selectedUsers.length === 0) return;

    setActionLoading('bulk');
    
    try {
      let message = '';
      
      switch (bulkAction) {
        case 'make_admin':
          await Promise.all(selectedUsers.map(userId => 
            userAPI.updateUserRole(userId, 'admin')
          ));
          message = 'Selected users promoted to admin';
          break;
        case 'make_manager':
          await Promise.all(selectedUsers.map(userId => 
            userAPI.updateUserRole(userId, 'manager')
          ));
          message = 'Selected users promoted to manager';
          break;
        case 'make_user':
          await Promise.all(selectedUsers.map(userId => 
            userAPI.updateUserRole(userId, 'user')
          ));
          message = 'Selected users set as regular users';
          break;
        case 'suspend':
          await Promise.all(selectedUsers.map(userId => 
            userAPI.updateUserStatus(userId, { suspended: true })
          ));
          message = 'Selected users suspended';
          break;
        case 'activate':
          await Promise.all(selectedUsers.map(userId => 
            userAPI.updateUserStatus(userId, { suspended: false })
          ));
          message = 'Selected users activated';
          break;
        default:
          return;
      }

      // Refresh users
      await fetchUsers();
      setSelectedUsers([]);
      setBulkAction('');
      toast.success(`✅ ${message}`);
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 'Failed to perform bulk action';
      toast.error(`❌ ${errorMsg}`);
    } finally {
      setActionLoading(null);
    }
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    if (selectedUsers.length === currentUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(currentUsers.map(user => user._id));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { color: 'bg-red-100 text-red-800', label: 'Admin' },
      manager: { color: 'bg-yellow-100 text-yellow-800', label: 'Manager' },
      user: { color: 'bg-green-100 text-green-800', label: 'User' }
    };
    
    const config = roleConfig[role] || { color: 'bg-gray-100 text-gray-800', label: role };
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage user roles and permissions across the platform</p>
        </div>
        <button
          onClick={fetchUsers}
          className="mt-4 sm:mt-0 btn-secondary flex items-center"
          disabled={loading}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        </div>
      )}

      {/* Quick Role Actions */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Role Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h4 className="font-medium text-gray-900">Admin Users</h4>
            <p className="text-2xl font-bold text-red-600">{stats.admins}</p>
            <p className="text-sm text-gray-500">Full system access</p>
          </div>

          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h4 className="font-medium text-gray-900">Managers</h4>
            <p className="text-2xl font-bold text-yellow-600">{stats.managers}</p>
            <p className="text-sm text-gray-500">Content moderation</p>
          </div>

          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h4 className="font-medium text-gray-900">Regular Users</h4>
            <p className="text-2xl font-bold text-green-600">{stats.users}</p>
            <p className="text-sm text-gray-500">Standard permissions</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search users by name, email, or role..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="user">User</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <span className="text-sm font-medium text-blue-900">
              {selectedUsers.length} user(s) selected
            </span>
            <div className="flex flex-1 flex-col sm:flex-row gap-2">
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Bulk Actions</option>
                <option value="make_admin">Make Admin</option>
                <option value="make_manager">Make Manager</option>
                <option value="make_user">Make User</option>
                <option value="suspend">Suspend</option>
                <option value="activate">Activate</option>
              </select>
              <button
                onClick={handleBulkAction}
                disabled={!bulkAction || actionLoading === 'bulk'}
                className="btn-primary whitespace-nowrap flex items-center justify-center min-w-[100px]"
              >
                {actionLoading === 'bulk' ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Applying...
                  </>
                ) : (
                  'Apply'
                )}
              </button>
              <button
                onClick={() => setSelectedUsers([])}
                className="btn-secondary whitespace-nowrap"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === currentUsers.length && currentUsers.length > 0}
                    onChange={selectAllUsers}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quick Actions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => toggleUserSelection(user._id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      disabled={user._id === currentUser?.id}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.profilePic?.url ? (
                          <img
                            src={user.profilePic.url}
                            alt={user.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium text-sm">
                              {user.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 flex items-center">
                          {user.name}
                          {user._id === currentUser?._id && (
                            <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        {user.bio && (
                          <div className="text-xs text-gray-400 truncate max-w-xs">
                            {user.bio}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getRoleBadge(user.role)}
                      <RoleSelector
                        currentRole={user.role}
                        onRoleChange={handleRoleChange}
                        userId={user._id}
                        disabled={user._id === currentUser?._id || actionLoading === user._id}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleQuickRoleChange(user._id, 'admin')}
                          disabled={user._id === currentUser?._id || actionLoading === user._id}
                          className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Make Admin
                        </button>
                      )}
                      {user.role !== 'manager' && (
                        <button
                          onClick={() => handleQuickRoleChange(user._id, 'manager')}
                          disabled={user._id === currentUser?._id || actionLoading === user._id}
                          className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Make Manager
                        </button>
                      )}
                      {user.role !== 'user' && (
                        <button
                          onClick={() => handleQuickRoleChange(user._id, 'user')}
                          disabled={user._id === currentUser?._id || actionLoading === user._id}
                          className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Make User
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.suspended 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.suspended ? 'Suspended' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {user.suspended ? (
                        <button
                          onClick={() => handleSuspendUser(user._id, false)}
                          disabled={actionLoading === `suspend_${user._id}` || user._id === currentUser?.id}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50"
                          title="Activate User"
                        >
                          {actionLoading === `suspend_${user._id}` ? (
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSuspendUser(user._id, true)}
                          disabled={actionLoading === `suspend_${user._id}` || user._id === currentUser?.id}
                          className="text-yellow-600 hover:text-yellow-900 disabled:opacity-50"
                          title="Suspend User"
                        >
                          {actionLoading === `suspend_${user._id}` ? (
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        disabled={actionLoading === `delete_${user._id}` || user._id === currentUser?.id}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        title="Delete User"
                      >
                        {actionLoading === `delete_${user._id}` ? (
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {currentUsers.length === 0 && !loading && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || roleFilter !== 'all' || statusFilter !== 'all' 
                ? 'Try adjusting your search terms or filters' 
                : 'No users in the system'}
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(indexOfLastUser, filteredUsers.length)}
                </span> of{' '}
                <span className="font-medium">{filteredUsers.length}</span> results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;