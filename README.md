# identity-service

Bounded context: Users, Partners, PartnerMembers, Auth (JWT), Admin approval.

## Endpoints

- `POST /v1/auth/register` — User registration
- `POST /v1/auth/login` — Login
- `POST /v1/auth/refresh` — Refresh tokens
- `GET /v1/auth/me` — Current user
- `POST /v1/partners/request` — Request partner account
- `GET /v1/partners/me` — Current partner
- `GET /v1/partners/:id` — Internal: get partner by ID
- `POST /v1/admin/partners/:id/approve` — Admin approve partner
- `GET /health` — Health check

## ADR

See [docs/ADR](./docs/ADR)
