# Firebase Setup Checklist for Authentication

Use this checklist to verify Firebase is properly configured for Google OAuth and email/password auth.

## Firebase Project Configuration

### Basic Setup
- [ ] Firebase project exists: `affluence-arena`
- [ ] Firebase CLI installed: `npm install -g firebase-tools`
- [ ] Authenticated with Firebase: `firebase login`
- [ ] Project connected: `firebase use affluence-arena`

### Configuration File
- [ ] File exists: `firebase-applet-config.json`
- [ ] Contains `projectId`: `affluence-arena`
- [ ] Contains `appId`: starts with `1:`
- [ ] Contains `apiKey`: valid API key
- [ ] Contains `authDomain`: `affluence-arena.firebaseapp.com`
- [ ] Contains `firestoreDatabaseId`: database ID specified
- [ ] Contains `storageBucket`: `affluence-arena.firebasestorage.app`
- [ ] Contains `oAuthClientId`: Google OAuth 2.0 client ID
- [ ] Contains `messagingSenderId`: from Firebase project

## Google Cloud Console Setup

### Project Settings
- [ ] Google Cloud project exists
- [ ] Associated with Firebase project `affluence-arena`
- [ ] Billing account linked (if required)

### OAuth 2.0 Credentials
- [ ] OAuth 2.0 Client ID created (Web application type)
- [ ] Client ID format: `[number]-[random].apps.googleusercontent.com`
- [ ] Client ID matches `oAuthClientId` in `firebase-applet-config.json`

### Authorized Redirect URIs
**For Development:**
- [ ] `http://localhost:5173`
- [ ] `http://localhost:5173/`
- [ ] `http://localhost:3000`
- [ ] `http://127.0.0.1:5173`

**For Production:**
- [ ] `https://yourdomain.com`
- [ ] `https://yourdomain.com/`
- [ ] `https://www.yourdomain.com`

### Authorized JavaScript Origins
**For Development:**
- [ ] `http://localhost:5173`
- [ ] `http://localhost:3000`
- [ ] `http://127.0.0.1:5173`

**For Production:**
- [ ] `https://yourdomain.com`
- [ ] `https://www.yourdomain.com`

### OAuth Consent Screen
- [ ] Consent screen type: External (for public app) or Internal (for G Suite)
- [ ] App name: "CliffCooks" or similar
- [ ] User support email: provided
- [ ] App logo: uploaded
- [ ] Authorized domains: yourserver.com added
- [ ] Scopes requested: `openid`, `email`, `profile`
- [ ] Test users added (if External + in development)

## Firebase Console - Authentication

### Sign-In Methods
- [ ] Email/Password provider: **Enabled**
  - [ ] Email/password authentication enabled
  - [ ] Email link (passwordless) enabled
- [ ] Google provider: **Enabled**
  - [ ] Web client ID configured
  - [ ] Fingerprints not required for web
- [ ] Anonymous auth: Disabled (or enabled if needed)

### Authentication Settings
- [ ] Authorized domains: configured for your domain
- [ ] Session management: default (30-minute timeout)
- [ ] Password policy: at least 6 characters

### User Accounts
Test accounts created:
- [ ] At least one test Google account
- [ ] At least one test email/password account
- [ ] Admin account created: `buddhacmd02@gmail.com`

### Authentication Emulator (Optional for Development)
- [ ] Emulator installed: `firebase emulators:start`
- [ ] Emulator running on port: `9099` (auth)
- [ ] App configured to use emulator in dev mode

## Firebase Console - Firestore

### Database
- [ ] Firestore database created
- [ ] Database name/ID: `ai-studio-artisanalpottery-97eea235-8260-4d94-bcb8-63c7dfbb20b6`
- [ ] Database location: selected
- [ ] Database type: Native mode (recommended)

### Collections
- [ ] `users` collection exists (for user profiles)
- [ ] `admins` collection exists (for admin tracking)
- [ ] `orders` collection exists
- [ ] `products` collection exists
- [ ] `reservations` collection exists

### Security Rules
- [ ] Rules updated for authentication:
  ```firestore
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /users/{userId} {
        allow read, write: if request.auth.uid == userId;
      }
      match /admins/{userId} {
        allow read: if request.auth != null;
        allow write: if request.auth.uid == userId && exists(/databases/$(database)/documents/admins/$(request.auth.uid));
      }
      // Add other rules as needed
    }
  }
  ```

## Firebase Console - Storage

### Cloud Storage
- [ ] Storage bucket created: `affluence-arena.firebasestorage.app`
- [ ] Bucket location: selected
- [ ] Storage rules configured for uploads

### Storage Security Rules
- [ ] Rules allow authenticated users to upload
- [ ] Rules restrict access appropriately

## Local Development Environment

