import api from './api';
import { normalizePaginatedResponse } from '../utils/apiResponse';

/**
 * @param {{ page?: number, size?: number }} params
 * @returns {Promise<{ items: object[], total: number, page: number, size: number }>}
 */
export async function fetchProducts(params = {}) {
  const { page = 1, size = 10 } = params;
  const { data } = await api.get('/products', { params: { page, size } });
  return normalizePaginatedResponse(data);
}

/**
 * @param {string} id
 */
export async function fetchProduct(id) {
  const { data } = await api.get(`/products/${id}`);
  return data;
}

/**
 * @param {object} payload
 */
export async function createProduct(payload) {
  const { data } = await api.post('/products', payload);
  return data;
}

/**
 * @param {string} id
 * @param {object} payload
 */
export async function updateProduct(id, payload) {
  const { data } = await api.put(`/products/${id}`, payload);
  return data;
}

/**
 * @param {string} id
 */
export async function deleteProduct(id) {
  await api.delete(`/products/${id}`);
}
