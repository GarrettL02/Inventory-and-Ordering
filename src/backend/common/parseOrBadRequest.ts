import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';

// Validate request data (a body or query string) with a zod schema.
// Returns the typed, cleaned-up data, or throws a 400 listing what was wrong.
export function parseOrBadRequest<T extends z.ZodType>(
  schema: T,
  data: unknown,
): z.output<T> {
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new BadRequestException(
      result.error.issues.map((issue) => issue.message).join(', '),
    );
  }

  return result.data;
}
