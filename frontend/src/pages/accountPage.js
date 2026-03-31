import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AccountShell from '../components/accountShell';
import { listMyOrders } from '../api/orderApi';
import { useAuth } from '../context/authContext';

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
      title="My account"
      subtitle="Track your recent purchases, jump to your profile, and manage your Karmy access in one place."
      activeTab="overview"
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 18 }}>
        <InfoCard label="Orders placed" value={String(snapshot.ordersPlaced)} />
        <InfoCard
          label="Latest status"
          value={snapshot.latestOrder ? capitalize(snapshot.latestOrder.status) : 'No orders yet'}
        />
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
    </AccountShell>
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
