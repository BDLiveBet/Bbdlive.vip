import React from 'react';
import { RotateCw, Download, Headphones, Volume2, Globe } from 'lucide-react';
import { Language } from '../types';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  onToggleDrawer: () => void;
  isDrawerOpen: boolean;
  walletBalance: number;
  onRefreshBalance: () => void;
  isRefreshing: boolean;
  onOpenDeposit: () => void;
  language: Language;
  onLanguageChange?: (lang: Language) => void;
  onAppDownload?: () => void;
  onOpenSupport?: () => void;
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleDrawer,
  isDrawerOpen,
  walletBalance,
  onRefreshBalance,
  isRefreshing,
  onOpenDeposit,
  language,
  onLanguageChange,
  onAppDownload,
  onOpenSupport,
  activeCategory,
  onSelectCategory
}) => {
  const topCategories = [
    { id: 'hot', labelBn: 'গরম খেলা', labelEn: 'Hot Games', icon: '🔥' },
    { id: 'slot', labelBn: 'স্লটস গেম', labelEn: 'Slot Games', icon: '🎰' },
    { id: 'live', labelBn: 'লাইভ ক্যাসিনো', labelEn: 'Live Casino', icon: '👑' },
    { id: 'fish', labelBn: 'মাছ ধরা খেলা', labelEn: 'Fishing', icon: '🎣' },
    { id: 'sports', labelBn: 'স্পোর্টস / ক্র্যাশ', labelEn: 'Sports & Crash', icon: '🚀' },
    { id: 'poker', labelBn: 'পোকার খেলা', labelEn: 'Poker Games', icon: '♠️' },
    { id: 'lottery', labelBn: 'লটারি খেলা', labelEn: 'Lottery', icon: '🎲' }
  ];

  return (
    <header id="header-main" className="sticky top-0 z-40 bg-[#0F172A] border-b border-slate-800 shadow-xl">
      {/* 1. Top Mini Utility Bar: Language & Currency Selector + Quick Action Buttons */}
      <div className="w-full bg-[#090D16] border-b border-slate-800/80 px-2 sm:px-4 md:px-6 lg:px-8 py-1.5 flex items-center justify-between text-xs text-slate-300">
        {/* Left: Language & Currency */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <button
            type="button"
            onClick={() => onLanguageChange && onLanguageChange(language === 'bn' ? 'en' : 'bn')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#1E293B] border border-slate-700/80 hover:bg-slate-700 text-amber-400 font-bold transition-all active:scale-95 active:translate-y-0.5 duration-150 select-none shadow-sm text-xs"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? '🇧🇩 বাংলা' : '🇬🇧 English'}</span>
          </button>

          {/* Currency Indicator */}
          <div className="flex items-center gap-0.5 px-2 py-1 rounded bg-[#161F30] text-emerald-400 font-mono font-bold text-xs">
            <span>৳ BDT</span>
          </div>
        </div>

        {/* Right: Quick Action Buttons (Download App APK & 24/7 Support) */}
        <div className="flex items-center gap-1.5">
          {/* Download App (APK) Button */}
          <button
            type="button"
            data-edge="gold"
            onClick={onAppDownload}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all active:scale-95 active:translate-y-0.5 duration-150 text-xs font-bold shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'অ্যাপ ডাউনলোড' : 'Download APK'}</span>
          </button>

          {/* Customer Support Quick Button */}
          <button
            type="button"
            data-edge="cyan"
            onClick={onOpenSupport}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all active:scale-95 active:translate-y-0.5 duration-150 text-xs font-semibold border border-slate-700/50 shadow-sm"
          >
            <Headphones className="w-3.5 h-3.5 text-cyan-400" />
            <span>{language === 'bn' ? 'সাপোর্ট' : 'Support'}</span>
          </button>
        </div>
      </div>

      {/* 2. Main Brand Navbar */}
      <div className="w-full flex items-center justify-between px-2 sm:px-4 md:px-6 lg:px-8 py-2">
        {/* Left: Hamburger Menu + BDLiveBet.vip Logo */}
        <div className="flex items-center gap-2.5">
          <button
            id="btn-sidebar-toggle"
            type="button"
            onClick={onToggleDrawer}
            aria-label="Toggle navigation menu"
            className="flex flex-col justify-center gap-1.5 w-8 h-8 p-1.5 rounded-lg hover:bg-slate-800 active:scale-95 active:translate-y-0.5 transition-all duration-150 focus:outline-none"
          >
            <span className={`block h-[3px] rounded-full bg-gradient-to-r from-[#F59E0B] to-[#FCD34D] transition-all duration-300 ${isDrawerOpen ? 'w-6 rotate-45 translate-y-[7.5px]' : 'w-6'}`} />
            <span className={`block h-[3px] rounded-full bg-gradient-to-r from-[#F59E0B] to-[#FCD34D] transition-all duration-300 ${isDrawerOpen ? 'opacity-0' : 'w-5'}`} />
            <span className={`block h-[3px] rounded-full bg-gradient-to-r from-[#F59E0B] to-[#FCD34D] transition-all duration-300 ${isDrawerOpen ? 'w-6 -rotate-45 -translate-y-[7.5px]' : 'w-6'}`} />
          </button>

          {/* BDLiveBet.vip Brand Logo with glowing neon gold & green accents */}
          <BrandLogo
            size="md"
            onClick={() => onSelectCategory('all')}
          />
        </div>

        {/* Right: Wallet Balance & Deposit Quick Button */}
        <div className="flex items-center gap-2">
          {/* Wallet pill */}
          <div className="flex flex-col items-end bg-[#1E293B] border border-slate-700/80 rounded-lg px-2.5 py-1 shadow-inner">
            <span className="text-xs text-[#9CA3AF] leading-tight font-medium">
              {language === 'bn' ? 'আমার ব্যালেন্স' : 'My Balance'}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-sm md:text-base font-bold text-[#F59E0B] font-mono tracking-wide">
                ৳ {walletBalance.toFixed(2)}
              </span>
              <button
                id="btn-refresh-balance"
                type="button"
                onClick={onRefreshBalance}
                title={language === 'bn' ? 'ব্যালেন্স রিফ্রেশ করুন' : 'Refresh balance'}
                className="text-[#9CA3AF] hover:text-[#F59E0B] active:scale-95 active:translate-y-0.5 transition-all duration-150 p-1 rounded-md hover:bg-slate-800/60 cursor-pointer"
              >
                <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#F59E0B]' : ''}`} />
              </button>
            </div>
          </div>

          {/* Solid Emerald / Gold Quick Deposit Action Button */}
          <button
            id="btn-header-deposit"
            data-edge="emerald"
            data-action="deposit"
            type="button"
            onClick={onOpenDeposit}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg btn-tactile-gold font-bold shadow-[0_3px_10px_rgba(245,158,11,0.4)] active:scale-95 active:translate-y-0.5 transition-all duration-150 border border-amber-300/80 hover:brightness-110 cursor-pointer"
            title={language === 'bn' ? 'ডিপোজিট করুন' : 'Deposit'}
          >
            <span className="text-base font-bold select-none">৳</span>
            <span className="text-xs font-bold hidden xs:inline">{language === 'bn' ? 'ডিপোজিট' : 'Deposit'}</span>
          </button>
        </div>
      </div>

      {/* 3. Marquee / Announcement Running Bar below top navigation */}
      <div className="w-full bg-[#0B0F17] border-y border-slate-800/90 py-1.5 px-2 sm:px-4 md:px-6 lg:px-8 flex items-center gap-2 overflow-hidden text-xs">
        <div className="flex items-center gap-1.5 shrink-0 text-[#F59E0B] font-bold">
          <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="text-xs uppercase tracking-wider">{language === 'bn' ? 'বিজ্ঞপ্তি' : 'NOTICE'}</span>
          <span className="text-slate-600 font-bold">|</span>
        </div>
        <div className="overflow-hidden whitespace-nowrap relative flex-1">
          <div className="animate-marquee inline-block text-xs font-medium text-slate-200">
            {language === 'bn'
              ? '🔥 স্বাগতম BDLiveBet.vip-তে! প্রথম ডিপোজিটে ১২৮% ওয়েলকাম বোনাস উপভোগ করুন! ⚡ bKash, Nagad ও Rocket-এ ইনস্ট্যান্ট উইথড্রয়াল এবং ডিপোজিট সেবা সক্রিয়! 🎰 JILI, PG ও লাইভ ক্যাসিনোতে মেগা জ্যাকপট ড্রপ চলছে! 💎 24/7 ভিআইপি লাইভ চ্যাট সাপোর্ট উপলব্ধ।'
              : '🔥 Welcome to BDLiveBet.vip! Enjoy 128% Welcome Bonus on 1st Deposit! ⚡ Instant bKash, Nagad & Rocket withdrawals active! 🎰 Mega Progressive Jackpots live on JILI, PG & Live Casino! 💎 24/7 VIP Live Support available.'}
          </div>
        </div>
      </div>

      {/* 4. Top Category Horizontal Scroll Bar */}
      <div className="w-full flex items-center gap-2.5 overflow-x-auto no-scrollbar px-3 sm:px-6 md:px-8 py-2.5 bg-[#0F172A] border-t border-slate-800/80">
        {topCategories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              id={`cat-nav-${cat.id}`}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2.5 px-4.5 py-2.5 sm:px-5 sm:py-3 rounded-full whitespace-nowrap text-sm sm:text-base transition-all duration-150 active:scale-95 cursor-pointer min-h-[46px] sm:min-h-[50px] select-none ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500/30 via-amber-400/25 to-yellow-500/30 text-amber-300 border-2 border-amber-400 shadow-[0_0_14px_rgba(245,158,11,0.4)] font-bold'
                  : 'bg-[#182133] text-slate-300 hover:text-white hover:bg-slate-700/80 border border-slate-700/80 font-semibold'
              }`}
            >
              <span className="text-xl sm:text-2xl leading-none">{cat.icon}</span>
              <span className="tracking-tight">{language === 'bn' ? cat.labelBn : cat.labelEn}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
