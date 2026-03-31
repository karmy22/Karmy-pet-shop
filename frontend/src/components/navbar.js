import React from 'react';

function Navbar() {
  return (
    <nav className="top-nav" aria-label="Primary">
      <ul className="nav-links">
        <li><a href="#shop">Shop</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#about">About</a></li>
      </ul>
      <a className="nav-cta" href="#newsletter">Get 10% Off</a>
    </nav>
  );
}

export default Navbar;