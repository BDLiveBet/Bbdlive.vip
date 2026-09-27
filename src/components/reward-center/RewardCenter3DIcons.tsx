import React from 'react';

/**
 * 3D Illustrated SVGs and graphics for the Reward Center ecosystem:
 * - 3D Gift Box (Green gradient card)
 * - 3D Calendar with glowing checkmark (Sky Blue card)
 * - 3D User/People with trophy & rewards (Red/Pink card)
 * - 3D Treasure Chest overflowing with gold & gems (Orange/Gold card)
 * - 3D Wheel Icons (Bronze, Silver, Gold, Platinum, Diamond)
 * - 3D Mega Prize Chests (Day 6 & 7)
 * - 3D Empty State Illustration
 */

export const Icon3DGiftBox: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="gift-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#4ADE80" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#16A34A" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="box-front" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#22C55E" />
        <stop offset="50%" stopColor="#16A34A" />
        <stop offset="100%" stopColor="#14532D" />
      </linearGradient>
      <linearGradient id="box-top" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#86EFAC" />
        <stop offset="100%" stopColor="#22C55E" />
      </linearGradient>
      <linearGradient id="ribbon-gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
      <filter id="gift-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#052E16" floodOpacity="0.6" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="42" fill="url(#gift-glow)" opacity="0.4" />
    <g filter="url(#gift-shadow)">
      {/* Box Base */}
      <path d="M22 42 L50 56 L78 42 L50 28 Z" fill="url(#box-top)" />
      <path d="M22 42 L50 56 L50 82 L22 68 Z" fill="url(#box-front)" />
      <path d="M50 56 L78 42 L78 68 L50 82 Z" fill="#15803D" />
      
      {/* Golden Vertical Ribbon */}
      <path d="M46 54 L54 58 L54 82 L46 78 Z" fill="url(#ribbon-gold)" />
      <path d="M34 36 L42 40 L70 26 L62 22 Z" fill="url(#ribbon-gold)" />
      
      {/* Golden Bow Ribbons */}
      <ellipse cx="43" cy="24" rx="9" ry="6" transform="rotate(-30 43 24)" fill="url(#ribbon-gold)" />
      <ellipse cx="57" cy="24" rx="9" ry="6" transform="rotate(30 57 24)" fill="url(#ribbon-gold)" />
      <circle cx="50" cy="26" r="4.5" fill="#FDE047" stroke="#B45309" strokeWidth="1" />
      
      {/* Sparkles */}
      <circle cx="20" cy="25" r="2" fill="#FEF08A" />
      <circle cx="80" cy="32" r="1.5" fill="#FEF08A" />
      <circle cx="76" cy="74" r="2.5" fill="#FEF08A" />
    </g>
  </svg>
);

export const Icon3DCalendar: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="cal-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="cal-body" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#E0F2FE" />
      </linearGradient>
      <linearGradient id="cal-header" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="50%" stopColor="#0284C7" />
        <stop offset="100%" stopColor="#0369A1" />
      </linearGradient>
      <linearGradient id="ring-silver" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#F8FAFC" />
        <stop offset="100%" stopColor="#64748B" />
      </linearGradient>
      <linearGradient id="check-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4ADE80" />
        <stop offset="100%" stopColor="#16A34A" />
      </linearGradient>
      <filter id="cal-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#082F49" floodOpacity="0.55" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="42" fill="url(#cal-glow)" opacity="0.4" />
    <g filter="url(#cal-shadow)">
      {/* 3D Slanted Calendar Slab */}
      <rect x="20" y="24" width="60" height="58" rx="12" fill="url(#cal-body)" />
      
      {/* Top Header Strip */}
      <path d="M20 34 C20 28.477 24.477 24 30 24 L70 24 C75.523 24 80 28.477 80 34 L80 42 L20 42 Z" fill="url(#cal-header)" />
      
      {/* Calendar Binding Rings */}
      <rect x="30" y="16" width="6" height="14" rx="3" fill="url(#ring-silver)" />
      <rect x="64" y="16" width="6" height="14" rx="3" fill="url(#ring-silver)" />
      
      {/* Calendar Grid Dots */}
      <circle cx="34" cy="52" r="3" fill="#BAE6FD" />
      <circle cx="50" cy="52" r="3" fill="#BAE6FD" />
      <circle cx="66" cy="52" r="3" fill="#BAE6FD" />
      
      <circle cx="34" cy="64" r="3" fill="#BAE6FD" />
      
      {/* Big 3D Glowing Checkmark Badge in center */}
      <circle cx="58" cy="66" r="16" fill="url(#check-emerald)" />
      <path d="M50 66 L55 71 L67 59" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Star Accents */}
      <circle cx="78" cy="20" r="2" fill="#FDE047" />
      <circle cx="16" cy="70" r="2" fill="#38BDF8" />
    </g>
  </svg>
);

