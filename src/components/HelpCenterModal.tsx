import React from 'react';
import { X, HelpCircle, ChevronRight, ShieldCheck, CreditCard, Award, Phone } from 'lucide-react';
import { Language } from '../types';

interface HelpCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onOpenSupport: () => void;
}

export const HelpCenterModal: React.FC<HelpCenterModalProps> = ({
  isOpen,
  onClose,
  language,
  onOpenSupport
}) => {
  if (!isOpen) return null;

  const faqs = [
    {
      qBn: 'কীভাবে ডিপোজিট করব?',
      qEn: 'How to make a deposit?',
      aBn: 'ডিপোজিট বাটনে ক্লিক করে bKash, Nagad বা Rocket নির্বাচন করুন এবং নির্দেশিত নম্বরে ক্যাশআউট করুন।',
      aEn: 'Click Deposit, select bKash, Nagad or Rocket, and cash out to the specified agent number.'
    },
    {
      qBn: 'উত্তোলনের সময় কত লাগে?',
      qEn: 'How long does withdrawal take?',
      aBn: 'সাধারণত ৫ থেকে ১৫ মিনিটের মধ্যে উত্তোলিত অর্থ আপনার ব্যক্তিগত মোবাইল ওয়ালেটে পৌঁছে যায়।',
      aEn: 'Withdrawals are typically processed and credited within 5 to 15 minutes.'
    },
    {
      qBn: 'নতুন সদস্য বোনাস কীভাবে দাবি করব?',
      qEn: 'How to claim New Member Bonus?',
      aBn: 'প্রথমবার ন্যূনতম ৫০০ টাকা ডিপোজিট করলে স্বয়ংক্রিয়ভাবে ১২৮% ওয়েলকাম বোনাস আপনার অ্যাকাউন্টে যোগ হবে।',
      aEn: 'Deposit a minimum of 500 BDT for the first time to automatically receive a 128% bonus.'
    },
    {
      qBn: 'আমার অ্যাকাউন্ট কি সুরক্ষিত?',
      qEn: 'Is my account secure?',
      aBn: 'হ্যাঁ, BDLiveBet.vip উচ্চমানের এনক্রিপশন এবং নিরাপদ পেমেন্ট গেটওয়ে ব্যবহার করে।',
      aEn: 'Yes, BDLiveBet.vip employs high-grade encryption and secure verified payment channels.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-[#161b2a] border border-amber-500/40 rounded-2xl p-4 sm:p-5 shadow-2xl z-10 max-h-[92vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-100">
              {language === 'bn' ? 'সহায়তা কেন্দ্র (FAQ)' : 'Help Center & FAQ'}
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

        {/* FAQ list */}
        <div className="mt-4 space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="p-3 rounded-xl bg-[#1e2436] border border-slate-700/60 space-y-1">
              <h4 className="text-sm font-bold text-amber-300">
                {language === 'bn' ? faq.qBn : faq.qEn}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {language === 'bn' ? faq.aBn : faq.aEn}
              </p>
            </div>
          ))}
        </div>

        {/* 24/7 Support CTA */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenSupport();
            }}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-bold text-xs shadow-lg hover:brightness-105 transition flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" />
            <span>{language === 'bn' ? '২৪/৭ লাইভ চ্যাটে যোগাযোগ করুন' : 'Chat with 24/7 Support'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
