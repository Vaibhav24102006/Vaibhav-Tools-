import React, { useState } from 'react';

const AdminRequestReset = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [resetLink, setResetLink] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setResetLink('');
    setLoading(true);
    try {
      const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:5050';
      const res = await fetch(`${apiBase}/api/admin/request-password-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      // Read response body once and handle JSON or plain text
      const text = await res.text();
      let data = null;
      try { data = JSON.parse(text); } catch (e) { /* not JSON */ }

      if (!res.ok) {
        const errMsg = (data && data.error) ? data.error : (text || 'Request failed');
        throw new Error(errMsg);
      }

      setMessage('Password reset link generated. (In dev it is returned below.)');
      setResetLink((data && data.resetLink) ? data.resetLink : (text || ''));
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[50vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-8">
        <h2 className="text-xl font-bold mb-4">Admin Password Reset</h2>
        <p className="text-sm text-gray-600 mb-4">Enter your admin email and we will generate a reset link.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            className="w-full px-4 py-2 border rounded text-black bg-white placeholder-gray-500"
            placeholder="admin email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>{loading ? 'Sending...' : 'Send Reset Link'}</button>
        </form>
        {message && <div className="mt-4 text-sm text-red-600">{message}</div>}
        {resetLink && (
          <div className="mt-4 p-3 bg-gray-50 border rounded">
            <p className="text-sm font-semibold mb-2">Dev Reset Link (use once):</p>
            <a href={resetLink} target="_blank" rel="noreferrer" className="text-primary-red break-all">{resetLink}</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRequestReset;
