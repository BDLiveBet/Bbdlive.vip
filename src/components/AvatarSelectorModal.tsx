import React, { useState } from 'react';
import { X, Check, Sparkles, AlertCircle } from 'lucide-react';
import { Language } from '../types';
import { PRESET_AVATARS, PresetAvatar } from '../data/avatars';

interface AvatarSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar?: string;
  language: Language;
  onSelectAvatar: (avatarUrl: string) => Promise<void> | void;
}

export const AvatarSelectorModal: React.FC<AvatarSelectorModalProps> = ({
  isOpen,
  onClose,
  currentAvatar,
  language,
  onSelectAvatar
}) => {
  const [selectedUrl, setSelectedUrl] = useState<string>(currentAvatar || PRESET_AVATARS[0].url);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChoose = async (avatar: PresetAvatar) => {
    setSelectedUrl(avatar.url);
    setIsUpdating(true);
    setErrorMsg(null);

    try {
      await onSelectAvatar(avatar.url);
      setIsUpdating(false);
      onClose();
    } catch (err: any) {
      console.error('Avatar selection error:', err);
      setErrorMsg(
        language === 'bn'
          ? 'অ্যাভাটার আপডেট করা যায়নি। পুনরায় চেষ্টা করুন।'
          : 'Failed to update avatar. Please try again.'
      );
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#181E2E] border border-amber-400/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/80 bg-[#121622]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                <span>{language === 'bn' ? 'অ্যাভাটার নির্বাচন করুন' : 'Choose Profile Avatar'}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold">
                  {PRESET_AVATARS.length} Presets
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {language === 'bn'
                  ? 'আপনার পছন্দের যেকোনো একটি গেমিং অ্যাভাটার বেছে নিন'
                  : 'Select your preferred gaming avatar logo'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mx-4 mt-3 p-2.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 20 Presets Grid */}
        <div className="p-4 overflow-y-auto flex-1 grid grid-cols-4 sm:grid-cols-5 gap-3 sm:gap-4 no-scrollbar">
          {PRESET_AVATARS.map((item) => {
            const isSelected = selectedUrl === item.url || currentAvatar === item.url;
            return (
              <button
                key={item.id}
                id={`avatar-choice-${item.id}`}
                type="button"
                disabled={isUpdating}
                onClick={() => handleChoose(item)}
                className={`group relative flex flex-col items-center p-2 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-400 ring-2 ring-amber-400/50 shadow-lg scale-105'
                    : 'bg-[#0F1420] border-slate-800 hover:border-amber-400/50 hover:bg-slate-800/80 hover:scale-102'
                }`}
              >
                {/* Badge if available */}
                {item.badge && (
                  <span className="absolute -top-1.5 -right-1 z-10 px-2 py-0.5 rounded-full bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-xs shadow">
                    {item.badge}
                  </span>
                )}

                {/* Avatar Image */}
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-slate-700 group-hover:border-amber-400 transition shadow-md bg-slate-900">
                  <img
                    src={item.url}
                    alt={language === 'bn' ? item.nameBn : item.nameEn}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    loading="lazy"
                  />

                  {/* Selected Checkmark overlay */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-amber-950/40 backdrop-blur-[1px] flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Label */}
                <span className="text-xs font-bold text-slate-300 group-hover:text-amber-300 mt-1.5 text-center leading-tight line-clamp-1 w-full">
                  {language === 'bn' ? item.nameBn : item.nameEn}
                </span>
              </button>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-700/80 bg-[#121622] flex items-center justify-between text-xs text-slate-400">
          <span>
            {language === 'bn' ? 'ক্লিক করলেই তাৎক্ষণিক সেভ হবে' : 'Click any avatar to apply instantly'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition"
          >
            {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
