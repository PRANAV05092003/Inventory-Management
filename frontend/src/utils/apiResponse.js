/**
 * Normalize list API payloads. FastAPI returns { items, total, page, size } on the JSON body.
 * Axios services return `response.data` (body). Guard against missing/null items.
 */

/**
 * @param {unknown} response - Paginated body, or accidental full Axios response
 * @returns {unknown[]}
 */
export function extractItems(response) {
  if (Array.isArray(response?.items)) {
    return response.items;
  }
  if (Array.isArray(response?.data?.items)) {
    return response.data.items;
  }
  return [];
}

/**
 * @param {unknown} response
 * @returns {{ items: unknown[], total: number, page: number, size: number }}
 */
export function normalizePaginatedResponse(response) {
  const body =
    response != null &&
    typeof response === 'object' &&
    'data' in response &&
    'status' in response &&
    !('items' in response)
      ? response.data
      : response;

  const items = extractItems(body);
  const total =
    typeof body?.total === 'number' && Number.isFinite(body.total) ? body.total : items.length;
  const page = typeof body?.page === 'number' && Number.isFinite(body.page) ? body.page : 1;
  const size = typeof body?.size === 'number' && Number.isFinite(body.size) ? body.size : items.length;

  return { items, total, page, size };
}

/**
 * @param {import('axios').AxiosResponse} axiosResponse
 */
export function logAxiosListResponse(axiosResponse) {
  if (!import.meta.env.DEV) return;

  const { config, data, status } = axiosResponse;
  const url = config?.url ?? '';
  if (!/^\/(products|customers|orders)/.test(url)) return;

  console.debug('[API response]', config?.method?.toUpperCase(), url, {
    status,
    bodyType: data === null ? 'null' : typeof data,
    keys: data && typeof data === 'object' ? Object.keys(data) : null,
    itemsIsArray: Array.isArray(data?.items),
    itemsLength: Array.isArray(data?.items) ? data.items.length : null,
    total: data?.total,
    sample: data,
  });
}
