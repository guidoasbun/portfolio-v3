# AWS Route 53 to Firebase Hosting Domain Migration Guide

Complete guide for migrating your domain from Vercel to Firebase Hosting using AWS Route 53 DNS.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Step 1: Disconnect from Vercel](#step-1-disconnect-from-vercel)
- [Step 2: Add Custom Domain in Firebase](#step-2-add-custom-domain-in-firebase)
- [Step 3: Update AWS Route 53 DNS Records](#step-3-update-aws-route-53-dns-records)
- [Step 4: Verify SSL Certificate](#step-4-verify-ssl-certificate)
- [Step 5: Test and Monitor](#step-5-test-and-monitor)
- [Troubleshooting](#troubleshooting)

---

## Overview

This guide will help you migrate your domain (`guido-asbun.com`) from Vercel to Firebase Hosting while keeping AWS Route 53 as your DNS provider.

**Migration Timeline**: 1-24 hours (DNS propagation time)

### Current Setup (Before)
```
Domain: guido-asbun.com
DNS: AWS Route 53
Hosting: Vercel
```

### Target Setup (After)
```
Domain: guido-asbun.com
DNS: AWS Route 53
Hosting: Firebase Hosting
```

---

## Prerequisites

- ✅ Firebase project created and configured
- ✅ Firebase CLI installed (`npm install -g firebase-tools`)
- ✅ Access to AWS Route 53 console
- ✅ Access to Vercel dashboard
- ✅ Next.js portfolio built and tested locally

---

## Step 1: Disconnect from Vercel

### 1.1 Backup Current Deployment

1. Take screenshots of your current Vercel configuration
2. Export environment variables from Vercel dashboard
3. Note down any custom headers or rewrites

### 1.2 Remove Domain from Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your portfolio project
3. Navigate to **Settings** → **Domains**
4. Click on `guido-asbun.com`
5. Click **Remove Domain**
6. Also remove `www.guido-asbun.com` if configured
7. Confirm removal

**⚠️ WARNING**: Do not delete the Vercel project yet - keep it as a fallback until Firebase is fully working.

---

## Step 2: Add Custom Domain in Firebase

### 2.1 Login to Firebase

```bash
firebase login
```

### 2.2 Select Your Project

```bash
firebase use <your-project-id>
```

Replace `<your-project-id>` with your Firebase project ID (find it in [Firebase Console](https://console.firebase.google.com/)).

### 2.3 Add Custom Domain via Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click **Hosting** in the left sidebar
4. Click **Add custom domain**

### 2.4 Enter Your Domain

1. Enter: `guido-asbun.com`
2. Click **Continue**

### 2.5 Verify Ownership (if required)

Firebase may ask you to verify domain ownership:

1. Firebase will provide a TXT record
2. Copy the TXT record values
3. Add to AWS Route 53 (see Step 3.2)
4. Wait for verification (can take up to 24 hours)
5. Click **Verify** in Firebase Console

### 2.6 Get Firebase IP Addresses

After verification, Firebase will provide IP addresses for A records:

**Firebase Hosting IP Addresses** (these may change - check Firebase Console):
```
151.101.1.195
151.101.65.195
```

**Note**: Firebase will show the current IP addresses in the console. Write them down.

---

## Step 3: Update AWS Route 53 DNS Records

### 3.1 Access AWS Route 53

1. Log in to [AWS Console](https://console.aws.amazon.com/)
2. Navigate to **Route 53**
3. Click **Hosted zones**
4. Click on `guido-asbun.com`

### 3.2 (Optional) Add Verification TXT Record

If Firebase requires domain verification:

**Click "Create Record"**:
- **Record name**: Leave blank (or `@`)
- **Record type**: `TXT`
- **Value**: `[Firebase verification string from Step 2.5]`
- **TTL**: `300` (5 minutes)

**Click "Create records"**

Wait 5-15 minutes, then click "Verify" in Firebase Console.

### 3.3 Update A Record for Root Domain

**Find existing A record** for `guido-asbun.com`:

1. Select the A record pointing to Vercel
2. Click **Edit record**
3. Update with Firebase IP addresses:
   ```
   151.101.1.195
   151.101.65.195
   ```
   (Or the IPs shown in Firebase Console)
4. Set **TTL**: `3600` (1 hour)
5. Click **Save changes**

**If no A record exists**, click "Create record":
- **Record name**: Leave blank (or `@`)
- **Record type**: `A`
- **Value**: Firebase IP addresses (one per line)
  ```
  151.101.1.195
  151.101.65.195
  ```
- **TTL**: `3600`
- **Routing policy**: Simple routing

**Click "Create records"**

### 3.4 Update CNAME Record for WWW Subdomain

**Find existing CNAME record** for `www`:

1. Select the CNAME record for `www.guido-asbun.com`
2. Click **Edit record**
3. Update **Value** to: `guido-asbun.com` (your root domain)
4. Set **TTL**: `3600`
5. Click **Save changes**

**If no CNAME record exists**, click "Create record":
- **Record name**: `www`
- **Record type**: `CNAME`
- **Value**: `guido-asbun.com`
- **TTL**: `3600`
- **Routing policy**: Simple routing

**Click "Create records"**

### 3.5 Remove Old Vercel Records (Optional)

If you see old CNAME or A records pointing to Vercel (e.g., `cname.vercel-dns.com`):

1. **DO NOT DELETE IMMEDIATELY** - wait until Firebase is working
2. After confirming Firebase works (24-48 hours), delete old records

---

## Step 4: Verify SSL Certificate

### 4.1 Check Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Navigate to **Hosting** → **Custom domain**
3. Check the status of `guido-asbun.com`:
   - ⏳ **Pending**: Firebase is provisioning SSL certificate (can take up to 24 hours)
   - ✅ **Connected**: SSL certificate is active and domain is live

### 4.2 SSL Certificate Provisioning

Firebase automatically provisions SSL certificates via **Let's Encrypt**. This process:

- Takes 15 minutes to 24 hours
- Requires DNS records to be correctly configured
- Is completely automatic (no action required)

### 4.3 Verify HTTPS Works

Once status shows **Connected**:

```bash
# Test HTTPS
curl -I https://guido-asbun.com

# Expected response:
# HTTP/2 200
# strict-transport-security: max-age=31536000
```

---

## Step 5: Test and Monitor

### 5.1 DNS Propagation Check

Use online tools to check DNS propagation:

- [DNS Checker](https://dnschecker.org/)
- [What's My DNS](https://www.whatsmydns.net/)

Enter `guido-asbun.com` and check:
- **A record**: Should point to Firebase IPs
- **CNAME record** (www): Should point to root domain

### 5.2 Test All URLs

```bash
# Root domain
curl -I https://guido-asbun.com

# WWW subdomain
curl -I https://www.guido-asbun.com

# HTTP to HTTPS redirect
curl -I http://guido-asbun.com
# Should redirect to https://
```

### 5.3 Verify Website Functionality

1. ✅ Home page loads correctly
2. ✅ All sections visible (Hero, Projects, Experience, Skills, Contact)
3. ✅ Theme switching works
4. ✅ 3D animations render
5. ✅ Contact form submits
6. ✅ Admin login works (test at `/admin/login`)
7. ✅ Images load from Firebase Storage

### 5.4 Monitor Firebase Hosting

```bash
# View hosting status
firebase hosting:channel:list

# Check deployment logs
firebase hosting:channel:list --json
```

---

## Troubleshooting

### Issue: Domain shows "Not Found" or Vercel site

**Cause**: DNS propagation delay or incorrect records

**Solution**:
1. Verify A records in Route 53 point to Firebase IPs
2. Clear browser cache and DNS cache:
   ```bash
   # macOS
   sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder

   # Windows
   ipconfig /flushdns

   # Linux
   sudo systemd-resolve --flush-caches
   ```
3. Wait 1-24 hours for full DNS propagation
4. Use `dig` to check DNS:
   ```bash
   dig guido-asbun.com A
   ```

### Issue: SSL Certificate Pending for >24 Hours

**Cause**: DNS records not propagating or incorrect

**Solution**:
1. Verify A records are correct in Route 53
2. Check DNS propagation at [DNS Checker](https://dnschecker.org/)
3. Ensure no CAA records block Let's Encrypt
4. Contact Firebase Support if still pending after 48 hours

### Issue: "Your connection is not private" Error

**Cause**: SSL certificate not yet provisioned

**Solution**:
1. Wait for Firebase to complete SSL provisioning (up to 24 hours)
2. Check Firebase Console status
3. Do NOT click "Proceed anyway" - wait for proper SSL

### Issue: WWW Subdomain Not Working

**Cause**: CNAME record missing or incorrect

**Solution**:
1. Verify CNAME record in Route 53:
   ```
   www.guido-asbun.com → guido-asbun.com
   ```
2. Wait for DNS propagation (1-4 hours)

### Issue: Old Vercel Site Still Showing

**Cause**: Browser cache or DNS cache

**Solution**:
1. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
2. Clear browser cache
3. Try incognito/private mode
4. Test from different device/network
5. Flush DNS cache (commands above)

### Issue: Firebase Build Fails

**Cause**: TypeScript errors or missing dependencies

**Solution**:
1. Run local build:
   ```bash
   npm run build
   ```
2. Fix any errors that appear
3. Commit and push changes
4. GitHub Actions will rebuild automatically

---

## Current DNS Records (Your AWS Route 53)

Based on your screenshot, your current records are:

| Record Name | Type | Value |
|---|---|---|
| guido-asbun.com | A | `76.76.21.21` (Vercel IP) |
| guido-asbun.com | NS | Route 53 nameservers |
| guido-asbun.com | SOA | Route 53 SOA record |
| www.guido-asbun.com | CNAME | `cname.vercel-dns.com` |

**Changes needed**:
1. ✏️ Update A record to Firebase IPs
2. ✏️ Update CNAME to point to root domain
3. ➕ Add TXT record for verification (if required)

---

## Rollback Plan (If Needed)

If something goes wrong, you can quickly rollback to Vercel:

### Quick Rollback to Vercel

1. Go to AWS Route 53
2. Update A record back to: `76.76.21.21`
3. Update CNAME back to: `cname.vercel-dns.com`
4. Add domain back in Vercel dashboard
5. Wait 5-15 minutes for DNS propagation

---

## Post-Migration Checklist

After successful migration:

- [ ] Domain loads on `https://guido-asbun.com`
- [ ] WWW subdomain works (`https://www.guido-asbun.com`)
- [ ] HTTP redirects to HTTPS
- [ ] SSL certificate is valid (green padlock)
- [ ] All website functionality works
- [ ] Admin dashboard accessible
- [ ] Contact form sends emails
- [ ] Images load correctly
- [ ] 3D animations render
- [ ] Theme switching works
- [ ] Monitor Firebase usage/quotas
- [ ] Set up uptime monitoring (e.g., UptimeRobot)
- [ ] Delete old Vercel project (after 1-2 weeks)
- [ ] Update DNS TTL to 24 hours (86400) for stability

---

## Useful Commands

```bash
# Check DNS resolution
dig guido-asbun.com
dig www.guido-asbun.com

# Check HTTP headers
curl -I https://guido-asbun.com

# Firebase CLI
firebase login
firebase hosting:channel:list
firebase hosting:clone SOURCE:CHANNEL TARGET:live

# Deploy manually
firebase deploy --only hosting
```

---

## Additional Resources

- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [Firebase Custom Domain Setup](https://firebase.google.com/docs/hosting/custom-domain)
- [AWS Route 53 Documentation](https://docs.aws.amazon.com/route53/)
- [DNS Propagation Checker](https://dnschecker.org/)
- [SSL Labs SSL Test](https://www.ssllabs.com/ssltest/)

---

## Support

If you encounter issues:

1. Check Firebase Console logs
2. Check GitHub Actions logs (for CI/CD issues)
3. Check AWS Route 53 health checks
4. Review [Troubleshooting](#troubleshooting) section
5. Contact Firebase Support via Firebase Console

---

**Last Updated**: Phase 8.7 - Deployment Preparation Complete
**Migration Estimated Time**: 1-24 hours (DNS propagation)
**Downtime**: ~0-15 minutes during DNS switchover
