# Synaplan Website — Deployment Guide

Docker-based deployment on Ubuntu 24.04 LTS with Apache2 reverse proxy behind Cloudflare.

## Architecture

```
Client ──► Cloudflare (SSL / 443) ──► Apache2 (:80) ──► Docker web (:3000)
                                                              │
                                                        Docker db (:5432)
                                                              │
                                                        db_data volume (persistent)
```

- **Cloudflare** terminates SSL. Apache only listens on port 80.
- **Next.js** runs as a standalone Node.js server inside Docker.
- **PostgreSQL** runs in a separate container with a named volume — data survives container updates.
- **Migrations** run automatically via a one-shot sidecar container on every `docker compose up`.

### Security

- PostgreSQL has **no ports exposed** to the host — only reachable within the Docker network.
- The web container binds to `127.0.0.1:3000`, not `0.0.0.0` — only Apache can reach it.
- All public traffic goes through Cloudflare (SSL termination + WAF + DDoS protection).

## CI/CD Workflow

```
git push (main) ──► GitHub Actions ──► Build image ──► Push to GHCR
                                                            │
Server:  docker compose pull && docker compose up -d  ◄─────┘
```

The GitHub Actions workflow (`.github/workflows/ci.yml`) builds and pushes
`ghcr.io/metadist/synaplan-website:latest` on every push to `main`.

---

## Initial Setup

### 1. Install Docker

```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  | gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
  > /etc/apt/sources.list.d/docker.list

apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io \
  docker-buildx-plugin docker-compose-plugin
```

Verify: `docker --version && docker compose version`

### 2. Enable Apache Proxy Modules

```bash
a2enmod proxy proxy_http proxy_wstunnel headers rewrite
systemctl restart apache2
```

### 3. Create Apache Virtual Host

```bash
cat > /etc/apache2/sites-available/synaplan.com.conf <<'EOF'
<VirtualHost *:80>
    ServerName synaplan.com
    ServerAlias www.synaplan.com

    ProxyPreserveHost On
    ProxyPass / http://127.0.0.1:3000/
    ProxyPassReverse / http://127.0.0.1:3000/

    # Cloudflare terminates SSL — tell Next.js the original protocol
    RequestHeader set X-Forwarded-Proto "https"
    RequestHeader set X-Forwarded-Port "443"

    # WebSocket support
    RewriteEngine On
    RewriteCond %{HTTP:Upgrade} websocket [NC]
    RewriteCond %{HTTP:Connection} upgrade [NC]
    RewriteRule /(.*) ws://127.0.0.1:3000/$1 [P,L]

    ErrorLog ${APACHE_LOG_DIR}/synaplan.com-error.log
    CustomLog ${APACHE_LOG_DIR}/synaplan.com-access.log combined
</VirtualHost>
EOF

a2ensite synaplan.com.conf
systemctl reload apache2
```

### 4. Deploy Application

```bash
mkdir -p /wwwroot/synaplan.com
cd /wwwroot/synaplan.com
```

Copy `docker-compose.prod.yml` as `docker-compose.yml`:

```bash
# From the dev machine:
scp -P16803 docker-compose.prod.yml root@s1:/wwwroot/synaplan.com/docker-compose.yml
```

Create the `.env` file (generate real secrets — do not use these placeholders):

```bash
cat > /wwwroot/synaplan.com/.env <<'EOF'
POSTGRES_USER=synaplan
POSTGRES_PASSWORD=           # openssl rand -hex 20
POSTGRES_DB=synaplan_web

ADMIN_SESSION_SECRET=        # openssl rand -hex 32
SYNAPLAN_API_BASE_URL=https://web.synaplan.com/api/v1
SYNAPLAN_DEMO_BEARER_TOKEN=
DEMO_CHAT_SESSION_SECRET=    # openssl rand -hex 16

GITHUB_TOKEN=
GITHUB_WEBHOOK_SECRET=

CLOUDFLARE_ZARAZ_TOKEN=
CLOUDFLARE_ZARAZ_SITE_ID=
NEXT_PUBLIC_CLOUDFLARE_RECAPTCHA_KEY=
CLOUDFLARE_RECAPTCHA_SECRET=

SYNAPLAN_WIDGET_ID=
SYNAPLAN_WIDGET_API_URL=https://web.synaplan.com
SYNAPLAN_WIDGET_CONFIG=

PORT=3000
EOF

chmod 600 .env
```

Start everything:

```bash
docker compose up -d
```

This will:
1. Start PostgreSQL and wait for it to be healthy
2. Run Prisma migrations via a one-shot sidecar
3. Start the Next.js web server on port 3000

Verify:

```bash
docker compose ps                          # all services healthy
curl -s -o /dev/null -w '%{http_code}' \
  -H 'Host: synaplan.com' http://127.0.0.1/  # expect 200
```

### 5. Create Admin Account

The blog admin panel lives at `/admin/login`. Create your account manually:

