#!/usr/bin/env bash
set -euo pipefail
API=${API:-https://www.ticketpay.us.com}
echo "whoami:"; curl -sS "$API/api/whoami" | jq -r '.ok'
echo "lookup:"; curl -sS -X POST "$API/api/core" -H 'content-type: application/json' -d '{"op":"lookup_ticket","plate":"7abc123","state":"ca"}' | jq '.items|length'
echo "subscribe sms:"; curl -sS -X POST "$API/api/core" -H 'content-type: application/json' -d '{"op":"subscribe","plate":"7abc123","state":"ca","channel":"sms","value":"+15555551234"}' | jq -r '.ok'
echo "cron:"; curl -sS "$API/api/cron?t=$(date +%s)" -H "Authorization: Bearer $CRON_SECRET" | jq -r '.ok'
