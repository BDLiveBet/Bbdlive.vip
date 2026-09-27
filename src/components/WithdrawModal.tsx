import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, Wallet, Plus, Check, AlertCircle } from 'lucide-react';
import { Language, WalletAccount } from '../types';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  walletBalance: number;
  savedWallets: WalletAccount[];
  onAddWallet: (wallet: WalletAccount) => void;
  onConfirmWithdraw: (amount: number) => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  language,
  walletBalance,
  savedWallets,
  onAddWallet,
  onConfirmWithdraw
}) => {
  // Determine default selected wallet (default wallet or first available wallet)
  const defaultWalletId =
    savedWallets.find((w) => w.isDefault)?.id ||
    (savedWallets.length > 0 ? savedWallets[0].id : '');

  const [selectedWalletId, setSelectedWalletId] = useState<string>(defaultWalletId);
  const [isAddingNewWallet, setIsAddingNewWallet] = useState<boolean>(false);
  const [newWalletMethod, setNewWalletMethod] = useState<string>('Nagad');
  const [newWalletNumber, setNewWalletNumber] = useState<string>('');
  const [newWalletHolder, setNewWalletHolder] = useState<string>('Shamim Ahmed');

  // Balance-aware initial amount: do NOT pre-select an amount (like ৳500) exceeding available balance!
  const getInitialAmount = () => {
    if (walletBalance >= 500) return 500;
    if (walletBalance >= 100) return 100;
    return 0;
  };

  const getWalletIcon = (type: string) => {
    switch (type) {
      case 'bKash':
        return (
          <svg className="w-6 h-6 object-contain inline-block mr-2 shrink-0" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="50" fill="#E2136E"/>
            <polygon points="48,22 34,60 48,50" fill="#F495BB"/>
            <polygon points="48,22 48,50 63,40" fill="#FFFFFF"/>
            <polygon points="34,60 48,50 48,74" fill="#C91060"/>
            <polygon points="48,50 63,40 48,74" fill="#EFAFC8"/>
            <polygon points="22,42 34,60 48,50" fill="#C91060"/>
            <polygon points="78,42 63,40 48,50" fill="#F495BB"/>
          </svg>
        );
      case 'Nagad':
        return (
          <svg className="w-6 h-6 object-contain inline-block mr-2 shrink-0" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="nagadGradW" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ED1C24" />
                <stop offset="100%" stopColor="#F7941D" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="50" fill="url(#nagadGradW)"/>
            <path d="M50 20c-15 15-20 25-20 40 0 11 9 20 20 20s20-9 20-20c0-15-5-25-20-40z" fill="#fff"/>
            <circle cx="50" cy="65" r="8" fill="url(#nagadGradW)"/>
          </svg>
        );
      case 'Rocket':
        return (
          <svg className="w-6 h-6 object-contain inline-block mr-2 shrink-0" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="50" fill="#8C3494"/>
            <path d="M25 50l45-25-20 45-8-12-17-8z" fill="#fff"/>
            <path d="M70 25L42 50v15l8-7 20-33z" fill="#D1A3D6"/>
          </svg>
        );
      case 'Upay':
        return (
          <svg className="w-6 h-6 object-contain inline-block mr-2 shrink-0" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="20" fill="#005696" />
            <path d="M30 30v25c0 11 9 20 20 20s20-9 20-20V30h-12v25c0 4.4-3.6 8-8 8s-8-3.6-8-8V30H30z" fill="#FFD100"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const [amount, setAmount] = useState<number>(getInitialAmount);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Sync selected wallet if savedWallets change or if none was selected
  useEffect(() => {
    if (!savedWallets.some((w) => w.id === selectedWalletId)) {
      if (savedWallets.length > 0) {
        const def = savedWallets.find((w) => w.isDefault) || savedWallets[0];
        setSelectedWalletId(def.id);
      } else {
        setSelectedWalletId('');
      }
    }
  }, [savedWallets, selectedWalletId]);

  // Adjust amount when modal opens or balance updates
  useEffect(() => {
    if (isOpen) {
      if (walletBalance < 100) {
        setAmount(0);
        setCustomAmount('');
      } else if (amount > walletBalance) {
        setAmount(100);
        setCustomAmount('');
      }
    }
  }, [isOpen, walletBalance]);

  if (!isOpen) return null;

  const presetAmounts = [100, 500, 1000, 5000, 10000, 20000];
  const selectedWallet =
    savedWallets.find((w) => w.id === selectedWalletId) ||
    savedWallets.find((w) => w.isDefault) ||
    savedWallets[0];

  const handleSelectAmount = (val: number) => {
    setAmount(val);
    setCustomAmount('');
    if (val > walletBalance) {
      setError(
        language === 'bn'
          ? 'পর্যাপ্ত ব্যালেন্স নেই (Insufficient Balance)'
          : 'Insufficient Balance'
      );
    } else {
      setError(null);
    }
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomAmount(val);
    const num = Number(val);
    if (val && !isNaN(num)) {
      setAmount(num);
      if (num > walletBalance) {
        setError(
          language === 'bn'
            ? 'পর্যাপ্ত ব্যালেন্স নেই (Insufficient Balance)'
            : 'Insufficient Balance'
        );
      } else if (num < 100) {
        setError(
          language === 'bn'
            ? 'ন্যূনতম উত্তোলনের পরিমাণ ৳১০০'
            : 'Minimum withdrawal amount is ৳100'
        );
      } else {
        setError(null);
      }
    } else {
      setAmount(0);
      setError(null);
    }
  };

  const handleSelectWallet = (w: WalletAccount) => {
    setSelectedWalletId(w.id);
  };

  const handleAddNewWallet = () => {
    if (newWalletNumber.trim().length >= 11) {
      const masked = newWalletNumber.slice(0, 3) + '****' + newWalletNumber.slice(-4);
      const newId = `w-${Date.now()}`;
      const newEntry: WalletAccount = {
        id: newId,
        type: newWalletMethod,
        number: masked,
        holder: newWalletHolder.trim() || 'Shamim Ahmed',
        isDefault: savedWallets.length === 0
      };
      onAddWallet(newEntry);
      setSelectedWalletId(newId);
      setIsAddingNewWallet(false);
      setNewWalletNumber('');
    }
  };

  const isExceedingBalance = amount > walletBalance;
  const isBelowMin = amount > 0 && amount < 100;
  const isFormValid =
    !!selectedWallet &&
    amount >= 100 &&
    amount <= walletBalance &&
    !isExceedingBalance;

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWallet) {
      setError(language === 'bn' ? 'অনুগ্রহ করে একটি ওয়ালেট নির্বাচন করুন।' : 'Please select a payout wallet.');
      return;
    }
    if (amount <= 0 || isBelowMin) {
      setError(language === 'bn' ? 'ন্যূনতম উত্তোলনের পরিমাণ ৳১০০।' : 'Minimum withdrawal amount is ৳100.');
      return;
    }
    if (amount > walletBalance) {
      setError(language === 'bn' ? 'পর্যাপ্ত ব্যালেন্স নেই (Insufficient Balance)' : 'Insufficient Balance');
      return;
    }

    onConfirmWithdraw(amount);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm">
      <div
        id="withdraw-modal"
        data-edge="emerald"
        data-action="withdraw"
        className="relative w-full max-w-md bg-[#FFFFFF] rounded-2xl shadow-2xl overflow-hidden text-[#333333] font-sans max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Top Navigation Header: Dark Black/Gray */}
        <div className="relative bg-[#1C1C1C] text-[#FFFFFF] py-3.5 px-4 text-center text-base sm:text-lg font-bold select-none">
          <span>{language === 'bn' ? 'ব্যালেন্স উত্তোলন' : 'Withdrawal Request'}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-5 bg-[#FFFFFF]">
          {isSuccess ? (
            <div className="py-12 px-6 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">
                {language === 'bn' ? 'উত্তোলন অনুরোধ সফল!' : 'Withdrawal Submitted!'}
              </h4>
              <p className="text-sm text-slate-600">
                {language === 'bn'
                  ? `৳${amount.toLocaleString()} আপনার ${selectedWallet?.type} (${selectedWallet?.number}) অ্যাকাউন্টে ৫-১০ মিনিটের মধ্যে পৌঁছে যাবে।`
                  : `৳${amount.toLocaleString()} will be credited to your ${selectedWallet?.type} (${selectedWallet?.number}) account within 5-10 minutes.`}
              </p>
            </div>
          ) : (
            <form onSubmit={handleWithdrawSubmit} className="space-y-3 pt-3">
              {/* Compact Top "সংযুক্ত নিরাপদ ই-ওয়ালেট" Header Card that dynamically reflects the clicked wallet */}
              <div
                id="bound-wallet-card"
                className="rounded-xl p-3 sm:p-3.5 text-white shadow-md relative overflow-hidden mx-4 border border-indigo-400/20"
                style={{
                  background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #0f766e 100%)'
                }}
              >
                <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-cyan-400/10 blur-lg pointer-events-none" />

                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-cyan-300" />
                    <span className="font-bold text-xs tracking-wide text-cyan-100">
                      {language === 'bn' ? 'সংযুক্ত নিরাপদ ই-ওয়ালেট' : 'Bound Security E-Wallet'}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-sm text-emerald-300 border border-emerald-400/20">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'যাচাইকৃত' : 'Verified'}</span>
                  </span>
                </div>

                {/* Dynamic Selected Wallet Details + Withdrawable Balance */}
                <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between relative z-10">
                  <div>
                    <div className="text-xs text-slate-300 font-medium">
                      {language === 'bn' ? 'উত্তোলনযোগ্য ব্যালেন্স:' : 'Withdrawable Balance:'}
                    </div>
                    <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-amber-300 drop-shadow-sm">
                      ৳ {walletBalance.toFixed(2)}
                    </div>
                  </div>

                  {selectedWallet && (
                    <div className="text-right">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold text-white bg-white/10">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            selectedWallet.type === 'bKash'
                              ? 'bg-pink-400'
                              : selectedWallet.type === 'Nagad'
                              ? 'bg-orange-400'
                              : 'bg-purple-400'
                          }`}
                        />
                        <span>{selectedWallet.type}</span>
                      </div>
                      <div className="font-mono text-xs font-bold text-cyan-100 tracking-wider mt-0.5">
                        {selectedWallet.number}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Insufficient Balance / Minimum Balance Alert */}
              {walletBalance < 100 && (
                <div className="mx-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-semibold text-amber-800">
                  <AlertCircle className="shrink-0 text-amber-600" size={16} />
                  <span>
                    {language === 'bn'
                      ? `পর্যাপ্ত ব্যালেন্স নেই - ন্যূনতম উত্তোলন ৳১০০ (বর্তমান: ৳${walletBalance.toFixed(2)})`
                      : `Insufficient Balance - Min withdrawal ৳100 (Current: ৳${walletBalance.toFixed(2)})`}
                  </span>
                </div>
              )}

              {/* Error Message if any */}
              {error && walletBalance >= 100 && (
                <div className="mx-4 flex animate-in fade-in items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-600 duration-150">
                  <AlertCircle className="shrink-0 text-red-600" size={16} />
                  <span>{error}</span>
                </div>
              )}

              {/* Bound Wallets Section: Synced with Bank & Wallet accounts */}
              <div className="px-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center text-xs font-bold text-[#1E293B]">
                    <span className="text-[#F59E0B] text-base mr-1 leading-none">•</span>
                    <span>{language === 'bn' ? 'উত্তোলন ওয়ালেট নির্বাচন করুন:' : 'Select Payout Wallet:'}</span>
                  </div>
                  {/* Clean single plus button: "+ নতুন ওয়ালেট" (Fixes duplicate "+ +") */}
                  <button
                    type="button"
                    onClick={() => setIsAddingNewWallet(!isAddingNewWallet)}
                    className="text-xs font-bold text-[#E11D48] hover:underline flex items-center gap-1 py-1 px-2.5 rounded-lg hover:bg-rose-50 transition border border-rose-200/50"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'নতুন ওয়ালেট' : 'Add New Wallet'}</span>
                  </button>
                </div>

                {/* Wallets Grid from actual synchronized saved accounts */}
                <div className="grid grid-cols-2 gap-2">
                  {savedWallets.map((w) => {
                    const isSelected = selectedWallet?.id === w.id;
                    return (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() => handleSelectWallet(w)}
                        className={`p-2.5 rounded-xl border text-left transition-all relative select-none ${
                          isSelected
                            ? 'border-2 border-amber-500/80 bg-amber-50/40 text-slate-800 shadow-sm'
                            : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-sm">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          {getWalletIcon(w.type)}
                          <span className="font-bold text-xs sm:text-sm">{w.type}</span>
                          {w.isDefault && (
                            <span className="text-xs px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded font-semibold">
                              {language === 'bn' ? 'ডিফল্ট' : 'Default'}
                            </span>
                          )}
                        </div>
                        <span className="block font-mono text-xs text-slate-700 mt-1 font-semibold">
                          {w.number}
                        </span>
                        <span className="block text-xs text-slate-400 truncate mt-0.5">
                          {w.holder}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Add New Wallet Inline Expander */}
                {isAddingNewWallet && (
                  <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 animate-in fade-in duration-150">
                    <span className="text-xs font-bold text-slate-800 block">
                      {language === 'bn' ? 'নতুন ওয়ালেট অ্যাকাউন্ট যুক্ত করুন:' : 'Bind New Payout Account:'}
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center rounded-lg border border-slate-200 bg-white px-2 focus-within:border-amber-500">
                        {getWalletIcon(newWalletMethod)}
                        <select
                          value={newWalletMethod}
                          onChange={(e) => setNewWalletMethod(e.target.value)}
                          className="w-full bg-transparent py-2 text-sm text-slate-800 outline-none"
                        >
                          <option value="Nagad">Nagad (নগদ)</option>
                          <option value="bKash">bKash (বিকাশ)</option>
                          <option value="Rocket">Rocket (রকেট)</option>
                          <option value="Upay">Upay (উপায়)</option>
                        </select>
                      </div>
                      <input
                        type="text"
                        value={newWalletHolder}
                        onChange={(e) => setNewWalletHolder(e.target.value)}
                        placeholder={language === 'bn' ? 'হোল্ডারের নাম' : 'Account Holder'}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-amber-500"
                      />
                    </div>
                    <input
                      type="tel"
                      value={newWalletNumber}
                      onChange={(e) => setNewWalletNumber(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-mono text-slate-800 outline-none focus:border-amber-500"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleAddNewWallet}
                        disabled={newWalletNumber.trim().length < 11}
                        className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
                      >
                        {language === 'bn' ? 'যুক্ত ও নির্বাচন করুন' : 'Bind & Select Wallet'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingNewWallet(false)}
                        className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                      >
                        {language === 'bn' ? 'বাতিল' : 'Cancel'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Preset Amounts with Balance Validation */}
              <div className="px-4">
                <div className="flex items-center justify-between text-xs font-bold text-[#1E293B] mb-2">
                  <div className="flex items-center">
                    <span className="text-[#F59E0B] text-base mr-1 leading-none">•</span>
                    <span>{language === 'bn' ? 'উত্তোলনের পরিমাণ (Preset Amounts)' : 'Withdraw Amounts'}</span>
                  </div>
                  {walletBalance > 0 && (
                    <span className="text-xs text-slate-500 font-medium">
                      {language === 'bn' ? `সর্বোচ্চ ৳${Math.floor(walletBalance).toLocaleString()}` : `Max ৳${Math.floor(walletBalance).toLocaleString()}`}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {presetAmounts.map((val) => {
                    const isActive = amount === val && !customAmount;
                    const exceeds = val > walletBalance;

                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleSelectAmount(val)}
                        className={`relative cursor-pointer select-none rounded-xl px-2 py-2.5 text-center text-xs font-bold transition-all sm:text-sm ${
                          isActive
                            ? 'bg-slate-900 text-amber-400 shadow-sm'
                            : exceeds
                            ? 'cursor-not-allowed border border-slate-200 bg-slate-50 text-slate-400 opacity-50'
                            : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                        }`}
                        title={
                          exceeds
                            ? language === 'bn'
                              ? 'পর্যাপ্ত ব্যালেন্স নেই'
                              : 'Insufficient Balance'
                            : undefined
                        }
                      >
                        ৳{val.toLocaleString()}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Amount Input Box with Active Highlight State */}
                <div
                  className={`mt-2.5 flex items-center rounded-xl border bg-white px-3.5 py-2.5 transition-all ${
                    customAmount
                      ? isExceedingBalance
                        ? 'border-red-400'
                        : 'border-amber-500'
                      : 'border-slate-200 focus-within:border-amber-500'
                  }`}
                >
                  <span
                    className={`mr-2 text-sm font-bold ${
                      customAmount
                        ? isExceedingBalance
                          ? 'text-red-600'
                          : 'text-amber-500'
                        : 'text-slate-400'
                    }`}
                  >
                    ৳
                  </span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    placeholder={
                      language === 'bn'
                        ? 'অন্য পরিমাণ লিখুন (ন্যূনতম ১০০)'
                        : 'Custom amount (Min 100)'
                    }
                    className="w-full bg-transparent text-sm text-slate-900 outline-none font-bold placeholder:text-slate-400"
                    min="100"
                  />
                  {customAmount && (
                    <button
                      type="button"
                      onClick={() => {
                        setCustomAmount('');
                        setAmount(walletBalance >= 100 ? 100 : 0);
                        setError(null);
                      }}
                      className="text-xs font-semibold text-slate-400 hover:text-slate-600 px-1"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Informative Security Guarantee */}
              <div className="mx-4 rounded-xl border border-slate-200/70 bg-slate-50 p-2.5 text-xs font-medium leading-relaxed text-slate-600 sm:text-sm">
                {language === 'bn'
                  ? 'উত্তোলনের অনুরোধ ৩-১০ মিনিটের মধ্যে স্বয়ংক্রিয়ভাবে প্রসেস হবে।'
                  : 'Withdrawal requests are processed securely within 3-10 minutes.'}
              </div>

              {/* Primary Action Button */}
              <div className="px-4 pt-1">
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`w-full rounded-xl py-3 text-center text-sm font-bold text-white shadow-sm transition-all duration-150 ${
                    isFormValid
                      ? 'cursor-pointer bg-amber-500 hover:bg-amber-600 active:scale-95 active:translate-y-0.5'
                      : 'cursor-not-allowed bg-slate-300 text-slate-500'
                  }`}
                >
                  {isExceedingBalance
                    ? language === 'bn'
                      ? 'পর্যাপ্ত ব্যালেন্স নেই (Insufficient Balance)'
                      : 'Insufficient Balance'
                    : isBelowMin || walletBalance < 100
                    ? language === 'bn'
                      ? 'ন্যূনতম উত্তোলন ৳১০০ প্রয়োজন'
                      : 'Minimum Withdrawal ৳100 Required'
                    : language === 'bn'
                    ? 'উত্তোলন নিশ্চিত করুন'
                    : 'Confirm Withdrawal'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
