import { z } from "zod";
import { defineRoute } from "../http.js";

const zMessage = z.object({ message: z.string() }).passthrough();
const zAnyObject = z.object({}).passthrough();
const adminRoles = ["ADMIN", "OWNER"];

export const tokenPrizeContracts = {
  list: defineRoute({ method: "GET", path: "/token-prize", auth: "public", query: z.object({ lang: z.string().optional() }), response: zAnyObject }),
  getById: defineRoute({ method: "GET", path: "/token-prize/:id", auth: "public", params: z.object({ id: z.string() }), response: zAnyObject }),
  redeem: defineRoute({ method: "POST", path: "/token-prize/redeem", auth: "jwt", body: z.object({ prizeId: z.string() }).passthrough(), response: zAnyObject }),
  create: defineRoute({ method: "POST", path: "/token-prize", auth: "roles", roles: adminRoles, contentType: "multipart", response: zAnyObject }),
  update: defineRoute({ method: "PATCH", path: "/token-prize/:id", auth: "roles", roles: adminRoles, contentType: "multipart", params: z.object({ id: z.string() }), response: zAnyObject }),
  remove: defineRoute({ method: "DELETE", path: "/token-prize/:id", auth: "roles", roles: adminRoles, params: z.object({ id: z.string() }), response: zMessage }),
} as const;

export const leaderboardContracts = {
  current: defineRoute({ method: "GET", path: "/leaderboard", auth: "public", query: z.object({ limit: z.coerce.number().optional() }), response: zAnyObject }),
  myRank: defineRoute({ method: "GET", path: "/leaderboard/my-rank", auth: "jwt", response: zAnyObject }),
  period: defineRoute({ method: "GET", path: "/leaderboard/period/:periodId", auth: "roles", roles: adminRoles, params: z.object({ periodId: z.string() }), response: zAnyObject }),
  endPeriod: defineRoute({ method: "POST", path: "/leaderboard/end-period", auth: "roles", roles: adminRoles, body: zAnyObject, response: zAnyObject }),
  prizesByPeriod: defineRoute({ method: "GET", path: "/leaderboard/prizes/period/:periodId", auth: "roles", roles: adminRoles, params: z.object({ periodId: z.string() }), response: zAnyObject }),
  prizeById: defineRoute({ method: "GET", path: "/leaderboard/prizes/:prizeId", auth: "roles", roles: adminRoles, params: z.object({ prizeId: z.string() }), response: zAnyObject }),
  createPrize: defineRoute({ method: "POST", path: "/leaderboard/prizes", auth: "roles", roles: adminRoles, body: zAnyObject, response: zAnyObject }),
  updatePrize: defineRoute({ method: "PATCH", path: "/leaderboard/prizes/:prizeId", auth: "roles", roles: adminRoles, params: z.object({ prizeId: z.string() }), body: zAnyObject, response: zAnyObject }),
  deletePrize: defineRoute({ method: "DELETE", path: "/leaderboard/prizes/:prizeId", auth: "roles", roles: adminRoles, params: z.object({ prizeId: z.string() }), response: zMessage }),
} as const;
