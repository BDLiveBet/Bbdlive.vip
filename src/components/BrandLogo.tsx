import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
  onClick
}) => {
  const sizeClasses = {
    sm: {
      text: 'text-xl',
      emblem: 'w-7 h-7',
      vip: 'text-xs px-1.5 py-0.5',
      sub: 'text-xs'
    },
    md: {
      text: 'text-2xl sm:text-3xl',
      emblem: 'w-8 h-8 sm:w-9 sm:h-9',
      vip: 'text-xs px-2 py-0.5',
      sub: 'text-xs'
    },
    lg: {
      text: 'text-3xl sm:text-4xl',
      emblem: 'w-10 h-10 sm:w-11 sm:h-11',
      vip: 'text-xs px-2.5 py-1',
      sub: 'text-xs sm:text-sm'
    },
    xl: {
      text: 'text-4xl sm:text-5xl',
      emblem: 'w-12 h-12 sm:w-14 sm:h-14',
      vip: 'text-sm px-3 py-1',
      sub: 'text-sm'
    }
  }[size];

  return (
    <div
      onClick={onClick}
      className={`inline-flex flex-col select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className="flex items-center gap-2">
        {/* Sleek 3D/Vector Glowing Emblem with BD Live Bet motif */}
        <div
          className={`relative ${sizeClasses.emblem} rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border border-slate-700/80 shadow-[0_0_15px_rgba(34,197,94,0.3)] flex items-center justify-center p-1 shrink-0 group-hover:border-emerald-400/80 transition`}
        >
          {/* Subtle neon corner glows */}
          <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-emerald-400/40 rounded-full blur-[2px] pointer-events-none" />
          <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-yellow-400/40 rounded-full blur-[2px] pointer-events-none" />

          <svg viewBox="0 0 40 40" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bd-green" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#86EFAC" />
                <stop offset="50%" stopColor="#22C55E" />
                <stop offset="100%" stopColor="#15803D" />
              </linearGradient>
              <linearGradient id="bd-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF275" />
                <stop offset="50%" stopColor="#FACC15" />
                <stop offset="100%" stopColor="#CA8A04" />
              </linearGradient>
              <filter id="bd-neon-green" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="2.2" floodColor="#22C55E" floodOpacity="0.85" />
              </filter>
              <filter id="bd-neon-gold" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#EAB308" floodOpacity="0.8" />
              </filter>
            </defs>
            {/* Background Shield Outline */}
            <path
              d="M20 3 L35 9 L35 22 C35 31 20 37 20 37 C20 37 5 31 5 22 L5 9 Z"
              fill="#0F172A"
              stroke="#334155"
              strokeWidth="1.5"
            />
            {/* Stylized 'B' in Neon Green */}
            <path
              d="M10 11 H18 C22 11 22 17 18 17 C22.5 17 22.5 25 17.5 25 H10 V11 Z"
              fill="none"
              stroke="url(#bd-green)"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#bd-neon-green)"
            />
            {/* Stylized 'D' wing in Neon Gold */}
            <path
              d="M19 11 H23 C29 11 32 16 32 20 C32 25 28 29 22 29 H18"
              fill="none"
              stroke="url(#bd-gold)"
              strokeWidth="2.6"
              strokeLinecap="round"
              filter="url(#bd-neon-gold)"
            />
          </svg>
        </div>

        {/* Exact Text Logo: BDLiveBet.vip */}
        <div className="flex items-center leading-none tracking-tight font-black font-['Montserrat',sans-serif]">
          {/* 'BD' in glowing vibrant neon green */}
          <span
            className={`${sizeClasses.text} font-black bg-gradient-to-b from-[#A7F3D0] via-[#22C55E] to-[#15803D] bg-clip-text text-transparent drop-shadow-[0_0_14px_rgba(34,197,94,0.9)]`}
          >
            BD
          </span>

          {/* 'Live' in glowing neon yellow/gold with live pulse indicator */}
          <span
            className={`${sizeClasses.text} font-black bg-gradient-to-b from-[#FEF08A] via-[#FACC15] to-[#EAB308] bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(250,204,21,0.8)] ml-0.5 flex items-center`}
          >
            Live
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#22c55e] ml-1 animate-pulse" />
          </span>

          {/* 'Bet' in crisp metallic white with ambient glow */}
          <span
            className={`${sizeClasses.text} font-black text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] ml-0.5`}
          >
            Bet
          </span>

          {/* '.vip' Badge */}
          <span
            className={`ml-1.5 ${sizeClasses.vip} rounded-md bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black tracking-wider uppercase shadow-[0_0_12px_rgba(250,204,21,0.6)] border border-yellow-200/80 inline-flex items-center`}
          >
            .vip
          </span>
        </div>
      </div>

      {/* Subtitle / Verification URL */}
      {showSubtitle && (
        <span
          className={`font-mono tracking-widest text-slate-400 font-semibold text-center -mt-0.5 opacity-90 ${sizeClasses.sub}`}
        >
          — BDLiveBet.vip —
        </span>
      )}
    </div>
  );
};
