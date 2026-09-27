import { GameItem, PromoBanner, WinnerItem, NotificationItem, BetRecordItem, InternalMessageItem } from '../types';

// Helper to generate vibrant themed casino game artwork cards with SVG illustrations
export function getGameArtwork(theme: string, title: string, badge: string, bgHue: number): string {
  // SVG encoded image with rich game art elements
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
    <defs>
      <linearGradient id="g_${bgHue}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="hsl(${bgHue}, 85%, 22%)"/>
        <stop offset="50%" stop-color="hsl(${(bgHue + 35) % 360}, 90%, 14%)"/>
        <stop offset="100%" stop-color="hsl(${(bgHue + 70) % 360}, 95%, 8%)"/>
      </linearGradient>
      <radialGradient id="glow_${bgHue}" cx="50%" cy="40%" r="50%">
        <stop offset="0%" stop-color="hsl(${bgHue}, 100%, 65%)" stop-opacity="0.6"/>
        <stop offset="100%" stop-color="hsl(${bgHue}, 100%, 50%)" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFF3A1"/>
        <stop offset="40%" stop-color="#FFD700"/>
        <stop offset="100%" stop-color="#B8860B"/>
      </linearGradient>
    </defs>
    <rect width="300" height="300" rx="20" fill="url(#g_${bgHue})"/>
    <circle cx="150" cy="120" r="110" fill="url(#glow_${bgHue})"/>

    <!-- Decorative Stars/Rays -->
    <g opacity="0.3">
      <line x1="150" y1="20" x2="150" y2="220" stroke="#FFD700" stroke-width="2" stroke-dasharray="4,4"/>
      <line x1="50" y1="120" x2="250" y2="120" stroke="#FFD700" stroke-width="2" stroke-dasharray="4,4"/>
      <circle cx="150" cy="120" r="80" fill="none" stroke="#FFD700" stroke-width="1.5" stroke-dasharray="6,6"/>
      <circle cx="150" cy="120" r="50" fill="none" stroke="#FFD700" stroke-width="1"/>
    </g>

    <!-- Character / Theme Symbol -->
    ${
      theme === 'beauty'
        ? `<circle cx="150" cy="115" r="48" fill="#FF8DA1" opacity="0.85"/>
           <path d="M125 110 Q150 70 175 110 Q185 140 150 155 Q115 140 125 110 Z" fill="#FFE0E9"/>
           <path d="M110 80 Q150 45 190 80 Q205 130 150 165 Q95 130 110 80 Z" fill="none" stroke="url(#gold)" stroke-width="3"/>
           <text x="150" y="125" font-family="Arial, sans-serif" font-size="34" font-weight="bold" fill="#FFF" text-anchor="middle">👑</text>`
        : theme === 'gems'
        ? `<polygon points="150,55 205,100 185,165 115,165 95,100" fill="url(#gold)"/>
           <polygon points="150,75 185,108 172,150 128,150 115,108" fill="#FF4500" opacity="0.9"/>
           <circle cx="150" cy="115" r="18" fill="#00FFFF"/>
           <text x="150" y="125" font-family="Arial, sans-serif" font-size="28" fill="#FFF" text-anchor="middle">💎</text>`
        : theme === 'thor'
        ? `<rect x="110" y="85" width="80" height="45" rx="8" fill="#B0C4DE"/>
           <rect x="140" y="130" width="20" height="45" rx="4" fill="#8B4513"/>
           <path d="M150 40 L165 75 L145 80 L160 115" stroke="#00FFFF" stroke-width="4" fill="none"/>
           <text x="150" y="115" font-family="Arial, sans-serif" font-size="28" fill="#FFF" text-anchor="middle">⚡</text>`
        : theme === 'cards' || theme === 'rummy'
        ? `<rect x="105" y="70" width="60" height="85" rx="8" fill="#FFFFFF" transform="rotate(-12 135 112)"/>
           <rect x="135" y="70" width="60" height="85" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" transform="rotate(10 165 112)"/>
           <text x="170" y="120" font-family="Arial, sans-serif" font-size="30" fill="#E53E3E" text-anchor="middle">A♠</text>`
        : theme === 'money'
        ? `<rect x="90" y="80" width="120" height="70" rx="8" fill="#2E7D32" stroke="url(#gold)" stroke-width="3"/>
           <circle cx="150" cy="115" r="22" fill="#388E3C" stroke="#FFF" stroke-width="2"/>
           <text x="150" y="125" font-family="Arial, sans-serif" font-size="28" font-weight="900" fill="#FFF3A1" text-anchor="middle">৳</text>`
        : theme === 'fish'
        ? `<ellipse cx="150" cy="115" rx="55" ry="32" fill="url(#gold)"/>
           <polygon points="95,115 65,90 65,140" fill="url(#gold)"/>
           <circle cx="180" cy="108" r="6" fill="#000"/>
           <circle cx="182" cy="106" r="2" fill="#FFF"/>
           <path d="M140 100 Q155 115 140 130" stroke="#B8860B" stroke-width="3" fill="none"/>`
        : theme === 'boxing'
        ? `<circle cx="130" cy="115" r="30" fill="#E53E3E"/>
           <circle cx="170" cy="115" r="30" fill="#C53030"/>
           <text x="150" y="125" font-family="Arial, sans-serif" font-size="32" fill="#FFF" text-anchor="middle">🥊</text>`
        : theme === 'joker'
        ? `<circle cx="150" cy="120" r="38" fill="#FFF"/>
           <polygon points="115,85 150,45 185,85" fill="#9F7AEA"/>
           <circle cx="150" cy="45" r="8" fill="#FFD700"/>
           <text x="150" y="128" font-family="Arial, sans-serif" font-size="28" fill="#000" text-anchor="middle">🃏</text>`
        : theme === 'aztec'
        ? `<rect x="100" y="65" width="100" height="100" rx="14" fill="url(#gold)" stroke="#8C6200" stroke-width="4"/>
           <rect x="120" y="85" width="20" height="20" fill="#0D9488"/>
           <rect x="160" y="85" width="20" height="20" fill="#0D9488"/>
           <rect x="130" y="125" width="40" height="15" rx="3" fill="#B45309"/>`
        : theme === 'anubis'
        ? `<polygon points="120,60 135,110 110,110" fill="#1F2937"/>
           <polygon points="180,60 190,110 165,110" fill="#1F2937"/>
           <circle cx="150" cy="120" r="35" fill="#374151"/>
           <circle cx="140" cy="115" r="5" fill="#FFD700"/>
           <circle cx="160" cy="115" r="5" fill="#FFD700"/>`
        : `<circle cx="150" cy="115" r="45" fill="url(#gold)"/>
           <text x="150" y="128" font-family="Arial, sans-serif" font-size="36" fill="#FFF" text-anchor="middle">777</text>`
    }

    <!-- Game Title Banner Frame at bottom -->
    <rect x="10" y="210" width="280" height="80" rx="14" fill="#0A0E18" fill-opacity="0.88"/>
    <text x="150" y="245" font-family="'Hind Siliguri', 'Segoe UI', sans-serif" font-size="19" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${title}</text>
    <text x="150" y="272" font-family="Arial, sans-serif" font-size="12" font-weight="600" fill="#94A3B8" letter-spacing="1" text-anchor="middle">MEGAWAYS • JACKPOT</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const HOT_GAMES: GameItem[] = [
  {
    id: 'hot-1',
    titleBn: 'বাংলা বিউটি',
    titleEn: 'Bangla Beauty',
    provider: 'JILI',
    category: 'hot',
    image: getGameArtwork('beauty', 'বাংলা বিউটি', 'JILI', 330),
    isHot: true,
    multiplier: '500x',
    rating: 4.9
  },
  {
    id: 'hot-2',
    titleBn: 'ফরচুন জেমস ২',
    titleEn: 'Fortune Gems 2',
    provider: 'JILI',
    category: 'hot',
    image: getGameArtwork('gems', 'Fortune Gems 2', 'JILI', 42),
    isHot: true,
    multiplier: '1000x',
    rating: 4.8
  },
  {
    id: 'hot-3',
    titleBn: 'Super Ace',
    titleEn: 'Super Ace',
    provider: 'JILI',
    category: 'hot',
    image: getGameArtwork('cards', 'Super Ace', 'JILI', 210),
    isHot: true,
    multiplier: '1500x',
    rating: 4.9
  },
  {
    id: 'hot-4',
    titleBn: 'রামি',
    titleEn: 'Rummy Master',
    provider: 'JILI',
    category: 'hot',
    image: getGameArtwork('rummy', 'Rummy Gold', 'JILI', 280),
    isHot: false,
    multiplier: '250x',
    rating: 4.7
  },
  {
    id: 'hot-5',
    titleBn: 'টাকা আসছে',
    titleEn: 'Money Coming',
    provider: 'JILI',
    category: 'hot',
    image: getGameArtwork('money', 'Money Coming', 'JILI', 145),
    isHot: true,
    multiplier: '10000x',
    rating: 5.0
  },
  {
    id: 'hot-6',
    titleBn: 'হ্যাপি ফিশিং',
    titleEn: 'Happy Fishing',
    provider: 'JILI',
    category: 'hot',
    image: getGameArtwork('fish', 'Happy Fishing', 'JILI', 195),
    isHot: false,
    multiplier: '888x',
    rating: 4.6
  }
];

export const PROVIDERS_LIST = [
  { id: 'JILI', name: 'JILI', shortName: 'JILI', tag: 'HOT', color: 'from-amber-400 to-yellow-500' },
  { id: 'PG', name: 'PG', shortName: 'PG', tag: 'POPULAR', color: 'from-orange-500 to-amber-600' },
  { id: 'NG', name: 'NG', shortName: 'NG', tag: '', color: 'from-blue-500 to-indigo-600' },
  { id: 'JDB', name: 'JDB', shortName: 'JDB', tag: '', color: 'from-red-500 to-rose-600' },
  { id: 'FC', name: 'FC', shortName: 'FC', tag: 'NEW', color: 'from-purple-500 to-violet-600' },
  { id: 'SG', name: 'SG', shortName: 'SG', tag: '', color: 'from-emerald-500 to-teal-600' },
  { id: 'FP', name: 'FP', shortName: 'FP', tag: '', color: 'from-sky-500 to-cyan-600' },
  { id: 'AE', name: 'AE', shortName: 'AE', tag: '', color: 'from-pink-500 to-rose-500' },
  { id: 'Crash Games', name: 'Crash Games', shortName: 'CRASH', tag: 'FAST', color: 'from-yellow-400 to-red-500' },
  { id: 'BT', name: 'BT', shortName: 'BT', tag: '', color: 'from-slate-400 to-slate-600' },
  { id: 'BOM', name: 'BOM', shortName: 'BOM', tag: '', color: 'from-orange-400 to-amber-700' },
  { id: 'NE', name: 'NE', shortName: 'NE', tag: '', color: 'from-green-500 to-emerald-700' },
  { id: 'RT', name: 'RT', shortName: 'RT', tag: '', color: 'from-red-600 to-rose-800' },
  { id: 'MAS', name: 'MAS', shortName: 'MAS', tag: '', color: 'from-cyan-400 to-blue-600' },
  { id: 'MG', name: 'MG', shortName: 'MG', tag: '', color: 'from-blue-600 to-indigo-800' },
  { id: 'GM', name: 'GM', shortName: 'GM', tag: '', color: 'from-purple-400 to-purple-700' },
  { id: 'MA', name: 'MA', shortName: 'MA', tag: '', color: 'from-amber-600 to-yellow-700' }
];

export const JILI_SLOTS: GameItem[] = [
  {
    id: 'jili-1',
    titleBn: 'সুপার এস',
    titleEn: 'Super Ace',
    provider: 'JILI',
    category: 'slot',
    image: getGameArtwork('cards', 'Super Ace', 'JILI', 15),
    isHot: true,
    multiplier: '1500x',
    rating: 4.9
  },
  {
    id: 'jili-2',
    titleBn: 'সার্কাস জোকার ৪০৯৬',
    titleEn: 'Circus Joker 4096',
    provider: 'JILI',
    category: 'slot',
    image: getGameArtwork('joker', 'Circus Joker 4096', 'JILI', 265),
    isHot: true,
    multiplier: '4096x',
    rating: 4.8
  },
  {
    id: 'jili-3',
    titleBn: 'ফরচুন জেমস ৩',
    titleEn: 'Fortune Gems 3',
    provider: 'JILI',
    category: 'slot',
    image: getGameArtwork('gems', 'Fortune Gems 3', 'JILI', 45),
    isHot: true,
    multiplier: '2000x',
    rating: 4.9
  },
  {
    id: 'jili-4',
    titleBn: 'গরুড় যোদ্ধা ৫০০',
    titleEn: 'Fortune Garuda 500',
    provider: 'JILI',
    category: 'slot',
    image: getGameArtwork('gems', 'Fortune Garuda 500', 'JILI', 35),
    multiplier: '500x',
    rating: 4.7
  },
  {
    id: 'jili-5',
    titleBn: 'বক্সিং কিং',
    titleEn: 'Boxing King',
    provider: 'JILI',
    category: 'slot',
    image: getGameArtwork('boxing', 'Boxing King', 'JILI', 0),
    isHot: true,
    multiplier: '1000x',
    rating: 4.8
  },
  {
    id: 'jili-6',
    titleBn: 'সুপার এস ডিলাক্স',
    titleEn: 'Super Ace Deluxe',
    provider: 'JILI',
    category: 'slot',
    image: getGameArtwork('cards', 'Super Ace Deluxe', 'JILI', 18),
    isHot: true,
    multiplier: '3000x',
    rating: 4.9
  },
  {
    id: 'jili-7',
    titleBn: 'সুপার এস ২',
    titleEn: 'Super Ace II',
    provider: 'JILI',
    category: 'slot',
    image: getGameArtwork('cards', 'Super Ace II', 'JILI', 25),
    multiplier: '2500x',
    rating: 4.8
  },
  {
    id: 'jili-8',
    titleBn: 'টাকা আসছে',
    titleEn: 'Money Coming',
    provider: 'JILI',
    category: 'slot',
    image: getGameArtwork('money', 'Money Coming', 'JILI', 145),
    isHot: true,
    multiplier: '10000x',
    rating: 5.0
  },
  {
    id: 'jili-9',
    titleBn: 'ফরচুন জেমস',
    titleEn: 'Fortune Gems',
    provider: 'JILI',
    category: 'slot',
    image: getGameArtwork('gems', 'Fortune Gems', 'JILI', 50),
    multiplier: '1500x',
    rating: 4.7
  },
  {
    id: 'jili-10',
    titleBn: 'গোল্ডেন এম্পায়ার',
    titleEn: 'Golden Empire',
    provider: 'JILI',
    category: 'slot',
    image: getGameArtwork('aztec', 'Golden Empire', 'JILI', 40),
    isHot: true,
    multiplier: '2000x',
    rating: 4.9
  },
  {
    id: 'jili-11',
    titleBn: 'ক্লোভার কয়েন্স ৩x৩',
    titleEn: 'Clover Coins 3x3',
    provider: 'JILI',
    category: 'slot',
    image: getGameArtwork('money', 'Clover Coins 3x3', 'JILI', 130),
    multiplier: '1000x',
    rating: 4.6
  },
  {
    id: 'jili-12',
    titleBn: 'ফরচুন জেমস ২',
    titleEn: 'Fortune Gems 2',
    provider: 'JILI',
    category: 'slot',
    image: getGameArtwork('gems', 'Fortune Gems 2', 'JILI', 42),
    isHot: true,
    multiplier: '1000x',
    rating: 4.8
  },
  {
    id: 'jili-13',
    titleBn: 'মানি কামিং এক্সপান্ড',
    titleEn: 'Money Coming Expand',
    provider: 'JILI',
    category: 'slot',
    image: getGameArtwork('money', 'Money Coming Exp', 'JILI', 155),
    multiplier: '10000x',
    rating: 4.9
  },
  {
    id: 'jili-14',
    titleBn: 'ফরচুন জেমস ৫০০',
    titleEn: 'Fortune Gems 500',
    provider: 'JILI',
    category: 'slot',
    image: getGameArtwork('gems', 'Fortune Gems 500', 'JILI', 48),
    multiplier: '500x',
    rating: 4.8
  },
  {
    id: 'jili-15',
    titleBn: '৩ সুপার এস',
    titleEn: '3 Super Ace',
    provider: 'JILI',
    category: 'slot',
    image: getGameArtwork('cards', '3 Super Ace', 'JILI', 12),
    multiplier: '3333x',
    rating: 4.7
  },
  {
    id: 'jili-16',
    titleBn: 'ক্রেজি ৭৭৭',
    titleEn: 'Crazy777',
    provider: 'JILI',
    category: 'slot',
    image: getGameArtwork('beauty', 'Crazy777', 'JILI', 355),
    isHot: true,
    multiplier: '7777x',
    rating: 4.9
  },
  {
    id: 'jili-17',
    titleBn: 'ফরচুন কয়েন্স',
    titleEn: 'Fortune Coins',
    provider: 'JILI',
    category: 'slot',
    image: getGameArtwork('money', 'Fortune Coins', 'JILI', 38),
    multiplier: '1200x',
    rating: 4.7
  },
  {
    id: 'jili-18',
    titleBn: 'সুপার এস স্পিড',
    titleEn: 'Super Ace SPEED',
    provider: 'JILI',
    category: 'slot',
    image: getGameArtwork('cards', 'Super Ace SPEED', 'JILI', 22),
    isHot: true,
    multiplier: '2500x',
    rating: 4.9
  }
];

export const PG_SLOTS: GameItem[] = [
  {
    id: 'pg-1',
    titleBn: 'টাচডাউন জয়',
    titleEn: 'Touchdown Win',
    provider: 'PG',
    category: 'slot',
    image: getGameArtwork('boxing', 'Touchdown Win', 'PG', 225),
    multiplier: '2500x',
    rating: 4.8
  },
  {
    id: 'pg-2',
    titleBn: 'আজটেক ধন',
    titleEn: 'Treasures of Aztec',
    provider: 'PG',
    category: 'slot',
    image: getGameArtwork('aztec', 'Treasures of Aztec', 'PG', 38),
    isHot: true,
    multiplier: '100000x',
    rating: 5.0
  },
  {
    id: 'pg-3',
    titleBn: 'পিন্যাটা উইনস',
    titleEn: 'Piñata Wins',
    provider: 'PG',
    category: 'slot',
    image: getGameArtwork('joker', 'Piñata Wins', 'PG', 315),
    multiplier: '5000x',
    rating: 4.7
  },
  {
    id: 'pg-4',
    titleBn: 'ওয়াইল্ড বাউন্টি শোডাউন',
    titleEn: 'Wild Bounty Showdown',
    provider: 'PG',
    category: 'slot',
    image: getGameArtwork('money', 'Wild Bounty Showdown', 'PG', 28),
    multiplier: '5000x',
    rating: 4.8
  },
  {
    id: 'pg-5',
    titleBn: 'আনুবিস',
    titleEn: 'Anubis Gold',
    provider: 'PG',
    category: 'slot',
    image: getGameArtwork('anubis', 'Anubis Gold', 'PG', 240),
    isHot: true,
    multiplier: '25000x',
    rating: 4.9
  },
  {
    id: 'pg-6',
    titleBn: 'ওয়াইল্ড ব্যান্ডিটো',
    titleEn: 'Wild Bandito',
    provider: 'PG',
    category: 'slot',
    image: getGameArtwork('joker', 'Wild Bandito', 'PG', 285),
    multiplier: '25000x',
    rating: 4.8
  }
];

export const LIVE_CASINO_GAMES: GameItem[] = [
  {
    id: 'live-1',
    titleBn: 'রুলেট লাইভ ডিলার',
    titleEn: 'Lightning Roulette',
    provider: 'PRAGMATIC',
    category: 'live',
    image: getGameArtwork('cards', 'Lightning Roulette', 'PRAGMATIC', 5),
    isHot: true,
    multiplier: '500x',
    rating: 4.9
  },
  {
    id: 'live-2',
    titleBn: 'ব্যাকারাত সুপার সিক্স',
    titleEn: 'Speed Baccarat',
    provider: 'FA CHAI',
    category: 'live',
    image: getGameArtwork('beauty', 'Speed Baccarat', 'FA CHAI', 340),
    multiplier: '200x',
    rating: 4.8
  },
  {
    id: 'live-3',
    titleBn: 'অন্দর বাহার লাইভ',
    titleEn: 'Andar Bahar Live',
    provider: 'JILI',
    category: 'live',
    image: getGameArtwork('cards', 'Andar Bahar Live', 'JILI', 215),
    isHot: true,
    multiplier: '100x',
    rating: 4.9
  },
  {
    id: 'live-4',
    titleBn: 'ড্রাগন টাইগার',
    titleEn: 'Dragon Tiger Live',
    provider: 'PG',
    category: 'live',
    image: getGameArtwork('thor', 'Dragon Tiger', 'PG', 10),
    multiplier: '50x',
    rating: 4.7
  }
];

export const FISHING_GAMES: GameItem[] = [
  {
    id: 'fish-1',
    titleBn: 'জ্যাকপট ফিশিং',
    titleEn: 'Jackpot Fishing',
    provider: 'JILI',
    category: 'fish',
    image: getGameArtwork('fish', 'Jackpot Fishing', 'JILI', 190),
    isHot: true,
    multiplier: '1000x',
    rating: 4.9
  },
  {
    id: 'fish-2',
    titleBn: 'মেগা ফিশিং',
    titleEn: 'Mega Fishing',
    provider: 'JILI',
    category: 'fish',
    image: getGameArtwork('fish', 'Mega Fishing', 'JILI', 170),
    multiplier: '950x',
    rating: 4.8
  },
  {
    id: 'fish-3',
    titleBn: 'বোম্বিং ফিশিং',
    titleEn: 'Bombing Fishing',
    provider: 'FA CHAI',
    category: 'fish',
    image: getGameArtwork('fish', 'Bombing Fishing', 'FA CHAI', 205),
    multiplier: '1200x',
    rating: 4.7
  }
];

export const CRASH_AND_SPORTS_GAMES: GameItem[] = [
  {
    id: 'crash-1',
    titleBn: 'এভিয়েটর (ক্র্যাশ)',
    titleEn: 'Aviator',
    provider: 'Spribe',
    category: 'sports',
    image: getGameArtwork('thor', 'Aviator', 'Spribe', 355),
    isHot: true,
    multiplier: '10000x',
    rating: 5.0
  },
  {
    id: 'crash-2',
    titleBn: 'জেট এক্স (JetX)',
    titleEn: 'JetX',
    provider: 'Spribe',
    category: 'sports',
    image: getGameArtwork('thor', 'JetX', 'Spribe', 210),
    isHot: true,
    multiplier: '5000x',
    rating: 4.9
  },
  {
    id: 'crash-3',
    titleBn: 'ক্রিকেট ক্র্যাশ বিপিএল',
    titleEn: 'Cricket Crash BPL',
    provider: 'JDB',
    category: 'sports',
    image: getGameArtwork('boxing', 'Cricket Crash', 'JDB', 140),
    isHot: true,
    multiplier: '2500x',
    rating: 4.8
  },
  {
    id: 'crash-4',
    titleBn: 'স্প্রাইব মাইনস',
    titleEn: 'Mines',
    provider: 'Spribe',
    category: 'sports',
    image: getGameArtwork('gems', 'Mines', 'Spribe', 280),
    multiplier: '1000x',
    rating: 4.8
  },
  {
    id: 'crash-5',
    titleBn: 'লাইভ ক্রিকেট স্পোর্টসবুক',
    titleEn: 'Live Cricket Exchange',
    provider: 'Evolution Gaming',
    category: 'sports',
    image: getGameArtwork('boxing', 'Cricket Exchange', 'Evolution', 45),
    isHot: true,
    multiplier: 'Live',
    rating: 4.9
  },
  {
    id: 'crash-6',
    titleBn: 'প্রিমিয়ার লিগ ফুটবল',
    titleEn: 'Premier League Soccer',
    provider: 'Evolution Gaming',
    category: 'sports',
    image: getGameArtwork('cards', 'Soccer Live', 'Evolution', 200),
    multiplier: 'Live',
    rating: 4.7
  }
];

export const MAJOR_PROVIDERS = [
  { id: 'ALL', name: 'All Providers', short: 'ALL', logo: '🌐' },
  { id: 'JILI', name: 'JILI Games', short: 'JILI', logo: '⚡' },
  { id: 'PG', name: 'PG Soft', short: 'PG', logo: '💎' },
  { id: 'JDB', name: 'JDB Gaming', short: 'JDB', logo: '🐉' },
  { id: 'FastSpin', name: 'FastSpin', short: 'FS', logo: '🌀' },
  { id: 'Evolution Gaming', name: 'Evolution Gaming', short: 'EVO', logo: '👑' },
  { id: 'Pragmatic Play', name: 'Pragmatic Play', short: 'PP', logo: '🔥' },
  { id: 'Spribe', name: 'Spribe Gaming', short: 'SPRIBE', logo: '🚀' },
  { id: 'CQ9', name: 'CQ9 Gaming', short: 'CQ9', logo: '🎯' }
];

export interface TransactionRecord {
  id: string;
  type: 'deposit' | 'withdraw';
  method: string;
  channel: string;
  amount: number;
  trxId: string;
  status: 'completed' | 'pending' | 'rejected';
  date: string;
}

export const MOCK_TRANSACTIONS: TransactionRecord[] = [
  { id: 'tx-101', type: 'deposit', method: 'bKash', channel: 'Channel 2', amount: 1000, trxId: 'BK92384723', status: 'completed', date: '2026-09-04 22:15' },
  { id: 'tx-102', type: 'withdraw', method: 'Nagad', channel: 'Direct', amount: 500, trxId: 'NG83920194', status: 'completed', date: '2026-09-04 18:30' },
  { id: 'tx-103', type: 'deposit', method: 'Nagad', channel: 'Fast Pay', amount: 2000, trxId: 'NG77192834', status: 'completed', date: '2026-09-03 14:10' },
  { id: 'tx-104', type: 'withdraw', method: 'Rocket', channel: 'Direct', amount: 1200, trxId: 'RK11928472', status: 'completed', date: '2026-09-02 20:45' },
  { id: 'tx-105', type: 'deposit', method: 'Upay', channel: 'Channel 4', amount: 500, trxId: 'UP99283741', status: 'completed', date: '2026-09-01 11:20' }
];

export interface TurnoverTrackerItem {
  id: string;
  bonusTitle: string;
  bonusAmount: number;
  requiredTurnover: number;
  completedTurnover: number;
  rolloverMultiplier: string;
  status: 'active' | 'completed';
}

export const MOCK_TURNOVER_DATA: TurnoverTrackerItem[] = [
  {
    id: 'to-1',
    bonusTitle: 'প্রথম ডিপোজিট ১২৮% ওয়েলকাম বোনাস',
    bonusAmount: 640,
    requiredTurnover: 5000,
    completedTurnover: 3250,
    rolloverMultiplier: '10x',
    status: 'active'
  },
  {
    id: 'to-2',
    bonusTitle: 'দৈনিক লোকসান ক্যাশব্যাক বোনাস',
    bonusAmount: 50,
    requiredTurnover: 250,
    completedTurnover: 250,
    rolloverMultiplier: '1x',
    status: 'completed'
  },
  {
    id: 'to-3',
    bonusTitle: 'স্লট ফ্রি স্পিন জয়',
    bonusAmount: 120,
    requiredTurnover: 600,
    completedTurnover: 180,
    rolloverMultiplier: '5x',
    status: 'active'
  }
];

export interface ProfitLossItem {
  date: string;
  totalBets: number;
  totalWins: number;
  netProfit: number;
  gamesPlayed: number;
}

export const MOCK_PROFIT_LOSS: ProfitLossItem[] = [
  { date: 'Today (Sep 05)', totalBets: 450, totalWins: 620, netProfit: 170, gamesPlayed: 32 },
  { date: 'Yesterday (Sep 04)', totalBets: 1200, totalWins: 980, netProfit: -220, gamesPlayed: 64 },
  { date: 'Sep 03, 2026', totalBets: 800, totalWins: 1450, netProfit: 650, gamesPlayed: 48 },
  { date: 'Sep 02, 2026', totalBets: 650, totalWins: 520, netProfit: -130, gamesPlayed: 25 },
  { date: 'Sep 01, 2026', totalBets: 2000, totalWins: 2780, netProfit: 780, gamesPlayed: 92 }
];

export const PROMO_BANNERS: PromoBanner[] = [
  {
    id: 'banner-sports-vip',
    bannerType: 'image',
    image: '/assets/banners/banner_sports_vip.jpg',
    tagBn: 'লাইভ স্পোর্টস বাজিতে সেরা!',
    tagEn: 'Best in Live Sports Betting!',
    titleBn: 'লাইভ স্পোর্টস ও ডায়মন্ড মেগা পুরস্কার!',
    titleEn: 'Live Sports & Diamond Mega Rewards!',
    subtitleBn: 'নতুন একাউন্ট খুলুন এবং খেলুন • দ্রুততম নগদ ও বিকাশ পেআউট',
    subtitleEn: 'Open a new account & play • Instant Nagad & bKash payouts',
    bonusPercentage: '১০০%',
    ctaTextBn: 'এখনই খেলুন',
    ctaTextEn: 'Play Now',
    actionType: 'deposit',
    themeColor: 'from-[#032313] via-[#05381f] to-[#02180d]'
  },
  {
    id: 'banner-casino-jackpot',
    bannerType: 'image',
    image: '/assets/banners/banner_casino_jackpot.jpg',
    tagBn: 'স্লটে রাজকীয় জ্যাকপট',
    tagEn: 'Royal Jackpot in Slots',
    titleBn: 'লাইভ ক্যাসিনো ও ভিআইপি মেগা ড্র!',
    titleEn: 'Live Casino & VIP Mega Draw!',
    subtitleBn: 'আজই যোগ দিন এবং আপনার ভাগ্যকে রাজকীয়ভাবে চ্যালেঞ্জ করুন!',
    subtitleEn: 'Join today & challenge your fortune royalty style!',
    bonusPercentage: '৭৭৭x',
    ctaTextBn: 'জ্যাকপট দেখুন',
    ctaTextEn: 'View Jackpots',
    actionType: 'promo',
    themeColor: 'from-[#0b2416] via-[#103b25] to-[#06180e]'
  },
  {
    id: 'banner-first-deposit',
    bannerType: 'image',
    image: '/assets/banners/banner_first_deposit.jpg',
    tagBn: '১০০% স্বাগতম বোনাস',
    tagEn: '100% Welcome Bonus',
    titleBn: '১০০% নতুন সদস্য ডিপোজিট বোনাস!',
    titleEn: '100% New Member Deposit Bonus!',
    subtitleBn: 'প্রথম ডিপোজিটে ১০০% বোনাস ক্যাশ • নূন্যতম ডিপোজিট মাত্র ৫০০৳!',
    subtitleEn: '100% match bonus on your 1st deposit • Min deposit only ৳500!',
    bonusPercentage: '১০০%',
    ctaTextBn: 'বোনাস দাবি করুন',
    ctaTextEn: 'Claim Bonus',
    actionType: 'deposit',
    themeColor: 'from-[#032617] via-[#083b25] to-[#02180f]'
  },
  {
    id: 'banner-daily-cashback',
    bannerType: 'image',
    image: '/assets/banners/banner_daily_cashback.jpg',
    tagBn: 'ভিআইপি প্রিমিয়াম রিওয়ার্ডস',
    tagEn: 'VIP Premium Rewards',
    titleBn: 'দৈনিক ৫% ক্যাশব্যাক ও ভিআইপি রিওয়ার্ডস!',
    titleEn: 'Daily 5% Cashback & VIP Rewards!',
    subtitleBn: 'প্রতিদিনের নিট লসে আনলিমিটেড ৫% ক্যাশব্যাক সরাসরি ওয়ালেটে জমা!',
    subtitleEn: 'Unlimited 5% cashback on daily losses credited to your wallet!',
    bonusPercentage: '৫%',
    ctaTextBn: 'Explore VIP',
    ctaTextEn: 'Explore VIP',
    actionType: 'vip',
    themeColor: 'from-[#1a1712] via-[#2a241b] to-[#12100d]'
  }
];

export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'urgent',
    icon: '📢',
    textBn: 'bKash সাময়িক বন্ধ! দয়া করে নগদ অথবা রকেট ব্যবহার করে ডিপোজিট করুন।',
    textEn: 'bKash temporarily under maintenance! Please use Nagad or Rocket to deposit.'
  },
  {
    id: 'notif-2',
    type: 'promo',
    icon: '🎉',
    textBn: 'বড় জিতুন ৬৭% দ্বিতীয় ডিপোজিট বোনাস! নগদ ডিপোজিটে ৫% অতিরিক্ত ক্যাশব্যাক।',
    textEn: 'Win big with 67% second deposit bonus! Extra 5% instant cashback on Nagad.'
  },
  {
    id: 'notif-3',
    type: 'system',
    icon: '⚡',
    textBn: 'JILI এবং PG স্লটে জ্যাকপট ড্র চলছে! যে কোনো স্পিনে জিতুন লাখ টাকা।',
    textEn: 'Jackpot drop active in JILI & PG slots! Win up to 100,000 BDT in any spin.'
  }
];

