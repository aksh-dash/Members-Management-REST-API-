import { useState, useEffect } from 'react';
import api from '../../api/axios';
import StarRating from '../../components/StarRating';

export default function UserStoresList() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [ratingMessage, setRatingMessage] = useState('');

  const fetchStores = async () => {
    try {
      const params = {};
      if (searchName) params.name = searchName;
      if (searchAddress) params.address = searchAddress;
      const res = await api.get('/stores', { params });
      setStores(res.data);
    } catch (err) {
      console.error('Failed to fetch stores:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchStores();
  };

  const handleRate = async (storeId, rating) => {
    try {
      const res = await api.post(`/stores/${storeId}/rate`, { rating });

      // Update store in the list with new values
      setStores(prev => prev.map(store =>
        store.id === storeId
          ? {
              ...store,
              userRating: res.data.userRating,
              averageRating: res.data.averageRating,
              totalRatings: res.data.totalRatings
            }
          : store
      ));

      setRatingMessage(res.data.message);
      setTimeout(() => setRatingMessage(''), 3000);
    } catch (err) {
      console.error('Failed to submit rating:', err);
    }
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
        <h1 className="page-title">Browse Stores</h1>
        <p className="page-subtitle">Discover and rate stores on the platform</p>
      </div>

      {ratingMessage && (
        <div className="alert alert-success">
          <span>✓</span> {ratingMessage}
        </div>
      )}

      <form className="search-bar" onSubmit={handleSearch}>
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by store name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
        <div className="search-input-wrapper">
          <span className="search-icon">📍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by address..."
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary btn-sm">Search</button>
      </form>

      {stores.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏪</div>
          <p className="empty-state-text">No stores found</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="stores-grid">
          {stores.map((store) => (
            <div key={store.id} className="store-card slide-up">
              <div className="store-card-name">{store.name}</div>
              <div className="store-card-address">
                <span>📍</span>
                <span>{store.address}</span>
              </div>

              <div className="store-card-rating">
                <div className="store-card-overall">
                  <span className="store-card-overall-label">Overall Rating</span>
                  <div className="star-rating-display">
                    <StarRating value={Math.round(store.averageRating)} readonly />
                    <span className="star-rating-value">{store.averageRating}</span>
                    <span className="star-rating-count">({store.totalRatings})</span>
                  </div>
                </div>

                <div className="store-card-your-rating">
                  <span className="store-card-your-rating-label">
                    {store.userRating ? 'Your Rating' : 'Rate this Store'}
                  </span>
                  <StarRating
                    value={store.userRating || 0}
                    onChange={(rating) => handleRate(store.id, rating)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
