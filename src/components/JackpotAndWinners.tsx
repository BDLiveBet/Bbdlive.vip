import React, { useState, useEffect } from 'react';
import { Trophy, Sparkles, Flame, DollarSign } from 'lucide-react';
import { RECENT_WINNERS } from '../data/mockData';
import { Language } from '../types';

interface JackpotAndWinnersProps {
  language: Language;
}

export const JackpotAndWinners: React.FC<JackpotAndWinnersProps> = ({ language }) => {
  const [jackpotAmount, setJackpotAmount] = useState(8429150.32);

  useEffect(() => {
    const interval = setInterval(() => {
      setJackpotAmount((prev) => prev + Number((Math.random() * 2.5 + 0.5).toFixed(2)));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="jackpot-and-winners-container" className="my-4 space-y-3">
      {/* Progressive Jackpot Banner (matches Screenshot 1) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#171a29] via-[#221733] to-[#171a29] border border-amber-500/40 p-4 shadow-xl text-center">
        {/* Glow lights */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-24 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

        {/* Jackpot Header */}
        <div className="relative z-10 flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
          <h4 className="font-['Montserrat',sans-serif] font-black text-lg sm:text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-300 drop-shadow-[0_2px_4px_rgba(255,215,0,0.4)]">
            PROGRESSIVE JACKPOT
          </h4>
          <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
        </div>

        {/* Counter Ticker Display */}
        <div className="relative z-10 mt-1 inline-block px-4 py-1.5 rounded-xl bg-black/60 border border-amber-400/50 shadow-inner">
          <span className="font-mono text-xl sm:text-2xl md:text-3xl font-black text-amber-300 tracking-wider">
            ৳ {jackpotAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Recent Winners Section */}
      <div className="rounded-xl bg-[#181d2c] border border-slate-700/60 p-3 shadow-md">
        <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-slate-700/50">
          <Trophy className="w-4 h-4 text-amber-400" />
          <h4 className="text-xs sm:text-sm font-bold text-slate-100">
            {language === 'bn' ? '🏆 সর্বশেষ বিজয়ীগণ' : '🏆 Recent Winners'}
          </h4>
        </div>

        {/* Winners List Slider / Ticker: 1 col on mobile, 2 on small tablet, 4 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
          {RECENT_WINNERS.slice(0, 4).map((winner, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-lg bg-[#20273a] border border-slate-700/40"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0">
                  {winner.username.charAt(0).toUpperCase()}
                </div>
                <div className="truncate">
                  <span className="font-semibold text-slate-200 block truncate text-xs sm:text-sm">{winner.username}</span>
                  <span className="text-xs text-slate-400">{winner.game}</span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="font-mono font-bold text-amber-300 block text-xs sm:text-sm">
                  +৳{winner.amount.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400">{winner.timeAgo}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
