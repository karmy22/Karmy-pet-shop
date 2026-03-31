const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { slugify } = require('../utils/slugify');

function getCategoryPayload(body) {
  const name = String(body.name || '').trim();
  if (!name) {
    const error = new Error('Category name is required');
    error.status = 400;
    throw error;
  }

  return {
    name,
    slug: slugify(body.slug || name),
    description: String(body.description || ''),
    species: body.species || 'both',
    isActive: body.isActive !== false,
    seasonalVisible: body.seasonalVisible !== false,
  };
}

function getProductPayload(body) {
  const name = String(body.name || '').trim();
  if (!name) {
    const error = new Error('Product name is required');
    error.status = 400;
    throw error;
  }

  return {
    name,
    slug: slugify(body.slug || name),
    description: String(body.description || ''),
    species: body.species || 'both',
    category: body.category,
    images: Array.isArray(body.images) ? body.images : [],
    badges: Array.isArray(body.badges) ? body.badges : [],
    seasonalCollection: String(body.seasonalCollection || ''),
    price: Number(body.price || 0),
    stock: Number(body.stock || 0),
    isActive: body.isActive !== false,
  };
}

async function createCategory(request, response) {
  const payload = getCategoryPayload(request.body);
  const category = await Category.create(payload);
  response.status(201).json({ category });
}

async function updateCategory(request, response) {
  const payload = getCategoryPayload(request.body);
  const category = await Category.findByIdAndUpdate(request.params.id, payload, { new: true, runValidators: true });
  if (!category) {
    return response.status(404).json({ error: 'Category not found' });
  }
  return response.json({ category });
}

async function deleteCategory(request, response) {
  const category = await Category.findByIdAndDelete(request.params.id);
  if (!category) {
    return response.status(404).json({ error: 'Category not found' });
  }

  await Product.deleteMany({ category: category._id });
  return response.status(204).send();
}

async function listCategories(request, response) {
  const categories = await Category.find().sort({ name: 1 });
  return response.json({ categories });
}

async function createProduct(request, response) {
  const payload = getProductPayload(request.body);
  const categoryExists = await Category.exists({ _id: payload.category });
  if (!categoryExists) {
    return response.status(400).json({ error: 'Invalid category reference' });
  }

  const product = await Product.create(payload);
  return response.status(201).json({ product });
}

async function updateProduct(request, response) {
  const payload = getProductPayload(request.body);
  const categoryExists = await Category.exists({ _id: payload.category });
  if (!categoryExists) {
    return response.status(400).json({ error: 'Invalid category reference' });
  }

  const product = await Product.findByIdAndUpdate(request.params.id, payload, { new: true, runValidators: true });
  if (!product) {
    return response.status(404).json({ error: 'Product not found' });
  }

  return response.json({ product });
}

async function deleteProduct(request, response) {
  const product = await Product.findByIdAndDelete(request.params.id);
  if (!product) {
    return response.status(404).json({ error: 'Product not found' });
  }
  return response.status(204).send();
}

async function listProducts(request, response) {
  const products = await Product.find()
    .populate('category', 'name slug')
    .sort({ createdAt: -1 });
  return response.json({ products });
}

async function listOrders(request, response) {
  const orders = await Order.find().sort({ createdAt: -1 }).limit(200);
  return response.json({ orders });
}

async function updateOrderStatus(request, response) {
  const allowed = ['pending', 'confirmed', 'fulfilled', 'cancelled'];
  if (!allowed.includes(request.body.status)) {
    return response.status(400).json({ error: 'Invalid status value' });
  }

  const order = await Order.findByIdAndUpdate(
    request.params.id,
    { status: request.body.status },
    { new: true, runValidators: true }
  );

  if (!order) {
    return response.status(404).json({ error: 'Order not found' });
  }

  return response.json({ order });
}

async function toggleProductVisibility(request, response) {
  const isActive = Boolean(request.body.isActive);
  const product = await Product.findByIdAndUpdate(
    request.params.id,
    { isActive },
    { new: true }
  ).populate('category', 'name slug');
  if (!product) {
    return response.status(404).json({ error: 'Product not found' });
  }
  return response.json({ product });
}

async function toggleCategoryVisibility(request, response) {
  const isActive = Boolean(request.body.isActive);
  const category = await Category.findByIdAndUpdate(
    request.params.id,
    { isActive },
    { new: true }
  );
  if (!category) {
    return response.status(404).json({ error: 'Category not found' });
  }
  return response.json({ category });
}

async function updateShipmentDetails(request, response) {
  const { carrier, trackingNumber, shipmentStatus, estimatedDelivery } = request.body;
  const allowed = ['not_shipped', 'in_transit', 'delivered', 'exception'];
  if (shipmentStatus && !allowed.includes(shipmentStatus)) {
    return response.status(400).json({ error: 'Invalid shipment status' });
  }

  const update = {
    'shipment.carrier': String(carrier || '').trim(),
    'shipment.trackingNumber': String(trackingNumber || '').trim(),
    'shipment.shipmentStatus': shipmentStatus || 'not_shipped',
    'shipment.estimatedDelivery': estimatedDelivery || null,
  };

  const order = await Order.findByIdAndUpdate(
    request.params.id,
    update,
    { new: true, runValidators: true }
  );

  if (!order) {
    return response.status(404).json({ error: 'Order not found' });
  }

  return response.json({ order });
}

module.exports = {
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
};
