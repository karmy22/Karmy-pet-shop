import React from 'react';
import { Link } from 'react-router-dom';
import AccountShell from '../components/accountShell';

const guides = [
  {
    title: 'Choosing the right size',
    body: 'Check product measurements before buying apparel, collars, harnesses, or carriers. A better fit helps customers feel confident before checkout.',
  },
  {
    title: 'Everyday walk checklist',
    body: 'Plan ahead with a leash, collar or harness, waste bags, water, ID tags, and weather-friendly accessories.',
  },
  {
    title: 'Home comfort basics',
    body: 'Keep bedding, toys, and accessories organized so your pet products are easier to use and easier to reorder.',
  },
];

export default function AccountPetCareGuidesPage() {
  return (
    <AccountShell
      title="Pet care guides"
      subtitle="Helpful product tips that make your account feel useful even between purchases."
      activeTab="guides"
    >
      <section style={gridStyle}>
        {guides.map((guide) => (
          <article key={guide.title} style={cardStyle}>
            <h2 style={headingStyle}>{guide.title}</h2>
            <p style={mutedStyle}>{guide.body}</p>
          </article>
        ))}
      </section>

      <section style={ctaStyle}>
        <h2 style={{ marginTop: 0 }}>Need help choosing products?</h2>
        <p style={mutedStyle}>Start with the dog and cat categories, then use the kit builder for custom walk setups.</p>
        <Link to="/build-your-own-kit" style={buttonStyle}>Build a kit</Link>
      </section>
    </AccountShell>
  );
}

const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 14, marginBottom: 16 };
const cardStyle = { background: 'rgba(255,255,255,.92)', border: '1px solid rgba(74,124,138,.2)', borderRadius: 18, padding: 20, boxShadow: '0 14px 28px rgba(36,58,68,.08)' };
const ctaStyle = { ...cardStyle, display: 'grid', gap: 10 };
const headingStyle = { margin: '0 0 10px', fontSize: '1.05rem' };
const mutedStyle = { margin: 0, color: 'var(--mid)', lineHeight: 1.7 };
const buttonStyle = { display: 'inline-block', width: 'fit-content', textDecoration: 'none', border: '1px solid var(--ink)', color: 'var(--white)', background: 'var(--ink)', borderRadius: 10, padding: '9px 13px', fontSize: '.84rem', fontWeight: 700 };
