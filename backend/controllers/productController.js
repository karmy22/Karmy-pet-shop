const Category = require('../models/Category');
const Product = require('../models/Product');

async function listProducts(request, response) {
  const { species, categorySlug, seasonalCollection, includeInactive } = request.query;

  const query = {};
  if (species) {
    query.species = { $in: [species, 'both'] };
  }
  if (seasonalCollection) {
    query.seasonalCollection = seasonalCollection;
  }
  if (includeInactive !== 'true') {
    query.isActive = true;
  }

  if (categorySlug) {
    const category = await Category.findOne({ slug: categorySlug });
    if (!category) {
      return response.status(404).json({ error: 'Category not found' });
    }
    query.category = category._id;
  }

  const products = await Product.find(query)
    .populate('category', 'name slug species')
    .sort({ createdAt: -1 });

  return response.json({ products });
}

async function getProductBySlug(request, response) {
  const product = await Product.findOne({ slug: request.params.slug })
    .populate('category', 'name slug species')
    .lean();

  if (!product) {
    return response.status(404).json({ error: 'Product not found' });
  }

  return response.json({ product });
}

module.exports = {
  listProducts,
  getProductBySlug,
};
