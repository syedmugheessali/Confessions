import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getAdminStats,
  getAdminUsers,
  updateUserRole,
  getAdminConfessions,
  adminDeleteConfession,
} from '../services/adminApi';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const AdminDashboardPage = () => {
  const { user, isAdmin, isModerator } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Stats state
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);

  // Users state
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);
  const [searchUser, setSearchUser] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [actionSuccess, setActionSuccess] = useState('');

  // Confessions moderation state
  const [confessions, setConfessions] = useState([]);
  const [confessionsLoading, setConfessionsLoading] = useState(false);
  const [confessionsError, setConfessionsError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  // Load stats
  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const data = await getAdminStats();
      setStats(data);
      setStatsError(null);
    } catch (err) {
      setStatsError(err.response?.data?.message || 'Failed to load statistics');
    } finally {
      setStatsLoading(false);
    }
  };

  // Load users
  const fetchUsers = async () => {
    if (!isAdmin) return;
    setUsersLoading(true);
    try {
      const data = await getAdminUsers(1, 50, searchUser, roleFilter);
      setUsers(data.users || []);
      setUsersError(null);
    } catch (err) {
      setUsersError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  };

  // Load confessions
  const fetchConfessions = async () => {
    setConfessionsLoading(true);
    try {
      const data = await getAdminConfessions(1, 50, statusFilter);
      setConfessions(data.confessions || []);
      setConfessionsError(null);
    } catch (err) {
      setConfessionsError(err.response?.data?.message || 'Failed to load confessions');
    } finally {
      setConfessionsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'users' && isAdmin) {
      fetchUsers();
    } else if (activeTab === 'moderation') {
      fetchConfessions();
    }
  }, [activeTab, statusFilter, roleFilter]);

  const handleRoleChange = async (targetUserId, newRole) => {
    setUpdatingUserId(targetUserId);
    setActionSuccess('');
    setUsersError(null);

    try {
      await updateUserRole(targetUserId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u._id === targetUserId ? { ...u, role: newRole } : u))
      );
      setActionSuccess(`Role successfully updated to ${newRole}`);
      fetchStats();
    } catch (err) {
      setUsersError(err.response?.data?.message || 'Failed to update user role');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleDeleteConfession = async (confessionId) => {
    if (!window.confirm('Are you sure you want to permanently delete this confession?')) return;

    try {
      await adminDeleteConfession(confessionId);
      setConfessions((prev) => prev.filter((c) => c._id !== confessionId));
      setActionSuccess('Confession removed.');
      fetchStats();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete confession');
    }
  };

  return (
    <div className="page-container admin-dashboard">
      <div className="admin-header">
        <div>
          <h2>Administration & Moderation</h2>
          <p className="subtitle-text">
            Logged in as <strong>{user?.name}</strong>{' '}
            <span className={`badge-role badge-${user?.role}`}>
              {user?.role?.toUpperCase()}
            </span>
          </p>
        </div>
      </div>

      {actionSuccess && (
        <div className="alert-success" style={{ margin: '1rem 0' }}>
          {actionSuccess}
        </div>
      )}

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview & Metrics
        </button>
        <button
          className={`tab-btn ${activeTab === 'moderation' ? 'active' : ''}`}
          onClick={() => setActiveTab('moderation')}
        >
          Confession Moderation
        </button>
        {isAdmin && (
          <button
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            User Management
          </button>
        )}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="tab-content">
          {statsLoading && <LoadingSpinner />}
          {statsError && <ErrorMessage message={statsError} onRetry={fetchStats} />}
          {stats && (
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-label">Total Users</span>
                <span className="stat-value">{stats.totalUsers}</span>
                <span className="stat-sub">Registered accounts</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Administrators</span>
                <span className="stat-value">{stats.roles?.admin || 0}</span>
                <span className="stat-sub">Full system access</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Moderators</span>
                <span className="stat-value">{stats.roles?.moderator || 0}</span>
                <span className="stat-sub">Content moderators</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Regular Users</span>
                <span className="stat-value">{stats.roles?.user || 0}</span>
                <span className="stat-sub">Standard privileges</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Active Confessions</span>
                <span className="stat-value text-success">{stats.confessions?.active || 0}</span>
                <span className="stat-sub">Live on feed</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Expired Confessions</span>
                <span className="stat-value text-muted">{stats.confessions?.expired || 0}</span>
                <span className="stat-sub">Awaiting TTL cleanup</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Moderation Tab */}
      {activeTab === 'moderation' && (
        <div className="tab-content">
          <div className="filter-bar">
            <label>Filter by status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="select-input"
            >
              <option value="">All Confessions</option>
              <option value="active">Active Only</option>
              <option value="expired">Expired Only</option>
            </select>
          </div>

          {confessionsLoading && <LoadingSpinner />}
          {confessionsError && (
            <ErrorMessage message={confessionsError} onRetry={fetchConfessions} />
          )}

          {!confessionsLoading && confessions.length === 0 && (
            <div className="empty-state">No confessions found matching filter.</div>
          )}

          {!confessionsLoading && confessions.length > 0 && (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Content</th>
                    <th>Author</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {confessions.map((c) => {
                    const isExp = new Date(c.expiresAt) <= new Date();
                    return (
                      <tr key={c._id}>
                        <td className="table-content-cell">{c.content}</td>
                        <td>
                          {c.user ? (
                            <div>
                              <strong>{c.user.name}</strong>
                              <div className="text-secondary text-xs">{c.user.email}</div>
                              <span className={`badge-role badge-${c.user.role} text-xs`}>
                                {c.user.role}
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted">Unknown / Deleted</span>
                          )}
                        </td>
                        <td>
                          <span className={`status-pill ${isExp ? 'status-expired' : 'status-active'}`}>
                            {isExp ? 'Expired' : 'Active'}
                          </span>
                        </td>
                        <td className="text-xs">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <button
                            className="btn-danger btn-sm"
                            onClick={() => handleDeleteConfession(c._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* User Management Tab (Admin Only) */}
      {activeTab === 'users' && isAdmin && (
        <div className="tab-content">
          <div className="user-management-controls">
            <form onSubmit={handleSearchSubmit} className="search-form">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="input-search"
              />
              <button type="submit" className="btn-secondary btn-sm">
                Search
              </button>
            </form>

            <div className="filter-group">
              <label>Role:</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="select-input"
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>

          {usersLoading && <LoadingSpinner />}
          {usersError && <ErrorMessage message={usersError} onRetry={fetchUsers} />}

          {!usersLoading && users.length === 0 && (
            <div className="empty-state">No users found.</div>
          )}

          {!usersLoading && users.length > 0 && (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Current Role</th>
                    <th>Change Role (RBAC)</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td><strong>{u.name}</strong></td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`badge-role badge-${u.role}`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <select
                          value={u.role}
                          disabled={updatingUserId === u._id}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="select-role-input"
                        >
                          <option value="user">User (Standard)</option>
                          <option value="moderator">Moderator (Can Delete)</option>
                          <option value="admin">Admin (Full Control)</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
