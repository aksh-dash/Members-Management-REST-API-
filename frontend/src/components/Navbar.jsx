import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) return null;

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const roleLabel = {
    admin: 'Administrator',
    user: 'User',
    store_owner: 'Store Owner'
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <div className="logo-icon">⭐</div>
        <span>StoreRate</span>
      </Link>

      <div className="navbar-links">
        {user?.role === 'admin' && (
          <>
            <Link to="/admin/dashboard" className={isActive('/admin/dashboard')}>Dashboard</Link>
            <Link to="/admin/users" className={isActive('/admin/users')}>Users</Link>
            <Link to="/admin/stores" className={isActive('/admin/stores')}>Stores</Link>
            <Link to="/admin/add-user" className={isActive('/admin/add-user')}>Add User</Link>
            <Link to="/admin/add-store" className={isActive('/admin/add-store')}>Add Store</Link>
          </>
        )}

        {user?.role === 'user' && (
          <>
            <Link to="/stores" className={isActive('/stores')}>Stores</Link>
          </>
        )}

        {user?.role === 'store_owner' && (
          <>
            <Link to="/owner/dashboard" className={isActive('/owner/dashboard')}>Dashboard</Link>
          </>
        )}

        <Link to="/change-password" className={isActive('/change-password')}>Password</Link>
      </div>

      <div className="navbar-user">
        <span className="navbar-role-badge">{roleLabel[user?.role]}</span>
        <button className="btn-logout" onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}
