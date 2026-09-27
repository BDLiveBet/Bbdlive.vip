export type Language = 'bn' | 'en';

export type AppScreen = 'home' | 'game-lobby' | 'member-dashboard' | 'auth';

export interface AuthUser {
  userId: string; // 100% unique 8-digit random numeric user ID (e.g. "84739210")
  username: string;
  phone?: string;
  fullName?: string;
  email?: string;
  avatar?: string;
  walletBalance?: number;
  vipLevel: number;
  joinedDate: string;
  isGoogleUser?: boolean;
  token?: string;
}

export type ProviderName =
  | 'JILI'
  | 'PG'
  | 'NG'
  | 'JDB'
  | 'FC'
  | 'SG'
  | 'FP'
  | 'AE'
  | 'Crash Games'
  | 'BT'
  | 'BOM'
  | 'NE'
  | 'RT'
  | 'MAS'
  | 'MG'
  | 'GM'
  | 'MA'
  | 'PRAGMATIC'
  | 'SPADE'
  | 'FA CHAI';

export interface ProviderItem {
  id: string;
  name: string;
  shortName: string;
  badgeBg?: string;
  logoSvg?: string;
  tag?: string;
}

export interface GameItem {
  id: string;
  titleBn: string;
  titleEn: string;
  provider: ProviderName | string;
  category: 'hot' | 'slot' | 'live' | 'fish' | 'poker' | 'sports' | 'lottery' | 'favorite';
  image: string;
  accentColor?: string;
  isHot?: boolean;
  isNew?: boolean;
  jackpot?: string;
  rating?: number;
  multiplier?: string;
}

export interface PromoBanner {
  id: string;
  tagBn: string;
  tagEn: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  bonusPercentage: string;
  secondDepositBonus?: string;
  thirdDepositBonus?: string;
  telegramLink?: string;
  themeColor: string;
  bannerType?: 'image' | 'first_deposit' | 'daily_cashback';
  image?: string;
  ctaTextBn?: string;
  ctaTextEn?: string;
  actionType?: 'promo' | 'deposit' | 'vip' | 'telegram';
}

export interface WinnerItem {
  username: string;
  game: string;
  amount: number;
  timeAgo: string;
}

export interface NotificationItem {
  id: string;
  type: 'urgent' | 'promo' | 'system';
  icon: string;
  textBn: string;
  textEn: string;
}

export interface BetRecordItem {
  id: string;
  gameTitle: string;
  provider: string;
  betAmount: number;
  payoutAmount: number;
  status: 'win' | 'loss';
  timestamp: string;
}

export interface InternalMessageItem {
  id: string;
  title: string;
  preview: string;
  date: string;
  isRead: boolean;
}

export interface WalletAccount {
  id: string;
  type: 'bKash' | 'Nagad' | 'Rocket' | 'Upay' | string;
  number: string;
  holder: string;
  isDefault?: boolean;
}
