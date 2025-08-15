// TLS behavior is controlled by `src/lib/pg.ts` using SUPABASE_CA_PEM or ALLOW_SELF_SIGNED_TLS.
// Removing global override to avoid accidentally disabling TLS validation across the app.
