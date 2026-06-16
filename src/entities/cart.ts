import { z } from "zod";
import { zProduct } from "./product.js";
import { zCoupon } from "./coupon.js";

/** A single line item in the cart. `userId` is null for guest carts. */
export const zCartItem = z
  .object({
    id: z.string(),
    userId: z.string().nullish(),
    guestSessionId: z.string().nullish(),
    productId: z.string(),
    quantity: z.number(),
    itemTotal: z.number(),
    itemDiscount: z.number().optional(),
    product: zProduct,
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .passthrough();
export type CartItem = z.infer<typeof zCartItem>;

/** Response of `GET /cart`. */
export const zCartResponse = z.object({
  message: z.string(),
  items: z.array(zCartItem),
  subtotal: z.number(),
  productDiscount: z.number().optional(),
  couponDiscount: z.number().optional(),
  discount: z.number(),
  total: z.number(),
  coupon: zCoupon.nullable(),
});
export type CartResponse = z.infer<typeof zCartResponse>;
