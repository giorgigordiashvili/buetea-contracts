import { z } from "zod";
import { defineRoute } from "../http.js";
import { zOrder, zOrderStatus } from "../entities/order.js";

export const orderContracts = {
  getUserOrders: defineRoute({
    method: "GET",
    path: "/order",
    auth: "jwt",
    query: z.object({ lang: z.string().optional() }),
    response: z.object({ message: z.string(), orders: z.array(zOrder) }),
  }),

  getAllOrders: defineRoute({
    method: "GET",
    path: "/order/admin",
    auth: "roles",
    roles: ["ADMIN", "OWNER"],
    query: z.object({ lang: z.string().optional() }),
    response: z.object({ message: z.string(), orders: z.array(zOrder) }),
  }),

  getOrderById: defineRoute({
    method: "GET",
    path: "/order/:id",
    auth: "optional",
    params: z.object({ id: z.string() }),
    query: z.object({ lang: z.string().optional() }),
    response: z.object({ message: z.string(), order: zOrder }),
  }),

  updateOrderStatus: defineRoute({
    method: "PATCH",
    path: "/order/:id/status",
    auth: "optional",
    params: z.object({ id: z.string() }),
    body: z.object({ status: zOrderStatus }),
    response: z.object({ message: z.string(), order: zOrder.partial().passthrough() }),
  }),
} as const;
