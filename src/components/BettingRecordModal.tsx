import React, { useState } from 'react';
import { X, FileClock, TrendingUp, ArrowUpDown, Award, ChevronLeft, ChevronRight, CheckCircle2, Clock } from 'lucide-react';
import { Language } from '../types';
import { MOCK_BET_RECORDS, MOCK_TRANSACTIONS, MOCK_TURNOVER_DATA, MOCK_PROFIT_LOSS } from '../data/mockData';

export type RecordTab = 'betting' | 'profit_loss' | 'transactions' | 'turnover';

interface BettingRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  initialTab?: RecordTab;
}

export const BettingRecordModal: React.FC<BettingRecordModalProps> = ({
  isOpen,
  onClose,
  language,
  initialTab = 'betting'
}) => {
  const [activeTab, setActiveTab] = useState<RecordTab>(initialTab);
  const [betFilter, setBetFilter] = useState<'all' | 'win' | 'loss'>('all');
  const [txFilter, setTxFilter] = useState<'all' | 'deposit' | 'withdraw'>('all');

  // Simple Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  if (!isOpen) return null;

  // Filtered Bet records
  const filteredBets = MOCK_BET_RECORDS.filter((r) => {
    if (betFilter === 'all') return true;
    return r.status === betFilter;
  });

  // Filtered Transactions
  const filteredTransactions = MOCK_TRANSACTIONS.filter((tx) => {
    if (txFilter === 'all') return true;
    return tx.type === txFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-2xl z-10 max-h-[92vh] flex flex-col text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
              <FileClock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                {language === 'bn' ? 'লেনদেন ও বেটিং রেকর্ডস' : 'Transactions & Records'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'bn' ? 'সকল খেলা ও ওয়ালেটের স্বচ্ছ বিবরণী' : 'Transparent gaming & wallet ledger'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-500 hover:text-slate-800 bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Main Tabs */}
        <div className="grid grid-cols-4 gap-1 mt-3 p-1 bg-gray-100 rounded-xl border border-gray-200 shrink-0 text-xs">
          <button
            type="button"
            onClick={() => { setActiveTab('betting'); setCurrentPage(1); }}
            className={`py-2 px-1 rounded-lg font-bold text-xs transition flex flex-col items-center gap-0.5 cursor-pointer ${
              activeTab === 'betting'
                ? 'bg-white text-slate-950 shadow-xs border border-gray-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileClock className="w-4 h-4 text-indigo-600" />
            <span className="truncate">{language === 'bn' ? 'বেটিং হিস্ট্রি' : 'Betting'}</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('profit_loss'); setCurrentPage(1); }}
            className={`py-2 px-1 rounded-lg font-bold text-xs transition flex flex-col items-center gap-0.5 cursor-pointer ${
              activeTab === 'profit_loss'
                ? 'bg-white text-slate-950 shadow-xs border border-gray-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span className="truncate">{language === 'bn' ? 'লাভ ও ক্ষতি' : 'Profit/Loss'}</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('transactions'); setCurrentPage(1); }}
            className={`py-2 px-1 rounded-lg font-bold text-xs transition flex flex-col items-center gap-0.5 cursor-pointer ${
              activeTab === 'transactions'
                ? 'bg-white text-slate-950 shadow-xs border border-gray-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowUpDown className="w-4 h-4 text-cyan-600" />
            <span className="truncate">{language === 'bn' ? 'ডিপোজিট/উত্তোলন' : 'Ledger'}</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('turnover'); setCurrentPage(1); }}
            className={`py-2 px-1 rounded-lg font-bold text-xs transition flex flex-col items-center gap-0.5 cursor-pointer ${
              activeTab === 'turnover'
                ? 'bg-white text-slate-950 shadow-xs border border-gray-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4 text-amber-600" />
            <span className="truncate">{language === 'bn' ? 'টার্নওভার' : 'Turnover'}</span>
          </button>
        </div>

        {/* Tab 1: Betting Records */}
        {activeTab === 'betting' && (
          <div className="flex-1 overflow-y-auto mt-3 space-y-2.5 pr-0.5 no-scrollbar">
            {/* Sub Filter */}
            <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-lg border border-gray-200">
              {(['all', 'win', 'loss'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setBetFilter(tab)}
                  className={`flex-1 py-1 rounded text-xs font-bold transition cursor-pointer ${
                    betFilter === tab ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab === 'all' ? (language === 'bn' ? 'সব' : 'All') : tab === 'win' ? (language === 'bn' ? 'জয়' : 'Win') : (language === 'bn' ? 'ক্ষতি' : 'Loss')}
                </button>
              ))}
            </div>

            {filteredBets.map((r) => (
              <div
                key={r.id}
                className="p-3 rounded-xl bg-[#f8f9fa] border border-gray-200 flex items-center justify-between text-xs shadow-2xs"
              >
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs sm:text-sm">
                    <span>{r.gameTitle}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold border border-amber-200">
                      {r.provider}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{r.timestamp}</div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-500">
                    {language === 'bn' ? 'বাজি:' : 'Bet:'} ৳{r.betAmount}
                  </div>
                  <div
                    className={`font-mono font-black text-sm mt-0.5 ${
                      r.status === 'win' ? 'text-emerald-600' : 'text-slate-400'
                    }`}
                  >
                    {r.status === 'win' ? `+৳${r.payoutAmount}` : '৳0.00'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Profit & Loss Summary */}
        {activeTab === 'profit_loss' && (
          <div className="flex-1 overflow-y-auto mt-3 space-y-2.5 pr-0.5 no-scrollbar">
            <div className="p-3 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-600 font-medium">{language === 'bn' ? 'মোট নেট লাভ' : 'Net Total Profit'}</span>
                <div className="text-lg font-black text-emerald-600 font-mono">+৳ 1,250.00</div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-600 font-medium">{language === 'bn' ? 'মোট খেলা সংখ্যা' : 'Games Played'}</span>
                <div className="text-base font-bold text-slate-900">261</div>
              </div>
            </div>

            <div className="space-y-2">
              {MOCK_PROFIT_LOSS.map((pl, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#f8f9fa] border border-gray-200 flex items-center justify-between text-xs shadow-2xs"
                >
                  <div>
                    <div className="font-bold text-slate-900 text-xs sm:text-sm">{pl.date}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {language === 'bn' ? 'মোট বাজি:' : 'Total Bet:'} ৳{pl.totalBets} | {language === 'bn' ? 'পেআউট:' : 'Payout:'} ৳{pl.totalWins}
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-mono font-black text-sm ${
                        pl.netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {pl.netProfit >= 0 ? `+৳${pl.netProfit}` : `-৳${Math.abs(pl.netProfit)}`}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 font-medium">{pl.gamesPlayed} {language === 'bn' ? 'টি খেলা' : 'rounds'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Deposit & Withdrawal History */}
        {activeTab === 'transactions' && (
          <div className="flex-1 overflow-y-auto mt-3 space-y-2.5 pr-0.5 no-scrollbar">
            {/* Filter */}
            <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-lg border border-gray-200">
              {(['all', 'deposit', 'withdraw'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setTxFilter(tab)}
                  className={`flex-1 py-1 rounded text-xs font-bold transition cursor-pointer ${
                    txFilter === tab ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab === 'all'
                    ? language === 'bn' ? 'সব লেনদেন' : 'All'
                    : tab === 'deposit'
                    ? language === 'bn' ? 'ডিপোজিট' : 'Deposits'
                    : language === 'bn' ? 'উত্তোলন' : 'Withdrawals'}
                </button>
              ))}
            </div>

            {filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                className="p-3 rounded-xl bg-[#f8f9fa] border border-gray-200 flex items-center justify-between text-xs shadow-2xs"
              >
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-2 text-xs sm:text-sm">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold ${
                        tx.type === 'deposit' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {tx.type === 'deposit' ? (language === 'bn' ? 'ডিপোজিট' : 'Deposit') : (language === 'bn' ? 'উত্তোলন' : 'Withdraw')}
                    </span>
                    <span>{tx.method}</span>
                    <span className="text-slate-500 text-xs">({tx.channel})</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                    <span>TrxID: <span className="font-mono text-amber-700 font-bold">{tx.trxId}</span></span>
                    <span>•</span>
                    <span>{tx.date}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`font-mono font-black text-sm ${tx.type === 'deposit' ? 'text-emerald-600' : 'text-amber-700'}`}>
                    {tx.type === 'deposit' ? `+৳${tx.amount}` : `-৳${tx.amount}`}
                  </div>
                  <div className="flex items-center justify-end gap-1 text-xs text-emerald-600 font-bold mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'সম্পন্ন' : 'Success'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Bonus & Turnover Requirements Tracker */}
        {activeTab === 'turnover' && (
          <div className="flex-1 overflow-y-auto mt-3 space-y-3 pr-0.5 no-scrollbar">
            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
              <div className="text-xs sm:text-sm font-bold text-amber-800 mb-1 flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{language === 'bn' ? 'টার্নওভার অগ্রগতি ও উত্তোলনের শর্ত' : 'Turnover & Rollover Progress'}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {language === 'bn'
                  ? 'বোনাস উত্তোলনের জন্য প্রয়োজনীয় টার্নওভার সম্পন্ন করুন। টার্নওভার ১০০% হলে ব্যালেন্স স্বয়ংক্রিয়ভাবে মূল ওয়ালেটে চলে যাবে।'
                  : 'Complete required wagering volume to unlock bonus funds for instant withdrawal.'}
              </p>
            </div>

            {MOCK_TURNOVER_DATA.map((to) => {
              const percent = Math.min(100, Math.round((to.completedTurnover / to.requiredTurnover) * 100));
              const remaining = Math.max(0, to.requiredTurnover - to.completedTurnover);

              return (
                <div
                  key={to.id}
                  className="p-3.5 rounded-xl bg-[#f8f9fa] border border-gray-200 space-y-2 text-xs shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{to.bonusTitle}</h4>
                      <span className="text-xs text-slate-500">
                        {language === 'bn' ? 'বোনাস ক্রেডিট:' : 'Bonus amount:'} ৳{to.bonusAmount} ({to.rolloverMultiplier})
                      </span>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded text-xs font-black ${
                        to.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {to.status === 'completed' ? (language === 'bn' ? 'সম্পূর্ণ' : 'Unlocked') : (language === 'bn' ? 'চলমান' : 'In Progress')}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">
                        {language === 'bn' ? 'সম্পন্ন:' : 'Completed:'} <span className="font-mono text-slate-900 font-bold">৳{to.completedTurnover}</span> / ৳{to.requiredTurnover}
                      </span>
                      <span className="font-mono font-black text-amber-600 text-sm">{percent}%</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-gray-200 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  {remaining > 0 && (
                    <div className="text-xs text-slate-500 text-right">
                      {language === 'bn' ? 'বাকি টার্নওভার:' : 'Remaining:'} <span className="text-rose-600 font-bold font-mono">৳{remaining}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Pagination simulation */}
        <div className="pt-3 mt-3 border-t border-gray-200 flex items-center justify-between shrink-0 text-xs text-slate-500">
          <span>{language === 'bn' ? 'পৃষ্ঠা ১ এর ১' : 'Page 1 of 1'}</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled
              className="p-1 rounded bg-gray-100 text-slate-400 cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled
              className="p-1 rounded bg-gray-100 text-slate-400 cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
