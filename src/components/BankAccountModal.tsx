import React, { useState } from 'react';
import { X, ShieldCheck, Check, Plus, Landmark, Star, Trash2 } from 'lucide-react';
import { Language, WalletAccount } from '../types';

interface BankAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  wallets: WalletAccount[];
  onUpdateWallets: (wallets: WalletAccount[]) => void;
  onAddWallet: (wallet: WalletAccount) => void;
}

export const BankAccountModal: React.FC<BankAccountModalProps> = ({
  isOpen,
  onClose,
  language,
  wallets,
  onUpdateWallets,
  onAddWallet
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [walletType, setWalletType] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Upay'>('Nagad');
  const [walletNumber, setWalletNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('Shamim Ahmed');
  const [toast, setToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const showLocalToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletNumber || walletNumber.length < 11) {
      showLocalToast(language === 'bn' ? 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন' : 'Enter valid 11-digit number');
      return;
    }

    const masked = walletNumber.slice(0, 3) + '****' + walletNumber.slice(-4);
    const isFirst = wallets.length === 0;
    const newWallet: WalletAccount = {
      id: `w-${Date.now()}`,
      type: walletType,
      number: masked,
      holder: accountHolder.trim() || 'Shamim Ahmed',
      isDefault: isFirst
    };

    onAddWallet(newWallet);
    setIsAdding(false);
    setWalletNumber('');
    showLocalToast(language === 'bn' ? 'অ্যাকাউন্ট সফলভাবে যুক্ত হয়েছে!' : 'Account linked successfully!');
  };

  const handleSetDefault = (walletId: string) => {
    const updated = wallets.map((w) => ({
      ...w,
      isDefault: w.id === walletId
    }));
    onUpdateWallets(updated);
    showLocalToast(language === 'bn' ? 'ডিফল্ট ওয়ালেট সেট করা হয়েছে' : 'Default wallet updated');
  };

  const handleDeleteWallet = (walletId: string) => {
    if (wallets.length <= 1) {
      showLocalToast(language === 'bn' ? 'কমপক্ষে একটি ওয়ালেট থাকতে হবে' : 'At least one wallet required');
      return;
    }
    const filtered = wallets.filter((w) => w.id !== walletId);
    if (!filtered.some((w) => w.isDefault) && filtered.length > 0) {
      filtered[0].isDefault = true;
    }
    onUpdateWallets(filtered);
    showLocalToast(language === 'bn' ? 'ওয়ালেট মুছে ফেলা হয়েছে' : 'Wallet removed');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-[#161b2a] border border-amber-500/40 rounded-2xl p-4 sm:p-5 shadow-2xl z-10 max-h-[92vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold">
              <Landmark className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-100">
              {language === 'bn' ? 'ব্যাংক ও ওয়ালেট অ্যাকাউন্ট' : 'Bank & Wallet Accounts'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast */}
        {toast && (
          <div className="my-2 p-2 rounded-lg bg-amber-400/20 border border-amber-400/50 text-amber-300 text-xs font-semibold text-center">
            {toast}
          </div>
        )}

        {/* Existing Accounts List */}
        <div className="mt-4 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1">
            <span>{language === 'bn' ? 'সংযুক্ত ওয়ালেটসমূহ' : 'Linked Wallets'}</span>
            <span>{wallets.length} / 5</span>
          </div>

          {wallets.map((acc) => (
            <div
              key={acc.id}
              className={`p-3 rounded-xl border flex items-center justify-between shadow-sm transition ${
                acc.isDefault
                  ? 'bg-[#1f283d] border-amber-500/60 ring-1 ring-amber-500/30'
                  : 'bg-[#1e2436] border-slate-700/60 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs shadow-inner ${
                    acc.type === 'bKash'
                      ? 'bg-gradient-to-tr from-pink-600 to-rose-500 text-white'
                      : acc.type === 'Nagad'
                      ? 'bg-gradient-to-tr from-orange-600 to-amber-500 text-white'
                      : acc.type === 'Rocket'
                      ? 'bg-gradient-to-tr from-purple-600 to-indigo-500 text-white'
                      : 'bg-gradient-to-tr from-cyan-600 to-blue-500 text-white'
                  }`}
                >
                  {acc.type}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-white font-mono">{acc.number}</span>
                    {acc.isDefault ? (
                      <span className="text-xs px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40 font-semibold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {language === 'bn' ? 'ডিফল্ট' : 'Default'}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetDefault(acc.id)}
                        className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 hover:text-amber-300 hover:bg-slate-700 border border-slate-700 transition font-medium"
                      >
                        {language === 'bn' ? 'ডিফল্ট করুন' : 'Set Default'}
                      </button>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 font-medium">{acc.holder}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                {wallets.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteWallet(acc.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 transition"
                    title={language === 'bn' ? 'মুছে ফেলুন' : 'Delete'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add Account Toggle or Form */}
        {!isAdding ? (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="w-full mt-4 py-2.5 rounded-xl border-2 border-dashed border-amber-500/50 hover:border-amber-400 text-amber-300 hover:text-amber-200 text-xs font-bold flex items-center justify-center gap-2 transition active:scale-[0.99]"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'bn' ? 'নতুন ওয়ালেট অ্যাকাউন্ট সংযুক্ত করুন' : 'Add New Wallet Account'}</span>
          </button>
        ) : (
          <form onSubmit={handleAddAccount} className="mt-4 p-3 rounded-xl bg-[#1e2436] border border-amber-500/40 space-y-3 animate-in fade-in duration-150">
            <div className="text-xs font-bold text-amber-300">
              {language === 'bn' ? 'নতুন অ্যাকাউন্ট তথ্য' : 'New Account Information'}
            </div>

            {/* Wallet Type Selection */}
            <div className="grid grid-cols-4 gap-1.5">
              {(['Nagad', 'bKash', 'Rocket', 'Upay'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setWalletType(type)}
                  className={`py-1.5 rounded-lg text-xs font-bold transition border ${
                    walletType === type
                      ? 'bg-amber-400 text-slate-950 border-amber-400'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Holder Name */}
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">
                {language === 'bn' ? 'অ্যাকাউন্ট হোল্ডার নাম' : 'Account Holder Name'}
              </label>
              <input
                type="text"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            {/* Wallet Phone Number */}
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">
                {language === 'bn' ? 'মোবাইল ওয়ালেট নম্বর' : 'Mobile Wallet Number'}
              </label>
              <input
                type="tel"
                value={walletNumber}
                onChange={(e) => setWalletNumber(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                className="flex-1 py-2 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs shadow hover:bg-amber-300 transition"
              >
                {language === 'bn' ? 'সংরক্ষণ করুন' : 'Save & Bind'}
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="py-2 px-3 rounded-lg bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition"
              >
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
