import React from 'react';

interface LogoMarkProps {
  className?: string;
  /** Fill of the stamp disc */
  discColor?: string;
  /** Colour of the two rings */
  ringColor?: string;
}

/**
 * Elegant pottery vessel mark: minimalist ceramic form suggesting
 * a hand-thrown vessel from above with subtle clay texture.
 */
export const LogoMark: React.FC<LogoMarkProps> = ({
  className = 'w-9 h-9',
  discColor = '#8B4513',
  ringColor = '#FAF7F2',
}) => (
  <svg viewBox="0 0 40 40" className={className} aria-hidden="true" focusable="false">
    {/* Outer circle - ceramic disc */}
    <circle cx="20" cy="20" r="19" fill={discColor} />

    {/* Inner vessel form - minimalist pot outline */}
    <g fill="none" stroke={ringColor} strokeLinecap="round" strokeLinejoin="round">
      {/* Outer rim/lip */}
      <ellipse cx="20" cy="16" rx="10" ry="3" strokeWidth="1.5" />

      {/* Vessel body - curved sides */}
      <path d="M10.5 16 Q9 22 10 28 Q12 31 20 31 Q28 31 30 28 Q31 22 29.5 16" strokeWidth="1.8" />

      {/* Inner rim detail */}
      <ellipse cx="20" cy="16" rx="8" ry="2" strokeWidth="1.2" opacity="0.6" />

      {/* Subtle center line for depth */}
      <path d="M20 16 Q20 23 20 31" strokeWidth="0.8" opacity="0.4" />
    </g>
  </svg>
);

interface LogoProps {
  /** `light` sits on the cream header, `dark` on the dark footer */
  tone?: 'light' | 'dark';
  /** Show the short descriptor under the name */
  showDescriptor?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ tone = 'light', showDescriptor = true, className = '' }) => {
  const nameColor = tone === 'light' ? 'text-[#2C2723]' : 'text-[#FAF7F2]';
  const descriptorColor = tone === 'light' ? 'text-[#7A6C5F]' : 'text-[#A69B8E]';

  return (
    <span className={`inline-flex items-center gap-2 sm:gap-3 ${className}`}>
      <LogoMark className="w-7 h-7 sm:w-10 sm:h-10 shrink-0 transition-transform duration-500 group-hover:rotate-6" />
      <span className="flex flex-col leading-none">
        <span className={`font-serif font-semibold tracking-[-0.02em] text-[1.5rem] sm:text-[2rem] leading-[0.95] ${nameColor}`}>
          <span>Cliff</span>
          <span className="block">Cooks</span>
        </span>
        {showDescriptor && (
          <span className={`hidden sm:block mt-1 text-[10px] font-light tracking-widest uppercase ${descriptorColor}`}>
            Ceramic Studio
          </span>
        )}
      </span>
    </span>
  );
};
