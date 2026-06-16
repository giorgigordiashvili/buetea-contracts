import { z } from "zod";
import { defineRoute } from "../http.js";
import { zProduct } from "../entities/product.js";

const zMessage = z.object({ message: z.string() });

export const wishlistContracts = {
  add: defineRoute({
    method: "POST",
    path: "/wishlist/:productId",
    auth: "jwt",
    params: z.object({ productId: z.string() }),
    response: zMessage.passthrough(),
  }),
  remove: defineRoute({
    method: "DELETE",
    path: "/wishlist/:productId",
    auth: "jwt",
    params: z.object({ productId: z.string() }),
    response: zMessage.passthrough(),
  }),
  list: defineRoute({
    method: "GET",
    path: "/wishlist",
    auth: "jwt",
    query: z.object({ lang: z.string().optional() }),
    response: z
      .object({ message: z.string(), items: z.array(z.unknown()).optional(), products: z.array(zProduct).optional() })
      .passthrough(),
  }),
  count: defineRoute({
    method: "GET",
    path: "/wishlist/count",
    auth: "jwt",
    response: z.object({ message: z.string(), count: z.number() }),
  }),
  check: defineRoute({
    method: "GET",
    path: "/wishlist/check/:productId",
    auth: "jwt",
    params: z.object({ productId: z.string() }),
    response: z.object({ message: z.string().optional(), inWishlist: z.boolean() }).passthrough(),
  }),
} as const;
