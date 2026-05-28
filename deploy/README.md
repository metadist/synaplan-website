# Synaplan website — deploy assets

Production helpers for the `synaplan.com` host. Everything here is meant to
live on the server (`s1:/wwwroot/synaplan.com`) but is version-controlled
here so a fresh server can be brought back online deterministically.

## Files

| File | On the server | Purpose |
|---|---|---|
| `watchguard.sh` | `/usr/local/bin/synaplan-watchguard.sh` | Polls GHCR for `ghcr.io/metadist/synaplan-website:latest`; if the digest differs from the running container's image, runs `docker compose up -d` to redeploy (which re-runs migrations via the `migrate` sidecar before the new `web` container starts). |
| `synaplan-watchguard.service` | `/etc/systemd/system/synaplan-watchguard.service` | `oneshot` systemd service that runs the script above. |
| `synaplan-watchguard.timer` | `/etc/systemd/system/synaplan-watchguard.timer` | Fires the service every 2 minutes. |

## Install (or reinstall)

From a freshly-cloned `synaplan-website` repo on the server:

```bash
sudo install -m 0755 deploy/watchguard.sh /usr/local/bin/synaplan-watchguard.sh
sudo install -m 0644 deploy/synaplan-watchguard.service /etc/systemd/system/
sudo install -m 0644 deploy/synaplan-watchguard.timer /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now synaplan-watchguard.timer
```

Verify:

```bash
systemctl list-timers synaplan-watchguard.timer
journalctl -u synaplan-watchguard.service -n 50 --no-pager
```

The first run typically logs `watchguard: up to date (<sha256>...), no action`.
A redeploy logs `watchguard: new image detected` followed by the compose
recreate output and `watchguard: redeploy complete`.

## How it interacts with the deploy flow

```
git push origin main
  → GitHub Actions CI                  (~3–6 min build + push)
    → ghcr.io/metadist/synaplan-website:latest  (new digest)
      → watchguard.timer fires within 2 min     (polls GHCR)
        → docker compose pull
          → if digest changed: docker compose up -d  (recreates web,
                                                     re-runs migrate
                                                     sidecar, no DB downtime)
```

The web container binds only to `127.0.0.1:3000` via Apache, so the redeploy
is invisible to Cloudflare clients beyond the few seconds the new container
takes to pass its healthcheck.

## What this does *not* do

- It does **not** sync `docker-compose.yml` from this repo to the server.
  Compose-file changes still need a manual `scp` (see `docs/DEPLOYMENT.md`
  §"Updating docker-compose.yml"). The watchguard only updates the
  *container image*, not the orchestration manifest.
- It does **not** roll back on healthcheck failure. If a bad build ships,
  the next watchguard run will pull the next-pushed image; for an emergency
  pin, edit `docker-compose.yml` on the server and set an explicit tag (e.g.
  `:v3.2.0` instead of `:latest`), then `docker compose up -d`.
- It does **not** handle blue/green or zero-downtime upgrades. The web
  container is briefly recreated; this is acceptable for an autonomously
  rolling marketing/blog site, not for high-availability workloads.

## Troubleshooting

- **Containers stuck on an old image** (the failure mode this script
  exists to fix): check `systemctl status synaplan-watchguard.timer`. If
  inactive, `systemctl enable --now synaplan-watchguard.timer`.
- **Timer fires but image never pulls**: run the script by hand —
  `sudo /usr/local/bin/synaplan-watchguard.sh` — and inspect the output.
  GHCR rate limits or a broken `docker login` will surface there.
- **Migrations fail on redeploy**: `docker compose logs migrate` shows
  the prisma output. The `web` service depends on `migrate` completing
  successfully, so a bad migration will keep the *old* web running, not
  break it.