export const RECENT_WINNERS: WinnerItem[] = [
  { username: 'sham***98', game: 'Fortune Gems 2', amount: 48500, timeAgo: '১ মিনিট আগে' },
  { username: 'rafiq***77', game: 'Super Ace Deluxe', amount: 125000, timeAgo: '৩ মিনিট আগে' },
  { username: 'tareq***01', game: 'Money Coming', amount: 32000, timeAgo: '৫ মিনিট আগে' },
  { username: 'sakib***12', game: 'Treasures of Aztec', amount: 280000, timeAgo: '৭ মিনিট আগে' },
  { username: 'hasan***99', game: 'Boxing King', amount: 19500, timeAgo: '১০ মিনিট আগে' }
];

export const SIDEBAR_MENU_ITEMS = [
  { id: 'deposit', labelBn: 'ডিপোজিট', labelEn: 'Deposit', icon: 'wallet', color: 'from-amber-400 to-amber-600' },
  { id: 'withdraw', labelBn: 'উত্তোলন', labelEn: 'Withdraw', icon: 'arrow-down-to-line', color: 'from-emerald-400 to-emerald-600' },
  { id: 'offers', labelBn: 'অফার', labelEn: 'Offers', icon: 'gift', color: 'from-rose-500 to-pink-600' },
  { id: 'share', labelBn: 'শেয়ার', labelEn: 'Share', icon: 'share-2', color: 'from-blue-400 to-indigo-600' },
  { id: 'rewards', labelBn: 'পুরস্কার কেন্দ্র', labelEn: 'Rewards Center', icon: 'trophy', color: 'from-yellow-400 to-orange-500' },
  { id: 'cashback', labelBn: 'ক্যাশব্যাক', labelEn: 'Cashback', icon: 'badge-percent', color: 'from-cyan-400 to-blue-500' }
];

