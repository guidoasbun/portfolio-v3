# Deployment Guide

Complete guide for deploying the portfolio application to Firebase Hosting with Cloud Functions.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Firebase Hosting Setup](#firebase-hosting-setup)
- [Environment Variables Configuration](#environment-variables-configuration)
- [Build and Deploy](#build-and-deploy)
- [CI/CD with GitHub Actions](#cicd-with-github-actions)
- [Custom Domain Setup](#custom-domain-setup)
- [Post-Deployment Verification](#post-deployment-verification)
- [Troubleshooting](#troubleshooting)

---

## Overview

This portfolio application deploys to:
- **Firebase Hosting**: Static assets and client-side app
- **Cloud Functions (Gen 2)**: API routes and server-side rendering
- **Firebase Storage**: Images and PDF files
- **Firestore**: Database
- **Firebase Authentication**: Admin authentication

### Architecture

```
┌─────────────────┐
│  Firebase       │
│  Hosting (CDN)  │
│                 │
│  Static Files   │
│  Client App     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Cloud          │
│  Functions      │
│  (Gen 2)        │
│                 │
│  API Routes     │
│  SSR Pages      │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│  Firebase Services          │
│                             │
│  • Firestore (Database)     │
│  • Storage (Files)          │
│  • Authentication           │
│  • Analytics                │
└─────────────────────────────┘
```

---

## Prerequisites

### Required

1. **Node.js 18+** and npm installed
2. **Firebase account** (free tier works)
3. **Firebase CLI** installed globally
   ```bash
   npm install -g firebase-tools
   ```
4. **Git** installed
5. **Firebase project** created (see [Firebase Setup Guide](./firebase-setup-guide.md))

### Recommended

- **GitHub account** for CI/CD
- **Custom domain** (optional)
- **Gmail account** for SMTP (or SendGrid/Mailgun)
- **Google reCAPTCHA v3** keys

---

## Pre-Deployment Checklist

### 1. Verify Build Success

```bash
# Run type checking
npm run typecheck

# Run linting
npm run lint

# Build for production
npm run build
```

All commands should complete without errors.

### 2. Environment Variables

Ensure all required environment variables are set in `.env.local`:

```bash
# Firebase (both client and server)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# Firebase Admin SDK (server-only)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

# Admin configuration
NEXT_PUBLIC_ADMIN_UID=
ADMIN_EMAIL=

# Email (SMTP)
EMAIL_HOST=
EMAIL_PORT=
EMAIL_SECURE=
EMAIL_USER=
EMAIL_PASSWORD=

# reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=

# Application
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### 3. Firebase Security Rules

Ensure security rules are deployed:

```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules
firebase deploy --only storage:rules
```

### 4. Test Locally

```bash
# Start development server
npm run dev

# Test all features:
# - Authentication
# - CRUD operations
# - Contact form
# - File uploads
# - Theme switching
# - 3D animations
```

---

## Firebase Hosting Setup

### Step 1: Login to Firebase

```bash
firebase login
```

This opens a browser for authentication.

### Step 2: Initialize Firebase

```bash
firebase init
```

Select the following options:

1. **Features**:
   - ✅ Hosting
   - ✅ Functions
   - ✅ Firestore
   - ✅ Storage

2. **Project Setup**:
   - Use existing project
   - Select your Firebase project

3. **Firestore Setup**:
   - Use existing rules: `firestore.rules`
   - Skip Firestore indexes (or use `firestore.indexes.json` if exists)

4. **Storage Setup**:
   - Use existing rules: `storage.rules`

5. **Functions Setup**:
   - Language: **TypeScript** (if prompted)
   - Use existing code
   - Install dependencies: **Yes**

6. **Hosting Setup**:
   - Public directory: `out` (for Next.js export) or `.next` (for hybrid)
   - Configure as SPA: **No**
   - Set up automatic builds: **No** (we'll use GitHub Actions)
   - Overwrite files: **No**

### Step 3: Configure firebase.json

Create or update `firebase.json`:

```json
{
  "hosting": {
    "public": "out",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "/api/**",
        "function": "nextjsServer"
      },
      {
        "source": "**",
        "function": "nextjsServer"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp|avif)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      }
    ]
  },
  "functions": {
    "source": "functions",
    "runtime": "nodejs18",
    "gen": 2
  },
  "firestore": {
    "rules": "firestore.rules"
  },
  "storage": {
    "rules": "storage.rules"
  }
}
```

### Step 4: Configure .firebaserc

Create `.firebaserc`:

```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

Replace `your-project-id` with your Firebase project ID.

---

## Environment Variables Configuration

### Step 1: Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Functions** → **Configuration**

### Step 2: Set Environment Variables

```bash
# Set Firebase config (example)
firebase functions:config:set \
  firebase.project_id="your-project-id" \
  firebase.client_email="firebase-adminsdk@your-project.iam.gserviceaccount.com" \
  firebase.private_key="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Set email config
firebase functions:config:set \
  email.host="smtp.gmail.com" \
  email.port="587" \
  email.user="your-email@gmail.com" \
  email.password="your-app-password"

# Set reCAPTCHA config
firebase functions:config:set \
  recaptcha.secret_key="your-secret-key"

# Set admin config
firebase functions:config:set \
  admin.uid="your-admin-uid" \
  admin.email="your-admin@example.com"
```

### Step 3: Verify Configuration

```bash
firebase functions:config:get
```

### Alternative: Using .env files

For Next.js environment variables, create `.env.production`:

```bash
# Copy from .env.local
cp .env.local .env.production

# Update NEXT_PUBLIC_SITE_URL
# Change localhost:3000 to your production domain
```

---

## Build and Deploy

### Step 1: Build for Production

```bash
# Clean previous builds
rm -rf .next out

# Build with Turbopack
npm run build
```

Verify build output:
- ✅ No TypeScript errors
- ✅ No ESLint warnings
- ✅ Bundle size < 500KB (target)
- ✅ All routes generated

### Step 2: Test Production Build Locally

```bash
# Using Firebase emulators
firebase emulators:start

# Or using Next.js
npm start
```

Test at `http://localhost:5000` (Firebase) or `http://localhost:3000` (Next.js)

### Step 3: Deploy to Firebase

```bash
# Deploy everything
firebase deploy

# Or deploy specific services:
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

### Step 4: Verify Deployment

```bash
# Get hosting URL
firebase hosting:channel:list

# Open in browser
open https://your-project.web.app
```

---

## CI/CD with GitHub Actions

### Step 1: Initialize GitHub Actions

```bash
firebase init hosting:github
```

Answer the prompts:
1. GitHub repository: `your-username/portfolio`
2. Set up workflow for pull requests: **Yes**
3. Set up automatic deployment on merge: **Yes**
4. Overwrite existing workflows: **No** (if you have custom workflows)

### Step 2: Add Firebase Token

```bash
# Generate token
firebase login:ci
```

Copy the token and add to GitHub:
1. Go to GitHub repository
2. Settings → Secrets and variables → Actions
3. New repository secret
4. Name: `FIREBASE_TOKEN`
5. Value: [paste token]

### Step 3: Add Environment Secrets

Add all environment variables as GitHub secrets:

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
FIREBASE_ADMIN_PROJECT_ID
FIREBASE_ADMIN_CLIENT_EMAIL
FIREBASE_ADMIN_PRIVATE_KEY
EMAIL_HOST
EMAIL_USER
EMAIL_PASSWORD
RECAPTCHA_SECRET_KEY
NEXT_PUBLIC_RECAPTCHA_SITE_KEY
NEXT_PUBLIC_ADMIN_UID
ADMIN_EMAIL
```

### Step 4: Workflow File

GitHub Actions creates `.github/workflows/firebase-hosting-merge.yml`:

```yaml
name: Deploy to Firebase Hosting on merge
on:
  push:
    branches:
      - main

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Create .env.production
        run: |
          echo "NEXT_PUBLIC_FIREBASE_API_KEY=${{ secrets.NEXT_PUBLIC_FIREBASE_API_KEY }}" >> .env.production
          echo "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${{ secrets.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN }}" >> .env.production
          # ... add all environment variables

      - name: Build
        run: npm run build

      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: your-project-id
```

### Step 5: Test CI/CD

```bash
# Make a change
git add .
git commit -m "Test CI/CD deployment"
git push origin main

# Check GitHub Actions tab for deployment status
```

---

## Custom Domain Setup

### Step 1: Add Domain in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. **Hosting** → **Add custom domain**
4. Enter your domain (e.g., `yourdomain.com`)
5. Click **Continue**

### Step 2: Verify Domain Ownership

Add the TXT record to your domain's DNS:

```
Type: TXT
Name: @
Value: [Firebase provides this]
TTL: 3600
```

Wait for verification (can take up to 24 hours).

### Step 3: Configure DNS Records

Add A records to point to Firebase:

```
Type: A
Name: @
Value: [Firebase IP addresses]
TTL: 3600
```

For `www` subdomain:

```
Type: CNAME
Name: www
Value: your-project.web.app
TTL: 3600
```

### Step 4: SSL Certificate

Firebase automatically provisions an SSL certificate via Let's Encrypt. This can take up to 24 hours.

### Step 5: Update Environment Variables

```bash
# Update .env.production
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Redeploy
firebase deploy
```

### Step 6: Verify HTTPS

```bash
# Test
curl -I https://yourdomain.com

# Should see:
# HTTP/2 200
# strict-transport-security: max-age=31536000
```

---

## Post-Deployment Verification

### 1. Functional Testing

- [ ] Home page loads correctly
- [ ] All sections visible (Hero, About, Projects, Experience, Skills, Contact)
- [ ] Theme switching works (dark/light/system)
- [ ] 3D animations render properly
- [ ] Contact form submits successfully
- [ ] Admin login works
- [ ] Admin CRUD operations work
- [ ] File uploads work (images, PDFs)
- [ ] Resume download works
- [ ] Email notifications sent

### 2. Performance Testing

```bash
# Lighthouse audit
npx lighthouse https://yourdomain.com --view

# Check metrics:
# - Performance: 90+
# - Accessibility: 95+
# - Best Practices: 95+
# - SEO: 95+
```

### 3. Security Testing

- [ ] HTTPS enforced (no HTTP access)
- [ ] Security headers present
- [ ] Firebase rules protect data
- [ ] Admin routes protected
- [ ] API authentication works
- [ ] Rate limiting active
- [ ] reCAPTCHA working

### 4. SEO Verification

- [ ] Submit sitemap to Google Search Console
  ```
  https://yourdomain.com/sitemap.xml
  ```
- [ ] Verify robots.txt
  ```
  https://yourdomain.com/robots.txt
  ```
- [ ] Check Open Graph tags
- [ ] Verify structured data

### 5. Monitoring Setup

```bash
# Enable Firebase monitoring
firebase monitoring:enable

# Check in Firebase Console:
# - Hosting metrics
# - Function logs
# - Firestore usage
# - Storage usage
# - Authentication logs
```

---

## Troubleshooting

### Build Errors

**Error**: `Type error: ...`

**Solution**:
```bash
npm run typecheck
# Fix TypeScript errors
npm run build
```

**Error**: `Module not found`

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Deployment Errors

**Error**: `HTTP 403 - Permission denied`

**Solution**:
```bash
firebase login --reauth
firebase use your-project-id
firebase deploy
```

**Error**: `Functions deployment failed`

**Solution**:
```bash
# Check functions logs
firebase functions:log

# Verify Node.js version
node -v  # Should be 18+

# Redeploy
firebase deploy --only functions --debug
```

### Runtime Errors

**Error**: `Firestore permission denied`

**Solution**:
1. Check Firestore rules are deployed
2. Verify admin UID in rules matches `.env`
3. Check Firebase Authentication is enabled

**Error**: `Storage permission denied`

**Solution**:
1. Check Storage rules are deployed
2. Verify authentication token
3. Check file path permissions

**Error**: `API routes return 404`

**Solution**:
1. Verify `firebase.json` rewrites
2. Check Functions are deployed
3. Ensure `nextjsServer` function exists

### Email Issues

**Error**: `Email not sending`

**Solution**:
1. Verify SMTP credentials
2. Check Gmail "Less secure apps" or App Password
3. Review Functions logs:
   ```bash
   firebase functions:log --only sendContactFormEmails
   ```

### Performance Issues

**Slow page load**

**Solution**:
1. Check bundle size: `npm run analyze`
2. Verify CDN caching headers
3. Optimize images (use AVIF/WebP)
4. Check 3D particle count

**3D animations laggy**

**Solution**:
1. Reduce particle count for mobile
2. Check device capability detection
3. Verify WebGL support

---

## Maintenance

### Regular Tasks

**Weekly**:
- Check Firebase quotas
- Review error logs
- Monitor performance metrics

**Monthly**:
- Update dependencies
- Review security rules
- Check SSL certificate

**Quarterly**:
- Audit Firebase costs
- Review analytics data
- Update documentation

### Backup Strategy

```bash
# Export Firestore data
gcloud firestore export gs://your-bucket/backups/$(date +%Y%m%d)

# Export Firebase config
firebase apps:sdkconfig > firebase-config-backup.json

# Backup Storage files
gsutil -m cp -r gs://your-project.appspot.com gs://your-backup-bucket
```

### Rollback Procedure

```bash
# List hosting releases
firebase hosting:channel:list

# Rollback to previous version
firebase hosting:clone SOURCE_SITE_ID:SOURCE_CHANNEL_ID TARGET_SITE_ID:live
```

---

## Additional Resources

- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [Cloud Functions Documentation](https://firebase.google.com/docs/functions)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [GitHub Actions with Firebase](https://github.com/FirebaseExtended/action-hosting-deploy)

---

## Support

For deployment issues:
1. Check Firebase Console logs
2. Review GitHub Actions logs
3. Check Functions logs: `firebase functions:log`
4. Review [Troubleshooting](#troubleshooting) section

For feature requests or bugs:
- Open an issue on GitHub
- Check existing documentation
- Review Firebase status page

---

**Last Updated**: Phase 8.6 - Documentation Complete
