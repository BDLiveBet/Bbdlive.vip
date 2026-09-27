import React from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { MAJOR_PROVIDERS } from '../data/mockData';

interface ProviderAndCategoryCardsProps {
  language: Language;
  onSelectProvider: (provider: string) => void;
  onSelectCategory: (category: string) => void;
  activeProvider: string;
  activeCategory: string;
  onOpenLobby?: (provider?: string, category?: string) => void;
}

export const ProviderAndCategoryCards: React.FC<ProviderAndCategoryCardsProps> = ({
  language,
  onSelectProvider,
  onSelectCategory,
  activeProvider,
  activeCategory,
  onOpenLobby
}) => {
  const handleProviderClick = (prov: string) => {
    onSelectProvider(prov);
    if (onOpenLobby) {
      onOpenLobby(prov, activeCategory === 'all' ? 'slot' : activeCategory);
    }
  };

  const handleCategoryClick = (cat: string) => {
    onSelectCategory(cat);
    if (onOpenLobby) {
      onOpenLobby('ALL', cat);
    }
  };

  return (
    <div className="space-y-3 my-2.5">
      {/* 1. Major Providers Filter Tabs (Horizontal Scrollable Pills) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-400">
            <Sparkles className="w-4 h-4" />
            <span>{language === 'bn' ? 'গেম প্রভাইডার ফিল্টার' : 'Game Providers'}</span>
          </div>
          {onOpenLobby && (
            <button
              type="button"
              onClick={() => onOpenLobby('ALL', 'slot')}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-amber-400 font-semibold transition cursor-pointer"
            >
              <span>{language === 'bn' ? 'সকল প্রভাইডার' : 'All Providers'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Horizontal Provider Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {MAJOR_PROVIDERS.map((prov) => {
            const isSelected = activeProvider === prov.id;
            return (
              <button
                key={prov.id}
                type="button"
                onClick={() => handleProviderClick(prov.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-bold whitespace-nowrap transition-all select-none shadow-sm active:scale-95 cursor-pointer min-h-[38px] ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500/30 to-yellow-500/30 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                    : 'bg-[#181E2E] border-slate-700/60 text-slate-300 hover:border-slate-500 hover:text-white'
                }`}
              >
                <span className="text-sm sm:text-base">{prov.logo}</span>
                <span>{prov.short}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Featured Big Provider Cards (JILI স্লট and PG স্লট) */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:gap-6">
        {/* JILI Slot Card */}
        <button
          id="btn-provider-jili"
          data-provider="JILI"
          data-edge="gold"
          type="button"
          onClick={() => handleProviderClick('JILI')}
          className={`flex items-center justify-center gap-2.5 sm:gap-4 py-3 sm:py-4 md:py-5 px-3 sm:px-6 rounded-xl border transition-all active:scale-95 shadow-md cursor-pointer ${
            activeProvider === 'JILI'
              ? 'bg-gradient-to-r from-[#2a2215] to-[#3a2e16] border-amber-400 shadow-[0_0_12px_rgba(255,215,0,0.3)]'
              : 'bg-gradient-to-r from-[#171d2b] to-[#1f2638] border-slate-700/60 hover:border-amber-400/50'
          }`}
        >
          {/* Metallic Gold JILI Logo */}
          <span className="font-['Montserrat',sans-serif] font-black text-xl sm:text-2xl md:text-3xl tracking-tight bg-gradient-to-b from-[#FFF275] via-[#FFD700] to-[#B37400] bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(255,215,0,0.5)]">
            JILI
          </span>
          <span className="text-sm sm:text-base font-bold text-amber-300">
            {language === 'bn' ? 'JILI স্লট' : 'JILI Slots'}
          </span>
        </button>

        {/* PG Slot Card */}
        <button
          id="btn-provider-pg"
          data-provider="PG"
          data-edge="cyan"
          type="button"
          onClick={() => handleProviderClick('PG')}
          className={`flex items-center justify-center gap-2.5 sm:gap-4 py-3 sm:py-4 md:py-5 px-3 sm:px-6 rounded-xl border transition-all active:scale-95 shadow-md cursor-pointer ${
            activeProvider === 'PG'
              ? 'bg-gradient-to-r from-[#17253b] to-[#1e3456] border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.3)]'
              : 'bg-gradient-to-r from-[#171d2b] to-[#1f2638] border-slate-700/60 hover:border-cyan-400/50'
          }`}
        >
          {/* Pixel Disco PG Logo */}
          <div className="flex items-center font-['Montserrat',sans-serif] font-black text-xl sm:text-2xl md:text-3xl tracking-tight">
            <span className="bg-gradient-to-b from-cyan-300 via-sky-400 to-blue-600 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(56,189,248,0.5)]">
              P
            </span>
            <span className="bg-gradient-to-b from-purple-300 via-pink-400 to-rose-500 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(244,63,94,0.5)]">
              G
            </span>
          </div>
          <span className="text-sm sm:text-base font-bold text-cyan-200">
            {language === 'bn' ? 'PG স্লট' : 'PG Soft'}
          </span>
        </button>
      </div>

      {/* 3. Category Tabs Grid (স্লট খেলা, লাইভ ক্যাসিনো, মাছ ধরা, ক্র্যাশ ও স্পোর্টস) */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {/* Slot Game */}
        <button
          id="btn-category-slot"
          type="button"
          onClick={() => handleCategoryClick('slot')}
          className={`flex flex-col items-center justify-center p-2.5 sm:p-3.5 md:p-4 rounded-xl border transition-all active:scale-95 shadow-sm text-center cursor-pointer ${
            activeCategory === 'slot'
              ? 'bg-[#242c42] border-amber-400/80 text-amber-300'
              : 'bg-[#181e2e] border-slate-700/50 text-slate-200 hover:bg-[#20273a]'
          }`}
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-amber-600 to-amber-900 border border-amber-400/60 flex items-center justify-center shadow-inner mb-1.5">
            <span className="text-xs sm:text-sm font-black text-amber-200 font-mono tracking-tighter">777</span>
          </div>
          <span className="text-xs sm:text-sm font-bold block truncate w-full">
            {language === 'bn' ? 'স্লট খেলা' : 'Slots'}
          </span>
        </button>

        {/* Live Casino */}
        <button
          id="btn-category-live"
          type="button"
          onClick={() => handleCategoryClick('live')}
          className={`flex flex-col items-center justify-center p-2.5 sm:p-3.5 md:p-4 rounded-xl border transition-all active:scale-95 shadow-sm text-center cursor-pointer ${
            activeCategory === 'live'
              ? 'bg-[#242c42] border-amber-400/80 text-amber-300'
              : 'bg-[#181e2e] border-slate-700/50 text-slate-200 hover:bg-[#20273a]'
          }`}
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-red-700 to-red-950 border border-amber-400/60 flex items-center justify-center shadow-inner mb-1.5">
            <span className="text-base sm:text-lg">🎡</span>
          </div>
          <span className="text-xs sm:text-sm font-bold block truncate w-full">
            {language === 'bn' ? 'লাইভ ক্যাসিনো' : 'Live Casino'}
          </span>
        </button>

        {/* Fishing Game */}
        <button
          id="btn-category-fish"
          type="button"
          onClick={() => handleCategoryClick('fish')}
          className={`flex flex-col items-center justify-center p-2.5 sm:p-3.5 md:p-4 rounded-xl border transition-all active:scale-95 shadow-sm text-center cursor-pointer ${
            activeCategory === 'fish'
              ? 'bg-[#242c42] border-amber-400/80 text-amber-300'
              : 'bg-[#181e2e] border-slate-700/50 text-slate-200 hover:bg-[#20273a]'
          }`}
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-amber-700 border border-amber-300/60 flex items-center justify-center shadow-inner mb-1.5">
            <span className="text-base sm:text-lg">🐟</span>
          </div>
          <span className="text-xs sm:text-sm font-bold block truncate w-full">
            {language === 'bn' ? 'মাছ ধরা' : 'Fishing'}
          </span>
        </button>

        {/* Sportsbook & Crash Games */}
        <button
          id="btn-category-sports"
          type="button"
          onClick={() => handleCategoryClick('sports')}
          className={`flex flex-col items-center justify-center p-2.5 sm:p-3.5 md:p-4 rounded-xl border transition-all active:scale-95 shadow-sm text-center cursor-pointer ${
            activeCategory === 'sports'
              ? 'bg-[#242c42] border-amber-400/80 text-amber-300'
              : 'bg-[#181e2e] border-slate-700/50 text-slate-200 hover:bg-[#20273a]'
          }`}
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-rose-600 to-purple-800 border border-amber-400/60 flex items-center justify-center shadow-inner mb-1.5">
            <span className="text-base sm:text-lg">🚀</span>
          </div>
          <span className="text-xs sm:text-sm font-bold block truncate w-full">
            {language === 'bn' ? 'ক্র্যাশ ও স্পোর্টস' : 'Crash & Sports'}
          </span>
        </button>
      </div>
    </div>
  );
};
