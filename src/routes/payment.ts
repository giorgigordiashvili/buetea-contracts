import { z } from "zod";
import { defineRoute } from "../http.js";

const zPaymentRecord = z
  .object({
    id: z.string(),
    orderId: z.string(),
    bogOrderId: z.string().nullish(),
    status: z.string(),
    amount: z.number(),
    currency: z.string(),
    redirectUrl: z.string().nullish(),
    callbackReceived: z.boolean().optional(),
  })
  .passthrough();

export const paymentContracts = {
  initiate: defineRoute({
    method: "POST",
    path: "/payments/initiate",
    auth: "optional",
    body: z.object({
      orderId: z.string(),
      captureType: z.enum(["automatic", "manual"]).optional(),
      lang: z.string().optional(),
      theme: z.string().optional(),
      paymentMethods: z.array(z.string()).optional(),
    }),
    response: z.object({
      message: z.string(),
      redirectUrl: z.string(),
      paymentId: z.string(),
      bogOrderId: z.string(),
    }),
  }),

  callback: defineRoute({
    method: "POST",
    path: "/payments/callback",
    auth: "public",
    rawResponse: true, // BOG webhook — raw body, always 200
    response: z.unknown(),
  }),

  getStatus: defineRoute({
    method: "GET",
    path: "/payments/:orderId/status",
    auth: "optional",
    params: z.object({ orderId: z.string() }),
    response: z.object({ message: z.string(), payment: zPaymentRecord }),
  }),

  approve: defineRoute({
    method: "POST",
    path: "/payments/:orderId/approve",
    auth: "jwt",
    params: z.object({ orderId: z.string() }),
    body: z.object({ amount: z.number().optional(), description: z.string().optional() }),
    response: z.object({ message: z.string(), action: z.unknown() }),
  }),
  cancel: defineRoute({
    method: "POST",
    path: "/payments/:orderId/cancel",
    auth: "jwt",
    params: z.object({ orderId: z.string() }),
    body: z.object({ description: z.string().optional() }),
    response: z.object({ message: z.string(), action: z.unknown() }),
  }),

  getBlocked: defineRoute({
    method: "GET",
    path: "/payments/admin/blocked",
    auth: "roles",
    roles: ["ADMIN", "OWNER"],
    response: z.object({ message: z.string(), payments: z.array(z.unknown()) }),
  }),

  approveAdmin: defineRoute({
    method: "POST",
    path: "/payments/admin/:orderId/approve",
    auth: "roles",
    roles: ["ADMIN", "OWNER"],
    params: z.object({ orderId: z.string() }),
    body: z.object({ amount: z.number().optional(), description: z.string().optional() }),
    response: z.object({ message: z.string(), action: z.unknown() }),
  }),
  cancelAdmin: defineRoute({
    method: "POST",
    path: "/payments/admin/:orderId/cancel",
    auth: "roles",
    roles: ["ADMIN", "OWNER"],
    params: z.object({ orderId: z.string() }),
    body: z.object({ description: z.string().optional() }),
    response: z.object({ message: z.string(), action: z.unknown() }),
  }),
} as const;