export const Icon3DInvitePeople: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="inv-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FB7185" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#E11D48" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="inv-avatar-center" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FDA4AF" />
        <stop offset="50%" stopColor="#F43F5E" />
        <stop offset="100%" stopColor="#BE123C" />
      </linearGradient>
      <linearGradient id="inv-avatar-side" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FECDD3" />
        <stop offset="100%" stopColor="#FB7185" />
      </linearGradient>
      <linearGradient id="gold-coin-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="50%" stopColor="#EAB308" />
        <stop offset="100%" stopColor="#A16207" />
      </linearGradient>
      <filter id="inv-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#4C0519" floodOpacity="0.55" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="42" fill="url(#inv-glow)" opacity="0.4" />
    <g filter="url(#inv-shadow)">
      {/* Left Avatar */}
      <circle cx="30" cy="38" r="9" fill="url(#inv-avatar-side)" opacity="0.85" />
      <path d="M16 62 C16 52 22 49 30 49 C38 49 44 52 44 62 Z" fill="url(#inv-avatar-side)" opacity="0.85" />
      
      {/* Right Avatar */}
      <circle cx="70" cy="38" r="9" fill="url(#inv-avatar-side)" opacity="0.85" />
      <path d="M56 62 C56 52 62 49 70 49 C78 49 84 52 84 62 Z" fill="url(#inv-avatar-side)" opacity="0.85" />

      {/* Main Center Avatar (VIP Leader) */}
      <circle cx="50" cy="32" r="12" fill="url(#inv-avatar-center)" />
      {/* Crown on Center Avatar */}
      <path d="M42 22 L46 25 L50 20 L54 25 L58 22 L57 27 L43 27 Z" fill="url(#gold-coin-grad)" stroke="#854D0E" strokeWidth="0.5" />
      <path d="M30 68 C30 55 38 50 50 50 C62 50 70 55 70 68 Z" fill="url(#inv-avatar-center)" />
      
      {/* Floating Gold Coin Badge with + sign */}
      <circle cx="72" cy="68" r="12" fill="url(#gold-coin-grad)" stroke="#FEF08A" strokeWidth="1.5" />
      <text x="72" y="73" textAnchor="middle" fill="#78350F" fontSize="13" fontWeight="900">৳</text>
      
      <circle cx="20" cy="22" r="2" fill="#FDE047" />
      <circle cx="82" cy="25" r="2.5" fill="#FDE047" />
    </g>
  </svg>
);

