import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile,
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db, ADMIN_EMAIL, handleFirestoreError, OperationType } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  authError: string | null;
  clearAuthError: () => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  logOut: () => Promise<void>;
  isAuthModalOpen: boolean;
  authModalMode: 'signin' | 'signup';
  openAuthModal: (mode?: 'signin' | 'signup') => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');

  const clearAuthError = () => setAuthError(null);

  const openAuthModal = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode);
    setAuthError(null);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthError(null);
  };

  // Sync profile & detect admin status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const isEmailAdmin = currentUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
        let hasAdminDoc = false;

        try {
          const adminDocRef = doc(db, 'admins', currentUser.uid);
          const adminSnap = await getDoc(adminDocRef);
          hasAdminDoc = adminSnap.exists();

          // Auto-bootstrap admin document if current user matches system admin email
          if (isEmailAdmin && !hasAdminDoc) {
            await setDoc(adminDocRef, {
              email: currentUser.email,
              createdAt: new Date().toISOString()
            });
            hasAdminDoc = true;
          }
        } catch {
          // Fallback to email admin check if admin doc read fails before rules deploy
        }

        setIsAdmin(isEmailAdmin || hasAdminDoc);

        // Sync user profile
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          await setDoc(userDocRef, {
            userId: currentUser.uid,
            email: currentUser.email || '',
            displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Customer',
            photoURL: currentUser.photoURL || '',
            updatedAt: new Date().toISOString()
          }, { merge: true });
        } catch (err) {
          console.warn('Profile sync notice:', err);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        setIsAuthModalOpen(false);
      }
    } catch (err: any) {
      // Cleanly handle user closing popup or cancelling without flagging as a system error
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        console.log('User cancelled Google sign-in');
        return;
      }
      if (err?.code === 'auth/popup-blocked') {
        setAuthError('The sign-in popup was blocked by your browser. Please allow popups for this site.');
        console.error('Popup blocked:', err);
        return;
      }
      if (err?.code === 'auth/operation-not-supported-in-this-environment') {
        setAuthError('Google sign-in is not available in this browser environment. Please use email/password instead.');
        console.error('Google auth not supported:', err);
        return;
      }
      if (err?.code === 'auth/invalid-api-key') {
        setAuthError('Authentication service is not properly configured. Please contact support.');
        console.error('Invalid API key:', err);
        return;
      }
      console.error('Google Sign-In error:', err?.code, err?.message, err);
      setAuthError(err?.message || 'Failed to sign in with Google. Please try again or use email/password.');
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    setAuthError(null);
    try {
      if (!email || !pass) {
        const msg = 'Please enter both email and password.';
        setAuthError(msg);
        throw new Error(msg);
      }

      const result = await signInWithEmailAndPassword(auth, email, pass);
      if (result.user) {
        setIsAuthModalOpen(false);
      }
    } catch (err: any) {
      console.error('Email Sign-In error:', err?.code, err?.message, err);
      let msg = 'Failed to sign in.';

      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        msg = 'Invalid email or password. Please verify your credentials or create a new account.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Too many attempts. Please try again in a few moments.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      } else if (err.code === 'auth/user-disabled') {
        msg = 'This account has been disabled. Please contact support.';
      } else if (err.code === 'auth/operation-not-allowed') {
        msg = 'Email/password sign-in is not enabled. Please use Google sign-in or contact support.';
      }

      setAuthError(msg);
      throw new Error(msg);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    setAuthError(null);
    try {
      if (!email || !pass) {
        const msg = 'Please enter email and password.';
        setAuthError(msg);
        throw new Error(msg);
      }

      if (pass.length < 6) {
        const msg = 'Password should be at least 6 characters.';
        setAuthError(msg);
        throw new Error(msg);
      }

      const cred = await createUserWithEmailAndPassword(auth, email, pass);

      if (name && name.trim()) {
        try {
          await updateProfile(cred.user, { displayName: name.trim() });
        } catch (profileErr) {
          console.warn('Profile update notice:', profileErr);
          // Continue anyway - profile update is not critical
        }
      }

      setIsAuthModalOpen(false);
    } catch (err: any) {
      console.error('Email Sign-Up error:', err?.code, err?.message, err);
      let msg = 'Failed to create account.';

      if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email address already exists. Please sign in instead.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      } else if (err.code === 'auth/operation-not-allowed') {
        msg = 'Account creation is not enabled. Please contact support.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Too many requests. Please try again in a few moments.';
      }

      setAuthError(msg);
      throw new Error(msg);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Sign-Out failed:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        authError,
        clearAuthError,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        logOut,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
