import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';
import { parseOrBadRequest } from './parseOrBadRequest';

// This is a "pure function" test: give it input, check the output. No mocks
// needed. Pure functions are the easiest thing to test, so start here.
describe('parseOrBadRequest', () => {
  const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1'),
  });

  it('returns the cleaned-up data when the input is valid', () => {
    const result = parseOrBadRequest(schema, { name: 'Resistor', quantity: '5' });

    // toEqual compares objects by value (toBe would compare identity)
    expect(result).toEqual({ name: 'Resistor', quantity: 5 });
  });

  it('throws a 400 BadRequestException when the input is invalid', () => {
    // Wrap the call in a function - expect() needs to run it itself so it can catch the throw
    expect(() => parseOrBadRequest(schema, { name: 'Resistor', quantity: 0 })).toThrow(
      BadRequestException,
    );
  });

  it('puts every problem in the error message', () => {
    // toThrow('text') passes when the error message CONTAINS that text
    expect(() => parseOrBadRequest(schema, { name: '', quantity: 0 })).toThrow(
      'Name is required, Quantity must be at least 1',
    );
  });

  it('rejects data that is not an object at all', () => {
    expect(() => parseOrBadRequest(schema, undefined)).toThrow(BadRequestException);
    expect(() => parseOrBadRequest(schema, 'nope')).toThrow(BadRequestException);
  });
});
