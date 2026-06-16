import { z } from "zod";

/** Common list query params. Query values arrive as strings, so coerce. */
export const zPageQuery = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  lang: z.string().optional(),
});

/** Standard pagination envelope returned by list endpoints. */
export const zPagination = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export type Pagination = z.infer<typeof zPagination>;

/** Wrap an item schema into a `{ items, pagination }` style list response. */
export const zPaginated = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    items: z.array(item),
    pagination: zPagination,
  });
