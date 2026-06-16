import { z } from "zod";
import { defineRoute } from "../http.js";
import { zCartResponse } from "../entities/cart.js";
import { zUuid } from "../primitives/ids.js";

const zMessage = z.object({ message: z.string() });

export const cartContracts = {
  getCart: defineRoute({
    method: "GET",
    path: "/cart",
    auth: "optional",
    query: z.object({
      lang: z.string().optional(),
      couponCode: z.string().optional(),
    }),
    response: zCartResponse,
  }),

  getCartCount: defineRoute({
    method: "GET",
    path: "/cart/count",
    auth: "optional",
    response: z.object({ message: z.string(), count: z.number() }),
  }),

  addToCart: defineRoute({
    method: "POST",
    path: "/cart",
    auth: "optional",
    body: z.object({
      productId: zUuid,
      quantity: z.number().int().min(1).optional(),
    }),
    response: z.object({ message: z.string(), cartItem: z.unknown() }),
  }),

  updateCartItem: defineRoute({
    method: "PATCH",
    path: "/cart/:productId",
    auth: "optional",
    params: z.object({ productId: z.string() }),
    body: z.object({ quantity: z.number().int().min(1) }),
    response: z.object({ message: z.string(), cartItem: z.unknown() }),
  }),

  removeFromCart: defineRoute({
    method: "DELETE",
    path: "/cart/:productId",
    auth: "optional",
    params: z.object({ productId: z.string() }),
    response: zMessage,
  }),

  clearCart: defineRoute({
    method: "DELETE",
    path: "/cart",
    auth: "optional",
    response: z.object({ message: z.string(), deletedCount: z.number() }),
  }),

  mergeGuestCart: defineRoute({
    method: "POST",
    path: "/cart/merge",
    auth: "jwt",
    body: z.object({ guestSessionId: zUuid }),
    response: z.object({ message: z.string(), mergedCount: z.number() }),
  }),
} as const;
