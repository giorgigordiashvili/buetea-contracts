import type { z } from "zod";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * How a route authenticates — mirrors the server guards:
 * - `public`   : no auth
 * - `jwt`      : `@Auth()` (a logged-in user required)
 * - `roles`    : `@Auth()` + `@Roles(...)` (specific roles)
 * - `optional` : `@OptionalAuth()` (user token OR `x-guest-session` header)
 */
export type AuthMode = "public" | "jwt" | "roles" | "optional";

export interface RouteContract<
  Params extends z.ZodTypeAny = z.ZodTypeAny,
  Query extends z.ZodTypeAny = z.ZodTypeAny,
  Body extends z.ZodTypeAny = z.ZodTypeAny,
  Res extends z.ZodTypeAny = z.ZodTypeAny,
> {
  method: HttpMethod;
  /** Express-style path with `:param` placeholders, e.g. `/payments/:orderId/status`. */
  path: string;
  params?: Params;
  query?: Query;
  body?: Body;
  /** Always present — the contract's reason to exist. */
  response: Res;
  auth: AuthMode;
  roles?: string[];
  /** Skip response validation entirely (e.g. the BOG webhook that always returns 200). */
  rawResponse?: boolean;
  /** `multipart` bodies are described for docs only and are NOT parsed by the server Zod pipe. */
  contentType?: "json" | "multipart";
}

/** Identity helper that preserves the precise generic types of each schema slot. */
export function defineRoute<
  Params extends z.ZodTypeAny,
  Query extends z.ZodTypeAny,
  Body extends z.ZodTypeAny,
  Res extends z.ZodTypeAny,
>(route: RouteContract<Params, Query, Body, Res>): RouteContract<Params, Query, Body, Res> {
  return route;
}

/** Infer the validated response type of a route. */
export type ResponseOf<R extends RouteContract> =
  R["response"] extends z.ZodTypeAny ? z.infer<R["response"]> : never;

/** Infer the request body type of a route (or `never` when it has none). */
export type BodyOf<R extends RouteContract> =
  R["body"] extends z.ZodTypeAny ? z.infer<R["body"]> : never;

/** Infer the query type of a route. */
export type QueryOf<R extends RouteContract> =
  R["query"] extends z.ZodTypeAny ? z.infer<R["query"]> : never;

/** Infer the path-params type of a route. */
export type ParamsOf<R extends RouteContract> =
  R["params"] extends z.ZodTypeAny ? z.infer<R["params"]> : never;
