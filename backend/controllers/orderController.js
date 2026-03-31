const Order = require('../models/Order');

function normalizeItems(items) {
  return (items || []).map((item) => ({
    type: item.type,
    referenceId: item.id || item.referenceId || '',
    name: item.name,
    price: Number(item.price),
    quantity: Number(item.quantity),
    meta: item.meta || {},
  }));
}

function computeSubtotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

async function createOrder(request, response) {
  const items = normalizeItems(request.body.items);
  if (!Array.isArray(items) || items.length === 0) {
    return response.status(400).json({ error: 'Order items are required' });
  }

  const hasInvalid = items.some((item) => !item.name || item.price < 0 || item.quantity < 1);
  if (hasInvalid) {
    return response.status(400).json({ error: 'Invalid order item payload' });
  }

  const subtotal = computeSubtotal(items);
  const shipping = Number(request.body.shipping || 0);
  const total = subtotal + shipping;

  const order = await Order.create({
    customer: {
      uid: request.user.uid,
      email: request.user.email || '',
      name: request.user.name || '',
    },
    items,
    subtotal,
    shipping,
    total,
    notes: request.body.notes || '',
  });

  return response.status(201).json({ order });
}

async function listMyOrders(request, response) {
  const orders = await Order.find({ 'customer.uid': request.user.uid }).sort({ createdAt: -1 });
  response.json({ orders });
}

module.exports = {
  createOrder,
  listMyOrders,
};
