#!/usr/bin/env bash
# Synaplan website watchguard.
#
# Polls GHCR for the latest container image, and if a new digest is available
# lets `docker compose up -d` recreate the stack (which correctly re-runs
# prisma migrations via the "migrate" one-shot sidecar before "web" comes back
# up). This is the deploy mechanism referenced in CI/CD docs and in
# graphic_ideas_material/zugang.txt.
#
# Install:
#   sudo install -m 0755 deploy/watchguard.sh /usr/local/bin/synaplan-watchguard.sh
#   sudo install -m 0644 deploy/synaplan-watchguard.service /etc/systemd/system/
#   sudo install -m 0644 deploy/synaplan-watchguard.timer /etc/systemd/system/
#   sudo systemctl daemon-reload
#   sudo systemctl enable --now synaplan-watchguard.timer
#
# Logs:
#   journalctl -u synaplan-watchguard.service -f

set -euo pipefail

COMPOSE_DIR="/wwwroot/synaplan.com"
COMPOSE="docker compose -f ${COMPOSE_DIR}/docker-compose.yml"
SERVICE_IMAGE="ghcr.io/metadist/synaplan-website:latest"

cd "$COMPOSE_DIR"

# Resolve the digest of the image currently running for the web service.
running_digest="$(docker inspect synaplancom-web-1 \
  --format "{{index .Image}}" 2>/dev/null || echo "none")"

# Pull silently; capture the digest of whatever is now :latest in GHCR.
docker pull --quiet "$SERVICE_IMAGE" >/dev/null
latest_digest="$(docker image inspect "$SERVICE_IMAGE" --format "{{.Id}}")"

if [ "$running_digest" = "$latest_digest" ]; then
  echo "watchguard: up to date ($latest_digest), no action"
  exit 0
fi

echo "watchguard: new image detected"
echo "  running: $running_digest"
echo "  latest : $latest_digest"
echo "watchguard: recreating stack via docker compose up -d"
$COMPOSE up -d --remove-orphans

# Clean up the previous image to keep disk usage bounded.
docker image prune -f >/dev/null || true
echo "watchguard: redeploy complete"
