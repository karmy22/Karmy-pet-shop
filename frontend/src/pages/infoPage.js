import React from 'react';
import Navbar from '../components/navbar';
import SiteFooter from '../components/siteFooter';

function InfoPage({ title, intro, sections = [] }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', color: 'var(--ink)' }}>
      <Navbar />
      <main style={{ padding: '56px 6% 72px', maxWidth: 980, margin: '0 auto' }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.4rem, 5vw, 4rem)', marginBottom: 16 }}>{title}</h1>
        <p style={{ color: 'var(--mid)', lineHeight: 1.7, fontSize: '1rem', marginBottom: 32 }}>{intro}</p>
        <div style={{ display: 'grid', gap: 18 }}>
          {sections.map((section) => (
            <section key={section.heading} style={{ background: 'rgba(255,255,255,.84)', border: '1px solid var(--mist)', borderRadius: 20, padding: 24 }}>
              <h2 style={{ marginTop: 0 }}>{section.heading}</h2>
              <p style={{ color: 'var(--mid)', lineHeight: 1.7, marginBottom: 0 }}>{section.body}</p>
            </section>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

export default InfoPage;
