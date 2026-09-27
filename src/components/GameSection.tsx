import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Heart, Play } from 'lucide-react';
import { GameItem, Language } from '../types';

interface GameSectionProps {
  id: string;
  titleBn: string;
  titleEn: string;
  games: GameItem[];
  language: Language;
  favorites: string[];
  onToggleFavorite: (gameId: string) => void;
  onSelectGame: (game: GameItem) => void;
  onViewAll?: () => void;
}

export const GameSection: React.FC<GameSectionProps> = ({
  id,
  titleBn,
  titleEn,
  games,
  language,
  favorites,
  onToggleFavorite,
  onSelectGame,
  onViewAll
}) => {
  const [page, setPage] = useState(0);
  const itemsPerPage = 12;
  const maxPages = Math.ceil(games.length / itemsPerPage);

  const displayedGames = games.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  const handlePrev = () => {
    setPage((prev) => (prev > 0 ? prev - 1 : maxPages - 1));
  };

  const handleNext = () => {
    setPage((prev) => (prev < maxPages - 1 ? prev + 1 : 0));
  };

  return (
    <section id={`section-${id}`} className="my-3.5">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-2.5 px-0.5">
        {/* Title with Gold Vertical Bar */}
        <div className="flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-[#F59E0B] block shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
          <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
            {language === 'bn' ? titleBn : titleEn}
          </h3>
        </div>

        {/* Navigation Controls: < [অধিক] > */}
        <div className="flex items-center gap-1.5">
          {/* Prev button */}
          <button
            id={`btn-prev-${id}`}
            type="button"
            onClick={handlePrev}
            aria-label="Previous games"
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#1E293B] hover:bg-[#2A374D] text-[#9CA3AF] hover:text-white border border-slate-700/60 transition active:scale-95 text-xs"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* More / View All button */}
          <button
            id={`btn-more-${id}`}
            type="button"
            onClick={onViewAll || handleNext}
            className="px-2.5 h-7 flex items-center justify-center rounded-lg bg-[#1E293B] hover:bg-[#2A374D] text-[#9CA3AF] hover:text-[#F59E0B] border border-slate-700/60 transition active:scale-95 text-xs font-semibold"
          >
            {language === 'bn' ? 'অধিক' : 'More'}
          </button>

          {/* Next button */}
          <button
            id={`btn-next-${id}`}
            type="button"
            onClick={handleNext}
            aria-label="Next games"
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#1E293B] hover:bg-[#2A374D] text-[#9CA3AF] hover:text-white border border-slate-700/60 transition active:scale-95 text-xs"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3-Column Games Grid on Mobile and Tablet, 6 columns on Desktop */}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 sm:gap-2.5 md:grid-cols-3 md:gap-3 lg:grid-cols-6 lg:gap-3.5">
        {displayedGames.map((game) => {
          const isFav = favorites.includes(game.id);

          return (
            <div
              key={game.id}
              id={`game-card-${game.id}`}
              className="flex flex-col group cursor-pointer bg-gradient-to-b from-[#1C2538] via-[#161D2C] to-[#101520] rounded-xl overflow-hidden border border-slate-700/80 hover:border-amber-400/90 shadow-[0_4px_14px_rgba(0,0,0,0.55)] hover:shadow-[0_0_18px_rgba(245,158,11,0.3)] transition-all duration-300 active:scale-[0.97]"
              onClick={() => onSelectGame(game)}
            >
              {/* Card Image Thumbnail Container */}
              <div className="relative aspect-square w-full overflow-hidden bg-[#141A24]">
                <img
                  src={game.image}
                  alt={game.titleEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />

                {/* Hot Fire Badge if Hot (Top-Left) */}
                {game.isHot && (
                  <div className="absolute top-1.5 left-1.5 bg-gradient-to-r from-red-600 to-rose-700 text-white text-xs font-black px-2 py-0.5 rounded-[6px] shadow-md border border-rose-400/40 flex items-center gap-0.5 z-10">
                    <span>🔥</span>
                    <span className="hidden sm:inline">HOT</span>
                  </div>
                )}

                {/* Heart Favorite Button (Top-Right) */}
                <button
                  id={`btn-fav-${game.id}`}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(game.id);
                  }}
                  title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                  className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm transition-all duration-200 text-white z-10 border border-white/10 active:scale-90"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      isFav ? 'fill-rose-500 text-rose-500' : 'text-slate-300 hover:text-white'
                    }`}
                  />
                </button>

                {/* Compact Golden Provider Badge Strictly at Bottom-Right Corner */}
                <div className="absolute bottom-1.5 right-1.5 z-10 pointer-events-none">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-[6px] bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 font-black text-xs tracking-wider uppercase shadow-[0_2px_5px_rgba(0,0,0,0.8)] border border-yellow-200/50">
                    {game.provider}
                  </span>
                </div>

                {/* Hover Play Overlay */}
                <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.6)] transform scale-90 group-hover:scale-100 transition-transform">
                    <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Game Title Underneath Card with High-Contrast White/Gold Gradient Typography */}
              <div className="py-2 px-1 sm:px-1.5 text-center bg-[#101520]/90 border-t border-slate-800/80">
                <span
                  className="text-xs sm:text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-amber-200 group-hover:from-amber-300 group-hover:via-yellow-300 group-hover:to-amber-400 transition-all duration-200 block truncate tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
                  title={language === 'bn' ? game.titleBn : game.titleEn}
                >
                  {language === 'bn' ? game.titleBn : game.titleEn}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
