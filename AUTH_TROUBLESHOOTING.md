# Authentication Troubleshooting Guide

## Overview
This guide covers issues with Google OAuth login and email/password authentication in the pottery store app.

---

## Common Issues & Solutions

### 1. Google Sign-In Not Working

#### Issue: "Popup was blocked by your browser"
**Solution:**
- Check your browser's popup blocker settings
- Make sure popups are allowed for `localhost:5173` (dev) or your production domain
- Try disabling any extensions that block popups (ad blockers, privacy extensions)

#### Issue: "Operation not supported in this environment"
**Cause:** Google authentication may not work in:
- Certain browsers or older browser versions
- Embedded iframes or sandboxed environments
- Some corporate/restricted networks

**Solution:**
- Use a modern browser (Chrome, Firefox, Edge, Safari)
- Use email/password authentication as fallback
- Contact IT if on corporate network with restrictions

#### Issue: "Invalid API key" or blank error
**Cause:** Firebase configuration is missing or incorrect

**Solution:**
1. Verify `firebase-applet-config.json` exists in project root
2. Check that `oAuthClientId` is set in the config
3. Ensure OAuth client is configured in Google Cloud Console:
   - Project: `affluence-arena`
   - OAuth 2.0 Client ID created
   - Authorized redirect URIs include your domain

#### Issue: Popup opens but redirects to blank page
**Cause:** Google OAuth credentials may not be properly linked to Firebase project

**Solution:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project `affluence-arena`
3. Go to Authentication → Sign-in method
4. Enable Google provider
5. Verify OAuth consent screen is configured
6. Check that OAuth client ID matches in `firebase-applet-config.json`

---

### 2. Email/Password Sign-In Not Working

#### Issue: "Invalid email or password" when credentials are correct
**Cause:** Multiple possible reasons:
- Email sign-in not enabled in Firebase
- User account doesn't exist
- Rate limiting (too many failed attempts)

**Solution:**
1. Verify email/password authentication is enabled:
   - Firebase Console → Authentication → Sign-in method
   - Enable "Email/Password"
2. Try creating a new account first (sign up)
3. Wait 15+ minutes if rate limited, then retry

#### Issue: "Operation not allowed"
**Cause:** Email/password authentication is disabled in Firebase

**Solution:**
1. Go to Firebase Console → Authentication → Sign-in method
2. Click on "Email/Password"
3. Enable both "Email/Password" and "Email link (passwordless sign-in)"
4. Save changes

#### Issue: "Weak password" error
**Cause:** Password is less than 6 characters

**Solution:**
- Use a password with at least 6 characters
- Include a mix of letters, numbers, and symbols for better security

---

### 3. Auth Modal Not Appearing

#### Issue: Modal doesn't open when clicking "Sign In"
**Cause:** AuthModal might not be rendered or context not working

**Solution:**
1. Check browser console for JavaScript errors
2. Verify AuthProvider wraps the entire app (check `main.tsx`)
3. Clear browser cache and reload
4. Try in an incognito/private window

---

### 4. Persistent Login Not Working

#### Issue: User logs out when page refreshes
**Cause:** Firebase auth state not persisting (usually works by default)

**Solution:**
1. Clear browser cache and cookies
2. Check browser's local storage is not disabled
3. Verify no browser extensions are blocking storage
4. Try in an incognito window (temporary storage only)
5. Check console for "IndexedDB" or storage permission errors

---

### 5. Debug Information

#### Development Only: Auth Debug Panel
In development mode, a debug panel appears in the bottom-right corner showing:
- Loading state
- Authentication status
- User ID, email, display name
- Email verification status
- Auth providers used
- Any active auth errors

**To access:**
- Click "🔐 Auth Debug" button in bottom-right corner
- View real-time authentication state
- Copy user ID and email for debugging

#### Browser Console Debugging
Open browser DevTools (F12) and check Console tab for auth-related messages:

