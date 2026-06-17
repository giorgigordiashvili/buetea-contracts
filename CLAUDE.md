# buetea-contracts — shared API contract package

`buetea-contracts` is the **single source of truth** for every HTTP route in the
Buetea platform. The backend validates responses against it; the web, mobile, and
courier apps consume the same typed client. If a route's shape changes, it changes
here first.

- **Published to public npm as `buetea-contracts`** (unscoped — there is no `@buetea`
  npm org). GitHub repo: `giorgigordiashvili/buetea-contracts`.
- **Current version: 0.7.0** — **174 routes, 100% coverage of all 30 server controllers.**
- Built with **tsup** (ESM + CJS + `.d.ts`). `zod` is a **peerDependency (^4)** — the
  consuming app provides zod.

## Layout

- `src/http.ts` — `defineRoute({ method, path, params?, query?, body?, response, auth, roles?, rawResponse?, contentType? })` and the `ResponseOf` / `BodyOf` / `QueryOf` / `ParamsOf` type helpers.
- `src/primitives/` — `zLocalized` (en/ka/ru map), `zUuid`, `zGuestSession`, `zDateTime`, decimal (`= z.number()`), pagination.
- `src/entities/` — shared entity schemas (account, address, coupon, product, cart, order).
- `src/routes/` — one file per domain. Each exports a `xContracts` object of named operations.
- `src/routes/index.ts` — re-exports every group **and** builds the flat `contracts` registry via `prefix("name", group)` (keys like `cart.addToCart`). **Every new group must be added in all three places: the import, the re-export, and the `contracts` registry spread.**
- `src/client/createContractClient.ts` — the typed client used by all front-ends.
- `src/index.ts` — barrel.

## AuthMode (mirrors the server guards)

`public` (no auth) · `jwt` (`@Auth()`) · `roles` (`@Auth()` + `@Roles(...)`, set `roles: [...]`) · `optional` (`@OptionalAuth()` — JWT **or** `x-guest-session` header).

## The client

```ts
createContractClient({ baseUrl, getToken, getGuestSession, onUnauthorized, validateResponses })
```

`validateResponses`: `'throw'` | `'warn'` | `'off'`. **Front-ends use `'warn'`** — response
drift logs a `ContractDriftError` but never crashes the UI.

## Conventions

- Loose responses use `z.object({}).passthrough()` (alias `zAnyObject` in several files).
  These are intentionally permissive and should be tightened from real payloads over time.
- `rawResponse: true` skips response validation entirely (e.g. the BOG webhook that always
  returns 200, or file/blob/PDF endpoints).
- `contentType: 'multipart'` documents file-upload bodies; the server Zod pipe does **not**
  parse them.

## Releasing (publish-on-tag)

1. Edit/add route files; wire them into `src/routes/index.ts`.
2. `npm run typecheck && npm run build`.
3. `npm version <x.y.z> --no-git-tag-version`, commit, `git tag vX.Y.Z`.
4. `git push origin main && git push origin vX.Y.Z` — the **publish-on-tag CI** (repo
   secret `NPM_TOKEN`, a granular 2FA-bypass token) publishes to npm.
5. Bump the dependency in each consumer (`buetea-server` + the three apps) when you want
   them to see the new routes.

> npm now requires OTP or a granular 2FA-bypass token to publish; a classic publish token
> alone will fail with EOTP/E403. The CI token is the granular one.

## ⚠️ Web-client lockfile gotcha

When bumping this dep in **`buetea-client`** (the Next.js web app), update its lockfile
with **npm 10**, not npm 11:

```
npx npm@10 install buetea-contracts@^X.Y.Z --package-lock-only
```

npm 11 drops `@swc/helpers` entries that the web CI's `npm ci` (npm 10) expects, breaking
the build. This only affects the web client.

## See also

Each consumer repo's `CLAUDE.md` has a matching "Contract system" section describing how it
wires in (`buetea-server` = `@Contract` interceptor; the apps = `createContractClient`).
