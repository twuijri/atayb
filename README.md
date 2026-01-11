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

### ⚠️ Important: Private Repository Note
If your GitHub repository is **private**, you need to use one of these methods:

**Method 1: Git Repository with Authentication** (Recommended for private repos)
- Use Portainer's Repository deployment
- Add GitHub username and Personal Access Token
- See "Option B" below

**Method 2: Pre-built Docker Image** (Best for production)
- Build and push image to Docker Hub (public or private)
- Use Web Editor with image name
- See "Option C" below

**Method 3: Make repo public temporarily**
- Change visibility in GitHub settings
- Deploy using Web Editor
- Make private again after

---

### Option A: Web Editor with Public GitHub (Easiest)

**Requirements:** GitHub repository must be public

1. Login to Portainer → **Stacks** → **Add Stack**
2. Name: `link-manager`
3. Select **Web editor**
4. **Copy and paste this code:**

```yaml
version: '3.8'

services:
  app:
    build:
      context: https://github.com/twuijri/atayb.git
      dockerfile: Dockerfile
    image: link-manager:latest
    container_name: link-manager-app
    restart: unless-stopped
    ports:
      - "3000:3000"
    volumes:
      - link-manager-uploads:/app/public/uploads
      - link-manager-data:/app/data
    environment:
      - NODE_ENV=production
    networks:
      - link-manager-network

volumes:
  link-manager-uploads:
  link-manager-data:

networks:
  link-manager-network:
```

5. **Deploy Stack**
6. Wait for build to complete (first time takes 3-5 minutes)
7. Access: `http://your-server-ip:3000/admin`

### Option B: Git Repository with Authentication (For Private Repos)

**Best for private GitHub repositories**

1. **Create GitHub Personal Access Token:**
   - GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate new token → Select `repo` scope → Generate
   - Copy the token

2. **Deploy in Portainer:**
   - Portainer → Stacks → Add Stack
   - Select **Repository**
   - Repository URL: `https://github.com/twuijri/atayb.git`
   - Repository reference: `refs/heads/main`
   - Compose path: `docker-compose.yml`
   - **Enable Authentication**
   - Username: `twuijri`
   - Personal Access Token: (paste your token)
   - Deploy

### Option C: Pre-built Docker Image (Production Ready)

**Best for production deployments**

1. **Build and push image to Docker Hub:**
   ```bash
   # Login to Docker Hub
   docker login
   
   # Build and push
   ./build-and-push.sh your-dockerhub-username
   ```

2. **Deploy in Portainer:**
   - Stacks → Add Stack → Web editor
   - Use `docker-compose.hub.yml` content
   - Replace `twuijri` with your Docker Hub username
   - Deploy

---

### Setup Wizard

After deployment completes:

1. Access: `http://your-server-ip:3000/admin`
2. Complete 2-step setup wizard:
   - Create admin account
   - Configure database (optional - can skip)
3. Done! ✨

### Configure Database (Optional)

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
