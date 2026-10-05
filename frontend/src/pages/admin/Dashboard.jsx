import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes, storesRes] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/admin/users'),
          api.get('/admin/stores')
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data.slice(0, 4));
        setStores(storesRes.data.slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="donezo-dashboard fade-in">
      {/* ── Header Title & Actions ── */}
      <div className="dashboard-top-bar">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Plan, prioritize, and accomplish your ratings & management tasks with ease.</p>
        </div>
        <div className="dashboard-actions">
          <Link to="/admin/add-user" className="btn btn-donezo-outline">
            + Add User
          </Link>
          <Link to="/admin/add-store" className="btn btn-donezo-primary">
            + Add Store
          </Link>
        </div>
      </div>

      {/* ── Top 4 Stat Cards Row (Clickable) ── */}
      <div className="donezo-stats-grid">
        {/* Card 1: Total Users — links to Users list */}
        <div
          className="donezo-stat-card card-featured-green clickable-card"
          onClick={() => navigate('/admin/users')}
          title="View all users"
        >
          <div className="stat-card-header">
            <span className="stat-title">Total Users</span>
            <span className="stat-arrow-btn">↗</span>
          </div>
          <div className="stat-number">{stats.totalUsers}</div>
          <div className="stat-badge-pill">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
              <polyline points="17 6 23 6 23 12"/>
            </svg>
            <span>Click to manage users</span>
          </div>
        </div>

        {/* Card 2: Total Stores — links to Stores list */}
        <div
          className="donezo-stat-card clickable-card"
          onClick={() => navigate('/admin/stores')}
          title="View all stores"
        >
          <div className="stat-card-header">
            <span className="stat-title">Registered Stores</span>
            <span className="stat-arrow-btn">↗</span>
          </div>
          <div className="stat-number">{stats.totalStores}</div>
          <div className="stat-badge-pill pill-light">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
              <polyline points="17 6 23 6 23 12"/>
            </svg>
            <span>Click to manage stores</span>
          </div>
        </div>

        {/* Card 3: Total Ratings — links to Stores list */}
        <div
          className="donezo-stat-card clickable-card"
          onClick={() => navigate('/admin/stores')}
          title="View store ratings"
        >
          <div className="stat-card-header">
            <span className="stat-title">Submitted Ratings</span>
            <span className="stat-arrow-btn">↗</span>
          </div>
          <div className="stat-number">{stats.totalRatings}</div>
          <div className="stat-badge-pill pill-light">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
              <polyline points="17 6 23 6 23 12"/>
            </svg>
            <span>Click to view ratings</span>
          </div>
        </div>

        {/* Card 4: Satisfaction Score — links to Stores */}
        <div
          className="donezo-stat-card clickable-card"
          onClick={() => navigate('/admin/stores')}
          title="View satisfaction details"
        >
          <div className="stat-card-header">
            <span className="stat-title">Satisfaction Score</span>
            <span className="stat-arrow-btn">↗</span>
          </div>
          <div className="stat-number">4.8 <span className="stat-star">★</span></div>
          <div className="stat-badge-pill pill-light">
            <span>Overall platform score</span>
          </div>
        </div>
      </div>

      {/* ── Main Dashboard Content Grid ── */}
      <div className="donezo-content-grid">
        {/* Left Column Section */}
        <div className="grid-col-main">
          {/* Middle Row: Analytics Bar Chart + Reminders */}
          <div className="grid-row-split">
            {/* Rating Analytics Widget */}
            <div className="donezo-card analytics-card">
              <div className="card-top-title">Rating Analytics</div>
              <div className="chart-bar-container">
                <div className="chart-bar-wrapper">
                  <div className="chart-bar bar-pattern" style={{ height: '65%' }}></div>
                  <span className="chart-day">S</span>
                </div>
                <div className="chart-bar-wrapper">
                  <div className="chart-bar bar-active" style={{ height: '85%' }}></div>
                  <span className="chart-day">M</span>
                </div>
                <div className="chart-bar-wrapper">
                  <div className="chart-bar bar-light" style={{ height: '55%' }}></div>
                  <span className="chart-day">T</span>
                </div>
                <div className="chart-bar-wrapper">
                  <div className="chart-bar bar-dark" style={{ height: '95%' }}></div>
                  <span className="chart-day">W</span>
                </div>
                <div className="chart-bar-wrapper">
                  <div className="chart-bar bar-pattern" style={{ height: '70%' }}></div>
                  <span className="chart-day">T</span>
                </div>
                <div className="chart-bar-wrapper">
                  <div className="chart-bar bar-pattern" style={{ height: '45%' }}></div>
                  <span className="chart-day">F</span>
                </div>
                <div className="chart-bar-wrapper">
                  <div className="chart-bar bar-pattern" style={{ height: '60%' }}></div>
                  <span className="chart-day">S</span>
                </div>
              </div>
            </div>

            {/* Quick Action Widget */}
            <div className="donezo-card action-summary-card">
              <div className="card-top-title">Platform Reminders</div>
              <div className="reminder-content">
                <div className="reminder-heading">Monthly Store Review</div>
                <div className="reminder-time">Time: 02:00 pm - 04:00 pm</div>
                <Link to="/admin/stores" className="btn btn-green-action">
                  ⚡ Manage Stores
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Row: User Collaboration Table */}
          <div className="donezo-card team-card">
            <div className="team-header">
              <div className="card-top-title">Recent Registered Users</div>
              <Link to="/admin/add-user" className="btn btn-donezo-outline btn-sm">
                + Add Member
              </Link>
            </div>
            <div className="team-list">
              {users.map((u, i) => (
                <div key={u.id} className="team-member-row">
                  <div className="member-avatar">
                    {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="member-info">
                    <div className="member-name">{u.name}</div>
                    <div className="member-role">{u.email}</div>
                  </div>
                  <div className="member-status">
                    <span className={`status-pill ${i % 2 === 0 ? 'pill-completed' : 'pill-progress'}`}>
                      {u.role === 'admin' ? 'Admin' : u.role === 'store_owner' ? 'Store Owner' : 'Normal User'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column Section */}
        <div className="grid-col-side">
          {/* Top Stores Quick View */}
          <div className="donezo-card stores-list-widget">
            <div className="widget-header">
              <span className="card-top-title">Top Stores</span>
              <Link to="/admin/stores" className="btn-text-link">+ View All</Link>
            </div>
            <div className="widget-stores-list">
              {stores.map((s, idx) => (
                <div key={s.id} className="store-mini-item">
                  <div className="store-mini-icon" style={{ background: idx % 2 === 0 ? '#E6F4ED' : '#F1F5F9' }}>
                    🏪
                  </div>
                  <div className="store-mini-info">
                    <div className="store-mini-name">{s.name}</div>
                    <div className="store-mini-sub">{s.address ? s.address.substring(0, 24) + '...' : ''}</div>
                  </div>
                  <div className="store-mini-rating">
                    ★ {s.rating ? parseFloat(s.rating).toFixed(1) : 'N/A'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Gauge Chart */}
          <div className="donezo-card progress-gauge-card">
            <div className="card-top-title">Platform Progress</div>
            <div className="gauge-container">
              <div className="gauge-circle">
                <div className="gauge-value">85%</div>
                <div className="gauge-label">Satisfied Ratings</div>
              </div>
            </div>
            <div className="gauge-legend">
              <span><i className="legend-dot green"></i> Satisfied</span>
              <span><i className="legend-dot dark"></i> Neutral</span>
              <span><i className="legend-dot pattern"></i> Pending</span>
            </div>
          </div>

          {/* Time / System Tracker Card */}
          <div className="donezo-card dark-tracker-card">
            <div className="tracker-label">System Active Time</div>
            <div className="tracker-timer">01:24:08</div>
            <div className="tracker-controls">
              <button className="tracker-btn">⏸</button>
              <button className="tracker-btn btn-stop">⏹</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
