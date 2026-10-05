import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AppLayout({ children }) {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [rememberCreds, setRememberCreds] = useState(false);

  if (!isAuthenticated) return children;

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (user?.role === 'admin') {
      navigate(`/admin/stores?search=${encodeURIComponent(searchQuery)}`);
    } else if (user?.role === 'user') {
      navigate(`/stores?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    if (rememberCreds && user?.email) {
      localStorage.setItem('rememberedEmail', user.email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }
    setShowLogoutModal(false);
    logout();
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
    setRememberCreds(false);
  };

  const getRoleTitle = (role) => {
    switch (role) {
      case 'admin': return 'System Administrator';
      case 'store_owner': return 'Store Owner';
      default: return 'User';
    }
  };

  const getAvatarLetter = (name, email) => {
    if (name) return name.charAt(0).toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return 'U';
  };

  return (
    <div className="donezo-layout">
      {/* ── Left Sidebar ── */}
      <aside className="donezo-sidebar">
        {/* Brand Logo */}
        <div className="sidebar-brand">
          <div className="brand-logo-icon">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="brand-name">StoreRate</span>
        </div>

        {/* Sidebar Menu Sections */}
        <div className="sidebar-menu">
          <div className="menu-section-label">MENU</div>
          {user?.role === 'admin' && (
            <>
              <Link to="/admin/dashboard" className={`sidebar-link ${isActive('/admin/dashboard')}`}>
                <span className="link-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" rx="1.5"/>
                    <rect x="14" y="3" width="7" height="7" rx="1.5"/>
                    <rect x="14" y="14" width="7" height="7" rx="1.5"/>
                    <rect x="3" y="14" width="7" height="7" rx="1.5"/>
                  </svg>
                </span>
                <span className="link-text">Dashboard</span>
              </Link>
              <Link to="/admin/users" className={`sidebar-link ${isActive('/admin/users')}`}>
                <span className="link-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </span>
                <span className="link-text">Users</span>
              </Link>
              <Link to="/admin/stores" className={`sidebar-link ${isActive('/admin/stores')}`}>
                <span className="link-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                </span>
                <span className="link-text">Stores</span>
              </Link>
            </>
          )}

          {user?.role === 'user' && (
            <Link to="/stores" className={`sidebar-link ${isActive('/stores')}`}>
              <span className="link-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </span>
              <span className="link-text">Browse Stores</span>
            </Link>
          )}

          {user?.role === 'store_owner' && (
            <Link to="/owner/dashboard" className={`sidebar-link ${isActive('/owner/dashboard')}`}>
              <span className="link-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" rx="1.5"/>
                  <rect x="14" y="3" width="7" height="7" rx="1.5"/>
                  <rect x="14" y="14" width="7" height="7" rx="1.5"/>
                  <rect x="3" y="14" width="7" height="7" rx="1.5"/>
                </svg>
              </span>
              <span className="link-text">Owner Dashboard</span>
            </Link>
          )}

          <div className="menu-section-label" style={{ marginTop: '1.75rem' }}>GENERAL</div>
          <Link to="/change-password" className={`sidebar-link ${isActive('/change-password')}`}>
            <span className="link-icon">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </span>
            <span className="link-text">Change Password</span>
          </Link>
          <button onClick={handleLogoutClick} className="sidebar-link sidebar-logout-btn">
            <span className="link-icon">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </span>
            <span className="link-text">Logout</span>
          </button>
        </div>

        {/* Bottom Promo Card */}
        <div className="sidebar-promo-card">
          <div className="promo-icon">⭐</div>
          <div className="promo-title">StoreRate Platform</div>
          <div className="promo-desc">Manage users & ratings efficiently</div>
          <div className="promo-badge">{getRoleTitle(user?.role)}</div>
        </div>
      </aside>

      {/* ── Main Layout Right Area ── */}
      <div className="donezo-main-wrapper">
        {/* Top Header Bar */}
        <header className="donezo-header">
          {/* Global Search Bar */}
          <form className="header-search-form" onSubmit={handleSearch}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" className="search-icon">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              className="header-search-input"
              placeholder="Search stores, users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <kbd className="search-shortcut">⌘F</kbd>
          </form>

          {/* Right Profile & Notification Controls */}
          <div className="header-right-controls">
            <button className="header-icon-btn" title="Messages">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </button>

            <button className="header-icon-btn" title="Notifications">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span className="notification-dot"></span>
            </button>

            {/* User Profile Pill */}
            <div className="header-user-profile">
              <div className="user-avatar-circle">
                {getAvatarLetter(user?.name, user?.email)}
              </div>
              <div className="user-profile-info">
                <span className="user-profile-name">{user?.name || user?.email}</span>
                <span className="user-profile-email">{user?.email}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="donezo-content-body">
          {children}
        </main>
      </div>

      {/* ── Logout Confirmation Modal ── */}
      {showLogoutModal && (
        <div className="modal-overlay" onClick={handleLogoutCancel}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon-wrapper">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </div>
            <h3 className="modal-title">Confirm Logout</h3>
            <p className="modal-desc">Are you sure you want to log out of StoreRate?</p>

            <label className="modal-checkbox-label">
              <input
                type="checkbox"
                checked={rememberCreds}
                onChange={(e) => setRememberCreds(e.target.checked)}
              />
              <span>Remember my email for next login</span>
            </label>

            <div className="modal-actions">
              <button className="btn btn-modal-cancel" onClick={handleLogoutCancel}>
                Cancel
              </button>
              <button className="btn btn-modal-confirm" onClick={handleLogoutConfirm}>
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
