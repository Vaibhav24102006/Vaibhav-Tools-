import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const AdminResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = searchParams.get('token');
    const i = searchParams.get('id');
    if (t) setToken(t);
    if (i) setId(i);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (password.length < 8) return setMessage('Password must be at least 8 characters');
    if (password !== confirm) return setMessage('Passwords do not match');
    setLoading(true);
    try {
      const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:5050';
      const res = await fetch(`${apiBase}/api/admin/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, token, newPassword: password })
      });
      // Read response body once and handle JSON or plain text
      const text = await res.text();
      let data = null;
      try { data = JSON.parse(text); } catch (e) { /* not JSON */ }
      if (!res.ok) {
        const errMsg = (data && data.error) ? data.error : (text || 'Reset failed');
        throw new Error(errMsg);
      }
      setMessage('Password reset successful. Redirecting to login...');
      setTimeout(() => navigate('/admin-login'), 1500);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[50vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-8">
        <h2 className="text-xl font-bold mb-4">Set a New Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            className="w-full px-4 py-2 border rounded text-black bg-white placeholder-gray-500"
            placeholder="New password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full px-4 py-2 border rounded text-black bg-white placeholder-gray-500"
            placeholder="Confirm new password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>{loading ? 'Resetting...' : 'Reset Password'}</button>
        </form>
        {message && <div className="mt-4 text-sm text-red-600">{message}</div>}
      </div>
    </div>
  );
};

export default AdminResetPassword;
