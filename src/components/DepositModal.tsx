import React, { useState, useRef } from 'react';
import { X, CheckCircle2, UploadCloud, Trash2, Image as ImageIcon } from 'lucide-react';
import { Language } from '../types';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onConfirmDeposit: (amount: number) => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  language,
  onConfirmDeposit
}) => {
  const [method, setMethod] = useState<string>('bKash');
  const [channel, setChannel] = useState<string>('Auto Payment');
  const [amount, setAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [phone, setPhone] = useState<string>('017XXXXXXXX');
  const [trxId, setTrxId] = useState<string>('');
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [bonusSelected, setBonusSelected] = useState<boolean>(true);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [step, setStep] = useState<'select' | 'confirm'>('select');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Streamlined payment gateways (bKash and NAGAD combined with auto/cashout options)
  const depositMethods = [
    {
      id: 'bKash',
      label: 'bKash',
      icon: (
        <svg className="w-9 h-9 object-contain mx-auto mb-1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="50" fill="#E2136E"/>
          <polygon points="48,22 34,60 48,50" fill="#F495BB"/>
          <polygon points="48,22 48,50 63,40" fill="#FFFFFF"/>
          <polygon points="34,60 48,50 48,74" fill="#C91060"/>
          <polygon points="48,50 63,40 48,74" fill="#EFAFC8"/>
          <polygon points="22,42 34,60 48,50" fill="#C91060"/>
          <polygon points="78,42 63,40 48,50" fill="#F495BB"/>
        </svg>
      ),
      badge: 'বিকাশ'
    },
    {
      id: 'NAGAD',
      label: 'NAGAD',
      icon: (
        <svg className="w-9 h-9 object-contain mx-auto mb-1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="nagadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ED1C24" />
              <stop offset="100%" stopColor="#F7941D" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="50" fill="url(#nagadGrad)"/>
          <path d="M50 20c-15 15-20 25-20 40 0 11 9 20 20 20s20-9 20-20c0-15-5-25-20-40z" fill="#fff"/>
          <circle cx="50" cy="65" r="8" fill="url(#nagadGrad)"/>
        </svg>
      ),
      badge: 'নগদ'
    },
    {
      id: 'Rocket',
      label: 'Rocket',
      icon: (
        <svg className="w-9 h-9 object-contain mx-auto mb-1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="50" fill="#8C3494"/>
          <path d="M25 50l45-25-20 45-8-12-17-8z" fill="#fff"/>
          <path d="M70 25L42 50v15l8-7 20-33z" fill="#D1A3D6"/>
        </svg>
      ),
      badge: 'রকেট'
    },
    {
      id: 'Upay',
      label: 'Upay',
      icon: (
        <svg className="w-9 h-9 object-contain mx-auto mb-1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" rx="20" fill="#005696" />
          <path d="M30 30v25c0 11 9 20 20 20s20-9 20-20V30h-12v25c0 4.4-3.6 8-8 8s-8-3.6-8-8V30H30z" fill="#FFD100"/>
        </svg>
      ),
      badge: 'উপায়'
    }
  ];

  // User-friendly payment channel options replacing developer titles like "Channel 2"
  const paymentChannels = [
    { id: 'Auto Payment', labelBn: 'অটো পেমেন্ট (তাৎক্ষণিক)', labelEn: 'Auto Payment (Instant)' },
    { id: 'Manual Cashout', labelBn: 'ম্যানুয়াল ক্যাশআউট / সেন্ড', labelEn: 'Manual Cashout / Send' },
    { id: 'Super Fast', labelBn: 'সুপার ফাস্ট এজেন্ট (১-৩ মিনিট)', labelEn: 'Super Fast (1-3 min)' }
  ];

  const presetAmounts = [100, 500, 1000, 2000, 5000, 10000];

  const handleSelectAmount = (val: number) => {
    setAmount(val);
    setCustomAmount(val.toString());
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomAmount(val);
    if (val && !isNaN(Number(val))) {
      setAmount(Number(val));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProofImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProofImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNextClick = () => {
    if (step === 'select') {
      setStep('confirm');
    } else {
      const finalAmount = bonusSelected ? Math.round(amount * 2.28) : amount;
      onConfirmDeposit(finalAmount);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setStep('select');
        setProofImage(null);
        setTrxId('');
        onClose();
      }, 2000);
    }
  };

  const isFormValid = amount >= 100 && (step === 'select' || trxId.trim().length >= 4);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm">
      {/* Modal Container: Clean White & Light Gray layout */}
      <div id="deposit-modal" data-edge="emerald" data-action="deposit" className="relative w-full max-w-md bg-[#FFFFFF] rounded-2xl shadow-2xl overflow-hidden text-[#333333] font-sans max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Navigation Header: Dark Gray/Black (#1C1C1C) */}
        <div className="relative bg-[#1C1C1C] text-[#FFFFFF] py-3.5 px-4 text-center text-base sm:text-lg font-bold select-none">
          <span>{language === 'bn' ? 'ডিপোজিট রিচার্জ' : 'Deposit Balance'}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white text-lg flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-6 bg-[#FFFFFF]">
          {isSuccess ? (
            <div className="py-12 px-6 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">
                {language === 'bn' ? 'ডিপোজিট সফল হয়েছে!' : 'Deposit Submitted!'}
              </h4>
              <p className="text-sm text-slate-600">
                {language === 'bn'
                  ? `আপনার ওয়ালেটে ৳${amount} + বোনাস সফলভাবে যুক্ত করা হয়েছে।`
                  : `৳${amount} + bonus has been credited to your wallet.`}
              </p>
            </div>
          ) : step === 'select' ? (
            <div className="space-y-3.5 pt-3">
              {/* 1. Payment Gateways Selection Grid */}
              <div className="px-4">
                <div className="flex items-center text-xs font-bold text-[#1E293B] mb-2">
                  <span className="text-[#F59E0B] text-base mr-1 leading-none">•</span>
                  <span>{language === 'bn' ? 'পেমেন্ট গেটওয়ে নির্বাচন করুন' : 'Select Payment Gateway'}</span>
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                  {depositMethods.map((m) => {
                    const isSelected = method === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setMethod(m.id)}
                        className={`py-2.5 px-1.5 rounded-xl border text-center transition-all duration-150 active:scale-95 active:translate-y-0.5 flex flex-col items-center justify-center gap-1 ${
                          isSelected
                            ? 'border-[#E11D48] bg-rose-50/80 text-[#E11D48] font-black shadow-sm ring-1 ring-[#E11D48]'
                            : 'border-slate-200 bg-[#F8FAFC] text-slate-700 hover:border-slate-300 font-semibold'
                        }`}
                      >
                        {m.icon}
                        <span className="text-xs sm:text-sm font-bold leading-tight">{m.label}</span>
                        <span className="text-xs text-slate-500 font-medium">{m.badge}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Channel Selection */}
              <div className="px-4">
                <div className="flex items-center text-xs font-bold text-[#1E293B] mb-2">
                  <span className="text-[#F59E0B] text-base mr-1 leading-none">•</span>
                  <span>{language === 'bn' ? 'পেমেন্ট চ্যানেল (Payment Channel)' : 'Payment Channel'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {paymentChannels.map((c) => {
                    const isSelected = channel === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setChannel(c.id)}
                        className={`py-2 px-2.5 rounded-xl border text-center transition-all duration-150 active:scale-95 active:translate-y-0.5 flex items-center justify-center ${
                          isSelected
                            ? 'border-[#E11D48] bg-rose-50/80 text-[#E11D48] font-black shadow-sm ring-1 ring-[#E11D48]'
                            : 'border-slate-200 bg-[#F8FAFC] text-slate-700 hover:border-slate-300 font-semibold'
                        }`}
                      >
                        <span className="text-xs">{language === 'bn' ? c.labelBn : c.labelEn}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Preset Amount Chips (100, 500, 1000, 2000, 5000, 10000 BDT) + Custom Amount */}
              <div className="px-4">
                <div className="flex items-center text-xs font-bold text-[#1E293B] mb-2">
                  <span className="text-[#F59E0B] text-base mr-1 leading-none">•</span>
                  <span>{language === 'bn' ? 'ডিপোজিট পরিমাণ (Deposit Amount)' : 'Deposit Amount'}</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {presetAmounts.map((val) => {
                    const isSelected = amount === val;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleSelectAmount(val)}
                        className={`py-3 px-2 rounded-xl border text-center transition-all duration-150 active:scale-95 active:translate-y-0.5 ${
                          isSelected
                            ? 'bg-slate-900 text-amber-400 font-bold border-amber-400/30 shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-700 font-semibold hover:bg-slate-100'
                        }`}
                      >
                        ৳{val.toLocaleString()}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Amount Input Box with Clear Highlight Active State */}
                <div
                  className={`mt-2.5 flex items-center rounded-xl px-3.5 py-2.5 transition-all ${
                    customAmount
                      ? 'border-2 border-amber-400 bg-amber-50/20 shadow-sm ring-2 ring-amber-300/40'
                      : 'border border-slate-300 bg-[#F8FAFC] focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-200'
                  }`}
                >
                  <span className={`font-bold mr-2 text-sm ${customAmount ? 'text-amber-500' : 'text-slate-400'}`}>৳</span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    placeholder={language === 'bn' ? 'জমা দিন' : 'Deposit'}
                    className="w-full bg-transparent text-sm text-slate-900 outline-none font-bold placeholder:text-slate-400"
                    min="100"
                  />
                  {customAmount && (
                    <button
                      type="button"
                      onClick={() => {
                        setCustomAmount('');
                        setAmount(0); // clear amount if custom is cleared
                      }}
                      className="text-xs font-semibold text-slate-400 hover:text-slate-600 px-1"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* 128% Welcome Bonus Checkbox */}
              <div className="px-4">
                <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bonusSelected}
                    onChange={(e) => setBonusSelected(e.target.checked)}
                    className="w-4 h-4 accent-[#E11D48] rounded cursor-pointer"
                  />
                  <div className="text-xs sm:text-sm">
                    <span className="font-bold text-amber-950">
                      {language === 'bn' ? '১২৮% প্রথম ডিপোজিট বোনাস সক্রিয় করুন' : 'Claim 128% First Deposit Bonus'}
                    </span>
                    <span className="block text-xs text-amber-800 font-medium mt-0.5">
                      {language === 'bn'
                        ? `মোট ওয়ালেট জমা: ৳${Math.round(amount * (bonusSelected ? 2.28 : 1))}`
                        : `Total balance credited: ৳${Math.round(amount * (bonusSelected ? 2.28 : 1))}`}
                    </span>
                  </div>
                </label>
              </div>

              {/* Primary Action Button */}
              <div className="px-4 pt-1">
                <button
                  type="button"
                  onClick={handleNextClick}
                  disabled={!isFormValid}
                  className={`w-full py-3.5 text-center rounded-xl text-base font-bold text-white transition-all duration-150 shadow-md ${
                    isFormValid
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-[0.99] cursor-pointer'
                      : 'bg-slate-300 cursor-not-allowed text-slate-500'
                  }`}
                >
                  {language === 'bn' ? 'পরবর্তী ধাপ (Next)' : 'Next Step'}
                </button>
              </div>
            </div>
          ) : (
            /* Step 2: TRX ID & Payment Proof Screenshot Submission */
            <div className="px-4 pt-4 space-y-3.5">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">{language === 'bn' ? 'পেমেন্ট গেটওয়ে:' : 'Gateway:'}</span>
                  <span className="font-bold text-slate-800">{method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{language === 'bn' ? 'চ্যানেল:' : 'Channel:'}</span>
                  <span className="font-bold text-slate-800">{channel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{language === 'bn' ? 'ডিপোজিট পরিমাণ:' : 'Amount:'}</span>
                  <span className="font-bold text-[#E11D48] text-sm">৳{amount}</span>
                </div>
                {bonusSelected && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>{language === 'bn' ? '১২৮% বোনাস সহ মোট জমা:' : 'With 128% Bonus:'}</span>
                    <span>৳{Math.round(amount * 2.28)}</span>
                  </div>
                )}
              </div>

              {/* Red Warning text */}
              <div className="text-[#DC2626] text-xs leading-relaxed p-3 bg-red-50 rounded-xl border border-red-200 font-medium">
                {language === 'bn'
                  ? '⚠️ সতর্কতা: রিচার্জ সম্পন্ন করতে আপনার SMS-এর Transaction ID (TrxID) সঠিকভাবে দিন এবং স্ক্রিনশট আপলোড করুন।'
                  : '⚠️ Notice: You must submit the TrxID and upload payment screenshot for instant credit.'}
              </div>

              {/* Sender Phone */}
              <div>
                <label className="text-xs font-bold text-[#1E293B] block mb-1">
                  {language === 'bn' ? 'আপনার প্রেরক মোবাইল নম্বর:' : 'Sender Mobile Number:'}
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-mono text-slate-800 focus:border-[#E11D48] outline-none"
                  required
                />
              </div>

              {/* Transaction ID (TrxID) */}
              <div>
                <label className="text-xs font-bold text-[#1E293B] block mb-1">
                  {language === 'bn' ? 'ট্রানজ্যাকশন আইডি (TrxID):' : 'Transaction ID (TrxID):'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                  placeholder={language === 'bn' ? 'যেমন: BK9823X99' : 'e.g. 9J23KL44'}
                  className="w-full border-2 border-[#E11D48] rounded-xl p-2.5 text-sm font-mono font-bold text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-rose-200"
                  required
                />
              </div>

              {/* Payment Proof Screenshot Upload (Supports Drag & Drop and manual click) */}
              <div>
                <label className="text-xs font-bold text-[#1E293B] block mb-1">
                  {language === 'bn' ? 'পেমেন্ট স্ক্রিনশট আপলোড করুন:' : 'Upload Payment Screenshot:'}
                </label>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                {proofImage ? (
                  <div className="relative rounded-xl border border-slate-300 p-2 bg-slate-50 flex items-center gap-3">
                    <img src={proofImage} alt="Payment Proof" className="w-14 h-14 object-cover rounded-lg border" />
                    <div className="flex-1 overflow-hidden">
                      <span className="text-xs sm:text-sm font-bold text-slate-800 block truncate">payment_receipt.jpg</span>
                      <span className="text-xs text-emerald-600 font-semibold block">✓ Ready to submit</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setProofImage(null)}
                      className="p-1.5 rounded-full text-rose-500 hover:bg-rose-50 transition"
                      title="Remove image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-[#E11D48] rounded-xl p-4 text-center cursor-pointer transition bg-slate-50 hover:bg-rose-50/40"
                  >
                    <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                    <span className="text-xs sm:text-sm font-bold text-slate-700 block">
                      {language === 'bn' ? 'স্ক্রিনশট ড্র্যাগ করুন অথবা ক্লিক করে আপলোড করুন' : 'Click or Drag & Drop screenshot'}
                    </span>
                    <span className="text-xs text-slate-400 block mt-0.5">PNG, JPG, JPEG (Max 5MB)</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={handleNextClick}
                  disabled={trxId.trim().length < 4}
                  className={`w-full py-3 text-center rounded-xl text-sm font-bold text-white transition-all duration-150 shadow-md ${
                    trxId.trim().length >= 4
                      ? 'btn-tactile-red active:scale-95 active:translate-y-0.5 cursor-pointer'
                      : 'bg-[#CBD5E1] cursor-not-allowed text-slate-500'
                  }`}
                >
                  {language === 'bn' ? 'নিশ্চিত করুন (Confirm & Deposit)' : 'Confirm & Deposit'}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('select')}
                  className="w-full py-2 text-center rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 active:scale-95 active:translate-y-0.5 transition-all duration-150"
                >
                  {language === 'bn' ? '‹ ফিরে যান' : '‹ Back'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
