import { z } from "zod";
import type { RouteContract, ResponseOf } from "../http.js";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Thrown when a response does not match its contract — names the route + Zod issue path. */
export class ContractDriftError extends Error {
  constructor(
    public method: string,
    public path: string,
    public issues: z.ZodError,
  ) {
    super(
      `Contract drift on ${method} ${path}: ${issues.issues
        .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
        .join("; ")}`,
    );
    this.name = "ContractDriftError";
  }
}

export interface ContractClientOptions {
  baseUrl: string;
  /** Returns the current auth token (or null). May be async. */
  getToken?: () => string | null | Promise<string | null>;
  /** Returns the guest session id (UUID) for optional-auth routes when no token. */
  getGuestSession?: () => string | null | undefined;
  /** Called on a 401 so each app can run its own logout/redirect. */
  onUnauthorized?: () => void;
  /** Extra headers to merge into every request. */
  defaultHeaders?: Record<string, string>;
  /**
   * How to handle a response that doesn't match its contract:
   * - `throw` (default): raise a `ContractDriftError`.
   * - `warn`: log via `onDrift` (or console.warn) and return the raw response —
   *   the safe choice while incrementally adopting contracts against a live API.
   * - `off`: skip response validation entirely.
   */
  validateResponses?: "throw" | "warn" | "off";
  /** Called (instead of throwing) when `validateResponses` is `warn`. */
  onDrift?: (error: ContractDriftError) => void;
}

export interface CallInput {
  params?: Record<string, string | number>;
  query?: Record<string, unknown>;
  body?: unknown;
  /** Per-call header overrides. */
  headers?: Record<string, string>;
}

function buildUrl(
  baseUrl: string,
  path: string,
  params?: Record<string, string | number>,
  query?: Record<string, unknown>,
): string {
  let p = path;
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      p = p.replace(`:${key}`, encodeURIComponent(String(value)));
    }
  }
  const base = baseUrl.replace(/\/$/, "");
  const normalized = p.startsWith("/") ? p : `/${p}`;
  const qs = new URLSearchParams();
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null) continue;
      qs.append(key, String(value));
    }
  }
  const suffix = qs.toString();
  return `${base}${normalized}${suffix ? `?${suffix}` : ""}`;
}

async function parseError(res: Response): Promise<ApiError> {
  const contentType = res.headers.get("content-type") ?? "";
  let message = `Request failed: ${res.status} ${res.statusText}`;
  let body: unknown;
  try {
    if (contentType.includes("application/json")) {
      body = await res.json();
      const b = body as { message?: unknown; error?: unknown };
      message =
        (typeof b.message === "string" && b.message) ||
        (typeof b.error === "string" && b.error) ||
        message;
    } else {
      message = (await res.text()) || message;
    }
  } catch {
    /* ignore parse failures */
  }
  return new ApiError(message, res.status, body);
}

/**
 * Build a typed API client bound to a base URL + auth sources. Returns a `call`
 * function that, given a route contract and input, fetches and validates the
 * response against the contract's Zod schema.
 */
export function createContractClient(opts: ContractClientOptions) {
  return async function call<R extends RouteContract>(
    route: R,
    input: CallInput = {},
  ): Promise<ResponseOf<R>> {
    const url = buildUrl(opts.baseUrl, route.path, input.params, input.query);

    const headers: Record<string, string> = { ...opts.defaultHeaders };
    if (route.contentType !== "multipart" && input.body !== undefined) {
      headers["Content-Type"] = "application/json";
    }

    if (route.auth === "jwt" || route.auth === "roles") {
      const token = await opts.getToken?.();
      if (!token) throw new ApiError("Authentication required", 401);
      headers["Authorization"] = `Bearer ${token}`;
    } else if (route.auth === "optional") {
      const token = await opts.getToken?.();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      } else {
        const guest = opts.getGuestSession?.();
        if (guest) headers["x-guest-session"] = guest;
      }
    }

    Object.assign(headers, input.headers);

    const res = await fetch(url, {
      method: route.method,
      headers,
      body:
        route.contentType === "multipart"
          ? (input.body as BodyInit)
          : input.body !== undefined
            ? JSON.stringify(input.body)
            : undefined,
    });

    if (res.status === 401) {
      opts.onUnauthorized?.();
      throw new ApiError("Unauthorized", 401);
    }
    if (!res.ok) throw await parseError(res);

    const json = await safeJson(res);

    if (route.rawResponse || opts.validateResponses === "off") {
      return json as ResponseOf<R>;
    }

    const result = route.response.safeParse(json);
    if (!result.success) {
      const drift = new ContractDriftError(route.method, route.path, result.error);
      if (opts.validateResponses === "warn") {
        if (opts.onDrift) opts.onDrift(drift);
        else if (typeof console !== "undefined") console.warn(drift.message);
        return json as ResponseOf<R>; // never break the app over a schema mismatch
      }
      throw drift;
    }
    return result.data as ResponseOf<R>;
  };
}

async function safeJson(res: Response): Promise<unknown> {
  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) return res.json();
  const text = await res.text();
  return text.length ? text : undefined;
}

export type ContractClient = ReturnType<typeof createContractClient>;