export const Icon3DTreasureChest: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="chest-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="wood-chest" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#D97706" />
        <stop offset="50%" stopColor="#B45309" />
        <stop offset="100%" stopColor="#78350F" />
      </linearGradient>
      <linearGradient id="gold-metal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
      <filter id="chest-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#451A03" floodOpacity="0.6" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="42" fill="url(#chest-glow)" opacity="0.4" />
    <g filter="url(#chest-shadow)">
      {/* Overflowing Gold Coins & Gems behind lid */}
      <circle cx="38" cy="38" r="6" fill="#FDE047" stroke="#CA8A04" strokeWidth="1" />
      <circle cx="50" cy="35" r="7" fill="#FACC15" stroke="#CA8A04" strokeWidth="1" />
      <circle cx="62" cy="38" r="6" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" />
      <polygon points="46,30 50,24 54,30 50,34" fill="#38BDF8" />
      <polygon points="58,32 61,26 65,31 62,35" fill="#F43F5E" />

      {/* Chest Base */}
      <path d="M18 46 L82 46 L76 78 C76 81.3 73.3 84 70 84 L30 84 C26.7 84 24 81.3 24 78 Z" fill="url(#wood-chest)" />
      
      {/* Golden Corner Reinforcements */}
      <path d="M18 46 L28 46 L28 84 L24 84 C20.7 84 18 81.3 18 78 Z" fill="url(#gold-metal)" />
      <path d="M82 46 L72 46 L72 84 L76 84 C79.3 84 82 81.3 82 78 Z" fill="url(#gold-metal)" />
      
      {/* Horizontal Gold Bar */}
      <rect x="22" y="58" width="56" height="6" fill="url(#gold-metal)" />

      {/* Chest Open Lid (Tilted upwards) */}
      <path d="M16 46 C16 32 30 26 50 26 C70 26 84 32 84 46 L80 49 C78 36 68 31 50 31 C32 31 22 36 20 49 Z" fill="url(#wood-chest)" />
      <path d="M16 46 L84 46 L84 49 L16 49 Z" fill="url(#gold-metal)" />
      
      {/* Central Golden Keyhole Lock */}
      <circle cx="50" cy="61" r="7" fill="url(#gold-metal)" stroke="#78350F" strokeWidth="1" />
      <path d="M49 59 L51 59 L52 64 L48 64 Z" fill="#451A03" />
      <circle cx="50" cy="59" r="1.5" fill="#451A03" />

      {/* Glow stars */}
      <circle cx="28" cy="22" r="2.5" fill="#FEF08A" />
      <circle cx="78" cy="22" r="2.5" fill="#FEF08A" />
      <circle cx="50" cy="18" r="3" fill="#FFFFFF" />
    </g>
  </svg>
);

/**
 * 3D Wheel Icons for 7-Day Event
 */
