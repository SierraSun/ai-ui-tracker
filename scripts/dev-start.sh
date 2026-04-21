#!/usr/bin/env bash

set -euo pipefail

HOST="127.0.0.1"
START_PORT=3000
END_PORT=3010
PORT="$START_PORT"

for p in $(seq "$START_PORT" "$END_PORT"); do
  if ! lsof -ti "tcp:$p" >/dev/null 2>&1; then
    PORT="$p"
    break
  fi
done

echo ""
echo "========================================"
echo "AI UI Tracker dev server"
echo "Open: http://${HOST}:${PORT}"
echo "========================================"
echo ""

WATCHPACK_POLLING=true next dev -H "$HOST" -p "$PORT"
