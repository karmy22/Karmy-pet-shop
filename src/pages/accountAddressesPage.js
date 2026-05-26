import React, { useEffect, useState } from 'react';
import AccountShell from '../components/accountShell';
import { useAuth } from '../context/authContext';

export default function AccountAddressesPage() {
  const { user } = useAuth();
  const [address, setAddress] = useState({
    street1: '',
    street2: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user?.uid) {
      return;
    }

    try {
      const savedProfile = JSON.parse(localStorage.getItem(`karmy-profile-${user.uid}`) || '{}');
      setAddress({
        street1: savedProfile.street1 || savedProfile.shippingAddress || '',
        street2: savedProfile.street2 || savedProfile.shippingAddress2 || '',
        city: savedProfile.city || savedProfile.shippingCity || '',
        state: savedProfile.state || savedProfile.shippingState || '',
        zipCode: savedProfile.zipCode || savedProfile.shippingPostalCode || '',
      });
    } catch (error) {
      setAddress({ street1: '', street2: '', city: '', state: '', zipCode: '' });
    }
  }, [user]);

  function handleChange(event) {
    const { name, value } = event.target;
    setAddress((current) => ({ ...current, [name]: value }));
  }

  function handleSave(event) {
    event.preventDefault();

    if (!user?.uid) {
      return;
    }

    const currentProfile = JSON.parse(localStorage.getItem(`karmy-profile-${user.uid}`) || '{}');
    const nextProfile = {
      ...currentProfile,
      street1: address.street1.trim(),
      street2: address.street2.trim(),
      city: address.city.trim(),
      state: address.state.trim(),
      zipCode: address.zipCode.trim(),
      shippingAddress: address.street1.trim(),
      shippingAddress2: address.street2.trim(),
      shippingCity: address.city.trim(),
      shippingState: address.state.trim(),
      shippingPostalCode: address.zipCode.trim(),
    };

    localStorage.setItem(`karmy-profile-${user.uid}`, JSON.stringify(nextProfile));
    setMessage('Saved address updated for faster checkout.');
  }

  return (
    <AccountShell
      title="My addresses"
      subtitle="Save your preferred shipping details so future orders feel simple, accurate, and secure."
      activeTab="addresses"
    >
      <section style={panelStyle}>
        <h2 style={headingStyle}>Saved shipping address</h2>
        <p style={mutedStyle}>Use a complete address to help reduce delivery delays and checkout errors.</p>

        <form onSubmit={handleSave} style={{ display: 'grid', gap: 11, maxWidth: 620, marginTop: 16 }}>
          <Field label="Street address 1" name="street1" value={address.street1} onChange={handleChange} autoComplete="address-line1" placeholder="123 Main St" />
          <Field label="Street address 2" name="street2" value={address.street2} onChange={handleChange} autoComplete="address-line2" placeholder="Apt, suite, unit (optional)" />
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr .8fr .8fr', gap: 10 }}>
            <Field label="City" name="city" value={address.city} onChange={handleChange} autoComplete="address-level2" placeholder="City" />
            <Field label="State" name="state" value={address.state} onChange={handleChange} autoComplete="address-level1" placeholder="State" />
            <Field label="Zip" name="zipCode" value={address.zipCode} onChange={handleChange} autoComplete="postal-code" placeholder="Zip" />
          </div>
          <button type="submit" style={buttonStyle}>Save address</button>
        </form>

        {message && <p style={okStyle}>{message}</p>}
      </section>
    </AccountShell>
  );
}

function Field({ label, name, value, onChange, autoComplete, placeholder }) {
  return (
    <label style={{ display: 'grid', gap: 6, fontWeight: 700, fontSize: '.85rem' }}>
      {label}
      <input
        name={name}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        placeholder={placeholder}
        style={inputStyle}
      />
    </label>
  );
}

const panelStyle = {
  background: 'rgba(255,255,255,.92)',
  border: '1px solid rgba(74,124,138,.2)',
  borderRadius: 16,
  padding: '18px 18px',
  boxShadow: '0 12px 24px rgba(36,58,68,.08)',
};

const headingStyle = { marginTop: 0, marginBottom: 8, fontSize: '1.05rem' };
const mutedStyle = { margin: 0, color: 'var(--mid)', lineHeight: 1.6 };
const inputStyle = { border: '1px solid var(--mist)', borderRadius: 10, padding: '11px 12px', fontSize: '.93rem', outline: 'none' };
const buttonStyle = { border: '1px solid var(--ink)', borderRadius: 10, background: 'var(--ink)', color: 'var(--white)', padding: '10px 12px', fontSize: '.86rem', fontWeight: 700, cursor: 'pointer', width: 'fit-content' };
const okStyle = { marginTop: 14, marginBottom: 0, background: '#e8f8eb', border: '1px solid #bde5c5', color: '#245f34', borderRadius: 10, padding: '10px 12px' };
