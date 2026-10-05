import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import StarRating from '../../components/StarRating';

export default function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/admin/users/${id}`);
        setUser(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch user details.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading user details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="alert alert-error">{error}</div>
        <Link to="/admin/users" className="btn btn-secondary">← Back to Users</Link>
      </div>
    );
  }

  const roleLabel = {
    admin: 'Administrator',
    user: 'Normal User',
    store_owner: 'Store Owner'
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '??';

  return (
    <div className="page-container fade-in">
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/admin/users" className="btn btn-ghost btn-sm">← Back to Users</Link>
      </div>

      <div className="user-detail-card slide-up">
        <div className="user-detail-header">
          <div className="user-detail-avatar">{initials}</div>
          <div className="user-detail-info">
            <h2>{user?.name}</h2>
            <span className={`role-badge role-${user?.role}`}>
              {roleLabel[user?.role]}
            </span>
          </div>
        </div>

        <div className="user-detail-grid">
          <div className="detail-field">
            <span className="detail-field-label">Email</span>
            <span className="detail-field-value" style={{ color: 'var(--text-accent)' }}>
              {user?.email}
            </span>
          </div>

          <div className="detail-field">
            <span className="detail-field-label">Address</span>
            <span className="detail-field-value">{user?.address}</span>
          </div>

          <div className="detail-field">
            <span className="detail-field-label">Role</span>
            <span className="detail-field-value">{roleLabel[user?.role]}</span>
          </div>

          <div className="detail-field">
            <span className="detail-field-label">Joined</span>
            <span className="detail-field-value">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              }) : 'N/A'}
            </span>
          </div>
        </div>

        {/* If store owner, show store rating */}
        {user?.role === 'store_owner' && user?.stores && user.stores.length > 0 && (
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 700 }}>Owned Stores</h3>
            {user.stores.map((store) => (
              <div key={store.id} className="card" style={{ marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{store.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {store.totalRatings} rating{store.totalRatings !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="star-rating-display">
                    <StarRating value={Math.round(store.averageRating)} readonly />
                    <span className="star-rating-value">{store.averageRating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
