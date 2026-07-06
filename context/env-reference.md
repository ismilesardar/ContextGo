# Environment Variable Reference

Copy `.env.example` to `.env` for local development. Never commit `.env`. Import all Environment form `url.config.ts` file. add if you add new Environment Variable first add inside `.env` file after add that Variable inside `url.config.ts` then use

## Application

| Variable | Example | Notes |
|----------|---------|-------|
| `NODE_ENV` | `development` | |
| `NEXT_PUBLIC_APP_NAME` | `"MyApp"` | Shown in UI |
| `NEXT_PUBLIC_BASE_URL` | `http://localhost:3000` | Used for absolute URLs |

## Better Auth

| Variable | Notes |
|----------|-------|
| `BETTER_AUTH_SECRET` | Long random string — generate with `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | Same as `NEXT_PUBLIC_BASE_URL` |

## Database (PostgreSQL via Prisma)

| Variable | Notes |
|----------|-------|
| `DATABASE_URL` | Connection pooler URL (e.g. PgBouncer/Supabase pooler) |
| `DIRECT_URL` | Direct PostgreSQL connection — used by Prisma migrations |

## Error Tracking (Sentry)

| Variable | Notes |
|----------|-------|
| `NEXT_PUBLIC_SENTRY_DSN` | From Sentry project settings |
| `NEXT_PUBLIC_SENTRY_ORG` | Sentry org slug |
| `NEXT_PUBLIC_SENTRY_PROJECT` | Sentry project slug |
| `SENTRY_AUTH_TOKEN` | For source map uploads |
| `NEXT_PUBLIC_SENTRY_DISABLED` | Set `"true"` to disable Sentry in local dev |

## Email (Nodemailer SMTP)

| Variable | Example |
|----------|---------|
| `NODEMAILER_MAIL_HOST` | `smtp.gmail.com` |
| `NODEMAILER_MAIL_PORT` | `587` |
| `NODEMAILER_MAIL_SMTP_EMAIL` | `your@email.com` |
| `NODEMAILER_MAIL_PASSWORD` | App password (not account password) |

## OAuth Providers

| Variable | Notes |
|----------|-------|
| `GOOGLE_CLIENT_ID` | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | |
| `GITHUB_CLIENT_ID` | From GitHub OAuth App settings |
| `GITHUB_CLIENT_SECRET` | |

## Billing (Stripe)

| Variable | Notes |
|----------|-------|
| `CREEM_API_KEY` | `creem_test_...` / `creem_live_...` |
| `CREEM_WEBHOOK_SECRET` | `whsec_...` — from Creem Dashboard webhook settings |


## File Storage (Backblaze B2 — S3-compatible)

| Variable | Example |
|----------|---------|
| `S3_ENDPOINT` | `https://s3.<region>.backblazeb2.com` |
| `S3_REGION` | e.g. `us-west-004` |
| `S3_ACCESS_KEY_ID` | Backblaze application key ID |
| `S3_SECRET_ACCESS_KEY` | Backblaze application key |
| `S3_BUCKET` | Bucket name |

## Rate Limiting (Arcjet)

| Variable | Notes |
|----------|-------|
| `ARCJET_KEY` | From Arcjet dashboard |

## Library sync (github/awesome-copilot)

| Variable | Notes |
|----------|-------|
| `GITHUB_SYNC_TOKEN` | Optional. A GitHub personal access token (no scopes needed, repo is public) sent as `Authorization: Bearer` when listing the awesome-copilot tree. Without it, syncs share GitHub's unauthenticated rate limit (60 requests/hr per IP, shared across all local dev machines on the same network) — with it, the limit is 5,000/hr. |

## Notes

- `NEXT_PUBLIC_*` variables are inlined at build time — changing them after build has no effect on deployed output
- `DATABASE_URL` vs `DIRECT_URL`: use the direct URL for migrations, the pooler URL for runtime queries
- Webhook secrets must match what's configured in the provider's dashboard (Stripe, etc.)
