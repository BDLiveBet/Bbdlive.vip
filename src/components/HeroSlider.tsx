import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { PROMO_BANNERS } from '../data/mockData';
import { Language } from '../types';

interface HeroSliderProps {
  language: Language;
  onClaimPromo: (promoId?: string) => void;
  onOpenDeposit?: () => void;
  onOpenVIP?: () => void;
  onOpenLobby?: (provider: string, category: string) => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({
  language,
  onClaimPromo,
  onOpenDeposit,
  onOpenVIP,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const touchStartXRef = useRef<number | null>(null);

  const totalBanners = PROMO_BANNERS.length;

  // Slide navigation with wrap-around
  const prevSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + totalBanners) % totalBanners);
  };

  const nextSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % totalBanners);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-playing timer (5 seconds per slide, pauses on hover/touch)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalBanners);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, totalBanners]);

  // Touch Swipe Handlers for Mobile Devices
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartXRef.current = null;
  };

  const handleBannerAction = (banner: (typeof PROMO_BANNERS)[0]) => {
    if (banner.actionType === 'deposit' && onOpenDeposit) {
      onOpenDeposit();
    } else if (banner.actionType === 'vip' && onOpenVIP) {
      onOpenVIP();
    } else {
      onClaimPromo(banner.id);
    }
  };

  return (
    <div
      id="hero-slider"
      className="relative w-full aspect-[16/8] sm:aspect-[21/9] rounded-2xl overflow-hidden shadow-xl border border-amber-500/30 bg-slate-950 group select-none transition-all my-2"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Smooth CSS Slide Transition Track */}
      <div
        className="flex w-full h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {PROMO_BANNERS.map((banner) => (
          <div
            key={banner.id}
            className="min-w-full w-full h-full relative cursor-pointer overflow-hidden select-none shrink-0"
            onClick={() => handleBannerAction(banner)}
          >
            {/* Banner Artwork: w-full h-full object-cover with rounded-2xl and zero empty space */}
            <img
              src={banner.image}
              alt={language === 'bn' ? banner.titleBn : banner.titleEn}
              className="w-full h-full object-cover rounded-2xl select-none pointer-events-none"
              referrerPolicy="no-referrer"
            />

            {/* Subtle Gradient Overlay for Text & Indicator Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent pointer-events-none" />

            {/* Tag Badge on Top Left */}
            {(banner.tagBn || banner.tagEn) && (
              <div className="absolute top-2.5 left-3 sm:top-3.5 sm:left-4 z-10 pointer-events-none">
                <span className="px-3 sm:px-3.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-300 border border-amber-400/40 text-xs sm:text-sm font-black shadow-md uppercase tracking-wider">
                  {language === 'bn' ? banner.tagBn : banner.tagEn}
                </span>
              </div>
            )}

            {/* Quick Action Button on Bottom Right */}
            <div className="absolute bottom-2.5 right-3 sm:bottom-3.5 sm:right-5 z-10">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBannerAction(banner);
                }}
                className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 text-xs sm:text-sm font-black shadow-[0_0_12px_rgba(245,158,11,0.6)] border border-yellow-200/80 hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                <span>{language === 'bn' ? banner.ctaTextBn || 'খেলুন' : banner.ctaTextEn || 'Play Now'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Left Arrow Navigation Button (‹): Centered on left edge inside banner */}
      <button
        type="button"
        id="hero-nav-prev"
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-amber-400 border border-amber-500/20 active:scale-95 hover:bg-black/60 hover:text-amber-300 transition-all shadow-md"
      >
        <ChevronLeft className="w-5 h-5 -translate-x-0.5" />
      </button>

      {/* Right Arrow Navigation Button (›): Centered on right edge inside banner */}
      <button
        type="button"
        id="hero-nav-next"
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-amber-400 border border-amber-500/20 active:scale-95 hover:bg-black/60 hover:text-amber-300 transition-all shadow-md"
      >
        <ChevronRight className="w-5 h-5 translate-x-0.5" />
      </button>

      {/* Pagination Indicator Dots: Cleanly overlayed inside bottom of banner */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 pointer-events-auto">
        {PROMO_BANNERS.map((_, idx) => {
          const isSelected = currentIndex === idx;
          return (
            <button
              key={idx}
              type="button"
              id={`hero-dot-${idx}`}
              onClick={(e) => {
                e.stopPropagation();
                goToSlide(idx);
              }}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                isSelected
                  ? 'w-5 bg-gradient-to-r from-amber-400 to-yellow-300 shadow-[0_0_8px_#F59E0B]'
                  : 'w-1.5 bg-white/40 hover:bg-white/80'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};
