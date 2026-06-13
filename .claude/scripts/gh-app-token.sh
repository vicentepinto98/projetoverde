#!/usr/bin/env bash
# Mint a short-lived GitHub App installation access token so PR reviews post as
# the App's bot identity (e.g. projeto-verde-bot[bot]) instead of your account.
#
# Reads these env vars (set them in ~/.claude/settings.json "env", NOT in the
# committed project settings):
#   GH_APP_ID                numeric App ID
#   GH_APP_INSTALLATION_ID   installation ID for vicentepinto98/projetoverde
#   GH_APP_PRIVATE_KEY_PATH  path to the App's .pem key (keep it OUTSIDE the repo)
#
# On success: prints the installation token to stdout.
# If the App is not configured: prints nothing and exits 0, so callers fall back
# to the default `gh` auth (your user account). This keeps the review skills
# working before the App is set up.
set -euo pipefail

: "${GH_APP_ID:=}"
: "${GH_APP_INSTALLATION_ID:=}"
: "${GH_APP_PRIVATE_KEY_PATH:=}"

if [[ -z "$GH_APP_ID" || -z "$GH_APP_INSTALLATION_ID" || ! -f "$GH_APP_PRIVATE_KEY_PATH" ]]; then
  exit 0  # App not configured — caller falls back to default gh auth.
fi

b64url() { openssl base64 -A | tr '+/' '-_' | tr -d '='; }

now=$(date +%s)
header=$(printf '{"alg":"RS256","typ":"JWT"}' | b64url)
payload=$(printf '{"iat":%d,"exp":%d,"iss":"%s"}' "$((now - 60))" "$((now + 540))" "$GH_APP_ID" | b64url)
unsigned="${header}.${payload}"
signature=$(printf '%s' "$unsigned" | openssl dgst -sha256 -sign "$GH_APP_PRIVATE_KEY_PATH" -binary | b64url)
jwt="${unsigned}.${signature}"

token=$(curl -s -X POST \
  -H "Authorization: Bearer $jwt" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  "https://api.github.com/app/installations/${GH_APP_INSTALLATION_ID}/access_tokens" \
  | jq -r '.token // empty')

if [[ -z "$token" ]]; then
  echo "gh-app-token: failed to mint installation token — check App ID, installation ID, and key path" >&2
  exit 1
fi

printf '%s\n' "$token"
