#!/usr/bin/env bash

# ============================================================
# Transpiled Web Template - Vite Development Server
# ============================================================

export NODE_ENV=development

clear

# Get network information (cross-platform)
get_local_ip() {
  if command -v ipconfig &> /dev/null; then
    ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null
  elif command -v hostname &> /dev/null; then
    hostname -I | awk '{print $1}' 2>/dev/null
  elif command -v ip &> /dev/null; then
    ip route get 8.8.8.8 | awk '{print $7}' | head -1 2>/dev/null
  else
    echo "192.168.1.100"
  fi
}

LOCAL_IP=$(get_local_ip)
LOCALHOST="localhost"

PORT=${DEV_PORT:-5173}
FUNCTIONS_PORT=${FUNCTIONS_PORT:-9999}
DEV_SERVER_HOST=${DEV_SERVER_HOST:-0.0.0.0}

export DEV_PORT="$PORT"
export DEV_SERVER_HOST

echo ""
echo "🚀 TRANSPILED WEB TEMPLATE - VITE DEV SERVER"
echo "══════════════════════════════════════════════════════"
echo ""

# Check if port is available
check_port() {
  local port=$1
  if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
    return 1
  else
    return 0
  fi
}

# Free a port if occupied
free_port() {
  local port=$1
  local label=$2
  local pids
  pids=$(lsof -ti:$port)
  if [ -n "$pids" ]; then
    echo "⚠️  Port $port ($label) is in use by: $pids"
    echo "   Attempting to stop existing process(es)..."
    echo "$pids" | xargs kill 2>/dev/null
    sleep 1
  fi
}

ensure_port_free() {
  local port=$1
  local label=$2
  free_port "$port" "$label"
  if ! check_port "$port"; then
    echo "❌ Port $port is still in use. Please free the port or change the $label port variable."
    exit 1
  fi
}

ensure_port_free $PORT "Vite"
ensure_port_free $FUNCTIONS_PORT "Netlify Functions"

# Start Vite in background (use local binary so ./dev.sh works outside of yarn)
echo "⚡ Starting Vite development server on port $PORT..."
./node_modules/.bin/vite --host $DEV_SERVER_HOST --port $PORT > /dev/null 2>&1 &
VITE_PID=$!

echo "⏳ Initializing development environment..."
echo "   • Waiting for Vite server..."

TIMEOUT=30
for i in $(seq 1 $TIMEOUT); do
  if curl --silent --output /dev/null "http://$LOCALHOST:$PORT" 2>/dev/null; then
    break
  fi
  printf "."
  sleep 0.5
done

echo ""

if ! curl --silent --output /dev/null "http://$LOCALHOST:$PORT" 2>/dev/null; then
  echo "❌ Failed to start Vite server"
  kill $VITE_PID 2>/dev/null
  exit 1
fi

# Start Netlify Functions server AFTER Vite is confirmed up
echo "⚡ Starting Netlify Functions server on port $FUNCTIONS_PORT..."
# Load .env so Netlify Functions have access to server-side variables (e.g. FIREBASE_SERVICE_ACCOUNT_BASE64)
if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi
./node_modules/.bin/netlify functions:serve --port $FUNCTIONS_PORT > /dev/null 2>&1 &
FUNCTIONS_PID=$!

echo ""
echo "✅ DEVELOPMENT SERVER READY"
echo "══════════════════════════════════════════════════════"
echo ""
echo "🖥️  LOCAL ACCESS:"
echo "   → App:       http://$LOCALHOST:$PORT"
echo "   → Functions: http://$LOCALHOST:$FUNCTIONS_PORT/.netlify/functions/<name>"
echo ""
echo "🌐 NETWORK ACCESS:"
echo "   → App:    http://$LOCAL_IP:$PORT (accessible from other devices)"
echo ""
echo "══════════════════════════════════════════════════════"
echo "📱 MOBILE ACCESS"
echo "   Scan this QR code with your phone to open the app:"
echo ""

if command -v node &> /dev/null && node -e "require('qrcode-terminal')" &> /dev/null; then
  node -e "
    try {
      require('qrcode-terminal').generate('http://$LOCAL_IP:$PORT', { small: true });
    } catch (e) {
      console.log('   QR code generation failed.');
    }
  "
else
  echo "   📱 Manual URL: http://$LOCAL_IP:$PORT"
  echo "   💡 Install qrcode-terminal: yarn add -D qrcode-terminal"
fi

echo ""
echo "🔄 Server running... Press Ctrl+C to stop"
echo ""

cleanup() {
  echo ""
  echo "🛑 Shutting down development servers..."
  if [ ! -z "$VITE_PID" ]; then
    kill $VITE_PID 2>/dev/null
    echo "   ✓ Vite server stopped"
  fi
  if [ ! -z "$FUNCTIONS_PID" ]; then
    kill $FUNCTIONS_PID 2>/dev/null
    echo "   ✓ Netlify Functions server stopped"
  fi
  lsof -ti:$PORT | xargs kill -9 2>/dev/null
  lsof -ti:$FUNCTIONS_PORT | xargs kill -9 2>/dev/null
  echo "🏁 Development environment shut down cleanly"
  exit 0
}

trap cleanup SIGINT SIGTERM

while true; do
  if ! kill -0 $VITE_PID 2>/dev/null; then
    echo "❌ Vite server stopped unexpectedly"
    cleanup
  fi
  if ! kill -0 $FUNCTIONS_PID 2>/dev/null; then
    echo "❌ Netlify Functions server stopped unexpectedly"
    cleanup
  fi
  sleep 2
done
