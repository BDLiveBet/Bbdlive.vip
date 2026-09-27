import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  Search,
  X,
  Heart,
  Trophy,
  Flame,
  Fish,
  Sparkles,
  Gamepad2,
  Dice5,
  Activity,
  Zap,
  Play
} from 'lucide-react';
import { GameItem, Language } from '../types';
import { PROVIDERS_LIST, JILI_SLOTS, PG_SLOTS, LIVE_CASINO_GAMES, FISHING_GAMES, HOT_GAMES } from '../data/mockData';

interface GameLobbyViewProps {
  language: Language;
  onBack: () => void;
  selectedProvider: string;
  onSelectProvider: (prov: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  favorites: string[];
  onToggleFavorite: (gameId: string) => void;
  onPlayGame: (game: GameItem) => void;
}

export const GameLobbyView: React.FC<GameLobbyViewProps> = ({
  language,
  onBack,
  selectedProvider,
  onSelectProvider,
  selectedCategory,
  onSelectCategory,
  favorites,
  onToggleFavorite,
  onPlayGame
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Sub-category horizontal pills matching Screenshot 1
  const subCategories = [
    { id: 'hot', labelBn: 'হট গেমস', labelEn: 'Hot', icon: 'trophy' },
    { id: 'favorite', labelBn: 'আমার প্রিয়', labelEn: 'My favorite', icon: 'card-heart' },
    { id: 'slot', labelBn: 'স্লটস', labelEn: 'Slots', icon: 'slots' },
    { id: 'fish', labelBn: 'মাছ ধরা', labelEn: 'Fish', icon: 'fish' },
    { id: 'live', labelBn: 'ক্যাসিনো', labelEn: 'Casino', icon: 'casino' },
    { id: 'poker', labelBn: 'পোকার', labelEn: 'Poker', icon: 'poker' },
    { id: 'sports', labelBn: 'খেলাধুলা', labelEn: 'Sports', icon: 'sports' }
  ];

  // Combine all games catalog
  const allGames = useMemo(() => {
    // Unique list by ID
    const map = new Map<string, GameItem>();
    [...JILI_SLOTS, ...PG_SLOTS, ...HOT_GAMES, ...LIVE_CASINO_GAMES, ...FISHING_GAMES].forEach((g) => {
      if (!map.has(g.id)) map.set(g.id, g);
    });
    return Array.from(map.values());
  }, []);

  // Filtered games based on active sub-category, provider, and search
  const filteredGames = useMemo(() => {
    return allGames.filter((game) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle =
          game.titleEn.toLowerCase().includes(query) ||
          game.titleBn.toLowerCase().includes(query) ||
          game.provider.toLowerCase().includes(query);
        if (!matchesTitle) return false;
      }

      // 2. Sub-Category
      if (selectedCategory === 'favorite') {
        if (!favorites.includes(game.id)) return false;
      } else if (selectedCategory === 'hot') {
        if (!game.isHot && game.category !== 'hot') return false;
      } else if (selectedCategory === 'slot') {
        if (game.category !== 'slot') return false;
      } else if (selectedCategory === 'fish') {
        if (game.category !== 'fish') return false;
      } else if (selectedCategory === 'live') {
        if (game.category !== 'live') return false;
      } else if (selectedCategory === 'poker') {
        if (game.category !== 'poker') return false;
      } else if (selectedCategory === 'sports') {
        if (game.category !== 'sports') return false;
      }

      // 3. Provider Filter (if not 'ALL' and provider matches)
      if (selectedProvider && selectedProvider !== 'ALL') {
        if (game.provider.toUpperCase() !== selectedProvider.toUpperCase()) {
          return false;
        }
      }

      return true;
    });
  }, [allGames, searchQuery, selectedCategory, selectedProvider, favorites]);

