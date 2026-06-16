import { z } from "zod";
import { zProduct } from "./product.js";
import { zBillingAddress } from "./address.js";

export const zOrderStatus = z.enum([
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
]);
export type OrderStatus = z.infer<typeof zOrderStatus>;

export const zPaymentMethod = z.enum(["CASH_ON_DELIVERY", "DIRECT_BANK_TRANSFER"]);
export type PaymentMethod = z.infer<typeof zPaymentMethod>;

/** A single order line item. */
export const zOrderItem = z
  .object({
    id: z.string(),
    orderId: z.string().optional(),
    productId: z.string().optional(),
    quantity: z.number(),
    price: z.number(),
    tokens: z.number().optional(),
    product: zProduct.partial().optional(),
    createdAt: z.string().optional(),
  })
  .passthrough();
export type OrderItem = z.infer<typeof zOrderItem>;

/** An order as returned by checkout / order endpoints. */
export const zOrder = z
  .object({
    id: z.string(),
    orderNumber: z.string(),
    status: zOrderStatus,
    subtotal: z.number(),
    discount: z.number(),
    shipping: z.number().optional(),
    total: z.number(),
    tokensEarned: z.number().optional(),
    couponCode: z.string().nullish(),
    paymentMethod: z.string().optional(),
    items: z.array(zOrderItem).optional(),
    orderItems: z.array(zOrderItem).optional(),
    billingAddress: zBillingAddress,
    invoice: z.unknown().optional(),
    createdAt: z.string(),
    updatedAt: z.string().optional(),
  })
  .passthrough();
export type Order = z.infer<typeof zOrder>;
