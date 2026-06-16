import { z } from "zod";

/** Coupon as embedded in cart/checkout responses. */
export const zCoupon = z.object({
  code: z.string(),
  percentage: z.number(),
});
export type Coupon = z.infer<typeof zCoupon>;

/** Full coupon record (admin / validate endpoint). */
export const zCouponRecord = z
  .object({
    id: z.string(),
    code: z.string(),
    percentage: z.number(),
    maxUseCount: z.number(),
    usedCount: z.number(),
    maxUsePerUser: z.number(),
  })
  .passthrough();
export type CouponRecord = z.infer<typeof zCouponRecord>;
