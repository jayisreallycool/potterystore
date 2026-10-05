import React, { useState } from 'react';
import { Mail, Check, Shield, Compass, Heart, ArrowUp, Sparkles } from 'lucide-react';
import { Logo } from './Logo';
import { ceramicAudio } from '../utils/audio';
import { submitInquiry } from '../services/storeService';

interface FooterProps {
  onReplayIntro?: () => void;
  onOpenAdminConsole?: () => void;
  onOpenCommissions?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onReplayIntro, onOpenAdminConsole, onOpenCommissions }) => {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-[#3B3530] text-xs">
          
          {/* Brand Info */}
          <div>
            <div className="mb-4">
              <Logo tone="dark" />
            </div>
            <p className="text-[#A69B8E] leading-relaxed mb-4">
              Small-batch ceramics brand inspired by the connection between food, craft, and everyday ritual founded by Clifford.
            </p>
            <p className="text-[11px] font-mono text-[#E2B17B]">
              Small-Batch Kiln Fired • Bowls, Plates, Vases, Mugs
            </p>
          </div>

          {/* Collections */}
          <div>
            <h4 className="font-mono uppercase text-[#E2B17B] tracking-wider mb-3 font-semibold">
              Collections
            </h4>
            <ul className="space-y-2 text-[#C4BAAE]">
              <li><a href="#hero-showcase" className="hover:text-white transition-colors">Vessels & Solitary Moon Vases</a></li>
              <li><a href="#hero-showcase" className="hover:text-white transition-colors">Matcha Chawan & Tea Ware</a></li>
              <li><a href="#hero-showcase" className="hover:text-white transition-colors">Celadon Nesting Dining Sets</a></li>
              <li><a href="#hero-showcase" className="hover:text-white transition-colors">Fluted Terracotta Planters</a></li>
              <li><a href="#hero-showcase" className="hover:text-white transition-colors">Sculptural Enso Forms</a></li>
            </ul>
          </div>

          {/* Craft Care & Integrity */}
          <div>
            <h4 className="font-mono uppercase text-[#E2B17B] tracking-wider mb-3 font-semibold">
              Ceramic Care
            </h4>
            <ul className="space-y-2 text-[#C4BAAE]">
              <li>Cone 10 Vitrification Guide</li>
              <li>Natural Ash Patina Aging</li>
              <li>Wabi-sabi Restoration (Kintsugi)</li>
              <li>Breakage-Free Crate Guarantee</li>
              <li>
                <button onClick={onOpenCommissions} className="hover:text-white underline underline-offset-2 transition-colors">
                  Custom orders
                </button>
              </li>
            </ul>
          </div>

          {/* Workshop & Hours */}
          <div>
            <h4 className="font-mono uppercase text-[#E2B17B] tracking-wider mb-3 font-semibold">
              Studio visits
            </h4>
            <p className="text-[#C4BAAE] leading-relaxed mb-2">
              Studio visits and tactile inspections by private appointment Thursday through Sunday.
            </p>
            <p className="font-mono text-[#8C7D70] text-[11px]">
              atelier@kilnandclay.studio<br />
              +1 (845) 555-KILN
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8A7B6D]">
          <p>© 2026 CliffCooks. All pieces handmade by Clifford.</p>
          
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
