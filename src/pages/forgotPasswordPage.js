import React, { useState } from 'react';
import Navbar from '../components/navbar';
import SiteFooter from '../components/siteFooter';
import { useAuth } from '../context/authContext';

export default function ForgotPasswordPage() {
  const { user, sendPasswordReset } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await sendPasswordReset(email.trim());
      setMessage(`Reset link sent to ${email.trim()}.`);
    } catch (submitError) {
      setError(submitError.message || 'Could not send reset email right now.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', color: 'var(--ink)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, display: 'grid', placeItems: 'center', padding: '32px 6%' }}>
        <section style={panelStyle}>
          <h1 style={{ margin: '0 0 8px', fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem' }}>Reset password</h1>
          <p style={{ margin: '0 0 14px', color: 'var(--mid)' }}>
            Enter your account email and we will send a secure reset link.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 10 }}>
            <label style={{ fontWeight: 700, fontSize: '.85rem' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="you@example.com"
              style={inputStyle}
            />
            <button type="submit" disabled={loading} style={buttonStyle}>
              {loading ? 'Sending...' : 'Send reset email'}
            </button>
          </form>

          {message && <p style={okStyle}>{message}</p>}
          {error && <p style={errorStyle}>{error}</p>}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

const panelStyle = {
  width: '100%',
  maxWidth: 500,
  background: 'rgba(255,255,255,.94)',
  border: '1px solid rgba(74,124,138,.2)',
  borderRadius: 16,
  padding: '24px 22px',
  boxShadow: '0 16px 34px rgba(36,58,68,.1)',
};

const inputStyle = {
  border: '1px solid var(--mist)',
  borderRadius: 10,
  padding: '11px 12px',
  fontSize: '.93rem',
  outline: 'none',
};

const buttonStyle = {
  border: '1px solid var(--ink)',
  borderRadius: 10,
  background: 'var(--ink)',
  color: 'var(--white)',
  padding: '10px 12px',
  fontSize: '.86rem',
  fontWeight: 700,
  cursor: 'pointer',
};

const okStyle = {
  marginTop: 14,
  marginBottom: 0,
  background: '#e8f8eb',
  border: '1px solid #bde5c5',
  color: '#245f34',
  borderRadius: 10,
  padding: '10px 12px',
};

const errorStyle = {
  marginTop: 10,
  marginBottom: 0,
  background: '#fff1f1',
  border: '1px solid #e9baba',
  color: '#9b3434',
  borderRadius: 10,
  padding: '10px 12px',
};
