# Atayb Altomor - QR Code & Link Generator

Professional QR code and link management system with advanced tracking, PDF catalog display, and admin dashboard.

## Features

- 📱 **QR Code Generation** - Generate custom QR codes with real-time tracking
- 📊 **Analytics Dashboard** - Track clicks, views, and user engagement
- 📄 **PDF Catalog Display** - Upload and display multiple PDFs with device-optimized viewing
- 🎨 **Professional Branding** - Custom logo upload and brand color configuration
- 🔐 **Admin Panel** - Secure authentication with link and asset management
- 📲 **Mobile Optimized** - Full responsive design with RTL Arabic support
- 🐳 **Docker Ready** - Production-ready containerization
- ☁️ **External Database** - Supabase integration for data persistence
- ⚙️ **Dynamic Configuration** - Configure database from admin panel (no redeployment needed)

## Tech Stack

- **Frontend**: Next.js 16.1.1 with React 19.2.3
- **Styling**: CSS Modules with custom color variables
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Docker & Portainer Stack
- **Authentication**: Server-side cookie management

## Quick Start - Deploy in 5 Minutes! 🚀

### Method 1: Deploy First, Configure Later (Recommended)

This is the easiest way! Deploy the application first, then configure the database from the admin panel.

#### Step 1: Deploy on Portainer

1. **Login to Portainer**
2. **Go to Stacks** → **Add Stack**
3. **Name**: `atayb`
4. **Web Editor**: Copy and paste the content from `docker-compose.yml`
5. **Environment Variables** (Advanced mode):
   ```env
This is the easiest way! Deploy the application first, then configure everything from the web interface.

#### Step 1: Deploy on Portainer (No configuration needed!)

1. **Login to Portainer**
2. **Go to Stacks** → **Add Stack**
3. **Name**: `atayb`
4. **Web Editor**: Copy and paste the content from `docker-compose.yml`
5. **Skip Environment Variables** (or add only if you want):
   ```env
   # Optional: Only if you want to pre-set credentials
   # Otherwise, you'll create them on first access
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=YourSecurePassword123!
   ```
   
6. **Deploy the stack**

#### Step 2: First-Time Setup (Portainer-Style)

1. **Access the Application**: `http://your-server-ip:3000/admin`
2. **Setup Wizard** will automatically appear:
   - **Step 1**: Create admin account (username + password)
   - **Step 2**: Configure database (optional - can skip and configure later)
3. **Complete Setup** - Everything is saved to volume automatically!

#### Step 3: Configure Database (Now or Later)

**Option A: During Setup**
- Enter Supabase credentials in Step 2 of setup wizard

**Option B: After Setup (Anytime)**
1. Login to admin panel
2. Click "⚙️ Settings" button
3. Enter Supabase credentials:
   - Get from https://supabase.com
   - Execute `SUPABASE_MIGRATION.sql` in Supabase SQL Editor
   - Enter Project URL, Anon Key, and Service Role Key
4. Test Connection → Save → Restart Container

**That's it!** Your application is now fully configured and running! ✨

---

### Method 2: Deploy from Git Repository

1. In Portainer, choose **Git Repository** deployment
2. **Repository URL**: `https://github.com/twuijri/atayb.git`
3. **Compose path**: `docker-compose.yml`
4. **Environment Variables**: Can be completely empty!
5. **Deploy** → Access `/admin` and complete the setup wizard

---

### Method 3: Pre-Configure Everything (Traditional Way)

If you prefer to set everything before deployment:

1. **Setup Supabase**:
   - Create account at https://supabase.com
   - Create new project
   - Execute `SUPABASE_MIGRATION.sql` in SQL Editor
   - Get Project URL, Anon Key, and Service Role Key

2. **Deploy with Full Configuration**:
   - Portainer → Stacks → Add Stack
   - Copy `docker-compose.yml`
   - Add all environment variables:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_KEY=your-service-role-key
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=YourSecurePassword123!
   ```
   - Deploy

---

## Local Development

### Prerequisites

1. **Supabase Account** (Free tier available)
   - Sign up at https://supabase.com
   - Create a new project
   - Execute `SUPABASE_MIGRATION.sql` in SQL Editor

### Setup

1. **Clone and Install**
   ```bash
   git clone https://github.com/twuijri/atayb.git
   cd atayb
   npm install
   ```

2. **Configure Environment** (Optional)
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials (or configure later from admin panel)
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Access Application**
   - Main site: http://localhost:3000
   - Admin panel: http://localhost:3000/admin

---

## Production Deployment Details

### Build Docker Image

```bash
# Option 1: Use the provided script
./build-and-deploy.sh

# Option 2: Manual build
docker build -t atayb-app:latest .

# Option 3: Push to Docker Hub (optional)
docker tag atayb-app:latest your-username/atayb-app:latest
docker login
docker push your-username/atayb-app:latest
```

---

## Configuration Management

### Admin Settings Panel

Access: `http://your-server-ip:3000/admin/settings`

**Features:**
- ⚙️ Configure Supabase database connection
- 🔐 Update admin username and password
- 🔍 Test database connection before saving
- 💾 Settings stored persistently in volume
- 🔄 No redeployment needed - just restart container

### Environment Variables (Optional)

You can set these in Portainer Stack, or configure them later from the admin panel:

