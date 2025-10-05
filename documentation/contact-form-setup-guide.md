# Contact Form Setup Guide

## Quick Setup Instructions

This guide will help you configure the contact form with email notifications and reCAPTCHA protection.

## Prerequisites

- Firebase project set up (from Phase 5)
- Access to Gmail account (or other SMTP provider)
- Google account for reCAPTCHA

---

## Step 1: Configure Email (Nodemailer + Gmail)

### Option A: Using Gmail with App Password (Recommended)

1. **Enable 2-Step Verification on your Google Account**:
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable "2-Step Verification"

2. **Create an App Password**:
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and your device
   - Copy the 16-character password

3. **Add to `.env.local`**:
   ```bash
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   ADMIN_EMAIL=your-email@gmail.com
   ```

### Option B: Using SendGrid (Alternative)

1. **Sign up for SendGrid**: [sendgrid.com](https://sendgrid.com)
2. **Create API Key**: Settings > API Keys
3. **Add to `.env.local`**:
   ```bash
   EMAIL_HOST=smtp.sendgrid.net
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=apikey
   EMAIL_PASSWORD=your-sendgrid-api-key
   ADMIN_EMAIL=your-email@example.com
   ```

### Option C: Using Mailgun (Alternative)

1. **Sign up for Mailgun**: [mailgun.com](https://mailgun.com)
2. **Get SMTP credentials**: Sending > Domain Settings
3. **Add to `.env.local`**:
   ```bash
   EMAIL_HOST=smtp.mailgun.org
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your-mailgun-username
   EMAIL_PASSWORD=your-mailgun-password
   ADMIN_EMAIL=your-email@example.com
   ```

---

## Step 2: Configure Google reCAPTCHA v3

### Get reCAPTCHA Keys

1. **Go to reCAPTCHA Admin Console**:
   - Visit [google.com/recaptcha/admin](https://www.google.com/recaptcha/admin)
   - Sign in with your Google account

2. **Register a new site**:
   - **Label**: "Portfolio Contact Form"
   - **reCAPTCHA type**: Choose **reCAPTCHA v3**
   - **Domains**:
     - Add `localhost` for development
     - Add your production domain (e.g., `yourportfolio.com`)
   - Accept terms and submit

3. **Copy your keys**:
   - **Site Key**: Shows as "reCAPTCHA site key" (public, used in frontend)
   - **Secret Key**: Shows as "reCAPTCHA secret key" (private, used in backend)

### Add Keys to Environment Variables

Add to `.env.local`:
```bash
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-site-key-here
RECAPTCHA_SECRET_KEY=your-secret-key-here
```

⚠️ **Important**:
- `NEXT_PUBLIC_*` variables are exposed to the browser (safe for site key)
- Secret key should NEVER be committed to Git or exposed to browser

---

## Step 3: Test the Contact Form

### Test Locally

1. **Start development server**:
   ```bash
   npm run dev
   ```

2. **Navigate to contact section**:
   - Go to `http://localhost:3000/#contact`

3. **Fill out and submit form**:
   - Enter your name, email, subject, and message
   - Click "Send Message"

4. **Verify success**:
   - Should redirect to `/contact/thank-you`
   - Check your email inbox for confirmation
   - Check admin email for notification
   - Verify message appears in admin dashboard at `/admin/messages`

### Test Rate Limiting

1. **Submit form 3 times rapidly**
2. **4th submission should fail** with "Too many requests" error
3. **Wait 15 minutes** for rate limit to reset

### Test Spam Protection

1. **Try with low quality input** (random characters)
   - reCAPTCHA v3 runs in background
   - Low score submissions may be rejected

---

## Step 4: Deploy to Production

### Update Environment Variables

1. **Firebase Hosting**: Add environment variables in Firebase Console
2. **Vercel**: Add in Project Settings > Environment Variables
3. **Netlify**: Add in Site Settings > Build & Deploy > Environment

### Update reCAPTCHA Domains

1. Go back to [reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Click on your site key
3. Add production domain to allowed domains list

---

## Troubleshooting

### Email Not Sending

**Check console logs**:
```bash
# Look for these messages
Email not configured. Skipping admin notification.
Email not configured. Skipping user confirmation.
```

**Common issues**:
- ❌ Wrong SMTP credentials → Verify EMAIL_USER and EMAIL_PASSWORD
- ❌ Gmail blocks login → Enable "Less secure app access" or use App Password
- ❌ Port blocked → Try port 465 with `EMAIL_SECURE=true`

**Test email manually**:
```javascript
// In browser console on /admin page
fetch('/api/messages', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    subject: 'Test Subject',
    message: 'Test message'
  })
})
```

### reCAPTCHA Not Working

**Check console logs**:
```bash
# Look for this message
reCAPTCHA site key not configured. reCAPTCHA will be disabled.
```

**Common issues**:
- ❌ Wrong site key → Verify `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- ❌ Domain not whitelisted → Add domain to reCAPTCHA console
- ❌ Using v2 keys with v3 → Ensure you created v3 keys

**Verify reCAPTCHA is loaded**:
```javascript
// In browser console
window.grecaptcha // Should exist if loaded
```

### Rate Limiting Not Working

**Common issues**:
- ❌ Server restarted → In-memory rate limiter resets on restart
- ❌ Multiple server instances → Use Redis for production
- ❌ IP not detected → Check X-Forwarded-For header in logs

**Check rate limit status**:
```javascript
// Submit form and check response headers
X-RateLimit-Limit: 3
X-RateLimit-Remaining: 2
X-RateLimit-Reset: 2024-01-15T10:30:00.000Z
```

---

## Security Best Practices

### Environment Variables

✅ **DO**:
- Store secrets in `.env.local` (never commit)
- Use different keys for development and production
- Rotate keys periodically

❌ **DON'T**:
- Commit `.env.local` to Git
- Share secret keys publicly
- Use same keys across environments

### Email Configuration

✅ **DO**:
- Use App Passwords for Gmail
- Configure SPF/DKIM for better deliverability
- Monitor email delivery rates

❌ **DON'T**:
- Use your main password
- Enable "less secure apps" (deprecated)
- Send emails from untrusted domains

### reCAPTCHA Configuration

✅ **DO**:
- Use reCAPTCHA v3 (invisible)
- Set appropriate score threshold (0.5 is balanced)
- Monitor scores and adjust as needed

❌ **DON'T**:
- Use reCAPTCHA v2 (requires user interaction)
- Set threshold too high (0.9+) - blocks real users
- Set threshold too low (0.1-) - allows bots

---

## Optional: Advanced Configuration

### Rate Limiting with Redis (Production)

For multi-server deployments, use Redis:

```typescript
// lib/rate-limiter.ts
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
})

// Update checkRateLimit to use Redis
```

### Email Templates Customization

Edit `src/lib/email.ts` to customize:
- Email design/styling
- Admin notification format
- User confirmation message
- Sender name and reply-to address

### reCAPTCHA Score Adjustment

Edit `src/app/api/messages/route.ts`:

```typescript
// Change threshold from 0.5 to your preferred value
const recaptchaResult = await verifyRecaptchaWithScore(recaptchaToken, 0.7)
```

**Score Guidelines**:
- `0.9`: Very strict (may block real users)
- `0.7`: Strict (good for high-risk forms)
- `0.5`: Balanced (recommended default)
- `0.3`: Lenient (allows more submissions)

---

## Testing Checklist

Before going live, test:

- [ ] Form submission with valid data
- [ ] Form validation (empty fields, invalid email)
- [ ] Email notifications (admin and user)
- [ ] reCAPTCHA verification
- [ ] Rate limiting (submit 4 times)
- [ ] Thank you page redirect
- [ ] Admin dashboard message display
- [ ] Mobile responsive design
- [ ] Theme switching (light/dark)
- [ ] Error handling (network errors)

---

## Support

If you encounter issues:

1. Check Firebase logs for errors
2. Review Next.js console for warnings
3. Verify environment variables are set correctly
4. Test with curl/Postman to isolate frontend vs backend issues

## Related Documentation

- [Phase 7.2 Implementation Summary](./phase-7.2-contact-form-integration.md)
- [Firebase Setup Guide](./firebase-setup-guide.md)
- [API Routes Documentation](../src/app/api/README.md)
