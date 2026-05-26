import React from 'react';
import AccountShell from '../components/accountShell';

export default function AccountRewardsPage() {
  return (
    <AccountShell
      title="Loyalty & rewards"
      subtitle="A polished rewards area builds trust and gives customers a reason to return after their first order."
      activeTab="rewards"
    >
      <section style={gridStyle}>
        <article style={featureCardStyle}>
          <p style={eyebrowStyle}>Coming soon</p>
          <h2 style={headingStyle}>Karmy Rewards</h2>
          <p style={mutedStyle}>Earn points on eligible orders, redeem customer perks, and watch for seasonal member-only offers.</p>
        </article>

        <article style={cardStyle}>
          <h3 style={smallHeadingStyle}>How it will work</h3>
          <ul style={listStyle}>
            <li>Earn points when you shop.</li>
            <li>Redeem rewards on future eligible purchases.</li>
            <li>Get early access to selected seasonal drops.</li>
          </ul>
        </article>

        <article style={cardStyle}>
          <h3 style={smallHeadingStyle}>Member perks</h3>
          <p style={mutedStyle}>This page is ready for a Shopify loyalty app or a custom rewards system when you connect one.</p>
        </article>
      </section>
    </AccountShell>
  );
}

const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 };
const featureCardStyle = { background: 'linear-gradient(135deg, rgba(255,255,255,.94), rgba(246,239,228,.94))', border: '1px solid rgba(74,124,138,.2)', borderRadius: 18, padding: 20, boxShadow: '0 14px 28px rgba(36,58,68,.08)' };
const cardStyle = { background: 'rgba(255,255,255,.92)', border: '1px solid rgba(74,124,138,.2)', borderRadius: 18, padding: 20, boxShadow: '0 14px 28px rgba(36,58,68,.08)' };
const eyebrowStyle = { margin: '0 0 8px', color: 'var(--mid)', fontSize: '.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.12em' };
const headingStyle = { margin: '0 0 10px', fontSize: '1.35rem' };
const smallHeadingStyle = { margin: '0 0 10px', fontSize: '1rem' };
const mutedStyle = { margin: 0, color: 'var(--mid)', lineHeight: 1.7 };
const listStyle = { margin: 0, paddingLeft: 18, color: 'var(--mid)', lineHeight: 1.8 };
