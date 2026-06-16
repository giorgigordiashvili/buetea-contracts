import { authContracts } from "./auth.js";
import { cartContracts } from "./cart.js";
import { checkoutContracts } from "./checkout.js";

export { authContracts } from "./auth.js";
export { cartContracts } from "./cart.js";
export { checkoutContracts, zCheckoutBody } from "./checkout.js";
export type { CheckoutBody } from "./checkout.js";

/**
 * Flat registry of every route contract, keyed by `module.operation`. Used by
 * the server's contract e2e suite and any tooling that needs to iterate all routes.
 */
export const contracts = {
  ...prefix("auth", authContracts),
  ...prefix("cart", cartContracts),
  ...prefix("checkout", checkoutContracts),
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
