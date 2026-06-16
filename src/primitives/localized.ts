import { z } from "zod";

/**
 * Localized JSON blob as stored on many entities (Product.nameLocalized etc.).
 * Server picks a single resolved string per request, but admin/raw responses
 * may expose the full map, so it's available as a building block.
 */
export const zLocalized = z
  .object({
    en: z.string(),
    ka: z.string(),
    ru: z.string(),
  })
  .partial();

export type Localized = z.infer<typeof zLocalized>;