  return (
    <div id="game-lobby-screen" className="flex-1 flex flex-col bg-[#121622] h-full max-h-screen overflow-hidden text-slate-100">
      {/* 1. Top Bar with Back Chevron, Provider Tag Pill & Search (Screenshot 1) */}
      <div className="sticky top-0 z-30 shrink-0 bg-[#161b28]/95 backdrop-blur-md border-b border-slate-800/80 px-2 sm:px-4 md:px-6 lg:px-8 py-2 flex items-center justify-between gap-2 shadow-md">
        {/* Left: Back Button */}
        <button
          id="btn-lobby-back"
          type="button"
          onClick={onBack}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800/60 hover:bg-slate-700 text-slate-200 transition active:scale-95"
          aria-label="Back to Home"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Center: Selected Provider Pill e.g. "JILI ✕" or Search Input */}
        {isSearchOpen ? (
          <div className="flex-1 flex items-center bg-[#1c2233] border border-amber-500/50 rounded-full px-3 py-1">
            <Search className="w-3.5 h-3.5 text-amber-400 mr-2 shrink-0" />
            <input
              id="input-game-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'bn' ? 'গেম খুঁজুন...' : 'Search games...'}
              className="w-full bg-transparent text-xs text-white placeholder:text-slate-400 focus:outline-none"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-start gap-2 overflow-x-auto no-scrollbar">
            {selectedProvider && selectedProvider !== 'ALL' && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#20273a] border border-amber-500/40 text-amber-300 text-xs font-bold shadow-sm">
                <span>{selectedProvider}</span>
                <button
                  type="button"
                  onClick={() => onSelectProvider('ALL')}
                  className="hover:text-white p-0.5"
                  title="Clear provider filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            {selectedCategory && selectedCategory !== 'slot' && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#20273a] border border-slate-700 text-slate-300 text-xs font-semibold">
                <span>
                  {subCategories.find((c) => c.id === selectedCategory)?.[language === 'bn' ? 'labelBn' : 'labelEn'] ||
                    selectedCategory}
                </span>
                <button
                  type="button"
                  onClick={() => onSelectCategory('slot')}
                  className="hover:text-white p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Right: Search Icon Toggle */}
        <button
          id="btn-toggle-search"
          type="button"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className={`flex items-center justify-center w-8 h-8 rounded-full transition active:scale-95 ${
            isSearchOpen ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-800/60 text-slate-300 hover:text-white'
          }`}
          aria-label="Toggle search"
        >
          {isSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
        </button>
      </div>

      {/* 2. Top Sub-category Horizontal Scrolling Pills (Screenshot 1) */}
      <div className="shrink-0 bg-[#141926] border-b border-slate-800/60 px-2 sm:px-4 md:px-6 lg:px-8 py-2 overflow-x-auto no-scrollbar flex items-center gap-2">
        {subCategories.map((sub) => {
          const isActive = selectedCategory === sub.id;
          return (
            <button
              key={sub.id}
              id={`subcategory-pill-${sub.id}`}
              type="button"
              onClick={() => onSelectCategory(sub.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shadow-sm ${
                isActive
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black shadow-[0_2px_8px_rgba(255,215,0,0.3)]'
                  : 'bg-[#1e2436] hover:bg-[#273046] text-slate-300 hover:text-white border border-slate-700/50'
              }`}
            >
              <span className="text-sm">
                {sub.icon === 'trophy' && '🏆'}
                {sub.icon === 'card-heart' && '🃏'}
                {sub.icon === 'slots' && '🎰'}
                {sub.icon === 'fish' && '🐟'}
                {sub.icon === 'casino' && '🎲'}
                {sub.icon === 'poker' && '♠️'}
                {sub.icon === 'sports' && '⚽'}
              </span>
              <span>{language === 'bn' ? sub.labelBn : sub.labelEn}</span>
              {sub.id === 'favorite' && favorites.length > 0 && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-slate-900 text-amber-300' : 'bg-amber-400/20 text-amber-300'
                  }`}
                >
                  {favorites.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Main 2-Column Section: Left Sticky Provider Sidebar + Right Game Grid (Screenshot 1) */}
      <div className="flex-1 flex items-stretch overflow-hidden min-h-0">
        {/* Left Sticky Vertical Provider Sidebar */}
        <aside
          id="vertical-provider-sidebar"
          className="w-20 sm:w-24 md:w-28 shrink-0 bg-[#161b28] border-r border-slate-800/80 h-full max-h-[calc(100vh-140px)] overflow-y-auto overscroll-contain flex flex-col no-scrollbar touch-pan-y py-1"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          {PROVIDERS_LIST.map((prov) => {
            const isActive = selectedProvider.toUpperCase() === prov.id.toUpperCase();
            return (
              <button
                key={prov.id}
                id={`provider-btn-${prov.id}`}
                type="button"
                onClick={() => onSelectProvider(prov.id)}
                className={`w-full flex flex-col items-center justify-center py-2.5 px-1 border-b border-slate-800/50 transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FFDF00] via-[#FFC000] to-[#E5A900] text-slate-950 font-black shadow-md border-r-4 border-amber-600'
                    : 'text-slate-300 hover:text-white hover:bg-[#1e2436]'
                }`}
              >
                {/* Provider Mini Logo Graphic */}
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shadow-inner mb-1 ${
                    isActive
                      ? 'bg-slate-950 text-amber-300 border border-amber-400/60'
                      : 'bg-gradient-to-br from-[#232a3d] to-[#1a1f2e] text-amber-400 border border-slate-700/60'
                  }`}
                >
                  {prov.id === 'Crash Games' ? (
                    '🚀'
                  ) : prov.id.length <= 4 ? (
                    prov.id
                  ) : (
                    prov.id.slice(0, 3)
                  )}
                </div>

                <span
                  className={`text-xs leading-tight text-center font-bold tracking-tight truncate w-full px-0.5 ${
                    isActive ? 'text-slate-950 font-extrabold' : 'text-slate-300'
                  }`}
                >
                  {prov.name}
                </span>

                {prov.tag && !isActive && (
                  <span className="text-xs font-bold px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-400 mt-0.5">
                    {prov.tag}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Right Column: Category Title Indicator & Responsive Game Grid (Screenshot 1) */}
        <div className="flex-1 p-2.5 sm:p-4 md:p-5 lg:p-6 overflow-y-auto h-full max-h-[calc(100vh-140px)] overscroll-contain no-scrollbar pb-32">
          {/* Section Indicator Bar: e.g. "| Slots" */}
          <div className="flex items-center justify-between mb-2.5 pb-1.5 border-b border-slate-800/60">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-amber-300 to-amber-500 shadow-[0_0_8px_rgba(255,215,0,0.5)]" />
              <h2 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                {selectedProvider !== 'ALL' ? `${selectedProvider} ` : ''}
                {subCategories.find((c) => c.id === selectedCategory)?.[language === 'bn' ? 'labelBn' : 'labelEn'] ||
                  'Slots'}
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {filteredGames.length} {language === 'bn' ? 'টি গেম' : 'games'}
            </span>
          </div>

          {/* 3-Column Games Grid on Mobile and Tablet, responsive on Desktop */}
          {filteredGames.length > 0 ? (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 sm:gap-2.5 md:grid-cols-3 md:gap-3 lg:grid-cols-4 xl:grid-cols-5">
              {filteredGames.map((game) => {
                const isFav = favorites.includes(game.id);
                return (
                  <div
                    key={game.id}
                    id={`lobby-game-${game.id}`}
                    className="flex flex-col group cursor-pointer bg-gradient-to-b from-[#1C2538] via-[#161D2C] to-[#101520] rounded-xl overflow-hidden border border-slate-700/80 hover:border-amber-400/90 shadow-[0_4px_14px_rgba(0,0,0,0.55)] hover:shadow-[0_0_18px_rgba(245,158,11,0.3)] transition-all duration-300 active:scale-[0.97]"
                    onClick={() => onPlayGame(game)}
                  >
                    {/* Game Card Thumbnail Container */}
                    <div className="relative aspect-square w-full overflow-hidden bg-[#141A24]">
                      <img
                        src={game.image}
                        alt={language === 'bn' ? game.titleBn : game.titleEn}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />

                      {/* Hot Badge if applicable */}
                      {game.isHot && (
                        <div className="absolute top-1.5 left-1.5 bg-gradient-to-r from-red-600 to-rose-700 text-white text-xs font-black px-1.5 py-0.5 rounded-[5px] shadow-md border border-rose-400/40 flex items-center gap-0.5 z-10">
                          <span>🔥</span>
                          <span className="hidden sm:inline">HOT</span>
                        </div>
                      )}

                      {/* Top Right Heart Favorite Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(game.id);
                        }}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm flex items-center justify-center text-slate-300 hover:text-white transition-all duration-200 border border-white/10 active:scale-90 z-10"
                        aria-label="Toggle favorite"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 transition-colors ${
                            isFav ? 'fill-rose-500 text-rose-500' : 'text-slate-300 hover:text-white'
                          }`}
                        />
                      </button>

                      {/* Compact Golden Provider Badge Strictly at Bottom-Right Corner */}
                      <div className="absolute bottom-1.5 right-1.5 z-10 pointer-events-none">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-[5px] bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 font-black text-xs tracking-wider uppercase shadow-[0_2px_5px_rgba(0,0,0,0.8)] border border-yellow-200/50">
                          {game.provider}
                        </span>
                      </div>

                      {/* Play Hover Overlay */}
                      <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.6)] transform scale-90 group-hover:scale-100 transition-transform">
                          <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
                        </div>
                      </div>
                    </div>

                    {/* Game Title Text Below Card with High-Contrast White/Gold Gradient Typography */}
                    <div className="py-2 px-1 sm:px-1.5 text-center bg-[#101520]/90 border-t border-slate-800/80">
                      <h4
                        className="text-xs sm:text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-amber-200 group-hover:from-amber-300 group-hover:via-yellow-300 group-hover:to-amber-400 transition-all duration-200 truncate tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
                        title={language === 'bn' ? game.titleBn : game.titleEn}
                      >
                        {language === 'bn' ? game.titleBn : game.titleEn}
                      </h4>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center px-4">
              <div className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400 mb-2">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-xs text-slate-300 font-semibold">
                {language === 'bn'
                  ? 'কোনো গেম পাওয়া যায়নি'
                  : 'No games found matching your filter'}
              </p>
              <button
                type="button"
                onClick={() => {
                  onSelectProvider('ALL');
                  onSelectCategory('slot');
                  setSearchQuery('');
                }}
                className="mt-3 px-3 py-1.5 rounded-full bg-amber-400 text-slate-950 font-bold text-xs shadow hover:bg-amber-300 transition"
              >
                {language === 'bn' ? 'সব গেম দেখুন' : 'Reset Filters'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
