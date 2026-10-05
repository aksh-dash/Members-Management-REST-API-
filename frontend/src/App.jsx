import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AppLayout from './components/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ChangePassword from './pages/ChangePassword';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsersList from './pages/admin/UsersList';
import AdminStoresList from './pages/admin/StoresList';
import AddUser from './pages/admin/AddUser';
import AddStore from './pages/admin/AddStore';
import UserDetail from './pages/admin/UserDetail';
import UserStoresList from './pages/user/StoresList';
import OwnerDashboard from './pages/owner/Dashboard';

function RootRedirect() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  switch (user?.role) {
    case 'admin': return <Navigate to="/admin/dashboard" replace />;
    case 'store_owner': return <Navigate to="/owner/dashboard" replace />;
    default: return <Navigate to="/stores" replace />;
  }
}

export default function App() {
  return (
    <AppLayout>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Root redirect */}
        <Route path="/" element={<RootRedirect />} />

        {/* Shared authenticated route */}
        <Route path="/change-password" element={
          <ProtectedRoute roles={['admin', 'user', 'store_owner']}>
            <ChangePassword />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute roles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute roles={['admin']}>
            <AdminUsersList />
          </ProtectedRoute>
        } />
        <Route path="/admin/users/:id" element={
          <ProtectedRoute roles={['admin']}>
            <UserDetail />
          </ProtectedRoute>
        } />
        <Route path="/admin/stores" element={
          <ProtectedRoute roles={['admin']}>
            <AdminStoresList />
          </ProtectedRoute>
        } />
        <Route path="/admin/add-user" element={
          <ProtectedRoute roles={['admin']}>
            <AddUser />
          </ProtectedRoute>
        } />
        <Route path="/admin/add-store" element={
          <ProtectedRoute roles={['admin']}>
            <AddStore />
          </ProtectedRoute>
        } />

        {/* Normal User Routes */}
        <Route path="/stores" element={
          <ProtectedRoute roles={['user']}>
            <UserStoresList />
          </ProtectedRoute>
        } />

        {/* Store Owner Routes */}
        <Route path="/owner/dashboard" element={
          <ProtectedRoute roles={['store_owner']}>
            <OwnerDashboard />
          </ProtectedRoute>
        } />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  );
}
