import api from './api';

/**
 * @param {{ page?: number, size?: number }} params
 */
export async function fetchCustomers(params = {}) {
  const { page = 1, size = 10 } = params;
  const { data } = await api.get('/customers', { params: { page, size } });
  return data;
}

/**
 * @param {object} payload
 */
export async function createCustomer(payload) {
  const { data } = await api.post('/customers', payload);
  return data;
}

/**
 * @param {string} id
 */
export async function deleteCustomer(id) {
  await api.delete(`/customers/${id}`);
}
