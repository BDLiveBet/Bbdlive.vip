/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SidebarDrawer } from './components/SidebarDrawer';
import { HeroSlider } from './components/HeroSlider';
import { AnnouncementTicker } from './components/AnnouncementTicker';
import { ProviderAndCategoryCards } from './components/ProviderAndCategoryCards';
import { GameSection } from './components/GameSection';
import { JackpotAndWinners } from './components/JackpotAndWinners';
import { FloatingWidgets } from './components/FloatingWidgets';
import { BottomNav, TabType } from './components/BottomNav';
import { GameLobbyView } from './components/GameLobbyView';
import { MemberAccountView } from './components/MemberAccountView';

import { DepositModal } from './components/DepositModal';
import { WithdrawModal } from './components/WithdrawModal';
import { GameModal } from './components/GameModal';
import { PromotionsModal, PromoCategory } from './components/PromotionsModal';
import { RewardCenterModal, RewardCenterTab } from './components/RewardCenterModal';
import { CustomerSupportModal } from './components/CustomerSupportModal';
import { BankAccountModal } from './components/BankAccountModal';
import { BettingRecordModal } from './components/BettingRecordModal';
import { MessagesModal } from './components/MessagesModal';
import { HelpCenterModal } from './components/HelpCenterModal';
import { AuthLandingPage } from './components/AuthLandingPage';
import { Footer } from './components/Footer';

import {
  HOT_GAMES,
  JILI_SLOTS,
  PG_SLOTS,
  LIVE_CASINO_GAMES,
  FISHING_GAMES
} from './data/mockData';
import { GameItem, Language, AppScreen, AuthUser, WalletAccount } from './types';

const DEFAULT_SAVED_WALLETS: WalletAccount[] = [
  { id: 'w-1', type: 'Nagad', number: '018****4490', holder: 'Shamim Ahmed', isDefault: true },
  { id: 'w-2', type: 'bKash', number: '017****5521', holder: 'Shamim Ahmed', isDefault: false }
];

