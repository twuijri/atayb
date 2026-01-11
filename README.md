# Link Manager - QR Code & Link Management System

Professional QR code and link management system with tracking and analytics.

## Features

- 📱 QR Code Generation with tracking
- 📊 Analytics Dashboard
- 📄 PDF Catalog Display
- 🎨 Custom branding (logo, colors, site title)
- 🔐 Secure Admin Panel
- 🐳 Docker & Portainer Ready
- ☁️ External Database (Supabase)
- ⚙️ Zero-config deployment

## Quick Deploy (5 Minutes)

### Step 1: Deploy on Portainer

1. Login to Portainer → **Stacks** → **Add Stack**
2. Name: `link-manager`
3. **Copy this Stack code:**

```yaml
version: '3.8'

services:
  app:
    image: atayb-app:latest
    container_name: link-manager-app
    restart: unless-stopped
    ports:
      - "3000:3000"
    volumes:
      - link-manager-uploads:/app/public/uploads
      - link-manager-data:/app/data
    environment:
      - NODE_ENV=production
      # Optional: Pre-configure credentials (or set them in setup wizard)
      # - ADMIN_USERNAME=admin
      # - ADMIN_PASSWORD=YourSecurePassword123
    networks:
      - link-manager-network
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/api/config', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

volumes:
  link-manager-uploads:
    driver: local
  link-manager-data:
    driver: local

networks:
  link-manager-network:
    driver: bridge
```

4. **Deploy Stack**

### Step 2: Setup Wizard

1. Access: `http://your-server-ip:3000/admin`
2. Complete 2-step setup wizard:
   - Create admin account
   - Configure database (optional - can skip)
3. Done! ✨

### Step 3: Configure Database (Optional)

1. Create free account at [supabase.com](https://supabase.com)
2. Execute `SUPABASE_MIGRATION.sql` in Supabase SQL Editor
3. In Admin Panel → Settings:
   - Enter Supabase URL
   - Enter Anon Key
   - Enter Service Role Key
   - Test Connection → Save
4. Restart container in Portainer

---

## Build Your Own Image

```bash
# Clone repository
git clone https://github.com/twuijri/atayb.git
cd atayb

# Build image
docker build -t atayb-app:latest .

# Optional: Push to Docker Hub
docker tag atayb-app:latest your-username/link-manager:latest
docker push your-username/link-manager:latest
```

---

## Configuration

### Admin Panel Settings
- Database configuration (Supabase)
- Admin credentials
- Site title and logo
- All settings saved to persistent volume

### Environment Variables (Optional)
Can be set in Portainer or configured later from admin panel:

| Variable | Description | Required |
|----------|-------------|----------|
| `ADMIN_USERNAME` | Admin username | Yes (or setup wizard) |
| `ADMIN_PASSWORD` | Admin password | Yes (or setup wizard) |
| `SUPABASE_URL` | Supabase project URL | Yes (or settings page) |
| `SUPABASE_ANON_KEY` | Supabase anon key | Yes (or settings page) |
| `SUPABASE_SERVICE_KEY` | Supabase service key | Yes (or settings page) |

---

## Troubleshooting

**Can't login:** Complete setup wizard at `/admin` or check environment variables

**Database error:** Execute `SUPABASE_MIGRATION.sql` in Supabase and configure credentials in Settings

**Settings not applying:** Restart container after saving settings

**Check logs:** `docker logs link-manager-app`

---

## License

MIT License - Free to use for any purpose

---

**Tech Stack:** Next.js 16 · React 19 · Supabase · Docker
