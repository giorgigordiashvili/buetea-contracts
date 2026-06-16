import { z } from "zod";
import { defineRoute } from "../http.js";

const zMessage = z.object({ message: z.string() }).passthrough();
const zAnyObject = z.object({}).passthrough();
const zAdminBody = z.object({}).passthrough();
const adminRoles = ["ADMIN", "OWNER"];

export const blogContracts = {
  create: defineRoute({
    method: "POST", path: "/blog", auth: "roles", roles: adminRoles,
    contentType: "multipart", response: zAnyObject,
  }),
  list: defineRoute({
    method: "GET", path: "/blog", auth: "public",
    query: z.object({ lang: z.string().optional(), page: z.coerce.number().optional(), limit: z.coerce.number().optional() }),
    response: zAnyObject,
  }),
  getById: defineRoute({
    method: "GET", path: "/blog/:id", auth: "public",
    params: z.object({ id: z.string() }), query: z.object({ lang: z.string().optional() }),
    response: zAnyObject,
  }),
  update: defineRoute({
    method: "PATCH", path: "/blog/:id", auth: "roles", roles: adminRoles,
    contentType: "multipart", params: z.object({ id: z.string() }), response: zAnyObject,
  }),
  remove: defineRoute({
    method: "DELETE", path: "/blog/:id", auth: "roles", roles: adminRoles,
    params: z.object({ id: z.string() }), response: zMessage,
  }),
  recent: defineRoute({
    method: "GET", path: "/blog/admin/recent", auth: "roles", roles: adminRoles, response: zAnyObject,
  }),
  like: defineRoute({
    method: "POST", path: "/blog/:id/like", auth: "jwt",
    params: z.object({ id: z.string() }), response: zMessage,
  }),
  liked: defineRoute({
    method: "GET", path: "/blog/:id/liked", auth: "jwt",
    params: z.object({ id: z.string() }), response: zAnyObject,
  }),
} as const;

export const blogCategoryContracts = {
  create: defineRoute({ method: "POST", path: "/blog-category", auth: "roles", roles: adminRoles, body: zAdminBody, response: zAnyObject }),
  list: defineRoute({ method: "GET", path: "/blog-category", auth: "public", query: z.object({ lang: z.string().optional() }), response: zAnyObject }),
  getById: defineRoute({ method: "GET", path: "/blog-category/:id", auth: "public", params: z.object({ id: z.string() }), response: zAnyObject }),
  update: defineRoute({ method: "PATCH", path: "/blog-category/:id", auth: "roles", roles: adminRoles, params: z.object({ id: z.string() }), body: zAdminBody, response: zAnyObject }),
  remove: defineRoute({ method: "DELETE", path: "/blog-category/:id", auth: "roles", roles: adminRoles, params: z.object({ id: z.string() }), response: zMessage }),
} as const;

export const blogTagContracts = {
  create: defineRoute({ method: "POST", path: "/blog-tag", auth: "roles", roles: adminRoles, body: zAdminBody, response: zAnyObject }),
  list: defineRoute({ method: "GET", path: "/blog-tag", auth: "public", query: z.object({ lang: z.string().optional() }), response: zAnyObject }),
  getById: defineRoute({ method: "GET", path: "/blog-tag/:id", auth: "public", params: z.object({ id: z.string() }), response: zAnyObject }),
  update: defineRoute({ method: "PATCH", path: "/blog-tag/:id", auth: "roles", roles: adminRoles, params: z.object({ id: z.string() }), body: zAdminBody, response: zAnyObject }),
  remove: defineRoute({ method: "DELETE", path: "/blog-tag/:id", auth: "roles", roles: adminRoles, params: z.object({ id: z.string() }), response: zMessage }),
} as const;

export const blogCommentContracts = {
  create: defineRoute({
    method: "POST", path: "/blog-comment/:blogId", auth: "jwt",
    params: z.object({ blogId: z.string() }),
    body: z.object({ comment: z.string() }).passthrough(),
    response: zAnyObject,
  }),
  list: defineRoute({
    method: "GET", path: "/blog-comment/:blogId", auth: "public",
    params: z.object({ blogId: z.string() }), response: zAnyObject,
  }),
  update: defineRoute({
    method: "PATCH", path: "/blog-comment/:id", auth: "jwt",
    params: z.object({ id: z.string() }), body: z.object({ comment: z.string() }).passthrough(), response: zAnyObject,
  }),
  remove: defineRoute({
    method: "DELETE", path: "/blog-comment/:id", auth: "jwt",
    params: z.object({ id: z.string() }), response: zMessage,
  }),
} as const;