```
✓ User logged in: UID-12345, email@example.com
✗ Google Sign-In error: auth/popup-blocked
✗ Email Sign-In error: auth/invalid-credential
```

---

## Testing Authentication Flows

### Test Account (Email/Password)
If you'd like a pre-created test account, contact the developer with a request.

### Creating Test Accounts
1. Click "Sign In" button
2. Select "Create account"
3. Enter test email and password (6+ characters)
4. Verify email is created in Firebase Auth

### Testing Google Sign-In
1. Click "Sign In" button
2. Click "Continue with Google"
3. Use your personal Google account
4. Verify popup opens and redirects back

---

## Network & Browser Issues

### VPN or Proxy Issues
**Problem:** Auth fails when connected to VPN

**Solution:**
- Try disconnecting from VPN
- Some corporate VPNs block OAuth redirects
- Contact your IT department if on corporate network

### Third-Party Cookies Disabled
**Problem:** Sign-in fails silently

**Solution:**
- Check browser settings: Allow third-party cookies
- Or add exception for `firebaseauth.googleapis.com`

### Browser Extensions Blocking Auth
**Problem:** Unpredictable auth failures

**Solution:**
- Disable extensions one-by-one to identify culprit
- Common blockers: ad blockers, privacy extensions, password managers
- Allow exceptions for your site domain

---

## Firebase Console Verification Checklist

- [ ] Project name: `affluence-arena`
- [ ] Authentication enabled
- [ ] Google provider enabled with OAuth consent screen
- [ ] Email/Password provider enabled
- [ ] Authorized redirect URIs configured for your domain
- [ ] OAuth client ID matches `oAuthClientId` in config
- [ ] Firestore database configured with correct database ID
- [ ] Storage bucket accessible

---

## Error Codes Reference

| Code | Meaning | Action |
|------|---------|--------|
| `auth/popup-closed-by-user` | User closed the popup | Normal - retry if needed |
| `auth/popup-blocked` | Browser blocked popup | Allow popups in browser settings |
| `auth/cancelled-popup-request` | User cancelled | Normal - no action needed |
| `auth/invalid-credential` | Wrong email/password | Check credentials |
| `auth/user-not-found` | Email not registered | Create account first |
| `auth/email-already-in-use` | Email exists | Use Sign In instead |
| `auth/weak-password` | Password < 6 chars | Use longer password |
| `auth/operation-not-allowed` | Auth method disabled | Enable in Firebase Console |
| `auth/too-many-requests` | Rate limited | Wait 15+ minutes |
| `auth/invalid-api-key` | Bad API key | Check firebase config |
| `auth/operation-not-supported-in-this-environment` | Browser limitation | Use different browser |

---

## Still Having Issues?

1. **Check the Auth Debug Panel** (development only) for current auth state
2. **Open browser console** (F12 → Console) for error messages
3. **Try incognito/private mode** to rule out cache/extension issues
4. **Clear all site data** and try again:
   - Settings → Privacy → Cookies and site data → Clear all
5. **Test with different browser** to isolate browser-specific issues
6. **Contact support** with:
   - Error code/message from console
   - Auth Debug Panel screenshot
   - Browser and OS information
   - Steps to reproduce

---

## Technical Details

### Firebase Configuration
- **Database ID:** `ai-studio-artisanalpottery-97eea235-8260-4d94-bcb8-63c7dfbb20b6`
- **Project ID:** `affluence-arena`
- **Auth Domain:** `affluence-arena.firebaseapp.com`
- **Storage:** `affluence-arena.firebasestorage.app`

### Auth Flow
1. User clicks Sign In/Google button
2. AuthModal opens
3. AuthContext handles authentication
4. Firebase Auth manages user session
5. User profile synced to Firestore `users` collection
6. Admin status checked against `admins` collection or admin email
7. Modal closes on success, error displayed on failure

### Scopes Requested (Google)
- `profile` - Display name and photo
- `email` - Email address

---

Last Updated: 2026-10-09
