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
    <div className="home-page" style={{ fontFamily: "'DM Sans', sans-serif", color: 'var(--ink)' }}>

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
