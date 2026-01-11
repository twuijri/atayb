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

## Tech Stack

- **Frontend**: Next.js 16.1.1 with React 19.2.3
- **Styling**: CSS Modules with custom color variables
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Docker & Portainer Stack
- **Authentication**: Server-side cookie management

## Getting Started

### Prerequisites

1. **Supabase Account** (Free tier available)
   - Sign up at https://supabase.com
   - Create a new project
   - Execute `SUPABASE_MIGRATION.sql` in SQL Editor
   - Get your Project URL, Anon Key, and Service Role Key

### Local Development

1. **Clone and Install**
   ```bash
   git clone https://github.com/yourusername/atayb.git
   cd atayb
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Access Application**
   - Main site: http://localhost:3000
   - Admin panel: http://localhost:3000/admin

## Production Deployment (Portainer)

### Quick Deploy

```bash
# 1. Build Docker image
./build-and-deploy.sh

# 2. Follow the prompts to optionally push to Docker Hub
```

### Manual Deployment

#### Step 1: Build Docker Image

```bash
# Build the image
docker build -t atayb-app:latest .

# (Optional) Push to Docker Hub
docker tag atayb-app:latest your-username/atayb-app:latest
docker login
docker push your-username/atayb-app:latest
```

#### Step 2: Deploy on Portainer

1. **Login to Portainer**
2. **Go to Stacks** → **Add Stack**
3. **Name**: `atayb`
4. **Copy** the content from `docker-compose.yml`
5. **Add Environment Variables** (from `.env.portainer`):
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_KEY=your-service-role-key
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your-secure-password
   ```
6. **Deploy the stack**

#### Step 3: Verify Deployment

- Access: `http://your-server-ip:3000`
- Admin: `http://your-server-ip:3000/admin`

### Alternative: Deploy from Git Repository

1. In Portainer, choose **Git Repository** deployment
2. Provide your repository URL
3. Set compose path: `docker-compose.yml`
4. Add environment variables
5. Deploy

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Your Supabase project URL | Yes |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_KEY` | Supabase service role key | Yes |
| `ADMIN_USERNAME` | Admin login username | Yes |
| `ADMIN_PASSWORD` | Admin login password | Yes |
| `NODE_ENV` | Node environment (production) | Auto-set |

## Data Persistence

### Volumes
- `atayb-uploads`: Uploaded files (PDFs, images)
- `atayb-data`: Application data

### Database
All structured data is stored in Supabase (external database):
- Links and QR codes
- Tracking analytics
- Configuration settings

## Project Structure

```
├── app/
│   ├── api/              # API routes (links, track, upload, config)
│   ├── admin/            # Admin panel (login, dashboard)
│   ├── viewer/           # PDF viewer page
│   ├── layout.js         # Root layout
│   └── page.js           # Home page
├── components/           # React components (Header, LinkItem, etc)
├── data/                 # JSON data files
│   ├── links.json        # Links and catalog data
│   ├── stats.json        # Analytics data
│   └── config.json       # Logo and configuration
├── public/
│   └── uploads/          # User uploaded files
├── Dockerfile            # Production Docker config
├── docker-compose.yml    # Docker Compose config
├── middleware.js         # Auth middleware for /admin
└── next.config.mjs       # Next.js configuration
```

## API Endpoints

### Links Management
- `GET /api/links` - Fetch all links
- `POST /api/links` - Create new link
- `DELETE /api/links?id=ID` - Delete link

### Tracking & Analytics
- `GET /api/track` - Get analytics
- `POST /api/track` - Record page view/click

### File Upload
- `POST /api/upload` - Upload file (PDF, image)

### Configuration
- `GET /api/config` - Get site configuration (logo, branding)
- `POST /api/config` - Update configuration

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

## Environment Variables

Create `.env.local` if needed:

```env
# Optional: customize admin credentials
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
