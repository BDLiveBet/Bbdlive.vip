import React, { useState, useEffect, useRef } from 'react';
import { Trophy } from 'lucide-react';
import { PRESET_AVATARS } from '../data/avatars';

interface LiveWinnerFeedProps {
  language: 'bn' | 'en';
  className?: string;
}

interface WinnerItem {
  id: string;
  user: string;
  avatarUrl: string;
  amount: number;
  timeAgoBn: string;
  timeAgoEn: string;
}

const PREFIXES = [
  'sh', 'bd', 'ak', 'tan', 'rok', 'mim', 'sa', 'fa', 'kam', 'has',
  'rah', 'md', 'al', 'na', 'joy', 'rub', 'sum', 'arif', 'mon', 'top',
  'kab', 'hab', 'rak', 'naz', 'nil', 'tam', 'ash', 'suf', 'mun', 'pri'
];

function toBengaliDigits(numStr: string): string {
  const bnMap: { [k: string]: string } = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯',
    ',': ',', '.': '.'
  };
  return numStr.replace(/[0-9,.]/g, (ch) => bnMap[ch] || ch);
}

function getRandomPresetAvatar(): string {
  const randomIndex = Math.floor(Math.random() * PRESET_AVATARS.length);
  return PRESET_AVATARS[randomIndex]?.url || PRESET_AVATARS[0].url;
}

function generateRandomWinner(): WinnerItem {
  const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
  const suffix = Math.floor(Math.random() * 90 + 10); // 2 digit suffix e.g. 10-99
  const user = `${prefix}***${suffix % 10}`;
  
  // Random amount between 100.00 and 10,000.00, weighted with realistic values
  const weights = [
    150, 240, 308, 450, 680, 850, 1100, 1280, 1750, 2100, 2450, 
    3200, 3500, 4200, 5000, 6400, 7200, 8400, 9500, 9880
  ];
  const baseAmt = weights[Math.floor(Math.random() * weights.length)];
  // Add slight random offset
  const amount = baseAmt + Math.floor(Math.random() * 9) * 10;
  
  return {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    user,
    avatarUrl: getRandomPresetAvatar(),
    amount,
    timeAgoBn: 'এইমাত্র',
    timeAgoEn: 'Just now'
  };
}

const INITIAL_WINNERS: WinnerItem[] = [
  {
    id: 'w-1',
    user: 'sh***9',
    avatarUrl: PRESET_AVATARS[0]?.url || '',
    amount: 2450.0,
    timeAgoBn: '১মিনিট আগে',
    timeAgoEn: '1m ago'
  },
  {
    id: 'w-2',
    user: 'bd***2',
    avatarUrl: PRESET_AVATARS[1]?.url || '',
    amount: 1280.0,
    timeAgoBn: '২মিনিট আগে',
    timeAgoEn: '2m ago'
  },
  {
    id: 'w-3',
    user: 'ak***7',
    avatarUrl: PRESET_AVATARS[3]?.url || '',
    amount: 3500.0,
    timeAgoBn: '৩মিনিট আগে',
    timeAgoEn: '3m ago'
  },
  {
    id: 'w-4',
    user: 'tan***9',
    avatarUrl: PRESET_AVATARS[5]?.url || '',
    amount: 450.0,
    timeAgoBn: '৪মিনিট আগে',
    timeAgoEn: '4m ago'
  },
  {
    id: 'w-5',
    user: 'rok***4',
    avatarUrl: PRESET_AVATARS[13]?.url || '',
    amount: 8400.0,
    timeAgoBn: '৫মিনিট আগে',
    timeAgoEn: '5m ago'
  },
  {
    id: 'w-6',
    user: 'mim***1',
    avatarUrl: PRESET_AVATARS[9]?.url || '',
    amount: 1950.0,
    timeAgoBn: '৬মিনিট আগে',
    timeAgoEn: '6m ago'
  }
];

