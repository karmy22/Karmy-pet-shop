jest.mock('../../models/Order');

const Order = require('../../models/Order');
const { createOrder, listMyOrders } = require('../../controllers/orderController');

function buildResponse() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('normalizeItems / computeSubtotal (via createOrder)', () => {
  beforeEach(() => {
    Order.create.mockReset();
  });

  it('transforms item.id into referenceId', async () => {
    Order.create.mockResolvedValue({ _id: 'ord-1' });

    const req = {
      body: {
        items: [{ type: 'product', id: 'p1', name: 'Dog Food', price: '10', quantity: '2' }],
      },
      user: { uid: 'u1', email: 'u@example.com', name: 'User' },
    };
    const res = buildResponse();

    await createOrder(req, res);

    const [payload] = Order.create.mock.calls[0];
    expect(payload.items[0].referenceId).toBe('p1');
    expect(payload.items[0].price).toBe(10);
    expect(payload.items[0].quantity).toBe(2);
  });

  it('uses referenceId from item when id is absent', async () => {
    Order.create.mockResolvedValue({ _id: 'ord-2' });

    const req = {
      body: {
        items: [{ type: 'kit', referenceId: 'kit-99', name: 'Starter Kit', price: 25, quantity: 1 }],
      },
      user: { uid: 'u1', email: '', name: '' },
    };
    const res = buildResponse();

    await createOrder(req, res);

    const [payload] = Order.create.mock.calls[0];
    expect(payload.items[0].referenceId).toBe('kit-99');
  });

  it('computes correct subtotal', async () => {
    Order.create.mockResolvedValue({ _id: 'ord-3' });

    const req = {
      body: {
        items: [
          { type: 'product', id: 'p1', name: 'Item A', price: 5, quantity: 3 },
          { type: 'product', id: 'p2', name: 'Item B', price: 10, quantity: 2 },
        ],
      },
      user: { uid: 'u1', email: '', name: '' },
    };
    const res = buildResponse();

    await createOrder(req, res);

    const [payload] = Order.create.mock.calls[0];
    expect(payload.subtotal).toBe(35); // 5*3 + 10*2
  });

  it('adds shipping to compute total', async () => {
    Order.create.mockResolvedValue({ _id: 'ord-4' });

    const req = {
      body: {
        items: [{ type: 'product', id: 'p1', name: 'Item', price: 20, quantity: 1 }],
        shipping: 5,
      },
      user: { uid: 'u1', email: '', name: '' },
    };
    const res = buildResponse();

    await createOrder(req, res);

    const [payload] = Order.create.mock.calls[0];
    expect(payload.subtotal).toBe(20);
    expect(payload.shipping).toBe(5);
    expect(payload.total).toBe(25);
  });

  it('defaults shipping to 0 when not provided', async () => {
    Order.create.mockResolvedValue({ _id: 'ord-5' });

    const req = {
      body: {
        items: [{ type: 'product', id: 'p1', name: 'Item', price: 15, quantity: 1 }],
      },
      user: { uid: 'u1', email: '', name: '' },
    };
    const res = buildResponse();

    await createOrder(req, res);

    const [payload] = Order.create.mock.calls[0];
    expect(payload.shipping).toBe(0);
    expect(payload.total).toBe(15);
  });
});

describe('createOrder', () => {
  beforeEach(() => {
    Order.create.mockReset();
  });

  it('returns 400 when items array is empty', async () => {
    const req = { body: { items: [] }, user: { uid: 'u1' } };
    const res = buildResponse();

    await createOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Order items are required' });
    expect(Order.create).not.toHaveBeenCalled();
  });

  it('returns 400 when items is not provided', async () => {
    const req = { body: {}, user: { uid: 'u1' } };
    const res = buildResponse();

    await createOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Order items are required' });
  });

  it('returns 400 when an item has a negative price', async () => {
    const req = {
      body: { items: [{ type: 'product', id: 'p1', name: 'Bad Item', price: -5, quantity: 1 }] },
      user: { uid: 'u1' },
    };
    const res = buildResponse();

    await createOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid order item payload' });
  });

  it('returns 400 when an item has quantity less than 1', async () => {
    const req = {
      body: { items: [{ type: 'product', id: 'p1', name: 'Item', price: 10, quantity: 0 }] },
      user: { uid: 'u1' },
    };
    const res = buildResponse();

    await createOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid order item payload' });
  });

  it('returns 400 when an item is missing a name', async () => {
    const req = {
      body: { items: [{ type: 'product', id: 'p1', name: '', price: 10, quantity: 1 }] },
      user: { uid: 'u1' },
    };
    const res = buildResponse();

    await createOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid order item payload' });
  });

  it('creates order and returns 201 with the order document', async () => {
    const fakeOrder = { _id: 'order-abc', status: 'pending' };
    Order.create.mockResolvedValue(fakeOrder);

    const req = {
      body: {
        items: [{ type: 'product', id: 'p1', name: 'Dog Food', price: 12, quantity: 3 }],
        notes: 'Please pack carefully',
      },
      user: { uid: 'u1', email: 'user@example.com', name: 'Alice' },
    };
    const res = buildResponse();

    await createOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ order: fakeOrder });

    const [payload] = Order.create.mock.calls[0];
    expect(payload.customer).toEqual({ uid: 'u1', email: 'user@example.com', name: 'Alice' });
    expect(payload.notes).toBe('Please pack carefully');
  });

  it('stores notes as empty string when not provided', async () => {
    Order.create.mockResolvedValue({ _id: 'o-1' });

    const req = {
      body: { items: [{ type: 'product', id: 'p1', name: 'Item', price: 5, quantity: 1 }] },
      user: { uid: 'u2', email: '', name: '' },
    };
    const res = buildResponse();

    await createOrder(req, res);

    const [payload] = Order.create.mock.calls[0];
    expect(payload.notes).toBe('');
  });
});

describe('listMyOrders', () => {
  it('returns orders belonging to the authenticated user sorted by createdAt desc', async () => {
    const fakeOrders = [{ _id: 'o1' }, { _id: 'o2' }];
    Order.find.mockReturnValue({ sort: jest.fn().mockResolvedValue(fakeOrders) });

    const req = { user: { uid: 'u1' } };
    const res = buildResponse();

    await listMyOrders(req, res);

    expect(Order.find).toHaveBeenCalledWith({ 'customer.uid': 'u1' });
    expect(res.json).toHaveBeenCalledWith({ orders: fakeOrders });
  });
});
