import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AccountShell from '../components/accountShell';
import { useAuth } from '../context/authContext';

export default function AccountProfilePage() {
  const { user, updateDisplayName, sendPasswordReset } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    birthdate: '',
    street1: '',
    street2: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const nextProfile = {
      name: user?.displayName || '',
      email: user?.email || '',
      birthdate: '',
      street1: '',
      street2: '',
      city: '',
      state: '',
      zipCode: '',
    };

    if (!user?.uid) {
      setProfile(nextProfile);
      return;
    }

    try {
      const rawProfile = localStorage.getItem(`karmy-profile-${user.uid}`);
      if (rawProfile) {
        const saved = JSON.parse(rawProfile);
        const parsedAddress = parseLegacyAddress(saved.address);

        setProfile({
          name: saved.name || nextProfile.name,
          email: saved.email || nextProfile.email,
          birthdate: saved.birthdate || '',
          street1: saved.street1 || saved.shippingAddress || parsedAddress.street1,
          street2: saved.street2 || saved.shippingAddress2 || parsedAddress.street2,
          city: saved.city || saved.shippingCity || parsedAddress.city,
          state: saved.state || saved.shippingState || parsedAddress.state,
          zipCode: saved.zipCode || saved.shippingPostalCode || parsedAddress.zipCode,
        });
        return;
      }
    } catch (loadError) {
      // Fall back to auth identity fields when saved profile cannot be read.
    }

    setProfile(nextProfile);
  }, [user]);

  function handleFieldChange(event) {
    const { name, value } = event.target;
    setProfile((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSave(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const nextProfile = {
        name: profile.name.trim(),
        email: profile.email.trim(),
        birthdate: profile.birthdate,
        street1: profile.street1.trim(),
        street2: profile.street2.trim(),
        city: profile.city.trim(),
        state: profile.state.trim(),
        zipCode: profile.zipCode.trim(),
      };

      if (nextProfile.name) {
        await updateDisplayName(nextProfile.name);
      }

      if (user?.uid) {
        localStorage.setItem(
          `karmy-profile-${user.uid}`,
          JSON.stringify({
            ...nextProfile,
            address: toLegacyAddress(nextProfile),
            shippingAddress: nextProfile.street1,
            shippingAddress2: nextProfile.street2,
            shippingCity: nextProfile.city,
            shippingState: nextProfile.state,
            shippingPostalCode: nextProfile.zipCode,
          }),
        );
      }

      setProfile(nextProfile);
      setMessage('Profile details saved.');
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
      subtitle="Update your personal details and keep your account access secure."
      activeTab="profile"
    >
      <section style={panelStyle}>
        <h2 style={{ marginTop: 0, marginBottom: 12, fontSize: '1.04rem' }}>Personal details</h2>
        <p style={{ color: 'var(--mid)', margin: '0 0 14px' }}>Signed in as {user?.email || 'unknown email'}.</p>

        <form onSubmit={handleSave} style={{ display: 'grid', gap: 10, maxWidth: 540 }}>
          <label style={{ fontWeight: 700, fontSize: '.85rem' }}>Full name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleFieldChange}
            autoComplete="name"
            placeholder="How your name appears in Karmy"
            style={inputStyle}
          />

          <label style={{ fontWeight: 700, fontSize: '.85rem' }}>Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleFieldChange}
            autoComplete="email"
            placeholder="you@example.com"
            style={inputStyle}
          />

          <label style={{ fontWeight: 700, fontSize: '.85rem' }}>Birthdate</label>
          <input
            type="date"
            name="birthdate"
            value={profile.birthdate}
            onChange={handleFieldChange}
            style={inputStyle}
          />

          <label style={{ fontWeight: 700, fontSize: '.85rem' }}>Street address 1</label>
          <input
            type="text"
            name="street1"
            value={profile.street1}
            onChange={handleFieldChange}
            autoComplete="address-line1"
            placeholder="123 Main St"
            style={inputStyle}
          />

          <label style={{ fontWeight: 700, fontSize: '.85rem' }}>Street address 2</label>
          <input
            type="text"
            name="street2"
            value={profile.street2}
            onChange={handleFieldChange}
            autoComplete="address-line2"
            placeholder="Apt, suite, unit (optional)"
            style={inputStyle}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr .8fr .8fr', gap: 10 }}>
            <div>
              <label style={{ fontWeight: 700, fontSize: '.85rem', display: 'block', marginBottom: 6 }}>City</label>
              <input
                type="text"
                name="city"
                value={profile.city}
                onChange={handleFieldChange}
                autoComplete="address-level2"
                placeholder="City"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ fontWeight: 700, fontSize: '.85rem', display: 'block', marginBottom: 6 }}>State</label>
              <input
                type="text"
                name="state"
                value={profile.state}
                onChange={handleFieldChange}
                autoComplete="address-level1"
                placeholder="State"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ fontWeight: 700, fontSize: '.85rem', display: 'block', marginBottom: 6 }}>Zip code</label>
              <input
                type="text"
                name="zipCode"
                value={profile.zipCode}
                onChange={handleFieldChange}
                autoComplete="postal-code"
                placeholder="Zip"
                style={inputStyle}
              />
            </div>
          </div>

          <p style={{ margin: 0, color: 'var(--mid)', fontSize: '.78rem' }}>
            Address can auto-populate from your saved profile and browser autofill.
          </p>

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

function parseLegacyAddress(address) {
  const parts = `${address || ''}`
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  return {
    street1: parts[0] || '',
    street2: parts[1] || '',
    city: parts[2] || '',
    state: parts[3] || '',
    zipCode: parts[4] || '',
  };
}

function toLegacyAddress(profile) {
  return [profile.street1, profile.street2, profile.city, profile.state, profile.zipCode]
    .map((value) => `${value || ''}`.trim())
    .filter(Boolean)
    .join(', ');
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
