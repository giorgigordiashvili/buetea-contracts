import { z } from "zod";

/** A v4-style UUID (matches the server's OptionalAuthGuard guest-session regex). */
export const zUuid = z.string().uuid();

/** Guest session id sent in the `x-guest-session` header. */
export const zGuestSession = z.string().uuid();

/** An ISO date-time string (Prisma `DateTime` serializes to ISO over JSON). */
export const zDateTime = z.string();
