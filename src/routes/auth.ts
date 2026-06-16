import { z } from "zod";
import { defineRoute } from "../http.js";
import { zAccount } from "../entities/account.js";

const zCredentials = z.object({
  accessToken: z.string().optional(),
  user: zAccount.optional(),
});

export const authContracts = {
  login: defineRoute({
    method: "POST",
    path: "/account/login",
    auth: "public",
    body: z.object({
      email: z.string().email(),
      password: z.string(),
      turnstileToken: z.string().optional(),
    }),
    response: zCredentials,
  }),

  register: defineRoute({
    method: "POST",
    path: "/account/register",
    auth: "public",
    body: z.object({
      email: z.string().email(),
      password: z.string(),
      confirmPassword: z.string(),
      turnstileToken: z.string().optional(),
    }),
    response: zCredentials,
  }),

  me: defineRoute({
    method: "GET",
    path: "/account/me",
    auth: "jwt",
    response: zAccount,
  }),
} as const;