export default function App() {
  // Authentication Gatekeeper State (unauthenticated users see login/register page first)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  // Navigation & Screen State
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [activeCategory, setActiveCategory] = useState<string>('slot');
  const [activeProvider, setActiveProvider] = useState<string>('JILI');

  // Application & User State
  const [walletBalance, setWalletBalance] = useState<number>(0.67);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language>('bn');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<string[]>(['jili-1', 'jili-3', 'pg-1']);

  // Shared synchronized user bound wallets
  const [savedWallets, setSavedWallets] = useState<WalletAccount[]>(() => {
    try {
      const stored = localStorage.getItem('bdlivebet_saved_wallets');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse stored wallets', e);
    }
    return DEFAULT_SAVED_WALLETS;
  });

  const handleUpdateWallets = (wallets: WalletAccount[]) => {
    setSavedWallets(wallets);
    try {
      localStorage.setItem('bdlivebet_saved_wallets', JSON.stringify(wallets));
    } catch (e) {
      console.warn('Failed to persist wallets', e);
    }
  };

  const handleAddWallet = (wallet: WalletAccount) => {
    const updated = [...savedWallets, wallet];
    handleUpdateWallets(updated);
  };

  // Modal Visibility States
  const [selectedGame, setSelectedGame] = useState<GameItem | null>(null);
  const [isDepositOpen, setIsDepositOpen] = useState<boolean>(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState<boolean>(false);
  const [isPromotionsOpen, setIsPromotionsOpen] = useState<boolean>(false);
  const [promotionsInitialTab, setPromotionsInitialTab] = useState<PromoCategory>('all');
  const [isSupportOpen, setIsSupportOpen] = useState<boolean>(false);
  const [isBankAccountOpen, setIsBankAccountOpen] = useState<boolean>(false);
  const [isBettingRecordOpen, setIsBettingRecordOpen] = useState<boolean>(false);
  const [recordInitialTab, setRecordInitialTab] = useState<'betting' | 'profit_loss' | 'transactions' | 'turnover'>('betting');
  const [isMessagesOpen, setIsMessagesOpen] = useState<boolean>(false);
  const [isHelpCenterOpen, setIsHelpCenterOpen] = useState<boolean>(false);
  const [isRewardCenterOpen, setIsRewardCenterOpen] = useState<boolean>(false);
  const [rewardCenterInitialTab, setRewardCenterInitialTab] = useState<RewardCenterTab>('main');

  const handleOpenRewardCenter = (tab: RewardCenterTab = 'main') => {
    setRewardCenterInitialTab(tab);
    setIsRewardCenterOpen(true);
  };

  // Global Toast Alert
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Wallet refresh simulation
  const handleRefreshBalance = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast(language === 'bn' ? 'ব্যালেন্স আপডেট সম্পন্ন হয়েছে' : 'Balance updated successfully');
    }, 500);
  };

  // Toggle favorite games
  const handleToggleFavorite = (gameId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(gameId);
      const updated = exists ? prev.filter((id) => id !== gameId) : [...prev, gameId];
      showToast(
        exists
          ? (language === 'bn' ? 'পছন্দের তালিকা থেকে বাদ দেওয়া হয়েছে' : 'Removed from favorites')
          : (language === 'bn' ? 'পছন্দের তালিকায় যুক্ত করা হয়েছে' : 'Added to favorites')
      );
      return updated;
    });
  };

  // Deposit confirmation
  const handleDepositConfirm = (amount: number) => {
    setWalletBalance((prev) => prev + amount);
    showToast(
      language === 'bn' ? `৳${amount.toFixed(2)} সফলভাবে যোগ হয়েছে!` : `৳${amount.toFixed(2)} deposited successfully!`
    );
  };

  // Withdrawal confirmation
  const handleWithdrawConfirm = (amount: number) => {
    setWalletBalance((prev) => Math.max(0, prev - amount));
    showToast(
      language === 'bn' ? `৳${amount} উত্তোলন প্রক্রিয়াধীন` : `৳${amount} withdrawal is being processed`
    );
  };

  // Claim promotion bonus
  const handleClaimPromo = (bonusName: string) => {
    setIsPromotionsOpen(false);
    setWalletBalance((prev) => prev + 50);
    showToast(
      language === 'bn' ? `${bonusName} দাবি সফল হয়েছে! +৳50 বোনাস` : `${bonusName} claimed! +৳50 bonus added`
    );
  };

  // Daily VIP Sign-in Claim
  const handleDailySignIn = () => {
    setWalletBalance((prev) => prev + 10);
    showToast(
      language === 'bn' ? 'অভিনন্দন! দৈনিক সাইন ইন বোনাস +৳১০.০০ যোগ হয়েছে' : 'Congrats! Daily sign-in bonus +৳10.00 credited'
    );
  };

  // Verify persistent JWT session on app load
  useEffect(() => {
    const token =
      localStorage.getItem('bdlivebet_token') ||
      localStorage.getItem('1xbetlive_token') ||
      localStorage.getItem('hibajee_token');
    if (!token) {
      setIsAuthenticated(false);
      setCurrentUser(null);
      return;
    }

    // Verify session token against backend database
    fetch('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          const verifiedUser: AuthUser = {
            userId: data.user.userId,
            username: data.user.username,
            phone: data.user.phoneNumber,
            fullName: data.user.fullName,
            walletBalance: data.user.walletBalance,
            vipLevel: data.user.vipLevel || 2,
            joinedDate: data.user.createdAt ? data.user.createdAt.split('T')[0] : '2026-07-20',
            email: data.user.email,
            avatar: data.user.avatar,
            token
          };
          setCurrentUser(verifiedUser);
          if (typeof data.user.walletBalance === 'number') {
            setWalletBalance(data.user.walletBalance);
          }
          setIsAuthenticated(true);
        } else {
          // Token invalid or user no longer in database: clear credentials
          localStorage.removeItem('bdlivebet_token');
          localStorage.removeItem('bdlivebet_user');
          sessionStorage.removeItem('bdlivebet_user');
          localStorage.removeItem('1xbetlive_token');
          localStorage.removeItem('1xbetlive_user');
          sessionStorage.removeItem('1xbetlive_user');
          localStorage.removeItem('hibajee_token');
          localStorage.removeItem('hibajee_user');
          sessionStorage.removeItem('hibajee_user');
          setIsAuthenticated(false);
          setCurrentUser(null);
        }
      })
      .catch((err) => {
        console.warn('Session verification error:', err);
      });
  }, []);

  // App download action
  const handleAppDownload = () => {
    showToast(
      language === 'bn' ? 'BDLiveBet.vip অ্যাপ ডাউনলোড শুরু হচ্ছে...' : 'Downloading BDLiveBet.vip Official App (APK)...'
    );
  };

  // Login & Registration success handler
  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    if (typeof user.walletBalance === 'number') {
      setWalletBalance(user.walletBalance);
    }
    setIsAuthenticated(true);
    setCurrentScreen('home');
    setCurrentTab('home');
    showToast(
      language === 'bn'
        ? `স্বাগতম ${user.fullName || user.username}! (ইউজার আইডি: ${user.userId})`
        : `Welcome ${user.fullName || user.username}! (User ID: ${user.userId})`
    );
  };

  // Logout action - destroys session and returns user to the Login/Register gatekeeper landing page
  const handleLogout = () => {
    const token =
      localStorage.getItem('bdlivebet_token') ||
      localStorage.getItem('1xbetlive_token') ||
      localStorage.getItem('hibajee_token');
    if (token) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => {});
    }
    localStorage.removeItem('bdlivebet_token');
    localStorage.removeItem('bdlivebet_user');
    sessionStorage.removeItem('bdlivebet_user');
    localStorage.removeItem('1xbetlive_token');
    localStorage.removeItem('1xbetlive_user');
    sessionStorage.removeItem('1xbetlive_user');
    localStorage.removeItem('hibajee_token');
    localStorage.removeItem('hibajee_user');
    sessionStorage.removeItem('hibajee_user');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setIsDrawerOpen(false);
    setCurrentScreen('home');
    setCurrentTab('home');
    showToast(
      language === 'bn' ? 'আপনি সফলভাবে লগআউট হয়েছেন' : 'You have logged out successfully'
    );
  };

  // Bottom Navigation Handler
  const handleTabChange = (tab: TabType) => {
    setCurrentTab(tab);
    if (tab === 'home') {
      setCurrentScreen('home');
    } else if (tab === 'promotions') {
      setPromotionsInitialTab('all');
      setIsPromotionsOpen(true);
    } else if (tab === 'agent') {
      handleOpenRewardCenter('invite');
    } else if (tab === 'rewards') {
      handleOpenRewardCenter('main');
    } else if (tab === 'member') {
      setCurrentScreen('member-account');
    }
  };

  // Category selection handler (switches to game lobby if user selects a game category)
  const handleSelectCategory = (cat: string) => {
    setActiveCategory(cat);
    if (cat !== 'all') {
      setCurrentScreen('game-lobby');
    }
  };

  // Open Game Lobby with optional provider / category pre-selection
  const handleOpenLobby = (provider?: string, category?: string) => {
    if (provider) setActiveProvider(provider);
    if (category) setActiveCategory(category);
    setCurrentScreen('game-lobby');
  };

  // GATEKEEPER: Unauthenticated users see Login / Register page first
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#121921] text-white flex justify-center selection:bg-[#F59E0B] selection:text-black">
        <div className="w-full bg-[#121921] min-h-screen flex flex-col relative">
          <AuthLandingPage
            language={language}
            onLanguageChange={(lang) => setLanguage(lang)}
            onLoginSuccess={handleLoginSuccess}
            onOpenSupport={() => setIsSupportOpen(true)}
            onAppDownload={handleAppDownload}
          />

          {/* 24/7 Support modal accessible directly from login page */}
          <CustomerSupportModal
            isOpen={isSupportOpen}
            onClose={() => setIsSupportOpen(false)}
            language={language}
          />

          {/* Global Toast Alert */}
          {toastMessage && (
            <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-slate-900/95 border border-amber-400 text-amber-300 text-xs font-bold shadow-2xl flex items-center gap-2">
              <span>✨</span>
              <span>{toastMessage}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F15] text-white flex flex-col w-full selection:bg-[#F59E0B] selection:text-black overflow-x-hidden">
      {/* Full-Width Responsive Container */}
      <div className="w-full bg-[#121921] min-h-screen flex flex-col relative">
        
        {/* Global Sidebar Drawer */}
        <SidebarDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          language={language}
          onLanguageChange={(lang) => setLanguage(lang)}
          currentUser={currentUser}
          onOpenDeposit={() => setIsDepositOpen(true)}
          onOpenWithdraw={() => setIsWithdrawOpen(true)}
          onOpenOffers={() => {
            setPromotionsInitialTab('all');
            setIsPromotionsOpen(true);
          }}
          onOpenShare={() => handleOpenRewardCenter('invite')}
          onOpenRewards={() => {
            handleOpenRewardCenter('main');
          }}
          onOpenSupport={() => setIsSupportOpen(true)}
          onOpenHelpCenter={() => setIsHelpCenterOpen(true)}
          onAppDownload={handleAppDownload}
          onNavigateGameLobby={() => {
            setCurrentScreen('game-lobby');
            setCurrentTab('home');
          }}
          onNavigateMember={() => {
            setCurrentScreen('member-account');
            setCurrentTab('member');
          }}
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            setCurrentScreen('game-lobby');
          }}
          onLogout={handleLogout}
        />

        {/* SCREEN 1: GAME LOBBY VIEW (Matches Screenshots 1 & 2) */}
        {currentScreen === 'game-lobby' && (
          <GameLobbyView
            language={language}
            onBack={() => {
              setCurrentScreen('home');
              setCurrentTab('home');
            }}
            selectedProvider={activeProvider}
            onSelectProvider={(prov) => setActiveProvider(prov)}
            selectedCategory={activeCategory}
            onSelectCategory={(cat) => setActiveCategory(cat)}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onPlayGame={(game) => setSelectedGame(game)}
          />
        )}

        {/* SCREEN 2: MEMBER ACCOUNT DASHBOARD (Matches Screenshot 3) */}
        {currentScreen === 'member-account' && (
          <MemberAccountView
            language={language}
            onBack={() => {
              setCurrentScreen('home');
              setCurrentTab('home');
            }}
            currentUser={currentUser}
            walletBalance={walletBalance}
            onRefreshBalance={handleRefreshBalance}
            isRefreshing={isRefreshing}
            onOpenDeposit={() => setIsDepositOpen(true)}
            onOpenWithdraw={() => setIsWithdrawOpen(true)}
            onOpenBankAccount={() => setIsBankAccountOpen(true)}
            onOpenBettingRecord={(tab = 'betting') => {
              setRecordInitialTab(tab);
              setIsBettingRecordOpen(true);
            }}
            onOpenMessages={() => setIsMessagesOpen(true)}
            onOpenRewardCenter={() => handleOpenRewardCenter('main')}
            onOpenSupport={() => setIsSupportOpen(true)}
            onOpenShare={() => handleOpenRewardCenter('invite')}
            onOpenHelpCenter={() => setIsHelpCenterOpen(true)}
            onDailySignIn={() => handleOpenRewardCenter('checkin')}
            onLogout={handleLogout}
            onUpdateUser={(updated) => {
              setCurrentUser(updated);
              localStorage.setItem('bdlivebet_user', JSON.stringify(updated));
              localStorage.setItem('1xbetlive_user', JSON.stringify(updated));
              localStorage.setItem('hibajee_user', JSON.stringify(updated));
            }}
            onShowToast={showToast}
          />
        )}

        {/* SCREEN 3: HOME LOBBY (Default View) */}
        {currentScreen === 'home' && (
          <>
            {/* Top Header with Hamburger, Logo, Wallet Balance & Category Bar */}
            <Header
              onToggleDrawer={() => setIsDrawerOpen(true)}
              isDrawerOpen={isDrawerOpen}
              walletBalance={walletBalance}
              onRefreshBalance={handleRefreshBalance}
              isRefreshing={isRefreshing}
              onOpenDeposit={() => setIsDepositOpen(true)}
              language={language}
              onLanguageChange={(lang) => setLanguage(lang)}
              onAppDownload={handleAppDownload}
              onOpenSupport={() => setIsSupportOpen(true)}
              activeCategory={activeCategory}
              onSelectCategory={handleSelectCategory}
            />

            {/* Main Content Area */}
            <main className="flex-1 w-full px-2 sm:px-4 md:px-6 lg:px-8 py-2 pb-28">
              {/* Hero Promotional Banner Slider */}
              <HeroSlider
                language={language}
                onClaimPromo={() => setIsPromotionsOpen(true)}
                onOpenDeposit={() => setIsDepositOpen(true)}
                onOpenVIP={() => handleOpenRewardCenter('main')}
                onOpenLobby={handleOpenLobby}
              />

              {/* Announcement Ticker Bar */}
              <AnnouncementTicker language={language} />

              {/* Provider Banners (JILI & PG) and Quick Category Tabs */}
              <ProviderAndCategoryCards
                language={language}
                activeProvider={activeProvider}
                activeCategory={activeCategory}
                onSelectProvider={(prov) => {
                  setActiveProvider(prov);
                  handleOpenLobby(prov, 'slot');
                }}
                onSelectCategory={(cat) => {
                  setActiveCategory(cat);
                  handleOpenLobby(activeProvider, cat);
                }}
                onOpenLobby={handleOpenLobby}
              />

              {/* Section 1: গরমে খেলা (Hot Games) */}
              <GameSection
                id="hot-games"
                titleBn="গরমে খেলা"
                titleEn="Hot Games"
                games={HOT_GAMES}
                language={language}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onSelectGame={(game) => setSelectedGame(game)}
                onViewAll={() => handleOpenLobby('ALL', 'hot')}
              />

              {/* Section 2: JILI স্লট (JILI Slots) */}
              <GameSection
                id="jili-slots"
                titleBn="JILI স্লট"
                titleEn="JILI Slots"
                games={JILI_SLOTS.slice(0, 12)}
                language={language}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onSelectGame={(game) => setSelectedGame(game)}
                onViewAll={() => handleOpenLobby('JILI', 'slot')}
              />

              {/* Section 3: PG স্লট (PG Slots) */}
              <GameSection
                id="pg-slots"
                titleBn="PG স্লট"
                titleEn="PG Slots"
                games={PG_SLOTS.slice(0, 12)}
                language={language}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onSelectGame={(game) => setSelectedGame(game)}
                onViewAll={() => handleOpenLobby('PG', 'slot')}
              />

              {/* Section 4: লাইভ ক্যাসিনো (Live Casino) */}
              <GameSection
                id="live-casino"
                titleBn="লাইভ ক্যাসিনো"
                titleEn="Live Casino"
                games={LIVE_CASINO_GAMES}
                language={language}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onSelectGame={(game) => setSelectedGame(game)}
                onViewAll={() => handleOpenLobby('ALL', 'live')}
              />

              {/* Section 5: মাছ ধরা খেলা (Fishing Games) */}
              <GameSection
                id="fishing-games"
                titleBn="মাছ ধরা খেলা"
                titleEn="Fishing Games"
                games={FISHING_GAMES}
                language={language}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onSelectGame={(game) => setSelectedGame(game)}
                onViewAll={() => handleOpenLobby('ALL', 'fish')}
              />

              {/* Progressive Jackpot & Recent Winners (Screenshot 1) */}
              <JackpotAndWinners language={language} />

              {/* BDLiveBet.vip Official Footer */}
              <Footer language={language} onOpenSupport={() => setIsSupportOpen(true)} />
            </main>

            {/* Floating Interactive Action Widgets */}
            <FloatingWidgets
              language={language}
              onOpenFeatured={() => handleOpenLobby('ALL', 'hot')}
              onOpenEvents={() => handleOpenRewardCenter('main')}
              onOpenSupport={() => setIsSupportOpen(true)}
            />
          </>
        )}

        {/* Fixed Bottom Navigation (5 items with center elevated Agent button) */}
        <BottomNav
          currentTab={currentTab}
          onChangeTab={handleTabChange}
          language={language}
        />

        {/* Modals */}
        <DepositModal
          isOpen={isDepositOpen}
          onClose={() => setIsDepositOpen(false)}
          language={language}
          onConfirmDeposit={handleDepositConfirm}
        />

        <WithdrawModal
          isOpen={isWithdrawOpen}
          onClose={() => setIsWithdrawOpen(false)}
          language={language}
          walletBalance={walletBalance}
          savedWallets={savedWallets}
          onAddWallet={handleAddWallet}
          onConfirmWithdraw={handleWithdrawConfirm}
        />

        <BankAccountModal
          isOpen={isBankAccountOpen}
          onClose={() => setIsBankAccountOpen(false)}
          language={language}
          wallets={savedWallets}
          onUpdateWallets={handleUpdateWallets}
          onAddWallet={handleAddWallet}
        />

        <BettingRecordModal
          isOpen={isBettingRecordOpen}
          onClose={() => setIsBettingRecordOpen(false)}
          language={language}
          initialTab={recordInitialTab}
        />

        <MessagesModal
          isOpen={isMessagesOpen}
          onClose={() => setIsMessagesOpen(false)}
          language={language}
        />

        <HelpCenterModal
          isOpen={isHelpCenterOpen}
          onClose={() => setIsHelpCenterOpen(false)}
          language={language}
          onOpenSupport={() => setIsSupportOpen(true)}
        />

        <GameModal
          game={selectedGame}
          onClose={() => setSelectedGame(null)}
          language={language}
          walletBalance={walletBalance}
          onUpdateBalance={(bal) => setWalletBalance(bal)}
        />

        <PromotionsModal
          isOpen={isPromotionsOpen}
          onClose={() => setIsPromotionsOpen(false)}
          language={language}
          initialTab={promotionsInitialTab}
          onClaim={handleClaimPromo}
          onClaimBonus={(amount, label) => {
            setWalletBalance((prev) => prev + amount);
            showToast(
              language === 'bn'
                ? `অভিনন্দন! +৳${amount.toFixed(2)} ${label} যোগ হয়েছে`
                : `Success! +৳${amount.toFixed(2)} ${label} credited to wallet`
            );
          }}
        />

        <RewardCenterModal
          isOpen={isRewardCenterOpen}
          onClose={() => {
            setIsRewardCenterOpen(false);
            if (currentTab === 'rewards' || currentTab === 'agent') {
              setCurrentTab(currentScreen === 'member-account' ? 'member' : 'home');
            }
          }}
          language={language}
          currentUser={currentUser}
          walletBalance={walletBalance}
          onRefreshBalance={handleRefreshBalance}
          isRefreshing={isRefreshing}
          initialTab={rewardCenterInitialTab}
          onOpenDeposit={() => {
            setIsRewardCenterOpen(false);
            setIsDepositOpen(true);
          }}
          onOpenShare={() => {
            handleOpenRewardCenter('invite');
          }}
          onClaimBonus={(amount, label) => {
            setWalletBalance((prev) => prev + amount);
            showToast(
              language === 'bn'
                ? `অভিনন্দন! +৳${amount.toFixed(2)} ${label} যোগ হয়েছে`
                : `Success! +৳${amount.toFixed(2)} ${label} credited to wallet`
            );
          }}
        />

        <CustomerSupportModal
          isOpen={isSupportOpen}
          onClose={() => setIsSupportOpen(false)}
          language={language}
        />

        {/* Global Toast Alert */}
        {toastMessage && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-slate-900/95 border border-amber-400 text-amber-300 text-xs font-bold shadow-2xl flex items-center gap-2">
            <span>✨</span>
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}
