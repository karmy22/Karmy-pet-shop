import React, { useMemo, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { getVisibleSeasonalCollections, STORE_SPECIES } from '../data/navigation';
import { useAuth } from '../context/authContext';

function Navbar() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const seasonalCollections = useMemo(() => getVisibleSeasonalCollections(), []);
  const { user, logout } = useAuth() ?? {};
  const navigate = useNavigate();

  const menuItems = STORE_SPECIES.map((species) => ({
    key: species.slug,
    label: species.label,
    description: species.description,
    links: species.categories.filter((category) => category.visible).map((category) => ({
      to: `/shop/${species.slug}/${category.slug}`,
      label: category.label,
      description: category.description,
    })),
  }));

  const seasonalMenu = {
    key: 'seasonal',
    label: 'Seasonal',
    description: 'Collections you can switch on and off as the season changes.',
    links: seasonalCollections.map((collection) => ({
      to: `/seasonal/${collection.slug}`,
      label: collection.label,
      description: collection.description,
    })),
  };

  const directLinks = [
    { to: '/', label: 'Store Home' },
    { to: '/build-your-kit', label: 'Build Your Kit' },
    { to: '/about', label: 'About' },
    { to: '/faq', label: 'FAQ' },
  ];

  return (
    <>
      <style>{`
        .store-nav-shell {
          position: sticky;
          top: 0;
          z-index: 120;
          backdrop-filter: blur(12px);
          background: rgba(249, 247, 239, 0.94);
          border-bottom: 1px solid var(--mist);
        }
        .store-nav {
          max-width: 1240px;
          margin: 0 auto;
          padding: 10px 6%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 22px;
        }
        .store-brand {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          text-decoration: none;
          color: var(--ink);
        }
        .store-brand img {
          width: clamp(132px, 16vw, 172px);
          height: auto;
          display: block;
        }
        .store-nav-links {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          justify-content: center;
        }
        .store-menu-trigger,
        .store-nav-link {
          border: none;
          background: transparent;
          color: var(--mid);
          text-decoration: none;
          font: inherit;
          font-size: .9rem;
          font-weight: 700;
          padding: 12px 14px;
          border-radius: 999px;
          cursor: pointer;
          transition: color .2s ease, background .2s ease;
        }
        .store-menu-trigger:hover,
        .store-nav-link:hover,
        .store-nav-link.active {
          color: var(--ink);
          background: rgba(74,124,138,.08);
        }
        .store-cart {
          border: none;
          border-radius: 12px;
          padding: 11px 18px;
          background: var(--ink);
          color: white;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
        }
        .store-dropdown-wrap {
          position: relative;
        }
        .store-dropdown {
          position: absolute;
          left: 0;
          top: calc(100% + 10px);
          min-width: 360px;
          padding: 18px;
          background: rgba(255,252,244,.98);
          border: 1px solid var(--mist);
          border-radius: 22px;
          box-shadow: 0 18px 40px rgba(57,101,112,.14);
        }
        .store-dropdown h3 {
          margin: 0 0 6px;
          font-size: 1rem;
        }
        .store-dropdown p {
          margin: 0 0 12px;
          color: var(--mid);
          line-height: 1.5;
          font-size: .85rem;
        }
        .store-dropdown-grid {
          display: grid;
          gap: 10px;
        }
        .store-dropdown-link {
          display: block;
          text-decoration: none;
          color: var(--ink);
          padding: 12px 14px;
          border-radius: 16px;
          background: rgba(255,255,255,.78);
          border: 1px solid var(--mist);
        }
        .store-dropdown-link span {
          display: block;
        }
        .store-dropdown-link strong {
          display: block;
          margin-bottom: 4px;
        }
        .store-dropdown-link:hover {
          border-color: var(--teal);
          transform: translateY(-1px);
        }
        .store-mobile-toggle {
          display: none;
          border: none;
          background: rgba(74,124,138,.08);
          color: var(--ink);
          font-size: 1.1rem;
          width: 44px;
          height: 44px;
          border-radius: 12px;
          cursor: pointer;
        }
        .store-mobile-menu {
          display: none;
          padding: 0 6% 18px;
          max-width: 1240px;
          margin: 0 auto;
        }
        .store-mobile-panel {
          background: rgba(255,252,244,.98);
          border: 1px solid var(--mist);
          border-radius: 22px;
          padding: 18px;
          box-shadow: 0 18px 40px rgba(57,101,112,.10);
        }
        .store-mobile-group + .store-mobile-group {
          margin-top: 18px;
          padding-top: 18px;
          border-top: 1px solid var(--mist);
        }
        .store-mobile-group h3 {
          margin: 0 0 10px;
        }
        .store-mobile-list {
          display: grid;
          gap: 8px;
        }
        .store-mobile-list a {
          text-decoration: none;
          color: var(--ink);
          padding: 10px 12px;
          border-radius: 12px;
          background: rgba(74,124,138,.05);
        }
        @media (max-width: 1024px) {
          .store-nav-links,
          .store-cart {
            display: none;
          }
          .store-mobile-toggle,
          .store-mobile-menu {
            display: block;
          }
          .store-nav {
            justify-content: space-between;
          }
        }
      `}</style>
      <div className="store-nav-shell" onMouseLeave={() => setActiveMenu(null)}>
        <nav className="store-nav" aria-label="Primary">
          <Link className="store-brand" to="/">
            <img
              src="/karmy-logo-full.png"
              alt="Karmy Pet Shop logo"
              onError={(event) => {
                event.currentTarget.style.display = 'none';
              }}
            />
          </Link>

          <div className="store-nav-links">
            {menuItems.map((item) => (
              <div
                key={item.key}
                className="store-dropdown-wrap"
                onMouseEnter={() => setActiveMenu(item.key)}
              >
                <button className="store-menu-trigger" type="button">
                  {item.label}
                </button>
                {activeMenu === item.key && (
                  <div className="store-dropdown">
                    <h3>{item.label}</h3>
                    <p>{item.description}</p>
                    <div className="store-dropdown-grid">
                      {item.links.map((link) => (
                        <Link key={link.to} className="store-dropdown-link" to={link.to}>
                          <strong>{link.label}</strong>
                          <span>{link.description}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div
              className="store-dropdown-wrap"
              onMouseEnter={() => setActiveMenu(seasonalMenu.key)}
            >
              <button className="store-menu-trigger" type="button">{seasonalMenu.label}</button>
              {activeMenu === seasonalMenu.key && (
                <div className="store-dropdown">
                  <h3>{seasonalMenu.label}</h3>
                  <p>{seasonalMenu.description}</p>
                  <div className="store-dropdown-grid">
                    {seasonalMenu.links.length > 0 ? seasonalMenu.links.map((link) => (
                      <Link key={link.to} className="store-dropdown-link" to={link.to}>
                        <strong>{link.label}</strong>
                        <span>{link.description}</span>
                      </Link>
                    )) : <div className="store-dropdown-link"><strong>No seasonal pages are live</strong><span>Flip a `visible` flag in the navigation data to publish one.</span></div>}
                  </div>
                </div>
              )}
            </div>

            {directLinks.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} className="store-nav-link">
                {item.label}
              </NavLink>
            ))}
          </div>

          <button className="store-cart" type="button">Cart (0)</button>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '.82rem', color: 'var(--mid)', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.displayName || user.email}
              </span>
              <button
                type="button"
                onClick={() => logout()}
                style={{ border: '1.5px solid var(--mist)', borderRadius: 8, padding: '6px 14px', background: 'transparent', fontFamily: "'DM Sans', sans-serif", fontSize: '.82rem', fontWeight: 600, color: 'var(--mid)', cursor: 'pointer' }}
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/login')}
              style={{ border: 'none', borderRadius: 8, padding: '8px 18px', background: 'var(--ink)', fontFamily: "'DM Sans', sans-serif", fontSize: '.85rem', fontWeight: 700, color: 'white', cursor: 'pointer' }}
            >
              Sign in
            </button>
          )}
          <button
            className="store-mobile-toggle"
            type="button"
            aria-expanded={mobileOpen}
            aria-label="Toggle store menu"
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? '×' : '☰'}
          </button>
        </nav>

        {mobileOpen && (
          <div className="store-mobile-menu">
            <div className="store-mobile-panel">
              {menuItems.map((item) => (
                <section key={item.key} className="store-mobile-group">
                  <h3>{item.label}</h3>
                  <div className="store-mobile-list">
                    {item.links.map((link) => (
                      <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}>{link.label}</Link>
                    ))}
                  </div>
                </section>
              ))}

              <section className="store-mobile-group">
                <h3>Seasonal</h3>
                <div className="store-mobile-list">
                  {seasonalMenu.links.map((link) => (
                    <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}>{link.label}</Link>
                  ))}
                </div>
              </section>

              <section className="store-mobile-group">
                <h3>More</h3>
                <div className="store-mobile-list">
                  {directLinks.map((item) => (
                    <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)}>{item.label}</Link>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Navbar;