import { z } from "zod";
import { defineRoute } from "../http.js";

/** Tbilisi delivery districts. */
export const districtContracts = {
  list: defineRoute({
    method: "GET",
    path: "/tbilisi-districts",
    auth: "public",
    query: z.object({ lang: z.string().optional() }),
    response: z
      .object({
        message: z.string().optional(),
        districts: z.array(
          z
            .object({ id: z.string(), name: z.string(), sortOrder: z.number().optional() })
            .passthrough(),
        ),
      })
      .passthrough(),
  }),
} as const;

/** Loyalty tokens. */
export const tokenContracts = {
  balance: defineRoute({
    method: "GET",
    path: "/token/balance",
    auth: "jwt",
    response: z.object({}).passthrough(),
  }),
} as const;

/** Newsletter. */
export const emailSubscriptionContracts = {
  subscribe: defineRoute({
    method: "POST",
    path: "/email-subscription",
    auth: "public",
    body: z.object({ email: z.string().email() }),
    response: z.object({ message: z.string() }).passthrough(),
  }),
} as const;
