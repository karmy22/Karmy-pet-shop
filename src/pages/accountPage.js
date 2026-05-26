import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AccountShell from '../components/accountShell';
import { listMyOrders } from '../api/orderApi';
import { useAuth } from '../context/authContext';

const accountSections = [
  {
    title: 'My Orders',
    body: 'View recent purchases, order details, and current order status.',
    to: '/account/orders',
    action: 'View orders',
  },
  {
    title: 'My Profile',
    body: 'Update your name, email, password access, and saved account details.',
    to: '/account/profile',
    action: 'Edit profile',
  },
  {
    title: 'My Addresses',
    body: 'Save shipping details for a smoother and more accurate checkout.',
    to: '/account/addresses',
    action: 'Manage addresses',
  },
];

const perkSections = [
  {
    title: 'Loyalty & Rewards',
    body: 'Check reward updates and prepare for future customer perks.',
    to: '/account/rewards',
    action: 'View rewards',
  },
  {
    title: 'Pet Care Guides',
    body: 'Read simple product tips for sizing, walks, and everyday essentials.',
    to: '/account/pet-care-guides',
    action: 'Read guides',
  },
];

const helpSections = [
  { title: 'FAQ', body: 'Find answers about orders, shipping, returns, and accounts.', to: '/faq' },
  { title: 'Contact Us', body: 'Get help from customer support for account or order questions.', to: '/contact-us' },
  { title: 'Shipping Policy', body: 'Review processing, delivery, and address guidance.', to: '/shipping-policy' },
  { title: 'Returns & Refunds', body: 'Learn how return requests and refund reviews are handled.', to: '/returns-refunds' },
];

export default function AccountPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadOrders() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const token = await user.getIdToken();
        const data = await listMyOrders(token);
        if (mounted) {
          setOrders(data);
        }
      } catch (error) {
        if (mounted) {
          setOrders([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadOrders();
    return () => {
      mounted = false;
    };
  }, [user]);

  const snapshot = useMemo(() => {
    return {
      ordersPlaced: orders.length,
      latestOrder: orders[0] || null,
    };
  }, [orders]);

  return (
    <AccountShell
      title="My Account"
      subtitle="Welcome back to Karmy's Pet Shop. Manage orders, profile details, saved addresses, rewards, and customer support in one secure place."
      activeTab="overview"
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 18 }}>
        <InfoCard label="Orders placed" value={String(snapshot.ordersPlaced)} />
        <InfoCard
          label="Latest status"
          value={snapshot.latestOrder ? capitalize(snapshot.latestOrder.status) : 'No orders yet'}
        />
        <InfoCard label="Account access" value="Signed in" />
      </div>

      <section style={panelStyle}>
        <h2 style={panelTitleStyle}>Recent order activity</h2>
        {loading ? (
          <p style={mutedStyle}>Loading your orders...</p>
        ) : snapshot.latestOrder ? (
          <div style={{ display: 'grid', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
              <strong>Order {snapshot.latestOrder.id.slice(-8).toUpperCase()}</strong>
              <span style={statusPillStyle(snapshot.latestOrder.status)}>{capitalize(snapshot.latestOrder.status)}</span>
            </div>
            <p style={mutedStyle}>Placed on {new Date(snapshot.latestOrder.createdAt).toLocaleDateString()} with {snapshot.latestOrder.itemCount} item(s).</p>
            <Link to="/account/orders" style={linkButtonStyle}>Open full order tracking</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 10 }}>
            <p style={mutedStyle}>No orders yet. Start shopping to see updates here.</p>
            <Link to="/shop/dog/food" style={linkButtonStyle}>Browse catalog</Link>
          </div>
        )}
      </section>

      <DashboardSection title="Account sections" items={accountSections} />
      <DashboardSection title="Member perks" items={perkSections} />
      <DashboardSection title="Need help?" items={helpSections} compact />
    </AccountShell>
  );
}

function DashboardSection({ title, items, compact = false }) {
  return (
    <section style={{ marginTop: 18 }}>
      <h2 style={panelTitleStyle}>{title}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(${compact ? 190 : 240}px, 1fr))`, gap: 14 }}>
        {items.map((item) => (
          <Link key={item.title} to={item.to} style={cardLinkStyle}>
            <h3 style={{ margin: '0 0 8px', fontSize: '1rem' }}>{item.title}</h3>
            <p style={{ ...mutedStyle, lineHeight: 1.6 }}>{item.body}</p>
            <span style={smallActionStyle}>{item.action || 'Open page'}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function InfoCard({ label, value }) {
  return (
    <article style={panelStyle}>
      <p style={{ margin: '0 0 5px', color: 'var(--mid)', fontSize: '.8rem' }}>{label}</p>
      <strong style={{ fontSize: '1.2rem' }}>{value}</strong>
    </article>
  );
}

function capitalize(value) {
  return `${value}`.charAt(0).toUpperCase() + `${value}`.slice(1);
}

function statusPillStyle(status) {
  const map = {
    pending: { background: '#fff2dd', color: '#9a5b19' },
    confirmed: { background: '#e8f4ff', color: '#1f5c86' },
    fulfilled: { background: '#e6f7ea', color: '#24663a' },
    cancelled: { background: '#ffe8e8', color: '#8b2d2d' },
  };
  const variant = map[status] || { background: '#f0f2f3', color: '#40525a' };
  return {
    borderRadius: 999,
    padding: '4px 10px',
    fontSize: '.72rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '.05em',
    ...variant,
  };
}

const panelStyle = {
  background: 'rgba(255,255,255,.9)',
  border: '1px solid rgba(74,124,138,.2)',
  borderRadius: 16,
  padding: '16px 18px',
  boxShadow: '0 14px 30px rgba(36,58,68,.08)',
};

const cardLinkStyle = {
  ...panelStyle,
  display: 'grid',
  gap: 8,
  textDecoration: 'none',
  color: 'var(--ink)',
};

const panelTitleStyle = {
  margin: '0 0 12px',
  fontSize: '1.05rem',
};

const mutedStyle = {
  margin: 0,
  color: 'var(--mid)',
};

const linkButtonStyle = {
  display: 'inline-block',
  width: 'fit-content',
  textDecoration: 'none',
  border: '1px solid var(--ink)',
  color: 'var(--ink)',
  borderRadius: 10,
  padding: '8px 12px',
  fontSize: '.84rem',
  fontWeight: 700,
};

const smallActionStyle = {
  marginTop: 4,
  color: 'var(--ink)',
  fontSize: '.8rem',
  fontWeight: 800,
};
