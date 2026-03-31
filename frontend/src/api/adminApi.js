import { apiRequest } from './client';

function withAuthHeaders(token) {
  if (!token) {
    throw new Error('Missing Firebase bearer token');
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

export function createCategory(payload, token) {
  return apiRequest('/api/admin/categories', {
    method: 'POST',
    headers: withAuthHeaders(token),
    body: JSON.stringify(payload),
  });
}

export function updateCategory(id, payload, token) {
  return apiRequest(`/api/admin/categories/${id}`, {
    method: 'PUT',
    headers: withAuthHeaders(token),
    body: JSON.stringify(payload),
  });
}

export function deleteCategory(id, token) {
  return apiRequest(`/api/admin/categories/${id}`, {
    method: 'DELETE',
    headers: withAuthHeaders(token),
  });
}

export function listCategories(token) {
  return apiRequest('/api/admin/categories', {
    method: 'GET',
    headers: withAuthHeaders(token),
  });
}

export function toggleCategoryVisibility(id, isActive, token) {
  return apiRequest(`/api/admin/categories/${id}/visibility`, {
    method: 'PATCH',
    headers: withAuthHeaders(token),
    body: JSON.stringify({ isActive }),
  });
}

export function createProduct(payload, token) {
  return apiRequest('/api/admin/products', {
    method: 'POST',
    headers: withAuthHeaders(token),
    body: JSON.stringify(payload),
  });
}

export function updateProduct(id, payload, token) {
  return apiRequest(`/api/admin/products/${id}`, {
    method: 'PUT',
    headers: withAuthHeaders(token),
    body: JSON.stringify(payload),
  });
}

export function deleteProduct(id, token) {
  return apiRequest(`/api/admin/products/${id}`, {
    method: 'DELETE',
    headers: withAuthHeaders(token),
  });
}

export function listProducts(token) {
  return apiRequest('/api/admin/products', {
    method: 'GET',
    headers: withAuthHeaders(token),
  });
}

export function toggleProductVisibility(id, isActive, token) {
  return apiRequest(`/api/admin/products/${id}/visibility`, {
    method: 'PATCH',
    headers: withAuthHeaders(token),
    body: JSON.stringify({ isActive }),
  });
}

export function listOrders(token) {
  return apiRequest('/api/admin/orders', {
    method: 'GET',
    headers: withAuthHeaders(token),
  });
}

export function updateOrderStatus(id, status, token) {
  return apiRequest(`/api/admin/orders/${id}/status`, {
    method: 'PATCH',
    headers: withAuthHeaders(token),
    body: JSON.stringify({ status }),
  });
}

export function updateShipment(id, payload, token) {
  return apiRequest(`/api/admin/orders/${id}/shipment`, {
    method: 'PATCH',
    headers: withAuthHeaders(token),
    body: JSON.stringify(payload),
  });
}
