jest.mock('../../models/Category');
jest.mock('../../models/Product');

const Category = require('../../models/Category');
const Product = require('../../models/Product');
const { listProducts, getProductBySlug } = require('../../controllers/productController');

function buildResponse() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

function mockProductQuery(result) {
  const query = {
    populate: jest.fn().mockReturnThis(),
    sort: jest.fn().mockResolvedValue(result),
  };
  Product.find.mockReturnValue(query);
  return query;
}

describe('listProducts', () => {
  beforeEach(() => {
    Category.findOne.mockReset();
    Product.find.mockReset();
  });

  it('returns only active products when no query params are given', async () => {
    const fakeProducts = [{ name: 'Dog Food', slug: 'dog-food' }];
    mockProductQuery(fakeProducts);

    const req = { query: {} };
    const res = buildResponse();

    await listProducts(req, res);

    expect(Product.find).toHaveBeenCalledWith({ isActive: true });
    expect(res.json).toHaveBeenCalledWith({ products: fakeProducts });
  });

  it('includes inactive products when includeInactive is "true"', async () => {
    mockProductQuery([]);

    const req = { query: { includeInactive: 'true' } };
    const res = buildResponse();

    await listProducts(req, res);

    expect(Product.find).toHaveBeenCalledWith({});
  });

  it('filters by species', async () => {
    mockProductQuery([]);

    const req = { query: { species: 'cat' } };
    const res = buildResponse();

    await listProducts(req, res);

    expect(Product.find).toHaveBeenCalledWith({
      species: { $in: ['cat', 'both'] },
      isActive: true,
    });
  });

  it('filters by seasonalCollection', async () => {
    mockProductQuery([]);

    const req = { query: { seasonalCollection: 'summer' } };
    const res = buildResponse();

    await listProducts(req, res);

    expect(Product.find).toHaveBeenCalledWith({
      seasonalCollection: 'summer',
      isActive: true,
    });
  });

  it('resolves categorySlug to _id and adds it to the query', async () => {
    const fakeCategory = { _id: 'cat-id-1' };
    Category.findOne.mockResolvedValue(fakeCategory);
    mockProductQuery([]);

    const req = { query: { categorySlug: 'dog-food' } };
    const res = buildResponse();

    await listProducts(req, res);

    expect(Category.findOne).toHaveBeenCalledWith({ slug: 'dog-food' });
    expect(Product.find).toHaveBeenCalledWith({
      category: 'cat-id-1',
      isActive: true,
    });
  });

  it('returns 404 when the specified categorySlug does not exist', async () => {
    Category.findOne.mockResolvedValue(null);

    const req = { query: { categorySlug: 'non-existent' } };
    const res = buildResponse();

    await listProducts(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Category not found' });
    expect(Product.find).not.toHaveBeenCalled();
  });
});

describe('getProductBySlug', () => {
  beforeEach(() => {
    Product.findOne.mockReset();
  });

  it('returns a product when the slug matches', async () => {
    const fakeProduct = { name: 'Cat Toy', slug: 'cat-toy' };
    Product.findOne.mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(fakeProduct),
    });

    const req = { params: { slug: 'cat-toy' } };
    const res = buildResponse();

    await getProductBySlug(req, res);

    expect(Product.findOne).toHaveBeenCalledWith({ slug: 'cat-toy' });
    expect(res.json).toHaveBeenCalledWith({ product: fakeProduct });
  });

  it('returns 404 when no product matches the slug', async () => {
    Product.findOne.mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(null),
    });

    const req = { params: { slug: 'ghost-product' } };
    const res = buildResponse();

    await getProductBySlug(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Product not found' });
  });
});
