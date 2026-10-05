import { useState, useEffect } from 'react';
import api from '../../api/axios';
import StarRating from '../../components/StarRating';

export default function AdminStoresList() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchStores = async () => {
    try {
      const params = { ...filters, sortBy, sortOrder };
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });
      const res = await api.get('/admin/stores', { params });
      setStores(res.data);
    } catch (err) {
      console.error('Failed to fetch stores:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [sortBy, sortOrder]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchStores();
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

  const handleDeleteClick = (store) => {
    setDeleteTarget(store);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/admin/stores/${deleteTarget.id}`);
      setStores(prev => prev.filter(s => s.id !== deleteTarget.id));
      setMessage(`Store "${deleteTarget.name}" has been removed.`);
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      console.error('Failed to delete store:', err);
      setMessage('Failed to delete store. Please try again.');
      setTimeout(() => setMessage(''), 4000);
    } finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteTarget(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading stores...</p>
      </div>
    );
  }

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <h1 className="page-title">Stores</h1>
        <p className="page-subtitle">Manage all registered stores</p>
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
          </div>
          <button type="submit" className="btn btn-secondary btn-sm">
            Apply Filters
          </button>
        </form>

        {stores.length === 0 ? (
          <div className="table-empty">No stores found matching the criteria.</div>
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
                    className={`sortable ${sortBy === 'averageRating' ? 'sorted' : ''}`}
                    onClick={() => handleSort('averageRating')}
                  >
                    Rating <span className="sort-indicator">{getSortIndicator('averageRating')}</span>
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((store) => (
                  <tr key={store.id}>
                    <td className="td-name">{store.name}</td>
                    <td className="td-email">{store.email}</td>
                    <td>{store.address}</td>
                    <td>
                      <div className="star-rating-display">
                        <StarRating value={Math.round(store.averageRating)} readonly />
                        <span className="star-rating-value">{store.averageRating}</span>
                        <span className="star-rating-count">({store.totalRatings})</span>
                      </div>
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteClick(store)}
                        title="Remove this store"
                      >
                        Remove
                      </button>
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
            <h3 className="modal-title">Remove Store</h3>
            <p className="modal-desc">
              Are you sure you want to remove <strong>{deleteTarget.name}</strong>?
              All ratings for this store will also be deleted. This action cannot be undone.
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
