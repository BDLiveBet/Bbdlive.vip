import React, { useState } from 'react';
import { X, Send, Headphones, CheckCheck, Clock, MessageSquare, Send as TelegramIcon, PhoneCall, ExternalLink } from 'lucide-react';
import { Language } from '../types';

interface CustomerSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const CustomerSupportModal: React.FC<CustomerSupportModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  const [messages, setMessages] = useState<Array<{ sender: 'agent' | 'user'; text: string; time: string }>>([
    {
      sender: 'agent',
      text: language === 'bn'
        ? 'আসসালামু আলাইকুম! BDLiveBet.vip ২৪/৭ লাইভ সাপোর্টে আপনাকে স্বাগতম। ডিপোজিট, উত্তোলন বা গেম সংক্রান্ত যে কোনো তথ্যের জন্য মেসেজ দিন।'
        : 'Welcome to BDLiveBet.vip 24/7 VIP Live Support! How can we assist you with deposits, withdrawals, or games today?',
      time: 'Just now'
    }
  ]);
  const [inputVal, setInputVal] = useState('');

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg = inputVal;
    setInputVal('');
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: userMsg, time: 'Now' }
    ]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: language === 'bn'
            ? 'ধন্যবাদ! আপনার অনুরোধটি আমাদের গ্রাহক সেবা টিম পর্যালোচনা করছে। ২ মিনিটের মধ্যে সমাধান পৌঁছে যাবে।'
            : 'Thank you! A VIP support officer is processing your query and will reply within 2 minutes.',
          time: 'Now'
        }
      ]);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-2xl z-10 flex flex-col h-[560px] max-h-[92vh] overflow-hidden text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 border border-amber-200 flex items-center justify-center font-bold">
                <Headphones className="w-4 h-4" />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {language === 'bn' ? 'BDLiveBet.vip গ্রাহক সহায়তা' : 'BDLiveBet.vip 24/7 Support'}
              </h3>
              <span className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                <Clock className="w-3 h-3" />
                {language === 'bn' ? 'অনলাইন (গড় প্রতিক্রিয়া সময়: ৩০ সেকেন্ড)' : 'Online (Avg response: 30s)'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-gray-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Contact Channels (Telegram, Live Chat, WhatsApp) */}
        <div className="grid grid-cols-3 gap-1.5 p-2 bg-gray-50 border-b border-gray-200 text-center">
          <a
            href="https://t.me/BDLiveBetSupport"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-white hover:bg-gray-100 border border-cyan-200 flex items-center justify-center gap-1.5 text-xs font-bold text-cyan-700 shadow-xs transition cursor-pointer"
          >
            <TelegramIcon className="w-4 h-4 text-cyan-600" />
            <span>Telegram</span>
          </a>

          <a
            href="https://wa.me/8801700000000"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-white hover:bg-gray-100 border border-emerald-200 flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-700 shadow-xs transition cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp</span>
          </a>

          <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center gap-1.5 text-xs font-bold text-amber-800 shadow-xs">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Live Chat</span>
          </div>
        </div>

        {/* Message Area */}
        <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-[#f8f9fa]">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-amber-400 text-slate-950 font-medium rounded-br-none shadow-xs'
                    : 'bg-white text-slate-800 border border-gray-200 rounded-bl-none shadow-xs'
                }`}
              >
                {m.text}
              </div>
              <span className="text-xs text-slate-400 mt-0.5 px-1">{m.time}</span>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSend}
          className="p-2.5 bg-white border-t border-gray-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={language === 'bn' ? 'বার্তা লিখুন...' : 'Type a message...'}
            className="flex-1 bg-[#f8f9fa] border border-gray-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 transition active:scale-95 cursor-pointer shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
