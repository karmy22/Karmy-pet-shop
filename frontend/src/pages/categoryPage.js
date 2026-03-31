import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/navbar';
import SiteFooter from '../components/siteFooter';
import { getCategoryConfig, getSpeciesConfig, getVisibleCategories } from '../data/navigation';
import { getProductsByCategory } from '../data/catalog';

function CategoryPage() {
  const { speciesSlug, categorySlug } = useParams();
  const species = getSpeciesConfig(speciesSlug);
  const category = getCategoryConfig(speciesSlug, categorySlug);

  if (!species || !category) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--cream)', color: 'var(--ink)' }}>
        <Navbar />
        <main style={{ padding: '64px 6%', maxWidth: 1100, margin: '0 auto' }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '3rem', marginBottom: 12 }}>Category not found</h1>
          <p style={{ color: 'var(--mid)', marginBottom: 24 }}>This category is hidden or has not been created yet.</p>
          <Link to="/" style={{ color: 'var(--ink)', fontWeight: 700, textDecoration: 'none' }}>Return to the store home</Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const products = getProductsByCategory(speciesSlug, categorySlug);
  const siblingCategories = getVisibleCategories(speciesSlug);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', color: 'var(--ink)' }}>
      <Navbar />
      <main style={{ padding: '48px 6% 72px' }}>
        <section style={{ maxWidth: 1120, margin: '0 auto 40px' }}>
          <div style={{ marginBottom: 18, color: 'var(--terracotta)', fontSize: '.82rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' }}>
            {species.label}
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.4rem, 5vw, 4.2rem)', marginBottom: 10 }}>
            {category.label}
          </h1>
          <p style={{ color: 'var(--mid)', maxWidth: 720, lineHeight: 1.7, fontSize: '1rem' }}>{category.description}</p>
        </section>

        <section style={{ maxWidth: 1120, margin: '0 auto 44px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
          {siblingCategories.map((item) => (
            <Link
              key={item.slug}
              to={`/shop/${species.slug}/${item.slug}`}
              style={{
                textDecoration: 'none',
                color: item.slug === category.slug ? 'white' : 'var(--ink)',
                background: item.slug === category.slug ? 'var(--ink)' : 'rgba(255,255,255,.72)',
                border: '1px solid var(--mist)',
                borderRadius: 16,
                padding: '16px 18px',
                boxShadow: item.slug === category.slug ? '0 10px 24px rgba(63,149,172,.18)' : 'none',
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: '.82rem', lineHeight: 1.5, color: item.slug === category.slug ? 'rgba(255,255,255,.82)' : 'var(--mid)' }}>{item.description}</div>
            </Link>
          ))}
        </section>

        <section style={{ maxWidth: 1120, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
          {products.length > 0 ? products.map((product) => (
            <article key={product.id} style={{ background: 'rgba(255,255,255,.85)', border: '1px solid var(--mist)', borderRadius: 22, padding: 24, boxShadow: '0 12px 30px rgba(74,124,138,.09)' }}>
              <div style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: 999, background: 'var(--warm-soft)', color: 'var(--warm-strong)', fontSize: '.72rem', fontWeight: 700, marginBottom: 14 }}>{product.badge}</div>
              <h2 style={{ margin: '0 0 8px', fontSize: '1.15rem' }}>{product.name}</h2>
              <p style={{ color: 'var(--mid)', lineHeight: 1.6, minHeight: 72 }}>{product.description}</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 18 }}>
                <strong style={{ fontSize: '1.2rem' }}>${product.price.toFixed(2)}</strong>
                <button style={{ border: 'none', borderRadius: 12, padding: '11px 16px', background: 'var(--ink)', color: 'white', fontWeight: 700, cursor: 'pointer' }}>View</button>
              </div>
            </article>
          )) : (
            <div style={{ gridColumn: '1 / -1', background: 'rgba(255,255,255,.78)', border: '1px dashed var(--mist)', borderRadius: 20, padding: 28 }}>
              <h2 style={{ marginTop: 0 }}>Products coming soon</h2>
              <p style={{ color: 'var(--mid)', lineHeight: 1.6 }}>This category is ready in the menu structure, but the product assortment still needs to be curated.</p>
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

export default CategoryPage;
