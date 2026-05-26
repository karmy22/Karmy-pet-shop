import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './navbar';
import SiteFooter from './siteFooter';
import { useAuth } from '../context/authContext';

export default function AccountShell({ title, subtitle, activeTab, children }) {
  const { isAdmin } = useAuth();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', color: 'var(--ink)' }}>
      <Navbar />
      <main style={{ maxWidth: 1120, margin: '0 auto', padding: '28px 6% 48px' }}>
        <header style={heroStyle}>
          <p style={eyebrowStyle}>Secure customer account</p>
          <h1 style={{ margin: '0 0 8px', fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.1rem, 5vw, 3.4rem)' }}>{title}</h1>
          <p style={{ margin: 0, color: 'var(--mid)', lineHeight: 1.7, maxWidth: 720 }}>{subtitle}</p>
        </header>

        <nav style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 22 }} aria-label="Account navigation">
          <Link style={tabStyle(activeTab === 'overview')} to="/account">Overview</Link>
          <Link style={tabStyle(activeTab === 'orders')} to="/account/orders">Orders</Link>
          <Link style={tabStyle(activeTab === 'profile')} to="/account/profile">Profile</Link>
          <Link style={tabStyle(activeTab === 'addresses')} to="/account/addresses">Addresses</Link>
          <Link style={tabStyle(activeTab === 'rewards')} to="/account/rewards">Rewards</Link>
          <Link style={tabStyle(activeTab === 'guides')} to="/account/pet-care-guides">Pet care guides</Link>
          <Link style={tabStyle(false)} to="/forgot-password">Reset password</Link>
          {isAdmin && <Link style={tabStyle(activeTab === 'admin')} to="/admin">Admin</Link>}
        </nav>

        {children}
      </main>
      <SiteFooter />
    </div>
  );
}

function tabStyle(active) {
  return {
    textDecoration: 'none',
    border: active ? '1px solid var(--ink)' : '1px solid rgba(74,124,138,.24)',
    color: active ? 'var(--ink)' : 'var(--mid)',
    background: active ? 'rgba(74,124,138,.08)' : 'rgba(255,255,255,.82)',
    borderRadius: 12,
    padding: '9px 12px',
    fontSize: '.84rem',
    fontWeight: 700,
    boxShadow: active ? '0 8px 18px rgba(36,58,68,.08)' : 'none',
  };
}

const heroStyle = {
  marginBottom: 20,
  background: 'linear-gradient(135deg, rgba(255,255,255,.92), rgba(246,239,228,.9))',
  border: '1px solid rgba(74,124,138,.18)',
  borderRadius: 22,
  padding: '24px 24px',
  boxShadow: '0 18px 34px rgba(36,58,68,.08)',
};

const eyebrowStyle = {
  margin: '0 0 8px',
  color: 'var(--mid)',
  fontSize: '.75rem',
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '.12em',
};