| Variable | Description | Required | Can Configure Later? |
|----------|-------------|----------|---------------------|
| `SUPABASE_URL` | Your Supabase project URL | Yes | ✅ Yes |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Yes | ✅ Yes |
| `SUPABASE_SERVICE_KEY` | Supabase service role key | Yes | ✅ Yes |
| `ADMIN_USERNAME` | Admin login username | Yes | ✅ Yes |
| `ADMIN_PASSWORD` | Admin login password | Yes | ✅ Yes |
| `NODE_ENV` | Node environment | Auto-set | ❌ No |

**Priority Order:**
1. Settings from Admin Panel (`data/config.json`)
2. Environment Variables (from Portainer)
3. Default values

---

## Data Persistence

### Volumes
- `atayb-uploads`: Uploaded files (PDFs, images)
- `atayb-data`: Application data and configuration

### Database
All structured data is stored in Supabase (external database):
- Links and QR codes
- Tracking analytics
- System configuration

---

## Project Structure

```
├── app/
│   ├── api/              # API routes (links, track, upload, config)
│   ├── admin/            # Admin panel (login, dashboard, settings)
│   │   ├── settings/     # Database configuration page
│   ├── viewer/           # PDF viewer page
│   ├── layout.js         # Root layout
│   └── page.js           # Home page
├── components/           # React components (Header, LinkItem, etc)
├── data/                 # Persistent data storage
│   └── config.json       # Database and auth configuration
├── public/
│   └── uploads/          # User uploaded files
├── Dockerfile            # Production Docker config
├── docker-compose.yml    # Portainer Stack config
├── middleware.js         # Auth middleware for /admin
├── build-and-deploy.sh   # Automated build script
└── next.config.mjs       # Next.js configuration
```

---

## API Endpoints

### Links Management
- `GET /api/links` - Fetch all links
- `POST /api/links` - Create/update link
- `DELETE /api/links` - Delete link

### Tracking & Analytics
- `GET /api/track` - Get analytics data
- `POST /api/track` - Record page view/click

### File Management
- `POST /api/upload` - Upload file (PDF, image)
- `GET /api/files/[...slug]` - Serve uploaded files

### Configuration
- `GET /api/config` - Get site configuration
- `POST /api/config` - Update configuration

### Admin & Settings
- `GET /api/admin/settings` - Get database configuration
- `POST /api/admin/settings` - Update database configuration
- `POST /api/admin/test-connection` - Test Supabase connection

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout

---

## Documentation

### Quick Guides
- **[USAGE.md](USAGE.md)** - Quick start usage guide
- **[QUICK_START_AR.md](QUICK_START_AR.md)** - 5-minute quick start (Arabic)

### Deployment Guides
- **[PORTAINER_DEPLOY.md](PORTAINER_DEPLOY.md)** - Complete Portainer deployment guide
- **[DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)** - Deployment overview

### Feature Guides
- **[ADMIN_SETTINGS_FEATURE.md](ADMIN_SETTINGS_FEATURE.md)** - Admin settings panel guide
- **[SETTINGS_GUIDE.md](SETTINGS_GUIDE.md)** - Settings page usage guide

---

## Support & Troubleshooting

### Common Issues

**Can't login to admin panel:**
- Check `ADMIN_USERNAME` and `ADMIN_PASSWORD` in environment variables
- Or configure from settings after initial deployment

**Database connection error:**
- Verify Supabase credentials in admin settings
- Ensure `SUPABASE_MIGRATION.sql` was executed
- Test connection from settings page

**Files not uploading:**
- Check volume permissions: `docker exec atayb-app ls -la /app/public/uploads`
- Verify volume exists: `docker volume ls | grep atayb`

**Settings not applying:**
- Restart container after saving settings
- Check logs: `docker logs atayb-app`

### Get Help

For detailed troubleshooting, see:
- [SETTINGS_GUIDE.md](SETTINGS_GUIDE.md) - Settings troubleshooting
- [PORTAINER_DEPLOY.md](PORTAINER_DEPLOY.md) - Deployment issues
- Check container logs: `docker logs atayb-app`

---

## License

MIT License - feel free to use this project for your own purposes.

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## Author

Created with ❤️ for easy deployment and management
ADMIN_USERNAME=admin
ADMIN_PASSWORD=atayb2025
```

## Data Persistence

When running in Docker, ensure volumes are properly configured:

```bash
# Data directory (links, stats, config)
-v ./data:/app/data

# Uploads directory (PDFs, images)
-v ./public/uploads:/app/public/uploads
```

## Admin Dashboard Features

- ✅ Create/edit/delete links with custom names
- ✅ Upload PDF catalogs
- ✅ View detailed analytics
- ✅ Upload and manage custom logo
- ✅ Generate QR codes
- ✅ Track user engagement

## Troubleshooting

### Container won't start
- Check volume paths exist
- Verify port 3000 is available
- Check Docker logs: `docker logs container-name`

### Data not persisting
- Ensure volumes are mounted correctly
- Check permissions on data directory
- Verify volume path mappings in docker-compose.yml

### PDFs not displaying
- Verify file upload permissions
- Check public/uploads directory exists
- Try different browser for compatibility

### Admin login fails
- Verify middleware.js is active
- Check browser cookies enabled
- Clear browser cache and try again

## Color Scheme

- **Primary**: #2B2B2B (Dark Brown)
- **Background**: #D4C4B0 (Warm Beige)
- **Secondary**: #A89080 (Brown)
- **Accent**: #B8A89A (Beige Accent)

## Support & Documentation

- See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment guide
- Check `.dockerignore` for build optimization
- Review `Dockerfile` for production build process

## License

Private project for Atayb Altomor

---

**Last Updated**: January 2025
**Version**: 1.0.0 (Production Ready)
