import React, { useState } from 'react';
import { Mail, Check, Shield, Compass, Heart, ArrowUp, Sparkles, Instagram, Linkedin } from 'lucide-react';
import { motion } from 'motion/react';
import { Logo } from './Logo';
import { ceramicAudio } from '../utils/audio';
import { submitInquiry } from '../services/storeService';

interface FooterProps {
  onReplayIntro?: () => void;
  onOpenAdminConsole?: () => void;
  onOpenCommissions?: () => void;
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
  onOpenShipping?: () => void;
  onOpenContact?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onReplayIntro,
  onOpenAdminConsole,
  onOpenCommissions,
  onOpenPrivacy,
  onOpenTerms,
  onOpenShipping,
  onOpenContact
}) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeError, setSubscribeError] = useState(false);

  // Saves the address to the admin inbox so new-batch emails can actually be sent
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const address = email.trim();
    if (!address || isSubscribing) return;
    setIsSubscribing(true);
    setSubscribeError(false);
    try {
      await submitInquiry({
        id: `signup_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        name: 'New batch email signup',
        email: address.slice(0, 200),
        message: 'Please email me when a new batch goes on sale.',
        pieceOfInterest: 'New batch emails',
        createdAt: new Date().toISOString(),
        status: 'unread',
      });
      setIsSubscribed(true);
      ceramicAudio.playCeramicChime(700, 1.2);
    } catch {
      setSubscribeError(true);
    } finally {
      setIsSubscribing(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    ceramicAudio.playSlideSound();
  };

  return (
    <footer className="bg-[#24201D] text-[#EFEAE1] pt-16 pb-12 border-t border-[#3B3530]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Newsletter & Studio Drop Alert */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#2D2723] border border-[#443C36] mb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6">
            <h3 className="font-serif text-2xl sm:text-3xl text-[#FAF7F2]">
              Hear about new batches first
            </h3>
            <p className="text-xs sm:text-sm text-[#A69B8E] mt-2">
              Pieces are made in small batches and sell out. Leave your email and we'll let you know when the next batch goes on sale.
            </p>
          </div>

          <div className="lg:col-span-6">
            {isSubscribed ? (
              <div className="flex items-center gap-2 text-xs font-mono text-[#8FD19E] bg-[#1F1B18] p-4 rounded-2xl border border-[#3E3630]">
                <Check className="w-4 h-4" />
                <span>You're on the list. We'll email you before the next batch.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email" aria-label="Email address"
                  className="flex-1 min-h-[44px] bg-[#1F1B18] border border-[#4A4038] rounded-full px-4 py-3 text-base sm:text-xs text-[#FAF7F2] placeholder-[#7F7366] focus:outline-none focus:border-[#E2B17B]"
                />
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="min-h-[44px] px-6 py-3 rounded-full bg-[#E2B17B] disabled:opacity-60 text-[#24201D] hover:bg-[#F0C594] active:scale-98 text-xs font-semibold uppercase tracking-wider transition-all shrink-0 flex items-center justify-center"
                >
                  {isSubscribing ? 'Saving…' : 'Notify me'}
                </button>
              </form>
            )}
            {subscribeError && (
              <p role="alert" className="text-xs text-[#F0A59A] mt-2">
                That didn't save. Check your connection and try again.
              </p>
            )}
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-4 pb-8 border-b border-[#3B3530]">

          {/* Brand Info */}
          <div className="sm:col-span-2">
            <div className="mb-3">
              <Logo tone="dark" />
            </div>
            <p className="text-[10px] sm:text-xs text-[#A69B8E] leading-relaxed">
              Small-batch handmade ceramics by Clifford.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-mono uppercase text-[#E2B17B] tracking-wider mb-2 font-semibold text-[10px]">
              Shop
            </h4>
            <ul className="space-y-1.5 text-[#C4BAAE] text-[10px]">
              <li><a href="#hero-showcase" className="hover:text-white transition-colors">All</a></li>
              <li><a href="#hero-showcase" className="hover:text-white transition-colors">Vessels</a></li>
              <li><a href="#hero-showcase" className="hover:text-white transition-colors">Tableware</a></li>
              <li><a href="#hero-showcase" className="hover:text-white transition-colors">Tea & Ritual</a></li>
            </ul>
          </div>

          {/* Help & Service */}
          <div>
            <h4 className="font-mono uppercase text-[#E2B17B] tracking-wider mb-2 font-semibold text-[10px]">
              Help
            </h4>
            <ul className="space-y-1.5 text-[#C4BAAE] text-[10px]">
              <li>
                <button onClick={onOpenShipping} className="hover:text-white transition-colors text-left">
                  Shipping
                </button>
              </li>
              <li>
                <button onClick={onOpenContact} className="hover:text-white transition-colors text-left">
                  Contact
                </button>
              </li>
              <li>
                <button onClick={onOpenCommissions} className="hover:text-white transition-colors text-left">
                  Custom Orders
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-mono uppercase text-[#E2B17B] tracking-wider mb-2 font-semibold text-[10px]">
              Legal
            </h4>
            <ul className="space-y-1.5 text-[#C4BAAE] text-[10px]">
              <li>
                <button onClick={onOpenTerms} className="hover:text-white transition-colors text-left">
                  Terms
                </button>
              </li>
              <li>
                <button onClick={onOpenPrivacy} className="hover:text-white transition-colors text-left">
                  Privacy
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Social Media Section */}
        <div className="py-8 border-b border-[#3B3530]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="text-center sm:text-left">
              <p className="text-[10px] font-mono uppercase text-[#E2B17B] tracking-wider mb-1 font-semibold">
                Follow
              </p>
              <p className="text-[11px] text-[#A69B8E] max-w-sm leading-snug">
                Join our community of ceramic collectors.
              </p>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center gap-4">
              {/* Instagram */}
              <motion.a
                href="https://instagram.com/cliffcooks"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#E4405F] via-[#D92E7F] to-[#9B36B7] hover:shadow-lg transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Cliff Cooks on Instagram"
                title="Follow us on Instagram"
              >
                <Instagram className="w-4 h-4 text-white" />
              </motion.a>

              {/* Pinterest */}
              <motion.a
                href="https://pinterest.com/cliffcooks"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-10 h-10 rounded-full bg-[#E60023] hover:shadow-lg transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Cliff Cooks on Pinterest"
                title="Follow us on Pinterest"
              >
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.15.015.405 0 .405-.405v-3.338c-2.45.6-2.927-1.244-2.927-1.244-.12-.612-.465-1.644-.465-1.644-.405-2.7 1.095-3.37 1.095-3.37.9-.615 2.22-.42 2.22-.42.465 0 1.404.165 1.404-.405v-3.12c0-.12.015-.255.135-.405-.12 0-1.2-.12-1.98-.12-2.7 0-3.264 2.176-3.264 2.176-.6 1.488.165 2.31.165 2.31.465 1.494 1.665 1.215 2.16 1.215h.165v-2.73c-.12 0-.93-.075-1.215-.165-1.29-.33-2.265-1.494-2.265-2.88 0-2.16 1.665-3.915 3.915-3.915 2.25 0 3.915 1.755 3.915 3.915 0 1.386-.975 2.55-2.265 2.88-.285.09-1.095.165-1.215.165v2.73c.495 0 1.695.27 2.16-1.215.6-1.494 1.755-2.31 1.755-2.31 1.26-1.11 2.16-2.415 2.16-3.915 0-3.57-2.895-6.465-6.465-6.465-3.57 0-6.465 2.895-6.465 6.465 0 1.5.9 2.805 2.16 3.915.6 1.494 1.755 2.31 1.755 2.31.465 1.485 1.665 1.215 2.16 1.215v-2.73c-.12 0-.93-.075-1.215-.165-1.29-.33-2.265-1.494-2.265-2.88 0-2.16 1.665-3.915 3.915-3.915z"/>
                </svg>
              </motion.a>

              {/* Facebook */}
              <motion.a
                href="https://facebook.com/cliffcooks"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-10 h-10 rounded-full bg-[#1877F2] hover:shadow-lg transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Cliff Cooks on Facebook"
                title="Follow us on Facebook"
              >
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </motion.a>

              {/* TikTok */}
              <motion.a
                href="https://tiktok.com/@cliffcooks"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-10 h-10 rounded-full bg-[#000000] hover:shadow-lg transition-all border border-[#25F4EE]"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Cliff Cooks on TikTok"
                title="Follow us on TikTok"
              >
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.1 1.82 2.89 2.89 0 0 1 5.1-1.82V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 5.07 2.41 6.3 6.3 0 0 0 5.44-10.66l-.02-.02v-.02a4.82 4.82 0 0 0 3.8-4.82v-.5a7.4 7.4 0 0 1-.43-.20z"/>
                </svg>
              </motion.a>

              {/* Email */}
              <motion.a
                href="mailto:hello@cliffcooks.studio"
                className="group flex items-center justify-center w-10 h-10 rounded-full bg-[#8B4513] hover:bg-[#A0522D] hover:shadow-lg transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Email Cliff Cooks"
                title="Email us"
              >
                <Mail className="w-4 h-4 text-white" />
              </motion.a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8A7B6D]">
          <p>© 2026 Cliff Cooks. All pieces handmade by Clifford.</p>
          
          <div className="flex items-center gap-6">
            {onOpenAdminConsole && (
              <button
                id="footer-admin-btn"
                onClick={onOpenAdminConsole}
                className="text-[#C4BAAE] hover:text-[#FAF7F2] font-mono transition-colors text-[11px]"
              >
                <span>Admin</span>
              </button>
            )}

            {onReplayIntro && (
              <button
                id="footer-replay-intro-btn"
                onClick={onReplayIntro}
                className="flex items-center gap-1.5 text-[#C4BAAE] hover:text-[#FAF7F2] font-mono transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C8623A]" />
                <span>Replay intro</span>
              </button>
            )}

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-[#E2B17B] hover:text-[#FAF7F2] font-mono transition-colors"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
