import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export default function AddStore() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '' });
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const errs = [];
    if (form.name.length < 20 || form.name.length > 60)
      errs.push('Store name must be between 20 and 60 characters.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.push('Please provide a valid email address.');
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
      const res = await api.post('/admin/stores', form);
      setSuccess(res.data.message);
      setForm({ name: '', email: '', address: '' });
    } catch (err) {
      const serverErrors = err.response?.data?.errors || [err.response?.data?.message || 'Failed to create store.'];
      setErrors(Array.isArray(serverErrors) ? serverErrors : [serverErrors]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-container slide-up">
        <div className="page-header">
          <h1 className="page-title">Add New Store</h1>
          <p className="page-subtitle">Register a new store on the platform</p>
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
              <label className="form-label" htmlFor="add-store-name">Store Name</label>
              <input
                id="add-store-name"
                type="text"
                name="name"
                className="form-input"
                placeholder="Enter store name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <div className={`char-count ${form.name.length > 60 ? 'error' : form.name.length >= 20 ? '' : 'warning'}`}>
                {form.name.length}/60 (min 20)
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="add-store-email">Store Email</label>
              <input
                id="add-store-email"
                type="email"
                name="email"
                className="form-input"
                placeholder="Enter store email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="add-store-address">Store Address</label>
              <textarea
                id="add-store-address"
                name="address"
                className="form-textarea"
                placeholder="Enter store address"
                value={form.address}
                onChange={handleChange}
                required
              />
              <div className={`char-count ${form.address.length > 400 ? 'error' : ''}`}>
                {form.address.length}/400
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ flex: 1 }}
              >
                {loading ? 'Creating...' : 'Create Store'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/admin/stores')}
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
