import api from './api';

/**
 * @param {{ page?: number, size?: number }} params
 */
export async function fetchOrders(params = {}) {
  const { page = 1, size = 10 } = params;
  const { data } = await api.get('/orders', { params: { page, size } });
  return data;
}

/**
 * @param {string} id
 */
export async function fetchOrder(id) {
  const { data } = await api.get(`/orders/${id}`);
  return data;
}

/**
 * @param {object} payload
 */
export async function createOrder(payload) {
  const { data } = await api.post('/orders', payload);
  return data;
}

/**
 * @param {string} id
 */
export async function deleteOrder(id) {
  await api.delete(`/orders/${id}`);
}