```bash
cd /wwwroot/synaplan.com

ADMIN_EMAIL="your@email.com"
ADMIN_PASSWORD="your-secure-password"

HASH=$(docker compose exec -T web node -e "
  const b = require('bcryptjs');
  b.hash('${ADMIN_PASSWORD}', 12).then(h => process.stdout.write(h));
")

docker compose exec -T db psql -U synaplan synaplan_web -c "
  INSERT INTO \"AdminUser\" (email, name, password, \"createdAt\", \"updatedAt\")
  VALUES ('${ADMIN_EMAIL}', 'Admin', '${HASH}', NOW(), NOW())
  ON CONFLICT (email) DO UPDATE
  SET password = EXCLUDED.password, \"updatedAt\" = NOW();
"
```

To change the password later, re-run the same commands with a new password.

### 6. Cloudflare DNS

Point the domain to the server in the Cloudflare dashboard:

| Type  | Name           | Content                  | Proxy   |
|-------|----------------|--------------------------|---------|
| A     | `synaplan.com` | `<server IPv4>`          | Proxied |
| AAAA  | `synaplan.com` | `<server IPv6>`          | Proxied |
| CNAME | `www`          | `synaplan.com`           | Proxied |

SSL/TLS mode: **Full** (not Full Strict — the origin has no own certificate).

---

## Updating the Site

### Quick Reference: Content Update

```bash
# 1. Edit locally, commit, push
git add -A && git commit -m "content: update xyz" && git push

# 2. Wait ~2 min for GitHub Actions to build

# 3. Deploy
ssh -p16803 root@s1 "cd /wwwroot/synaplan.com && docker compose pull web && docker compose up -d"
```

### Standard Update (after pushing to main)

GitHub Actions builds and pushes a new image automatically. To deploy:

```bash
cd /wwwroot/synaplan.com
docker compose pull web
docker compose up -d
```

What happens:
1. `pull` downloads the new `web` image from GHCR
2. `up -d` recreates only the containers whose images changed
3. The `migrate` sidecar runs `prisma migrate deploy` (handles schema changes)
4. The `web` container starts with the new code
5. The `db` container and `db_data` volume are **untouched** — all data persists

### Updating Environment Variables

```bash
cd /wwwroot/synaplan.com
nano .env                     # edit the values
docker compose up -d          # recreates containers with new env
```

No pull needed — the image hasn't changed, only the runtime config.

### Updating docker-compose.yml

If the compose file itself changes (new services, port changes, etc.):

```bash
# From the dev machine:
scp -P16803 docker-compose.prod.yml root@s1:/wwwroot/synaplan.com/docker-compose.yml

# On the server:
cd /wwwroot/synaplan.com
docker compose up -d
```

### Rollback

If a deployment breaks the site, roll back to the previous image:

```bash
cd /wwwroot/synaplan.com

# Find the previous image digest
docker compose images web

# Re-tag the previous image (use the SHA from the GitHub Actions run)
docker compose pull web --policy=always   # or specify a tag:
# Edit docker-compose.yml temporarily: image: ghcr.io/metadist/synaplan-website:sha-abc1234
docker compose up -d
```

### Full Restart (preserves data)

```bash
cd /wwwroot/synaplan.com
docker compose down
docker compose up -d
```

---

## Maintenance

### Database Backup

```bash
cd /wwwroot/synaplan.com
docker compose exec -T db pg_dump -U synaplan synaplan_web > backup-$(date +%F).sql
```

### Database Restore

```bash
cd /wwwroot/synaplan.com
docker compose exec -T db psql -U synaplan synaplan_web < backup-2026-04-09.sql
```

### View Logs

```bash
docker compose logs web       # Next.js application logs
docker compose logs db        # PostgreSQL logs
docker compose logs migrate   # Migration output (one-shot, check after deploy)
docker compose logs -f web    # Follow live logs
```

### Disk Cleanup

```bash
docker system prune -f        # remove stopped containers, dangling images
docker image prune -a -f      # remove ALL unused images (frees the most space)
```

---

## Data Persistence

| What | Where | Survives updates? |
|------|-------|-------------------|
| Blog posts, admin users | PostgreSQL in `db_data` Docker volume | Yes |
| Static pages, JS bundles | Baked into the Docker image | Replaced on update (by design) |
| Uploaded images | Not yet implemented (future: S3 or volume) | N/A |

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `502 Bad Gateway` | Web container not running — `docker compose logs web` |
| `503 Service Unavailable` | Apache proxy module missing — `a2enmod proxy proxy_http` |
| Migration fails | Check `docker compose logs migrate` for Prisma errors |
| Port 3000 already in use | Another process on 3000 — `ss -tlnp \| grep 3000` |
| Old image after deploy | Forgot to pull — `docker compose pull web` |
| CSS/JS stale after deploy | Hard-refresh browser (`Ctrl+Shift+R`), or Cloudflare cache: purge everything |
| Clean restart | `docker compose down && docker compose up -d` (preserves `db_data`) |
| Nuclear reset (destroys data) | `docker compose down -v` (removes volumes!) |
