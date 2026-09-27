import React from 'react';
import { ShieldCheck, Lock, Award, HeartHandshake } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { Language } from '../types';

interface FooterProps {
  language: Language;
  onOpenSupport?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onOpenSupport }) => {
  return (
    <footer id="app-main-footer" className="mt-6 mb-28 px-3 sm:px-6 md:px-8 py-6 sm:py-8 rounded-2xl bg-[#0e121c] border border-slate-800/80 text-slate-400 text-xs">
      {/* Brand & Mission Statement */}
      <div className="flex flex-col items-center text-center pb-5 border-b border-slate-800/60">
        <BrandLogo size="lg" showSubtitle={true} />
        <p className="mt-2.5 max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-400">
          {language === 'bn'
            ? 'BDLiveBet.vip — বাংলাদেশের সেরা ও সবচেয়ে বিশ্বস্ত অনলাইন লাইভ ক্যাসিনো, স্লটস এবং স্পোর্টস প্ল্যাটফর্ম। নিশ্চিত ও দ্রুত ৩ মিনিটে পেআউট।'
            : 'BDLiveBet.vip — Bangladesh’s leading premier live casino, slots & sports betting entertainment destination. Guaranteed 3-minute instant payouts.'}
        </p>
      </div>

      {/* Trust & Security Badges Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-5 text-xs">
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <div className="font-bold text-slate-200">256-Bit SSL</div>
            <div className="text-xs text-slate-400 font-medium">Bank-Grade Security</div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <Award className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <div className="font-bold text-slate-200">Official License</div>
            <div className="text-xs text-slate-400 font-medium">Curacao eGaming 1668</div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <Lock className="w-5 h-5 text-cyan-400 shrink-0" />
          <div>
            <div className="font-bold text-slate-200">RNG Certified</div>
            <div className="text-xs text-slate-400 font-medium">100% Fair Play</div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="w-6 h-6 rounded-full border border-rose-500 text-rose-400 flex items-center justify-center font-bold text-xs shrink-0">
            18+
          </div>
          <div>
            <div className="font-bold text-slate-200">Responsible Gaming</div>
            <div className="text-xs text-slate-400 font-medium">Adults Only 18+</div>
          </div>
        </div>
      </div>

      {/* Payment Partners Bar */}
      <div className="pb-4 pt-1 border-b border-slate-800/60">
        <div className="text-xs uppercase font-bold text-slate-400 text-center tracking-wider mb-2.5">
          {language === 'bn' ? 'সমর্থিত পেমেন্ট মেথডসমূহ' : 'Supported Payment Methods'}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold">
          <span className="px-3 py-1.5 rounded-lg bg-pink-950/60 border border-pink-500/30 text-pink-300">
            bKash
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-amber-950/60 border border-amber-500/30 text-amber-300">
            Nagad
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-purple-950/60 border border-purple-500/30 text-purple-300">
            Rocket
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-blue-950/60 border border-blue-500/30 text-blue-300">
            Upay
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
            USDT (TRC20)
          </span>
        </div>
      </div>

      {/* Legal & Copyright */}
      <div className="pt-4 text-center space-y-1 text-xs text-slate-400">
        <p>© 2026 BDLiveBet.vip. All Rights Reserved.</p>
        <p className="text-xs text-slate-500 font-medium">
          BDLiveBet.vip is operating under international gaming license verification. Play responsibly.
        </p>
      </div>
    </footer>
  );
};
