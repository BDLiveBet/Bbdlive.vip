import React, { useState, useRef, useEffect } from 'react';
import { Home, Gift, Users, Trophy, User } from 'lucide-react';
import { Language } from '../types';

export type TabType = 'home' | 'promotions' | 'agent' | 'rewards' | 'member';

interface BottomNavProps {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
  language: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onChangeTab, language }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return Math.min(window.innerWidth - 24, 480);
    }
    return 420;
  });

  // Track container width accurately for the precision SVG curved dip
  useEffect(() => {
    if (!containerRef.current) return;

    const measure = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width > 0) {
          setContainerWidth(rect.width);
        }
      }
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(containerRef.current);
    window.addEventListener('resize', measure);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  // Geometry calculations for floating pill capsule with center inward concave curve dip
  const h = 76; // Increased capsule height for comfortable touch targets and larger icons
  const r = 26; // Capsule outer corner radius
  const width = Math.max(containerWidth, 280);
  const cx = width / 2; // Exact center
  const dw = 44; // Dip half-width from center (88px total span to comfortably cradle the 64px button)
  const depth = 22; // Inward dip depth in px

  // Smooth continuous Bézier path that seamlessly dips at top-center to cradle the circular button
  const pathData = `
    M ${r} 0
    L ${cx - dw} 0
    C ${cx - 24} 0, ${cx - 18} ${depth}, ${cx} ${depth}
    C ${cx + 18} ${depth}, ${cx + 24} 0, ${cx + dw} 0
    L ${width - r} 0
    A ${r} ${r} 0 0 1 ${width} ${r}
    L ${width} ${h - r}
    A ${r} ${r} 0 0 1 ${width - r} ${h}
    L ${r} ${h}
    A ${r} ${r} 0 0 1 0 ${h - r}
    L 0 ${r}
    A ${r} ${r} 0 0 1 ${r} 0
    Z
  `;

  // Helper to render standard navigation tab items with glowing active pill indicator
  const renderNavTab = (
    tab: TabType,
    labelBn: string,
    labelEn: string,
    Icon: React.ElementType,
    id: string
  ) => {
    const isActive = currentTab === tab;
    return (
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        <button
          id={id}
          type="button"
          onClick={() => onChangeTab(tab)}
          style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
          className="relative w-full h-full flex items-center justify-center overflow-hidden outline-none focus:outline-none focus:ring-0 focus-visible:outline-none border-none cursor-pointer select-none group"
        >
          {/* Internal rounded pill background highlight - inside the button container */}
          <div
            className={`relative flex flex-col items-center justify-center w-[84%] max-w-[74px] py-1.5 px-1 rounded-2xl transition-all duration-200 active:scale-95 outline-none focus:outline-none overflow-hidden ${
              isActive
                ? 'bg-amber-500/15 border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                : 'hover:bg-white/5 border border-transparent'
            }`}
          >
            {/* Icon */}
            <Icon
              className={`w-7 h-7 transition-all duration-150 mb-1 ${
                isActive
                  ? 'stroke-[2.5] text-[#FFC107] drop-shadow-[0_0_6px_rgba(255,193,7,0.5)] scale-105'
                  : 'stroke-[2.2] text-slate-300 group-hover:text-white group-hover:scale-105'
              }`}
            />
            {/* Label */}
            <span
              className={`text-xs font-bold tracking-tight leading-none transition-colors duration-150 ${
                isActive
                  ? 'text-[#FFC107] drop-shadow-[0_0_4px_rgba(255,193,7,0.35)]'
                  : 'text-slate-300 group-hover:text-white'
              }`}
            >
              {language === 'bn' ? labelBn : labelEn}
            </span>
          </div>
        </button>
      </div>
    );
  };

  const isAgentActive = currentTab === 'agent';

  return (
    <nav
      id="bottom-navigation-bar"
      aria-label="Bottom Navigation"
      className="fixed bottom-3 sm:bottom-4 left-3 right-3 sm:left-6 sm:right-6 md:left-1/2 md:-translate-x-1/2 md:w-[500px] md:max-w-lg z-40"
    >
      <div
        ref={containerRef}
        className="relative w-full h-[76px] filter drop-shadow-[0_12px_28px_rgba(0,0,0,0.75)] shadow-2xl backdrop-blur-md"
      >
        {/* Precision SVG Curved Capsule with Smooth Center Dip */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox={`0 0 ${width} ${h}`}
        >
          <defs>
            {/* Dark theme capsule background matching BDLiveBet palette */}
            <linearGradient id="nav-capsule-bg" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#141B2B" stopOpacity="0.97" />
              <stop offset="100%" stopColor="#0B0F19" stopOpacity="0.99" />
            </linearGradient>

            {/* Subtle gold-infused metallic border stroke */}
            <linearGradient id="nav-capsule-border" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#334155" stopOpacity="0.6" />
              <stop offset="35%" stopColor="#475569" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.85" />
              <stop offset="65%" stopColor="#475569" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#334155" stopOpacity="0.6" />
            </linearGradient>
          </defs>

          <path
            d={pathData}
            fill="url(#nav-capsule-bg)"
            stroke="url(#nav-capsule-border)"
            strokeWidth="1.5"
          />
        </svg>

        {/* 5 Navigation Items Layer */}
        <div className="relative z-10 w-full h-full grid grid-cols-5 items-center px-1 sm:px-2">
          {/* 1. Left 1: "হোম" (Home Icon) */}
          {renderNavTab('home', 'হোম', 'Home', Home, 'tab-btn-home')}

          {/* 2. Left 2: "প্রমোশন" (Gift/Promotions Icon) */}
          {renderNavTab('promotions', 'প্রমোশন', 'Promotions', Gift, 'tab-btn-promotions')}

          {/* 3. Center: "এজেন্ট" (Prominent Circular Floating Action Button cradled in the curved dip) */}
          <div className="flex flex-col items-center justify-center relative -top-4 sm:-top-5 z-20">
            <button
              id="tab-btn-agent"
              type="button"
              onClick={() => onChangeTab('agent')}
              style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
              className={`w-16 h-16 sm:w-16 sm:h-16 rounded-full p-1 active:scale-95 transition-all duration-200 cursor-pointer group outline-none focus:outline-none focus:ring-0 focus-visible:outline-none border-0 shadow-lg shadow-amber-500/40 hover:shadow-xl hover:shadow-amber-500/50 ${
                isAgentActive
                  ? 'ring-2 ring-[#FFC107] scale-105'
                  : 'hover:scale-105'
              }`}
              aria-label="Agent portal"
            >
              {/* Outer Golden Gradient Ring */}
              <div className="w-full h-full rounded-full p-0.5 bg-gradient-to-tr from-[#B45309] via-[#F59E0B] to-[#FEF08A] border border-[#FFFBEB]/80 flex items-center justify-center">
                {/* Inner Glowing Center Disc */}
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#D97706] via-[#F59E0B] to-[#FBBF24] flex items-center justify-center shadow-inner">
                  <Users className="w-7 h-7 sm:w-7.5 sm:h-7.5 stroke-[2.4] text-slate-950 group-hover:scale-110 transition-transform duration-200" />
                </div>
              </div>
            </button>

            {/* Label Placed Directly Underneath */}
            <span
              className={`text-xs sm:text-[13px] font-bold tracking-tight leading-none mt-1 transition-colors ${
                isAgentActive
                  ? 'text-[#FFC107] drop-shadow-[0_0_6px_rgba(255,193,7,0.6)]'
                  : 'text-[#FFC107] group-hover:text-amber-300'
              }`}
            >
              {language === 'bn' ? 'এজেন্ট' : 'Agent'}
            </span>
          </div>

          {/* 4. Right 1: "পুরস্কার" (Trophy Icon) */}
          {renderNavTab('rewards', 'পুরস্কার', 'Rewards', Trophy, 'tab-btn-rewards')}

          {/* 5. Right 2: "সদস্য" (Profile Icon) */}
          {renderNavTab('member', 'সদস্য', 'Member', User, 'tab-btn-member')}
        </div>
      </div>
    </nav>
  );
};