export const MEMBER_CENTER_SUBITEMS = [
  { id: 'vip', labelBn: 'ভিআইপি', labelEn: 'VIP Level', icon: 'crown' },
  { id: 'bet-record', labelBn: 'বেটিং রেকর্ড', labelEn: 'Betting Record', icon: 'file-text' },
  { id: 'transactions', labelBn: 'লেনদেনের বিশদ', labelEn: 'Transaction Details', icon: 'receipt' },
  { id: 'security', labelBn: 'সুরক্ষা কেন্দ্র', labelEn: 'Security Center', icon: 'shield-check' },
  { id: 'account', labelBn: 'আমার অ্যাকাউন্ট', labelEn: 'My Account', icon: 'user' },
  { id: 'profit', labelBn: 'লাভ', labelEn: 'Profit & Loss', icon: 'trending-up' },
  { id: 'mailbox', labelBn: 'মেইলবক্স', labelEn: 'Mailbox', icon: 'mail' }
];

export const GAME_CENTER_SUBITEMS = [
  { id: 'hot', labelBn: 'গরম খেলা', labelEn: 'Hot Games', icon: 'flame', tag: 'HOT' },
  { id: 'slot', labelBn: 'স্লটস গেম', labelEn: 'Slots Games', icon: 'circle-dot', tag: 'JILI/PG' },
  { id: 'fish', labelBn: 'মাছ ধরা খেলা', labelEn: 'Fishing Games', icon: 'fish', tag: '' },
  { id: 'live', labelBn: 'লাইভ ক্যাসিনো', labelEn: 'Live Casino', icon: 'sparkles', tag: 'LIVE' },
  { id: 'poker', labelBn: 'পোকার খেলা', labelEn: 'Poker Games', icon: 'club', tag: '' },
  { id: 'sports', labelBn: 'খেলাধুলা', labelEn: 'Sports Betting', icon: 'activity', tag: 'CRICKET' },
  { id: 'lottery', labelBn: 'লটারি খেলা', labelEn: 'Lottery Games', icon: 'dice-5', tag: '' }
];

