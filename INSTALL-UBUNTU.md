# Synaplan Website — Ubuntu 24.04 Installation Manual

Bare-metal deployment on Ubuntu 24.04 LTS **without Docker**.

## Architecture

```
Client ──► Cloudflare (SSL / 443) ──► Apache2 (:80) ──► Node.js (:3000)
                                                              │
                                                        PostgreSQL (:5432)
```

Cloudflare handles SSL termination. Apache acts as a reverse proxy on port 80.
Next.js runs as a standalone Node.js process managed by systemd.

---

## 1. Install Required Packages

```bash
# Node.js 22.x (LTS) via NodeSource
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs

# PostgreSQL 16
apt-get install -y postgresql postgresql-contrib

# Apache2 modules (proxy, headers, rewrite)
a2enmod proxy proxy_http proxy_wstunnel headers rewrite
systemctl restart apache2

# Build tools (needed for native npm packages like bcrypt)
apt-get install -y build-essential python3
```

Verify:

```bash
node -v    # v22.x
npm -v     # 10.x+
psql -V    # psql (PostgreSQL) 16.x
```

---

## 2. Configure PostgreSQL

```bash
# Start and enable
systemctl enable --now postgresql

# Create database and user
sudo -u postgres psql <<'SQL'
CREATE USER synaplan WITH PASSWORD 'CHANGE_ME_STRONG_PASSWORD';
CREATE DATABASE synaplan_web OWNER synaplan;
GRANT ALL PRIVILEGES ON DATABASE synaplan_web TO synaplan;
SQL
```

Test the connection:

```bash
psql -U synaplan -h 127.0.0.1 -d synaplan_web -c "SELECT 1;"
```

> If `peer` auth blocks the connection, edit `/etc/postgresql/16/main/pg_hba.conf`
> and set the local IPv4 method to `scram-sha-256`, then `systemctl reload postgresql`.

---

## 3. Build the Application (on this dev machine)

Build locally and rsync the standalone output to the server. This avoids
installing dev dependencies on production.

```bash
cd /wwwroot/synaplan-website

# Install dependencies
npm ci

# Generate Prisma client
DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate

# Build (set widget vars if needed)
npm run build
```

The standalone output lives in `.next/standalone/`. Deploy it:

```bash
# Sync to server (first time — creates the directory)
rsync -avz --delete \
  -e "ssh -p16803" \
  .next/standalone/ \
  root@s1:/wwwroot/synaplan.com/

# Static assets and public files (served by Next.js)
rsync -avz --delete \
  -e "ssh -p16803" \
  .next/static/ \
  root@s1:/wwwroot/synaplan.com/.next/static/

rsync -avz --delete \
  -e "ssh -p16803" \
  public/ \
  root@s1:/wwwroot/synaplan.com/public/

# Prisma migrations (needed for schema updates)
rsync -avz --delete \
  -e "ssh -p16803" \
  prisma/ \
  root@s1:/wwwroot/synaplan.com/prisma/
```

---

## 4. Configure Environment on Server

```bash
ssh -p16803 root@s1
cat > /wwwroot/synaplan.com/.env <<'EOF'
NODE_ENV=production
PORT=3000
HOSTNAME=127.0.0.1

# ── Database ──
DATABASE_URL=postgresql://synaplan:CHANGE_ME_STRONG_PASSWORD@127.0.0.1:5432/synaplan_web

# ── Admin (generate: openssl rand -hex 32) ──
ADMIN_SESSION_SECRET=

# ── Synaplan API ──
SYNAPLAN_API_BASE_URL=https://web.synaplan.com/api/v1
SYNAPLAN_DEMO_BEARER_TOKEN=
DEMO_CHAT_SESSION_SECRET=

# ── GitHub (optional) ──
GITHUB_TOKEN=
GITHUB_WEBHOOK_SECRET=

# ── Cloudflare (optional) ──
CLOUDFLARE_ZARAZ_TOKEN=
CLOUDFLARE_ZARAZ_SITE_ID=
NEXT_PUBLIC_CLOUDFLARE_RECAPTCHA_KEY=
CLOUDFLARE_RECAPTCHA_SECRET=

# ── Widget (optional) ──
SYNAPLAN_WIDGET_ID=
SYNAPLAN_WIDGET_API_URL=https://web.synaplan.com
SYNAPLAN_WIDGET_CONFIG=
EOF

chmod 600 /wwwroot/synaplan.com/.env
```

