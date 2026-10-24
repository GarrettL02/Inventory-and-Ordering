import { AdjustStockSchema, PartsQuerySchema } from './parts.schema';

describe('AdjustStockSchema', () => {
  it('accepts a positive or negative whole-number delta', () => {
    expect(AdjustStockSchema.parse({ delta: 5 }).delta).toBe(5);
    expect(AdjustStockSchema.parse({ delta: -2 }).delta).toBe(-2);
  });

  it('defaults the reason to "manual" and trims it', () => {
    expect(AdjustStockSchema.parse({ delta: 1 }).reason).toBe('manual');
    expect(AdjustStockSchema.parse({ delta: 1, reason: '  used on job ' }).reason).toBe(
      'used on job',
    );
  });

  it('rejects a delta of 0 with a helpful message', () => {
    const result = AdjustStockSchema.safeParse({ delta: 0 });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('delta cannot be 0');
  });

  it.each([
    ['a fractional delta', { delta: 1.5 }],
    ['a delta sent as text', { delta: '3' }],
    ['a missing delta', {}],
    ['a blank reason', { delta: 1, reason: '   ' }],
    ['a reason over 64 characters', { delta: 1, reason: 'x'.repeat(65) }],
  ])('rejects %s', (_label, input) => {
    expect(AdjustStockSchema.safeParse(input).success).toBe(false);
  });
});

describe('PartsQuerySchema', () => {
  it('adds the optional search text on top of pagination', () => {
    expect(PartsQuerySchema.parse({ page: '2', limit: '5', search: 'diode' })).toEqual({
      page: 2,
      limit: 5,
      search: 'diode',
    });
  });

  it('works with no search and no pagination', () => {
    expect(PartsQuerySchema.parse({})).toEqual({ page: 1, limit: 15 });
  });
});
