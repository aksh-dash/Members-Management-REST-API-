import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { register, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '' });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/stores" replace />;

  const validateForm = () => {
    const errs = [];
    if (form.name.length < 20 || form.name.length > 60)
      errs.push('Name must be between 20 and 60 characters.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.push('Please provide a valid email address.');
    if (form.password.length < 8 || form.password.length > 16)
      errs.push('Password must be between 8 and 16 characters.');
    if (!/[A-Z]/.test(form.password))
      errs.push('Password must contain at least one uppercase letter.');
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.password))
      errs.push('Password must contain at least one special character.');
    if (!form.address || form.address.length > 400)
      errs.push('Address is required and must not exceed 400 characters.');
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors([]);
    setLoading(true);

    try {
      await register(form);
    } catch (err) {
      const serverErrors = err.response?.data?.errors || [err.response?.data?.message || 'Registration failed.'];
      setErrors(Array.isArray(serverErrors) ? serverErrors : [serverErrors]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card slide-up">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join StoreRate and start rating stores</p>

        {errors.length > 0 && (
          <div className="alert alert-error">
            <ul className="alert-list">
              {errors.map((err, i) => <li key={i}>{err}</li>)}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="pill-input-wrapper">
              <div className="pill-icon-bubble">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <input
                id="signup-name"
                type="text"
                name="name"
                className="pill-input"
                placeholder="Full Name (20-60 characters)"
                value={form.name}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>
            <div className={`char-count ${form.name.length > 60 ? 'error' : form.name.length >= 20 ? '' : 'warning'}`}>
              {form.name.length}/60 (min 20)
            </div>
          </div>

          <div className="form-group">
            <div className="pill-input-wrapper">
              <div className="pill-icon-bubble">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <input
                id="signup-email"
                type="email"
                name="email"
                className="pill-input"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="pill-input-wrapper">
              <div className="pill-icon-bubble">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <input
                id="signup-address"
                type="text"
                name="address"
                className="pill-input"
                placeholder="Address (max 400 chars)"
                value={form.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className={`char-count ${form.address.length > 400 ? 'error' : ''}`}>
              {form.address.length}/400
            </div>
          </div>

          <div className="form-group">
            <div className="pill-input-wrapper">
              <div className="pill-icon-bubble">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <input
                id="signup-password"
                type="password"
                name="password"
                className="pill-input"
                placeholder="Password (8-16 chars, 1 upper, 1 special)"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <p className="form-hint">8-16 characters, ≥1 uppercase, ≥1 special character</p>
          </div>

          <button
            type="submit"
            className="btn pill-btn-primary btn-full"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