export const Icon3DWheel: React.FC<{
  type: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  className?: string;
}> = ({ type, className = 'w-16 h-16' }) => {
  const configs = {
    bronze: {
      rim1: '#B45309',
      rim2: '#78350F',
      segment1: '#D97706',
      segment2: '#92400E',
      center: '#F59E0B',
      centerText: '🥉',
      glow: '#D97706'
    },
    silver: {
      rim1: '#E2E8F0',
      rim2: '#64748B',
      segment1: '#CBD5E1',
      segment2: '#94A3B8',
      center: '#F8FAFC',
      centerText: '🥈',
      glow: '#94A3B8'
    },
    gold: {
      rim1: '#FEF08A',
      rim2: '#B45309',
      segment1: '#FACC15',
      segment2: '#CA8A04',
      center: '#FDE047',
      centerText: '🥇',
      glow: '#EAB308'
    },
    platinum: {
      rim1: '#E0E7FF',
      rim2: '#4338CA',
      segment1: '#818CF8',
      segment2: '#4F46E5',
      center: '#C7D2FE',
      centerText: '💎',
      glow: '#6366F1'
    },
    diamond: {
      rim1: '#BAE6FD',
      rim2: '#0369A1',
      segment1: '#38BDF8',
      segment2: '#0284C7',
      center: '#E0F2FE',
      centerText: '👑',
      glow: '#0EA5E9'
    }
  };

  const cfg = configs[type];

  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`wheel-glow-${type}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={cfg.glow} stopOpacity="0.8" />
          <stop offset="100%" stopColor={cfg.glow} stopOpacity="0" />
        </radialGradient>
        <filter id={`wheel-shd-${type}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#000000" floodOpacity="0.5" />
        </filter>
      </defs>
      <circle cx="50" cy="50" r="44" fill={`url(#wheel-glow-${type})`} opacity="0.4" />
      <g filter={`url(#wheel-shd-${type})`}>
        {/* Outer Wheel Rim */}
        <circle cx="50" cy="50" r="38" fill={cfg.rim1} stroke={cfg.rim2} strokeWidth="4" />
        {/* Decorative Studs */}
        <circle cx="50" cy="16" r="2.5" fill="#FFFFFF" />
        <circle cx="50" cy="84" r="2.5" fill="#FFFFFF" />
        <circle cx="16" cy="50" r="2.5" fill="#FFFFFF" />
        <circle cx="84" cy="50" r="2.5" fill="#FFFFFF" />
        <circle cx="26" cy="26" r="2" fill="#FFFFFF" />
        <circle cx="74" cy="26" r="2" fill="#FFFFFF" />
        <circle cx="26" cy="74" r="2" fill="#FFFFFF" />
        <circle cx="74" cy="74" r="2" fill="#FFFFFF" />
        
        {/* Inner Wheel Segments (8 pizza slices) */}
        <path d="M50 50 L50 18 A32 32 0 0 1 73 27 Z" fill={cfg.segment1} />
        <path d="M50 50 L73 27 A32 32 0 0 1 82 50 Z" fill={cfg.segment2} />
        <path d="M50 50 L82 50 A32 32 0 0 1 73 73 Z" fill={cfg.segment1} />
        <path d="M50 50 L73 73 A32 32 0 0 1 50 82 Z" fill={cfg.segment2} />
        <path d="M50 50 L50 82 A32 32 0 0 1 27 73 Z" fill={cfg.segment1} />
        <path d="M50 50 L27 73 A32 32 0 0 1 18 50 Z" fill={cfg.segment2} />
        <path d="M50 50 L18 50 A32 32 0 0 1 27 27 Z" fill={cfg.segment1} />
        <path d="M50 50 L27 27 A32 32 0 0 1 50 18 Z" fill={cfg.segment2} />

        {/* Center Hub */}
        <circle cx="50" cy="50" r="14" fill={cfg.center} stroke={cfg.rim2} strokeWidth="2.5" />
        <text x="50" y="55" textAnchor="middle" fontSize="13">{cfg.centerText}</text>

        {/* Top Pointer Indicator */}
        <polygon points="50,8 55,18 45,18" fill="#EF4444" stroke="#7F1D1D" strokeWidth="1" />
      </g>
    </svg>
  );
};

export const Icon3DMegaChest: React.FC<{
  tier: 'ruby' | 'supreme';
  className?: string;
}> = ({ tier, className = 'w-16 h-16' }) => {
  const isSupreme = tier === 'supreme';
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`chest-mg-${tier}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={isSupreme ? '#F59E0B' : '#EC4899'} stopOpacity="0.9" />
          <stop offset="100%" stopColor={isSupreme ? '#D97706' : '#BE185D'} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`body-mg-${tier}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isSupreme ? '#FDE047' : '#F43F5E'} />
          <stop offset="50%" stopColor={isSupreme ? '#EAB308' : '#BE123C'} />
          <stop offset="100%" stopColor={isSupreme ? '#78350F' : '#881337'} />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="44" fill={`url(#chest-mg-${tier})`} opacity="0.4" />
      {/* 3D Chest Body */}
      <rect x="20" y="44" width="60" height="38" rx="8" fill={`url(#body-mg-${tier})`} stroke="#FFFFFF" strokeWidth="1.5" />
      <rect x="18" y="32" width="64" height="16" rx="6" fill={isSupreme ? '#FEF08A' : '#FDA4AF'} stroke="#FFFFFF" strokeWidth="1.5" />
      {/* Gem in Center */}
      <polygon points="50,44 58,54 50,64 42,54" fill={isSupreme ? '#EF4444' : '#FACC15'} stroke="#FFFFFF" strokeWidth="1.5" />
      {/* Crown on top for Supreme */}
      {isSupreme && (
        <path d="M40 22 L45 26 L50 20 L55 26 L60 22 L59 28 L41 28 Z" fill="#FDE047" stroke="#A16207" strokeWidth="1" />
      )}
      <circle cx="28" cy="24" r="2" fill="#FFFFFF" />
      <circle cx="72" cy="26" r="2" fill="#FFFFFF" />
    </svg>
  );
};

