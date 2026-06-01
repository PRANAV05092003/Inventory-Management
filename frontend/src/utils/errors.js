/**
 * Extract a user-friendly message from FastAPI / Axios errors.
 * @param {import('axios').AxiosError} error
 * @returns {string}
 */
export function getErrorMessage(error) {
  const detail = error?.response?.data?.detail;

  if (typeof detail === 'string') {
    return detail;
  }

  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        const field = item.loc?.slice(-1)[0];
        return field ? `${field}: ${item.msg}` : item.msg;
      })
      .join('; ');
  }

  if (detail && typeof detail === 'object') {
    return JSON.stringify(detail);
  }

  return error?.message || 'An unexpected error occurred';
}
