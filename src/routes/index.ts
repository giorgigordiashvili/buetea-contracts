import { authContracts } from "./auth.js";
import { cartContracts } from "./cart.js";
import { checkoutContracts } from "./checkout.js";
import { productContracts } from "./product.js";
import { orderContracts } from "./order.js";
import { paymentContracts } from "./payment.js";
import { wishlistContracts } from "./wishlist.js";
import { addressContracts } from "./address.js";
import { billingAddressContracts } from "./billing-address.js";
import { couponContracts } from "./coupon.js";
import { shippingContracts } from "./shipping.js";
import { courierContracts } from "./courier.js";
import {
  districtContracts,
  tokenContracts,
  emailSubscriptionContracts,
} from "./misc.js";
import {
  blogContracts,
  blogCategoryContracts,
  blogTagContracts,
  blogCommentContracts,
} from "./blog.js";
import {
  contactContracts,
  teamContracts,
  reviewContracts,
  homeContracts,
} from "./content.js";
import { tokenPrizeContracts, leaderboardContracts } from "./rewards.js";
import { accountContracts } from "./account.js";

export { authContracts } from "./auth.js";
export { cartContracts } from "./cart.js";
export { checkoutContracts, zCheckoutBody } from "./checkout.js";
export type { CheckoutBody } from "./checkout.js";
export { productContracts, zProductListQuery } from "./product.js";
export { orderContracts } from "./order.js";
export { paymentContracts } from "./payment.js";
export { wishlistContracts } from "./wishlist.js";
export { addressContracts, zAddressInput } from "./address.js";
export { billingAddressContracts } from "./billing-address.js";
export { couponContracts } from "./coupon.js";
export { shippingContracts } from "./shipping.js";
export { courierContracts } from "./courier.js";
export {
  districtContracts,
  tokenContracts,
  emailSubscriptionContracts,
} from "./misc.js";
export {
  blogContracts,
  blogCategoryContracts,
  blogTagContracts,
  blogCommentContracts,
} from "./blog.js";
export {
  contactContracts,
  teamContracts,
  reviewContracts,
  homeContracts,
} from "./content.js";
export { tokenPrizeContracts, leaderboardContracts } from "./rewards.js";
export { accountContracts } from "./account.js";

/**
 * Flat registry of every route contract, keyed by `module.operation`. Used by
 * the server's contract e2e suite and any tooling that iterates all routes.
 */
export const contracts = {
  ...prefix("auth", authContracts),
  ...prefix("cart", cartContracts),
  ...prefix("checkout", checkoutContracts),
  ...prefix("product", productContracts),
  ...prefix("order", orderContracts),
  ...prefix("payment", paymentContracts),
  ...prefix("wishlist", wishlistContracts),
  ...prefix("address", addressContracts),
  ...prefix("billingAddress", billingAddressContracts),
  ...prefix("coupon", couponContracts),
  ...prefix("shipping", shippingContracts),
  ...prefix("courier", courierContracts),
  ...prefix("district", districtContracts),
  ...prefix("token", tokenContracts),
  ...prefix("emailSubscription", emailSubscriptionContracts),
  ...prefix("blog", blogContracts),
  ...prefix("blogCategory", blogCategoryContracts),
  ...prefix("blogTag", blogTagContracts),
  ...prefix("blogComment", blogCommentContracts),
  ...prefix("contact", contactContracts),
  ...prefix("team", teamContracts),
  ...prefix("review", reviewContracts),
  ...prefix("home", homeContracts),
  ...prefix("tokenPrize", tokenPrizeContracts),
  ...prefix("leaderboard", leaderboardContracts),
  ...prefix("account", accountContracts),
} as const;

function prefix<T extends Record<string, unknown>>(
  name: string,
  group: T,
): { [K in keyof T as `${typeof name}.${string & K}`]: T[K] } {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(group)) {
    out[`${name}.${key}`] = value;
  }
  return out as never;
}
