import React, { useMemo, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { PRODUCT_CATALOG } from '../data/catalog';
import { getVisibleSeasonalCollections, STORE_SPECIES } from '../data/navigation';
import { useAuth } from '../context/authContext';
import { useCart } from '../context/cartContext';

function Navbar() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartPreviewOpen, setCartPreviewOpen] = useState(false);
  const seasonalCollections = getVisibleSeasonalCollections();
  const { user, logout } = useAuth() ?? {};
  const { items, itemCount, subtotal } = useCart();
  const navigate = useNavigate();

  const searchResults = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    if (!normalized) {
      return [];
    }

    return PRODUCT_CATALOG
      .filter((product) => product.name.toLowerCase().includes(normalized))
      .slice(0, 5)
      .map((product) => ({
        ...product,
        to: `/shop/${product.species}/${product.category}`,
      }));
  }, [searchTerm]);

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

          <div className="store-nav-actions">
            <div className="store-search-wrap">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M10.5 4a6.5 6.5 0 0 1 5.145 10.473l3.94 3.94a1 1 0 0 1-1.414 1.414l-3.94-3.94A6.5 6.5 0 1 1 10.5 4Zm0 2a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z" />
              </svg>
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search products"
                aria-label="Search products"
              />
              {searchTerm.trim() && (
                <div className="store-search-results">
                  {searchResults.length > 0 ? (
                    searchResults.map((result) => (
                      <Link
                        key={result.id}
                        to={result.to}
                        className="store-search-result"
                        onClick={() => setSearchTerm('')}
                      >
                        <strong>{result.name}</strong>
                        <span>${result.price.toFixed(2)}</span>
                      </Link>
                    ))
                  ) : (
                    <div className="store-search-empty">No matching products</div>
                  )}
                </div>
              )}
            </div>

            {user ? (
              <div className="store-auth-wrap">
                <span className="store-user-label">{user.displayName || user.email}</span>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="store-auth-btn store-auth-btn-out"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="store-auth-btn store-auth-btn-in"
              >
                Sign in
              </button>
            )}

            <div
              className="store-cart-wrap"
              onMouseEnter={() => setCartPreviewOpen(true)}
              onMouseLeave={() => setCartPreviewOpen(false)}
            >
              <button
                className="store-cart-icon"
                type="button"
                aria-label={`Open cart, ${itemCount} items`}
                onClick={() => navigate('/cart')}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 4.75A.75.75 0 0 1 3.75 4h1.52a1.5 1.5 0 0 1 1.46 1.15l.3 1.35h12.22a1.5 1.5 0 0 1 1.45 1.87l-1.17 4.68a1.5 1.5 0 0 1-1.46 1.15H9.08a1.5 1.5 0 0 1-1.46-1.17L6.05 5.75a.5.5 0 0 0-.48-.38H3.75A.75.75 0 0 1 3 4.75Zm6.73 7.95h8.34a.5.5 0 0 0 .49-.38l.92-3.67H8.84l.89 4a.5.5 0 0 0 .49.39ZM9.5 20a1.5 1.5 0 1 1 0-3.001A1.5 1.5 0 0 1 9.5 20Zm7 0a1.5 1.5 0 1 1 0-3.001A1.5 1.5 0 0 1 16.5 20Z" />
                </svg>
                <span>{itemCount}</span>
              </button>

              {cartPreviewOpen && (
                <div className="store-cart-preview">
                  <h4>Cart quick view</h4>
                  <p>{itemCount} item{itemCount === 1 ? '' : 's'} in cart</p>
                  <strong>Total: ${subtotal.toFixed(2)}</strong>
                  {items.slice(0, 3).map((item) => (
                    <div key={`${item.type}-${item.id}`} className="store-cart-preview-item">
                      <span>{item.name}</span>
                      <span>x{item.quantity}</span>
                    </div>
                  ))}
                  <button type="button" onClick={() => navigate('/cart')}>View full cart</button>
                </div>
              )}
            </div>
          </div>
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
  );
}

export default Navbar;