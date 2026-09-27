import React from 'react';
import {
  X,
  Wallet,
  Gift,
  Lock,
  RotateCw,
  ArrowDownCircle,
  ArrowUpCircle,
  ShieldCheck,
  CreditCard,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { Language } from '../types';

interface WalletDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  walletBalance: number;
  bonusBalance?: number;
  lockedTurnover?: number;
  isRefreshing: boolean;
  onRefreshBalance: () => void;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  onOpenBankAccount: () => void;
}

export const WalletDetailsModal: React.FC<WalletDetailsModalProps> = ({
  isOpen,
  onClose,
  language,
  walletBalance,
  bonusBalance = 128.0,
  lockedTurnover = 350.0,
  isRefreshing,
  onRefreshBalance,
  onOpenDeposit,
  onOpenWithdraw,
  onOpenBankAccount
}) => {
  if (!isOpen) return null;

  const totalAssets = walletBalance + bonusBalance;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-5 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 border border-amber-200 flex items-center justify-center shadow-sm">
              <Wallet className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-wide">
                {language === 'bn' ? 'ওয়ালেট ব্যবস্থাপনা' : 'Wallet Management'}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {language === 'bn' ? 'ব্যালেন্স ও আর্থিক সম্পদের সম্পূর্ণ বিবরণ' : 'Full balance & asset breakdown'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onRefreshBalance}
              disabled={isRefreshing}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-amber-700 border border-gray-200 transition active:scale-95 flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              title="Refresh Balance"
            >
              <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-600' : ''}`} />
              <span className="hidden sm:inline">{language === 'bn' ? 'রিফ্রেশ' : 'Refresh'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-slate-500 hover:text-slate-800 transition active:scale-95 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 no-scrollbar">
          {/* Total Combined Assets Card */}
          <div className="relative rounded-2xl p-4 bg-gradient-to-br from-[#F5E6C8] via-[#FAF0DB] to-[#E9D6AC] text-slate-900 shadow-sm border border-[#DEC494] overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-800" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900">
                  {language === 'bn' ? 'সর্বমোট সম্পদ (মোট ব্যালেন্স)' : 'Total Asset Balance'}
                </span>
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-900 text-amber-100">
                BDT ৳
              </span>
            </div>

            <div className="mt-2 text-3xl sm:text-4xl font-black font-mono tracking-tight text-slate-900">
              ৳ {totalAssets.toFixed(2)}
            </div>

            <p className="mt-1 text-xs text-amber-900/80 font-medium">
              {language === 'bn'
                ? 'মূল ব্যালেন্স ও একটিভ বোনাস ওয়ালেটের সমন্বিত যোগফল'
                : 'Combined sum of withdrawable wallet & bonus credits'}
            </p>
          </div>

          {/* Detailed Balances Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 1. Main Withdrawable Balance */}
            <div className="p-4 rounded-2xl bg-white border border-emerald-200 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  {language === 'bn' ? 'কোর মূল ব্যালেন্স (উত্তোলনযোগ্য)' : 'Main Balance (Withdrawable)'}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {language === 'bn' ? 'রেডি' : 'Ready'}
                </span>
              </div>

              <div className="text-2xl font-black font-mono text-emerald-600">
                ৳ {walletBalance.toFixed(2)}
              </div>

              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                {language === 'bn'
                  ? 'যেকোনো সময় সরাসরি নগদ, বিকাশ বা ব্যাংকে উত্তোলন সম্ভব'
                  : 'Available for immediate cash withdrawal to bank/wallets'}
              </p>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenDeposit();
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-extrabold text-sm flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
                >
                  <ArrowDownCircle className="w-4 h-4" />
                  <span>{language === 'bn' ? 'ডিপোজিট' : 'Deposit'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenWithdraw();
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-emerald-800 border border-emerald-300 font-extrabold text-sm flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                >
                  <ArrowUpCircle className="w-4 h-4" />
                  <span>{language === 'bn' ? 'উত্তোলন' : 'Withdraw'}</span>
                </button>
              </div>
            </div>

            {/* 2. Bonus Balance */}
            <div className="p-4 rounded-2xl bg-white border border-amber-200 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-amber-600" />
                  {language === 'bn' ? 'বোনাস ওয়ালেট' : 'Bonus Wallet'}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                  VIP 2
                </span>
              </div>

              <div className="text-2xl font-black font-mono text-amber-700">
                ৳ {bonusBalance.toFixed(2)}
              </div>

              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                {language === 'bn'
                  ? 'দৈনিক সাইন ইন, প্রচারমূলক বোনাস ও ক্যাশব্যাক তহবিল'
                  : 'Daily rewards, promotional credits & rebate bonuses'}
              </p>

              <div className="pt-2">
                <div className="flex items-center justify-between text-xs text-amber-800 font-bold mb-1">
                  <span>{language === 'bn' ? 'টার্নওভার অগ্রগতি' : 'Rollover Progress'}</span>
                  <span>65%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full w-[65%]" />
                </div>
              </div>
            </div>

            {/* 3. Locked Turnover */}
            <div className="p-4 rounded-2xl bg-white border border-rose-200 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-rose-600" />
                  {language === 'bn' ? 'বাকি টার্নওভার' : 'Locked Turnover'}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                  {language === 'bn' ? 'প্রয়োজনীয়' : 'Required'}
                </span>
              </div>

              <div className="text-2xl font-black font-mono text-rose-600">
                ৳ {lockedTurnover.toFixed(2)}
              </div>

              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                {language === 'bn'
                  ? 'বোনাস উত্তোলনের জন্য বাকি খেলার শর্তাবলী'
                  : 'Remaining wagering requirement to unlock bonus'}
              </p>
            </div>

            {/* 4. Linked Banking Account */}
            <div className="p-4 rounded-2xl bg-white border border-blue-200 space-y-2 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    {language === 'bn' ? 'সংযুক্ত ব্যাংক / ওয়ালেট' : 'Linked Banking'}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    {language === 'bn' ? 'সংযুক্ত' : 'Bound'}
                  </span>
                </div>

                <div className="mt-2 text-sm font-bold text-slate-800">
                  bKash / Nagad Wallet
                </div>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  {language === 'bn'
                    ? 'দ্রুত ও সুরক্ষিত লেনদেনের জন্য নিবন্ধিত ওয়ালেট'
                    : 'Registered for fast 5-minute automated payout processing'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenBankAccount();
                }}
                className="mt-3 w-full py-2 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-blue-700 border border-blue-200 font-extrabold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
              >
                <span>{language === 'bn' ? 'অ্যাকাউন্ট পরিবর্তন / পরিচালনা' : 'Manage Account'}</span>
              </button>
            </div>
          </div>

          {/* Security Notice */}
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-amber-600 shrink-0" />
            <p className="text-xs text-amber-900 leading-relaxed font-medium">
              {language === 'bn'
                ? 'BDLiveBet.vip এর সকল ওয়ালেট ট্রানজেকশন ২৫৬-বিট এসএসএল (SSL) ব্যাংক-গ্রেড এনক্রিপশনে সুরক্ষিত।'
                : 'All BDLiveBet.vip wallet transactions are secured by 256-bit SSL financial-grade encryption.'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-md transition active:scale-95 cursor-pointer"
          >
            {language === 'bn' ? 'ঠিক আছে (Done)' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
