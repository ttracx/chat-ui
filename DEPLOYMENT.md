# VibeCaaSChat Deployment Guide

This guide covers deploying both the web application and iOS application to production.

## Table of Contents

- [Web App Deployment](#web-app-deployment)
  - [Environment Setup](#environment-setup)
  - [Docker Deployment](#docker-deployment)
  - [Kubernetes Deployment](#kubernetes-deployment)
  - [Manual Deployment](#manual-deployment)
- [iOS App Deployment](#ios-app-deployment)
  - [App Store Preparation](#app-store-preparation)
  - [TestFlight Beta](#testflight-beta)
  - [App Store Submission](#app-store-submission)
- [Database Setup](#database-setup)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

## Web App Deployment

### Environment Setup

#### Production Environment Variables

Create `.env.production`:

```env
# MongoDB
MONGODB_URL=mongodb://your-production-mongodb:27017
MONGODB_DB_NAME=vibecaas-chat-prod
MONGODB_DIRECT_CONNECTION=false

# AI Provider
OPENAI_BASE_URL=https://router.huggingface.co/v1
OPENAI_API_KEY=your_production_api_key

# App Configuration
PUBLIC_APP_NAME=VibeCaaSChat
PUBLIC_APP_ASSETS=chatui
PUBLIC_APP_DESCRIPTION="AI-powered conversations as a service"
PUBLIC_ORIGIN=https://your-domain.com
PUBLIC_SHARE_PREFIX=https://your-domain.com/r

# Authentication
OPENID_CLIENT_ID=your_client_id
OPENID_CLIENT_SECRET=your_client_secret
OPENID_PROVIDER_URL=https://your-oauth-provider.com
OPENID_SCOPES="openid profile email"

# Cookies & Security
COOKIE_NAME=vibecaas-session
COOKIE_SECURE=true
COOKIE_SAMESITE=strict

# Rate Limiting
USAGE_LIMITS={"conversations":100,"messages":1000,"messagesPerMinute":10}

# Features
LLM_SUMMARIZATION=true
ENABLE_DATA_EXPORT=true
ALLOW_IFRAME=false

# Monitoring
LOG_LEVEL=info
PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
PUBLIC_PLAUSIBLE_SCRIPT_URL=https://plausible.io/js/script.js

# Admin
ADMIN_TOKEN=your_secure_admin_token
ADMIN_API_SECRET=your_admin_api_secret
```

### Docker Deployment

#### 1. Build Docker Image

```bash
# Build the image
docker build -t vibecaas-chat:latest \
  --build-arg APP_BASE="" \
  --build-arg PUBLIC_COMMIT_SHA=$(git rev-parse HEAD) \
  .

# Tag for registry
docker tag vibecaas-chat:latest your-registry.com/vibecaas-chat:latest

# Push to registry
docker push your-registry.com/vibecaas-chat:latest
```

#### 2. Run with Docker Compose

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:5
    restart: always
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: vibecaas-chat
    ports:
      - "27017:27017"

  vibecaas:
    image: your-registry.com/vibecaas-chat:latest
    restart: always
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
    depends_on:
      - mongodb

  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./certs:/etc/nginx/certs
    depends_on:
      - vibecaas

volumes:
  mongodb_data:
```

Run:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Kubernetes Deployment

#### 1. Prepare Helm Values

Edit `chart/env/prod.yaml`:

```yaml
replicaCount: 3

image:
  repository: your-registry.com/vibecaas-chat
  tag: latest
  pullPolicy: Always

service:
  type: ClusterIP
  port: 3000

ingress:
  enabled: true
  className: nginx
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
  hosts:
    - host: chat.your-domain.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: vibecaas-tls
      hosts:
        - chat.your-domain.com

resources:
  limits:
    cpu: 2000m
    memory: 2Gi
  requests:
    cpu: 500m
    memory: 512Mi

autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70

mongodb:
  enabled: false  # Use external MongoDB
  uri: mongodb://mongodb-service:27017/vibecaas-chat

env:
  - name: PUBLIC_ORIGIN
    value: "https://chat.your-domain.com"
  - name: OPENAI_API_KEY
    valueFrom:
      secretKeyRef:
        name: vibecaas-secrets
        key: openai-api-key
```

#### 2. Deploy to Kubernetes

```bash
# Create namespace
kubectl create namespace vibecaas

# Create secrets
kubectl create secret generic vibecaas-secrets \
  --from-literal=openai-api-key=your_api_key \
  --from-literal=mongodb-url=your_mongodb_url \
  -n vibecaas

# Install with Helm
helm install vibecaas-chat ./chart \
  --namespace vibecaas \
  --values ./chart/env/prod.yaml

# Check deployment
kubectl get pods -n vibecaas
kubectl logs -f deployment/vibecaas-chat -n vibecaas
```

#### 3. Update Deployment

```bash
# Update image
helm upgrade vibecaas-chat ./chart \
  --namespace vibecaas \
  --values ./chart/env/prod.yaml \
  --set image.tag=v1.1.0

# Rollback if needed
helm rollback vibecaas-chat -n vibecaas
```

### Manual Deployment

For VPS or bare metal:

```bash
# On your server
git clone <repository-url> /opt/vibecaas-chat
cd /opt/vibecaas-chat

# Install dependencies
npm ci --production

# Build
npm run build

# Create systemd service
sudo nano /etc/systemd/system/vibecaas.service
```

Service file:
```ini
[Unit]
Description=VibeCaaSChat Service
After=network.target mongodb.service

[Service]
Type=simple
User=vibecaas
WorkingDirectory=/opt/vibecaas-chat
EnvironmentFile=/opt/vibecaas-chat/.env.production
ExecStart=/usr/bin/node build/index.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable vibecaas
sudo systemctl start vibecaas
sudo systemctl status vibecaas
```

### Nginx Configuration

Create `/etc/nginx/sites-available/vibecaas`:

```nginx
server {
    listen 80;
    server_name chat.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name chat.your-domain.com;

    ssl_certificate /etc/letsencrypt/live/chat.your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/chat.your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # SSE support
        proxy_buffering off;
        proxy_read_timeout 300s;
    }
}
```

Enable and reload:
```bash
sudo ln -s /etc/nginx/sites-available/vibecaas /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## iOS App Deployment

### App Store Preparation

#### 1. Configure Project

In Xcode:

1. Select project → General tab
2. Update Bundle Identifier: `com.yourcompany.vibecaas`
3. Set Version: `1.0.0`
4. Set Build: `1`
5. Update Team under Signing & Capabilities

#### 2. Update APIClient Base URL

Edit `ios/VibeCaaSChat/Services/APIClient.swift`:

```swift
init(baseURL: String = "https://chat.your-domain.com") {
    self.baseURL = baseURL
    // ...
}
```

#### 3. Prepare App Icons

Replace placeholder icons in `Assets.xcassets/AppIcon.appiconset/`:
- Icon-1024.png (1024x1024)
- Icon-60@3x.png (180x180)
- Icon-60@2x.png (120x120)
- Icon-40@3x.png (120x120)
- Icon-40@2x.png (80x80)
- Icon-29@3x.png (87x87)
- Icon-29@2x.png (58x58)
- Icon-20@3x.png (60x60)
- Icon-20@2x.png (40x40)

#### 4. Configure Info.plist

Ensure required keys:
```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <false/>
    <!-- Only if needed for specific domains -->
</dict>
```

### TestFlight Beta

#### 1. Archive the App

1. Select "Any iOS Device" scheme
2. Product → Archive
3. Wait for archive to complete

#### 2. Upload to App Store Connect

1. Window → Organizer
2. Select latest archive
3. Click "Distribute App"
4. Choose "App Store Connect"
5. Select "Upload"
6. Follow prompts

#### 3. Configure TestFlight

In App Store Connect:

1. Go to TestFlight tab
2. Add build
3. Add internal testers
4. Add external testers (requires review)
5. Send invite

### App Store Submission

#### 1. Prepare Metadata

In App Store Connect:

**App Information:**
- Name: VibeCaaSChat
- Subtitle: AI Conversations
- Category: Productivity
- Content Rights: (Your content rights info)

**Pricing:**
- Free (or your pricing)

**App Privacy:**
- Data Collection: Define what data you collect
- Privacy Policy URL: https://your-domain.com/privacy

#### 2. Prepare Screenshots

Required sizes:
- 6.7" (iPhone 14 Pro Max): 1290 x 2796
- 6.5" (iPhone 11 Pro Max): 1242 x 2688
- 5.5" (iPhone 8 Plus): 1242 x 2208
- iPad Pro (12.9"): 2048 x 2732

Take screenshots of:
- Chat interface
- Conversation list
- Model selection
- Settings

#### 3. Submit for Review

1. Fill all required information
2. Add screenshots
3. Set release options (Automatic/Manual)
4. Submit for review
5. Wait for approval (typically 1-3 days)

## Database Setup

### MongoDB Production Setup

#### MongoDB Atlas (Recommended)

1. Create account at mongodb.com
2. Create new cluster
3. Configure network access
4. Create database user
5. Get connection string
6. Update MONGODB_URL in .env

#### Self-Hosted MongoDB

```bash
# Install MongoDB 5
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start service
sudo systemctl start mongod
sudo systemctl enable mongod

# Create database and user
mongo
> use vibecaas-chat
> db.createUser({
    user: "vibecaas",
    pwd: "secure_password",
    roles: ["readWrite"]
  })
```

### Database Indexes

Create indexes for performance:

```javascript
// In MongoDB shell
use vibecaas-chat

// Conversations
db.conversations.createIndex({ userId: 1, updatedAt: -1 })
db.conversations.createIndex({ sessionId: 1, updatedAt: -1 })

// Settings
db.settings.createIndex({ userId: 1 })
db.settings.createIndex({ sessionId: 1 })

// Users
db.users.createIndex({ username: 1 }, { unique: true })
db.users.createIndex({ email: 1 }, { unique: true })
```

## Monitoring

### Health Checks

```bash
# Web app health
curl https://chat.your-domain.com/healthcheck

# MongoDB health
mongo --eval "db.adminCommand('ping')"
```

### Logging

**Application Logs:**
```bash
# Docker
docker logs vibecaas-chat

# Kubernetes
kubectl logs -f deployment/vibecaas-chat -n vibecaas

# Systemd
journalctl -u vibecaas -f
```

**MongoDB Logs:**
```bash
tail -f /var/log/mongodb/mongod.log
```

### Metrics

Use monitoring tools:
- Prometheus + Grafana
- Datadog
- New Relic
- CloudWatch (AWS)

Example Prometheus config:
```yaml
scrape_configs:
  - job_name: 'vibecaas'
    static_configs:
      - targets: ['vibecaas-chat:3000']
```

## Troubleshooting

### Web App Issues

**Build Fails:**
```bash
# Clear cache
rm -rf .svelte-kit build node_modules
npm install
npm run build
```

**Database Connection Error:**
- Check MONGODB_URL
- Verify MongoDB is running
- Check network connectivity
- Review firewall rules

**High Memory Usage:**
- Increase container limits
- Check for memory leaks
- Review logs for errors

### iOS App Issues

**Archive Failed:**
- Clean build folder (Cmd + Shift + K)
- Check code signing
- Verify provisioning profiles
- Update Xcode

**Upload to App Store Failed:**
- Check bundle ID matches App Store Connect
- Verify signing certificates
- Check entitlements
- Review Xcode organizer logs

**TestFlight Build Processing:**
- Wait (can take 10-60 minutes)
- Check email for issues
- Review App Store Connect for errors

### General Issues

**API Connection Failed:**
1. Check backend is running
2. Verify URLs are correct
3. Check CORS settings
4. Review network logs

**Authentication Not Working:**
1. Verify OAuth configuration
2. Check redirect URLs
3. Review cookie settings
4. Check HTTPS setup

**Performance Issues:**
1. Enable caching
2. Add CDN
3. Optimize database queries
4. Scale horizontally

## Security Checklist

- [ ] HTTPS enabled
- [ ] Secure cookies (httpOnly, secure, sameSite)
- [ ] Environment variables not committed
- [ ] Database authentication enabled
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Input validation on all endpoints
- [ ] SQL injection protection
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Regular security updates
- [ ] Monitoring and alerts enabled
- [ ] Backups configured
- [ ] Secrets properly stored (not in code)

## Backup Strategy

### Database Backups

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="$MONGODB_URL" --out="/backups/mongodb_$DATE"
find /backups -mtime +30 -delete  # Keep 30 days
```

### Application Backups

- Code: Git repository
- Environment: Secure vault (1Password, Vault, etc.)
- Database: Automated daily backups
- Files: S3 or similar storage

## Rollback Plan

### Web App Rollback

**Docker:**
```bash
docker pull your-registry.com/vibecaas-chat:previous-tag
docker-compose up -d
```

**Kubernetes:**
```bash
helm rollback vibecaas-chat -n vibecaas
```

**Manual:**
```bash
git checkout previous-version-tag
npm ci --production
npm run build
sudo systemctl restart vibecaas
```

### iOS App Rollback

1. Go to App Store Connect
2. Select previous version
3. Submit to App Store
4. Cannot roll back TestFlight builds

## Support

- Web App Logs: Check application logs
- iOS App: Check crash reports in Xcode Organizer
- Database: Review MongoDB logs
- Infrastructure: Check server/cluster metrics

---

**Last Updated:** 2025-10-19
