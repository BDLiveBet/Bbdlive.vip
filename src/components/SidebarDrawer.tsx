import React, { useState } from 'react';
import {
  Wallet,
  ArrowDownToLine,
  Gift,
  Share2,
  Trophy,
  Gamepad2,
  User,
  Download,
  Headphones,
  HelpCircle,
  LogOut,
  ChevronDown,
  ChevronUp,
  X,
  Globe,
  FileCode,
  Archive
} from 'lucide-react';
import { Language, AuthUser } from '../types';
import { GAME_CENTER_SUBITEMS, MEMBER_CENTER_SUBITEMS } from '../data/mockData';
import { BrandLogo } from './BrandLogo';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  currentUser?: AuthUser | null;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  onOpenOffers: () => void;
  onOpenShare: () => void;
  onOpenRewards: () => void;
  onOpenSupport: () => void;
  onOpenHelpCenter: () => void;
  onAppDownload: () => void;
  onNavigateGameLobby: () => void;
  onNavigateMember: () => void;
  onSelectCategory: (category: string) => void;
  onLogout: () => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  onClose,
  language,
  onLanguageChange,
  currentUser,
  onOpenDeposit,
  onOpenWithdraw,
  onOpenOffers,
  onOpenShare,
  onOpenRewards,
  onOpenSupport,
  onOpenHelpCenter,
  onAppDownload,
  onNavigateGameLobby,
  onNavigateMember,
  onSelectCategory,
  onLogout
}) => {
  const [isGameCenterOpen, setIsGameCenterOpen] = useState(false);
  const [isMemberOpen, setIsMemberOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        id="sidebar-backdrop"
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel (Dark Slate Navy matching Screenshot 2) */}
      <aside
        id="sidebar-drawer-menu"
        className="relative w-[300px] sm:w-[340px] max-w-[88vw] h-full bg-[#181d2c] border-r border-slate-700/60 flex flex-col z-10 shadow-2xl overflow-y-auto no-scrollbar"
      >
        {/* Drawer Header with BDLiveBet.vip Brand Logo */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#131622] border-b border-slate-800">
          <BrandLogo size="sm" showSubtitle={true} />

          <button
            id="btn-close-drawer"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition active:scale-95 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Logged in User Bar in Drawer */}
        {currentUser && (
          <div
            onClick={() => {
              onNavigateMember();
              onClose();
            }}
            className="mx-3 mt-3 p-3 rounded-xl bg-gradient-to-r from-[#22283b] to-[#1a1f30] border border-amber-500/30 flex items-center justify-between cursor-pointer hover:border-amber-400 transition shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-amber-400/60 overflow-hidden shrink-0">
                <img
                  src={currentUser.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                  <span>{currentUser.fullName || currentUser.username}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-extrabold">
                    VIP{currentUser.vipLevel || 2}
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                  <span className="text-amber-400 font-bold">UID: {currentUser.userId || '84739210'}</span>
                  <span>•</span>
                  <span>{currentUser.phone || '@' + currentUser.username}</span>
                </div>
              </div>
            </div>
            <span className="text-xs text-amber-400 font-semibold">
              {language === 'bn' ? 'ড্যাশবোর্ড ›' : 'Dashboard ›'}
            </span>
          </div>
        )}

        {/* Menu Items matching Screenshot 2 */}
        <div className="p-3 space-y-2 flex-1 overflow-y-auto no-scrollbar">
          {/* 1. Deposit */}
          <button
            id="sidebar-item-deposit"
            type="button"
            onClick={() => {
              onOpenDeposit();
              onClose();
            }}
            className="w-full flex items-center gap-3.5 px-3.5 py-2.5 sm:py-3 rounded-xl bg-[#21273a] hover:bg-[#2a324b] text-slate-200 hover:text-white border border-slate-700/40 transition active:scale-[0.98] group text-left cursor-pointer"
          >
            <span className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#FFEA79] to-[#D98A00] text-slate-950 font-bold shadow-sm shrink-0">
              <Wallet className="w-6 h-6 text-slate-950 stroke-[2.3]" />
            </span>
            <span className="text-base font-semibold group-hover:text-amber-300 transition">
              {language === 'bn' ? 'ডিপোজিট' : 'Deposit'}
            </span>
          </button>

          {/* 2. Withdraw */}
          <button
            id="sidebar-item-withdraw"
            type="button"
            onClick={() => {
              onOpenWithdraw();
              onClose();
            }}
            className="w-full flex items-center gap-3.5 px-3.5 py-2.5 sm:py-3 rounded-xl bg-[#21273a] hover:bg-[#2a324b] text-slate-200 hover:text-white border border-slate-700/40 transition active:scale-[0.98] group text-left cursor-pointer"
          >
            <span className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-bold shadow-sm shrink-0">
              <ArrowDownToLine className="w-6 h-6 text-slate-950 stroke-[2.3]" />
            </span>
            <span className="text-base font-semibold group-hover:text-amber-300 transition">
              {language === 'bn' ? 'উত্তোলন' : 'Withdraw'}
            </span>
          </button>

          {/* 3. Promotion */}
          <button
            id="sidebar-item-promotion"
            type="button"
            onClick={() => {
              onOpenOffers();
              onClose();
            }}
            className="w-full flex items-center gap-3.5 px-3.5 py-2.5 sm:py-3 rounded-xl bg-[#21273a] hover:bg-[#2a324b] text-slate-200 hover:text-white border border-slate-700/40 transition active:scale-[0.98] group text-left cursor-pointer"
          >
            <span className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-bold shadow-sm shrink-0">
              <Gift className="w-6 h-6 text-slate-950 stroke-[2.3]" />
            </span>
            <span className="text-base font-semibold group-hover:text-amber-300 transition">
              {language === 'bn' ? 'প্রমোশন' : 'Promotion'}
            </span>
          </button>

          {/* 4. Share */}
          <button
            id="sidebar-item-share"
            type="button"
            onClick={() => {
              onOpenShare();
              onClose();
            }}
            className="w-full flex items-center gap-3.5 px-3.5 py-2.5 sm:py-3 rounded-xl bg-[#21273a] hover:bg-[#2a324b] text-slate-200 hover:text-white border border-slate-700/40 transition active:scale-[0.98] group text-left cursor-pointer"
          >
            <span className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-bold shadow-sm shrink-0">
              <Share2 className="w-6 h-6 text-slate-950 stroke-[2.3]" />
            </span>
            <span className="text-base font-semibold group-hover:text-amber-300 transition">
              {language === 'bn' ? 'শেয়ার' : 'Share'}
            </span>
          </button>

          {/* 5. Reward Center */}
          <button
            id="sidebar-item-reward-center"
            type="button"
            onClick={() => {
              onOpenRewards();
              onClose();
            }}
            className="w-full flex items-center gap-3.5 px-3.5 py-2.5 sm:py-3 rounded-xl bg-[#21273a] hover:bg-[#2a324b] text-slate-200 hover:text-white border border-slate-700/40 transition active:scale-[0.98] group text-left cursor-pointer"
          >
            <span className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-bold shadow-sm shrink-0">
              <Trophy className="w-6 h-6 text-slate-950 stroke-[2.3]" />
            </span>
            <span className="text-base font-semibold group-hover:text-amber-300 transition">
              {language === 'bn' ? 'পুরস্কার কেন্দ্র' : 'Reward Center'}
            </span>
          </button>

          {/* 6. Game Center (Collapsible or direct navigate to Game Lobby) */}
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <button
                id="sidebar-item-game-center"
                type="button"
                onClick={() => {
                  onNavigateGameLobby();
                  onClose();
                }}
                className="flex-1 flex items-center gap-3.5 px-3.5 py-2.5 sm:py-3 rounded-xl bg-[#21273a] hover:bg-[#2a324b] text-slate-200 hover:text-white border border-slate-700/40 transition active:scale-[0.98] group text-left cursor-pointer"
              >
                <span className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-bold shadow-sm shrink-0">
                  <Gamepad2 className="w-6 h-6 text-slate-950 stroke-[2.3]" />
                </span>
                <span className="text-base font-semibold group-hover:text-amber-300 transition">
                  {language === 'bn' ? 'গেম সেন্টার' : 'Game Center'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setIsGameCenterOpen(!isGameCenterOpen)}
                className="p-3 rounded-xl bg-[#21273a] hover:bg-[#2a324b] text-slate-400 hover:text-white border border-slate-700/40 cursor-pointer"
              >
                {isGameCenterOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

            {isGameCenterOpen && (
              <div className="pl-3 py-1 space-y-1 bg-[#1a2030] rounded-xl border border-slate-800">
                {GAME_CENTER_SUBITEMS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelectCategory(item.id);
                      onNavigateGameLobby();
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-300 hover:text-amber-300 hover:bg-slate-800 rounded-lg text-left cursor-pointer"
                  >
                    <span>{language === 'bn' ? item.labelBn : item.labelEn}</span>
                    {item.tag && (
                      <span className="text-xs px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold">
                        {item.tag}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 7. Member (Direct navigate to Member Account Dashboard) */}
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <button
                id="sidebar-item-member"
                type="button"
                onClick={() => {
                  onNavigateMember();
                  onClose();
                }}
                className="flex-1 flex items-center gap-3.5 px-3.5 py-2.5 sm:py-3 rounded-xl bg-[#21273a] hover:bg-[#2a324b] text-slate-200 hover:text-white border border-slate-700/40 transition active:scale-[0.98] group text-left cursor-pointer"
              >
                <span className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-bold shadow-sm shrink-0">
                  <User className="w-6 h-6 text-slate-950 stroke-[2.3]" />
                </span>
                <span className="text-base font-semibold group-hover:text-amber-300 transition">
                  {language === 'bn' ? 'সদস্য' : 'Member'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setIsMemberOpen(!isMemberOpen)}
                className="p-3 rounded-xl bg-[#21273a] hover:bg-[#2a324b] text-slate-400 hover:text-white border border-slate-700/40 cursor-pointer"
              >
                {isMemberOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

            {isMemberOpen && (
              <div className="pl-3 py-1 space-y-1 bg-[#1a2030] rounded-xl border border-slate-800">
                {MEMBER_CENTER_SUBITEMS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onNavigateMember();
                      onClose();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-amber-300 hover:bg-slate-800 rounded-lg text-left cursor-pointer"
                  >
                    <span>{language === 'bn' ? item.labelBn : item.labelEn}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 8. APP Download */}
          <button
            id="sidebar-item-app-download"
            type="button"
            onClick={() => {
              onAppDownload();
              onClose();
            }}
            className="w-full flex items-center gap-3.5 px-3.5 py-2.5 sm:py-3 rounded-xl bg-[#21273a] hover:bg-[#2a324b] text-slate-200 hover:text-white border border-slate-700/40 transition active:scale-[0.98] group text-left cursor-pointer"
          >
            <span className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-bold shadow-sm shrink-0">
              <Download className="w-6 h-6 text-slate-950 stroke-[2.3]" />
            </span>
            <span className="text-base font-semibold group-hover:text-amber-300 transition">
              {language === 'bn' ? 'অ্যাপ ডাউনলোড' : 'APP Download'}
            </span>
          </button>

          {/* 8.1 WordPress Theme Download */}
          <button
            id="sidebar-item-wp-theme-download"
            type="button"
            onClick={() => {
              window.location.href = '/download-theme';
              onClose();
            }}
            className="w-full flex items-center gap-3.5 px-3.5 py-2.5 sm:py-3 rounded-xl bg-[#21273a] hover:bg-[#2a324b] text-slate-200 hover:text-white border border-slate-700/40 transition active:scale-[0.98] group text-left cursor-pointer"
          >
            <span className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold shadow-sm shrink-0">
              <Archive className="w-5 h-5 text-white stroke-[2.3]" />
            </span>
            <div className="flex-1">
              <div className="text-base font-semibold group-hover:text-blue-300 transition">
                {language === 'bn' ? 'WordPress থিম (ZIP)' : 'WordPress Theme (ZIP)'}
              </div>
              <div className="text-xs text-slate-400">
                {language === 'bn' ? 'ইনস্টলযোগ্য WP থিম ফাইল' : 'Installable Theme Package'}
              </div>
            </div>
          </button>

          {/* 8.2 Standalone HTML Download */}
          <button
            id="sidebar-item-html-download"
            type="button"
            onClick={() => {
              window.location.href = '/download-standalone';
              onClose();
            }}
            className="w-full flex items-center gap-3.5 px-3.5 py-2.5 sm:py-3 rounded-xl bg-[#21273a] hover:bg-[#2a324b] text-slate-200 hover:text-white border border-slate-700/40 transition active:scale-[0.98] group text-left cursor-pointer"
          >
            <span className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-slate-950 font-bold shadow-sm shrink-0">
              <FileCode className="w-6 h-6 text-slate-950 stroke-[2.3]" />
            </span>
            <div className="flex-1">
              <div className="text-base font-semibold group-hover:text-cyan-300 transition">
                {language === 'bn' ? 'HTML কোড ডাউনলোড' : 'HTML Code Download'}
              </div>
              <div className="text-xs text-slate-400">
                {language === 'bn' ? 'এক ফাইলে সম্পূর্ণ প্রজেক্ট' : 'Single Standalone HTML'}
              </div>
            </div>
          </button>

          {/* 9. Customer Service */}
          <button
            id="sidebar-item-customer-service"
            type="button"
            onClick={() => {
              onOpenSupport();
              onClose();
            }}
            className="w-full flex items-center gap-3.5 px-3.5 py-2.5 sm:py-3 rounded-xl bg-[#21273a] hover:bg-[#2a324b] text-slate-200 hover:text-white border border-slate-700/40 transition active:scale-[0.98] group text-left cursor-pointer"
          >
            <span className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-bold shadow-sm shrink-0">
              <Headphones className="w-6 h-6 text-slate-950 stroke-[2.3]" />
            </span>
            <span className="text-base font-semibold group-hover:text-amber-300 transition">
              {language === 'bn' ? 'গ্রাহক সেবা' : 'Customer Service'}
            </span>
          </button>

          {/* 10. Help Center */}
          <button
            id="sidebar-item-help-center"
            type="button"
            onClick={() => {
              onOpenHelpCenter();
              onClose();
            }}
            className="w-full flex items-center gap-3.5 px-3.5 py-2.5 sm:py-3 rounded-xl bg-[#21273a] hover:bg-[#2a324b] text-slate-200 hover:text-white border border-slate-700/40 transition active:scale-[0.98] group text-left cursor-pointer"
          >
            <span className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-bold shadow-sm shrink-0">
              <HelpCircle className="w-6 h-6 text-slate-950 stroke-[2.3]" />
            </span>
            <span className="text-base font-semibold group-hover:text-amber-300 transition">
              {language === 'bn' ? 'সহায়তা কেন্দ্র' : 'Help Center'}
            </span>
          </button>
        </div>

        {/* Bottom Section: Language Pill Switcher & Logout Button (matches Screenshot 2) */}
        <div className="p-3 bg-[#131622] border-t border-slate-800 space-y-2">
          {/* Language Switcher */}
          <button
            id="btn-sidebar-lang-switch"
            type="button"
            onClick={() => onLanguageChange(language === 'bn' ? 'en' : 'bn')}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#1e2436] hover:bg-[#252c40] text-slate-200 border border-slate-700/60 text-xs sm:text-sm font-semibold shadow-sm transition cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              {language === 'bn' ? (
                <>
                  <span className="inline-block w-4 h-4 rounded-full overflow-hidden relative border border-emerald-600">
                    <span className="absolute inset-0 bg-[#006a4e]" />
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#f42a41]" />
                  </span>
                  <span>বাংলা (Bengali)</span>
                </>
              ) : (
                <>
                  <span className="inline-block w-4 h-4 rounded-full overflow-hidden relative border border-blue-600">
                    <span className="absolute inset-0 bg-[#00247d]" />
                    <span className="absolute inset-x-0 top-1.5 h-1 bg-red-600" />
                    <span className="absolute inset-y-0 left-1.5 w-1 bg-red-600" />
                  </span>
                  <span>English</span>
                </>
              )}
            </div>
            <span className="text-xs text-amber-400 font-bold">
              {language === 'bn' ? 'Switch to EN' : 'বাংলায় পরিবর্তন'}
            </span>
          </button>

          {/* Logout Button */}
          <button
            id="sidebar-btn-logout"
            type="button"
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#21273a] hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-slate-700/50 text-sm font-bold transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{language === 'bn' ? 'লগআউট' : 'Logout'}</span>
          </button>
        </div>
      </aside>
    </div>
  );
};
