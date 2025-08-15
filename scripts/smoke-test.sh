#!/usr/bin/env bash
set -euo pipefail

ADMIN_TOKEN=${ADMIN_TOKEN:-}
BASE_URL=${BASE_URL:-http://localhost:3010}

if [ -z "$ADMIN_TOKEN" ]; then
  echo "ADMIN_TOKEN is not set; exiting"
  exit 2
fi

echo "Checking home page"
curl -sSf "$BASE_URL/" | head -n 5

echo "Checking admin dbcheck"
curl -sS -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/api/admin/dbcheck" | jq .

echo "Checking unsub endpoint"
curl -sS -X POST "$BASE_URL/api/unsub" -H 'content-type: application/json' --data-binary '{"id":""}' | jq .

echo "Smoke tests passed"
