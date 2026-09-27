import React, { useState } from 'react';
import { Volume2, Download, CheckCircle2 } from 'lucide-react';
import { NOTIFICATIONS } from '../data/mockData';
import { Language } from '../types';

interface AnnouncementTickerProps {
  language: Language;
}

export const AnnouncementTicker: React.FC<AnnouncementTickerProps> = ({ language }) => {
  const [isDownloaded, setIsDownloaded] = useState(false);

  const handleDownloadApp = () => {
    setIsDownloaded(true);
    setTimeout(() => setIsDownloaded(false), 4000);
  };

  return (
    <div
      id="announcement-ticker-bar"
      className="relative flex items-center justify-between gap-2 px-3 py-2 my-2 rounded-xl bg-[#090C12] border border-[#F59E0B]/30 shadow-md overflow-hidden"
    >
      {/* Left Horn Icon in Gold */}
      <div className="flex items-center gap-1.5 text-[#F59E0B] shrink-0">
        <Volume2 className="w-4 h-4 animate-bounce text-[#F59E0B]" />
      </div>

      {/* Center Scrolling Ticker with Black Background and Golden Text */}
      <div className="relative flex-1 overflow-hidden h-5">
        <div className="animate-marquee flex items-center gap-8 text-xs text-[#F59E0B] cursor-pointer">
          {NOTIFICATIONS.map((item) => (
            <span key={item.id} className="inline-flex items-center gap-1.5 shrink-0 font-medium">
              <span>{item.icon}</span>
              <span className="text-[#F59E0B] font-semibold drop-shadow-sm">
                {language === 'bn' ? item.textBn : item.textEn}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Right: Download APK / App Icon Button */}
      <button
        id="btn-download-app"
        type="button"
        onClick={handleDownloadApp}
        title={language === 'bn' ? 'অফিসিয়াল অ্যান্ড্রয়েড অ্যাপ ডাউনলোড করুন' : 'Download Android App'}
        className="flex items-center gap-1 shrink-0 p-1.5 rounded-lg bg-[#1E293B] hover:bg-[#2A374D] text-[#F59E0B] border border-[#F59E0B]/40 transition active:scale-95"
      >
        {isDownloaded ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        ) : (
          <Download className="w-4 h-4 text-[#F59E0B]" />
        )}
      </button>

      {/* Download feedback toast */}
      {isDownloaded && (
        <div className="absolute top-full right-2 mt-1 z-30 px-3 py-1.5 bg-emerald-950 border border-emerald-500/80 rounded-lg text-xs font-semibold text-emerald-200 shadow-xl">
          {language === 'bn' ? 'অ্যাপ ডাউনলোড শুরু হয়েছে (APK)' : 'App download initiated (APK)'}
        </div>
      )}
    </div>
  );
};
