import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getVisibleSeasonalCollections, STORE_SPECIES, getVisibleSpecies } from '../data/navigation';
import { useAuth } from '../context/authContext';
import { useCart } from '../context/cartContext';
import { fetchProducts } from '../api/catalogApi';

function chunkLinks(links, perColumn = 4) {
  const chunks = [];
  for (let index = 0; index < links.length; index += perColumn) {
    chunks.push(links.slice(index, index + perColumn));
  }
  return chunks;
}

const TICKER_ITEMS = [
  { key: 'shipping', text: 'Free shipping on all orders' },
  { key: 'returns', text: '30-day returns' },
  { key: 'support', text: 'Customer support', to: '/contact-us' },
  { key: 'promo', text: 'New arrivals now live', to: '/shop/dog/clothes' },
];

function Navbar() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartPreviewOpen, setCartPreviewOpen] = useState(false);
  const [searchCatalog, setSearchCatalog] = useState([]);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [tickerPaused, setTickerPaused] = useState(false);
  const accountWrapRef = useRef(null);

  const seasonalCollections = useMemo(() => getVisibleSeasonalCollections(), []);
  const { user, logout, isAdmin } = useAuth() ?? {};
  const cartState = useCart() ?? {};
  const { items = [], itemCount = 0, subtotal = 0 } = cartState;
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    async function loadSearchCatalog() {
      try {
        const products = await fetchProducts();
        if (isMounted) {
          setSearchCatalog(products);
        }
      } catch (error) {
        if (isMounted) {
          setSearchCatalog([]);
        }
      }
    }

    loadSearchCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (tickerPaused) {
      return undefined;
    }

    const timer = setInterval(() => {
      setTickerIndex((current) => (current + 1) % TICKER_ITEMS.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [tickerPaused]);

  useEffect(() => {
    function handleDocumentClick(event) {
      if (accountWrapRef.current && !accountWrapRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
    }

    document.addEventListener('mousedown', handleDocumentClick);
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, []);

  const searchResults = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    if (!normalized) {
      return [];
    }

    return searchCatalog
      .filter((product) => product.name.toLowerCase().includes(normalized))
      .slice(0, 5)
      .map((product) => ({
        ...product,
        to: `/shop/${product.species}/${product.category}`,
      }));
  }, [searchCatalog, searchTerm]);

  const speciesMenus = useMemo(
    () =>
      getVisibleSpecies().map((species) => ({
        key: species.slug,
        label: species.label,
        description: species.description,
        links: species.categories
          .filter((category) => category.visible)
          .map((category) => ({
            to: `/shop/${species.slug}/${category.slug}`,
            label: category.label,
            description: category.description,
          })),
      })),
    []
  );

  const shopAllTo = speciesMenus[0]?.links[0]?.to || '/build-your-own-kit';

  const seasonalMenu = {
    key: 'seasonal',
    label: 'Seasonal',
    description: 'Browse by season in order: Spring, Summer, Autumn, and Winter.',
    links: ['spring', 'summer', 'autumn', 'winter']
      .map((season) => seasonalCollections.find((collection) => collection.seasonKey === season))
      .filter(Boolean)
      .map((collection) => ({
        to: `/seasonal/${collection.slug}`,
        label: collection.label,
        description: collection.description,
      })),
  };

  const supportMenu = {
    key: 'support',
    label: 'Help & Support',
    description: 'Support, FAQs, and details about Karmy.',
    links: [
      {
        to: '/faq',
        label: 'FAQ',
        description: 'Answers to common shopping and shipping questions.',
      },
      {
        to: '/contact-us',
        label: 'Contact Us',
        description: 'Support details and business hours.',
      },
      {
        to: '/about-us',
        label: 'About Us',
        description: 'Our mission and how Karmy is growing.',
      },
    ],
  };

  const buildMenu = {
    key: 'build',
    label: 'Build Your Kit',
    description: 'Create custom setups from one place.',
    links: [
      {
        to: '/build-your-own-kit',
        label: 'Start Kit Builder',
        description: 'Customize harness and leash bundles with add-ons in minutes.',
      },
    ],
  };

  const railItems = useMemo(
    () => [
      { key: 'shop-all', label: 'Shop All', type: 'link', to: shopAllTo },
      ...speciesMenus.map((menu) => ({ ...menu, type: 'menu' })),
      { ...seasonalMenu, type: 'menu' },
      { ...buildMenu, type: 'menu' },
      { ...supportMenu, type: 'menu' },
    ],
    [buildMenu, seasonalMenu, shopAllTo, speciesMenus, supportMenu]
  );

  const activeTicker = TICKER_ITEMS[tickerIndex];

  function renderPromoRail() {
    return (
      <aside className="store-mega-promo">
        <div className="store-mega-promo-card">
          <p className="store-mega-promo-kicker">Trending now</p>
          <h4>Explore New Arrivals</h4>
          <p>Fresh picks for dogs and cats, curated for comfort, style, and daily use.</p>
          <Link to="/shop/dog/clothes">Shop new arrivals</Link>
        </div>
        <div className="store-mega-promo-links">
          <Link to="/contact-us">Customer support</Link>
          <Link to="/faq">Shipping and returns</Link>
          <Link to="/build-your-own-kit">Build your kit</Link>
        </div>
      </aside>
    );
  }

  function renderMegaPanel(menuKey) {
    const speciesMenu = speciesMenus.find((item) => item.key === menuKey);
    if (speciesMenu) {
      const columns = chunkLinks(speciesMenu.links);
      return (
        <div className="store-mega-panel" onMouseEnter={() => setActiveMenu(menuKey)}>
          <div className="store-mega-panel-inner">
            <section className="store-mega-main">
              <header className="store-mega-header">
                <h3>{speciesMenu.label}</h3>
                <p>{speciesMenu.description}</p>
              </header>
              <div className="store-mega-grid">
                {columns.map((columnLinks, index) => (
                  <div key={`${speciesMenu.key}-col-${index}`} className="store-mega-column">
                    <h4>{index === 0 ? 'Popular now' : index === 1 ? 'Core categories' : 'More to explore'}</h4>
                    {columnLinks.map((link) => (
                      <Link key={link.to} className="store-dropdown-link" to={link.to}>
                        <strong>{link.label}</strong>
                        <span>{link.description}</span>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </section>
            {renderPromoRail()}
          </div>
        </div>
      );
    }

    const simpleMenu = [seasonalMenu, buildMenu, supportMenu].find((item) => item.key === menuKey);
    if (!simpleMenu) {
      return null;
    }

    return (
      <div className="store-mega-panel" onMouseEnter={() => setActiveMenu(menuKey)}>
        <div className="store-mega-panel-inner">
          <section className="store-mega-main">
            <header className="store-mega-header">
              <h3>{simpleMenu.label}</h3>
              <p>{simpleMenu.description}</p>
            </header>
            <div className="store-mega-grid store-mega-grid-simple">
              <div className="store-mega-column">
                <h4>Browse</h4>
                {simpleMenu.links.length > 0 ? simpleMenu.links.map((link) => (
                  <Link key={link.to} className="store-dropdown-link" to={link.to}>
                    <strong>{link.label}</strong>
                    <span>{link.description}</span>
                  </Link>
                )) : (
                  <div className="store-dropdown-link">
                    <strong>No seasonal pages are live</strong>
                    <span>Enable a seasonal collection to publish it in the navigation.</span>
                  </div>
                )}
              </div>
            </div>
          </section>
          {renderPromoRail()}
        </div>
      </div>
    );
  }

  return (
    <div
      className="store-nav-shell"
      onMouseLeave={() => {
        setActiveMenu(null);
      }}
    >
      <div
        className="store-utility-strip"
        role="note"
        aria-label="Store benefits and support links"
        onMouseEnter={() => setTickerPaused(true)}
        onMouseLeave={() => setTickerPaused(false)}
      >
        <div className="store-utility-inner">
          <button
            type="button"
            className="store-utility-arrow"
            aria-label="Previous utility message"
            onClick={() => setTickerIndex((current) => (current + TICKER_ITEMS.length - 1) % TICKER_ITEMS.length)}
          >
            &#8249;
          </button>
          <div className="store-utility-message" key={activeTicker.key}>
            {activeTicker.to ? <Link to={activeTicker.to}>{activeTicker.text}</Link> : <span>{activeTicker.text}</span>}
          </div>
          <button
            type="button"
            className="store-utility-arrow"
            aria-label="Next utility message"
            onClick={() => setTickerIndex((current) => (current + 1) % TICKER_ITEMS.length)}
          >
            &#8250;
          </button>
        </div>
      </div>

      <nav className="store-nav" aria-label="Primary">
        <div className="store-nav-main-row">
          <Link className="store-brand" to="/">
            <img
              src="/karmy-logo-full.png"
              alt="Karmy Pet Shop logo"
              onError={(event) => {
                event.currentTarget.style.display = 'none';
              }}
            />
          </Link>

          <div className="store-category-rail" role="navigation" aria-label="Shop categories">
            {railItems.map((item) => (
              item.type === 'link' ? (
                <Link key={item.key} className="store-menu-trigger" to={item.to}>{item.label}</Link>
              ) : (
                <button
                  key={item.key}
                  className={`store-menu-trigger ${activeMenu === item.key ? 'active' : ''}`}
                  type="button"
                  onMouseEnter={() => setActiveMenu(item.key)}
                  onFocus={() => setActiveMenu(item.key)}
                  aria-expanded={activeMenu === item.key}
                >
                  {item.label}
                </button>
              )
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
              <div
                ref={accountWrapRef}
                className="store-auth-wrap"
              >
                <button
                  type="button"
                  className="store-auth-btn store-auth-btn-in"
                  onClick={() => setAccountOpen((open) => !open)}
                  aria-expanded={accountOpen}
                >
                  My Account
                </button>
                {accountOpen && (
                  <div className="store-account-dropdown">
                    <div className="store-account-email">{user.displayName || user.email}</div>
                      <Link to="/dashboard" onClick={() => setAccountOpen(false)}>Dashboard</Link>
                      <Link to="/account" onClick={() => setAccountOpen(false)}>Account Overview</Link>
                      <Link to="/account/orders" onClick={() => setAccountOpen(false)}>Order History</Link>
                      <Link to="/account/profile" onClick={() => setAccountOpen(false)}>Profile & Shipping</Link>
                      {isAdmin && <Link to="/admin" onClick={() => setAccountOpen(false)}>Admin Dashboard</Link>}
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setAccountOpen(false);
                      }}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/login', { state: { from: '/account' } })}
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
            {mobileOpen ? 'x' : '☰'}
          </button>
        </div>
      </nav>

      {activeMenu && renderMegaPanel(activeMenu)}

      {mobileOpen && (
        <div className="store-mobile-menu">
          <div className="store-mobile-panel">
            <section className="store-mobile-group">
              <h3>Shop</h3>
              <div className="store-mobile-list">
                <Link to={shopAllTo} onClick={() => setMobileOpen(false)}>Shop All</Link>
                <Link to="/build-your-own-kit" onClick={() => setMobileOpen(false)}>Build Your Kit</Link>
                <Link to="/cart" onClick={() => setMobileOpen(false)}>Cart ({itemCount})</Link>
              </div>
            </section>

            {speciesMenus.map((item) => (
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
              <h3>Support</h3>
              <div className="store-mobile-list">
                {supportMenu.links.map((link) => (
                  <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}>{link.label}</Link>
                ))}
              </div>
            </section>

            {user ? (
              <section className="store-mobile-group">
                <h3>My Account</h3>
                <div className="store-mobile-list">
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                  <Link to="/account" onClick={() => setMobileOpen(false)}>Account Overview</Link>
                  <Link to="/account/orders" onClick={() => setMobileOpen(false)}>Order History</Link>
                  <Link to="/account/profile" onClick={() => setMobileOpen(false)}>Profile & Shipping</Link>
                  {isAdmin && <Link to="/admin" onClick={() => setMobileOpen(false)}>Admin Dashboard</Link>}
                </div>
              </section>
            ) : (
              <section className="store-mobile-group">
                <h3>Account</h3>
                <div className="store-mobile-list">
                  <Link to="/login" onClick={() => setMobileOpen(false)}>Sign in</Link>
                </div>
              </section>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
