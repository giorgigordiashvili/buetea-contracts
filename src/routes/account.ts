import { z } from "zod";
import { defineRoute } from "../http.js";

const zAnyObject = z.object({}).passthrough();
const adminRoles = ["ADMIN", "OWNER"];

/** Admin/account-management routes (login/register/me live in authContracts). */
export const accountContracts = {
  editAccount: defineRoute({
    method: "PUT",
    path: "/account/edit-account",
    auth: "jwt",
    body: zAnyObject,
    response: zAnyObject,
  }),
  getEditAccount: defineRoute({
    method: "GET",
    path: "/account/edit-account",
    auth: "jwt",
    response: zAnyObject,
  }),
  getById: defineRoute({
    method: "GET",
    path: "/account/:id",
    auth: "roles",
    roles: adminRoles,
    params: z.object({ id: z.string() }),
    response: zAnyObject,
  }),
  list: defineRoute({
    method: "GET",
    path: "/account",
    auth: "roles",
    roles: adminRoles,
    response: z.object({}).passthrough(),
  }),
  remove: defineRoute({
    method: "DELETE",
    path: "/account/:id",
    auth: "roles",
    roles: ["OWNER", "ADMIN"],
    params: z.object({ id: z.string() }),
    response: z.object({ message: z.string() }).passthrough(),
  }),
} as const;
