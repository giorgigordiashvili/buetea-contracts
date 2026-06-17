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
  activity: defineRoute({
    method: "GET",
    path: "/token/activity",
    auth: "jwt",
    query: z.object({ limit: z.string().optional() }),
    response: z
      .object({
        message: z.string().optional(),
        activities: z.array(z.object({}).passthrough()),
      })
      .passthrough(),
  }),
  redeem: defineRoute({
    method: "POST",
    path: "/token/redeem",
    auth: "jwt",
    body: z.object({ amount: z.number().min(0.01), description: z.string().optional() }),
    response: z
      .object({
        message: z.string().optional(),
        balance: z.unknown(),
        redeemedAmount: z.unknown(),
      })
      .passthrough(),
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
