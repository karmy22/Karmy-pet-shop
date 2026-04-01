import React from 'react';
import { Link } from 'react-router-dom';

function SiteFooter() {
  return (
    <footer className="site-footer">
      <span className="site-footer-brand">
        <img
          src="/karmy-logo-mark.png"
          alt="Karmy Pet Shop mark"
          onError={(event) => {
            event.currentTarget.style.display = 'none';
          }}
        />
      </span>
      <span className="site-footer-copy">© 2026 Karmy. All rights reserved.</span>
      <div className="site-footer-links">
        <Link to="/about">About</Link>
        <Link to="/faq">FAQ</Link>
        <span>Privacy</span>
        <span>Terms</span>
        <span>Contact</span>
      </div>
    </footer>
  );
}

export default SiteFooter;
