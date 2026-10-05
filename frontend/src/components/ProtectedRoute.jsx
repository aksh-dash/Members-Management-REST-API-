import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Route guard component that checks authentication and role.
 * Redirects to login if not authenticated, or to appropriate dashboard if wrong role.
 */
export default function ProtectedRoute({ children, roles }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user?.role)) {
    // Redirect to their correct dashboard
    switch (user?.role) {
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'store_owner':
        return <Navigate to="/owner/dashboard" replace />;
      default:
        return <Navigate to="/stores" replace />;
    }
  }

  return children;
}
