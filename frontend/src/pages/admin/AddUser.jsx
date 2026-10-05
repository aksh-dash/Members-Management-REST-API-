import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export default function AddUser() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', address: '', role: 'user'
  });
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

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
      setSuccess('');
      return;
    }

    setErrors([]);
    setSuccess('');
    setLoading(true);

    try {
      const res = await api.post('/admin/users', form);
      setSuccess(res.data.message);
      setForm({ name: '', email: '', password: '', address: '', role: 'user' });
    } catch (err) {
      const serverErrors = err.response?.data?.errors || [err.response?.data?.message || 'Failed to create user.'];
      setErrors(Array.isArray(serverErrors) ? serverErrors : [serverErrors]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-container slide-up">
        <div className="page-header">
          <h1 className="page-title">Add New User</h1>
          <p className="page-subtitle">Create a new user account on the platform</p>
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
              <label className="form-label" htmlFor="add-user-name">Full Name</label>
              <input
                id="add-user-name"
                type="text"
                name="name"
                className="form-input"
                placeholder="Enter full name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <div className={`char-count ${form.name.length > 60 ? 'error' : form.name.length >= 20 ? '' : 'warning'}`}>
                {form.name.length}/60 (min 20)
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="add-user-email">Email</label>
              <input
                id="add-user-email"
                type="email"
                name="email"
                className="form-input"
                placeholder="Enter email address"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="add-user-password">Password</label>
              <input
                id="add-user-password"
                type="password"
                name="password"
                className="form-input"
                placeholder="8-16 chars, 1 uppercase, 1 special"
                value={form.password}
                onChange={handleChange}
                required
              />
              <p className="form-hint">8-16 characters, at least one uppercase letter and one special character</p>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="add-user-address">Address</label>
              <textarea
                id="add-user-address"
                name="address"
                className="form-textarea"
                placeholder="Enter address"
                value={form.address}
                onChange={handleChange}
                required
              />
              <div className={`char-count ${form.address.length > 400 ? 'error' : ''}`}>
                {form.address.length}/400
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="add-user-role">Role</label>
              <select
                id="add-user-role"
                name="role"
                className="form-select"
                value={form.role}
                onChange={handleChange}
              >
                <option value="user">Normal User</option>
                <option value="admin">Administrator</option>
                <option value="store_owner">Store Owner</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ flex: 1 }}
              >
                {loading ? 'Creating...' : 'Create User'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/admin/users')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
