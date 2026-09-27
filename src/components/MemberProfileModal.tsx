import React from 'react';
import { X, User, Shield, CreditCard, Clock, Award, LogOut, ChevronRight } from 'lucide-react';
import { Language } from '../types';

interface MemberProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  walletBalance: number;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  onOpenSupport: () => void;
}

export const MemberProfileModal: React.FC<MemberProfileModalProps> = ({
  isOpen,
  onClose,
  language,
  walletBalance,
  onOpenDeposit,
  onOpenWithdraw,
  onOpenSupport
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-[#161b2a] border border-amber-500/40 rounded-2xl p-4 sm:p-5 shadow-2xl z-10 max-h-[92vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-500 to-amber-600 text-slate-950 flex items-center justify-center font-black text-lg shadow-md">
              HB
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-100 font-mono">
                  Player_88491
                </h3>
                <span className="text-xs font-black px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                  VIP 1
                </span>
              </div>
              <span className="text-xs text-slate-400">ID: 98849102</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Balance Card */}
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-[#20273a] to-[#2a344d] border border-amber-400/40 shadow-md">
          <span className="text-xs text-slate-300 block">
            {language === 'bn' ? 'বর্তমান ওয়ালেট ব্যালেন্স' : 'Current Wallet Balance'}
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="font-mono text-2xl font-black text-amber-300">
              {walletBalance.toFixed(2)} ৳
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => { onOpenDeposit(); onClose(); }}
                className="px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow transition active:scale-95"
              >
                {language === 'bn' ? 'ডিপোজিট' : 'Deposit'}
              </button>
              <button
                type="button"
                onClick={() => { onOpenWithdraw(); onClose(); }}
                className="px-3 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 font-bold text-xs transition active:scale-95"
              >
                {language === 'bn' ? 'উত্তোলন' : 'Withdraw'}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Menu List */}
        <div className="mt-4 space-y-1 text-xs">
          <div className="p-3 rounded-xl bg-[#1e2436] flex items-center justify-between text-slate-200">
            <div className="flex items-center gap-3">
              <Award className="w-4 h-4 text-amber-400" />
              <span>{language === 'bn' ? 'ভিআইপি প্রমোশন সুবিধা' : 'VIP Privileges'}</span>
            </div>
            <span className="text-amber-400 font-bold">লেভেল ২ আনলক বাকি</span>
          </div>

          <div className="p-3 rounded-xl bg-[#1e2436] flex items-center justify-between text-slate-200">
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>{language === 'bn' ? 'বেটিং রেকর্ড' : 'Betting History'}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </div>

          <div className="p-3 rounded-xl bg-[#1e2436] flex items-center justify-between text-slate-200">
            <div className="flex items-center gap-3">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>{language === 'bn' ? 'লেনদেনের বিবরণ' : 'Transaction Records'}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </div>

          <div className="p-3 rounded-xl bg-[#1e2436] flex items-center justify-between text-slate-200">
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-purple-400" />
              <span>{language === 'bn' ? 'নিরাপত্তা কেন্দ্র' : 'Security Settings'}</span>
            </div>
            <span className="text-emerald-400 font-semibold">সুরক্ষিত</span>
          </div>
        </div>

        {/* Support CTA */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => { onOpenSupport(); onClose(); }}
            className="w-full py-2.5 rounded-xl bg-[#1e2436] hover:bg-[#252c42] border border-slate-700 text-slate-200 text-xs font-bold transition flex items-center justify-center gap-2"
          >
            <span>🎧</span>
            <span>{language === 'bn' ? 'গ্রাহক সেবার সাথে কথা বলুন' : 'Contact 24/7 Support'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
