# Environment Variables Guide

This document explains all environment variables used in the CliffCooks pottery store application.

## Quick Start

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your actual values (see sections below)

3. For Vercel deployment, add variables via Dashboard or CLI:
   ```bash
   vercel env add VITE_FIREBASE_API_KEY
   ```

---

## Environment Variables Reference

### Firebase Configuration (Required)

#### Core Firebase Variables
These are copied from Firebase Console → Project Settings.

| Variable | Value | Notes |
|----------|-------|-------|
| `VITE_FIREBASE_API_KEY` | Your Firebase API Key | Found in Firebase Console → Settings → API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | `affluence-arena.firebaseapp.com` | Your Firebase Auth domain |
| `VITE_FIREBASE_PROJECT_ID` | `affluence-arena` | Your Firebase Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | `affluence-arena.firebasestorage.app` | Cloud Storage bucket name |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `145865834673` | Sender ID for Cloud Messaging |
| `VITE_FIREBASE_APP_ID` | `1:145865834673:web:...` | Firebase app identifier |

#### Firestore Database (REQUIRED)
**Critical:** Without this, Firestore queries will fail.

| Variable | Value | Notes |
|----------|-------|-------|
| `VITE_FIREBASE_DATABASE_ID` | `ai-studio-artisanalpottery-97eea235-8260-4d94-bcb8-63c7dfbb20b6` | Firestore database ID |

**Where to find it:**
1. Firebase Console → Firestore Database
2. Click on your database
3. Copy the database ID from the URL or settings

### Google OAuth Configuration (Required for Login)

| Variable | Value | Notes |
|----------|-------|-------|
| `VITE_OAUTH_CLIENT_ID` | `xxx.apps.googleusercontent.com` | Google OAuth 2.0 Client ID |

**Where to find it:**
1. Google Cloud Console → APIs & Services → Credentials
2. Find "OAuth 2.0 Client IDs" (Web application)
3. Copy the Client ID
4. Ensure authorized redirect URIs include your domain

**Authorized Redirect URIs (Google Cloud Console):**
- Development: `http://localhost:5173`, `http://localhost:3000`, `http://127.0.0.1:5173`
- Production: `https://yourdomain.com`, `https://www.yourdomain.com`

**Authorized JavaScript Origins:**
- Development: `http://localhost:5173`, `http://localhost:3000`
- Production: `https://yourdomain.com`

---

### Email Service Configuration (Optional but Recommended)

#### SendGrid
For order confirmation, shipping updates, newsletter subscriptions, restock alerts.

| Variable | Value | Notes |
|----------|-------|-------|
| `SENDGRID_API_KEY` | Your SendGrid API Key | Used by Vercel Functions `/api/send-email` |
| `VITE_SENDGRID_API_KEY` | Your SendGrid API Key | Client-side reference (optional) |
| `SENDER_EMAIL` | `noreply@cliffcooks.com` | Email "From" address |

**Where to find SendGrid API Key:**
1. SendGrid Dashboard → Settings → API Keys
2. Create new API key with "Full Access" or "Mail Send" permission
3. Copy and save securely

#### Alternative: Resend
```
RESEND_API_KEY=your_resend_api_key_here
```

---

### Analytics Configuration (Optional)

#### Firebase Analytics
| Variable | Value | Notes |
|----------|-------|-------|
| `VITE_FIREBASE_MEASUREMENT_ID` | Your Measurement ID | Firebase Analytics tracking |

**Where to find it:**
1. Firebase Console → Analytics → Settings
2. Look for "Measurement ID" (usually starts with `G-`)

#### Google Analytics
| Variable | Value | Notes |
|----------|-------|-------|
| `VITE_GOOGLE_ANALYTICS_ID` | Your GA ID | Google Analytics 4 Measurement ID |

---

### Application Configuration

| Variable | Default | Notes |
|----------|---------|-------|
| `NODE_ENV` | `development` | Environment: `development`, `production`, or `staging` |
| `VITE_APP_URL` | `http://localhost:5173` | Your application URL (for Vercel: your deployment URL) |
| `VITE_API_BASE_URL` | `http://localhost:5173` | Base URL for API function calls |

**Vercel Deployment:**
- Set `VITE_APP_URL` to: `https://yourdomain.com` or `https://yourproject.vercel.app`
- API functions will automatically use this for self-referential URLs

---

### Feature Flags (Optional)

Control feature availability across environments:

| Variable | Default | Purpose |
|----------|---------|---------|
| `VITE_ENABLE_ANALYTICS` | `true` | Enable analytics tracking |
| `VITE_ENABLE_NEWSLETTER` | `true` | Enable newsletter signup |
| `VITE_ENABLE_REVIEWS` | `true` | Enable product reviews |
| `VITE_ENABLE_WISHLIST` | `true` | Enable wishlist feature |
| `VITE_ENABLE_RESERVATIONS` | `true` | Enable product reservations |
| `VITE_ENABLE_ADMIN_CONSOLE` | `true` | Enable admin dashboard |

**Usage in code:**
```typescript
if (import.meta.env.VITE_ENABLE_REVIEWS) {
  // Show reviews component
}
```

---

### Development & Debugging (Development Only)

