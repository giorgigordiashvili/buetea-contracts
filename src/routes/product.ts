import { z } from "zod";
import { defineRoute } from "../http.js";
import { zProduct } from "../entities/product.js";

const zMessage = z.object({ message: z.string() });

/** Query params for the product listing (mirrors the client GetProductsQuery). */
export const zProductListQuery = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).optional(),
  categoryId: z.string().optional(),
  typeId: z.string().optional(),
  lifestyleId: z.string().optional(),
  inStock: z.coerce.boolean().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  minDiscount: z.coerce.number().optional(),
  maxDiscount: z.coerce.number().optional(),
  minRating: z.coerce.number().optional(),
  maxRating: z.coerce.number().optional(),
  lang: z.string().optional(),
  relatedLimit: z.coerce.number().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export const productContracts = {
  getAll: defineRoute({
    method: "GET",
    path: "/product",
    auth: "public",
    query: zProductListQuery,
    response: z
      .object({ message: z.string().optional(), products: z.array(zProduct) })
      .passthrough(),
  }),

  getById: defineRoute({
    method: "GET",
    path: "/product/:id",
    auth: "public",
    params: z.object({ id: z.string() }),
    query: z.object({ lang: z.string().optional(), relatedLimit: z.coerce.number().optional() }),
    response: z.object({}).passthrough(),
  }),

  incrementPopularity: defineRoute({
    method: "POST",
    path: "/product/:id/click",
    auth: "public",
    params: z.object({ id: z.string() }),
    response: zMessage.passthrough(),
  }),

  // --- admin ---
  create: defineRoute({
    method: "POST",
    path: "/product",
    auth: "roles",
    roles: ["ADMIN", "OWNER"],
    contentType: "multipart",
    response: z.object({ message: z.string(), product: zProduct.optional() }).passthrough(),
  }),
  update: defineRoute({
    method: "PATCH",
    path: "/product/:id",
    auth: "roles",
    roles: ["ADMIN", "OWNER"],
    contentType: "multipart",
    params: z.object({ id: z.string() }),
    response: z.object({ message: z.string(), product: zProduct.optional() }).passthrough(),
  }),
  delete: defineRoute({
    method: "DELETE",
    path: "/product/:id",
    auth: "roles",
    roles: ["ADMIN", "OWNER"],
    params: z.object({ id: z.string() }),
    response: zMessage.passthrough(),
  }),
  deleteAll: defineRoute({
    method: "DELETE",
    path: "/product",
    auth: "roles",
    roles: ["ADMIN", "OWNER"],
    response: zMessage.passthrough(),
  }),
  bulkSale: defineRoute({
    method: "PATCH",
    path: "/product/bulk-sale",
    auth: "roles",
    roles: ["ADMIN", "OWNER"],
    body: z.object({}).passthrough(),
    response: zMessage.passthrough(),
  }),
  setSale: defineRoute({
    method: "PATCH",
    path: "/product/:id/sale",
    auth: "roles",
    roles: ["ADMIN", "OWNER"],
    params: z.object({ id: z.string() }),
    body: z.object({}).passthrough(),
    response: zMessage.passthrough(),
  }),
} as const;
