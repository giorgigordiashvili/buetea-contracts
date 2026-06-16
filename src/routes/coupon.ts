import { z } from "zod";
import { defineRoute } from "../http.js";
import { zCouponRecord } from "../entities/coupon.js";

const zCouponInput = z.object({
  code: z.string(),
  percentage: z.number(),
  maxUseCount: z.number(),
  maxUsePerUser: z.number(),
});

export const couponContracts = {
  validate: defineRoute({
    method: "POST",
    path: "/coupon/validate",
    auth: "optional",
    body: z.object({ couponCode: z.string() }),
    response: z.object({
      message: z.string(),
      isValid: z.boolean(),
      coupon: zCouponRecord.nullable(),
    }),
  }),

  // --- admin ---
  create: defineRoute({
    method: "POST",
    path: "/coupon",
    auth: "roles",
    roles: ["ADMIN", "OWNER"],
    body: zCouponInput,
    response: z.object({ message: z.string(), coupon: zCouponRecord.optional() }).passthrough(),
  }),
  list: defineRoute({
    method: "GET",
    path: "/coupon",
    auth: "roles",
    roles: ["ADMIN", "OWNER"],
    response: z.object({ message: z.string(), coupons: z.array(zCouponRecord) }).passthrough(),
  }),
  getById: defineRoute({
    method: "GET",
    path: "/coupon/:id",
    auth: "roles",
    roles: ["ADMIN", "OWNER"],
    params: z.object({ id: z.string() }),
    response: z.object({}).passthrough(),
  }),
  update: defineRoute({
    method: "PATCH",
    path: "/coupon/:id",
    auth: "roles",
    roles: ["ADMIN", "OWNER"],
    params: z.object({ id: z.string() }),
    body: zCouponInput.partial(),
    response: z.object({}).passthrough(),
  }),
  remove: defineRoute({
    method: "DELETE",
    path: "/coupon/:id",
    auth: "roles",
    roles: ["ADMIN", "OWNER"],
    params: z.object({ id: z.string() }),
    response: z.object({ message: z.string() }),
  }),
} as const;
