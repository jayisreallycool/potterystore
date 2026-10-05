import React from 'react';

interface LogoMarkProps {
  className?: string;
  /** Fill of the stamp disc */
  discColor?: string;
  /** Colour of the two rings */
  ringColor?: string;
}

/**
 * CliffCooks maker's stamp: two nested C's that double as the
 * throwing rings left on a pot coming off the wheel.
 */
export const LogoMark: React.FC<LogoMarkProps> = ({
  className = 'w-9 h-9',
  discColor = '#B9552D',
  ringColor = '#FAF7F2',
}) => (
  <svg viewBox="0 0 40 40" className={className} aria-hidden="true" focusable="false">
    <circle cx="20" cy="20" r="20" fill={discColor} />
    <g fill="none" stroke={ringColor} strokeLinecap="round">
      <path d="M28.43 12.93A11 11 0 1 0 28.43 27.07" strokeWidth="2.8" />
      <path d="M23.83 16.79A5 5 0 1 0 23.83 23.21" strokeWidth="2.8" />
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
      <LogoMark className="w-7 h-7 sm:w-10 sm:h-10 shrink-0 transition-transform duration-500 group-hover:-rotate-12" />
      <span className="flex flex-col leading-none">
        <span className={`font-serif font-semibold tracking-[-0.01em] text-[1.5rem] sm:text-[2rem] leading-[0.95] ${nameColor}`}>
          CliffCooks
        </span>
        {showDescriptor && (
          <span className={`hidden sm:block mt-1 text-[11px] font-medium tracking-wide ${descriptorColor}`}>
            Handmade pottery
          </span>
        )}
      </span>
    </span>
  );
};
