import React, { useState } from 'react';
import { ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { Language } from '../types';

export type PromoCategory = 'all' | 'reload' | 'cashback' | 'vip';

interface PromotionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onClaim?: (bonus: string) => void;
  onClaimBonus?: (amount: number, label: string) => void;
  initialTab?: PromoCategory;
}

export const PromotionsModal: React.FC<PromotionsModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const promos = [
    {
      id: 'promo-1',
      titleBn: 'প্রথম ডিপোজিট বোনাস ১২৮%',
      titleEn: '128% First Deposit Bonus',
      gradient: 'from-red-900/80 via-rose-900/60 to-black/90',
      image: '/assets/banners/banner_first_deposit.jpg',
      visualTitle: 'প্রথম ডিপোজিট ১২৮%',
      extra: null
    },
    {
      id: 'promo-2',
      titleBn: 'এজেন্ট ৪ সুপার কমিশন',
      titleEn: 'Agent 4 Super Commission',
      gradient: 'from-blue-950/80 via-indigo-900/60 to-black/90',
      image: '/assets/banners/banner_sports_vip.jpg',
      visualTitle: 'এজেন্ট ৪ কমিশন',
      extra: (
        <div className="flex gap-1 mt-1 flex-wrap">
          <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] px-1.5 py-0.5 rounded font-semibold">Invite</span>
          <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] px-1.5 py-0.5 rounded font-semibold">Deposit</span>
          <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] px-1.5 py-0.5 rounded font-semibold">Bet</span>
          <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] px-1.5 py-0.5 rounded font-semibold">VIP</span>
        </div>
      )
    },
    {
      id: 'promo-3',
      titleBn: 'ব্র্যান্ড এলায়েন্স BDLiveBet',
      titleEn: 'BDLiveBet Brand Alliance',
      gradient: 'from-emerald-950/80 via-teal-900/60 to-black/90',
      image: '/assets/banners/banner_casino_jackpot.jpg',
      visualTitle: 'ব্র্যান্ড এলায়েন্স',
      extra: null
    },
    {
      id: 'promo-4',
      titleBn: 'ডেইলি ৮% ফার্স্ট ডিপোজিট বোনাস',
      titleEn: 'Daily 8% First Deposit Bonus',
      gradient: 'from-red-950/90 via-amber-950/60 to-black/90',
      image: '/assets/banners/banner_first_deposit.jpg',
      visualTitle: 'ডেইলি ৮% ডিপোজিট',
      extra: null
    },
    {
      id: 'promo-5',
      titleBn: 'ভিআইপি লাইফটাইম সুবিধা',
      titleEn: 'VIP Lifetime Benefits',
      gradient: 'from-amber-950/90 via-yellow-950/60 to-black/90',
      image: '/assets/banners/banner_daily_cashback.jpg',
      visualTitle: 'ভিআইপি সুবিধা',
      extra: (
        <div className="flex gap-1 mt-1 flex-wrap">
          <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] px-1.5 py-0.5 rounded font-semibold">Upgrade</span>
          <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] px-1.5 py-0.5 rounded font-semibold">Monthly</span>
          <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] px-1.5 py-0.5 rounded font-semibold">Rebate</span>
        </div>
      )
    },
    {
      id: 'promo-6',
      titleBn: 'নতুন সদস্য নিবন্ধন বোনাস ৮,৭৭৭',
      titleEn: 'New Member Registration Bonus 8,777',
      gradient: 'from-rose-950/90 via-red-900/60 to-black/90',
      image: '/assets/banners/banner_casino_jackpot.jpg',
      visualTitle: 'নিবন্ধন বোনাস',
      extra: null
    },
    {
      id: 'promo-7',
      titleBn: '২য় ডিপোজিট বোনাস ৬৮%',
      titleEn: '68% Second Deposit Bonus',
      gradient: 'from-purple-950/90 via-rose-950/60 to-black/90',
      image: '/assets/banners/banner_first_deposit.jpg',
      visualTitle: '২য় ডিপোজিট ৬৮%',
      extra: null
    },
    {
      id: 'promo-8',
      titleBn: '৩য় ডিপোজিট বোনাস ৩৮%',
      titleEn: '38% Third Deposit Bonus',
      gradient: 'from-red-950/90 via-crimson-900/60 to-black/90',
      image: '/assets/banners/banner_sports_vip.jpg',
      visualTitle: '৩য় ডিপোজিট ৩৮%',
      extra: null
    },
    {
      id: 'promo-9',
      titleBn: '৪র্থ দিন লগইন করে জিতুন',
      titleEn: 'Win by Logging in on the 4th Day',
      gradient: 'from-fuchsia-950/90 via-pink-900/60 to-black/90',
      image: '/assets/banners/banner_daily_cashback.jpg',
      visualTitle: '৪র্থ দিন লগইন',
      extra: (
        <div className="flex gap-1 mt-1">
          <span className="bg-amber-400/20 text-amber-300 text-[10px] px-2 py-0.5 rounded border border-amber-400/40 font-bold">📱 iPhone Cash</span>
        </div>
      )
    },
    {
      id: 'promo-10',
      titleBn: '২৪ রাউন্ডের রেড এনভেলপ',
      titleEn: '24 Rounds Red Envelope',
      gradient: 'from-red-950/90 via-purple-950/60 to-black/90',
      image: '/assets/banners/banner_casino_jackpot.jpg',
      visualTitle: 'রেড এনভেলপ',
      extra: null
    }
  ];

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs">
      {/* Mobile-style layout container */}
      <div className="relative w-full h-full max-w-md bg-[#0e121a] flex flex-col shadow-2xl overflow-hidden border-x border-slate-800">
        
        {/* Clean Top Header */}
        <header className="bg-[#121622] border-b border-slate-800 px-4 py-3 flex items-center justify-between shrink-0 shadow-md z-10">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="p-1 -ml-1 text-slate-300 hover:text-white transition"
              aria-label="Back"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-bold text-slate-100">
              {language === 'bn' ? 'প্রমোশন' : 'Promotions'}
            </h2>
          </div>
          <div className="flex items-center">
            <span className="text-sm font-bold text-amber-400 border-b-2 border-amber-400 pb-0.5 px-2">
              {language === 'bn' ? 'সব' : 'All'}
            </span>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-3.5 py-3.5 space-y-3.5 no-scrollbar pb-10">
          {promos.map((promo) => (
            <div key={promo.id} className="rounded-2xl overflow-hidden shadow-lg bg-[#141926] border border-amber-500/25 flex flex-col transition hover:border-amber-400/50">
              
              {/* Full-width visual banner container with real artwork */}
              <div className="relative h-32 sm:h-36 overflow-hidden rounded-t-2xl select-none">
                {/* Genuine HD Casino Banner Artwork */}
                <img
                  src={promo.image}
                  alt={promo.titleEn}
                  className="w-full h-full object-cover select-none"
                  referrerPolicy="no-referrer"
                />

                {/* Dark Luxury Gradient Overlay for Contrast */}
                <div className={`absolute inset-0 bg-gradient-to-r ${promo.gradient} mix-blend-multiply opacity-80`} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141926] via-black/30 to-transparent" />

                {/* Brand Tag on Top-Left: Small gold-embossed BDLiveBet.vip badge */}
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] text-amber-300 font-bold border border-amber-500/40 tracking-wider shadow-md">
                  BDLiveBet.vip
                </div>
                
                {/* Visual Title / Gold Typography */}
                <div className="absolute bottom-2.5 left-3 right-3 z-10">
                  <h3 className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#FFF5C0] via-[#F59E0B] to-[#D97706] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] leading-tight">
                    {promo.visualTitle}
                  </h3>
                  {promo.extra}
                </div>
              </div>

              {/* Clean Dark Luxury Footer Strip */}
              <div className="bg-[#121620] px-4 py-3 rounded-b-2xl border-t border-slate-800 flex justify-between items-center">
                <h4 className="text-sm font-bold text-slate-100 flex-1 pr-2 truncate">
                  {language === 'bn' ? promo.titleBn : promo.titleEn}
                </h4>
                
                <button
                  type="button"
                  onClick={() => toggleExpand(promo.id)}
                  className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center shadow-xs shrink-0 hover:bg-amber-500/30 active:scale-95 transition-all"
                  aria-label="Toggle details"
                >
                  {expandedId === promo.id ? (
                    <ChevronUp className="w-4 h-4 stroke-[2.5]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                  )}
                </button>
              </div>

              {/* Expanded Rules Section */}
              {expandedId === promo.id && (
                <div className="px-4 py-3 bg-[#10141e] border-t border-slate-800/80 text-xs text-slate-300 space-y-2 animate-in slide-in-from-top-2">
                  <p className="leading-relaxed">
                    {language === 'bn' 
                      ? 'শর্তাবলী: এই অফারটি শুধুমাত্র নিবন্ধিত ব্যবহারকারীদের জন্য প্রযোজ্য। বোনাস ক্লেইম করার পর প্রয়োজনীয় রোলওভার পূরণ করতে হবে। যেকোনো সহায়তার জন্য ২৪/৭ কাস্টমার সার্ভিসের সাথে যোগাযোগ করুন।' 
                      : 'Terms & Conditions: This offer is exclusively for registered members. Complete the rollover requirement after claiming. Contact 24/7 customer support for any assistance.'}
                  </p>
                  <div className="pt-1 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold border border-emerald-500/30">
                      {language === 'bn' ? 'সক্রিয় অফার' : 'Active'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      BDLiveBet VIP Club
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
