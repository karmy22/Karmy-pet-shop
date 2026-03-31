import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AccountShell from '../components/accountShell';
import { useAuth } from '../context/authContext';

export default function AccountProfilePage() {
  const { user, updateDisplayName, sendPasswordReset } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    try {
      await updateDisplayName(displayName);
      setMessage('Display name updated.');
    } catch (saveError) {
      setError(saveError.message || 'Could not update profile right now.');
    } finally {
      setSaving(false);
    }
  }

  async function handleResetEmail() {
    if (!user?.email) {
      return;
    }

    setError('');
    setMessage('');
    try {
      await sendPasswordReset(user.email);
      setMessage(`Password reset email sent to ${user.email}.`);
      setTimeout(() => navigate('/forgot-password'), 900);
    } catch (resetError) {
      setError(resetError.message || 'Could not send reset email right now.');
    }
  }

  return (
    <AccountShell
      title="Profile settings"
      subtitle="Update your display name and keep your account access secure."
      activeTab="profile"
    >
      <section style={panelStyle}>
        <h2 style={{ marginTop: 0, marginBottom: 12, fontSize: '1.04rem' }}>Identity</h2>
        <p style={{ color: 'var(--mid)', margin: '0 0 14px' }}>Signed in as {user?.email || 'unknown email'}.</p>

        <form onSubmit={handleSave} style={{ display: 'grid', gap: 10, maxWidth: 480 }}>
          <label style={{ fontWeight: 700, fontSize: '.85rem' }}>Display name</label>
          <input
            type="text"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="How your name appears in Karmy"
            style={inputStyle}
          />
          <button type="submit" disabled={saving} style={buttonStyle}>
            {saving ? 'Saving...' : 'Save profile'}
          </button>
        </form>

        <div style={{ marginTop: 18, display: 'grid', gap: 8 }}>
          <button type="button" onClick={handleResetEmail} style={ghostButtonStyle}>Send password reset email</button>
        </div>

        {message && <p style={okStyle}>{message}</p>}
        {error && <p style={errorStyle}>{error}</p>}
      </section>
    </AccountShell>
  );
}

const panelStyle = {
  background: 'rgba(255,255,255,.92)',
  border: '1px solid rgba(74,124,138,.2)',
  borderRadius: 16,
  padding: '18px 18px',
  boxShadow: '0 12px 24px rgba(36,58,68,.08)',
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

const ghostButtonStyle = {
  border: '1px solid rgba(74,124,138,.25)',
  borderRadius: 10,
  background: 'rgba(255,255,255,.8)',
  color: 'var(--ink)',
  padding: '10px 12px',
  fontSize: '.84rem',
  fontWeight: 700,
  width: 'fit-content',
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
