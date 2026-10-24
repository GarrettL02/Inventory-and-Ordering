import { PaginationQuerySchema, TotalRowSchema } from './common.schema';

describe('PaginationQuerySchema', () => {
  it('falls back to page 1 and limit 15 when nothing is sent', () => {
    expect(PaginationQuerySchema.parse({})).toEqual({ page: 1, limit: 15 });
  });

  it('turns query-string text into numbers', () => {
    // ?page=3&limit=50 arrives as the strings '3' and '50'
    expect(PaginationQuerySchema.parse({ page: '3', limit: '50' })).toEqual({
      page: 3,
      limit: 50,
    });
  });

  // it.each runs the same test once per row - handy for lists of bad inputs
  it.each([
    ['page is 0', { page: '0' }],
    ['page is negative', { page: '-1' }],
    ['page is not a whole number', { page: '1.5' }],
    ['page is not a number', { page: 'abc' }],
    ['limit is 0', { limit: '0' }],
  ])('rejects the query when %s', (_label, query) => {
    expect(PaginationQuerySchema.safeParse(query).success).toBe(false);
  });
});

describe('TotalRowSchema', () => {
  it('accepts the shape of a COUNT(*) row', () => {
    expect(TotalRowSchema.parse({ total: 31 })).toEqual({ total: 31 });
  });

  it('rejects a count that came back as text', () => {
    expect(TotalRowSchema.safeParse({ total: '31' }).success).toBe(false);
  });
});
