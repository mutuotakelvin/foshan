# 🚀 Deployment Guide for compressionsofa.store

## Current Status ✅

Your Next.js application is deployed with:
- ✅ Git repository cloned from GitHub via SSH
- ✅ Node.js v20 & dependencies installed with pnpm
- ✅ Application built for production
- ✅ PM2 running 3 instances (cluster mode) on port 3000
- ✅ Nginx reverse proxy configured on port 80
- ✅ Certbot installed and ready for SSL

## Server IP Address
```
157.173.105.31
```

## Next Steps: DNS & SSL Configuration

### Step 1: Configure DNS Records

Go to your domain registrar (where you registered compressionsofa.store) and add these DNS records:

#### A Record (IPv4)
- **Type**: A
- **Name/Host**: @ (or compressionsofa.store)
- **Value**: 157.173.105.31
- **TTL**: 3600 (or default)

#### A Record for www (optional but recommended)
- **Type**: A  
- **Name/Host**: www
- **Value**: 157.173.105.31
- **TTL**: 3600

### Step 2: Wait for DNS Propagation
DNS changes can take 5 minutes to 48 hours to propagate globally. Check with:
```bash
nslookup compressionsofa.store
```

### Step 3: Get SSL Certificate from Let's Encrypt

Once DNS is pointing to your server, run:
```bash
sudo certbot certonly --nginx \
  -d compressionsofa.store \
  -d www.compressionsofa.store \
  --email kelvinmutuota749@gmail.com \
  --agree-tos \
  --non-interactive
```

### Step 4: Update Nginx Configuration for HTTPS

After SSL certificate is generated, update Nginx config:

```bash
sudo tee /etc/nginx/sites-available/compressionsofa.store > /dev/null << 'NGINX'
upstream foshan_backend {
    server 127.0.0.1:3000;
    keepalive 64;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name compressionsofa.store www.compressionsofa.store;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name compressionsofa.store www.compressionsofa.store;

    ssl_certificate /etc/letsencrypt/live/compressionsofa.store/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/compressionsofa.store/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    location / {
        proxy_pass http://foshan_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    access_log /var/log/nginx/compressionsofa.store-access.log combined;
    error_log /var/log/nginx/compressionsofa.store-error.log warn;
}
NGINX

sudo nginx -t
sudo systemctl restart nginx
```

### Step 5: Enable SSL Auto-Renewal

```bash
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
sudo systemctl status certbot.timer
```

Test renewal:
```bash
sudo certbot renew --dry-run
```

---

## Useful Commands

### PM2 Management
```bash
pm2 list                          # Show all running apps
pm2 logs foshan                   # View app logs
pm2 restart foshan                # Restart app
pm2 stop foshan                   # Stop app
pm2 delete foshan                 # Remove app
pm2 save                          # Save current state
pm2 monit                         # Monitor in real-time
```

### Nginx Management
```bash
sudo systemctl status nginx       # Check status
sudo nginx -t                     # Test config
sudo systemctl restart nginx      # Restart Nginx
sudo tail -f /var/log/nginx/compressionsofa.store-error.log   # View errors
```

### SSL/Certificate Management
```bash
sudo certbot certificates         # List all certificates
sudo certbot renew                # Renew certificate
sudo certbot show-renewals        # Show renewal schedule
```

### Update Application from GitHub

```bash
cd /var/www/compressionsofa
git pull origin main
pnpm install
pnpm build
pm2 restart foshan
```

---

## Environment Variables

The following are configured in `.env`:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- NEXT_PUBLIC_SITE_URL
- PAYSTACK_SECRET_KEY

To update environment variables:
1. Edit `/var/www/compressionsofa/.env`
2. Rebuild: `cd /var/www/compressionsofa && pnpm build`
3. Restart: `pm2 restart foshan`

---

## Monitoring & Logs

### Application Logs
```bash
pm2 logs foshan                   # Real-time logs
cat /var/www/compressionsofa/logs/out.log  # Output log
cat /var/www/compressionsofa/logs/err.log  # Error log
```

### Nginx Logs
```bash
tail -f /var/log/nginx/compressionsofa.store-access.log
tail -f /var/log/nginx/compressionsofa.store-error.log
```

### System Resources
```bash
pm2 monit                         # CPU & Memory usage
free -h                          # Check memory
df -h                            # Check disk space
```

---

## Troubleshooting

### Application not starting?
```bash
pm2 logs foshan
pm2 restart foshan
pm2 reload foshan
```

### Nginx not responding?
```bash
sudo nginx -t
sudo systemctl restart nginx
curl -I http://localhost
```

### SSL certificate issues?
```bash
sudo certbot certificates
sudo certbot renew --dry-run
```

### Check if port 3000 is listening:
```bash
netstat -tlnp | grep 3000
```

---

## Production Checklist

- [ ] DNS records configured (A record pointing to 157.173.105.31)
- [ ] DNS propagated and working
- [ ] SSL certificate obtained from Let's Encrypt
- [ ] Nginx HTTPS configuration updated
- [ ] Website accessible via https://compressionsofa.store
- [ ] PM2 running with multiple instances
- [ ] PM2 startup configured for system reboot
- [ ] SSL auto-renewal enabled
- [ ] Logs being monitored
- [ ] Backups of database/data configured

---

## Support

For issues or questions:
1. Check the logs first: `pm2 logs foshan`
2. Test Nginx: `sudo nginx -t && sudo systemctl status nginx`
3. Check DNS: `nslookup compressionsofa.store`
4. Review system resources: `pm2 monit`

---

**Deployment Date**: 2025-10-17  
**Server IP**: 157.173.105.31  
**Application**: Next.js Furniture Store (Compression Sofa)  
**Process Manager**: PM2 (3 instances)  
**Web Server**: Nginx  
