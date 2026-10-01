# Authentication (Phase 1)

## Model

- Two portals, two apps, two sessions: `apps/customer` (customers) and `apps/admin` (staff, admin, super_admin). A session in one is never visible to the other.
- Roles come from the server/database, never from client input. Sign-up requests have no role field; the only sign-up path creates a `customer`.
- There is no admin sign-up. Admin accounts are provisioned through a controlled process (super admin invite / provisioning script; to be built with Supabase in the RLS phase).
- Failed sign-ins return one message ("Invalid email or password.") for unknown email, wrong password and wrong portal, so responses never reveal whether an account exists or what role it has.

## Where access is enforced

| Layer | Status |
| --- | --- |
| Routing (UX redirects) | Done: `decideAccess` in `@cakeshop/auth`, used by the `(account)` layout (customer) and `dashboard` layout (admin) |
| API | Started: `requireAuth` + `requireRoles`; everything under `/admin` requires staff/admin/super_admin (`apps/api/src/middleware/auth.ts`) |
| Database (RLS) | Not yet (Phase 3) |
| Per-action permissions (RBAC) | Not yet (Phase 2) |

Routing checks can be bypassed by a client; they exist for UX. The API check is the one that counts, and RLS will be the last line of defense.

## URLs

- Customer: `/login`, `/signup`, `/shop`, `/cart`, `/checkout`, `/cake-builder`, `/ai-designer`; signed-in only: `/orders`, `/profile`.
- Admin: `/admin/login`, `/admin/dashboard/*` in production (`experiments.baseUrl` in `apps/admin/app.config.js`).
  Expo Router ignores `baseUrl` in development, so locally the admin app is at `http://localhost:8082/login` and `/dashboard`.
- Redirects: unauthenticated `/admin` → login; customer on the dashboard → login with "Access denied"; successful admin login → dashboard.

## Prototype limitations

- `MockAuthService` is in-memory with demo accounts (`customer@`, `staff@`, `admin@`, `super@kreative.test`, password `Prototype#12345`). Sessions are lost on reload. It throws unless `__DEV__`, so production builds fail closed instead of shipping mock auth.
- The API mock verifier (`AUTH_MODE=mock`) is rejected by the env schema when `NODE_ENV=production`.
- MFA is prepared (`mfaVerified`, `AUTH_POLICY.adminRequiresMfa`, `mfa_required` result) but not implemented; the flag is off.
- No rate limiting or lockout on login yet (API hardening phase).

## Tests

`pnpm test` runs unit tests (access decisions, mock service, validation, API 401/403). `pnpm e2e:auth` builds both apps and drives real Edge/Chrome through 10 scenarios, including a customer with forged storage and cookies trying the admin dashboard.
