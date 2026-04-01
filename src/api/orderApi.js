import { apiRequest } from './client';

function normalizeOrder(order) {
  return {
    id: order._id,
    createdAt: order.createdAt,
    status: order.status,
    subtotal: Number(order.subtotal || 0),
    shipping: Number(order.shipping || 0),
    total: Number(order.total || 0),
    itemCount: Array.isArray(order.items)
      ? order.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
      : 0,
    items: Array.isArray(order.items) ? order.items : [],
    notes: order.notes || '',
  };
}

export async function createOrder({ items, token, notes = '', shipping = 0 }) {
  if (!token) {
    throw new Error('Missing Firebase bearer token');
  }

  return apiRequest('/api/orders', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      items,
      notes,
      shipping,
    }),
  });
}

export async function listMyOrders(token) {
  if (!token) {
    throw new Error('Missing Firebase bearer token');
  }

  const data = await apiRequest('/api/orders', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return (data.orders || []).map(normalizeOrder);
}
