import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Cookie } from 'lucide-react';

/**
 * GDPR/Privacy-compliant cookie consent banner
 * Shows on first visit, stores preference in localStorage
 */
export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const hasConsent = localStorage.getItem('kiln_clay_cookie_consent');
    if (!hasConsent) {
      // Show after 1 second delay for better UX
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('kiln_clay_cookie_consent', JSON.stringify({
      timestamp: new Date().toISOString(),
      analytics: true,
      marketing: true,
      essential: true
    }));
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    localStorage.setItem('kiln_clay_cookie_consent', JSON.stringify({
      timestamp: new Date().toISOString(),
      analytics: false,
      marketing: false,
      essential: true // Always essential
    }));
    setIsVisible(false);
  };

  const handleCustomize = () => {
    setIsExpanded(!isExpanded);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 pointer-events-none">
        {/* Backdrop overlay */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-auto"
          />
        )}

        {/* Cookie Banner */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 25 }}
          className={`absolute pointer-events-auto ${
            isExpanded
              ? 'inset-4 sm:inset-auto sm:bottom-8 sm:left-8 sm:right-8 sm:max-w-2xl'
              : 'bottom-6 left-6 right-6 sm:bottom-8 sm:right-8 sm:max-w-md'
          }`}
        >
          <div className="bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#E3D9CB] overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 bg-[#EFEAE1] border-b border-[#E3D9CB] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Cookie className="w-5 h-5 text-[#C8623A] flex-shrink-0" />
                <h3 className="font-serif text-lg text-[#2C2723]">Cookie Preferences</h3>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="p-2 rounded-full hover:bg-[#D9CEBE] transition-colors flex-shrink-0 text-[#2C2723]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-5 space-y-4">
              <p className="text-sm text-[#544A41] leading-relaxed">
                We use cookies to enhance your browsing experience, analyze site traffic, and personalize content.
                Your privacy matters to us—see what we collect and manage your preferences below.
              </p>

              {/* Expandable Details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 pt-4 border-t border-[#E3D9CB]"
                  >
                    {/* Essential */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="essential"
                          checked={true}
                          disabled
                          className="w-4 h-4 rounded border-[#D9CEBE] cursor-not-allowed"
                        />
                        <label htmlFor="essential" className="text-sm font-semibold text-[#2C2723]">
                          Essential Cookies (Always On)
                        </label>
                      </div>
                      <p className="text-xs text-[#7F7062] ml-7">
                        Required for site functionality, security, and to remember your cart.
                        These cannot be disabled.
                      </p>
                    </div>

                    {/* Analytics */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="analytics"
                          defaultChecked={true}
                          className="w-4 h-4 rounded border-[#D9CEBE] cursor-pointer"
                        />
                        <label htmlFor="analytics" className="text-sm font-semibold text-[#2C2723]">
                          Analytics & Performance
                        </label>
                      </div>
                      <p className="text-xs text-[#7F7062] ml-7">
                        Help us understand how you use our site through anonymized data.
                        Includes page views, scroll depth, and device information.
                      </p>
                    </div>

                    {/* Marketing */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="marketing"
                          defaultChecked={false}
                          className="w-4 h-4 rounded border-[#D9CEBE] cursor-pointer"
                        />
                        <label htmlFor="marketing" className="text-sm font-semibold text-[#2C2723]">
                          Marketing & Personalization
                        </label>
                      </div>
                      <p className="text-xs text-[#7F7062] ml-7">
                        Allow us to show you personalized content and retargeting ads
                        based on your browsing behavior.
                      </p>
                    </div>

                    {/* Links */}
                    <div className="pt-3 border-t border-[#E3D9CB] flex gap-4 text-xs">
                      <a href="/privacy" className="text-[#C8623A] hover:underline">
                        Privacy Policy
                      </a>
                      <a href="/terms" className="text-[#C8623A] hover:underline">
                        Terms of Service
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Button Group */}
              <div className={`flex gap-3 ${isExpanded ? 'pt-4' : 'pt-2'}`}>
                <button
                  onClick={handleRejectAll}
                  className="flex-1 py-2.5 px-4 rounded-full border border-[#D9CEBE] text-[#544A41] font-semibold hover:bg-[#EFEAE1] transition-colors text-sm"
                >
                  Reject All
                </button>

                <button
                  onClick={handleCustomize}
                  className="flex-1 py-2.5 px-4 rounded-full border border-[#D9CEBE] text-[#544A41] font-semibold hover:bg-[#EFEAE1] transition-colors text-sm"
                >
                  {isExpanded ? 'Close' : 'Customize'}
                </button>

                <button
                  onClick={handleAcceptAll}
                  className="flex-1 py-2.5 px-4 rounded-full bg-[#C8623A] text-white font-semibold hover:bg-[#B3522C] transition-colors text-sm"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
