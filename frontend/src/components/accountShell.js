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
        <header style={{ marginBottom: 20 }}>
          <h1 style={{ margin: '0 0 6px', fontFamily: "'Cormorant Garamond', serif", fontSize: '2.1rem' }}>{title}</h1>
          <p style={{ margin: 0, color: 'var(--mid)' }}>{subtitle}</p>
        </header>

        <nav style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 22 }}>
          <Link style={tabStyle(activeTab === 'overview')} to="/account">Overview</Link>
          <Link style={tabStyle(activeTab === 'orders')} to="/account/orders">Orders</Link>
          <Link style={tabStyle(activeTab === 'profile')} to="/account/profile">Profile</Link>
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
    background: active ? 'rgba(74,124,138,.08)' : 'rgba(255,255,255,.75)',
    borderRadius: 12,
    padding: '9px 12px',
    fontSize: '.84rem',
    fontWeight: 700,
  };
}
