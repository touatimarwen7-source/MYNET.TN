# 🚀 Deployment Guide - MyNet.tn

## Overview

Complete guide for deploying MyNet.tn to production environments.

---

## 📋 Prerequisites

### Required

- Node.js 20+
- PostgreSQL 15+ (or Neon PostgreSQL)
- Redis 7+
- Docker & Docker Compose (recommended)

### Optional

- Nginx (for reverse proxy)
- SSL Certificate (for HTTPS)
- Domain name

---

## 🐳 Docker Deployment (Recommended)

### Quick Start

```bash
# 1. Clone repository
git clone https://github.com/touatimarwen7-source/MYNET.TN.git
cd MYNET.TN

# 2. Setup environment variables
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit .env files with your configuration

# 3. Start services
docker-compose up -d

# 4. Check logs
docker-compose logs -f
```

### Services

- **PostgreSQL** - Port 5432
- **Redis** - Port 6379
- **Backend API** - Port 3000
- **Frontend** - Port 5000
- **Nginx** (production) - Ports 80, 443

---

## 📦 Manual Deployment

### Backend Deployment

```bash
cd backend

# 1. Install dependencies
npm install --production

# 2. Setup environment
cp .env.example .env
# Edit .env with your configuration

# 3. Run database migrations
npm run migrate

# 4. Start server
npm start
```

### Frontend Deployment

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your configuration

# 3. Build for production
npm run build

# 4. Serve with Nginx or similar
# The dist/ folder contains the built files
```

---

## 🌐 Production Deployment

### Step 1: Environment Setup

Create production `.env` files:

**backend/.env**:
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db?ssl=true
JWT_SECRET=your_production_secret_32_chars_minimum
JWT_REFRESH_SECRET=your_production_refresh_secret_32_chars_minimum
FRONTEND_URL=https://mynet.tn
SENTRY_DSN=your_sentry_dsn
SENTRY_ENVIRONMENT=production
```

**frontend/.env**:
```env
VITE_NODE_ENV=production
VITE_API_URL=https://api.mynet.tn
VITE_APP_URL=https://mynet.tn
VITE_SENTRY_DSN=your_sentry_dsn
VITE_SENTRY_ENVIRONMENT=production
```

### Step 2: Build Applications

```bash
# Build backend (if needed)
cd backend
npm install --production

# Build frontend
cd ../frontend
npm install
npm run build
```

### Step 3: Deploy with Docker

```bash
# Build images
docker-compose build

# Start with production profile
docker-compose --profile production up -d
```

---

## 🔒 Security Checklist

Before deploying to production:

- [ ] Change all default passwords
- [ ] Set strong JWT secrets (32+ characters)
- [ ] Enable SSL/TLS
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable security headers
- [ ] Configure Sentry for error tracking
- [ ] Set up backup strategy
- [ ] Review environment variables
- [ ] Test database connection

---

## 📊 Monitoring Setup

### Sentry Configuration

1. Create Sentry project
2. Get DSN
3. Add to `.env` files:
   ```env
   SENTRY_DSN=https://xxx@sentry.io/xxx
   SENTRY_ENVIRONMENT=production
   ```

### Logging

- Logs stored in `backend/logs/`
- Rotate logs daily
- Monitor error logs

---

## 🔄 Database Migration

### Running Migrations

```bash
cd backend
npm run migrate
```

### Creating Migrations

Migrations are in `backend/migrations/`:
- `create_indexes.js` - Database indexes
- `add_performance_indexes.js` - Performance indexes

---

## 🔄 Backup & Recovery

### Automated Backups

Backups run automatically via `BackupScheduler`:
- Daily backups at 2 AM
- Stored in `backend/backups/`
- Retention: 30 days (configurable)

### Manual Backup

```bash
cd backend
node scripts/backup.js
```

### Restore Backup

```bash
cd backend
node scripts/restore.js backup_file.sql
```

---

## 🚨 Troubleshooting

### Backend won't start

1. Check environment variables
2. Verify database connection
3. Check port availability
4. Review logs: `backend/logs/app.log`

### Frontend build fails

1. Check Node.js version (20+)
2. Clear node_modules and reinstall
3. Check environment variables
4. Review build errors

### Database connection issues

1. Verify DATABASE_URL format
2. Check database accessibility
3. Verify SSL settings
4. Test connection manually

---

## 📚 Additional Resources

- [Architecture Guide](../architecture/README.md)
- [Development Guide](../development/README.md)
- [Docker Documentation](https://docs.docker.com/)

---

**Last Updated**: 2025-12-04