export interface MemberGridItem {
  id: string;
  labelEn: string;
  labelBn: string;
  iconType: string;
  badge?: string;
  badgeColor?: string;
}

export const MEMBER_CENTER_GRID_ITEMS: MemberGridItem[] = [
  { id: 'reward-center', labelEn: 'Reward Center', labelBn: 'পুরস্কার সেন্টার', iconType: 'trophy' },
  { id: 'betting-record', labelEn: 'Betting Record', labelBn: 'বেটিং রেকর্ড', iconType: 'file-clock' },
  { id: 'profit-loss', labelEn: 'Profit & Loss', labelBn: 'লাভ এবং লস', iconType: 'trending-up' },
  { id: 'deposit-record', labelEn: 'Deposit Record', labelBn: 'জমা রেকর্ড', iconType: 'arrow-down-circle' },
  { id: 'withdrawal-record', labelEn: 'Withdrawal Record', labelBn: 'উত্তোলন রেকর্ড', iconType: 'arrow-up-circle' },
  { id: 'account-record', labelEn: 'Account Record', labelBn: 'অ্যাকাউন্ট রেকর্ড', iconType: 'book-open' },
  { id: 'my-account', labelEn: 'My Account', labelBn: 'আমার অ্যাকাউন্ট', iconType: 'user-cog' },
  { id: 'security-center', labelEn: 'Security Center', labelBn: 'সুরক্ষা কেন্দ্র', iconType: 'shield-check' },
  { id: 'invite-friends', labelEn: 'Invite Friends', labelBn: 'বন্ধুদের আমন্ত্রণ জানান', iconType: 'user-plus' },
  { id: 'rebate', labelEn: 'Rebate', labelBn: 'রিবেট', iconType: 'coins' },
  { id: 'internal-message', labelEn: 'Mail', labelBn: 'মেইল', iconType: 'mail', badge: '4', badgeColor: 'bg-red-500' },
  { id: 'suggestion', labelEn: 'Suggestion', labelBn: 'পরামর্শ', iconType: 'message-square' },
  { id: 'customer-service', labelEn: 'Customer Service', labelBn: 'কাস্টমার সার্ভিস', iconType: 'headset' },
  { id: 'help-center', labelEn: 'Help Center', labelBn: 'সাহায্য কেন্দ্র', iconType: 'help-circle' },
  { id: 'download-wp-theme', labelEn: 'WordPress Theme (ZIP)', labelBn: 'WordPress থিম ডাউনলোড (ZIP)', iconType: 'archive', badge: 'ZIP', badgeColor: 'bg-blue-600' },
  { id: 'download-html', labelEn: 'HTML File', labelBn: 'HTML ডাউনলোড', iconType: 'file-code', badge: '1-FILE', badgeColor: 'bg-emerald-600' },
  { id: 'logout', labelEn: 'Logout', labelBn: 'লগআউট', iconType: 'log-out' }
];

