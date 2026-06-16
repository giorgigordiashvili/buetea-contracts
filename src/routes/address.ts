import { z } from "zod";
import { defineRoute } from "../http.js";
import { zAddress } from "../entities/address.js";

/** Create/update payload for the address book. */
export const zAddressInput = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  companyName: z.string().optional(),
  county: z.string().min(1),
  districtId: z.string().optional(),
  streetAddress: z.string().min(1),
  townCity: z.string().min(1),
  zipCode: z.string().optional(),
  phone: z.string().min(1),
  email: z.string().email(),
  additionalInfo: z.string().optional(),
  label: z.string().optional(),
  isDefault: z.boolean().optional(),
});

const zAddressResult = z.object({ message: z.string(), address: zAddress });

export const addressContracts = {
  list: defineRoute({
    method: "GET",
    path: "/addresses",
    auth: "jwt",
    response: z.object({ message: z.string(), addresses: z.array(zAddress) }),
  }),
  create: defineRoute({
    method: "POST",
    path: "/addresses",
    auth: "jwt",
    body: zAddressInput,
    response: zAddressResult,
  }),
  setDefault: defineRoute({
    method: "PATCH",
    path: "/addresses/:id/default",
    auth: "jwt",
    params: z.object({ id: z.string() }),
    response: zAddressResult,
  }),
  update: defineRoute({
    method: "PATCH",
    path: "/addresses/:id",
    auth: "jwt",
    params: z.object({ id: z.string() }),
    body: zAddressInput.partial(),
    response: zAddressResult,
  }),
  remove: defineRoute({
    method: "DELETE",
    path: "/addresses/:id",
    auth: "jwt",
    params: z.object({ id: z.string() }),
    response: z.object({ message: z.string() }),
  }),
} as const;
