# Release checklist

A pragmatic, stability-first checklist to ship new changes safely.

## 0) Pre-flight
- [ ] Ensure `main` is green and your branch is rebased.
- [ ] Review diff for secrets, `.env*` files, and noisy logs.
- [ ] Confirm required env vars in Vercel: `DATABASE_URL`, `ADMIN_TOKEN`, `CRON_SECRET`, `SUPABASE_CA_PEM` or `SUPABASE_CA_PEM_FILE`.

## 1) Local verification
- [ ] Start dev: `npm run dev`
- [ ] Quick typecheck: `npm run typecheck`
- [ ] DB TLS: `npm run pg:smoke` and hit `/api/admin/dbcheck?token=$ADMIN_TOKEN`
- [ ] Health: GET `/api/health` returns `{ ok: true }`
- [ ] Manage page: search + list + unsubscribe behave without validation errors

## 2) Smoke tests (local)
- [ ] `ADMIN_TOKEN=... BASE_URL=http://localhost:3010 npm run smoke:local`
  - Requires `npm run build && npm run start` in another terminal or using Vercel dev if appropriate.

## 3) Deploy
- [ ] Push branch and create PR, wait for CI.
- [ ] Deploy to preview; verify `/api/health` and `/api/admin/dbcheck?token=...`.
- [ ] Verify `/api/cron` with header `Authorization: Bearer $CRON_SECRET`.

## 4) Post-deploy
- [ ] Run `API=https://your-domain npm run smoke:remote`
- [ ] Check logs for rate-limit and DB errors.
- [ ] Announce ready state with version/commit.

## Notes
- TLS modes: `ALLOW_SELF_SIGNED_TLS=1` for local only; use CA pinning in prod.
- Do not commit `.env*`. Rotate tokens when in doubt.
