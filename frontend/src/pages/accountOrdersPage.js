import React, { useEffect, useState } from 'react';
import AccountShell from '../components/accountShell';
import { listMyOrders } from '../api/orderApi';
import { useAuth } from '../context/authContext';

export default function AccountOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const token = await user.getIdToken();
        const data = await listMyOrders(token);
        if (mounted) {
          setOrders(data);
        }
      } catch (loadError) {
        if (mounted) {
          setError(loadError.message || 'Unable to load your order tracking data.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    if (user) {
      load();
    }

    return () => {
      mounted = false;
    };
  }, [user]);

  return (
    <AccountShell
      title="Order tracking"
      subtitle="See real-time status updates for every Karmy order linked to your account."
      activeTab="orders"
    >
      <section style={{ display: 'grid', gap: 12 }}>
        {loading && <p style={mutedStyle}>Loading orders...</p>}
        {!loading && error && <p style={errorStyle}>{error}</p>}
        {!loading && !error && orders.length === 0 && (
          <p style={mutedStyle}>No orders yet. Your completed checkout orders will show up here.</p>
        )}

        {!loading && !error && orders.map((order) => (
          <article key={order.id} style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
              <strong>Order {order.id.slice(-8).toUpperCase()}</strong>
              <span style={statusPillStyle(order.status)}>{capitalize(order.status)}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))', gap: 8 }}>
              <Meta label="Placed" value={new Date(order.createdAt).toLocaleDateString()} />
              <Meta label="Items" value={`${order.itemCount}`} />
              <Meta label="Total" value={`$${order.total.toFixed(2)}`} />
            </div>

            <div>
              <p style={{ margin: '0 0 7px', color: 'var(--mid)', fontSize: '.8rem' }}>Items</p>
              <div style={{ display: 'grid', gap: 4 }}>
                {order.items.map((item, index) => (
                  <div key={`${order.id}-${index}`} style={{ display: 'flex', justifyContent: 'space-between', gap: 6, fontSize: '.86rem' }}>
                    <span>{item.name}</span>
                    <span>x{item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>
    </AccountShell>
  );
}

function Meta({ label, value }) {
  return (
    <div style={{ background: 'rgba(74,124,138,.06)', borderRadius: 10, padding: '8px 10px' }}>
      <div style={{ color: 'var(--mid)', fontSize: '.72rem' }}>{label}</div>
      <div style={{ fontSize: '.9rem', fontWeight: 700 }}>{value}</div>
    </div>
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

const cardStyle = {
  background: 'rgba(255,255,255,.92)',
  border: '1px solid rgba(74,124,138,.2)',
  borderRadius: 16,
  boxShadow: '0 12px 24px rgba(36,58,68,.08)',
  padding: '14px 16px',
  display: 'grid',
  gap: 12,
};

const mutedStyle = {
  margin: 0,
  color: 'var(--mid)',
};

const errorStyle = {
  margin: 0,
  color: '#9b3434',
  border: '1px solid #e9baba',
  background: '#fff1f1',
  borderRadius: 10,
  padding: '10px 12px',
};