| Variable | Default | Purpose |
|----------|---------|---------|
| `VITE_DEBUG_MODE` | `false` | Enable debug logging |
| `VITE_DEBUG_AUTH` | `false` | Enable auth debug panel |
| `FIREBASE_EMULATOR_HOST` | (unset) | Firebase Emulator for local testing |

---

## Environment by Deployment Type

### Local Development (.env.local)

```env
# Firebase (required)
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=affluence-arena.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=affluence-arena
VITE_FIREBASE_STORAGE_BUCKET=affluence-arena.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=145865834673
VITE_FIREBASE_APP_ID=1:145865834673:web:e24c8d6fc69e89bb4ae290
VITE_FIREBASE_DATABASE_ID=ai-studio-artisanalpottery-97eea235-8260-4d94-bcb8-63c7dfbb20b6

# Google OAuth
VITE_OAUTH_CLIENT_ID=your_oauth_client_id.apps.googleusercontent.com

# Email (optional)
SENDGRID_API_KEY=your_sendgrid_key
SENDER_EMAIL=noreply@cliffcooks.com

# App
NODE_ENV=development
VITE_APP_URL=http://localhost:5173
VITE_API_BASE_URL=http://localhost:5173

# Debug
VITE_DEBUG_MODE=false
```

### Vercel Production

Set these via Vercel Dashboard → Settings → Environment Variables:

```
VITE_FIREBASE_API_KEY = ***
VITE_FIREBASE_AUTH_DOMAIN = affluence-arena.firebaseapp.com
VITE_FIREBASE_PROJECT_ID = affluence-arena
VITE_FIREBASE_STORAGE_BUCKET = affluence-arena.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID = 145865834673
VITE_FIREBASE_APP_ID = 1:145865834673:web:e24c8d6fc69e89bb4ae290
VITE_FIREBASE_DATABASE_ID = ai-studio-artisanalpottery-97eea235-8260-4d94-bcb8-63c7dfbb20b6
VITE_OAUTH_CLIENT_ID = your_oauth_client_id.apps.googleusercontent.com
SENDGRID_API_KEY = ***
SENDER_EMAIL = noreply@cliffcooks.com
VITE_APP_URL = https://yourdomain.com
VITE_API_BASE_URL = https://yourdomain.com
NODE_ENV = production
VITE_ENABLE_ANALYTICS = true
VITE_ENABLE_NEWSLETTER = true
VITE_ENABLE_REVIEWS = true
VITE_ENABLE_WISHLIST = true
VITE_ENABLE_RESERVATIONS = true
VITE_ENABLE_ADMIN_CONSOLE = true
VITE_DEBUG_MODE = false
```

### Vercel Preview/Staging

Same as production, but optionally with:
```
VITE_DEBUG_MODE = true
VITE_DEBUG_AUTH = true
```

---

## Managing Variables in Vercel

### Via Vercel Dashboard

1. Go to Project Settings → Environment Variables
2. Click "Add New"
3. Enter variable name and value
4. Select target environments (Production, Preview, Development)
5. Save

### Via Vercel CLI

**List all variables:**
```bash
vercel env ls
```

**Add a variable:**
```bash
vercel env add VITE_FIREBASE_API_KEY
# Prompts for value and environment
```

**Pull from Vercel to local:**
```bash
vercel env pull .env.local
```

**Push from local to Vercel:**
```bash
vercel env push
# Pushes from .env.local to Vercel environment
```

### Best Practice: Use .env Gitignore

Make sure `.env.local` and `.env` are in `.gitignore`:

```bash
# .gitignore
.env
.env.local
.env.*.local
```

Never commit actual credentials to git.

---

## Troubleshooting

### Variables Not Loading Locally

1. Restart dev server: `npm run dev`
2. Check file is named `.env.local` (not `.env`)
3. Verify variables start with `VITE_` (client-side)
4. Check for typos in variable names

### Firebase Not Working in Production

1. Verify `VITE_FIREBASE_DATABASE_ID` is set in Vercel
2. Check Firebase Console → Authentication → Sign-in methods (enabled)
3. Verify OAuth redirect URIs in Google Cloud Console
4. Check CORS settings if API calls fail

### Google Sign-In Failing

1. Verify `VITE_OAUTH_CLIENT_ID` matches Google Cloud Console
2. Check authorized redirect URIs include your Vercel domain
3. Verify OAuth consent screen is configured
4. Clear browser cache and try again

### Email Service Not Working

1. Verify `SENDGRID_API_KEY` is set in Vercel
2. Check SendGrid has "Mail Send" permission enabled
3. Verify `SENDER_EMAIL` is authorized in SendGrid
4. Check Vercel Function logs for errors

---

## Security Best Practices

- ✅ Never commit `.env.local` to git
- ✅ Use strong, unique Firebase API keys
- ✅ Restrict OAuth credentials to your domains only
- ✅ Keep SendGrid API keys private (no commits)
- ✅ Use Vercel's encrypted environment variables
- ✅ Rotate API keys periodically
- ✅ Use different credentials for dev/staging/production
- ✅ Monitor Firebase/Google Cloud for suspicious activity

---

## Reference

- [Firebase Console](https://console.firebase.google.com/)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [SendGrid API Keys](https://app.sendgrid.com/settings/api_keys)
- [Vite Env Variables](https://vitejs.dev/guide/env-and-mode.html)

**Last Updated:** 2026-10-09
