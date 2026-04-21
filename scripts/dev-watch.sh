#!/usr/bin/env bash
# Auto-restart dev server on crash
PORT="${1:-3002}"
HOST="127.0.0.1"

echo "Starting AI UI Tracker with auto-restart on port $PORT"
echo "Ctrl+C to stop"
echo ""

while true; do
  echo "[$(date '+%H:%M:%S')] Starting dev server..."
  WATCHPACK_POLLING=true npx next dev -H "$HOST" -p "$PORT" || true
  echo "[$(date '+%H:%M:%S')] Server exited — restarting in 2s..."
  sleep 2
done
