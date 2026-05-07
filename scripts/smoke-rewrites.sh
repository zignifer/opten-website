#!/usr/bin/env bash
# Phase 77 smoke-test — run on PRODUCTION after `vercel --prod` (D-17).
# Usage: bash scripts/smoke-rewrites.sh https://opten.space
set -uo pipefail
BASE="${1:-https://opten.space}"
PROXY="https://promptscore-proxy.vercel.app"
PASS=0; FAIL=0
log_pass() { echo "PASS  $1"; PASS=$((PASS+1)); }
log_fail() { echo "FAIL  $1  -- $2"; FAIL=$((FAIL+1)); }

assert_html() {
  local path="$1"
  local code ct
  code=$(curl -sS -o /dev/null -w '%{http_code}' "$BASE$path")
  ct=$(curl -sS -o /dev/null -w '%{content_type}' "$BASE$path")
  if [[ "$code" == "200" && "$ct" == text/html* ]]; then
    log_pass "$path -> 200 text/html"
  else
    log_fail "$path" "code=$code ct=$ct"
  fi
}

assert_mcp_post() {
  # POST a minimal JSON-RPC initialize; expect 401 (no token) — proves /mcp reaches proxy
  local code
  code=$(curl -sS -o /dev/null -w '%{http_code}' \
    -X POST "$BASE/mcp" \
    -H 'Content-Type: application/json' \
    -H 'Origin: https://claude.ai' \
    -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}')
  # Expect 401 (Bearer required) per Phase 76 — proves rewrite reaches proxy
  if [[ "$code" == "401" || "$code" == "503" ]]; then
    log_pass "POST /mcp -> $code (proxy reached; 503 = MCP_DISABLED, 401 = auth required)"
  else
    log_fail "POST /mcp" "code=$code (expected 401 or 503)"
  fi
}

assert_oauth_options() {
  # OPTIONS preflight on /api/oauth/register — should return 204/200 from proxy
  local code path="$1"
  code=$(curl -sS -o /dev/null -w '%{http_code}' -X OPTIONS "$BASE$path")
  if [[ "$code" =~ ^(200|204|405)$ ]]; then
    log_pass "OPTIONS $path -> $code"
  else
    log_fail "OPTIONS $path" "code=$code"
  fi
}

assert_origin_reject() {
  # Per D-19: evil.com origin should be rejected by proxy with 403
  local code
  code=$(curl -sS -o /dev/null -w '%{http_code}' \
    -X POST "$BASE/mcp" \
    -H 'Content-Type: application/json' \
    -H 'Origin: https://evil.com' \
    -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}')
  if [[ "$code" == "403" ]]; then
    log_pass "POST /mcp Origin:evil.com -> 403"
  else
    log_fail "Origin reject" "code=$code (expected 403)"
  fi
}

assert_no_well_known_rewrite() {
  # SITE-05: opten.space MUST NOT serve .well-known — should be 404 from SPA fallback (or 308 to proxy if accidentally rewritten).
  # Acceptable: 404 (SPA index.html with no route — index returns 200 actually) OR text/html (SPA catch-all).
  # Just assert it's NOT JSON (which would mean a rewrite is in place).
  local ct
  ct=$(curl -sS -o /dev/null -w '%{content_type}' "$BASE/.well-known/oauth-authorization-server")
  if [[ "$ct" != application/json* ]]; then
    log_pass ".well-known not proxied (ct=$ct)"
  else
    log_fail ".well-known leak" "ct=$ct (opten.space is serving discovery — AUTH-09 violation)"
  fi
}

# 6 existing routes (HTML)
for path in / /pay /success /privacy /terms /refund /account /welcome; do
  assert_html "$path"
done

# 1 new SPA route
assert_html /connect-claude

# 5 new proxy routes
assert_mcp_post
assert_oauth_options /api/oauth/register
assert_oauth_options /api/oauth/token
assert_oauth_options /api/oauth/authorize

# Negative tests
assert_origin_reject
assert_no_well_known_rewrite

echo
echo "==== RESULT: $PASS passed, $FAIL failed ===="
exit $FAIL
