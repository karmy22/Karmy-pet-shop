import React, { useEffect, useState } from 'react';
import AccountShell from '../components/accountShell';
import { listOrders, updateOrderStatus } from '../api/adminApi';
import { useAuth } from '../context/authContext';

const statusOptions = ['pending', 'confirmed', 'fulfilled', 'cancelled'];

export default function AdminPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function fetchOrders() {
    try {
      const token = await user.getIdToken();
      const data = await listOrders(token);
      setOrders(data.orders || []);
      setError('');
    } catch (loadError) {
      setError(loadError.message || 'Unable to load admin data.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  async function handleStatusChange(orderId, status) {
    setMessage('');
    setError('');

    try {
      const token = await user.getIdToken();
      const data = await updateOrderStatus(orderId, status, token);
      setOrders((current) => current.map((order) => (order._id === orderId ? data.order : order)));
      setMessage(`Order ${orderId.slice(-8).toUpperCase()} set to ${status}.`);
    } catch (updateError) {
      setError(updateError.message || 'Unable to update order status.');
    }
  }

  return (
    <AccountShell
      title="Admin dashboard"
      subtitle="Review incoming orders and update lifecycle status for customer tracking."
      activeTab="admin"
    >
      {message && <p style={okStyle}>{message}</p>}
      {error && <p style={errorStyle}>{error}</p>}

      <section style={{ display: 'grid', gap: 12 }}>
        {loading && <p style={mutedStyle}>Loading admin orders...</p>}
        {!loading && orders.length === 0 && <p style={mutedStyle}>No orders found.</p>}

        {!loading && orders.map((order) => (
          <article key={order._id} style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
              <strong>{order.customer?.email || 'No customer email'} · {order._id.slice(-8).toUpperCase()}</strong>
              <span style={statusPillStyle(order.status)}>{order.status}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))', gap: 8 }}>
              <Meta label="Placed" value={new Date(order.createdAt).toLocaleString()} />
              <Meta label="Items" value={`${Array.isArray(order.items) ? order.items.length : 0}`} />
              <Meta label="Total" value={`$${Number(order.total || 0).toFixed(2)}`} />
            </div>

            <label style={{ display: 'grid', gap: 6, maxWidth: 260 }}>
              <span style={{ fontSize: '.82rem', color: 'var(--mid)', fontWeight: 700 }}>Update status</span>
              <select
                value={order.status}
                onChange={(event) => handleStatusChange(order._id, event.target.value)}
                style={selectStyle}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </label>
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

const selectStyle = {
  border: '1px solid var(--mist)',
  borderRadius: 10,
  padding: '10px 11px',
  fontSize: '.9rem',
  color: 'var(--ink)',
  background: 'var(--white)',
};

const mutedStyle = {
  margin: 0,
  color: 'var(--mid)',
};

const okStyle = {
  marginTop: 0,
  marginBottom: 10,
  background: '#e8f8eb',
  border: '1px solid #bde5c5',
  color: '#245f34',
  borderRadius: 10,
  padding: '10px 12px',
};

const errorStyle = {
  marginTop: 0,
  marginBottom: 10,
  background: '#fff1f1',
  border: '1px solid #e9baba',
  color: '#9b3434',
  borderRadius: 10,
  padding: '10px 12px',
};
