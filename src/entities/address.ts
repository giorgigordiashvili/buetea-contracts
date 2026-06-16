import { z } from "zod";

/**
 * Billing/shipping address as sent to the API at checkout. The server DTO field
 * is `county` (the chosen Tbilisi district name); the web form calls it
 * `country` and maps it. This request shape is the canonical one.
 */
export const zBillingAddressInput = z.object({
  firstName: z.string().min(1).max(120),
  lastName: z.string().min(1).max(120),
  county: z.string().min(1).max(120),
  streetAddress: z.string().min(1).max(255),
  townCity: z.string().min(1).max(120),
  phone: z.string().min(1).max(40),
  email: z.string().email().max(255),
  additionalInfo: z.string().max(1000).optional(),
});
export type BillingAddressInput = z.infer<typeof zBillingAddressInput>;

/**
 * Billing address as returned by the API. Field naming is looser on the way out
 * (county/district/country may all appear); clients normalize. `.passthrough()`
 * keeps older clients resilient while contracts tighten.
 */
export const zBillingAddress = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    county: z.string().nullish(),
    district: z.string().nullish(),
    country: z.string().nullish(),
    districtId: z.string().nullish(),
    streetAddress: z.string(),
    townCity: z.string(),
    phone: z.string(),
    email: z.string(),
    additionalInfo: z.string().nullish(),
  })
  .passthrough();
export type BillingAddress = z.infer<typeof zBillingAddress>;

/** A saved address-book entry (the new /addresses resource). */
export const zAddress = z
  .object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    companyName: z.string().nullish(),
    county: z.string(),
    districtId: z.string().nullish(),
    streetAddress: z.string(),
    townCity: z.string(),
    zipCode: z.string().nullish(),
    phone: z.string(),
    email: z.string(),
    additionalInfo: z.string().nullish(),
    label: z.string().nullish(),
    isDefault: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .passthrough();
export type Address = z.infer<typeof zAddress>;
