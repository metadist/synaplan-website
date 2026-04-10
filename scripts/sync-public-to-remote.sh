#!/usr/bin/env bash
# Sync local public/ (static assets + blog uploads) to a remote server via rsync.
#
# Required env:
#   SYNC_REMOTE       — SSH target, e.g. root@s1
#   SYNC_REMOTE_DIR   — Remote path to the site's public directory, e.g. /wwwroot/synaplan.com/public
# Optional:
#   SYNC_SSH_OPTS     — Extra ssh args, e.g. -p 16803
#
# Example:
#   SYNC_REMOTE=root@s1 SYNC_SSH_OPTS='-p 16803' SYNC_REMOTE_DIR=/wwwroot/synaplan.com/public \
#     ./scripts/sync-public-to-remote.sh
#
# Docker: rsync to the host, then copy into the running web container, e.g.:
#   rsync ... ./public/uploads/ "$SYNC_REMOTE:/tmp/synaplan-public-uploads/"
#   ssh ... "$SYNC_REMOTE" 'docker cp /tmp/synaplan-public-uploads/. CONTAINER_NAME:/app/public/uploads/'
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

REMOTE="${SYNC_REMOTE:?Set SYNC_REMOTE (e.g. root@host)}"
REMOTE_DIR="${SYNC_REMOTE_DIR:?Set SYNC_REMOTE_DIR (remote public/ path)}"
SSH_OPTS="${SYNC_SSH_OPTS:-}"

RSYNC_SSH=(ssh)
if [[ -n "$SSH_OPTS" ]]; then
  # shellcheck disable=SC2206
  RSYNC_SSH=(ssh $SSH_OPTS)
fi

echo "Syncing ${ROOT}/public/ -> ${REMOTE}:${REMOTE_DIR}/"
mkdir -p "${ROOT}/public/uploads"

rsync -avz --delete-delay \
  --exclude '.DS_Store' \
  -e "${RSYNC_SSH[*]}" \
  "./public/" \
  "${REMOTE}:${REMOTE_DIR}/"

echo "Done."