export const MOCK_BET_RECORDS: BetRecordItem[] = [
  { id: 'bet-101', gameTitle: 'Super Ace', provider: 'JILI', betAmount: 50, payoutAmount: 180, status: 'win', timestamp: 'Today 14:32' },
  { id: 'bet-102', gameTitle: 'Fortune Gems 3', provider: 'JILI', betAmount: 100, payoutAmount: 0, status: 'loss', timestamp: 'Today 14:15' },
  { id: 'bet-103', gameTitle: 'Circus Joker 4096', provider: 'JILI', betAmount: 20, payoutAmount: 95, status: 'win', timestamp: 'Today 13:58' },
  { id: 'bet-104', gameTitle: 'Boxing King', provider: 'JILI', betAmount: 40, payoutAmount: 0, status: 'loss', timestamp: 'Yesterday 21:10' },
  { id: 'bet-105', gameTitle: 'Money Coming', provider: 'JILI', betAmount: 50, payoutAmount: 320, status: 'win', timestamp: 'Yesterday 19:44' }
];

export const MOCK_INTERNAL_MESSAGES: InternalMessageItem[] = [
  { id: 'msg-1', title: 'Welcome Bonus 128% Activated', preview: 'Congratulations! Your welcome bonus is now available for claiming.', date: '2026-09-05', isRead: false },
  { id: 'msg-2', title: 'Daily Loss Rebate Credited', preview: '৳45.00 rebate has been added to your balance automatically.', date: '2026-09-04', isRead: false },
  { id: 'msg-3', title: 'bKash Deposit Gateway Update', preview: 'Rocket & Nagad deposits are receiving instant 5% bonus.', date: '2026-09-03', isRead: false },
  { id: 'msg-4', title: 'Security Reminder: Bind Bank', preview: 'Please bind your payment wallet to ensure swift withdrawals.', date: '2026-09-01', isRead: false }
];