---

## 5. Run Database Migrations

```bash
ssh -p16803 root@s1

cd /wwwroot/synaplan.com
npx prisma migrate deploy
```

---

## 6. Create systemd Service

```bash
cat > /etc/systemd/system/synaplan-website.service <<'EOF'
[Unit]
Description=Synaplan Website (Next.js)
After=network.target postgresql.service
Requires=postgresql.service

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/wwwroot/synaplan.com
EnvironmentFile=/wwwroot/synaplan.com/.env
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=5

# Hardening
NoNewPrivileges=true
ProtectSystem=strict
ReadWritePaths=/wwwroot/synaplan.com
PrivateTmp=true

[Install]
WantedBy=multi-user.target
EOF

# Set ownership so www-data can run it
chown -R www-data:www-data /wwwroot/synaplan.com

systemctl daemon-reload
systemctl enable --now synaplan-website

# Verify it started
systemctl status synaplan-website
curl -s http://127.0.0.1:3000/ | head -20
```

---

## 7. Configure Apache2 Virtual Host

The server is currently missing the required proxy modules. Enable them:

```bash
a2enmod proxy proxy_http proxy_wstunnel headers rewrite
```

Create the virtual host:

```bash
cat > /etc/apache2/sites-available/synaplan.com.conf <<'CONF'
<VirtualHost *:80>
    ServerName synaplan.com
    ServerAlias www.synaplan.com

    # Reverse proxy to Next.js
    ProxyPreserveHost On
    ProxyPass / http://127.0.0.1:3000/
    ProxyPassReverse / http://127.0.0.1:3000/

    # Pass Cloudflare headers through to Next.js
    RequestHeader set X-Forwarded-Proto "https"
    RequestHeader set X-Forwarded-Port "443"

    # WebSocket support (if needed for HMR in dev — harmless in prod)
    RewriteEngine On
    RewriteCond %{HTTP:Upgrade} websocket [NC]
    RewriteCond %{HTTP:Connection} upgrade [NC]
    RewriteRule /(.*) ws://127.0.0.1:3000/$1 [P,L]

    # Logs
    ErrorLog ${APACHE_LOG_DIR}/synaplan.com-error.log
    CustomLog ${APACHE_LOG_DIR}/synaplan.com-access.log combined
</VirtualHost>
CONF

a2ensite synaplan.com.conf
systemctl reload apache2
```

Test:

```bash
curl -H "Host: synaplan.com" http://127.0.0.1/
```

---

## Summary: Packages to Install

| Package | Purpose |
|---------|---------|
| `nodejs` (22.x via NodeSource) | Next.js runtime |
| `postgresql`, `postgresql-contrib` | Database |
| `build-essential`, `python3` | Native npm module compilation |
| Apache modules: `proxy`, `proxy_http`, `proxy_wstunnel`, `headers`, `rewrite` | Reverse proxy |

## Summary: Apache Modules to Enable

```bash
a2enmod proxy proxy_http proxy_wstunnel headers rewrite
```

Currently loaded modules on the server are missing **all five** of these.

---

## Updating the Site

After making changes in the repo, rebuild and redeploy:

```bash
# On dev machine
cd /wwwroot/synaplan-website
npm run build

rsync -avz --delete -e "ssh -p16803" .next/standalone/ root@s1:/wwwroot/synaplan.com/
rsync -avz --delete -e "ssh -p16803" .next/static/ root@s1:/wwwroot/synaplan.com/.next/static/
rsync -avz --delete -e "ssh -p16803" public/ root@s1:/wwwroot/synaplan.com/public/

# On server (only if schema changed)
ssh -p16803 root@s1 "cd /wwwroot/synaplan.com && npx prisma migrate deploy"

# Restart
ssh -p16803 root@s1 "systemctl restart synaplan-website"
```

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `502 Bad Gateway` | Node.js not running — check `systemctl status synaplan-website` |
| `503 Service Unavailable` | Apache proxy module not loaded — run `a2enmod proxy proxy_http` |
| DB connection refused | PostgreSQL not running or wrong password in `.env` |
| Assets return 404 | Missing `.next/static/` or `public/` — re-rsync them |
| Prisma error on start | Run `npx prisma migrate deploy` on the server |
| `EACCES` permission error | Run `chown -R www-data:www-data /wwwroot/synaplan.com` |