### Environment Variables
If using `.env` file:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=affluence-arena.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=affluence-arena
VITE_FIREBASE_STORAGE_BUCKET=affluence-arena.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_DATABASE_ID=your_database_id
VITE_OAUTH_CLIENT_ID=your_oauth_client_id
```

- [ ] Variables set correctly
- [ ] `.env` file in `.gitignore`
- [ ] No sensitive values committed to git

### Node.js Setup
- [ ] Node.js v18+ installed
- [ ] npm v9+ installed
- [ ] Dependencies installed: `npm install`
- [ ] Firebase SDK version: `"firebase": "^11.0.0"` (or latest)

## Application Setup

### AuthContext Configuration
- [ ] `src/context/AuthContext.tsx` exists
- [ ] `useAuth()` hook implemented
- [ ] Auth state management working
- [ ] Profile sync to Firestore working
- [ ] Admin detection working

### AuthModal Component
- [ ] `src/components/AuthModal.tsx` exists
- [ ] Google sign-in button renders
- [ ] Email/password form renders
- [ ] Error messages display correctly
- [ ] Loading states show during auth

### App.tsx Integration
- [ ] `AuthProvider` wraps entire app in `main.tsx`
- [ ] `AuthModal` component rendered
- [ ] `useAuth()` used in components needing auth
- [ ] Sign-in/sign-out buttons functional

### Debug Tools (Development Only)
- [ ] `AuthDebugPanel` component exists
- [ ] Debug panel shows in bottom-right corner (dev mode)
- [ ] Current auth state visible
- [ ] Error messages displayed in debug panel

## Testing Checklist

### Email/Password Authentication
- [ ] User can create new account
- [ ] Account appears in Firebase Auth console
- [ ] User can sign in with created account
- [ ] User profile appears in Firestore
- [ ] Sign out works correctly
- [ ] "Remember me" persists across page refresh

### Google Authentication
- [ ] Google popup opens when clicking Google button
- [ ] Google login completes successfully
- [ ] User data synced to Firestore
- [ ] Admin status correctly detected
- [ ] User can sign out
- [ ] Session persists across page refresh

### Admin Access
- [ ] User `buddhacmd02@gmail.com` is recognized as admin
- [ ] Admin console accessible to admin users
- [ ] Admin features hidden from regular users
- [ ] Admin document created in `admins` collection

### Error Handling
- [ ] Error messages display for invalid credentials
- [ ] "Popup blocked" message shows if browser blocks
- [ ] Rate limiting handled gracefully
- [ ] Network errors handled (offline mode)
- [ ] Invalid config shows helpful error

### Browser Compatibility
- [ ] Chrome/Edge: works
- [ ] Firefox: works
- [ ] Safari: works
- [ ] Mobile browsers: works
- [ ] Incognito/Private mode: works

## Production Deployment

### Domain Setup
- [ ] Custom domain configured (if not using Firebase hosting)
- [ ] HTTPS enabled
- [ ] Domain added to Firebase auth allowed domains
- [ ] OAuth redirect URIs updated for production domain
- [ ] CORS headers configured if needed

### Security
- [ ] API keys restricted in Google Cloud Console
- [ ] Firebase security rules reviewed and tested
- [ ] Environment variables set in production
- [ ] Sensitive data not logged
- [ ] Rate limiting configured

### Monitoring
- [ ] Firebase Auth activity monitored
- [ ] Error logs reviewed
- [ ] User sign-in patterns monitored
- [ ] Unusual activity alerts configured

## Troubleshooting

### If Google Sign-In Fails
1. [ ] Check `oAuthClientId` in config matches Google Cloud Console
2. [ ] Verify OAuth consent screen configured
3. [ ] Check authorized redirect URIs include your domain
4. [ ] Clear browser cache and cookies
5. [ ] Try in incognito mode
6. [ ] Check browser console for specific error code

### If Email/Password Fails
1. [ ] Verify Email/Password provider enabled in Firebase
2. [ ] Check password meets requirements (6+ characters)
3. [ ] Verify email exists before sign-in
4. [ ] Check rate limiting if many failed attempts
5. [ ] Try resetting password if account locked

### If Nothing Works
1. [ ] Check Firebase Console for service status
2. [ ] Verify API keys haven't been revoked
3. [ ] Check internet connection
4. [ ] Try completely clearing browser data
5. [ ] Contact Firebase support with project ID

## Resources

- Firebase Docs: https://firebase.google.com/docs
- Auth Setup: https://firebase.google.com/docs/auth/get-started
- Google OAuth: https://developers.google.com/identity/protocols/oauth2
- Email/Password: https://firebase.google.com/docs/auth/web/password-auth
- Troubleshooting: `AUTH_TROUBLESHOOTING.md` (this repo)

---

**Last Verified:** 2026-10-09

**Next Review Date:** 2026-11-09
