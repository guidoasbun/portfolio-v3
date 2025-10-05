# Environment Variables Reference

Complete reference for all environment variables used in the portfolio application.

## Table of Contents

- [Overview](#overview)
- [Quick Setup](#quick-setup)
- [Client-Side Variables](#client-side-variables)
- [Server-Side Variables](#server-side-variables)
- [Service-Specific Configuration](#service-specific-configuration)
- [Environment Files](#environment-files)
- [Security Best Practices](#security-best-practices)
- [Validation](#validation)

---

## Overview

The application uses environment variables for:
- Firebase configuration (client & server)
- Email notifications (SMTP)
- Security (reCAPTCHA)
- Admin authentication
- Application settings

### Variable Types

| Prefix | Scope | Exposure | Example |
|--------|-------|----------|---------|
| `NEXT_PUBLIC_*` | Client & Server | ✅ Public (in browser) | `NEXT_PUBLIC_FIREBASE_API_KEY` |
| No prefix | Server only | 🔒 Private | `FIREBASE_ADMIN_PRIVATE_KEY` |

**Important**: Never use `NEXT_PUBLIC_` prefix for secrets!

---

## Quick Setup

### Step 1: Copy Example File

```bash
cp .env.example .env.local
```

### Step 2: Fill Required Variables

See [Service-Specific Configuration](#service-specific-configuration) for getting each value.

### Step 3: Verify Setup

```bash
npm run typecheck
npm run build
```

---

## Client-Side Variables

These variables are prefixed with `NEXT_PUBLIC_` and are **exposed to the browser**.

### Firebase Client SDK

#### `NEXT_PUBLIC_FIREBASE_API_KEY`
- **Required**: ✅ Yes
- **Type**: String
- **Description**: Firebase Web API key (safe to expose)
- **Where to get**: Firebase Console → Project Settings → General
- **Example**: `AIzaSyD...`

#### `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- **Required**: ✅ Yes
- **Type**: String
- **Description**: Firebase Auth domain
- **Format**: `your-project.firebaseapp.com`
- **Example**: `portfolio-abc123.firebaseapp.com`

#### `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- **Required**: ✅ Yes
- **Type**: String
- **Description**: Firebase project ID
- **Example**: `portfolio-abc123`

#### `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- **Required**: ✅ Yes
- **Type**: String
- **Description**: Firebase Storage bucket
- **Format**: `your-project.appspot.com`
- **Example**: `portfolio-abc123.appspot.com`

#### `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- **Required**: ✅ Yes
- **Type**: String (numeric)
- **Description**: Firebase Cloud Messaging sender ID
- **Example**: `123456789012`

#### `NEXT_PUBLIC_FIREBASE_APP_ID`
- **Required**: ✅ Yes
- **Type**: String
- **Description**: Firebase App ID
- **Example**: `1:123456789012:web:abc123def456`

#### `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
- **Required**: ⚠️ Optional (but recommended for Analytics)
- **Type**: String
- **Description**: Google Analytics measurement ID
- **Example**: `G-XXXXXXXXXX`
- **Note**: Only needed if using Firebase Analytics

### Admin Configuration

#### `NEXT_PUBLIC_ADMIN_UID`
- **Required**: ✅ Yes
- **Type**: String
- **Description**: Firebase UID of admin user
- **Where to get**: Firebase Console → Authentication → Users → [Your User] → Copy UID
- **Example**: `xYz123AbC456DeF789`
- **Note**: Also update in `firestore.rules` and `storage.rules`

### Application Settings

#### `NEXT_PUBLIC_SITE_URL`
- **Required**: ✅ Yes
- **Type**: String (URL)
- **Description**: Application base URL
- **Development**: `http://localhost:3000`
- **Production**: `https://yourdomain.com`
- **Note**: Used for sitemap, OG tags, redirects

### reCAPTCHA

#### `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- **Required**: ⚠️ Optional (but recommended)
- **Type**: String
- **Description**: Google reCAPTCHA v3 site key (public)
- **Where to get**: [reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
- **Example**: `6Lc...`
- **Note**: Must be v3 (not v2)

---

## Server-Side Variables

These variables are **private** and only accessible on the server.

### Firebase Admin SDK

#### `FIREBASE_ADMIN_PROJECT_ID`
- **Required**: ✅ Yes
- **Type**: String
- **Description**: Firebase project ID for Admin SDK
- **Same as**: `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- **Example**: `portfolio-abc123`

#### `FIREBASE_ADMIN_CLIENT_EMAIL`
- **Required**: ✅ Yes
- **Type**: String (email)
- **Description**: Firebase service account email
- **Where to get**: Firebase Console → Project Settings → Service Accounts → Generate new private key
- **Format**: `firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com`
- **Example**: `firebase-adminsdk-12ab@portfolio-abc123.iam.gserviceaccount.com`

#### `FIREBASE_ADMIN_PRIVATE_KEY`
- **Required**: ✅ Yes
- **Type**: String (multi-line)
- **Description**: Firebase service account private key
- **Where to get**: Same as CLIENT_EMAIL (in downloaded JSON file)
- **Format**: Must include `\n` for newlines
- **Example**:
  ```
  "-----BEGIN PRIVATE KEY-----\nMIIEvgIBA...long key...\n-----END PRIVATE KEY-----\n"
  ```
- **⚠️ CRITICAL**: Never expose this! Keep it server-side only!

### Email (SMTP) Configuration

#### `EMAIL_HOST`
- **Required**: ✅ Yes (for contact form)
- **Type**: String (hostname)
- **Description**: SMTP server hostname
- **Examples**:
  - Gmail: `smtp.gmail.com`
  - SendGrid: `smtp.sendgrid.net`
  - Mailgun: `smtp.mailgun.org`
  - Outlook: `smtp-mail.outlook.com`

#### `EMAIL_PORT`
- **Required**: ✅ Yes
- **Type**: String (numeric)
- **Description**: SMTP server port
- **Values**:
  - `587` - TLS (recommended)
  - `465` - SSL
  - `25` - Plain (not recommended)
- **Example**: `587`

#### `EMAIL_SECURE`
- **Required**: ✅ Yes
- **Type**: String (`true`/`false`)
- **Description**: Use TLS/SSL
- **Values**:
  - `false` - Port 587 (STARTTLS)
  - `true` - Port 465 (SSL)
- **Example**: `false`

#### `EMAIL_USER`
- **Required**: ✅ Yes
- **Type**: String (email)
- **Description**: SMTP authentication username
- **Usually**: Your email address
- **Example**: `your-email@gmail.com`

#### `EMAIL_PASSWORD`
- **Required**: ✅ Yes
- **Type**: String
- **Description**: SMTP authentication password
- **For Gmail**: Use [App Password](https://myaccount.google.com/apppasswords), not regular password
- **Example**: `abcd efgh ijkl mnop` (16-char App Password)
- **⚠️ CRITICAL**: Never commit this to Git!

#### `ADMIN_EMAIL`
- **Required**: ✅ Yes
- **Type**: String (email)
- **Description**: Email to receive contact form submissions
- **Example**: `admin@yourdomain.com`
- **Note**: Can be same as EMAIL_USER

### reCAPTCHA Secret

#### `RECAPTCHA_SECRET_KEY`
- **Required**: ⚠️ Optional (but recommended)
- **Type**: String
- **Description**: Google reCAPTCHA v3 secret key (private)
- **Where to get**: [reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
- **Example**: `6Lc...`
- **⚠️ CRITICAL**: Keep this secret! Server-side only!
- **Note**: Must match the site key

---

## Service-Specific Configuration

### Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project"
   - Follow wizard

2. **Get Client Config**
   - Project Settings → General
   - Scroll to "Your apps"
   - Click web icon `</>`
   - Copy config values

3. **Get Admin SDK Credentials**
   - Project Settings → Service Accounts
   - Click "Generate new private key"
   - Download JSON file
   - Extract values:
     ```json
     {
       "project_id": "→ FIREBASE_ADMIN_PROJECT_ID",
       "client_email": "→ FIREBASE_ADMIN_CLIENT_EMAIL",
       "private_key": "→ FIREBASE_ADMIN_PRIVATE_KEY"
     }
     ```

4. **Get Admin UID**
   - Authentication → Users tab
   - Add user with email/password
   - Click on user
   - Copy UID

### Email (Gmail) Setup

1. **Enable 2-Step Verification**
   - Go to [Google Account](https://myaccount.google.com/)
   - Security → 2-Step Verification
   - Turn on

2. **Create App Password**
   - Security → App Passwords
   - Select app: "Mail"
   - Select device: "Other" (enter "Portfolio App")
   - Click "Generate"
   - Copy 16-character password

3. **Set Variables**
   ```bash
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=abcd efgh ijkl mnop  # App Password
   ADMIN_EMAIL=your-email@gmail.com
   ```

### reCAPTCHA v3 Setup

1. **Register Site**
   - Go to [reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
   - Click "+" to add new site
   - Label: "Portfolio Contact Form"
   - reCAPTCHA type: **v3**
   - Domains:
     - `localhost` (for dev)
     - `yourdomain.com` (for prod)

2. **Get Keys**
   - Copy "Site key" → `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
   - Copy "Secret key" → `RECAPTCHA_SECRET_KEY`

---

## Environment Files

### Development (`.env.local`)

```bash
# Firebase Client (from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=portfolio-abc123.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=portfolio-abc123
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=portfolio-abc123.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Firebase Admin (from service account JSON)
FIREBASE_ADMIN_PROJECT_ID=portfolio-abc123
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk@portfolio-abc123.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Admin
NEXT_PUBLIC_ADMIN_UID=xYz123AbC456
ADMIN_EMAIL=admin@example.com

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop

# reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Lc...
RECAPTCHA_SECRET_KEY=6Lc...

# Application
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Production (`.env.production`)

Same as `.env.local` but update:

```bash
# Change localhost to production domain
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### CI/CD (GitHub Secrets)

Add each variable as a secret:
1. GitHub repo → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add each variable

Required secrets:
- All `NEXT_PUBLIC_*` variables
- All server-side variables
- Plus: `FIREBASE_TOKEN` (from `firebase login:ci`)

---

## Security Best Practices

### ✅ DO

- ✅ Use `.env.local` for local development
- ✅ Add `.env.local` to `.gitignore`
- ✅ Use strong, unique passwords
- ✅ Rotate credentials regularly
- ✅ Use environment-specific values
- ✅ Validate all env vars on startup
- ✅ Use Firebase App Check (production)
- ✅ Enable Firebase Security Rules
- ✅ Use HTTPS in production
- ✅ Keep dependencies updated

### ❌ DON'T

- ❌ Commit `.env.local` to Git
- ❌ Use `NEXT_PUBLIC_` for secrets
- ❌ Share credentials in plain text
- ❌ Use same password for multiple services
- ❌ Disable security features in production
- ❌ Use weak passwords
- ❌ Leave default/example values
- ❌ Expose admin credentials

### Private Key Security

**Firebase Admin Private Key** is the most sensitive:

```bash
# ❌ WRONG - Exposes in browser
NEXT_PUBLIC_FIREBASE_ADMIN_KEY="..."

# ✅ CORRECT - Server-side only
FIREBASE_ADMIN_PRIVATE_KEY="..."
```

**Format**:
- Must include `\n` for line breaks
- Must be wrapped in quotes
- Must start with `-----BEGIN PRIVATE KEY-----\n`
- Must end with `\n-----END PRIVATE KEY-----\n`

---

## Validation

### Runtime Validation

The app validates env vars on startup. Check console for errors:

```typescript
// In lib/firebase/config.ts
if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  throw new Error('Missing NEXT_PUBLIC_FIREBASE_API_KEY')
}
```

### Manual Validation

```bash
# Check if all vars are set
node -e "
  const required = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'FIREBASE_ADMIN_PRIVATE_KEY',
    'EMAIL_HOST',
    // ... add all required vars
  ];
  const missing = required.filter(v => !process.env[v]);
  if (missing.length) {
    console.error('Missing:', missing);
    process.exit(1);
  }
  console.log('✓ All required vars set');
"
```

### Test Configuration

```bash
# Test Firebase connection
npm run dev
# Check browser console and terminal for Firebase errors

# Test email
# Submit contact form and check:
# 1. Terminal logs for email sending
# 2. Your inbox for admin notification
# 3. Submitter's inbox for confirmation

# Test reCAPTCHA
# Submit contact form and check:
# 1. Browser console for reCAPTCHA score
# 2. Submission success (score should be > 0.5)
```

---

## Troubleshooting

### Issue: Firebase initialization failed

**Cause**: Missing or invalid Firebase config

**Solution**:
1. Verify all `NEXT_PUBLIC_FIREBASE_*` vars are set
2. Check Firebase Console for correct values
3. Ensure no extra quotes or spaces
4. Restart dev server

### Issue: Admin operations fail

**Cause**: Invalid Admin SDK credentials

**Solution**:
1. Re-download service account JSON
2. Verify `FIREBASE_ADMIN_PRIVATE_KEY` format:
   - Contains `\n` (not actual newlines)
   - Wrapped in quotes
   - Starts with `-----BEGIN PRIVATE KEY-----\n`
3. Check `FIREBASE_ADMIN_CLIENT_EMAIL` matches JSON

### Issue: Emails not sending

**Cause**: Invalid SMTP credentials

**Solution**:
1. For Gmail: Use App Password, not regular password
2. Verify `EMAIL_HOST` and `EMAIL_PORT`
3. Check `EMAIL_SECURE` matches port (false=587, true=465)
4. Test credentials with:
   ```bash
   node -e "require('nodemailer').createTransport({
     host: process.env.EMAIL_HOST,
     port: process.env.EMAIL_PORT,
     auth: {
       user: process.env.EMAIL_USER,
       pass: process.env.EMAIL_PASSWORD
     }
   }).verify().then(console.log).catch(console.error)"
   ```

### Issue: reCAPTCHA fails

**Cause**: Invalid keys or wrong version

**Solution**:
1. Verify using v3 keys (not v2)
2. Check domain is whitelisted in reCAPTCHA console
3. Ensure `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` matches `RECAPTCHA_SECRET_KEY`
4. Check browser console for reCAPTCHA errors

### Issue: Build fails with env var errors

**Cause**: Missing required variables

**Solution**:
1. Copy `.env.example` to `.env.local`
2. Fill all required variables
3. Run `npm run typecheck`
4. Check for typos in variable names

---

## Reference Files

- `.env.example` - Template with all variables
- `src/lib/firebase/config.ts` - Client SDK initialization
- `src/lib/firebase/admin.ts` - Admin SDK initialization
- `src/lib/email.ts` - Email configuration
- `src/lib/recaptcha.ts` - reCAPTCHA configuration

---

## Quick Reference Table

| Variable | Required | Scope | Get From |
|----------|----------|-------|----------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | ✅ | Client | Firebase Console |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | ✅ | Client | Firebase Console |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | ✅ | Client | Firebase Console |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | ✅ | Client | Firebase Console |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | ✅ | Client | Firebase Console |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | ✅ | Client | Firebase Console |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | ⚠️ | Client | Firebase Console |
| `FIREBASE_ADMIN_PROJECT_ID` | ✅ | Server | Service Account JSON |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | ✅ | Server | Service Account JSON |
| `FIREBASE_ADMIN_PRIVATE_KEY` | ✅ | Server | Service Account JSON |
| `NEXT_PUBLIC_ADMIN_UID` | ✅ | Client | Firebase Auth Users |
| `ADMIN_EMAIL` | ✅ | Server | Your choice |
| `EMAIL_HOST` | ✅ | Server | Email provider |
| `EMAIL_PORT` | ✅ | Server | Email provider |
| `EMAIL_SECURE` | ✅ | Server | Email provider |
| `EMAIL_USER` | ✅ | Server | Email provider |
| `EMAIL_PASSWORD` | ✅ | Server | Email provider |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | ⚠️ | Client | reCAPTCHA Console |
| `RECAPTCHA_SECRET_KEY` | ⚠️ | Server | reCAPTCHA Console |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Client | Your domain |

**Legend**:
- ✅ Required
- ⚠️ Optional but recommended

---

**Last Updated**: Phase 8.6 - Documentation Complete
