#!/usr/bin/env bash
set -euo pipefail

DOMAIN_DIR="src/domain"

if [ ! -d "$DOMAIN_DIR" ]; then
  echo "src/domain not yet created — skipping."
  exit 0
fi

PATTERN="from ['\"](@supabase|express|nunjucks|axios|node:http|node:https|node:fs|dotenv)"

if grep -rE "$PATTERN" "$DOMAIN_DIR" 2>/dev/null; then
  echo "DOMAIN VIOLATION: domain layer must not import framework or I/O code."
  exit 1
fi

if grep -rE "\bfetch\s*\(" "$DOMAIN_DIR" 2>/dev/null; then
  echo "DOMAIN VIOLATION: domain layer must not call fetch()."
  exit 1
fi

echo "Domain purity check passed."
