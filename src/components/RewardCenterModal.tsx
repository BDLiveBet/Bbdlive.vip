import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  RotateCw,
  Edit2,
  Check,
  Copy,
  Ticket,
  Share2,
  Trophy,
  ExternalLink,
  Gift,
  Calendar,
  Users,
  ChevronRight,
  Info,
  Calculator,
  TrendingUp,
  Clock,
  Filter,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Award,
  Download,
  Coins,
  Medal
} from 'lucide-react';
import { Language, AuthUser } from '../types';
import {
  Icon3DGiftBox,
  Icon3DCalendar,
  Icon3DInvitePeople,
  Icon3DTreasureChest,
  Icon3DWheel,
  Illustration3DEmptyPromotion
} from './reward-center/RewardCenter3DIcons';
import { LiveWinnerFeed } from './LiveWinnerFeed';
import { copyToClipboard } from '../utils/clipboard';

export type RewardCenterTab =
  | 'main'
  | 'claim'
  | 'checkin'
  | 'invite'
  | 'temu'
  | 'daily'
  | 'wheel'
  | 'missions'
  | 'coupon'
  | 'bonus'
  | 'vip'
  | 'all';

export type RewardSubPage = 'main' | 'claim' | 'checkin' | 'invite' | 'temu';
export type InviteSubTab = 'summary' | 'rewards' | 'income' | 'records' | 'invites';

interface RewardCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  currentUser?: AuthUser | null;
  walletBalance: number;
  onRefreshBalance: () => void;
  isRefreshing: boolean;
  onClaimBonus: (amount: number, description: string) => void;
  onOpenDeposit?: () => void;
  onOpenShare?: () => void;
  initialTab?: RewardCenterTab | string;
}

