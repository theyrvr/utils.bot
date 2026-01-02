# Deployment Guide for Utils.Bot

This guide covers deploying Utils.Bot to production environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [Database Setup](#database-setup)
4. [Deployment Methods](#deployment-methods)
5. [Production Checklist](#production-checklist)
6. [Monitoring](#monitoring)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required
- Node.js 18 or higher
- PostgreSQL 14 or higher
- Discord Bot Token with proper intents
- Domain name (for production frontend)

### Recommended
- Docker and Docker Compose
- Reverse proxy (nginx/Caddy)
- SSL certificate
- Process manager (PM2)

## Environment Configuration

### Backend Environment Variables

Create `backend/.env`:

```env
# Discord Configuration (REQUIRED)
DISCORD_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_client_id_here
DISCORD_GUILD_ID=your_guild_id_here

# Database (REQUIRED)
DATABASE_URL="postgresql://user:password@localhost:5432/ticketbot?schema=public"

# Server Configuration
PORT=3001
API_URL=https://api.yourdomain.com
FRONTEND_URL=https://dashboard.yourdomain.com

# Bot Configuration (Optional)
TICKET_CATEGORY_ID=your_category_id
LOG_CHANNEL_ID=your_log_channel_id
TRANSCRIPT_CHANNEL_ID=your_transcript_channel_id

# Environment
NODE_ENV=production
```

### Frontend Environment Variables

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_GUILD_ID=your_guild_id_here
```

## Database Setup

### PostgreSQL Installation

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**Using Docker:**
```bash
docker run -d \
  --name ticketbot-postgres \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_DB=ticketbot \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:15-alpine
```

### Database Creation

```sql
CREATE DATABASE ticketbot;
CREATE USER ticketbot WITH ENCRYPTED PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE ticketbot TO ticketbot;
```

### Schema Migration

```bash
cd backend
npm run prisma:generate
npm run prisma:push
```

## Deployment Methods

### Method 1: Docker Compose (Recommended)

**Advantages:**
- Easy deployment
- Isolated environment
- Includes database
- Auto-restart

**Steps:**

1. Clone repository:
```bash
git clone https://github.com/theyrvr/utils.bot.git
cd utils.bot
```

2. Configure environment:
```bash
cp .env.example .env
nano .env  # Edit with your values
```

3. Start services:
```bash
docker-compose up -d
```

4. Check logs:
```bash
docker-compose logs -f
```

5. Access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### Method 2: PM2 Process Manager

**Advantages:**
- Native performance
- Process monitoring
- Log management
- Auto-restart

**Steps:**

1. Install PM2:
```bash
npm install -g pm2
```

2. Setup backend:
```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:push
npm run build
```

3. Create PM2 config `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [
    {
      name: 'ticketbot-backend',
      cwd: './backend',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    },
    {
      name: 'ticketbot-frontend',
      cwd: './frontend',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    }
  ]
};
```

4. Start with PM2:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Method 3: VPS/Cloud Server

**Ubuntu 22.04 Example:**

1. Update system:
```bash
sudo apt update && sudo apt upgrade -y
```

2. Install Node.js:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

3. Install PostgreSQL:
```bash
sudo apt install -y postgresql postgresql-contrib
```

4. Clone and setup:
```bash
git clone https://github.com/theyrvr/utils.bot.git
cd utils.bot
./setup.sh
```

5. Configure nginx as reverse proxy:
```nginx
# /etc/nginx/sites-available/ticketbot

# Frontend
server {
    listen 80;
    server_name dashboard.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
    }
}
```

6. Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/ticketbot /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

7. Setup SSL with Let's Encrypt:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d dashboard.yourdomain.com -d api.yourdomain.com
```

### Method 4: Cloud Platforms

#### Heroku

**Backend:**
```bash
cd backend
heroku create ticketbot-api
heroku addons:create heroku-postgresql:mini
heroku config:set DISCORD_TOKEN=your_token
git push heroku main
```

**Frontend:**
```bash
cd frontend
vercel --prod
```

#### Railway

1. Connect GitHub repository
2. Add PostgreSQL service
3. Configure environment variables
4. Deploy automatically on push

#### DigitalOcean App Platform

1. Connect repository
2. Add database component
3. Configure environment
4. Deploy

## Production Checklist

### Security
- [ ] Change default passwords
- [ ] Use environment variables for secrets
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up firewall rules
- [ ] Use webhook secrets
- [ ] Regular security updates

### Performance
- [ ] Enable PostgreSQL connection pooling
- [ ] Configure caching
- [ ] Optimize database queries
- [ ] Set up CDN for frontend
- [ ] Enable gzip compression
- [ ] Monitor memory usage

### Reliability
- [ ] Set up automatic backups
- [ ] Configure log rotation
- [ ] Enable auto-restart
- [ ] Set up health checks
- [ ] Configure rate limiting
- [ ] Test disaster recovery

### Monitoring
- [ ] Set up error tracking
- [ ] Monitor server resources
- [ ] Track API response times
- [ ] Monitor Discord bot uptime
- [ ] Set up alerting
- [ ] Log aggregation

## Monitoring

### Application Logs

**PM2 Logs:**
```bash
pm2 logs ticketbot-backend
pm2 logs ticketbot-frontend
```

**Docker Logs:**
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

**Winston Logs:**
```bash
tail -f backend/logs/combined.log
tail -f backend/logs/error.log
```

### Database Monitoring

```bash
# Connect to database
psql -U ticketbot -d ticketbot

# Check connections
SELECT count(*) FROM pg_stat_activity;

# Check database size
SELECT pg_size_pretty(pg_database_size('ticketbot'));
```

### System Monitoring

**Using htop:**
```bash
sudo apt install htop
htop
```

**Using PM2:**
```bash
pm2 monit
```

## Backup Strategy

### Database Backups

**Manual Backup:**
```bash
pg_dump -U ticketbot ticketbot > backup_$(date +%Y%m%d).sql
```

**Automated Backup Script:**
```bash
#!/bin/bash
# /usr/local/bin/backup-ticketbot.sh

BACKUP_DIR="/var/backups/ticketbot"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

pg_dump -U ticketbot ticketbot | gzip > $BACKUP_DIR/ticketbot_$DATE.sql.gz

# Keep only last 7 days
find $BACKUP_DIR -name "ticketbot_*.sql.gz" -mtime +7 -delete
```

**Cron Job:**
```bash
# Daily backup at 2 AM
0 2 * * * /usr/local/bin/backup-ticketbot.sh
```

### Restore from Backup

```bash
gunzip < backup.sql.gz | psql -U ticketbot ticketbot
```

## Troubleshooting

### Bot Not Starting

1. Check Discord token:
```bash
echo $DISCORD_TOKEN
```

2. Verify intents are enabled in Discord Developer Portal

3. Check logs:
```bash
tail -f backend/logs/error.log
```

### Database Connection Issues

1. Test connection:
```bash
psql $DATABASE_URL
```

2. Check PostgreSQL is running:
```bash
sudo systemctl status postgresql
```

3. Verify connection string format

### Frontend Not Loading

1. Check backend is running:
```bash
curl http://localhost:3001/health
```

2. Verify environment variables:
```bash
cat frontend/.env.local
```

3. Check build:
```bash
cd frontend
npm run build
```

### Memory Issues

1. Monitor memory:
```bash
pm2 monit
```

2. Increase memory limit:
```javascript
// In ecosystem.config.js
max_memory_restart: '2G'
```

3. Check for memory leaks in logs

## Scaling

### Horizontal Scaling

1. Use load balancer (nginx/HAProxy)
2. Run multiple backend instances
3. Use Redis for session storage
4. Share database across instances

### Database Scaling

1. Enable connection pooling
2. Add read replicas
3. Implement caching (Redis)
4. Optimize slow queries

## Maintenance

### Regular Tasks

**Daily:**
- Check error logs
- Monitor disk space
- Verify backups

**Weekly:**
- Review performance metrics
- Check for updates
- Clean old logs

**Monthly:**
- Security audit
- Update dependencies
- Review database size
- Test backup restore

### Updates

```bash
# Pull latest changes
git pull origin main

# Backend
cd backend
npm install
npm run prisma:generate
npm run build
pm2 restart ticketbot-backend

# Frontend
cd frontend
npm install
npm run build
pm2 restart ticketbot-frontend
```

## Support

For deployment issues:
1. Check logs first
2. Review this guide
3. Consult main README
4. Open GitHub issue

---

Happy deploying! 🚀
