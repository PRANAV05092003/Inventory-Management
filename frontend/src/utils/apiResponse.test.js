import { describe, expect, it } from 'vitest';

import { extractItems, normalizePaginatedResponse } from './apiResponse';

describe('apiResponse', () => {
  it('extractItems returns [] when items missing', () => {
    expect(extractItems(null)).toEqual([]);
    expect(extractItems(undefined)).toEqual([]);
    expect(extractItems({ total: 0 })).toEqual([]);
  });

  it('extractItems reads body.items', () => {
    expect(extractItems({ items: [{ id: '1' }], total: 1 })).toEqual([{ id: '1' }]);
  });

  it('extractItems reads nested data.items', () => {
    expect(extractItems({ data: { items: [], total: 0 } })).toEqual([]);
  });

  it('normalizePaginatedResponse handles empty API shape', () => {
    const result = normalizePaginatedResponse({
      items: [],
      total: 0,
      page: 1,
      size: 10,
    });
    expect(result.items).toEqual([]);
    expect(result.total).toBe(0);
  });

  it('normalizePaginatedResponse does not throw when items is undefined', () => {
    const result = normalizePaginatedResponse({ total: 0, page: 1, size: 10 });
    expect(result.items).toEqual([]);
    expect(result.total).toBe(0);
  });
});
