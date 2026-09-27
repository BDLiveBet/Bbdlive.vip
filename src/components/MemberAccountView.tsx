import React, { useState } from 'react';
import {
  ChevronLeft,
  Copy,
  Edit2,
  RotateCw,
  Trophy,
  FileClock,
  TrendingUp,
  ArrowDownCircle,
  ArrowUpCircle,
  BookOpen,
  UserCog,
  ShieldCheck,
  UserPlus,
  Coins,
  Mail,
  MessageSquare,
  Headset,
  HelpCircle,
  LogOut,
  Sparkles,
  Check,
  Crown,
  Lock,
  Wallet,
  Gift,
  Camera,
  ChevronRight,
  FileCode,
  Archive,
  Download
} from 'lucide-react';
import { Language, AuthUser } from '../types';
import { MEMBER_CENTER_GRID_ITEMS } from '../data/mockData';
import { ProfileSettingsModal } from './ProfileSettingsModal';
import { copyToClipboard } from '../utils/clipboard';
import { AvatarSelectorModal } from './AvatarSelectorModal';
import { WalletDetailsModal } from './WalletDetailsModal';

interface MemberAccountViewProps {
  language: Language;
  onBack: () => void;
  currentUser?: AuthUser | null;
  walletBalance: number;
  onRefreshBalance: () => void;
  isRefreshing: boolean;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  onOpenBankAccount: () => void;
  onOpenBettingRecord: (initialTab?: 'betting' | 'profit_loss' | 'transactions' | 'turnover') => void;
  onOpenMessages: () => void;
  onOpenRewardCenter: () => void;
  onOpenSupport: () => void;
  onOpenShare: () => void;
  onOpenHelpCenter: () => void;
  onDailySignIn: () => void;
  onLogout: () => void;
  onUpdateUser?: (updated: AuthUser) => void;
  onShowToast?: (msg: string) => void;
}

