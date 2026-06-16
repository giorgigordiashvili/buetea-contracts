import { z } from "zod";
import { defineRoute } from "../http.js";

const zMessage = z.object({ message: z.string() }).passthrough();
const zAnyObject = z.object({}).passthrough();
const adminRoles = ["ADMIN", "OWNER"];
const zHomeQuery = z.object({ lang: z.string().optional(), limit: z.coerce.number().optional() });

export const contactContracts = {
  create: defineRoute({
    method: "POST", path: "/contact", auth: "public",
    body: z.object({ name: z.string(), email: z.string().email(), message: z.string() }).passthrough(),
    response: zMessage,
  }),
  list: defineRoute({ method: "GET", path: "/contact", auth: "roles", roles: adminRoles, response: zAnyObject }),
  getById: defineRoute({ method: "GET", path: "/contact/:id", auth: "roles", roles: adminRoles, params: z.object({ id: z.string() }), response: zAnyObject }),
  remove: defineRoute({ method: "DELETE", path: "/contact/:id", auth: "roles", roles: adminRoles, params: z.object({ id: z.string() }), response: zMessage }),
  removeAll: defineRoute({ method: "DELETE", path: "/contact", auth: "roles", roles: adminRoles, response: zMessage }),
} as const;

export const teamContracts = {
  create: defineRoute({ method: "POST", path: "/team", auth: "roles", roles: adminRoles, contentType: "multipart", response: zAnyObject }),
  list: defineRoute({ method: "GET", path: "/team", auth: "public", response: zAnyObject }),
  getById: defineRoute({ method: "GET", path: "/team/:id", auth: "roles", roles: adminRoles, params: z.object({ id: z.string() }), response: zAnyObject }),
  update: defineRoute({ method: "PATCH", path: "/team/:id", auth: "roles", roles: adminRoles, contentType: "multipart", params: z.object({ id: z.string() }), response: zAnyObject }),
  remove: defineRoute({ method: "DELETE", path: "/team/:id", auth: "roles", roles: adminRoles, params: z.object({ id: z.string() }), response: zMessage }),
  removeAll: defineRoute({ method: "DELETE", path: "/team", auth: "roles", roles: adminRoles, response: zMessage }),
} as const;

export const reviewContracts = {
  create: defineRoute({
    method: "POST", path: "/product/:productId/review", auth: "jwt",
    params: z.object({ productId: z.string() }),
    body: z.object({ rating: z.number(), comment: z.string().optional() }).passthrough(),
    response: zAnyObject,
  }),
  list: defineRoute({
    method: "GET", path: "/product/:productId/review", auth: "public",
    params: z.object({ productId: z.string() }), response: zAnyObject,
  }),
  update: defineRoute({
    method: "PATCH", path: "/product/:productId/review/:reviewId", auth: "jwt",
    params: z.object({ productId: z.string(), reviewId: z.string() }),
    body: z.object({ rating: z.number().optional(), comment: z.string().optional() }).passthrough(),
    response: zAnyObject,
  }),
  remove: defineRoute({
    method: "DELETE", path: "/product/:productId/review/:reviewId", auth: "jwt",
    params: z.object({ productId: z.string(), reviewId: z.string() }), response: zMessage,
  }),
} as const;

export const homeContracts = {
  randomProducts: defineRoute({ method: "GET", path: "/home/random-products", auth: "public", query: zHomeQuery, response: zAnyObject }),
  productsOnSale: defineRoute({ method: "GET", path: "/home/products-on-sale", auth: "public", query: zHomeQuery, response: zAnyObject }),
  types: defineRoute({ method: "GET", path: "/home/types", auth: "public", query: zHomeQuery, response: zAnyObject }),
  popularProducts: defineRoute({ method: "GET", path: "/home/popular-products", auth: "public", query: zHomeQuery, response: zAnyObject }),
  flavours: defineRoute({ method: "GET", path: "/home/flavours", auth: "public", query: zHomeQuery, response: zAnyObject }),
  reviews: defineRoute({ method: "GET", path: "/home/reviews", auth: "public", response: zAnyObject }),
  latestBlogs: defineRoute({ method: "GET", path: "/home/latest-blogs", auth: "public", query: zHomeQuery, response: zAnyObject }),
} as const;
