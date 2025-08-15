/** Temporary TLS workaround: allow self-signed chains in serverless runtime */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = process.env.NODE_TLS_REJECT_UNAUTHORIZED || '0';
