import { z } from "zod";
import { defineRoute } from "../http.js";

const zShippingSettings = z
  .object({
    freeShippingThreshold: z.number().nullish(),
    shippingPrice: z.number().nullish(),
  })
  .passthrough();

export const shippingContracts = {
  getPrice: defineRoute({
    method: "GET",
    path: "/shipping/price",
    auth: "public",
    response: z.object({}).passthrough(),
  }),
  getSettings: defineRoute({
    method: "GET",
    path: "/shipping/settings",
    auth: "public",
    response: z.object({}).passthrough(),
  }),
  updateSettings: defineRoute({
    method: "PATCH",
    path: "/shipping/settings",
    auth: "roles",
    roles: ["ADMIN", "OWNER"],
    body: zShippingSettings.partial(),
    response: z.object({}).passthrough(),
  }),
} as const;