export const MemberAccountView: React.FC<MemberAccountViewProps> = ({
  language,
  onBack,
  currentUser,
  walletBalance,
  onRefreshBalance,
  isRefreshing,
  onOpenDeposit,
  onOpenWithdraw,
  onOpenBankAccount,
  onOpenBettingRecord,
  onOpenMessages,
  onOpenRewardCenter,
  onOpenSupport,
  onOpenShare,
  onOpenHelpCenter,
  onDailySignIn,
  onLogout,
  onUpdateUser,
  onShowToast
}) => {
  const [copiedId, setCopiedId] = useState(false);
  const [isNicknameEditing, setIsNicknameEditing] = useState(false);
  const [nickname, setNickname] = useState(currentUser?.fullName || currentUser?.username || 'vvshamim');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const joinedDate = currentUser?.joinedDate || '2026-07-20';

  // Dynamic VIP tier data
  const currentVip = currentUser?.vipLevel || 2;
  const currentExp = 4500;
  const targetExp = 10000;
  const vipProgressPercent = Math.round((currentExp / targetExp) * 100);

  // Bonus and wallet balances
  const bonusBalance = 128.0;
  const totalBalance = walletBalance + bonusBalance;
  const lockedTurnover = 350.0;

  // Instant Avatar selection and database persistence
  const handleSelectAvatar = async (avatarUrl: string) => {
    const token = localStorage.getItem('bdlivebet_token') || localStorage.getItem('1xbetlive_token') || localStorage.getItem('hibajee_token');
    if (!token) {
      throw new Error('Please login to update avatar');
    }

    const res = await fetch('/api/auth/profile/avatar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ avatar: avatarUrl })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to update avatar');
    }

    if (currentUser && onUpdateUser) {
      const updated: AuthUser = {
        ...currentUser,
        avatar: avatarUrl
      };
      onUpdateUser(updated);
    }
    onShowToast?.(
      language === 'bn'
        ? 'অ্যাভাটার সফলভাবে পরিবর্তন করা হয়েছে!'
        : 'Avatar updated successfully!'
    );
  };

  // Icons rendered inside round cream badges
  const renderItemIcon = (iconType: string) => {
    switch (iconType) {
      case 'trophy':
        return <Trophy className="w-7 h-7 sm:w-8 sm:h-8 text-[#D97706] stroke-[2.3] drop-shadow-sm" />;
      case 'file-clock':
        return <FileClock className="w-7 h-7 sm:w-8 sm:h-8 text-[#4F46E5] stroke-[2.3] drop-shadow-sm" />;
      case 'trending-up':
        return <TrendingUp className="w-7 h-7 sm:w-8 sm:h-8 text-[#059669] stroke-[2.3] drop-shadow-sm" />;
      case 'arrow-down-circle':
        return <ArrowDownCircle className="w-7 h-7 sm:w-8 sm:h-8 text-[#0891B2] stroke-[2.3] drop-shadow-sm" />;
      case 'arrow-up-circle':
        return <ArrowUpCircle className="w-7 h-7 sm:w-8 sm:h-8 text-[#E11D48] stroke-[2.3] drop-shadow-sm" />;
      case 'book-open':
        return <BookOpen className="w-7 h-7 sm:w-8 sm:h-8 text-[#2563EB] stroke-[2.3] drop-shadow-sm" />;
      case 'user-cog':
        return <UserCog className="w-7 h-7 sm:w-8 sm:h-8 text-[#EA580C] stroke-[2.3] drop-shadow-sm" />;
      case 'shield-check':
        return <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-[#16A34A] stroke-[2.3] drop-shadow-sm" />;
      case 'user-plus':
        return <UserPlus className="w-7 h-7 sm:w-8 sm:h-8 text-[#DB2777] stroke-[2.3] drop-shadow-sm" />;
      case 'coins':
        return <Coins className="w-7 h-7 sm:w-8 sm:h-8 text-[#CA8A04] stroke-[2.3] drop-shadow-sm" />;
      case 'mail':
        return <Mail className="w-7 h-7 sm:w-8 sm:h-8 text-[#0284C7] stroke-[2.3] drop-shadow-sm" />;
      case 'message-square':
        return <MessageSquare className="w-7 h-7 sm:w-8 sm:h-8 text-[#7C3AED] stroke-[2.3] drop-shadow-sm" />;
      case 'headset':
        return <Headset className="w-7 h-7 sm:w-8 sm:h-8 text-[#0D9488] stroke-[2.3] drop-shadow-sm" />;
      case 'help-circle':
        return <HelpCircle className="w-7 h-7 sm:w-8 sm:h-8 text-[#D97706] stroke-[2.3] drop-shadow-sm" />;
      case 'file-code':
        return <FileCode className="w-7 h-7 sm:w-8 sm:h-8 text-[#0284C7] stroke-[2.3] drop-shadow-sm" />;
      case 'archive':
        return <Archive className="w-7 h-7 sm:w-8 sm:h-8 text-[#2563EB] stroke-[2.3] drop-shadow-sm" />;
      case 'log-out':
        return <LogOut className="w-7 h-7 sm:w-8 sm:h-8 text-[#DC2626] stroke-[2.3] drop-shadow-sm" />;
      default:
        return <Trophy className="w-7 h-7 sm:w-8 sm:h-8 text-[#D97706] stroke-[2.3]" />;
    }
  };

  const handleGridItemClick = (id: string) => {
    switch (id) {
      case 'reward-center':
        onOpenRewardCenter();
        break;
      case 'betting-record':
        onOpenBettingRecord('betting');
        break;
      case 'profit-loss':
        onOpenBettingRecord('profit_loss');
        break;
      case 'account-record':
        onOpenBettingRecord('transactions');
        break;
      case 'deposit-record':
        onOpenBettingRecord('transactions');
        break;
      case 'withdrawal-record':
        onOpenBettingRecord('transactions');
        break;
      case 'my-account':
      case 'security-center':
        setIsProfileModalOpen(true);
        break;
      case 'invite-friends':
      case 'rebate':
        onOpenShare();
        break;
      case 'internal-message':
        onOpenMessages();
        break;
      case 'suggestion':
      case 'customer-service':
        onOpenSupport();
        break;
      case 'help-center':
        onOpenHelpCenter();
        break;
      case 'download-wp-theme':
        if (onShowToast) {
          onShowToast(language === 'bn' ? 'WordPress থিম ডাউনলোড (ZIP) শুরু হচ্ছে...' : 'Downloading WordPress Theme (ZIP)...');
        }
        window.location.href = '/download-theme';
        break;
      case 'download-html':
        if (onShowToast) {
          onShowToast(language === 'bn' ? 'সম্পূর্ণ Standalone HTML ডাউনলোড শুরু হচ্ছে...' : 'Downloading Standalone HTML...');
        }
        window.location.href = '/download-standalone';
        break;
      case 'logout':
        onLogout();
        break;
      default:
        break;
    }
  };

  return (
    <div id="member-account-screen" className="flex-1 flex flex-col bg-[#f8f9fa] min-h-full pb-24 text-slate-800">
      {/* 1. Top Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 sm:px-6 md:px-8 py-3 flex items-center justify-between shadow-xs">
        <button
          id="btn-account-back"
          type="button"
          onClick={onBack}
          className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-slate-700 transition active:scale-95 shadow-xs cursor-pointer"
          aria-label="Back"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <h1 className="text-base sm:text-xl font-extrabold text-slate-900 tracking-wide">
          {language === 'bn' ? 'সদস্য সেন্টার' : 'Member Center'}
        </h1>

        <div className="w-9 sm:w-10" />
      </div>

      {/* Main Content Container */}
      <div className="p-3 sm:p-5 md:p-6 space-y-4 sm:space-y-5 max-w-4xl mx-auto w-full pb-32">
        {/* 1. Top Profile Header Card (Light Gold/Cream Gradient Card Styling) */}
        <div
          id="gold-vip-card-banner"
          className="relative rounded-3xl overflow-hidden p-4 sm:p-5 shadow-2xl border border-[#DEC494] bg-gradient-to-br from-[#F5E6C8] via-[#FAF0DB] to-[#E9D6AC] text-slate-900"
        >
          {/* Subtle Background Watermark */}
          <div className="absolute -right-6 -bottom-6 w-36 h-36 rounded-full border-8 border-white/20 pointer-events-none opacity-25" />
          <div className="absolute right-4 top-2 text-5xl sm:text-6xl font-black text-amber-900/10 pointer-events-none select-none">
            VIP
          </div>

          {/* User Avatar, VIP Badge, Username, Join Date & UID Row */}
          <div className="flex items-center gap-3.5 sm:gap-4 relative z-10">
            {/* User Avatar (Clickable to change preset) */}
            <div
              onClick={() => setIsAvatarModalOpen(true)}
              className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full border-2 border-[#D4AF37] shadow-lg overflow-hidden shrink-0 bg-slate-900 cursor-pointer group"
              title={language === 'bn' ? 'অ্যাভাটার পরিবর্তন করুন' : 'Change avatar'}
            >
              <img
                src={currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80"}
                alt="User Profile"
                className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-amber-300">
                <Camera className="w-5 h-5" />
              </div>
              <div className="absolute bottom-0 right-0 p-1 rounded-full bg-amber-500 text-slate-950 shadow-md">
                <Sparkles className="w-3 h-3" />
              </div>
            </div>

            {/* User Meta Details: VIP Badge, Username, Join Date */}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-slate-950 text-base sm:text-lg tracking-tight truncate">
                  {currentUser?.fullName || currentUser?.username || nickname}
                </span>

                {/* VIP Badge */}
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#1A140A] text-[#F59E0B] font-black text-xs border border-amber-600/40 shadow-sm shrink-0">
                  <span>⭐</span>
                  <span>VIP{currentVip}</span>
                </span>
              </div>

              {/* Join Date */}
              <div className="text-xs sm:text-sm text-slate-700 font-medium">
                {language === 'bn' ? 'যুক্ত হয়েছেন:' : 'Joined:'}{' '}
                <span className="font-semibold text-slate-900">{joinedDate}</span>
              </div>

              {/* User ID with Copy Trigger */}
              <div className="flex items-center gap-1.5 text-xs text-slate-800 font-bold">
                <span>{language === 'bn' ? 'ইউজার আইডি:' : 'User ID:'}</span>
                <span className="font-mono font-black text-amber-950">{currentUser?.userId || '84739210'}</span>
                <button
                  id="btn-copy-user-id"
                  type="button"
                  onClick={async () => {
                    await copyToClipboard(currentUser?.userId || '84739210');
                    setCopiedId(true);
                    setTimeout(() => setCopiedId(false), 2000);
                  }}
                  className="p-0.5 rounded text-slate-700 hover:text-black active:scale-90 cursor-pointer"
                  title="Copy User ID"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-800" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Balance Display */}
          <div className="mt-3.5 p-3 sm:p-3.5 rounded-2xl bg-white/75 backdrop-blur-sm border border-[#DEC494]/80 shadow-sm flex items-center justify-between relative z-10">
            <div>
              <span className="text-xs sm:text-sm text-slate-600 font-bold block">
                {language === 'bn' ? 'ব্যালেন্স' : 'Balance'}
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-2xl sm:text-3xl font-black font-mono text-slate-950 tracking-tight">
                  ৳ {walletBalance.toFixed(2)}
                </span>
                <button
                  type="button"
                  onClick={onRefreshBalance}
                  className="p-1 rounded-full text-slate-600 hover:text-slate-950 active:scale-90 transition cursor-pointer"
                  title="Refresh Balance"
                >
                  <RotateCw className={`w-4 h-4 sm:w-5 sm:h-5 ${isRefreshing ? 'animate-spin text-amber-600' : ''}`} />
                </button>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs sm:text-sm text-slate-600 font-semibold block">
                {language === 'bn' ? 'বোনাস ওয়ালেট' : 'Bonus Wallet'}
              </span>
              <span className="text-sm sm:text-base font-bold font-mono text-amber-900">
                ৳ {bonusBalance.toFixed(2)}
              </span>
            </div>
          </div>

          {/* 3 Primary Action Buttons below the balance: "জমা দিন", "উত্তোলন", and "আমার কার্ড" */}
          <div className="mt-3.5 grid grid-cols-3 gap-2 sm:gap-3 relative z-10">
            <button
              id="btn-vip-deposit"
              type="button"
              onClick={onOpenDeposit}
              className="py-3 sm:py-3.5 px-2 rounded-2xl bg-gradient-to-b from-[#FFFDF8] via-[#FAF3E0] to-[#F1DEB2] hover:from-white hover:to-[#EBCE96] text-slate-950 font-bold text-sm shadow-md border border-[#D9BD89] active:scale-95 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowDownCircle className="w-5 h-5 text-amber-700 shrink-0" />
              <span>{language === 'bn' ? 'জমা দিন' : 'Deposit'}</span>
            </button>

            <button
              id="btn-vip-withdrawal"
              type="button"
              onClick={onOpenWithdraw}
              className="py-3 sm:py-3.5 px-2 rounded-2xl bg-gradient-to-b from-[#FFFDF8] via-[#FAF3E0] to-[#F1DEB2] hover:from-white hover:to-[#EBCE96] text-slate-950 font-bold text-sm shadow-md border border-[#D9BD89] active:scale-95 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowUpCircle className="w-5 h-5 text-rose-700 shrink-0" />
              <span>{language === 'bn' ? 'উত্তোলন' : 'Withdrawal'}</span>
            </button>

            <button
              id="btn-vip-bank-account"
              type="button"
              onClick={onOpenBankAccount}
              className="py-3 sm:py-3.5 px-2 rounded-2xl bg-gradient-to-b from-[#FFFDF8] via-[#FAF3E0] to-[#F1DEB2] hover:from-white hover:to-[#EBCE96] text-slate-950 font-bold text-sm shadow-md border border-[#D9BD89] active:scale-95 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Wallet className="w-5 h-5 text-indigo-700 shrink-0" />
              <span>{language === 'bn' ? 'আমার কার্ড' : 'My Card'}</span>
            </button>
          </div>
        </div>

        {/* 1.5 WordPress Theme 1-Click Download Card */}
        <div
          id="wp-theme-download-card"
          className="rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#1e1b4b] border border-blue-500/30 shadow-xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden"
        >
          {/* Subtle Glow & Background Accent */}
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

          <div className="flex items-center gap-3.5 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600/30 to-indigo-600/30 border border-blue-400/40 flex items-center justify-center shrink-0 shadow-inner">
              <Archive className="w-6 h-6 text-blue-400 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-white tracking-wide">
                  {language === 'bn' ? 'WordPress থিম ডাউনলোড (ZIP)' : 'WordPress Theme Download (ZIP)'}
                </h3>
                <span className="px-2 py-0.5 text-xs font-black rounded-full bg-blue-500/30 text-blue-300 border border-blue-400/40">
                  READY TO INSTALL
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium leading-relaxed">
                {language === 'bn'
                  ? 'সম্পূর্ণ স্ট্যান্ডার্ড ওয়ার্ডপ্রেস থিম (style.css, index.php, functions.php, header.php, footer.php ও অ্যাসেটস)'
                  : 'Standard WordPress Theme package (style.css, index.php, functions.php, header.php, footer.php & assets)'}
              </p>
            </div>
          </div>

          <button
            id="btn-download-wp-theme-oneclick"
            type="button"
            onClick={() => {
              if (onShowToast) {
                onShowToast(language === 'bn' ? 'WordPress থিম ডাউনলোড (ZIP) শুরু হচ্ছে...' : 'Downloading WordPress Theme (ZIP)...');
              }
              window.location.href = '/download-theme';
            }}
            className="py-3 px-5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-lg shadow-blue-900/40 border border-blue-400/40 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 relative z-10"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>{language === 'bn' ? 'WordPress থিম ডাউনলোড (ZIP)' : 'Download WP Theme (ZIP)'}</span>
          </button>
        </div>

        {/* 2. Member Center (সদস্য সেন্টার) - 4-Column Grid with Round Cream Icon Badges */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-4 sm:h-5 rounded-full bg-amber-500" />
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-wide">
                {language === 'bn' ? 'সদস্য সেন্টার' : 'Member Center'}
              </h2>
            </div>
          </div>

          <div
            id="member-center-card-grid"
            className="bg-white border border-gray-100 shadow-sm rounded-2xl p-3 sm:p-5 grid grid-cols-4 gap-2.5 sm:gap-4 md:gap-5"
          >
            {MEMBER_CENTER_GRID_ITEMS.map((item) => (
              <button
                key={item.id}
                id={`member-item-${item.id}`}
                type="button"
                onClick={() => handleGridItemClick(item.id)}
                className="relative flex flex-col items-center justify-start py-2.5 px-1 rounded-xl hover:bg-amber-50/40 active:scale-95 transition-all duration-150 text-center group cursor-pointer"
              >
                {/* Round Cream Icon Badge */}
                <div className="relative mb-2 w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#fef9ee] border border-amber-100 shadow-xs flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
                  {renderItemIcon(item.iconType)}
                  {item.badge && (
                    <span
                      className={`absolute -top-1 -right-1 min-w-5 h-5 px-1.5 rounded-full ${
                        item.badgeColor || 'bg-red-500'
                      } text-white font-bold text-xs flex items-center justify-center shadow-md animate-pulse`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>

                <span className="text-slate-700 font-medium text-xs text-center leading-tight line-clamp-2 transition mt-0.5 min-h-[32px] flex items-center justify-center">
                  {language === 'bn' ? item.labelBn : item.labelEn}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modals triggered by Member Center clicks */}
      <WalletDetailsModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        language={language}
        walletBalance={walletBalance}
        bonusBalance={bonusBalance}
        lockedTurnover={lockedTurnover}
        isRefreshing={isRefreshing}
        onRefreshBalance={onRefreshBalance}
        onOpenDeposit={onOpenDeposit}
        onOpenWithdraw={onOpenWithdraw}
        onOpenBankAccount={onOpenBankAccount}
      />

      <ProfileSettingsModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        language={language}
        currentUser={currentUser || null}
        onUpdateUser={(updated) => {
          if (onUpdateUser) onUpdateUser(updated);
        }}
        onOpenAvatarModal={() => setIsAvatarModalOpen(true)}
        onShowToast={(msg) => onShowToast && onShowToast(msg)}
      />

      <AvatarSelectorModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        currentAvatar={currentUser?.avatar}
        language={language}
        onSelectAvatar={handleSelectAvatar}
      />
    </div>
  );
};
