import { z } from "zod";
import { defineRoute } from "../http.js";
import { zBillingAddressInput } from "../entities/address.js";
import { zBillingAddress } from "../entities/address.js";
import { zOrder } from "../entities/order.js";
import { zPaymentMethod } from "../entities/order.js";
import { zCoupon } from "../entities/coupon.js";

/** Body of `POST /checkout` (ports the server CheckoutDto). */
export const zCheckoutBody = z.object({
  billingAddress: zBillingAddressInput,
  couponCode: z.string().max(64).optional(),
  saveAddress: z.boolean().optional(),
  paymentMethod: zPaymentMethod.optional(),
});
export type CheckoutBody = z.infer<typeof zCheckoutBody>;

export const checkoutContracts = {
  getCheckoutData: defineRoute({
    method: "GET",
    path: "/checkout",
    auth: "optional",
    query: z.object({
      lang: z.string().optional(),
      couponCode: z.string().optional(),
    }),
    response: z.object({
      message: z.string(),
      items: z.array(z.unknown()),
      subtotal: z.number(),
      discount: z.number(),
      shipping: z.number(),
      total: z.number(),
      coupon: zCoupon.nullable(),
      billingAddress: zBillingAddress.nullable(),
    }),
  }),

  placeOrder: defineRoute({
    method: "POST",
    path: "/checkout",
    auth: "optional",
    body: zCheckoutBody,
    response: z.object({ message: z.string(), order: zOrder }),
  }),
} as const;
