jest.mock('../../models/Category');
jest.mock('../../models/Product');
jest.mock('../../models/Order');

const Category = require('../../models/Category');
const Product = require('../../models/Product');
const Order = require('../../models/Order');
const {
  createCategory,
  updateCategory,
  deleteCategory,
  listCategories,
  toggleCategoryVisibility,
  createProduct,
  updateProduct,
  deleteProduct,
  listProducts,
  toggleProductVisibility,
  listOrders,
  updateOrderStatus,
  updateShipmentDetails,
} = require('../../controllers/adminController');

function buildResponse() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
}

// ---------------------------------------------------------------------------
// getCategoryPayload / createCategory
// ---------------------------------------------------------------------------
describe('createCategory', () => {
  beforeEach(() => Category.create.mockReset());

  it('creates a category with correct defaults', async () => {
    const fakeCategory = { _id: 'c1', name: 'Food', slug: 'food' };
    Category.create.mockResolvedValue(fakeCategory);

    const req = { body: { name: 'Food', species: 'dog' } };
    const res = buildResponse();

    await createCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ category: fakeCategory });

    const [payload] = Category.create.mock.calls[0];
    expect(payload.name).toBe('Food');
    expect(payload.slug).toBe('food');
    expect(payload.species).toBe('dog');
    expect(payload.isActive).toBe(true);
    expect(payload.seasonalVisible).toBe(true);
  });

  it('uses body.slug when provided instead of generating from name', async () => {
    Category.create.mockResolvedValue({});

    const req = { body: { name: 'Dog Treats', slug: 'custom-slug', species: 'dog' } };
    const res = buildResponse();

    await createCategory(req, res);

    const [payload] = Category.create.mock.calls[0];
    expect(payload.slug).toBe('custom-slug');
  });

  it('sets isActive and seasonalVisible to false when explicitly passed', async () => {
    Category.create.mockResolvedValue({});

    const req = { body: { name: 'Hidden Cat', species: 'cat', isActive: false, seasonalVisible: false } };
    const res = buildResponse();

    await createCategory(req, res);

    const [payload] = Category.create.mock.calls[0];
    expect(payload.isActive).toBe(false);
    expect(payload.seasonalVisible).toBe(false);
  });

  it('throws a 400 error when name is missing', async () => {
    const req = { body: { species: 'dog' } };
    const res = buildResponse();

    await expect(createCategory(req, res)).rejects.toThrow('Category name is required');
  });

  it('throws a 400 error when name is whitespace only', async () => {
    const req = { body: { name: '   ', species: 'dog' } };
    const res = buildResponse();

    await expect(createCategory(req, res)).rejects.toThrow('Category name is required');
  });
});

// ---------------------------------------------------------------------------
// updateCategory
// ---------------------------------------------------------------------------
describe('updateCategory', () => {
  beforeEach(() => Category.findByIdAndUpdate.mockReset());

  it('returns the updated category', async () => {
    const updatedCategory = { _id: 'c1', name: 'Updated Food' };
    Category.findByIdAndUpdate.mockResolvedValue(updatedCategory);

    const req = { params: { id: 'c1' }, body: { name: 'Updated Food', species: 'both' } };
    const res = buildResponse();

    await updateCategory(req, res);

    expect(res.json).toHaveBeenCalledWith({ category: updatedCategory });
  });

  it('returns 404 when category is not found', async () => {
    Category.findByIdAndUpdate.mockResolvedValue(null);

    const req = { params: { id: 'nonexistent' }, body: { name: 'X', species: 'dog' } };
    const res = buildResponse();

    await updateCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Category not found' });
  });
});

