#!/usr/bin/env bash
set -euo pipefail
BASE=${1:-http://localhost:3010}
TOKEN=${ADMIN_TOKEN:-}
if [ -z "$TOKEN" ]; then TOKEN=$(grep '^ADMIN_TOKEN=' .env.local | cut -d= -f2- || true); fi

curl -sS "$BASE/api/whoami" | jq .

jq -n '{items:[{plate:"7abc123",state:"ca",citation_number:"SF-12345",amount_cents:6500,issued_at:"2025-08-10T12:00:00Z",location:"Mission & 16th",violation:"No Parking",city:"SF"}]}' > /tmp/sync.json

curl -sS -X POST -H "authorization: Bearer $TOKEN" -H "content-type: application/json" \
  "$BASE/api/admin/sync" --data-binary @/tmp/sync.json | jq .

curl -sS -X POST "$BASE/api/core" -H 'content-type: application/json' \
  -d '{"op":"lookup_ticket","plate":"7abc123","state":"ca"}' | jq .