export const Illustration3DEmptyPromotion: React.FC<{ className?: string }> = ({
  className = 'w-44 h-44'
}) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="emp-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="podium-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#334155" />
        <stop offset="100%" stopColor="#0F172A" />
      </linearGradient>
      <linearGradient id="box-empty" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#64748B" />
        <stop offset="50%" stopColor="#475569" />
        <stop offset="100%" stopColor="#1E293B" />
      </linearGradient>
    </defs>
    <circle cx="100" cy="100" r="90" fill="url(#emp-glow)" />
    
    {/* Floating Futuristic Podium */}
    <ellipse cx="100" cy="150" rx="65" ry="18" fill="url(#podium-grad)" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="4 4" />
    <ellipse cx="100" cy="147" rx="50" ry="12" fill="#1E293B" />

    {/* Open Empty 3D Box */}
    <path d="M60 90 L100 110 L140 90 L100 70 Z" fill="#334155" stroke="#64748B" strokeWidth="1" />
    <path d="M60 90 L100 110 L100 145 L60 125 Z" fill="url(#box-empty)" />
    <path d="M100 110 L140 90 L140 125 L100 145 Z" fill="#1E293B" />

    {/* Open Flaps */}
    <polygon points="60,90 35,80 75,70 100,70" fill="#475569" />
    <polygon points="140,90 165,80 125,70 100,70" fill="#334155" />

    {/* Floating Hologram Question/Ticket Icon */}
    <circle cx="100" cy="55" r="18" fill="#0284C7" fillOpacity="0.2" stroke="#38BDF8" strokeWidth="1.5" />
    <text x="100" y="63" textAnchor="middle" fill="#38BDF8" fontSize="22" fontWeight="900">?</text>

    {/* Sparkling floating stars */}
    <circle cx="55" cy="50" r="3" fill="#FACC15" />
    <circle cx="145" cy="45" r="2.5" fill="#38BDF8" />
    <circle cx="150" cy="115" r="2" fill="#FACC15" />
    <circle cx="45" cy="115" r="2" fill="#38BDF8" />
  </svg>
);

export const Icon3DFlame: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="flame-glow" cx="50%" cy="60%" r="50%">
        <stop offset="0%" stopColor="#F97316" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="flame-outer" x1="0%" y1="100%" x2="50%" y2="0%">
        <stop offset="0%" stopColor="#DC2626" />
        <stop offset="50%" stopColor="#EA580C" />
        <stop offset="100%" stopColor="#F97316" />
      </linearGradient>
      <linearGradient id="flame-mid" x1="0%" y1="100%" x2="50%" y2="0%">
        <stop offset="0%" stopColor="#F97316" />
        <stop offset="60%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#FEF08A" />
      </linearGradient>
      <linearGradient id="flame-inner" x1="0%" y1="100%" x2="50%" y2="0%">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#FFFFFF" />
      </linearGradient>
      <filter id="flame-shd" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#7F1D1D" floodOpacity="0.6" />
      </filter>
    </defs>
    <circle cx="50" cy="55" r="40" fill="url(#flame-glow)" opacity="0.5" />
    <g filter="url(#flame-shd)">
      {/* Outer Flame Tongue */}
      <path
        d="M50 12 C52 24 64 34 68 46 C74 58 68 76 54 84 C40 92 26 82 24 68 C22 54 32 42 38 32 C39 40 44 44 46 42 C50 36 46 22 50 12 Z"
        fill="url(#flame-outer)"
      />
      {/* Middle Golden Flame */}
      <path
        d="M51 28 C53 38 60 46 61 54 C63 64 56 74 48 77 C40 80 34 74 34 65 C34 56 40 50 44 44 C45 49 48 51 49 48 C51 42 49 34 51 28 Z"
        fill="url(#flame-mid)"
      />
      {/* Inner White-Hot Core */}
      <path
        d="M50 46 C52 52 56 57 55 62 C54 68 49 72 45 71 C41 70 38 66 39 61 C40 56 44 54 46 51 C47 54 48 55 49 53 C50 49 49 47 50 46 Z"
        fill="url(#flame-inner)"
      />
      {/* Sparkles */}
      <circle cx="70" cy="30" r="2" fill="#FEF08A" />
      <circle cx="28" cy="42" r="1.5" fill="#FEF08A" />
      <circle cx="36" cy="18" r="2" fill="#FDE047" />
    </g>
  </svg>
);

