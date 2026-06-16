import { z } from "zod";

/**
 * Monetary / numeric value. Prisma stores these as Decimal, but every server
 * response already converts them with `Number(...)` before sending, so over the
 * wire they are plain JSON numbers. The client-facing schema is therefore just a
 * number. (A server-only variant that also accepts a Prisma.Decimal lives in
 * the server adapter, never imported by clients.)
 */
export const zDecimal = z.number();
