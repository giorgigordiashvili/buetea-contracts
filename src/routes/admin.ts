import { z } from "zod";
import { defineRoute } from "../http.js";

const adminRoles = ["ADMIN", "OWNER"];
const zAnyObject = z.object({}).passthrough();

/** Admin/owner login payload. */
const zAdminLogin = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(20),
});

/** Create-admin / create-owner payload. */
const zCreateAdmin = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
  username: z.string().min(3).optional(),
  displayName: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

const zAuthResult = z
  .object({
    message: z.string().optional(),
    user: zAnyObject,
    accessToken: z.string(),
  })
  .passthrough();

const zCreateResult = z
  .object({
    message: z.string().optional(),
    user: zAnyObject,
  })
  .passthrough();

/** Admin authentication + admin/owner/courier management. */
export const adminContracts = {
  login: defineRoute({
    method: "POST",
    path: "/admin/login",
    auth: "public",
    body: zAdminLogin,
    response: zAuthResult,
  }),
  ownerLogin: defineRoute({
    method: "POST",
    path: "/admin/owner/login",
    auth: "public",
    body: zAdminLogin,
    response: zAuthResult,
  }),
  createAdmin: defineRoute({
    method: "POST",
    path: "/admin/create",
    auth: "roles",
    roles: adminRoles,
    body: zCreateAdmin,
    response: zCreateResult,
  }),
  createOwner: defineRoute({
    method: "POST",
    path: "/admin/owner/create",
    auth: "roles",
    roles: ["OWNER"],
    body: zCreateAdmin,
    response: zCreateResult,
  }),
  createCourier: defineRoute({
    method: "POST",
    path: "/admin/courier/create",
    auth: "roles",
    roles: adminRoles,
    body: zCreateAdmin,
    response: zCreateResult,
  }),
  getCouriers: defineRoute({
    method: "GET",
    path: "/admin/couriers",
    auth: "roles",
    roles: adminRoles,
    response: z.array(zAnyObject),
  }),
  getCourierStats: defineRoute({
    method: "GET",
    path: "/admin/couriers/stats",
    auth: "roles",
    roles: adminRoles,
    query: z.object({
      month: z.string().optional(),
      year: z.string().optional(),
    }),
    response: zAnyObject,
  }),
} as const;
