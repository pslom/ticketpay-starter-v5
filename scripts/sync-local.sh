#!/usr/bin/env bash
set -euo pipefail
API="https://ticketpay.us.com" # or http://localhost:3010
TOKEN="${ADMIN_TOKEN:-change_me_now}"

curl -sS -X POST \
  -H "authorization: Bearer ${TOKEN}" \
  -H "content-type: application/json" \
  "${API}/api/admin/sync" \
  --data-binary @data/sf-sample.json | jq .