export const Icon3DVipCrown: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="crown-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#B45309" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="crown-gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
      <linearGradient id="crown-band" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#D97706" />
        <stop offset="50%" stopColor="#FEF08A" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <filter id="crown-shd" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#451A03" floodOpacity="0.6" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="42" fill="url(#crown-glow)" opacity="0.45" />
    <g filter="url(#crown-shd)">
      {/* Crown Prongs */}
      <path
        d="M20 68 L24 38 L38 52 L50 24 L62 52 L76 38 L80 68 Z"
        fill="url(#crown-gold)"
        stroke="#78350F"
        strokeWidth="1.5"
      />
      {/* Base Band */}
      <rect x="20" y="68" width="60" height="12" rx="4" fill="url(#crown-band)" stroke="#78350F" strokeWidth="1.5" />
      {/* Jewels on Peaks */}
      <circle cx="24" cy="38" r="4" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1" />
      <circle cx="50" cy="24" r="5" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1.5" />
      <circle cx="76" cy="38" r="4" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1" />
      {/* Band Jewels */}
      <circle cx="32" cy="74" r="2.5" fill="#10B981" />
      <polygon points="50,71 53,74 50,77 47,74" fill="#EF4444" />
      <circle cx="68" cy="74" r="2.5" fill="#10B981" />
      {/* Sparkles */}
      <circle cx="16" cy="26" r="2.5" fill="#FEF08A" />
      <circle cx="84" cy="28" r="2.5" fill="#FEF08A" />
    </g>
  </svg>
);

export const Icon3DGoldenTicket: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="ticket-gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <radialGradient id="ticket-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FDE047" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#B45309" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="44" fill="url(#ticket-glow)" opacity="0.4" />
    {/* Ticket Slab tilted */}
    <g transform="rotate(-15 50 50)">
      <path
        d="M18 30 C18 26.686 20.686 24 24 24 L76 24 C79.314 24 82 26.686 82 30 L82 44 C78 44 76 47 76 50 C76 53 78 56 82 56 L82 70 C82 73.314 79.314 76 76 76 L24 76 C20.686 76 18 73.314 18 70 L18 56 C22 56 24 53 24 50 C24 47 22 44 18 44 Z"
        fill="url(#ticket-gold)"
        stroke="#78350F"
        strokeWidth="2"
      />
      {/* Perforation Line */}
      <line x1="38" y1="26" x2="38" y2="74" stroke="#78350F" strokeWidth="2" strokeDasharray="4 3" />
      {/* Star / Stamp */}
      <circle cx="58" cy="50" r="10" fill="#FEF08A" stroke="#B45309" strokeWidth="1.5" />
      <polygon points="58,43 60,48 65,48 61,51 63,56 58,53 53,56 55,51 51,48 56,48" fill="#D97706" />
    </g>
  </svg>
);