// ---------------------------------------------------------------------------
// deleteCategory
// ---------------------------------------------------------------------------
describe('deleteCategory', () => {
  beforeEach(() => {
    Category.findByIdAndDelete.mockReset();
    Product.deleteMany.mockReset();
  });

  it('deletes category and all associated products, returns 204', async () => {
    const fakeCategory = { _id: 'c1' };
    Category.findByIdAndDelete.mockResolvedValue(fakeCategory);
    Product.deleteMany.mockResolvedValue({});

    const req = { params: { id: 'c1' } };
    const res = buildResponse();

    await deleteCategory(req, res);

    expect(Product.deleteMany).toHaveBeenCalledWith({ category: 'c1' });
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it('returns 404 when category is not found', async () => {
    Category.findByIdAndDelete.mockResolvedValue(null);

    const req = { params: { id: 'nonexistent' } };
    const res = buildResponse();

    await deleteCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Category not found' });
    expect(Product.deleteMany).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// listCategories (admin version – returns all)
// ---------------------------------------------------------------------------
describe('listCategories (admin)', () => {
  it('returns all categories sorted by name', async () => {
    const fakeCategories = [{ name: 'A' }, { name: 'B' }];
    Category.find.mockReturnValue({ sort: jest.fn().mockResolvedValue(fakeCategories) });

    const req = {};
    const res = buildResponse();

    await listCategories(req, res);

    expect(Category.find).toHaveBeenCalledWith();
    expect(res.json).toHaveBeenCalledWith({ categories: fakeCategories });
  });
});

// ---------------------------------------------------------------------------
// toggleCategoryVisibility
// ---------------------------------------------------------------------------
describe('toggleCategoryVisibility', () => {
  beforeEach(() => Category.findByIdAndUpdate.mockReset());

  it('sets isActive to true', async () => {
    const updated = { _id: 'c1', isActive: true };
    Category.findByIdAndUpdate.mockResolvedValue(updated);

    const req = { params: { id: 'c1' }, body: { isActive: true } };
    const res = buildResponse();

    await toggleCategoryVisibility(req, res);

    expect(Category.findByIdAndUpdate).toHaveBeenCalledWith('c1', { isActive: true }, { new: true });
    expect(res.json).toHaveBeenCalledWith({ category: updated });
  });

  it('returns 404 when category is not found', async () => {
    Category.findByIdAndUpdate.mockResolvedValue(null);

    const req = { params: { id: 'ghost' }, body: { isActive: false } };
    const res = buildResponse();

    await toggleCategoryVisibility(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Category not found' });
  });
});

// ---------------------------------------------------------------------------
// createProduct
// ---------------------------------------------------------------------------
describe('createProduct', () => {
  beforeEach(() => {
    Category.exists.mockReset();
    Product.create.mockReset();
  });

  it('creates a product when category exists', async () => {
    Category.exists.mockResolvedValue(true);
    const fakeProduct = { _id: 'p1', name: 'Dog Bowl' };
    Product.create.mockResolvedValue(fakeProduct);

    const req = {
      body: {
        name: 'Dog Bowl',
        species: 'dog',
        category: 'cat-id',
        price: 15,
      },
    };
    const res = buildResponse();

    await createProduct(req, res);

    expect(Category.exists).toHaveBeenCalledWith({ _id: 'cat-id' });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ product: fakeProduct });
  });

  it('returns 400 when category reference is invalid', async () => {
    Category.exists.mockResolvedValue(null);

    const req = { body: { name: 'Dog Bowl', species: 'dog', category: 'bad-id', price: 10 } };
    const res = buildResponse();

    await createProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid category reference' });
    expect(Product.create).not.toHaveBeenCalled();
  });

  it('throws 400 error when product name is missing', async () => {
    const req = { body: { species: 'dog', category: 'cat-id', price: 10 } };
    const res = buildResponse();

    await expect(createProduct(req, res)).rejects.toThrow('Product name is required');
  });

  it('normalizes images and badges to empty arrays when not provided', async () => {
    Category.exists.mockResolvedValue(true);
    Product.create.mockResolvedValue({});

    const req = { body: { name: 'Toy', species: 'cat', category: 'cat-id', price: 5 } };
    const res = buildResponse();

    await createProduct(req, res);

    const [payload] = Product.create.mock.calls[0];
    expect(payload.images).toEqual([]);
    expect(payload.badges).toEqual([]);
  });

  it('passes through provided images and badges arrays', async () => {
    Category.exists.mockResolvedValue(true);
    Product.create.mockResolvedValue({});

    const req = {
      body: {
        name: 'Toy',
        species: 'cat',
        category: 'cat-id',
        price: 5,
        images: ['img1.jpg', 'img2.jpg'],
        badges: ['New'],
      },
    };
    const res = buildResponse();

    await createProduct(req, res);

    const [payload] = Product.create.mock.calls[0];
    expect(payload.images).toEqual(['img1.jpg', 'img2.jpg']);
    expect(payload.badges).toEqual(['New']);
  });
});

// ---------------------------------------------------------------------------
// updateProduct
// ---------------------------------------------------------------------------
describe('updateProduct', () => {
  beforeEach(() => {
    Category.exists.mockReset();
    Product.findByIdAndUpdate.mockReset();
  });

  it('returns the updated product', async () => {
    Category.exists.mockResolvedValue(true);
    const updated = { _id: 'p1', name: 'Cat Toy' };
    Product.findByIdAndUpdate.mockResolvedValue(updated);

    const req = {
      params: { id: 'p1' },
      body: { name: 'Cat Toy', species: 'cat', category: 'cat-id', price: 8 },
    };
    const res = buildResponse();

    await updateProduct(req, res);

    expect(res.json).toHaveBeenCalledWith({ product: updated });
  });

  it('returns 400 when category reference is invalid', async () => {
    Category.exists.mockResolvedValue(null);

    const req = {
      params: { id: 'p1' },
      body: { name: 'Cat Toy', species: 'cat', category: 'bad-id', price: 8 },
    };
    const res = buildResponse();

    await updateProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid category reference' });
  });

  it('returns 404 when product is not found', async () => {
    Category.exists.mockResolvedValue(true);
    Product.findByIdAndUpdate.mockResolvedValue(null);

    const req = {
      params: { id: 'nonexistent' },
      body: { name: 'Cat Toy', species: 'cat', category: 'cat-id', price: 8 },
    };
    const res = buildResponse();

    await updateProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Product not found' });
  });
});

// ---------------------------------------------------------------------------
// deleteProduct
// ---------------------------------------------------------------------------
describe('deleteProduct', () => {
  beforeEach(() => Product.findByIdAndDelete.mockReset());

  it('deletes product and returns 204', async () => {
    Product.findByIdAndDelete.mockResolvedValue({ _id: 'p1' });

    const req = { params: { id: 'p1' } };
    const res = buildResponse();

    await deleteProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it('returns 404 when product is not found', async () => {
    Product.findByIdAndDelete.mockResolvedValue(null);

    const req = { params: { id: 'ghost' } };
    const res = buildResponse();

    await deleteProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Product not found' });
  });
});

// ---------------------------------------------------------------------------
// listProducts (admin version)
// ---------------------------------------------------------------------------
describe('listProducts (admin)', () => {
  it('returns all products populated with category info', async () => {
    const fakeProducts = [{ name: 'Dog Bowl' }];
    Product.find.mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue(fakeProducts),
    });

    const req = {};
    const res = buildResponse();

    await listProducts(req, res);

    expect(res.json).toHaveBeenCalledWith({ products: fakeProducts });
  });
});

// ---------------------------------------------------------------------------
// toggleProductVisibility
// ---------------------------------------------------------------------------
describe('toggleProductVisibility', () => {
  beforeEach(() => Product.findByIdAndUpdate.mockReset());

  it('sets isActive to false', async () => {
    const updated = { _id: 'p1', isActive: false };
    Product.findByIdAndUpdate.mockReturnValue({
      populate: jest.fn().mockResolvedValue(updated),
    });

    const req = { params: { id: 'p1' }, body: { isActive: false } };
    const res = buildResponse();

    await toggleProductVisibility(req, res);

    expect(Product.findByIdAndUpdate).toHaveBeenCalledWith('p1', { isActive: false }, { new: true });
    expect(res.json).toHaveBeenCalledWith({ product: updated });
  });

  it('returns 404 when product is not found', async () => {
    Product.findByIdAndUpdate.mockReturnValue({
      populate: jest.fn().mockResolvedValue(null),
    });

    const req = { params: { id: 'ghost' }, body: { isActive: true } };
    const res = buildResponse();

    await toggleProductVisibility(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Product not found' });
  });
});

// ---------------------------------------------------------------------------
// listOrders
// ---------------------------------------------------------------------------
describe('listOrders', () => {
  it('returns up to 200 orders sorted by createdAt desc', async () => {
    const fakeOrders = [{ _id: 'o1' }];
    Order.find.mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue(fakeOrders),
    });

    const req = {};
    const res = buildResponse();

    await listOrders(req, res);

    expect(res.json).toHaveBeenCalledWith({ orders: fakeOrders });
  });
});

// ---------------------------------------------------------------------------
// updateOrderStatus
// ---------------------------------------------------------------------------
describe('updateOrderStatus', () => {
  beforeEach(() => Order.findByIdAndUpdate.mockReset());

  it.each(['pending', 'confirmed', 'fulfilled', 'cancelled'])(
    'accepts valid status "%s"',
    async (status) => {
      const fakeOrder = { _id: 'o1', status };
      Order.findByIdAndUpdate.mockResolvedValue(fakeOrder);

      const req = { params: { id: 'o1' }, body: { status } };
      const res = buildResponse();

      await updateOrderStatus(req, res);

      expect(res.json).toHaveBeenCalledWith({ order: fakeOrder });
    }
  );

  it('returns 400 for an invalid status value', async () => {
    const req = { params: { id: 'o1' }, body: { status: 'shipped' } };
    const res = buildResponse();

    await updateOrderStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid status value' });
    expect(Order.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it('returns 404 when order is not found', async () => {
    Order.findByIdAndUpdate.mockResolvedValue(null);

    const req = { params: { id: 'ghost' }, body: { status: 'confirmed' } };
    const res = buildResponse();

    await updateOrderStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Order not found' });
  });
});

// ---------------------------------------------------------------------------
// updateShipmentDetails
// ---------------------------------------------------------------------------
describe('updateShipmentDetails', () => {
  beforeEach(() => Order.findByIdAndUpdate.mockReset());

  it('updates shipment details and returns the order', async () => {
    const fakeOrder = { _id: 'o1' };
    Order.findByIdAndUpdate.mockResolvedValue(fakeOrder);

    const req = {
      params: { id: 'o1' },
      body: {
        carrier: 'FedEx',
        trackingNumber: 'FX123',
        shipmentStatus: 'in_transit',
        estimatedDelivery: '2024-12-25',
      },
    };
    const res = buildResponse();

    await updateShipmentDetails(req, res);

    expect(Order.findByIdAndUpdate).toHaveBeenCalledWith(
      'o1',
      {
        'shipment.carrier': 'FedEx',
        'shipment.trackingNumber': 'FX123',
        'shipment.shipmentStatus': 'in_transit',
        'shipment.estimatedDelivery': '2024-12-25',
      },
      { new: true, runValidators: true }
    );
    expect(res.json).toHaveBeenCalledWith({ order: fakeOrder });
  });

  it('returns 400 for an invalid shipmentStatus', async () => {
    const req = {
      params: { id: 'o1' },
      body: { shipmentStatus: 'lost' },
    };
    const res = buildResponse();

    await updateShipmentDetails(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid shipment status' });
    expect(Order.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it('returns 404 when order is not found', async () => {
    Order.findByIdAndUpdate.mockResolvedValue(null);

    const req = { params: { id: 'ghost' }, body: {} };
    const res = buildResponse();

    await updateShipmentDetails(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Order not found' });
  });

  it('defaults shipmentStatus to "not_shipped" when not provided', async () => {
    Order.findByIdAndUpdate.mockResolvedValue({ _id: 'o1' });

    const req = { params: { id: 'o1' }, body: { carrier: 'UPS', trackingNumber: 'UP456' } };
    const res = buildResponse();

    await updateShipmentDetails(req, res);

    const [, update] = Order.findByIdAndUpdate.mock.calls[0];
    expect(update['shipment.shipmentStatus']).toBe('not_shipped');
  });

  it('defaults estimatedDelivery to null when not provided', async () => {
    Order.findByIdAndUpdate.mockResolvedValue({ _id: 'o1' });

    const req = { params: { id: 'o1' }, body: {} };
    const res = buildResponse();

    await updateShipmentDetails(req, res);

    const [, update] = Order.findByIdAndUpdate.mock.calls[0];
    expect(update['shipment.estimatedDelivery']).toBeNull();
  });
});