export const LiveWinnerFeed: React.FC<LiveWinnerFeedProps> = ({ language, className = '' }) => {
  const [winners, setWinners] = useState<WinnerItem[]>(INITIAL_WINNERS);
  const [isSliding, setIsSliding] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll loop: Every 2.4 seconds, smoothly slide up by 1 row and append a new winner
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      // Step 1: trigger slide animation
      setIsSliding(true);

      // Step 2: after transition duration (550ms), rotate list and reset transform
      setTimeout(() => {
        setWinners((prev) => {
          const nextItem = generateRandomWinner();
          // Remove top item and append new item to bottom, keeping 8 items in memory
          const updated = [...prev.slice(1), nextItem];
          return updated;
        });
        setIsSliding(false);
      }, 550);
    }, 2400);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  return (
    <div
      id="card-rewarded-live-feed"
      className={`rounded-2xl bg-gradient-to-br from-[#4a148c] via-[#6a1b9a] to-[#7b1fa2] text-white p-4 shadow-lg border border-purple-400/25 space-y-3 relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Ambient background glow */}
      <div className="absolute -right-10 -top-10 w-44 h-44 bg-pink-500/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 w-44 h-44 bg-purple-400/20 rounded-full blur-2xl pointer-events-none" />

      {/* Header: Trophy icon + "যে ব্যক্তি পুরস্কৃত হয়েছে" with pulsing green dot "Live Feed" pill on the right */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0 shadow-xs">
            <Trophy className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-wide leading-tight">
              {language === 'bn' ? 'যে ব্যক্তি পুরস্কৃত হয়েছে' : 'Recently Rewarded Members'}
            </h4>
            <span className="text-xs text-purple-200/80 font-medium">
              {language === 'bn' ? 'বাস্তব সময়ে স্বয়ংক্রিয় পে-আউট' : 'Real-time verified cashouts'}
            </span>
          </div>
        </div>

        {/* Live Feed Badge with pulsing green dot */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/30 border border-emerald-400/40 backdrop-blur-xs text-xs font-semibold text-white shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-['Poppins',sans-serif] tracking-wide text-emerald-300 font-bold text-xs">
            Live Feed
          </span>
        </div>
      </div>

      {/* Smooth Upward Vertical Auto-Scroll Area:
          Shows ~4-5 rows simultaneously in a clean container with subtle gradient fade masks at top and bottom */}
      <div className="relative h-[216px] overflow-hidden rounded-xl bg-purple-950/20 p-1">
        {/* Subtle Top & Bottom Gradient Shadows for elegant fade */}
        <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-[#5c1890] to-transparent z-10 pointer-events-none opacity-80" />
        <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-[#6f1d9d] to-transparent z-10 pointer-events-none opacity-80" />

        {/* Sliding Vertical Container:
            Row height is 44px + 6px gap = 50px per row */}
        <div
          className="space-y-1.5 transition-transform ease-in-out"
          style={{
            transform: isSliding ? 'translateY(-50px)' : 'translateY(0px)',
            transitionDuration: isSliding ? '550ms' : '0ms'
          }}
        >
          {winners.slice(0, 6).map((item) => {
            const formattedAmount = item.amount.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            });
            const displayAmount = language === 'bn'
              ? `৳ ${toBengaliDigits(formattedAmount)}`
              : `৳ ${formattedAmount}`;

            return (
              <div
                key={item.id}
                className="bg-white hover:bg-slate-50 transition-colors text-slate-800 rounded-full px-3 py-1.5 flex items-center justify-between text-xs font-bold shadow-sm border border-white/60 h-[44px]"
              >
                {/* Left: Avatar Preset Thumbnail + User ID */}
                <div className="flex items-center gap-2 min-w-0">
                  {/* Crisp circular container with preset avatar image */}
                  <img
                    src={item.avatarUrl}
                    alt={item.user}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-full object-cover border border-amber-400/40 shadow-sm shrink-0 bg-slate-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = PRESET_AVATARS[0].url;
                    }}
                  />

                  {/* Masked User ID */}
                  <span className="font-['Poppins',sans-serif] text-slate-700 font-bold tracking-tight text-xs sm:text-sm truncate">
                    {item.user}
                  </span>
                </div>

                {/* Center: Status Badge ('গৃহীত' / 'Received') */}
                <div className="shrink-0 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 font-extrabold text-xs border border-purple-200/80">
                  {language === 'bn' ? 'গৃহীত' : 'Received'}
                </div>

                {/* Right: Green/Gold Bold Amount */}
                <div className="shrink-0 text-right">
                  <span className="font-['Poppins',sans-serif] font-black text-emerald-600 text-xs sm:text-sm tracking-tight drop-shadow-[0_0.5px_0_rgba(0,0,0,0.05)]">
                    {displayAmount}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
