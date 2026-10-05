import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import StarRating from '../../components/StarRating';

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/owner/dashboard');
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch owner dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const handleDeleteStore = async () => {
    setDeleteLoading(true);
    try {
      await api.delete('/owner/store');
      // After deleting, refresh — the dashboard will show "no store" state
      setData({ ...data, store: null });
      setShowDeleteModal(false);
    } catch (err) {
      console.error('Failed to delete store:', err);
      alert('Failed to delete store. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!data?.store) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="empty-state-icon">🏪</div>
          <p className="empty-state-text">No store assigned to your account</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Please contact the administrator to assign a store.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Store Dashboard</h1>
          <p className="page-subtitle">Overview of your store performance</p>
        </div>
        <button
          className="btn btn-danger"
          onClick={() => setShowDeleteModal(true)}
          title="Remove your store"
        >
          🗑 Remove Store
        </button>
      </div>

      {/* Store Info Card */}
      <div className="owner-store-info slide-up">
        <div className="owner-store-name">{data.store.name}</div>
        <div className="owner-store-detail">📧 {data.store.email}</div>
        <div className="owner-store-detail">📍 {data.store.address}</div>

        <div className="owner-rating-highlight">
          <div className="owner-avg-rating">{data.averageRating}</div>
          <div className="owner-rating-meta">
            <StarRating value={Math.round(data.averageRating)} readonly size="1.5rem" />
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              {data.totalRatings} total rating{data.totalRatings !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Ratings Table */}
      <div className="table-container slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="table-toolbar">
          <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>User Ratings</h3>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            {data.ratings.length} rating{data.ratings.length !== 1 ? 's' : ''} submitted
          </span>
        </div>

        {data.ratings.length === 0 ? (
          <div className="table-empty">No ratings have been submitted yet.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Email</th>
                  <th>Rating</th>
                  <th>Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {data.ratings.map((rating) => (
                  <tr key={rating.id}>
                    <td className="td-name">{rating.userName}</td>
                    <td className="td-email">{rating.userEmail}</td>
                    <td>
                      <div className="star-rating-display">
                        <StarRating value={rating.rating} readonly />
                        <span className="star-rating-value">{rating.rating}</span>
                      </div>
                    </td>
                    <td>
                      {new Date(rating.submittedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Delete Store Confirmation Modal ── */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon-wrapper modal-icon-danger">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                <line x1="10" y1="11" x2="10" y2="17"/>
                <line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
            </div>
            <h3 className="modal-title">Remove Your Store</h3>
            <p className="modal-desc">
              Are you sure you want to permanently remove <strong>{data.store.name}</strong>?
              All ratings and data associated with this store will be deleted. This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn btn-modal-cancel" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button
                className="btn btn-modal-danger"
                onClick={handleDeleteStore}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Removing...' : 'Yes, Remove Store'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
