# Vercel Environment Variables Setup Guide

Complete step-by-step guide to setting up environment variables for the CliffCooks pottery store on Vercel.

## Quick Setup (5 minutes)

### Option 1: Using Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Authenticate:**
   ```bash
   vercel login
   ```

3. **Link to project:**
   ```bash
   vercel link
   # Select your existing Vercel project
   ```

4. **Pull current environment:**
   ```bash
   vercel env pull .env.local
   ```

5. **Add missing variables:**
   ```bash
   vercel env add VITE_FIREBASE_API_KEY
   vercel env add VITE_OAUTH_CLIENT_ID
   vercel env add SENDGRID_API_KEY
   # ... etc
   ```

6. **Redeploy:**
   ```bash
   vercel deploy --prod
   ```

### Option 2: Using Vercel Dashboard

1. Go to **Vercel Project Dashboard**
2. Settings → **Environment Variables**
3. Click **Add New**
4. Enter each variable (see table below)
5. Trigger a redeploy

---

## Required Environment Variables for Vercel

These variables **must** be set for production deployments:

### Firebase Configuration

```
VITE_FIREBASE_API_KEY = <your_firebase_api_key>
VITE_FIREBASE_AUTH_DOMAIN = affluence-arena.firebaseapp.com
VITE_FIREBASE_PROJECT_ID = affluence-arena
VITE_FIREBASE_STORAGE_BUCKET = affluence-arena.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID = 145865834673
VITE_FIREBASE_APP_ID = 1:145865834673:web:e24c8d6fc69e89bb4ae290
VITE_FIREBASE_DATABASE_ID = ai-studio-artisanalpottery-97eea235-8260-4d94-bcb8-63c7dfbb20b6
```

**How to get Firebase values:**
1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select project: `affluence-arena`
3. Click ⚙️ Settings → Project Settings
4. Copy values from "Your apps" section

### Google OAuth

```
VITE_OAUTH_CLIENT_ID = <your_client_id>.apps.googleusercontent.com
```

