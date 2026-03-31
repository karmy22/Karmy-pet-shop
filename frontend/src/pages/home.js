import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/navbar';
import SiteFooter from '../components/siteFooter';
import { useCart } from '../context/cartContext';
import { getFeaturedProducts } from '../data/catalog';

export default function Home() {
  const { addProduct } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadFeatured() {
      try {
        const products = await getFeaturedProducts(8);
        if (isMounted) {
          setFeaturedProducts(products);
        }
      } catch (error) {
        if (isMounted) {
          setFeaturedProducts([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingFeatured(false);
        }
      }
    }

    loadFeatured();
    return () => {
      isMounted = false;
    };
  }, []);

  const featuredShowcaseProducts = featuredProducts.slice(0, 3);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: 'var(--cream)', minHeight: '100vh', color: 'var(--ink)' }}>
      <style>{`
        .home-hero-grid {
          display: grid;
          grid-template-columns: 1.05fr .95fr;
          gap: 20px;
        }
        .home-hero-copy {
          border-radius: 26px;
          border: 1px solid rgba(74,124,138,.2);
          background: linear-gradient(98deg, rgba(236,244,252,.94) 0%, rgba(250,246,239,.92) 100%);
          box-shadow: 0 18px 40px rgba(55,82,92,.12);
          padding: 34px;
        }
        .home-hero-actions {
          margin-top: 22px;
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .home-cta-primary,
        .home-cta-secondary {
          text-decoration: none;
          border-radius: 12px;
          padding: 11px 16px;
          font-size: .88rem;
          font-weight: 700;
          letter-spacing: .02em;
        }
        .home-cta-primary {
          background: var(--ink);
          color: var(--white);
          border: 1px solid var(--ink);
        }
        .home-cta-secondary {
          color: var(--ink);
          border: 1px solid var(--mist);
          background: rgba(255,255,255,.75);
        }
        .home-photo-placeholder {
          min-height: 340px;
          border-radius: 140px;
          border: 1px solid rgba(74,124,138,.26);
          background:
            linear-gradient(180deg, rgba(248,211,141,.92), rgba(243,131,55,.95));
          display: grid;
          place-items: center;
          text-align: center;
          padding: 26px;
          color: var(--mid);
        }
        .quick-shop-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
          gap: 14px;
        }
        .quick-shop-card {
          display: block;
          text-decoration: none;
          color: var(--ink);
          background: rgba(255,255,255,.9);
          border: 1px solid rgba(74,124,138,.18);
          border-radius: 14px;
          padding: 18px;
          box-shadow: 0 12px 28px rgba(74,124,138,.09);
          transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
        }
        .quick-shop-card:hover {
          transform: translateY(-2px);
          border-color: var(--teal);
          box-shadow: 0 12px 28px rgba(74,124,138,.12);
        }
        .quick-shop-kicker {
          margin: 0 0 6px;
          color: var(--terracotta);
          font-size: .72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .08em;
        }
        .featured-product-card {
          background: rgba(255,255,255,.94);
          border: 1px solid rgba(74,124,138,.18);
          border-radius: 14px;
          padding: 18px;
          box-shadow: 0 12px 28px rgba(74,124,138,.08);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .featured-product-card.pet-border {
          position: relative;
          border: 1px solid rgba(74,124,138,.22);
          background:
            linear-gradient(180deg, rgba(255,255,255,.96), rgba(255,252,244,.94));
          box-shadow: 0 18px 34px rgba(74,124,138,.12);
        }
        .featured-product-card.pet-border::before {
          content: attr(data-animal);
          position: absolute;
          top: 12px;
          right: 12px;
          font-size: .72rem;
          letter-spacing: .06em;
          text-transform: uppercase;
          padding: 4px 9px;
          border-radius: 999px;
          color: var(--ink);
          background: rgba(244,194,145,.34);
          border: 1px solid rgba(74,124,138,.18);
          font-weight: 700;
        }
        .staggered-pet-grid {
          display: grid;
          grid-template-columns: .92fr 1fr .92fr;
          gap: 18px;
          align-items: start;
        }
        .staggered-pet-grid .featured-product-card {
          min-height: 470px;
        }
        .staggered-pet-grid .featured-product-card:nth-child(2) {
          margin-top: 26px;
        }
        .staggered-pet-grid .featured-product-card:nth-child(3) {
          margin-top: 52px;
        }
        .featured-image-slot {
          width: 100%;
          aspect-ratio: 16 / 10;
          border-radius: 16px;
          border: 1px solid rgba(74,124,138,.15);
          background: linear-gradient(135deg, rgba(244,194,145,.32), rgba(74,124,138,.14));
          display: flex;
          align-items: end;
          justify-content: space-between;
          padding: 12px;
        }
        .featured-image-slot.portrait {
          aspect-ratio: 4 / 5.4;
          align-items: start;
        }
        .featured-image-slot span {
          font-size: .72rem;
          font-weight: 700;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: var(--ink);
          background: rgba(255,255,255,.72);
          border-radius: 999px;
          padding: 5px 10px;
        }
        .pill {
          display: inline-flex;
          align-items: center;
          background: var(--terracotta);
          color: var(--white);
          font-size: .7rem;
          font-weight: 600;
          letter-spacing: .06em;
          padding: 3px 10px;
          border-radius: 20px;
          text-transform: uppercase;
        }
        .btn-primary {
          background: var(--ink);
          color: white;
          border: none;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: .92rem;
          padding: 10px 14px;
          cursor: pointer;
        }
        .trust-strip {
          margin-top: 26px;
          border-radius: 20px;
          border: 1px solid var(--mist);
          background: rgba(255,255,255,.84);
          padding: 18px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }
        .trust-pill {
          border: 1px solid rgba(74,124,138,.12);
          border-radius: 14px;
          background: rgba(249,247,239,.72);
          padding: 12px;
        }
        .trust-pill strong {
          display: block;
          font-size: .88rem;
          margin-bottom: 4px;
        }
        .trust-pill span {
          color: var(--mid);
          font-size: .8rem;
          line-height: 1.5;
        }
        @media (max-width: 900px) {
          .home-hero-grid {
            grid-template-columns: 1fr;
          }
          .home-photo-placeholder {
            min-height: 240px;
          }
          .staggered-pet-grid {
            grid-template-columns: 1fr;
          }
          .staggered-pet-grid .featured-product-card {
            min-height: unset;
          }
          .staggered-pet-grid .featured-product-card:nth-child(2),
          .staggered-pet-grid .featured-product-card:nth-child(3) {
            margin-top: 0;
          }
          .trust-strip {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <Navbar />

      <section style={{ padding: '52px 6% 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="home-hero-grid">
            <div className="home-hero-copy">
              <div style={{ marginBottom: 12, color: 'var(--terracotta)', fontSize: '.78rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' }}>
                Build Your Own Kit
              </div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.6rem, 5vw, 4.4rem)', margin: '0 0 12px', lineHeight: 1.03 }}>
                Build a better everyday setup for your pet.
              </h1>
              <p style={{ color: 'var(--mid)', maxWidth: 760, lineHeight: 1.7, margin: '0 0 18px' }}>
                Start with our custom Build Your Own Kit flow, then explore dog and cat categories with a cleaner menu built for quick shopping.
              </p>
              <div className="home-hero-actions">
                <Link to="/build-your-own-kit" className="home-cta-primary">Start Building</Link>
                <Link to="/shop/dog/harnesses" className="home-cta-secondary">Shop Dog Essentials</Link>
              </div>
            </div>

            <div className="home-photo-placeholder">
              <div>
                <div style={{ fontWeight: 700, fontSize: '.95rem', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 8 }}>
                  Pet Photo Spotlight
                </div>
                <div style={{ fontSize: '.92rem', lineHeight: 1.7 }}>
                  Place your lead hero photo here from Unsplash or Pexels to anchor the page with real pet lifestyle imagery.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '0 6% 44px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <div className="quick-shop-grid">
            <Link className="quick-shop-card" to="/shop/dog/harnesses">
              <p className="quick-shop-kicker">Shop by Species</p>
              <h3 style={{ fontSize: '1.08rem', margin: '0 0 8px' }}>Dogs</h3>
              <p style={{ margin: 0, color: 'var(--mid)', lineHeight: 1.6 }}>Harnesses, leashes, toys, beds, and outdoor picks for dogs.</p>
            </Link>
            <Link className="quick-shop-card" to="/shop/cat/trees">
              <p className="quick-shop-kicker">Shop by Species</p>
              <h3 style={{ fontSize: '1.08rem', margin: '0 0 8px' }}>Cats</h3>
              <p style={{ margin: 0, color: 'var(--mid)', lineHeight: 1.6 }}>Trees, toys, beds, and comfort gear built for cats.</p>
            </Link>
            <Link className="quick-shop-card" to="/seasonal/spring-trail-essentials">
              <p className="quick-shop-kicker">Shop by Season</p>
              <h3 style={{ fontSize: '1.08rem', margin: '0 0 8px' }}>Seasonal Collections</h3>
              <p style={{ margin: 0, color: 'var(--mid)', lineHeight: 1.6 }}>Limited-time collections organized by season and activity.</p>
            </Link>
            <Link className="quick-shop-card" to="/shop/dog/gadgets">
              <p className="quick-shop-kicker">Shop by Category</p>
              <h3 style={{ fontSize: '1.08rem', margin: '0 0 8px' }}>Accessories & Gadgets</h3>
              <p style={{ margin: 0, color: 'var(--mid)', lineHeight: 1.6 }}>Smart gear, travel helpers, and everyday add-ons.</p>
            </Link>
          </div>
        </div>
      </section>

      <section style={{ padding: '0 6% 46px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <div style={{ border: '1px solid var(--mist)', borderRadius: 22, background: 'rgba(255,252,244,.86)', padding: 24 }}>
            <div style={{ marginBottom: 8, color: 'var(--terracotta)', fontSize: '.78rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' }}>
              Our Promise
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 4vw, 2.7rem)', margin: '0 0 8px' }}>
              Built for comfort, quality, and simple shopping.
            </h2>
            <p style={{ margin: 0, color: 'var(--mid)', lineHeight: 1.7, maxWidth: 920 }}>
              We focus on clear categories, practical products, and a smoother path from browse to cart so families can find what they need faster.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: '0 6% 56px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <div style={{ marginBottom: 22 }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 4vw, 3.2rem)', margin: 0 }}>
              Featured Essentials
            </h2>
          </div>

          <div className="staggered-pet-grid">
            {!isLoadingFeatured && featuredShowcaseProducts.length > 0 ? featuredShowcaseProducts.map((product) => (
              <article key={product.id} className="featured-product-card pet-border" data-animal={product.species === 'cat' ? 'Cat lounge' : 'Dog trail'}>
                <div className="featured-image-slot portrait">
                  <span>{product.species}</span>
                  <span>{product.category.replace('-', ' ')}</span>
                </div>
                  <div className="pill" style={{ width: 'fit-content' }}>{product.badge}</div>
                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{product.name}</h3>
                <p style={{ color: 'var(--mid)', lineHeight: 1.6, margin: 0, minHeight: 64 }}>{product.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                  <strong style={{ fontSize: '1.1rem' }}>${product.price.toFixed(2)}</strong>
                </div>
                <button type="button" className="btn-primary" style={{ width: '100%', marginTop: 4 }} onClick={() => addProduct(product)}>
                  Add to Cart
                </button>
                <Link to={`/shop/${product.species}/${product.category}`} style={{ marginTop: 4, color: 'var(--mid)', textDecoration: 'none', fontSize: '.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em' }}>
                  Browse more in this category &rarr;
                </Link>
              </article>
            )) : (
              <div style={{ gridColumn: '1 / -1', background: 'rgba(255,255,255,.78)', border: '1px dashed var(--mist)', borderRadius: 20, padding: 28 }}>
                <h3 style={{ marginTop: 0 }}>{isLoadingFeatured ? 'Loading featured products...' : 'Featured products are not available yet'}</h3>
                <p style={{ color: 'var(--mid)', lineHeight: 1.6, marginBottom: 0 }}>
                  {isLoadingFeatured ? 'Fetching live catalog data.' : 'Run backend seed data or add products in admin to populate this section.'}
                </p>
              </div>
            )}
          </div>

          <div className="trust-strip">
            <div className="trust-pill">
              <strong>Fast Support</strong>
              <span>Questions on sizing, shipping, or products? Reach us quickly through contact support.</span>
            </div>
            <div className="trust-pill">
              <strong>Simple Returns</strong>
              <span>30-day return window for eligible items to keep shopping low stress.</span>
            </div>
            <div className="trust-pill">
              <strong>Shipping Clarity</strong>
              <span>Transparent delivery details and free shipping threshold shown up front.</span>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
