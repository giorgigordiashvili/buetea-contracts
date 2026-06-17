import { z } from "zod";
import { defineRoute } from "../http.js";
import { zLocalized } from "../primitives/localized.js";

const adminRoles = ["ADMIN", "OWNER"];
const zAnyObject = z.object({}).passthrough();
const zLangQuery = z.object({ lang: z.string().optional() });

const zDeleteAllResult = z
  .object({ message: z.string(), deletedCount: z.number() })
  .passthrough();

/** Product lifestyle tags (admin CRUD + public list). */
export const lifestyleContracts = {
  list: defineRoute({
    method: "GET",
    path: "/filtration/lifestyle",
    auth: "public",
    query: zLangQuery,
    response: z
      .object({ message: z.string().optional(), lifestyles: z.array(zAnyObject) })
      .passthrough(),
  }),
  create: defineRoute({
    method: "POST",
    path: "/filtration/lifestyle",
    auth: "roles",
    roles: adminRoles,
    body: z.object({ name: z.string().min(1), nameLocalized: zLocalized.optional() }),
    response: z
      .object({ message: z.string().optional(), lifestyle: zAnyObject })
      .passthrough(),
  }),
  update: defineRoute({
    method: "PATCH",
    path: "/filtration/lifestyle/:id",
    auth: "roles",
    roles: adminRoles,
    params: z.object({ id: z.string() }),
    body: z.object({
      name: z.string().min(1).optional(),
      nameLocalized: zLocalized.optional(),
    }),
    response: z
      .object({ message: z.string().optional(), lifestyle: zAnyObject })
      .passthrough(),
  }),
  remove: defineRoute({
    method: "DELETE",
    path: "/filtration/lifestyle/:id",
    auth: "roles",
    roles: adminRoles,
    params: z.object({ id: z.string() }),
    response: z
      .object({ message: z.string().optional(), lifestyle: zAnyObject })
      .passthrough(),
  }),
  removeAll: defineRoute({
    method: "DELETE",
    path: "/filtration/lifestyle",
    auth: "roles",
    roles: adminRoles,
    response: zDeleteAllResult,
  }),
} as const;

/** Product types (admin CRUD + public list). */
export const productTypeContracts = {
  list: defineRoute({
    method: "GET",
    path: "/filtration/type",
    auth: "public",
    query: zLangQuery,
    response: z
      .object({ message: z.string().optional(), types: z.array(zAnyObject) })
      .passthrough(),
  }),
  create: defineRoute({
    method: "POST",
    path: "/filtration/type",
    auth: "roles",
    roles: adminRoles,
    body: z.object({ name: z.string().min(1), nameLocalized: zLocalized.optional() }),
    response: z
      .object({ message: z.string().optional(), type: zAnyObject })
      .passthrough(),
  }),
  update: defineRoute({
    method: "PATCH",
    path: "/filtration/type/:id",
    auth: "roles",
    roles: adminRoles,
    params: z.object({ id: z.string() }),
    body: z.object({
      name: z.string().min(1).optional(),
      nameLocalized: zLocalized.optional(),
    }),
    response: z
      .object({ message: z.string().optional(), type: zAnyObject })
      .passthrough(),
  }),
  remove: defineRoute({
    method: "DELETE",
    path: "/filtration/type/:id",
    auth: "roles",
    roles: adminRoles,
    params: z.object({ id: z.string() }),
    response: z
      .object({ message: z.string().optional(), type: zAnyObject })
      .passthrough(),
  }),
  removeAll: defineRoute({
    method: "DELETE",
    path: "/filtration/type",
    auth: "roles",
    roles: adminRoles,
    response: zDeleteAllResult,
  }),
} as const;

/** Product categories / flavours (admin CRUD + public list). */
export const productCategoryContracts = {
  list: defineRoute({
    method: "GET",
    path: "/filtration/category",
    auth: "public",
    query: zLangQuery,
    response: z
      .object({ message: z.string().optional(), categories: z.array(zAnyObject) })
      .passthrough(),
  }),
  create: defineRoute({
    method: "POST",
    path: "/filtration/category",
    auth: "roles",
    roles: adminRoles,
    body: z.object({
      name: z.string().min(1),
      flavour: z.string().min(1),
      nameLocalized: zLocalized.optional(),
      flavourLocalized: zLocalized.optional(),
    }),
    response: z
      .object({ message: z.string().optional(), category: zAnyObject })
      .passthrough(),
  }),
  update: defineRoute({
    method: "PATCH",
    path: "/filtration/category/:id",
    auth: "roles",
    roles: adminRoles,
    params: z.object({ id: z.string() }),
    body: z.object({
      name: z.string().min(1).optional(),
      flavour: z.string().min(1).optional(),
      nameLocalized: zLocalized.optional(),
      flavourLocalized: zLocalized.optional(),
    }),
    response: z
      .object({ message: z.string().optional(), category: zAnyObject })
      .passthrough(),
  }),
  remove: defineRoute({
    method: "DELETE",
    path: "/filtration/category/:id",
    auth: "roles",
    roles: adminRoles,
    params: z.object({ id: z.string() }),
    response: z
      .object({ message: z.string().optional(), category: zAnyObject })
      .passthrough(),
  }),
  removeAll: defineRoute({
    method: "DELETE",
    path: "/filtration/category",
    auth: "roles",
    roles: adminRoles,
    response: zDeleteAllResult,
  }),
} as const;
