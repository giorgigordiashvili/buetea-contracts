import { z } from "zod";
import { defineRoute } from "../http.js";
import { zBillingAddress, zBillingAddressInput } from "../entities/address.js";

export const billingAddressContracts = {
  get: defineRoute({
    method: "GET",
    path: "/billing-address",
    auth: "jwt",
    response: z
      .object({ message: z.string().optional(), billingAddress: zBillingAddress.nullable() })
      .passthrough(),
  }),
  save: defineRoute({
    method: "POST",
    path: "/billing-address",
    auth: "jwt",
    // Server maps `country`/`district` to `county`; accept the looser shape.
    body: zBillingAddressInput.partial().passthrough(),
    response: z.object({}).passthrough(),
  }),
} as const;
