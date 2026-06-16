import { z } from "zod";

/** Authenticated user identity, as returned by `GET /account/me`. */
export const zAccount = z.object({
  id: z.string(),
  email: z.string(),
  role: z.string().optional(),
});

export type Account = z.infer<typeof zAccount>;
