import React from 'react';
import Navbar from '../components/navbar';
import SiteFooter from '../components/siteFooter';
import BuildKitBuilder from '../components/buildKitBuilder';

export default function BYOKitPage() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: 'var(--cream)', minHeight: '100vh', color: 'var(--ink)' }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes popIn { from{opacity:0;transform:scale(.92)} to{opacity:1;transform:scale(1)} }
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
        @media (max-width: 700px) {
          .two-col { grid-template-columns: 1fr !important; }
          .addon-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      <Navbar />

      <section style={{ padding: '52px 6% 8px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ marginBottom: 12, color: 'var(--terracotta)', fontSize: '.78rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' }}>
            BYO Kits
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.3rem, 5vw, 4rem)', margin: '0 0 10px' }}>
            Build Your Own Kit
          </h1>
          <p style={{ color: 'var(--mid)', maxWidth: 760, lineHeight: 1.7, margin: 0 }}>
            Start with a harness or leash, add accessories, and see your total update live as you build.
          </p>
        </div>
      </section>

      <BuildKitBuilder />

      <SiteFooter />
    </div>
  );
}