export const RewardCenterModal: React.FC<RewardCenterModalProps> = ({
  isOpen,
  onClose,
  language,
  currentUser,
  walletBalance,
  onRefreshBalance,
  isRefreshing,
  onClaimBonus,
  onOpenDeposit,
  onOpenShare,
  initialTab = 'main'
}) => {
  // Normalize initial tab to SubPage
  const resolveInitialPage = (tab?: string): RewardSubPage => {
    if (tab === 'claim') return 'claim';
    if (tab === 'checkin' || tab === 'daily') return 'checkin';
    if (tab === 'invite') return 'invite';
    if (tab === 'temu') return 'temu';
    return 'main';
  };

  const [currentPage, setCurrentPage] = useState<RewardSubPage>(() => resolveInitialPage(initialTab));
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Invite friends tab state
  const [inviteTab, setInviteTab] = useState<InviteSubTab>('summary');
  const [calcInvitedFriends, setCalcInvitedFriends] = useState<number>(10);
  const [calcDailyTurnover, setCalcDailyTurnover] = useState<number>(5000);
  const [claimedRewardTiers, setClaimedRewardTiers] = useState<number[]>([]);
  const [recordsFilter, setRecordsFilter] = useState<'today' | '7days' | '30days'>('today');

  // Dynamic user referral link & QR code
  const userUid = (currentUser as any)?.id || (currentUser as any)?.uid || currentUser?.userId || currentUser?.username || 'vip0960';
  const referralLink = `https://bdlivebet.vip/register?ref=${userUid}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&format=png&data=${encodeURIComponent(referralLink)}`;

  // Check-in state
  const [hasCheckedInToday, setHasCheckedInToday] = useState<boolean>(false);
  const [checkInDaysCount, setCheckInDaysCount] = useState<number>(1);
  const [totalCheckInReward, setTotalCheckInReward] = useState<number>(0);

  // Nickname edit state
  const [isEditingNickname, setIsEditingNickname] = useState<boolean>(false);
  const [nicknameInput, setNicknameInput] = useState<string>(
    currentUser?.username || 'vvshamim'
  );
  const [displayedUsername, setDisplayedUsername] = useState<string>(
    currentUser?.username || 'vvshamim'
  );

  // Sync initial tab when reopened
  useEffect(() => {
    if (isOpen) {
      setCurrentPage(resolveInitialPage(initialTab));
    }
  }, [isOpen, initialTab]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopy = async (text: string, label: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      showToast(label);
    } else {
      showToast('Failed to copy');
    }
  };

  const handleNativeShare = (platform: 'whatsapp' | 'telegram' | 'facebook' | 'copy') => {
    const shareMessage =
      language === 'bn'
        ? `BDLiveBet-এ যোগ দিন এবং সেরা ক্যাশব্যাক ও দৈনিক বোনাস জিতুন! রেজিস্ট্রেশন লিংক: ${referralLink}`
        : `Join BDLiveBet to unlock top cashbacks and daily bonuses! Registration link: ${referralLink}`;

    if (platform === 'whatsapp') {
      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
      try {
        window.open(url, '_blank', 'noopener,noreferrer');
      } catch (e) {
        // Fallback
      }
    } else if (platform === 'telegram') {
      const url = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareMessage)}`;
      try {
        window.open(url, '_blank', 'noopener,noreferrer');
      } catch (e) {
        // Fallback
      }
    } else if (platform === 'facebook') {
      const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`;
      try {
        window.open(url, '_blank', 'noopener,noreferrer');
      } catch (e) {
        // Fallback
      }
    }
    handleCopy(
      referralLink,
      language === 'bn'
        ? `${platform.toUpperCase()} শেয়ার লিংক সফলভাবে কপি করা হয়েছে!`
        : `Referral link copied for ${platform.toUpperCase()}!`
    );
  };

  const handleClaimMilestoneReward = (tierLevel: number, amount: number, label: string) => {
    if (claimedRewardTiers.includes(tierLevel)) {
      showToast(language === 'bn' ? 'এই স্তরটি আগেই দাবি করা হয়েছে!' : 'Tier already claimed!');
      return;
    }
    setClaimedRewardTiers((prev) => [...prev, tierLevel]);
    onClaimBonus(amount, `${label} (টায়ার ${tierLevel})`);
    showToast(
      language === 'bn'
        ? `🎉 চমৎকার! +৳${amount.toFixed(2)} আমন্ত্রণ পুরস্কার যোগ হয়েছে!`
        : `🎉 Awesome! +৳${amount.toFixed(2)} referral bonus credited!`
    );
  };

  const handleDailySignIn = () => {
    if (hasCheckedInToday) {
      showToast(language === 'bn' ? 'আজকের চেক-ইন আগেই নেওয়া হয়েছে!' : 'Already signed in today!');
      return;
    }
    setHasCheckedInToday(true);
    const rewardAmount = 50.0;
    setCheckInDaysCount((prev) => prev + 1);
    setTotalCheckInReward((prev) => prev + rewardAmount);
    onClaimBonus(
      rewardAmount,
      language === 'bn' ? '১ম দিন ব্রোঞ্জ হুইল সাইন ইন বোনাস' : 'Day 1 Bronze Wheel Sign-in'
    );
    showToast(
      language === 'bn'
        ? `🎉 সফল! +৳${rewardAmount.toFixed(2)} সাইন ইন বোনাস অ্যাকাউন্টে যোগ হয়েছে!`
        : `🎉 Success! +৳${rewardAmount.toFixed(2)} sign-in bonus added!`
    );
  };

  const handleSaveNickname = () => {
    const trimmed = nicknameInput.trim();
    if (trimmed) {
      setDisplayedUsername(trimmed);
      showToast(language === 'bn' ? 'ব্যবহারকারীর নাম পরিবর্তন সফল!' : 'Nickname updated successfully!');
    }
    setIsEditingNickname(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="rewards-center-modal"
        className="w-full max-w-md md:max-w-lg bg-[#f8f9fb] text-slate-800 sm:rounded-3xl shadow-2xl border border-gray-200 flex flex-col h-[100dvh] sm:h-[90vh] overflow-hidden relative font-sans select-none"
      >
        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="absolute top-14 inset-x-4 z-50 p-3 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm text-center shadow-2xl border border-yellow-200 animate-in slide-in-from-top duration-200">
            {toastMessage}
          </div>
        )}

        {/* ========================================================================= */}
        {/* MAIN VIEW: পুরস্কার সেন্টার */}
        {/* ========================================================================= */}
        {currentPage === 'main' && (
          <div className="flex flex-col h-full overflow-hidden">
            {/* 1. Header: Back Arrow (<) with title "পুরস্কার সেন্টার" */}
            <header className="bg-[#111622] text-white border-b border-[#1f2937] px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  id="btn-rewards-back-main"
                  onClick={onClose}
                  aria-label="Back"
                  className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition active:scale-95"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h1 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                  {language === 'bn' ? 'পুরস্কার সেন্টার' : 'Rewards Center'}
                </h1>
              </div>
            </header>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-3.5 sm:p-4 space-y-4">
              {/* 2. Top VIP Gold Card */}
              <div className="relative rounded-2xl p-4 bg-gradient-to-br from-[#E2B755] via-[#D39E36] to-[#B37E22] text-slate-950 shadow-xl border border-amber-300/40 overflow-hidden">
                {/* Subtle Luxury Pattern / Light Sheen */}
                <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-white/20 rounded-full blur-2xl pointer-events-none" />

                {/* Top Section: Avatar, Username, Nickname edit, Balance, Refresh, VIP Badge, Red Pill */}
                <div className="relative z-10 flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    {/* User Avatar with VIP Golden Border */}
                    <div className="relative w-12 h-12 rounded-full border-2 border-white/90 shadow-md overflow-hidden bg-slate-900 shrink-0">
                      <img
                        src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80'}
                        alt="User"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div>
                      {/* Username + Edit Nickname Icon + VIP2 Badge */}
                      <div className="flex items-center gap-2">
                        {isEditingNickname ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={nicknameInput}
                              onChange={(e) => setNicknameInput(e.target.value)}
                              className="w-24 px-1.5 py-0.5 text-xs font-bold rounded bg-black/20 text-slate-950 border border-slate-950/30 outline-none"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={handleSaveNickname}
                              className="p-1 rounded bg-slate-950 text-white hover:bg-slate-800"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm sm:text-base font-bold tracking-tight text-slate-950">
                              {displayedUsername}
                            </span>
                            <button
                              type="button"
                              onClick={() => setIsEditingNickname(true)}
                              title="Edit Nickname"
                              className="p-0.5 text-slate-900/80 hover:text-slate-950 transition"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        {/* VIP2 Badge */}
                        <span className="px-2 py-0.5 rounded-md bg-slate-950 text-amber-300 text-xs font-black tracking-wider uppercase shadow-sm">
                          VIP2
                        </span>
                      </div>

                      {/* Balance & Refresh Button */}
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-xs sm:text-sm font-bold text-slate-950 font-['Poppins',sans-serif]">
                          ৳ {walletBalance !== undefined ? walletBalance.toFixed(2) : '0.06'}
                        </span>
                        <button
                          type="button"
                          id="btn-refresh-rewards-balance"
                          onClick={onRefreshBalance}
                          title="Refresh Balance"
                          className="p-1 text-slate-900 hover:text-black transition active:scale-95"
                        >
                          <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Top-Right Red Pill Button: [✓] সাইন ইন > */}
                  <button
                    type="button"
                    id="btn-gold-card-signin"
                    onClick={() => setCurrentPage('checkin')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#E53935] hover:bg-[#D32F2F] text-white text-xs font-black shadow-md border border-red-400/40 transition-all active:scale-95 shrink-0"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>{language === 'bn' ? 'সাইন ইন >' : 'Sign In >'}</span>
                  </button>
                </div>

                {/* VIP Progress Bar (1 / 2) with "সুবিধা >" Link */}
                <div className="relative z-10 mt-4 pt-2 border-t border-black/10">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-950/90 mb-1">
                    <span className="font-mono font-black">1 / 2</span>
                    <button
                      type="button"
                      onClick={() => showToast(language === 'bn' ? 'VIP ২ স্তর সুবিধা সক্রিয়!' : 'VIP 2 privileges active!')}
                      className="flex items-center gap-0.5 text-slate-950 hover:underline font-black"
                    >
                      <span>{language === 'bn' ? 'সুবিধা >' : 'Benefits >'}</span>
                    </button>
                  </div>
                  {/* Progress Bar Track */}
                  <div className="w-full h-2 rounded-full bg-black/20 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-slate-950 transition-all duration-500"
                      style={{ width: '50%' }}
                    />
                  </div>
                </div>
              </div>

              {/* 3. 4 Primary Category Cards (2x2 Grid ONLY) */}
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
                  {/* Card 1: Green Card -> দাবি করা */}
                  <button
                    type="button"
                    id="card-claim-rewards"
                    onClick={() => setCurrentPage('claim')}
                    className="group relative rounded-2xl p-4 bg-gradient-to-br from-[#10B981] via-[#059669] to-[#047857] shadow-lg border border-emerald-400/30 flex flex-col items-center justify-center text-center transition-all duration-200 hover:scale-[1.02] active:scale-95 h-36"
                  >
                    <div className="w-16 h-16 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                      <Icon3DGiftBox className="w-14 h-14" />
                    </div>
                    <span className="text-sm sm:text-base font-black text-white tracking-wide drop-shadow-sm">
                      {language === 'bn' ? 'দাবি করা' : 'Claim'}
                    </span>
                  </button>

                  {/* Card 2: Blue Card -> সাইন ইন */}
                  <button
                    type="button"
                    id="card-signin-rewards"
                    onClick={() => setCurrentPage('checkin')}
                    className="group relative rounded-2xl p-4 bg-gradient-to-br from-[#0EA5E9] via-[#0284C7] to-[#0369A1] shadow-lg border border-sky-400/30 flex flex-col items-center justify-center text-center transition-all duration-200 hover:scale-[1.02] active:scale-95 h-36"
                  >
                    <div className="w-16 h-16 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                      <Icon3DCalendar className="w-14 h-14" />
                    </div>
                    <span className="text-sm sm:text-base font-black text-white tracking-wide drop-shadow-sm">
                      {language === 'bn' ? 'সাইন ইন' : 'Sign In'}
                    </span>
                  </button>

                  {/* Card 3: Pink/Purple Gradient Card -> বন্ধুদের আমন্ত্রণ জানান */}
                  <button
                    type="button"
                    id="card-invite-rewards"
                    onClick={() => setCurrentPage('invite')}
                    className="group relative rounded-2xl p-4 bg-gradient-to-br from-[#EC4899] via-[#D946EF] to-[#8B5CF6] shadow-lg border border-pink-400/30 flex flex-col items-center justify-center text-center transition-all duration-200 hover:scale-[1.02] active:scale-95 h-36"
                  >
                    <div className="w-16 h-16 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                      <Icon3DInvitePeople className="w-14 h-14" />
                    </div>
                    <span className="text-xs sm:text-sm font-black text-white tracking-tight drop-shadow-sm leading-tight">
                      {language === 'bn' ? 'বন্ধুদের আমন্ত্রণ জানান' : 'Invite Friends'}
                    </span>
                  </button>

                  {/* Card 4: Orange Card -> টেমু টিকিট */}
                  <button
                    type="button"
                    id="card-temu-rewards"
                    onClick={() => setCurrentPage('temu')}
                    className="group relative rounded-2xl p-4 bg-gradient-to-br from-[#F59E0B] via-[#EA580C] to-[#C2410C] shadow-lg border border-amber-400/30 flex flex-col items-center justify-center text-center transition-all duration-200 hover:scale-[1.02] active:scale-95 h-36"
                  >
                    <div className="w-16 h-16 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                      <Icon3DTreasureChest className="w-14 h-14" />
                    </div>
                    <span className="text-sm sm:text-base font-black text-white tracking-wide drop-shadow-sm">
                      {language === 'bn' ? 'টেমু টিকিট' : 'TEMU Ticket'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-PAGE 1: দাবি করা (Claim Page) */}
        {/* ========================================================================= */}
        {currentPage === 'claim' && (
          <div className="flex flex-col h-full overflow-hidden bg-[#f8f9fa] text-slate-800">
            {/* Header: Back arrow + "দাবি করা" + right ticket icon */}
            <header className="bg-[#111622] text-white border-b border-[#1f2937] px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  id="btn-back-from-claim"
                  onClick={() => setCurrentPage('main')}
                  aria-label="Back to Rewards Hub"
                  className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition active:scale-95"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h1 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                  {language === 'bn' ? 'দাবি করা' : 'Claim'}
                </h1>
              </div>

              {/* Right Ticket Icon */}
              <button
                type="button"
                onClick={() => showToast(language === 'bn' ? 'কোনো টিকিট উপলব্ধ নেই' : 'No tickets available')}
                className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-amber-400 flex items-center justify-center transition"
              >
                <Ticket className="w-4 h-4" />
              </button>
            </header>

            {/* Blue fluid header wave displaying avatar, username, and balance */}
            <div className="relative overflow-hidden bg-gradient-to-b from-[#0284C7] to-[#0369A1] px-4 pt-4 pb-8 shrink-0 text-white">
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-12 h-12 rounded-full border-2 border-white shadow-md overflow-hidden bg-slate-900 shrink-0">
                  <img
                    src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80'}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-base font-black leading-tight text-white">
                    {displayedUsername}
                  </h3>
                  <div className="text-xs text-sky-100 font-mono font-bold mt-0.5">
                    {language === 'bn' ? 'ব্যালেন্স:' : 'Balance:'} ৳ {walletBalance !== undefined ? walletBalance.toFixed(2) : '0.06'}
                  </div>
                </div>
              </div>

              {/* Fluid wave bottom SVG */}
              <div className="absolute bottom-0 inset-x-0 overflow-hidden leading-none pointer-events-none">
                <svg
                  className="relative block w-full h-5 text-[#0A0E17]"
                  viewBox="0 0 1200 120"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,152.47,131.7,247,110,272.76,104.14,297.88,81.16,321.39,56.44Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>

            {/* Center Content: Display clean empty state placeholder: "এখনও কোনও প্রচার নেই" */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="mb-3 animate-in zoom-in-75 duration-300">
                <Illustration3DEmptyPromotion className="w-40 h-40" />
              </div>
              <h4 className="text-base sm:text-lg font-bold text-slate-800">
                {language === 'bn' ? 'এখনও কোনও প্রচার নেই' : 'No promotions yet'}
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                {language === 'bn'
                  ? 'নতুন অফার এবং প্রচারের জন্য নিয়মিত চেক করুন।'
                  : 'Check back soon for new exclusive promotions and offers.'}
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-PAGE 2: সাইন ইন (Daily Check-in) */}
        {/* ========================================================================= */}
        {currentPage === 'checkin' && (
          <div className="flex flex-col h-full overflow-hidden bg-[#f8f9fa] text-slate-800">
            {/* Header: Back arrow + "সাইন ইন" */}
            <header className="bg-[#111622] text-white border-b border-[#1f2937] px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  id="btn-back-from-signin"
                  onClick={() => setCurrentPage('main')}
                  aria-label="Back to Rewards Hub"
                  className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition active:scale-95"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h1 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                  {language === 'bn' ? 'সাইন ইন' : 'Sign In'}
                </h1>
              </div>
            </header>

            {/* Scrollable Check-in Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-3.5 sm:p-4 space-y-4">
              {/* Top stats card: Two columns displaying "চেক-ইন দিন" and "সাইন ইন মোট পুরস্কার" */}
              <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4 grid grid-cols-2 divide-x divide-gray-200 shadow-sm text-slate-800">
                <div className="text-center pr-2">
                  <div className="text-xs text-slate-400 font-bold mb-1">
                    {language === 'bn' ? 'চেক-ইন দিন' : 'Check-in Days'}
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                    {checkInDaysCount}
                  </div>
                </div>
                <div className="text-center pl-2">
                  <div className="text-xs text-slate-400 font-bold mb-1">
                    {language === 'bn' ? 'সাইন ইন মোট পুরস্কার' : 'Total Sign-in Reward'}
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                    ৳ {totalCheckInReward.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Event Banner (BDLiveBet Branding) */}
              <div className="relative rounded-2xl p-4 bg-gradient-to-br from-[#1E1B4B] via-[#1E293B] to-[#0F172A] border border-indigo-500/30 shadow-lg overflow-hidden">
                <div className="space-y-1.5">
                  <h3 className="text-sm sm:text-base font-black text-white leading-tight">
                    {language === 'bn'
                      ? 'BDLiveBet প্রতিদিন লগ-ইন ইভেন্ট: বিশেষ সুবিধা আনলক করুন!'
                      : 'BDLiveBet Daily Log-in Event: Unlock Special Privileges!'}
                  </h3>
                  <div className="text-xs font-bold text-amber-300">
                    {hasCheckedInToday
                      ? (language === 'bn' ? '✓ আজকের চেক-ইন সম্পন্ন হয়েছে' : '✓ Today\'s check-in complete')
                      : (language === 'bn' ? 'আজও চেক ইন করা হয়নি ?' : 'Not checked in today yet ?')}
                  </div>
                </div>

                {/* Criteria Boxes: ডিপোজিট শর্ত | বেটিং শর্ত */}
                <div className="grid grid-cols-2 gap-2 mt-3 text-center">
                  <div className="rounded-xl bg-slate-900/80 border border-slate-700/60 p-2">
                    <span className="text-xs text-slate-400 block font-semibold">
                      {language === 'bn' ? 'ডিপোজিট শর্ত' : 'Deposit Requirement'}
                    </span>
                    <span className="text-xs font-black text-white font-mono">
                      ৳ ১,০০০.০০
                    </span>
                  </div>
                  <div className="rounded-xl bg-slate-900/80 border border-slate-700/60 p-2">
                    <span className="text-xs text-slate-400 block font-semibold">
                      {language === 'bn' ? 'বেটিং শর্ত' : 'Betting Requirement'}
                    </span>
                    <span className="text-xs font-black text-white font-mono">
                      ৳ ১৫,০০০.০০
                    </span>
                  </div>
                </div>
              </div>

              {/* Check-in streak grid (Day 1 to Day 5) */}
              <div className="space-y-2.5">
                {[
                  {
                    day: 1,
                    titleBn: '১ম দিন ব্রোঞ্জ হুইল',
                    titleEn: 'Day 1 Bronze Wheel',
                    type: 'bronze' as const,
                    active: !hasCheckedInToday,
                    isDone: hasCheckedInToday
                  },
                  {
                    day: 2,
                    titleBn: '২য় দিন সিলভার হুইল',
                    titleEn: 'Day 2 Silver Wheel',
                    type: 'silver' as const,
                    active: false,
                    isDone: false
                  },
                  {
                    day: 3,
                    titleBn: '৩য় দিন গোল্ড হুইল',
                    titleEn: 'Day 3 Gold Wheel',
                    type: 'gold' as const,
                    active: false,
                    isDone: false
                  },
                  {
                    day: 4,
                    titleBn: '৪র্থ দিন প্ল্যাটিনাম হুইল',
                    titleEn: 'Day 4 Platinum Wheel',
                    type: 'platinum' as const,
                    active: false,
                    isDone: false
                  },
                  {
                    day: 5,
                    titleBn: '৫ম দিন ডায়মন্ড হুইল',
                    titleEn: 'Day 5 Diamond Wheel',
                    type: 'diamond' as const,
                    active: false,
                    isDone: false
                  }
                ].map((item) => (
                  <div
                    key={item.day}
                    className="p-3 sm:p-3.5 rounded-2xl bg-white border border-gray-200 flex items-center justify-between shadow-sm hover:border-gray-300 transition text-slate-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 flex items-center justify-center shrink-0">
                        <Icon3DWheel type={item.type} className="w-12 h-12" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-black text-slate-900">
                          {language === 'bn' ? item.titleBn : item.titleEn}
                        </h4>
                        <span className="text-xs text-slate-500 font-medium">
                          {language === 'bn' ? `লগইন ও বেটিং সম্পূর্ণ করুন` : `Complete login & bets`}
                        </span>
                      </div>
                    </div>

                    {/* Action button */}
                    <div>
                      {item.isDone ? (
                        <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-black flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'সম্পন্ন' : 'Claimed'}</span>
                        </span>
                      ) : item.active ? (
                        <button
                          type="button"
                          id="btn-checkin-day-1"
                          onClick={handleDailySignIn}
                          className="px-4 py-1.5 rounded-full bg-[#E53935] hover:bg-[#D32F2F] text-white text-xs font-black shadow-md border border-red-400/40 active:scale-95 transition"
                        >
                          {language === 'bn' ? 'সাইন ইন' : 'Sign In'}
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="px-4 py-1.5 rounded-full bg-slate-800 text-slate-500 text-xs font-bold cursor-not-allowed border border-slate-700/50"
                        >
                          {language === 'bn' ? 'সাইন ইন' : 'Sign In'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-PAGE 3: বন্ধুদের আমন্ত্রণ জানান (Invite Friends / Referral Module) */}
        {/* ========================================================================= */}
        {currentPage === 'invite' && (
          <div className="flex flex-col h-full overflow-hidden bg-[#f8f9fc] text-slate-800">
            {/* Header: Dark Top Bar matching reference */}
            <header className="bg-[#111622] text-white px-4 py-3 flex items-center justify-between shrink-0 shadow-md">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  id="btn-back-from-invite"
                  onClick={() => initialTab === 'invite' ? onClose() : setCurrentPage('main')}
                  aria-label="Back to Origin"
                  className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition active:scale-95"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h1 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                  {language === 'bn' ? 'বন্ধুদের আমন্ত্রণ জানান' : 'Invite Friends'}
                </h1>
              </div>
              <button
                type="button"
                onClick={() =>
                  showToast(
                    language === 'bn'
                      ? 'BDLiveBet এজেন্ট রেফারেল প্রোগ্রামে স্বাগতম!'
                      : 'Welcome to BDLiveBet Referral Program!'
                  )
                }
                className="w-8 h-8 rounded-full bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </header>

            {/* Navigation Tabs Bar: White horizontal tab bar with smooth horizontal scroll and vibrant cyan underline */}
            <div className="bg-white border-b border-gray-200 px-3 py-0 shrink-0 shadow-xs">
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {[
                  { id: 'summary' as const, labelBn: 'সংক্ষিপ্ত বর্ণনা', labelEn: 'Overview' },
                  { id: 'rewards' as const, labelBn: 'পুরস্কার', labelEn: 'Rewards' },
                  { id: 'income' as const, labelBn: 'আয়', labelEn: 'Income' },
                  { id: 'records' as const, labelBn: 'রেকর্ডস', labelEn: 'Records' },
                  { id: 'invites' as const, labelBn: 'আমন্ত্রিতদের তালিকা', labelEn: 'Invited List' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    id={`btn-invite-tab-${tab.id}`}
                    onClick={() => setInviteTab(tab.id)}
                    className={`py-3 px-3.5 text-sm font-semibold transition-all text-center whitespace-nowrap shrink-0 border-b-2 ${
                      inviteTab === tab.id
                        ? 'border-[#00a8ff] text-[#00a8ff]'
                        : 'border-transparent text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {language === 'bn' ? tab.labelBn : tab.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Invite Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-3.5 sm:p-4 space-y-4">
              {/* ========================================================================= */}
              {/* TAB 1: সংক্ষিপ্ত বর্ণনা (Overview) */}
              {/* ========================================================================= */}
              {inviteTab === 'summary' && (
                <>
                  {/* 1. Dynamic Referral & Share Box (Clean White Card) */}
                  <div className="rounded-2xl bg-white shadow-sm p-4 border border-gray-100 space-y-3.5">
                    <h3 className="text-sm font-black text-gray-800 tracking-tight">
                      {language === 'bn' ? 'আপনার বন্ধুদের সাথে ভাগ করুন' : 'Share with Your Friends'}
                    </h3>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {/* Left Column: Crisp black-and-white QR code + Purple "কোড সংরক্ষণ" Button */}
                      <div className="flex flex-col items-center shrink-0">
                        <div className="w-28 h-28 bg-white p-1.5 rounded-xl border border-gray-200 flex items-center justify-center shadow-xs">
                          <img
                            src={qrCodeUrl}
                            alt="BDLiveBet Referral QR"
                            className="w-full h-full object-contain"
                            referrerPolicy="no-referrer"
                            loading="lazy"
                          />
                        </div>
                        <button
                          type="button"
                          id="btn-save-invite-code"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = qrCodeUrl;
                            link.download = 'BDLiveBet_Referral_QR.png';
                            link.target = '_blank';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            showToast(
                              language === 'bn'
                                ? 'QR কোড সংরক্ষণ করা হয়েছে!'
                                : 'QR Code saved to device!'
                            );
                          }}
                          className="bg-[#5e35b1] hover:bg-[#512da8] text-white text-xs px-3 py-1 rounded-full shadow-xs active:scale-95 transition mt-2 flex items-center gap-1 font-bold"
                        >
                          <Download className="w-3 h-3" />
                          <span>{language === 'bn' ? 'কিউআর সেভ করুন' : 'Save QR Code'}</span>
                        </button>
                      </div>

                      {/* Right Column: Referral Link Input + Exact Social Share Row */}
                      <div className="flex-1 w-full space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-gray-600">
                            {language === 'bn' ? 'রেফারেল লিংক' : 'Referral Link'}
                          </label>
                          <span className="text-xs px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 font-mono font-bold border border-sky-200">
                            UID: {userUid}
                          </span>
                        </div>

                        {/* Input with Copy button */}
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            readOnly
                            id="input-referral-link"
                            value={referralLink}
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono text-gray-700 outline-none select-all focus:border-[#00a8ff]"
                          />
                          <button
                            type="button"
                            id="btn-copy-referral-link"
                            onClick={() =>
                              handleCopy(
                                referralLink,
                                language === 'bn'
                                  ? '🎉 রেফারেল লিংক সফলভাবে কপি করা হয়েছে!'
                                  : '🎉 Referral link copied successfully!'
                              )
                            }
                            className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1 shadow-xs active:scale-95 transition shrink-0"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>{language === 'bn' ? 'কপি' : 'Copy'}</span>
                          </button>
                        </div>

                        {/* Exact Social Share Row: Facebook (blue), X (black), Telegram (light blue), WhatsApp (green), Messenger (teal), Line (bright green), and Threads (black) */}
                        <div>
                          <span className="text-xs text-gray-500 font-semibold block mb-1.5">
                            {language === 'bn' ? 'সোশ্যাল মিডিয়ায় এক-ক্লিকে শেয়ার:' : 'Quick Social Share:'}
                          </span>
                          <div className="flex items-center justify-between gap-1.5">
                            {[
                              { name: 'Facebook', color: '#1877F2', icon: 'f', action: 'facebook' },
                              { name: 'X', color: '#000000', icon: '𝕏', action: 'x' },
                              { name: 'Telegram', color: '#229ED9', icon: '✈', action: 'telegram' },
                              { name: 'WhatsApp', color: '#25D366', icon: '☎', action: 'whatsapp' },
                              { name: 'Messenger', color: '#0084FF', icon: '💬', action: 'messenger' },
                              { name: 'Line', color: '#06C755', icon: 'L', action: 'line' },
                              { name: 'Threads', color: '#111111', icon: '@', action: 'threads' }
                            ].map((soc) => (
                              <button
                                key={soc.name}
                                type="button"
                                id={`btn-social-${soc.action}`}
                                onClick={() => {
                                  if (soc.action === 'whatsapp') {
                                    handleNativeShare('whatsapp');
                                  } else if (soc.action === 'telegram') {
                                    handleNativeShare('telegram');
                                  } else if (soc.action === 'facebook') {
                                    handleNativeShare('facebook');
                                  } else {
                                    handleCopy(
                                      referralLink,
                                      language === 'bn'
                                        ? `${soc.name}-এর জন্য শেয়ার লিংক কপি করা হয়েছে!`
                                        : `Link copied for ${soc.name}!`
                                    );
                                  }
                                }}
                                title={`Share on ${soc.name}`}
                                style={{ backgroundColor: soc.color }}
                                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white font-black text-xs shadow-xs hover:opacity-90 active:scale-95 transition"
                              >
                                <span>{soc.icon}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. 2x2 Pastel Gradient Metric Stats Grid */}
                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Top-Left: Soft Blue gradient (from-sky-400 to-blue-500) -> "আজকের আয়" : "৳ 0.00" */}
                    <div className="bg-gradient-to-br from-sky-400 to-blue-500 text-white rounded-2xl p-4 shadow-sm relative overflow-hidden">
                      <div className="absolute top-1 right-2 w-12 h-12 bg-white/10 rounded-full blur-sm" />
                      <span className="text-xs font-medium text-white/90 block">
                        {language === 'bn' ? 'আজকের আয়' : "Today's Income"}
                      </span>
                      <span className="text-xl font-bold font-['Poppins',sans-serif] tracking-normal mt-1 block">
                        ৳ 0.00
                      </span>
                    </div>

                    {/* Top-Right: Soft Purple gradient (from-purple-400 to-indigo-500) -> "গতকালের আয়" : "৳ 0.00" */}
                    <div className="bg-gradient-to-br from-purple-400 to-indigo-500 text-white rounded-2xl p-4 shadow-sm relative overflow-hidden">
                      <div className="absolute top-1 right-2 w-12 h-12 bg-white/10 rounded-full blur-sm" />
                      <span className="text-xs font-medium text-white/90 block">
                        {language === 'bn' ? 'গতকালের আয়' : "Yesterday's Income"}
                      </span>
                      <span className="text-xl font-bold font-['Poppins',sans-serif] tracking-normal mt-1 block">
                        ৳ 0.00
                      </span>
                    </div>

                    {/* Bottom-Left: Light Lavender gradient (from-indigo-300 to-purple-400) -> "সূচিপত্রধারী" : "1" */}
                    <div className="bg-gradient-to-br from-indigo-300 to-purple-400 text-white rounded-2xl p-4 shadow-sm relative overflow-hidden">
                      <div className="absolute top-1 right-2 w-12 h-12 bg-white/10 rounded-full blur-sm" />
                      <span className="text-xs font-medium text-white/90 block">
                        {language === 'bn' ? 'সূচিপত্রধারী' : 'Direct Invites'}
                      </span>
                      <span className="text-xl font-bold font-['Poppins',sans-serif] tracking-normal mt-1 block">
                        1
                      </span>
                    </div>

                    {/* Bottom-Right: Sky Cyan gradient (from-cyan-400 to-teal-400) -> "যোগ্য পরিচায়করা" : "0" */}
                    <div className="bg-gradient-to-br from-cyan-400 to-teal-400 text-white rounded-2xl p-4 shadow-sm relative overflow-hidden">
                      <div className="absolute top-1 right-2 w-12 h-12 bg-white/10 rounded-full blur-sm" />
                      <span className="text-xs font-medium text-white/90 block">
                        {language === 'bn' ? 'যোগ্য পরিচায়করা' : 'Valid Inviters'}
                      </span>
                      <span className="text-xl font-bold font-['Poppins',sans-serif] tracking-normal mt-1 block">
                        0
                      </span>
                    </div>
                  </div>

                  {/* 3. "বাজি কমিশন" Deep cosmic purple/dark navy gradient banner */}
                  <div className="rounded-2xl bg-gradient-to-r from-[#1c1236] via-[#2d1b54] to-[#120d2a] text-white p-4 shadow-md flex items-center justify-between border border-purple-800/40 relative overflow-hidden">
                    <div className="space-y-0.5 z-10">
                      <span className="text-xs text-purple-300 font-bold block">
                        BDLiveBet বাজি কমিশন
                      </span>
                      <h4 className="text-lg sm:text-xl font-bold text-white">
                        {language === 'bn' ? 'বাজি কমিশন' : 'Betting Commission'}
                      </h4>
                      <p className="text-xs text-purple-200/90 max-w-xs">
                        {language === 'bn'
                          ? 'আপনার রেফারেল নেটওয়ার্কের প্রতিটি বেট থেকে স্বয়ংক্রিয় ক্যাশব্যাক।'
                          : 'Automatic cashback generated from every bet in your network.'}
                      </p>
                    </div>

                    {/* Glowing treasure chest graphic on the right with balance badge ৳ ১৩,০০০.০০ */}
                    <div className="flex items-center gap-2 z-10 shrink-0">
                      <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-inner">
                        <Icon3DTreasureChest className="w-8 h-8" />
                      </div>
                      <span className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-bold text-xs font-['Poppins',sans-serif] shadow-md tracking-normal">
                        ৳ ১৩,০০০.০০
                      </span>
                    </div>

                    {/* Ambient Glow */}
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-amber-500/10 blur-xl pointer-events-none" />
                  </div>

                  {/* 4. "প্রাপ্ত পুরস্কার" (Received Rewards) List: 4 separate clean white cards */}
                  <div className="space-y-2.5">
                    <h4 className="text-sm font-black text-[#111622] flex items-center gap-1.5">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      <span>{language === 'bn' ? 'প্রাপ্ত পুরস্কার' : 'Received Rewards'}</span>
                    </h4>

                    {/* 1. Star on hand 3D icon: "আমন্ত্রণ পুরস্কার" | ৳ 398,014,416.00 | 335088 দাবিত */}
                    <div className="rounded-2xl bg-white p-3.5 border border-gray-100 shadow-sm flex items-center justify-between gap-3 hover:border-gray-200 transition">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center font-black text-lg shrink-0 border border-amber-100">
                          ⭐
                        </div>
                        <div>
                          <span className="text-xs sm:text-sm font-medium text-gray-800 block">
                            {language === 'bn' ? 'আমন্ত্রণ পুরস্কার' : 'Invitation Reward'}
                          </span>
                          <span className="text-xs font-bold text-gray-900 font-['Poppins',sans-serif]">
                            ৳ 398,014,416.00
                          </span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 font-bold text-xs border border-purple-100 shrink-0">
                        335088 দাবিত
                      </span>
                    </div>

                    {/* 2. Gold medal with ribbon icon: "সাফল্য পুরস্কার" | ৳ 244,051,728.00 | 169404 দাবিত */}
                    <div className="rounded-2xl bg-white p-3.5 border border-gray-100 shadow-sm flex items-center justify-between gap-3 hover:border-gray-200 transition">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-lg shrink-0 border border-amber-100">
                          🏅
                        </div>
                        <div>
                          <span className="text-xs sm:text-sm font-medium text-gray-800 block">
                            {language === 'bn' ? 'সাফল্য পুরস্কার' : 'Achievement Reward'}
                          </span>
                          <span className="text-xs font-bold text-gray-900 font-['Poppins',sans-serif]">
                            ৳ 244,051,728.00
                          </span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-bold text-xs border border-amber-100 shrink-0">
                        169404 দাবিত
                      </span>
                    </div>

                    {/* 3. Money sack & gold coins icon: "জমা ছাড়া" | ৳ 491,015,501.81 | 504696 দাবিত */}
                    <div className="rounded-2xl bg-white p-3.5 border border-gray-100 shadow-sm flex items-center justify-between gap-3 hover:border-gray-200 transition">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-lg shrink-0 border border-emerald-100">
                          💰
                        </div>
                        <div>
                          <span className="text-xs sm:text-sm font-medium text-gray-800 block">
                            {language === 'bn' ? 'জমা ছাড়া' : 'Deposit-Free Bonus'}
                          </span>
                          <span className="text-xs font-bold text-gray-900 font-['Poppins',sans-serif]">
                            ৳ 491,015,501.81
                          </span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-100 shrink-0">
                        504696 দাবিত
                      </span>
                    </div>

                    {/* 4. Football & cash icon: "বেটিং রিবেট" | ৳ 837,286,452.67 | 806688 দাবিত */}
                    <div className="rounded-2xl bg-white p-3.5 border border-gray-100 shadow-sm flex items-center justify-between gap-3 hover:border-gray-200 transition">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-lg shrink-0 border border-blue-100">
                          ⚽
                        </div>
                        <div>
                          <span className="text-xs sm:text-sm font-medium text-gray-800 block">
                            {language === 'bn' ? 'বেটিং রিবেট' : 'Betting Rebate'}
                          </span>
                          <span className="text-xs font-bold text-gray-900 font-['Poppins',sans-serif]">
                            ৳ 837,286,452.67
                          </span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-xs border border-blue-100 shrink-0">
                        806688 দাবিত
                      </span>
                    </div>
                  </div>

                  {/* 5. "এজেন্ট ৪ সুপার কমিশন" Poster Card: Vibrant sky blue to indigo gradient */}
                  <div className="rounded-3xl p-5 bg-gradient-to-br from-[#00a8ff] via-[#2563eb] to-[#4338ca] text-white shadow-lg space-y-4 border border-blue-300/30 relative overflow-hidden">
                    {/* Header title */}
                    <div className="text-center space-y-1">
                      <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-black tracking-wide border border-white/30 backdrop-blur-xs">
                        BDLiveBet এর নতুন রেফারেল প্রোগ্রাম
                      </span>
                      <h3 className="text-lg sm:text-xl font-black tracking-tight text-white">
                        {language === 'bn'
                          ? 'এজেন্টের ৪টি সুপার কমিশন উপভোগ করুন'
                          : 'Enjoy 4 Super Agent Commissions'}
                      </h3>
                    </div>

                    {/* 1. প্রতিটি আমন্ত্রণে: ৳৩০৮, 2. প্রতিটি ডিপোজিটে: ০.৪৪% */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/20 space-y-1">
                        <span className="text-xs text-blue-100 block font-semibold">
                          ১. প্রতিটি আমন্ত্রণে
                        </span>
                        <div className="text-lg font-bold text-amber-300 font-['Poppins',sans-serif]">
                          ৳ ৩০৮
                        </div>
                        <span className="text-xs text-white/90 block">সরাসরি নগদ বোনাস</span>
                      </div>

                      <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/20 space-y-1">
                        <span className="text-xs text-blue-100 block font-semibold">
                          ২. প্রতিটি ডিপোজিটে
                        </span>
                        <div className="text-lg font-bold text-amber-300 font-['Poppins',sans-serif]">
                          ০.৪৪%
                        </div>
                        <span className="text-xs text-white/90 block">আজীবন ক্যাশব্যাক</span>
                      </div>
                    </div>

                    {/* 3. ৩ লেভেলে বাজির কমিশন: ০.৯৪% with visual tree diagram */}
                    <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3.5 border border-white/20 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-100">
                          ৩. ৩ লেভেলে বাজির কমিশন
                        </span>
                        <span className="text-sm font-bold text-amber-300 font-['Poppins',sans-serif]">
                          ০.৯৪%
                        </span>
                      </div>

                      {/* Visual Tree Diagram: আপনি -> স্তর ১ -> স্তর ২ -> স্তর ৩ */}
                      <div className="grid grid-cols-4 gap-1.5 items-center text-center">
                        <div className="bg-white/20 rounded-xl p-2 border border-white/30">
                          <div className="w-7 h-7 mx-auto rounded-full bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center mb-1">
                            ইউ
                          </div>
                          <span className="text-xs font-bold block text-white">আপনি</span>
                          <span className="text-xs text-amber-200 block font-semibold">এজেন্ট</span>
                        </div>

                        <div className="bg-white/15 rounded-xl p-2 border border-white/20">
                          <div className="w-7 h-7 mx-auto rounded-full bg-blue-400 text-slate-950 font-bold text-xs flex items-center justify-center mb-1">
                            L1
                          </div>
                          <span className="text-xs font-bold block text-white">স্তর ১</span>
                          <span className="text-xs text-amber-300 font-['Poppins',sans-serif] font-bold block">০.৪৪%</span>
                        </div>

                        <div className="bg-white/15 rounded-xl p-2 border border-white/20">
                          <div className="w-7 h-7 mx-auto rounded-full bg-indigo-400 text-slate-950 font-bold text-xs flex items-center justify-center mb-1">
                            L2
                          </div>
                          <span className="text-xs font-bold block text-white">স্তর ২</span>
                          <span className="text-xs text-amber-300 font-['Poppins',sans-serif] font-bold block">০.৩০%</span>
                        </div>

                        <div className="bg-white/15 rounded-xl p-2 border border-white/20">
                          <div className="w-7 h-7 mx-auto rounded-full bg-purple-400 text-slate-950 font-bold text-xs flex items-center justify-center mb-1">
                            L3
                          </div>
                          <span className="text-xs font-bold block text-white">স্তর ৩</span>
                          <span className="text-xs text-amber-300 font-['Poppins',sans-serif] font-bold block">০.২০%</span>
                        </div>
                      </div>
                    </div>

                    {/* 4. অর্জন বোনাস: ৳ ১৮,৮৮৮,৮৮৮ */}
                    <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/20 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-blue-100 block font-semibold">
                          ৪. মেগা অর্জন বোনাস
                        </span>
                        <span className="text-xs text-white/90">টার্নওভার মাইলস্টোন রিওয়ার্ড</span>
                      </div>
                      <span className="text-base sm:text-lg font-bold text-amber-300 font-['Poppins',sans-serif]">
                        ৳ ১৮,৮৮৮,৮৮৮
                      </span>
                    </div>

                    {/* Bottom text: যে কোন সময় যে কোন জায়গায় আমন্ত্রণ জানান এবং সব জয় করুন with falling coins */}
                    <div className="text-center pt-1 border-t border-white/15">
                      <p className="text-xs font-bold text-amber-200">
                        {language === 'bn'
                          ? '✨ যে কোন সময় যে কোন জায়গায় আমন্ত্রণ জানান এবং সব জয় করুন! 🪙'
                          : '✨ Invite friends anytime, anywhere and win it all! 🪙'}
                      </p>
                    </div>
                  </div>

                  {/* 6. "লিডারবোর্ড": Dynamic Real-Time Live Feed Card with Upward Scrolling Ticker */}
                  <LiveWinnerFeed language={language} />

                  {/* 7. "আয় হিসাবনিকেতন": Pink/Purple gradient card with envelope cash badge, dynamic amount ৳ 6,500.00, subtitle and smooth cyan slider */}
                  <div className="rounded-2xl bg-gradient-to-br from-[#d81b60] via-[#c2185b] to-[#8e24aa] text-white p-4 shadow-md space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-amber-300">
                          <Calculator className="w-4 h-4" />
                        </div>
                        <h4 className="text-sm font-bold text-white">
                          {language === 'bn' ? 'আয় হিসাবনিকেতন' : 'Income Calculator'}
                        </h4>
                      </div>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/20 text-amber-200 font-bold">
                        প্রত্যাশিত রাজস্ব
                      </span>
                    </div>

                    {/* Dynamic Amount Display (default 10 -> ৳ 6,500.00) */}
                    <div className="text-center py-1">
                      <div className="text-2xl sm:text-3xl font-bold text-white font-['Poppins',sans-serif] tracking-normal">
                        ৳ {(calcInvitedFriends * 650).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </div>
                      <p className="text-xs text-white/90 mt-0.5">
                        {calcInvitedFriends} কুশল ব্যবহারকারী আমন্ত্রণ করুন, প্রত্যাশিত রাজস্ব
                      </p>
                    </div>

                    {/* Smooth Cyan Interactive Slider */}
                    <div className="space-y-1">
                      <input
                        type="range"
                        min="1"
                        max="50"
                        step="1"
                        id="slider-calc-friends-light"
                        value={calcInvitedFriends}
                        onChange={(e) => setCalcInvitedFriends(Number(e.target.value))}
                        className="w-full h-2 rounded-lg cursor-pointer bg-white/30 accent-[#00e5ff]"
                      />
                      <div className="flex justify-between text-xs text-white/90 font-mono">
                        <span>১ জন</span>
                        <span>২৫ জন</span>
                        <span>৫০ জন</span>
                      </div>
                    </div>
                  </div>

                  {/* 8. Bottom CTA Banner: Light blue gradient card "BDLiveBet এর এজেন্ট হন এখনই - আপনার লিংক শেয়ার করুন" */}
                  <div className="rounded-2xl bg-gradient-to-r from-sky-100 via-blue-50 to-indigo-100 border border-blue-200 p-4 text-slate-800 text-center space-y-3 shadow-xs">
                    <h4 className="text-sm font-black text-slate-900">
                      {language === 'bn'
                        ? 'BDLiveBet এর এজেন্ট হন এখনই - আপনার লিংক শেয়ার করুন'
                        : 'Become a BDLiveBet Agent Now - Share Your Link'}
                    </h4>
                    <p className="text-xs text-slate-600 max-w-sm mx-auto">
                      {language === 'bn'
                        ? 'নিচের প্ল্যাটফর্মগুলোতে আপনার বন্ধুদের কাছে লিংক পাঠিয়ে এখনই আনলিমিটেড কমিশন আয় শুরু করুন।'
                        : 'Send your link to friends on these channels to start earning unlimited commission.'}
                    </p>

                    {/* Curved arrow pointing to WhatsApp, Facebook, TikTok, Telegram, and Instagram icons */}
                    <div className="flex items-center justify-center gap-2 pt-1">
                      {[
                        { name: 'WhatsApp', color: '#25D366', icon: '☎', action: 'whatsapp' },
                        { name: 'Facebook', color: '#1877F2', icon: 'f', action: 'facebook' },
                        { name: 'TikTok', color: '#000000', icon: '♪', action: 'tiktok' },
                        { name: 'Telegram', color: '#229ED9', icon: '✈', action: 'telegram' },
                        { name: 'Instagram', color: '#E1306C', icon: '📷', action: 'instagram' }
                      ].map((s) => (
                        <button
                          key={s.name}
                          type="button"
                          id={`btn-cta-share-${s.action}`}
                          onClick={() => {
                            if (s.action === 'whatsapp') {
                              handleNativeShare('whatsapp');
                            } else if (s.action === 'telegram') {
                              handleNativeShare('telegram');
                            } else if (s.action === 'facebook') {
                              handleNativeShare('facebook');
                            } else {
                              handleCopy(
                                referralLink,
                                language === 'bn'
                                  ? `${s.name}-এ শেয়ার করার জন্য লিংক কপি করা হয়েছে!`
                                  : `Link copied for ${s.name}!`
                              );
                            }
                          }}
                          style={{ backgroundColor: s.color }}
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-black shadow-xs hover:opacity-90 active:scale-95 transition"
                          title={s.name}
                        >
                          {s.icon}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* ========================================================================= */}
              {/* TAB 2: পুরস্কার (Milestone Rewards) */}
              {/* ========================================================================= */}
              {inviteTab === 'rewards' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-amber-600/10 border border-amber-300 space-y-1 shadow-xs">
                    <h4 className="text-sm font-black text-gray-900 flex items-center gap-1.5">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      <span>{language === 'bn' ? 'আমন্ত্রণ মাইলস্টোন পুরস্কার' : 'Invite Milestone Rewards'}</span>
                    </h4>
                    <p className="text-xs text-gray-600">
                      {language === 'bn'
                        ? 'বন্ধুদের আমন্ত্রণ জানিয়ে টার্নওভার সম্পন্ন করলেই আনলক হবে বিশেষ নগদ বোনাস।'
                        : 'Unlock exclusive cash bonuses by reaching friend invitation milestones.'}
                    </p>
                  </div>

                  {/* Milestone Tiers */}
                  {[
                    { level: 1, target: 1, current: 1, bonus: 100, labelBn: '১ম বন্ধু আমন্ত্রণ বোনাস' },
                    { level: 2, target: 5, current: 1, bonus: 500, labelBn: '৫ জন বন্ধু আমন্ত্রণ বোনাস' },
                    { level: 3, target: 10, current: 1, bonus: 1500, labelBn: '১০ জন বন্ধু মেগা বোনাস' },
                    { level: 4, target: 25, current: 1, bonus: 3800, labelBn: '২৫ জন বন্ধু ভিআইপি বোনাস' },
                    { level: 5, target: 50, current: 1, bonus: 9000, labelBn: '৫০ জন বন্ধু সুপার বোনাস' }
                  ].map((m) => {
                    const isClaimed = claimedRewardTiers.includes(m.level);
                    const isReadyToClaim = m.current >= m.target && !isClaimed;

                    return (
                      <div
                        key={m.level}
                        className="p-3.5 rounded-2xl bg-white border border-gray-100 flex items-center justify-between gap-3 shadow-xs hover:border-gray-200 transition"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-700 text-xs font-black border border-amber-200">
                              টায়ার {m.level}
                            </span>
                            <span className="text-xs sm:text-sm font-black text-gray-800">
                              {language === 'bn' ? m.labelBn : `Tier ${m.level} Invite Bonus`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <span>
                              {language === 'bn' ? 'অগ্রগতি:' : 'Progress:'}{' '}
                              <strong className="text-gray-900 font-mono">{m.current}/{m.target}</strong>
                            </span>
                            <span>•</span>
                            <span className="text-emerald-600 font-bold font-mono">
                              +৳ {m.bonus.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Claim action */}
                        <div>
                          {isClaimed ? (
                            <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-black flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" />
                              <span>{language === 'bn' ? 'সম্পন্ন' : 'Claimed'}</span>
                            </span>
                          ) : isReadyToClaim ? (
                            <button
                              type="button"
                              id={`btn-claim-tier-${m.level}`}
                              onClick={() => handleClaimMilestoneReward(m.level, m.bonus, m.labelBn)}
                              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 text-xs font-black shadow-xs active:scale-95 transition"
                            >
                              {language === 'bn' ? 'দাবি করুন' : 'Claim'}
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled
                              className="px-3.5 py-1.5 rounded-full bg-gray-100 text-gray-400 text-xs font-bold cursor-not-allowed border border-gray-200"
                            >
                              {language === 'bn' ? 'অপেক্ষমান' : 'Locked'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 3: আয় (Income Details) */}
              {/* ========================================================================= */}
              {inviteTab === 'income' && (
                <div className="space-y-3.5">
                  {/* Total Collected Income Card */}
                  <div className="p-4 rounded-2xl bg-white border border-gray-100 text-center space-y-1 shadow-xs">
                    <span className="text-xs text-gray-500 font-medium block">
                      {language === 'bn' ? 'মোট সংগৃহীত কমিশন' : 'Total Collected Commission'}
                    </span>
                    <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">
                      ৳ ০.০০
                    </div>
                    <span className="text-xs text-gray-500 block">
                      {language === 'bn'
                        ? 'দৈনিক রাত ১২:০০ টায় স্বয়ংক্রিয় ওয়ালেট সেটেলমেন্ট'
                        : 'Auto-settled to wallet every midnight'}
                    </span>
                  </div>

                  {/* Tier Breakdown */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 rounded-xl bg-white border border-gray-100 shadow-xs">
                      <span className="text-xs text-gray-500 block font-semibold">লেভেল ১ (সরাসরি)</span>
                      <span className="text-xs font-black text-amber-600 font-mono">৳ ০.০০</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-gray-100 shadow-xs">
                      <span className="text-xs text-gray-500 block font-semibold">লেভেল ২ (সাব)</span>
                      <span className="text-xs font-black text-gray-700 font-mono">৳ ০.০০</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-gray-100 shadow-xs">
                      <span className="text-xs text-gray-500 block font-semibold">লেভেল ৩ (নেটওয়ার্ক)</span>
                      <span className="text-xs font-black text-gray-700 font-mono">৳ ০.০০</span>
                    </div>
                  </div>

                  {/* Empty state container */}
                  <div className="p-6 rounded-2xl bg-white border border-gray-100 text-center space-y-2.5 shadow-xs">
                    <div className="w-12 h-12 rounded-full bg-gray-50 text-gray-400 mx-auto flex items-center justify-center border border-gray-100">
                      <TrendingUp className="w-6 h-6 text-gray-400" />
                    </div>
                    <h5 className="text-xs sm:text-sm font-black text-gray-800">
                      {language === 'bn' ? 'কোন ডেটা নেই' : 'No Data Available'}
                    </h5>
                    <p className="text-xs text-gray-500 max-w-xs mx-auto">
                      {language === 'bn'
                        ? 'আপনার আমন্ত্রিত বন্ধুরা গেমপ্লে শুরু করলেই তাদের টার্নওভারের কমিশন এখানে দৃশ্যমান হবে।'
                        : 'Once your invited friends start playing, their turnover commissions will appear here.'}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          referralLink,
                          language === 'bn' ? 'রেফারেল লিংক কপি করা হয়েছে!' : 'Referral link copied!'
                        )
                      }
                      className="px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs active:scale-95 transition inline-flex items-center gap-1 shadow-xs"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? 'রেফারেল লিংক কপি করুন' : 'Copy Referral Link'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 4: রেকর্ডস (Settlement Records) */}
              {/* ========================================================================= */}
              {inviteTab === 'records' && (
                <div className="space-y-3">
                  {/* Filter chips */}
                  <div className="flex items-center gap-1.5">
                    {[
                      { id: 'today' as const, labelBn: 'আজ', labelEn: 'Today' },
                      { id: '7days' as const, labelBn: '৭ দিন', labelEn: '7 Days' },
                      { id: '30days' as const, labelBn: '৩০ দিন', labelEn: '30 Days' }
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setRecordsFilter(f.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs ${
                          recordsFilter === f.id
                            ? 'bg-[#00a8ff] text-white'
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {language === 'bn' ? f.labelBn : f.labelEn}
                      </button>
                    ))}
                  </div>

                  {/* Empty state: কোন ডেটা নেই */}
                  <div className="p-8 rounded-2xl bg-white border border-gray-100 text-center space-y-2 shadow-xs">
                    <Clock className="w-10 h-10 text-gray-300 mx-auto" />
                    <h5 className="text-sm font-black text-gray-800">
                      {language === 'bn' ? 'কোন ডেটা নেই' : 'No Data Available'}
                    </h5>
                    <p className="text-xs text-gray-500">
                      {language === 'bn'
                        ? 'নির্বাচিত সময়সীমার মধ্যে কোনো কমিশন নিষ্পত্তির রেকর্ড নেই।'
                        : 'No commission settlement records found for this period.'}
                    </p>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 5: আমন্ত্রিতদের তালিকা (Invited Member List) */}
              {/* ========================================================================= */}
              {inviteTab === 'invites' && (
                <div className="space-y-3">
                  {/* Top Counters Bar */}
                  <div className="rounded-2xl bg-white border border-gray-100 p-3.5 grid grid-cols-3 divide-x divide-gray-100 text-center shadow-xs">
                    <div>
                      <span className="text-xs text-gray-500 block font-semibold">
                        {language === 'bn' ? 'মোট আমন্ত্রিত' : 'Total Invited'}
                      </span>
                      <span className="text-base font-black text-gray-900 font-mono">1</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block font-semibold">
                        {language === 'bn' ? 'সক্রিয় সদস্য' : 'Active Members'}
                      </span>
                      <span className="text-base font-black text-amber-500 font-mono">0</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block font-semibold">
                        {language === 'bn' ? 'টিম টার্নওভার' : 'Team Turnover'}
                      </span>
                      <span className="text-base font-black text-emerald-600 font-mono">৳ ০.০০</span>
                    </div>
                  </div>

                  {/* Subordinate Item matching the 1 direct invite */}
                  <div className="p-3.5 rounded-2xl bg-white border border-gray-100 space-y-2 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 font-mono font-bold text-xs flex items-center justify-center">
                          82
                        </div>
                        <div>
                          <span className="text-xs sm:text-sm font-black text-gray-900 font-mono block">
                            bd***829
                          </span>
                          <span className="text-xs text-gray-500">
                            {language === 'bn' ? 'লেভেল ১ (সরাসরি)' : 'Level 1 (Direct)'}
                          </span>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded bg-gray-100 text-gray-600 font-bold text-xs border border-gray-200">
                        {language === 'bn' ? 'অপেক্ষমান' : 'Pending'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 text-xs font-mono">
                      <div>
                        <span className="text-xs text-gray-400 block font-sans">রেজিস্ট্রেশন</span>
                        <span className="text-gray-700 text-xs font-semibold">2026-03-14</span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400 block font-sans">মোট বেট</span>
                        <span className="text-gray-700 text-xs font-semibold">৳ ০.০০</span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400 block font-sans">অর্জিত কমিশন</span>
                        <span className="text-emerald-600 text-xs font-bold">৳ ০.০০</span>
                      </div>
                    </div>
                  </div>

                  {/* Empty state indicator below: কোন অতিরিক্ত ডেটা নেই */}
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center">
                    <span className="text-xs text-gray-500 font-medium">
                      {language === 'bn' ? '✓ কোন অতিরিক্ত ডেটা নেই' : '✓ No more data'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-PAGE 4: টেমু টিকিট (TEMU Ticket History) */}
        {/* ========================================================================= */}
        {currentPage === 'temu' && (
          <div className="flex flex-col h-full overflow-hidden bg-[#f8f9fa] text-slate-800">
            {/* Header: Back arrow + "TEMU টিকিট ইতিহাস" */}
            <header className="bg-[#111622] text-white border-b border-[#1f2937] px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  id="btn-back-from-temu"
                  onClick={() => setCurrentPage('main')}
                  aria-label="Back to Rewards Hub"
                  className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition active:scale-95"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h1 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                  {language === 'bn' ? 'TEMU টিকিট ইতিহাস' : 'TEMU Ticket History'}
                </h1>
              </div>
            </header>

            {/* Scrollable TEMU Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-3.5 sm:p-4 space-y-4">
              {/* Header illustration with treasure chest and "মোট দাবিকৃত পরিমাণ: ৳ ০.০০" */}
              <div className="rounded-2xl p-4 bg-gradient-to-br from-[#F5E6C8] via-[#FAF0DB] to-[#E9D6AC] border border-[#DEC494] text-center flex flex-col items-center justify-center shadow-sm space-y-2">
                <div className="w-20 h-20">
                  <Icon3DTreasureChest className="w-20 h-20" />
                </div>
                <div className="px-4 py-1.5 rounded-full bg-amber-900 text-amber-100 font-mono font-black text-sm shadow-sm">
                  {language === 'bn' ? 'মোট দাবিকৃত পরিমাণ: ৳ ০.০০' : 'Total Claimed Amount: ৳ 0.00'}
                </div>
              </div>

              {/* Ticket history list with rows showing: তারিখ, টিকিটের নাম, শর্ত, and যোগ করা পরিমাণ */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
                  <span>{language === 'bn' ? 'টিকিট রেকর্ড' : 'Ticket Records'}</span>
                  <span className="text-xs text-amber-400 font-mono font-bold">
                    {language === 'bn' ? '৩টি রেকর্ড' : '3 Records'}
                  </span>
                </div>

                {[
                  {
                    id: 't-1',
                    date: '2026-03-14',
                    nameBn: 'TEMU গোল্ডেন লাকি ভাউচার',
                    nameEn: 'TEMU Golden Lucky Voucher',
                    conditionBn: 'টার্নওভার ৳৫,০০০',
                    conditionEn: 'Turnover ৳5,000',
                    amount: '৳ ১০০.০০'
                  },
                  {
                    id: 't-2',
                    date: '2026-03-10',
                    nameBn: 'TEMU মেগা সারপ্রাইজ টিকেট',
                    nameEn: 'TEMU Mega Surprise Ticket',
                    conditionBn: 'ডিপোজিট ৳১,০০০',
                    conditionEn: 'Deposit ৳1,000',
                    amount: '৳ ৫০.০০'
                  },
                  {
                    id: 't-3',
                    date: '2026-03-05',
                    nameBn: 'TEMU নিউ মেম্বার টিকেট',
                    nameEn: 'TEMU New Member Ticket',
                    conditionBn: '১ম ডিপোজিট ভেরিফিকেশন',
                    conditionEn: '1st Deposit Verification',
                    amount: '৳ ২০.০০'
                  }
                ].map((ticket) => (
                  <div
                    key={ticket.id}
                    className="p-3 sm:p-3.5 rounded-2xl bg-white border border-gray-100 text-slate-700 flex items-center justify-between gap-2 shadow-sm hover:border-gray-200 transition"
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs sm:text-sm font-black text-slate-900">
                        {language === 'bn' ? ticket.nameBn : ticket.nameEn}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                        <span>{ticket.date}</span>
                        <span>•</span>
                        <span className="text-amber-600 font-bold font-sans">
                          {language === 'bn' ? ticket.conditionBn : ticket.conditionEn}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs sm:text-sm font-black text-emerald-600 font-mono block">
                        +{ticket.amount}
                      </span>
                      <span className="text-xs text-slate-500 uppercase font-semibold">
                        {language === 'bn' ? 'যোগ করা হয়েছে' : 'Added'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
