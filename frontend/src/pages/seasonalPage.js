import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/navbar';
import SiteFooter from '../components/siteFooter';
import { getSeasonalCollection } from '../data/navigation';
import { getProductsBySeasonalCollection } from '../data/catalog';

function SeasonalPage() {
  const { collectionSlug } = useParams();
  const collection = getSeasonalCollection(collectionSlug);

  if (!collection) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--cream)', color: 'var(--ink)' }}>
        <Navbar />
        <main style={{ padding: '64px 6%', maxWidth: 1100, margin: '0 auto' }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '3rem', marginBottom: 12 }}>Collection not found</h1>
          <Link to="/" style={{ color: 'var(--ink)', fontWeight: 700, textDecoration: 'none' }}>Return to the store home</Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const products = getProductsBySeasonalCollection(collectionSlug);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', color: 'var(--ink)' }}>
      <Navbar />
      <main style={{ padding: '48px 6% 72px' }}>
        <section style={{ maxWidth: 1120, margin: '0 auto 34px' }}>
          <div style={{ marginBottom: 18, color: 'var(--terracotta)', fontSize: '.82rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' }}>
            Seasonal Collection
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.4rem, 5vw, 4.2rem)', marginBottom: 10 }}>{collection.label}</h1>
          <p style={{ color: 'var(--mid)', maxWidth: 720, lineHeight: 1.7, fontSize: '1rem' }}>{collection.description}</p>
          {!collection.visible && (
            <div style={{ marginTop: 18, display: 'inline-flex', padding: '8px 14px', borderRadius: 999, background: 'var(--warm-soft)', color: 'var(--warm-strong)', fontWeight: 700 }}>
              Hidden for this season
            </div>
          )}
        </section>

        <section style={{ maxWidth: 1120, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
          {products.length > 0 ? products.map((product) => (
            <article key={product.id} style={{ background: 'rgba(255,255,255,.85)', border: '1px solid var(--mist)', borderRadius: 22, padding: 24, boxShadow: '0 12px 30px rgba(74,124,138,.09)' }}>
              <div style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: 999, background: 'var(--warm-soft)', color: 'var(--warm-strong)', fontSize: '.72rem', fontWeight: 700, marginBottom: 14 }}>{product.badge}</div>
              <h2 style={{ margin: '0 0 8px', fontSize: '1.15rem' }}>{product.name}</h2>
              <p style={{ color: 'var(--mid)', lineHeight: 1.6, minHeight: 72 }}>{product.description}</p>
              <strong style={{ fontSize: '1.2rem', display: 'block', marginTop: 18 }}>${product.price.toFixed(2)}</strong>
            </article>
          )) : (
            <div style={{ gridColumn: '1 / -1', background: 'rgba(255,255,255,.78)', border: '1px dashed var(--mist)', borderRadius: 20, padding: 28 }}>
              <h2 style={{ marginTop: 0 }}>Collection ready to activate</h2>
              <p style={{ color: 'var(--mid)', lineHeight: 1.6 }}>This seasonal page exists in the catalog and can be turned on or off with a single visibility flag in the navigation data.</p>
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

export default SeasonalPage;
