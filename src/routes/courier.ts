import { z } from "zod";
import { defineRoute } from "../http.js";
import { zOrderStatus } from "../entities/order.js";
import { zAccount } from "../entities/account.js";

// Courier order/stat payloads are kept loose (z.any) until verified against the
// live courier endpoints, so adopting the contract can't break the running app.
const zOrderList = z
  .object({ message: z.string().optional(), orders: z.array(z.any()) })
  .passthrough();
const zOrderResult = z
  .object({ message: z.string().optional(), order: z.any() })
  .passthrough();

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
    response: zOrderList,
  }),

  myOrders: defineRoute({
    method: "GET",
    path: "/courier/orders",
    auth: "roles",
    roles: ["COURIER"],
    response: zOrderList,
  }),

  orderDetails: defineRoute({
    method: "GET",
    path: "/courier/orders/:id",
    auth: "roles",
    roles: ["COURIER"],
    params: z.object({ id: z.string() }),
    response: zOrderResult,
  }),

  pickOrder: defineRoute({
    method: "POST",
    path: "/courier/orders/:orderId/pick",
    auth: "roles",
    roles: ["COURIER"],
    params: z.object({ orderId: z.string() }),
    response: zOrderResult,
  }),

  updateOrderStatus: defineRoute({
    method: "PATCH",
    path: "/courier/orders/:id/status",
    auth: "roles",
    roles: ["COURIER"],
    params: z.object({ id: z.string() }),
    body: z.object({ status: zOrderStatus }),
    response: zOrderResult,
  }),

  stats: defineRoute({
    method: "GET",
    path: "/courier/stats",
    auth: "roles",
    roles: ["COURIER"],
    response: z
      .object({ message: z.string().optional(), stats: z.any() })
      .passthrough(),
  }),
} as const;
