import React, { useState } from 'react';
import { X, Volume2, VolumeX, Maximize2, Sparkles, RefreshCw, Trophy } from 'lucide-react';
import { GameItem, Language } from '../types';

interface GameModalProps {
  game: GameItem | null;
  onClose: () => void;
  language: Language;
  walletBalance: number;
  onUpdateBalance: (newBalance: number) => void;
}

export const GameModal: React.FC<GameModalProps> = ({
  game,
  onClose,
  language,
  walletBalance,
  onUpdateBalance
}) => {
  if (!game) return null;

  const [betAmount, setBetAmount] = useState<number>(10);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [reels, setReels] = useState<string[]>(['💎', '7️⃣', '👑']);
  const [winMessage, setWinMessage] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const symbols = ['👑', '💎', '7️⃣', '⚡', '🍒', '🔔', '🪙'];

  const handleSpin = () => {
    if (isSpinning) return;
    if (walletBalance < betAmount) {
      setWinMessage(language === 'bn' ? 'অপর্যাপ্ত ব্যালেন্স! দয়া করে ডিপোজিট করুন।' : 'Insufficient balance! Please deposit.');
      return;
    }

    // Deduct bet
    onUpdateBalance(walletBalance - betAmount);
    setIsSpinning(true);
    setWinMessage(null);

    // Spin animation simulation
    let counter = 0;
    const interval = setInterval(() => {
      setReels([
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
      ]);
      counter++;

      if (counter > 10) {
        clearInterval(interval);
        setIsSpinning(false);

        // Win evaluation
        const finalReels = [
          symbols[Math.floor(Math.random() * symbols.length)],
          symbols[Math.floor(Math.random() * symbols.length)],
          symbols[Math.floor(Math.random() * symbols.length)]
        ];

        // 50% chance of matching 2 or 3 symbols
        if (Math.random() > 0.4) {
          finalReels[1] = finalReels[0];
          if (Math.random() > 0.5) {
            finalReels[2] = finalReels[0];
          }
        }

        setReels(finalReels);

        if (finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2]) {
          const payout = betAmount * 15;
          onUpdateBalance(walletBalance - betAmount + payout);
          setWinMessage(
            language === 'bn' ? `🎉 মেগা বিগ উইন! আপনি জিতেছেন ৳${payout}!` : `🎉 MEGA BIG WIN! You won ৳${payout}!`
          );
        } else if (finalReels[0] === finalReels[1] || finalReels[1] === finalReels[2]) {
          const payout = betAmount * 2.5;
          onUpdateBalance(walletBalance - betAmount + payout);
          setWinMessage(
            language === 'bn' ? `✨ চমৎকার জয়! আপনি জিতেছেন ৳${payout}!` : `✨ Nice Win! You won ৳${payout}!`
          );
        } else {
          setWinMessage(
            language === 'bn' ? 'আবার চেষ্টা করুন! পরবর্তী স্পিনে ভাগ্য খুলবে।' : 'Good luck next spin!'
          );
        }
      }
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="fixed inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[#141926] border border-amber-500/50 rounded-2xl shadow-2xl z-10 overflow-hidden flex flex-col">
        {/* Game Title Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0d101a] border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black px-2 py-0.5 rounded bg-amber-400 text-slate-950">
              {game.provider}
            </span>
            <h3 className="text-sm font-bold text-slate-100">
              {language === 'bn' ? game.titleBn : game.titleEn}
            </h3>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1 hover:text-white transition"
              title="Toggle sound"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Game Screen Container */}
        <div className="relative p-6 bg-gradient-to-b from-[#161a29] via-[#0f1320] to-[#161a29] flex flex-col items-center justify-center min-h-[260px]">
          {/* Slot Reels Container */}
          <div className="w-full max-w-xs bg-black/70 border-2 border-amber-400/80 rounded-2xl p-4 shadow-[0_0_20px_rgba(255,215,0,0.2)]">
            <div className="grid grid-cols-3 gap-2">
              {reels.map((symbol, idx) => (
                <div
                  key={idx}
                  className={`h-24 rounded-xl bg-gradient-to-b from-[#252c42] to-[#171b29] border border-slate-700/80 flex items-center justify-center text-4xl shadow-inner select-none transition-transform ${
                    isSpinning ? 'animate-pulse scale-95' : 'scale-100'
                  }`}
                >
                  {symbol}
                </div>
              ))}
            </div>

            {/* Win Toast */}
            {winMessage && (
              <div className="mt-3 text-center text-xs font-bold text-amber-300 py-1.5 px-2 rounded-lg bg-amber-950/40 border border-amber-500/40 animate-fade-in">
                {winMessage}
              </div>
            )}
          </div>

          {/* Balance & Bet Controller */}
          <div className="w-full max-w-xs mt-4 flex items-center justify-between text-xs px-1">
            <div className="bg-[#1e2538] px-3 py-1.5 rounded-lg border border-slate-700">
              <span className="text-slate-400 block text-xs font-medium">
                {language === 'bn' ? 'ব্যালেন্স' : 'Balance'}
              </span>
              <span className="font-mono font-bold text-amber-300 text-sm">
                ৳{walletBalance.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-300 font-bold text-xs mr-0.5">
                {language === 'bn' ? 'বাজি' : 'Bet'}:
              </span>
              {[5, 10, 25, 50].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setBetAmount(amt)}
                  className={`px-2 py-1 rounded text-xs font-bold font-mono transition ${
                    betAmount === amt
                      ? 'bg-amber-400 text-slate-950 font-black'
                      : 'bg-[#1f2639] text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  ৳{amt}
                </button>
              ))}
            </div>
          </div>

          {/* Spin Button */}
          <div className="w-full max-w-xs mt-4">
            <button
              id="btn-game-spin"
              type="button"
              disabled={isSpinning}
              onClick={handleSpin}
              className={`w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg ${
                isSpinning
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 hover:brightness-110 active:scale-95 shadow-[0_0_15px_rgba(255,215,0,0.5)]'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>
                {isSpinning
                  ? language === 'bn' ? 'ঘুরছে...' : 'Spinning...'
                  : language === 'bn' ? `স্পিন করুন (৳${betAmount})` : `SPIN NOW (৳${betAmount})`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
