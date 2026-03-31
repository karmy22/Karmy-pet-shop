import React from 'react';
import { Link } from 'react-router-dom';

function SiteFooter() {
  return (
    <footer
      style={{
        padding: '28px 6%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12,
        background: 'var(--surface-soft)',
        borderTop: '1px solid var(--mist)',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <img
          style={{ width: 100, height: 125, objectFit: 'contain', display: 'block' }}
          src="/karmy-logo-mark.png"
          alt="Karmy Pet Shop mark"
          onError={(event) => {
            event.currentTarget.style.display = 'none';
          }}
        />
      </span>
      <span style={{ color: 'var(--mid)', fontSize: '.8rem' }}>© 2026 Karmy. All rights reserved.</span>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <Link to="/about" style={{ color: 'var(--mid)', fontSize: '.8rem', textDecoration: 'none' }}>About</Link>
        <Link to="/faq" style={{ color: 'var(--mid)', fontSize: '.8rem', textDecoration: 'none' }}>FAQ</Link>
        <span style={{ color: 'var(--mid)', fontSize: '.8rem' }}>Privacy</span>
        <span style={{ color: 'var(--mid)', fontSize: '.8rem' }}>Terms</span>
        <span style={{ color: 'var(--mid)', fontSize: '.8rem' }}>Contact</span>
      </div>
    </footer>
  );
}

export default SiteFooter;
