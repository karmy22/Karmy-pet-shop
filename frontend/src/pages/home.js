import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/navbar';
import SiteFooter from '../components/siteFooter';
import BuildKitBuilder from '../components/buildKitBuilder';
import { useCart } from '../context/cartContext';
import { getFeaturedProducts } from '../data/catalog';
import { getVisibleSeasonalCollections, STORE_SPECIES } from '../data/navigation';

export default function Home() {
  const location = useLocation();
  const { addProduct } = useCart();
  const fullLogoPath = '/karmy-logo-full.png';
  const featuredProducts = getFeaturedProducts(4);
  const seasonalCollections = getVisibleSeasonalCollections();

  useEffect(() => {
    if (location.pathname === '/build-your-kit') {
      window.requestAnimationFrame(() => {
        const builder = document.getElementById('builder');
        if (builder) {
          builder.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  }, [location.pathname]);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: 'var(--cream)', minHeight: '100vh', color: 'var(--ink)' }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes popIn { from{opacity:0;transform:scale(.92)} to{opacity:1;transform:scale(1)} }
        .fade-up { animation: fadeUp .55s ease both; }
        .fade-up-2 { animation: fadeUp .55s .12s ease both; }
        .fade-up-3 { animation: fadeUp .55s .24s ease both; }
        .base-card {
          border: 2px solid var(--mist);
          border-radius: 20px;
          padding: 28px 24px;
          cursor: pointer;
          background: var(--white);
          transition: border-color .2s, box-shadow .2s, transform .18s;
          position: relative;
        }
        .base-card:hover { border-color: var(--teal); transform: translateY(-3px); box-shadow: 0 10px 30px rgba(74,124,138,.18); }
        .base-card.selected { border-color: var(--ink); box-shadow: 0 0 0 1px var(--ink); }
        .addon-chip {
          border: 1.5px solid var(--mist);
          border-radius: 14px;
          padding: 14px 16px;
          cursor: pointer;
          background: var(--white);
          transition: all .2s;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .addon-chip:hover { border-color: var(--teal); transform: translateY(-2px); }
        .addon-chip.selected { border-color: var(--ink); background: var(--ink); color: white; }
        .pill { display: inline-flex; align-items: center; gap: 5px; background: var(--terracotta); color: var(--white); font-size: .7rem; font-weight: 600; letter-spacing: .06em; padding: 3px 10px; border-radius: 20px; text-transform: uppercase; }
        .pill-outline { background: transparent; border: 1.5px solid currentColor; }
        .pill-green { background: var(--warm-soft); color: var(--warm-strong); }
        .step-dot { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: .75rem; font-weight: 700; transition: all .3s; }
        .step-dot.done { background: var(--ink); color: white; }
        .step-dot.active { background: var(--peach); color: var(--ink); }
        .step-dot.idle { background: var(--mist); color: var(--mid); }
        .btn-primary { background: var(--ink); color: white; border: none; border-radius: 12px; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 1rem; padding: 15px 32px; cursor: pointer; transition: background .2s, transform .12s; display: inline-flex; align-items: center; gap: 8px; }
        .btn-primary:hover { background: var(--ink-strong); transform: translateY(-1px); }
        .btn-primary:disabled { background: #ccc; cursor: not-allowed; transform: none; }
        .btn-lime { background: var(--terracotta); color: var(--white); border: none; border-radius: 12px; font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 1.05rem; padding: 16px 36px; cursor: pointer; transition: filter .2s, transform .12s; }
        .btn-lime:hover { filter: brightness(.92); transform: translateY(-1px); }
        .btn-ghost { background: transparent; border: 1.5px solid var(--mist); border-radius: 10px; font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: .9rem; color: var(--mid); padding: 10px 22px; cursor: pointer; transition: border-color .2s; }
        .btn-ghost:hover { border-color: var(--teal); color: var(--ink); }
        .price-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--mist); }
        .strikethrough { text-decoration: line-through; color: var(--mid); font-size: .85rem; }
        .free-tag { color: var(--warm-strong); font-weight: 700; font-size: .9rem; }
        .summary-card { background: var(--surface); border-radius: 20px; padding: 28px; border: 1.5px solid var(--mist); }
        .brand-lockup { width: clamp(136px, 18vw, 170px); height: auto; display: block; filter: drop-shadow(0 10px 18px rgba(74,124,138,.12)); }
        .hero-logo { width: min(300px, 58vw); height: auto; display: block; margin-bottom: 20px; filter: drop-shadow(0 12px 22px rgba(74,124,138,.17)); }
        .footer-mark { width: 62px; height: 62px; display: block; }
        .hero-surface { border-radius: 26px; border: 1px solid var(--mist); background: linear-gradient(160deg, rgba(255,255,255,.75), rgba(249,247,239,.9)); box-shadow: 0 16px 42px rgba(74,124,138,.13); padding: 36px; }
        .section-soft { background: transparent; }
        .store-card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 18px; }
        .store-entry-card {
          background: rgba(255,255,255,.84);
          border: 1px solid var(--mist);
          border-radius: 24px;
          padding: 24px;
          text-decoration: none;
          color: var(--ink);
          box-shadow: 0 14px 34px rgba(74,124,138,.08);
          transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
          display: block;
        }
        .store-entry-card:hover { transform: translateY(-4px); box-shadow: 0 18px 38px rgba(74,124,138,.13); border-color: var(--teal); }
        .store-entry-card h3 { font-family: 'Cormorant Garamond', serif; font-size: 1.7rem; margin-bottom: 10px; }
        .store-entry-card p { color: var(--mid); line-height: 1.7; font-size: .94rem; margin-bottom: 18px; }
        .store-mini-links { display: flex; flex-wrap: wrap; gap: 8px; }
        .store-mini-chip {
          display: inline-flex;
          align-items: center;
          padding: 7px 10px;
          border-radius: 999px;
          background: rgba(74,124,138,.08);
          color: var(--ink);
          font-size: .76rem;
          font-weight: 700;
        }
        .featured-product-card {
          background: rgba(255,255,255,.88);
          border: 1px solid var(--mist);
          border-radius: 22px;
          padding: 22px;
          box-shadow: 0 12px 30px rgba(74,124,138,.08);
        }
        .featured-product-card p { color: var(--mid); line-height: 1.6; font-size: .92rem; min-height: 68px; }
        .seasonal-banner {
          background: linear-gradient(145deg, rgba(244,194,145,.35), rgba(255,255,255,.8));
          border: 1px solid var(--mist);
          border-radius: 24px;
          padding: 24px;
        }
        .trust-row { background: linear-gradient(180deg, rgba(74,124,138,.1), rgba(74,124,138,.04)); border-top: 1px solid var(--mist); border-bottom: 1px solid var(--mist); }
        .site-footer { background: var(--surface-soft); border-top: 1px solid var(--mist); }
        @media (max-width: 700px) {
          .two-col { grid-template-columns: 1fr !important; }
          .addon-grid { grid-template-columns: 1fr 1fr !important; }
          .hero-surface { padding: 24px 18px; }
          .brand-lockup { width: 122px; }
          .hero-logo { width: min(250px, 72vw); }
        }
      `}</style>

      <Navbar />

      <section style={{ background: 'transparent', padding: '52px 6% 56px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -80, top: -80, width: 480, height: 480, borderRadius: '50%', background: 'rgba(232,155,95,.11)' }} />
        <div style={{ position: 'absolute', right: 80, bottom: -120, width: 300, height: 300, borderRadius: '50%', background: 'rgba(74,124,138,.09)' }} />
        <div className="hero-surface" style={{ maxWidth: 900, margin: '0 auto', position: 'relative' }}>
          <img className="hero-logo fade-up" src={fullLogoPath} alt="Karmy Pet Shop logo" onError={(event) => { event.currentTarget.style.display = 'none'; }} />
          <div className="pill fade-up" style={{ marginBottom: 20 }}>Clip &amp; Go System</div>
          <h1 className="fade-up-2" style={{ fontFamily: "'Cormorant Garamond', serif", color: 'var(--ink)', fontSize: 'clamp(2.6rem, 6vw, 4.5rem)', fontWeight: 700, lineHeight: 1.05, marginBottom: 20 }}>
            Build the kit
            <br />
            your dog or cat deserves.
          </h1>
          <p className="fade-up-3" style={{ color: 'var(--mid)', fontSize: '1.1rem', fontWeight: 400, lineHeight: 1.7, maxWidth: 600, marginBottom: 36 }}>
            Choose a harness or leash, then snap on the accessories you want. Every harness comes with{' '}
            <strong style={{ color: 'var(--terracotta)' }}>2 accessories free</strong> - mix, match, and customize.
          </p>
          <div className="fade-up-3" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              className="btn-lime"
              onClick={() => {
                const builder = document.getElementById('builder');
                if (builder) builder.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Start Building →
            </button>
            <Link className="btn-ghost" to="/shop/dog/harnesses" style={{ textDecoration: 'none' }}>
              Shop Dog Gear
            </Link>
            <div style={{ display: 'flex', gap: 20, marginLeft: 8 }}>
              {['Harness from $54.99', 'Leash from $24.99', 'Add-ons $12.99'].map((txt) => (
                <div key={txt} style={{ color: 'var(--mid)', fontSize: '.82rem', display: 'flex', alignItems: 'center', gap: 5 }}>
                  {txt}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '0 6% 56px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 20, flexWrap: 'wrap', marginBottom: 24 }}>
            <div>
              <div style={{ marginBottom: 10, color: 'var(--terracotta)', fontSize: '.78rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' }}>Storefront</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 4vw, 3.3rem)', margin: 0 }}>Shop by species</h2>
            </div>
            <p style={{ maxWidth: 500, color: 'var(--mid)', lineHeight: 1.7, margin: 0 }}>
              The main menu now supports dedicated dog and cat assortments, with category pages for clothes, harnesses, leashes, toys, gadgets, beds, training pads, trees, and hiking gear.
            </p>
          </div>

          <div className="store-card-grid">
            {STORE_SPECIES.map((species) => (
              <Link key={species.slug} className="store-entry-card" to={`/shop/${species.slug}/${species.categories[0].slug}`}>
                <div className="pill" style={{ marginBottom: 16 }}>{species.shortLabel}</div>
                <h3>{species.label}</h3>
                <p>{species.description}</p>
                <div className="store-mini-links">
                  {species.categories.filter((category) => category.visible).slice(0, 4).map((category) => (
                    <span key={category.slug} className="store-mini-chip">{category.label}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '0 6% 56px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: 18 }} className="two-col">
            <div className="seasonal-banner">
              <div style={{ marginBottom: 10, color: 'var(--terracotta)', fontSize: '.78rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' }}>Seasonal control</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginBottom: 12 }}>
                Seasonal pages can be switched on and off.
              </h2>
              <p style={{ color: 'var(--mid)', lineHeight: 1.7, marginBottom: 18 }}>
                Active collections are already routed. Hidden ones stay in the data model until you decide to publish them.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {seasonalCollections.map((collection) => (
                  <Link key={collection.slug} to={`/seasonal/${collection.slug}`} className="store-mini-chip" style={{ textDecoration: 'none' }}>
                    {collection.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="store-entry-card" style={{ background: 'rgba(255,252,244,.92)' }}>
              <div className="pill pill-green" style={{ marginBottom: 16 }}>Builder</div>
              <h3>Keep the custom kit flow</h3>
              <p>
                The storefront now supports shopping pages, but the existing harness-and-leash builder remains part of the homepage so you can keep selling configurable kits alongside catalog products.
              </p>
              <button
                className="btn-primary"
                onClick={() => {
                  const builder = document.getElementById('builder');
                  if (builder) builder.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Jump to Builder →
              </button>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '0 6% 56px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 20, flexWrap: 'wrap', marginBottom: 24 }}>
            <div>
              <div style={{ marginBottom: 10, color: 'var(--terracotta)', fontSize: '.78rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' }}>Featured assortment</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 4vw, 3.3rem)', margin: 0 }}>What shoppers can browse now</h2>
            </div>
          </div>

          <div className="store-card-grid">
            {featuredProducts.map((product) => (
              <article key={product.id} className="featured-product-card">
                <div className="pill" style={{ marginBottom: 14 }}>{product.badge}</div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: 8 }}>{product.name}</h3>
                <p>{product.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18 }}>
                  <strong style={{ fontSize: '1.15rem' }}>${product.price.toFixed(2)}</strong>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ padding: '10px 14px', fontSize: '.82rem' }}
                    onClick={() => addProduct(product)}
                  >
                    Add
                  </button>
                </div>
                <Link to={`/shop/${product.species}/${product.category}`} style={{ display: 'inline-block', marginTop: 12, color: 'var(--mid)', textDecoration: 'none', fontSize: '.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em' }}>
                  View category →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-soft" style={{ padding: '40px 6% 56px', borderBottom: '1px solid var(--mist)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 40 }}>
          {[
            { n: '1', title: 'Pick your base', body: 'Start with a harness or leash - the foundation of your kit.', accent: 'var(--peach)' },
            { n: '2', title: 'Choose add-ons', body: 'Snap on lights, treats, water, tags and more. Harness = 2 free.', accent: 'var(--terracotta)' },
            { n: '3', title: 'See your total', body: "Live pricing shows exactly what's free and what you're paying.", accent: 'var(--peach)' },
            { n: '4', title: 'Ships to your door', body: 'Drop-shipped fast. Every order arrives ready to clip & go.', accent: 'var(--terracotta)' },
          ].map((s) => (
            <div key={s.n}>
              <div style={{ width: 40, height: 40, background: s.accent, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem', marginBottom: 14 }}>{s.n}</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', fontWeight: 700, marginBottom: 6 }}>{s.title}</h3>
              <p style={{ color: 'var(--mid)', fontSize: '.9rem', lineHeight: 1.6 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <BuildKitBuilder />

      <section className="trust-row" style={{ padding: '36px 6%' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 24 }}>
          {['Ships in 1-3 days', 'Vet approved', 'Secure checkout', 'Real support'].map((txt) => (
            <div key={txt} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ink)', fontSize: '.88rem' }}>
              {txt}
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
