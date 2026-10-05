import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, ArrowRight, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function AuthModal() {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalMode, 
    openAuthModal, 
    signInWithGoogle, 
    signInWithEmail, 
    signUpWithEmail,
    authError,
    clearAuthError
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();
    setIsSubmitting(true);
    try {
      if (authModalMode === 'signin') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, displayName);
      }
    } catch {
      // Handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    clearAuthError();
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch {
      // Handled in context
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeAuthModal}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-[#FAF7F2] text-[#2C2723] rounded-2xl shadow-2xl border border-[#E6DEC8] overflow-hidden z-10 transition-all duration-300">
        
        {/* Top Decorative Header */}
        <div className="bg-[#2C2723] text-[#FAF7F2] px-6 py-6 text-center relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-2 text-[#C4B7A6] hover:text-[#FAF7F2] rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#D97746]/20 border border-[#D97746]/40 text-[#D97746] mb-3">
            <Sparkles className="w-5 h-5" />
          </div>
          
          <h3 className="font-serif text-2xl tracking-wide">
            {authModalMode === 'signin' ? 'Atelier Portal' : 'Join the Studio'}
          </h3>
          <p className="text-xs text-[#C4B7A6] tracking-widest uppercase mt-1">
            {authModalMode === 'signin' ? 'Sign in to your collector account' : 'Bespoke commissions & archival acquisitions'}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Google Auth Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || isSubmitting}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-[#D9D0C1] rounded-xl bg-white hover:bg-[#F4EFE6] text-[#2C2723] font-medium text-sm transition-all shadow-sm active:scale-[0.99] disabled:opacity-60 cursor-pointer"
          >
            {googleLoading ? (
              <div className="w-5 h-5 border-2 border-[#D97746] border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#E6DEC8]" />
            <span className="text-xs uppercase tracking-wider text-[#8A7D71] font-mono">
              or with email
            </span>
            <div className="flex-1 h-px bg-[#E6DEC8]" />
          </div>

          {/* Error Message */}
          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {authModalMode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E51] mb-1.5">
                  Full Name / Title
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#A89F91] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#D9D0C1] rounded-xl text-sm text-[#2C2723] placeholder-[#A89F91] focus:outline-none focus:ring-2 focus:ring-[#D97746]/30 focus:border-[#D97746]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E51] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#A89F91] absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="patron@studio.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#D9D0C1] rounded-xl text-sm text-[#2C2723] placeholder-[#A89F91] focus:outline-none focus:ring-2 focus:ring-[#D97746]/30 focus:border-[#D97746]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E51] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#A89F91] absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#D9D0C1] rounded-xl text-sm text-[#2C2723] placeholder-[#A89F91] focus:outline-none focus:ring-2 focus:ring-[#D97746]/30 focus:border-[#D97746]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || googleLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 bg-[#D97746] hover:bg-[#C06536] text-white font-medium text-sm rounded-xl shadow-md transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{authModalMode === 'signin' ? 'Sign In to Atelier' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="pt-2 text-center text-xs text-[#6B5E51]">
            {authModalMode === 'signin' ? (
              <p>
                First time exploring Kiln & Clay?{' '}
                <button
                  type="button"
                  onClick={() => openAuthModal('signup')}
                  className="text-[#D97746] hover:underline font-semibold cursor-pointer"
                >
                  Create an account
                </button>
              </p>
            ) : (
              <p>
                Already have an atelier account?{' '}
                <button
                  type="button"
                  onClick={() => openAuthModal('signin')}
                  className="text-[#D97746] hover:underline font-semibold cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>

          <div className="text-[11px] text-center text-[#A89F91] border-t border-[#E6DEC8] pt-3">
            Secure studio authentication powered by Firebase Auth.
          </div>
        </div>
      </div>
    </div>
  );
}
