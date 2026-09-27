import React from 'react';
import { X, Mail, Bell, CheckCircle } from 'lucide-react';
import { Language } from '../types';
import { MOCK_INTERNAL_MESSAGES } from '../data/mockData';

interface MessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const MessagesModal: React.FC<MessagesModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-[#161b2a] border border-amber-500/40 rounded-2xl p-4 sm:p-5 shadow-2xl z-10 max-h-[92vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold">
              <Mail className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-100">
              {language === 'bn' ? 'অভ্যন্তরীণ বার্তা' : 'Internal Messages'}
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

        {/* Message Items */}
        <div className="mt-4 space-y-2.5">
          {MOCK_INTERNAL_MESSAGES.map((msg) => (
            <div
              key={msg.id}
              className="p-3.5 rounded-xl bg-[#1e2436] border border-slate-700/60 space-y-1 relative"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-amber-300">{msg.title}</span>
                <span className="text-xs text-slate-400 font-medium">{msg.date}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{msg.preview}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
