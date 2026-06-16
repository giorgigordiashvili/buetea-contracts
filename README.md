# buetea-contracts

Shared **Zod** request/response contracts for the Buetea API — the single source of
truth for types across the NestJS server and the web/mobile/courier TypeScript clients.

Published to npm as [`buetea-contracts`](https://www.npmjs.com/package/buetea-contracts).

## What's in here

- **`http.ts`** — the `RouteContract` shape and `defineRoute()` helper. A route contract is
  `{ method, path, params?, query?, body?, response, auth }` where every slot is a Zod schema.
- **`primitives/`** — shared building blocks (localized text, ids/UUID, decimal→number, pagination).
- **`entities/`** — reusable domain schemas (account, address, coupon, product, cart, order, …).
- **`routes/`** — one file per controller; `routes/index.ts` exposes a flat `contracts` registry.
- **`client/createContractClient`** — a framework-agnostic typed fetch client that attaches
  auth (`Bearer` or `x-guest-session`) and **validates every response** against its contract,
  throwing `ContractDriftError` on mismatch.

## Usage

```ts
import { createContractClient, cartContracts } from "buetea-contracts";

const call = createContractClient({
  baseUrl: "https://api.drinkbuetea.ge",
  getToken: () => localStorage.getItem("accessToken"),
  getGuestSession: () => getGuestSessionId(),
  onUnauthorized: () => redirectToLogin(),
});

const cart = await call(cartContracts.getCart, { query: { lang: "en" } });
// `cart` is fully typed AND runtime-validated.
```

`zod` is a **peer dependency** (`^4`) — the consumer provides it.

## Develop

```
npm install
npm run typecheck
npm run build        # tsup → dist/ (ESM + CJS + .d.ts)
```

## Release

Bump `version` in `package.json`, then push a `vX.Y.Z` tag — the
**Publish** workflow builds and `npm publish`es (needs the `NPM_TOKEN` repo secret).
