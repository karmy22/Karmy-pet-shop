import {
  fetchProducts,
  fetchFeaturedProducts,
} from '../api/catalogApi';

export const PRODUCT_CATALOG = [];

export function getProductsByCategory(speciesSlug, categorySlug) {
  return fetchProducts({ species: speciesSlug, categorySlug });
}

export function getProductsBySeasonalCollection(collectionSlug) {
  return fetchProducts({ seasonalCollection: collectionSlug });
}

export function getFeaturedProducts(limit = 6) {
  return fetchFeaturedProducts(limit);
}
