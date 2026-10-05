import { useState } from 'react';
import api from '../api/axios';

export default function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const errs = [];
    if (!form.currentPassword) errs.push('Current password is required.');
    if (form.newPassword.length < 8 || form.newPassword.length > 16)
      errs.push('New password must be between 8 and 16 characters.');
    if (!/[A-Z]/.test(form.newPassword))
      errs.push('New password must contain at least one uppercase letter.');
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.newPassword))
      errs.push('New password must contain at least one special character.');
    if (form.newPassword !== form.confirmPassword)
      errs.push('Passwords do not match.');
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
      setSuccess('');
      return;
    }

    setErrors([]);
    setSuccess('');
    setLoading(true);

    try {
      const res = await api.put('/auth/password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      });
      setSuccess(res.data.message);
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      const serverErrors = err.response?.data?.errors || [err.response?.data?.message || 'Failed to update password.'];
      setErrors(Array.isArray(serverErrors) ? serverErrors : [serverErrors]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-container slide-up">
        <div className="page-header">
          <h1 className="page-title">Change Password</h1>
          <p className="page-subtitle">Update your account password</p>
        </div>

        {success && (
          <div className="alert alert-success">
            <span>✓</span> {success}
          </div>
        )}

        {errors.length > 0 && (
          <div className="alert alert-error">
            <ul className="alert-list">
              {errors.map((err, i) => <li key={i}>{err}</li>)}
            </ul>
          </div>
        )}

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="current-password">Current Password</label>
              <input
                id="current-password"
                type="password"
                name="currentPassword"
                className="form-input"
                placeholder="Enter current password"
                value={form.currentPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="new-password">New Password</label>
              <input
                id="new-password"
                type="password"
                name="newPassword"
                className="form-input"
                placeholder="8-16 chars, 1 uppercase, 1 special"
                value={form.newPassword}
                onChange={handleChange}
                required
              />
              <p className="form-hint">8-16 characters, at least one uppercase letter and one special character</p>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirm-password">Confirm New Password</label>
              <input
                id="confirm-password"
                type="password"
                name="confirmPassword"
                className="form-input"
                placeholder="Confirm new password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