**How to get OAuth Client ID:**
1. Open [Google Cloud Console](https://console.cloud.google.com/)
2. Go to APIs & Services → Credentials
3. Find "OAuth 2.0 Client ID (Web application)"
4. Copy the Client ID
5. **Important:** Add your Vercel domain to "Authorized redirect URIs":
   - `https://<your-project>.vercel.app`
   - `https://yourdomain.com` (if using custom domain)

### Email Service (SendGrid)

```
SENDGRID_API_KEY = <your_sendgrid_api_key>
SENDER_EMAIL = noreply@cliffcooks.com
```

**How to get SendGrid API Key:**
1. Open [SendGrid Dashboard](https://app.sendgrid.com/)
2. Settings → API Keys
3. Create New Static Key with "Mail Send" permission
4. Copy the key (only shown once!)

---

## Optional Environment Variables

These enhance functionality but aren't strictly required:

### Analytics

```
VITE_FIREBASE_MEASUREMENT_ID = <your_measurement_id>
VITE_GOOGLE_ANALYTICS_ID = <your_ga_id>
```

### Application URLs

```
VITE_APP_URL = https://<your-project>.vercel.app
VITE_API_BASE_URL = https://<your-project>.vercel.app
NODE_ENV = production
```

### Feature Flags

```
VITE_ENABLE_ANALYTICS = true
VITE_ENABLE_NEWSLETTER = true
VITE_ENABLE_REVIEWS = true
VITE_ENABLE_WISHLIST = true
VITE_ENABLE_RESERVATIONS = true
VITE_ENABLE_ADMIN_CONSOLE = true
VITE_DEBUG_MODE = false
```

---

## Environment Variables by Target

In Vercel, set the target environment for each variable:

| Target | Use Case | Recommended Variables |
|--------|----------|----------------------|
| **Production** | Live website | All variables (stable values) |
| **Preview** | Pull request previews | Same as production |
| **Development** | Local `vercel dev` | Optional debug vars |

**Recommendation:** Set most variables for **Production** only. Preview deployments inherit Production variables.

---

## Step-by-Step Setup Walkthrough

### 1. Firebase API Key

**Get the value:**
1. Firebase Console → Project Settings
2. "Your apps" section → Web app config
3. Copy `apiKey`

**Add to Vercel:**
- Variable: `VITE_FIREBASE_API_KEY`
- Value: `AIzaSyB3hqJ01ozm...` (paste your key)
- Target: Production, Preview
- Click "Save"

### 2. Firebase Database ID

**Get the value:**
1. Firebase Console → Firestore Database
2. Click your database
3. Copy the database ID from URL or settings

**Add to Vercel:**
- Variable: `VITE_FIREBASE_DATABASE_ID`
- Value: `ai-studio-artisanalpottery-97eea235-8260-4d94-bcb8-63c7dfbb20b6`
- Target: Production, Preview
- Click "Save"

### 3. Google OAuth Client ID

**Get the value:**
1. Google Cloud Console → APIs & Services → Credentials
2. Find "OAuth 2.0 Client IDs" (Web application type)
3. Copy the Client ID

**Update Google Cloud Console:**
- Add to "Authorized redirect URIs":
  - `https://yourproject.vercel.app`
  - `https://yourdomain.com` (if custom domain)
- Add to "Authorized JavaScript origins":
  - `https://yourproject.vercel.app`
  - `https://yourdomain.com`
- Save changes

**Add to Vercel:**
- Variable: `VITE_OAUTH_CLIENT_ID`
- Value: `145865834673-fm8hf9t326kg1jkmdsiq6005di5uet1n.apps.googleusercontent.com`
- Target: Production, Preview
- Click "Save"

### 4. SendGrid API Key

**Get the value:**
1. SendGrid Dashboard → Settings → API Keys
2. Click "Create API Key"
3. Name: "CliffCooks Production"
4. Permissions: "Full Access" or "Mail Send"
5. Create and copy the key

**Add to Vercel:**
- Variable: `SENDGRID_API_KEY`
- Value: `SG.xxxxxxxxxxxxx` (your key)
- Target: Production, Preview
- Click "Save"

### 5. Verify & Deploy

**Check variables are set:**
```bash
vercel env ls
```

**Redeploy with new variables:**
```bash
vercel deploy --prod
```

**Or via dashboard:**
- Go to Deployments → Redeploy latest

---

## Testing Environment Variables

After deployment, verify variables loaded correctly:

### Check Build Logs

1. Vercel Dashboard → Deployments
2. Click latest deployment
3. Click "Build Logs"
4. Search for variable names (should not show actual values)
5. Look for errors with Firebase/Auth

### Test in Browser

1. Visit your Vercel deployment
2. Open DevTools Console (F12)
3. Try signing in with email/password
4. Try Google sign-in
5. Check for Firebase connection errors

### Test API Functions

Email functions only work if SendGrid key is set:
1. Sign up for newsletter → should succeed
2. Place an order → should send confirmation email
3. Check SendGrid Activity for sent emails

---

## Troubleshooting

### "Firebase not initialized" Error

**Cause:** Missing `VITE_FIREBASE_API_KEY` or `VITE_FIREBASE_DATABASE_ID`

**Solution:**
1. Verify both variables are set in Vercel
2. Redeploy: `vercel deploy --prod`
3. Check Firebase Console → Project Settings for correct values

### Google Sign-In Not Working

**Cause:** OAuth Client ID not configured or redirect URIs missing

**Solution:**
1. Verify `VITE_OAUTH_CLIENT_ID` is set in Vercel
2. Check Google Cloud Console → Authorized redirect URIs includes:
   - `https://yourproject.vercel.app`
   - `https://yourdomain.com` (custom domain)
3. Wait 2-5 minutes for Google to sync changes
4. Clear browser cache and try again

### Email Service Not Sending

**Cause:** `SENDGRID_API_KEY` not set or lacks permissions

**Solution:**
1. Verify `SENDGRID_API_KEY` is set in Vercel
2. Check key has "Mail Send" permission in SendGrid
3. Verify `SENDER_EMAIL` is authorized in SendGrid
4. Check Vercel Function logs for send errors
5. Redeploy: `vercel deploy --prod`

### Variables Not Loading

**Cause:** Deployment cached old environment

**Solution:**
1. Redeploy after adding variables: `vercel deploy --prod`
2. Or use Vercel Dashboard → Redeploy
3. Wait 30-60 seconds for DNS cache to clear
4. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

### "Unauthorized" or "Invalid API Key"

**Cause:** Firestore security rules or Firebase project mismatch

**Solution:**
1. Verify `VITE_FIREBASE_PROJECT_ID` matches your Firebase project
2. Check Firebase → Authentication → Users (verify test account)
3. Check Firestore → Rules (should allow read/write for authenticated users)
4. Test in Firebase Console directly to isolate issue

---

## Complete Checklist

Use this checklist to verify setup:

**Firebase Configuration**
- [ ] `VITE_FIREBASE_API_KEY` set
- [ ] `VITE_FIREBASE_AUTH_DOMAIN` = `affluence-arena.firebaseapp.com`
- [ ] `VITE_FIREBASE_PROJECT_ID` = `affluence-arena`
- [ ] `VITE_FIREBASE_STORAGE_BUCKET` set
- [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID` = `145865834673`
- [ ] `VITE_FIREBASE_APP_ID` set
- [ ] `VITE_FIREBASE_DATABASE_ID` set
- [ ] Firestore Database: Active and accessible
- [ ] Authentication: Email/Password & Google enabled

**Google OAuth**
- [ ] `VITE_OAUTH_CLIENT_ID` set in Vercel
- [ ] OAuth Client created in Google Cloud
- [ ] Redirect URIs include Vercel domain
- [ ] JavaScript origins include Vercel domain
- [ ] OAuth consent screen configured

**Email Service**
- [ ] `SENDGRID_API_KEY` set in Vercel
- [ ] `SENDER_EMAIL` set
- [ ] Key has "Mail Send" permission
- [ ] Sender email verified in SendGrid

**Application**
- [ ] `VITE_APP_URL` = your Vercel deployment URL
- [ ] `VITE_API_BASE_URL` = your Vercel deployment URL
- [ ] `NODE_ENV` = `production`
- [ ] All variables set for Production target

**Testing**
- [ ] Deploy triggered after adding variables
- [ ] Email/password sign-in works
- [ ] Google sign-in works
- [ ] Newsletter signup sends email
- [ ] Product orders complete without errors

---

## Command Reference

```bash
# List all environment variables
vercel env ls

# Add a new variable (interactive)
vercel env add VARIABLE_NAME

# Remove a variable
vercel env rm VARIABLE_NAME

# Pull Vercel variables to local file
vercel env pull .env.local

# Push local .env.local to Vercel
vercel env push

# Deploy with new environment
vercel deploy --prod

# View deployment logs
vercel logs https://yourproject.vercel.app

# Open Vercel dashboard
vercel dashboard
```

---

## Resources

- [Vercel Environment Variables Docs](https://vercel.com/docs/environment-variables)
- [Firebase Project Settings](https://console.firebase.google.com/)
- [Google Cloud Console](https://console.cloud.google.com/)
- [SendGrid API Keys](https://app.sendgrid.com/settings/api_keys)
- [Local .env Setup](./ENV_VARIABLES.md)

**Last Updated:** 2026-10-09

---

## Need Help?

1. Check the Vercel deployment logs: `vercel logs`
2. Review [ENV_VARIABLES.md](./ENV_VARIABLES.md) for detailed variable descriptions
3. Check [AUTH_TROUBLESHOOTING.md](./AUTH_TROUBLESHOOTING.md) for auth issues
4. Contact Vercel support if variables still not working
