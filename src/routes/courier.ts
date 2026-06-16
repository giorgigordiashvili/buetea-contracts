import { z } from "zod";
import { defineRoute } from "../http.js";
import { zOrder, zOrderStatus } from "../entities/order.js";
import { zAccount } from "../entities/account.js";

export const courierContracts = {
  login: defineRoute({
    method: "POST",
    path: "/account/courier/login",
    auth: "public",
    body: z.object({
      email: z.string().email(),
      password: z.string(),
      turnstileToken: z.string().optional(),
    }),
    response: z
      .object({ accessToken: z.string().optional(), user: zAccount.optional() })
      .passthrough(),
  }),

  availableOrders: defineRoute({
    method: "GET",
    path: "/courier/available-orders",
    auth: "roles",
    roles: ["COURIER"],
    response: z
      .object({ message: z.string().optional(), orders: z.array(zOrder) })
      .passthrough(),
  }),

  myOrders: defineRoute({
    method: "GET",
    path: "/courier/orders",
    auth: "roles",
    roles: ["COURIER"],
    response: z
      .object({ message: z.string().optional(), orders: z.array(zOrder) })
      .passthrough(),
  }),

  orderDetails: defineRoute({
    method: "GET",
    path: "/courier/orders/:id",
    auth: "roles",
    roles: ["COURIER"],
    params: z.object({ id: z.string() }),
    response: z.object({ message: z.string().optional(), order: zOrder }).passthrough(),
  }),

  pickOrder: defineRoute({
    method: "POST",
    path: "/courier/orders/:orderId/pick",
    auth: "roles",
    roles: ["COURIER"],
    params: z.object({ orderId: z.string() }),
    response: z.object({ message: z.string() }).passthrough(),
  }),

  updateOrderStatus: defineRoute({
    method: "PATCH",
    path: "/courier/orders/:id/status",
    auth: "roles",
    roles: ["COURIER"],
    params: z.object({ id: z.string() }),
    body: z.object({ status: zOrderStatus }),
    response: z.object({ message: z.string() }).passthrough(),
  }),

  stats: defineRoute({
    method: "GET",
    path: "/courier/stats",
    auth: "roles",
    roles: ["COURIER"],
    response: z.object({}).passthrough(),
  }),
} as const;
