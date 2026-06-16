import { z } from "zod";
import { zLocalized } from "../primitives/localized.js";

/** A localized nested relation (category/lifestyle/type) as returned in product payloads. */
export const zProductRelation = z
  .object({
    id: z.string(),
    name: z.string(),
    nameLocalized: zLocalized.nullish(),
  })
  .passthrough();

/**
 * Product as returned in listings, detail, cart and order payloads. The server
 * resolves localized `name`/`description` to strings and derives image fields
 * (`headlineImage`, `hoverImage`, `galleryImages`) plus price fields from the
 * base record. `.passthrough()` tolerates the per-endpoint variations while the
 * contract is tightened module by module.
 */
export const zProduct = z
  .object({
    id: z.string(),
    name: z.string(),
    nameLocalized: zLocalized.nullish(),
    description: z.string().nullish(),
    images: z.array(z.string()).optional(),
    headlineImage: z.string().nullish(),
    hoverImage: z.string().nullish(),
    galleryImages: z.array(z.string()).optional(),
    fixedPrice: z.number(),
    originalPrice: z.number().optional(),
    discount: z.number().optional(),
    discountAmount: z.number().optional(),
    discountPercentage: z.number().optional(),
    onSale: z.boolean().optional(),
    salePercentage: z.number().nullish(),
    rating: z.number().optional(),
    stock: z.boolean().optional(),
    stockQuantity: z.number().optional(),
    weight: z.number().nullish(),
    token: z.union([z.number(), z.string()]).optional(),
    category: zProductRelation.nullish(),
    lifestyle: zProductRelation.nullish(),
    type: zProductRelation.nullish(),
  })
  .passthrough();

export type Product = z.infer<typeof zProduct>;
