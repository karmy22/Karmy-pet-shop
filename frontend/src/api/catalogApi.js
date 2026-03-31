import { apiRequest } from './client';

function normalizeCategory(category, fallbackSlug = '') {
  if (!category) {
    return fallbackSlug;
  }

  if (typeof category === 'string') {
    return category;
  }

  return category.slug || fallbackSlug;
}

function normalizeProduct(product) {
  return {
    id: product._id || product.slug,
    name: product.name,
    species: product.species,
    category: normalizeCategory(product.category),
    price: Number(product.price || 0),
    badge: product.badges?.[0] || '',
    description: product.description || '',
    seasonalCollection: product.seasonalCollection || '',
    slug: product.slug,
    raw: product,
  };
}

export async function fetchProducts(params = {}) {
  const data = await apiRequest('/api/catalog/products', { query: params });
  return (data.products || []).map(normalizeProduct);
}

export async function fetchCategories(params = {}) {
  const data = await apiRequest('/api/catalog/categories', { query: params });
  return data.categories || [];
}

export async function fetchFeaturedProducts(limit = 8) {
  const products = await fetchProducts({ includeInactive: false });
  return products.slice(0, limit);
}
