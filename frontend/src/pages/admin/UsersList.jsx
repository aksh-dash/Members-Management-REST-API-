import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchUsers = async () => {
    try {
      const params = { ...filters, sortBy, sortOrder };
      // Remove empty filter values
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });
      const res = await api.get('/admin/users', { params });
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [sortBy, sortOrder]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchUsers();
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getSortIndicator = (field) => {
    if (sortBy !== field) return '↕';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const handleDeleteClick = (user) => {
    setDeleteTarget(user);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/admin/users/${deleteTarget.id}`);
      setUsers(prev => prev.filter(u => u.id !== deleteTarget.id));
      setMessage(`User "${deleteTarget.name}" has been removed.`);
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      console.error('Failed to delete user:', err);
      setMessage('Failed to delete user. Please try again.');
      setTimeout(() => setMessage(''), 4000);
    } finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteTarget(null);
  };

  const roleLabel = {
    admin: 'Admin',
    user: 'User',
    store_owner: 'Store Owner'
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <h1 className="page-title">Users</h1>
        <p className="page-subtitle">Manage all platform users</p>
      </div>

      {message && (
        <div className="alert alert-success">
          <span>✓</span> {message}
        </div>
      )}

      <div className="table-container">
        <form className="table-toolbar" onSubmit={handleFilterSubmit}>
          <div className="table-filters">
            <input
              type="text"
              name="name"
              className="filter-input"
              placeholder="Filter by name..."
              value={filters.name}
              onChange={handleFilterChange}
            />
            <input
              type="text"
              name="email"
              className="filter-input"
              placeholder="Filter by email..."
              value={filters.email}
              onChange={handleFilterChange}
            />
            <input
              type="text"
              name="address"
              className="filter-input"
              placeholder="Filter by address..."
              value={filters.address}
              onChange={handleFilterChange}
            />
            <select
              name="role"
              className="filter-select"
              value={filters.role}
              onChange={handleFilterChange}
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="store_owner">Store Owner</option>
            </select>
          </div>
          <button type="submit" className="btn btn-secondary btn-sm">
            Apply Filters
          </button>
        </form>

        {users.length === 0 ? (
          <div className="table-empty">No users found matching the criteria.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th
                    className={`sortable ${sortBy === 'name' ? 'sorted' : ''}`}
                    onClick={() => handleSort('name')}
                  >
                    Name <span className="sort-indicator">{getSortIndicator('name')}</span>
                  </th>
                  <th
                    className={`sortable ${sortBy === 'email' ? 'sorted' : ''}`}
                    onClick={() => handleSort('email')}
                  >
                    Email <span className="sort-indicator">{getSortIndicator('email')}</span>
                  </th>
                  <th>Address</th>
                  <th
                    className={`sortable ${sortBy === 'role' ? 'sorted' : ''}`}
                    onClick={() => handleSort('role')}
                  >
                    Role <span className="sort-indicator">{getSortIndicator('role')}</span>
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="td-name">{user.name}</td>
                    <td className="td-email">{user.email}</td>
                    <td>{user.address}</td>
                    <td>
                      <span className={`role-badge role-${user.role}`}>
                        {roleLabel[user.role]}
                      </span>
                    </td>
                    <td>
                      <div className="action-btn-group">
                        <Link to={`/admin/users/${user.id}`} className="btn btn-ghost btn-sm">
                          View
                        </Link>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteClick(user)}
                          title="Remove this user"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Delete Confirmation Modal ── */}
      {deleteTarget && (
        <div className="modal-overlay" onClick={handleDeleteCancel}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon-wrapper modal-icon-danger">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                <line x1="10" y1="11" x2="10" y2="17"/>
                <line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
            </div>
            <h3 className="modal-title">Remove User</h3>
            <p className="modal-desc">
              Are you sure you want to remove <strong>{deleteTarget.name}</strong> ({deleteTarget.email})?
              This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn btn-modal-cancel" onClick={handleDeleteCancel}>
                Cancel
              </button>
              <button
                className="btn btn-modal-danger"
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Removing...' : 'Yes, Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
