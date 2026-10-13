import React, { useState, useRef, useEffect } from 'react';
import { NavTab, Language } from '../types';
import {
  Home,
  MessageSquare,
  Calendar,
  Briefcase,
  HeartHandshake,
  Compass,
  Award,
  GraduationCap,
  CreditCard,
  Menu,
  X,
  Heart,
  ShieldCheck,
  Lock,
  LogOut,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  onOpenDonate: () => void;
  onOpenCreatePost?: () => void;
  onOpenIdCard: () => void;
  onOpenAdmin?: () => void;
  isAdminLoggedIn?: boolean;
  onLogoutAdmin?: () => void;
}

interface NavItemConfig {
  id: NavTab;
  hiLabel: string;
  enLabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItemConfig[] = [
  { id: 'home', hiLabel: 'मुख्य पृष्ठ', enLabel: 'Home', icon: Home },
  { id: 'feed', hiLabel: 'समाज चर्चा', enLabel: 'Social Feed', icon: MessageSquare },
  { id: 'events', hiLabel: 'समाज आयोजन', enLabel: 'Events', icon: Calendar },
  { id: 'directory', hiLabel: 'शिल्प व व्यापार', enLabel: 'Directory', icon: Briefcase },
  { id: 'matrimony', hiLabel: 'परिणय मंच', enLabel: 'Matrimonial', icon: HeartHandshake },
  { id: 'heritage', hiLabel: 'तीर्थ व पुराण', enLabel: 'Heritage', icon: Compass },
  { id: 'luminaries', hiLabel: 'अमर विभूतियां', enLabel: 'Luminaries', icon: Award },
  { id: 'youth', hiLabel: 'युवा व शिक्षा', enLabel: 'Youth & Jobs', icon: GraduationCap },
  { id: 'idcard', hiLabel: 'पहचान पत्र', enLabel: 'ID Card', icon: CreditCard },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  onOpenDonate,
  onOpenCreatePost,
  onOpenIdCard,
  onOpenAdmin,
  isAdminLoggedIn,
  onLogoutAdmin,
}) => {
  const isHi = lang === 'hi';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const activeTabMobileRef = useRef<HTMLButtonElement | null>(null);

  // Auto-scroll the mobile horizontal navigation strip so the active tab is always centered & fully visible
  useEffect(() => {
    if (activeTabMobileRef.current) {
      activeTabMobileRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeTab]);

  const handleTabClick = (tabId: NavTab) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/98 backdrop-blur-md border-b border-stone-200/90 shadow-2xs transition-all">
        {/* Top Header Bar */}
        <div className="max-w-[1536px] mx-auto px-2.5 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-13 sm:h-15 lg:h-16 flex-nowrap gap-2 w-full">
            
            {/* Zone 1: Brand title & Emblem */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              <button
                onClick={() => handleTabClick('home')}
                className="text-left group cursor-pointer focus:outline-none flex items-center gap-1.5"
                title="विश्वकर्मा समाज मुख्य पृष्ठ"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-4 h-4 text-amber-100" />
                </div>
                <span className="text-base sm:text-xl lg:text-2xl font-bold tracking-tight text-amber-900 group-hover:text-amber-800 transition-colors font-display whitespace-nowrap block">
                  {isHi ? 'विश्वकर्मा समाज' : 'Vishwakarma Samaj'}
                </span>
              </button>
            </div>

            {/* Zone 2 (Desktop / Laptop only): All Navigation links in ONE continuous STRAIGHT LINE */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-xs xl:text-[13px] font-medium text-stone-700 overflow-x-auto scrollbar-none flex-1 min-w-0 justify-center px-2 py-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`flex items-center gap-1 px-2.5 xl:px-3 py-1.5 rounded-xl transition-all relative focus:outline-none cursor-pointer whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-amber-100 text-amber-950 font-bold border border-amber-300 shadow-2xs'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/90 font-medium'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-amber-800' : 'text-stone-500'}`} />
                    <span>{isHi ? item.hiLabel : item.enLabel}</span>
                  </button>
                );
              })}
            </nav>

            {/* Zone 3: Action Buttons (Always visible in straight line on all screens) */}
            <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-2 shrink-0 z-20 flex-nowrap">
              {/* Language Switcher */}
              <button
                onClick={() => setLang(isHi ? 'en' : 'hi')}
                className="px-2 py-1 sm:py-1.5 text-[11px] sm:text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg sm:rounded-xl transition-colors shrink-0 whitespace-nowrap cursor-pointer border border-stone-200"
                title="भाषा बदलें (Change Language)"
              >
                {isHi ? 'Eng' : 'हिंदी'}
              </button>

              {/* Admin Button */}
              {isAdminLoggedIn ? (
                <div className="flex items-center gap-1 shrink-0 flex-nowrap">
                  <button
                    onClick={onOpenAdmin}
                    className="flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-bold text-amber-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 hover:from-amber-200 hover:to-amber-300 border border-amber-500 rounded-lg sm:rounded-xl shadow-2xs transition-all cursor-pointer whitespace-nowrap shrink-0"
                    title={isHi ? 'केंद्रीय एडमिन कंट्रोल पैनल' : 'Master Admin Suite'}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-950 shrink-0" />
                    <span>{isHi ? '👑 एडमिन' : '👑 Admin'}</span>
                  </button>
                  {onLogoutAdmin && (
                    <button
                      onClick={onLogoutAdmin}
                      className="p-1 sm:px-2 sm:py-1.5 text-[10px] sm:text-xs font-semibold text-red-700 hover:text-red-900 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg sm:rounded-xl transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                      title={isHi ? 'एडमिन मोड से लॉगआउट करें' : 'Logout'}
                    >
                      <LogOut className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                      <span className="hidden xl:inline">{isHi ? 'लॉगआउट' : 'Exit'}</span>
                    </button>
                  )}
                </div>
              ) : (
                onOpenAdmin && (
                  <button
                    onClick={onOpenAdmin}
                    className="flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg sm:rounded-xl shadow-2xs transition-all cursor-pointer whitespace-nowrap shrink-0"
                    title={isHi ? 'सुरक्षित एडमिन प्रमाणीकरण (dksacademy.live@gmail.com / 7045377303)' : 'Protected Admin Access'}
                  >
                    <Lock className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-stone-600 shrink-0" />
                    <span>{isHi ? '🔒 एडमिन' : '🔒 Admin'}</span>
                  </button>
                )
              )}

              {/* Sahyog / Dan Button */}
              <button
                type="button"
                onClick={onOpenDonate}
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-bold text-white bg-gradient-to-r from-red-600 via-amber-700 to-amber-800 hover:from-red-500 hover:to-amber-700 active:scale-95 rounded-lg sm:rounded-xl shadow-xs transition-all whitespace-nowrap cursor-pointer shrink-0"
                title={isHi ? 'विश्वकर्मा सहायता प्रकोष्ठ में सहयोग / दान करें' : 'Donate to Samaj Relief Fund'}
              >
                <Heart className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-white fill-white shrink-0" />
                <span>{isHi ? 'सहयोग' : 'Donate'}</span>
              </button>

              {/* Mobile Menu Hamburger Toggle (< lg only) */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="lg:hidden p-1 sm:p-1.5 rounded-lg text-stone-700 hover:bg-stone-100 border border-stone-200 transition-colors focus:outline-none cursor-pointer shrink-0"
                title={mobileMenuOpen ? 'मेनू बंद करें' : 'संपूर्ण मेनू सूची खोलें'}
                aria-label="Toggle Mobile Menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-amber-900" />
                ) : (
                  <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-stone-800" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Zone 2 (Mobile & Tablet): Dedicated Full-Width Horizontal Scroll Navigation Strip */}
        {/* 100% visible on mobile, never squeezed, never hidden! */}
        <div className="lg:hidden w-full border-t border-stone-200/90 bg-stone-50/95 backdrop-blur-sm px-2 py-1.5 overflow-x-auto scrollbar-none shadow-2xs">
          <nav className="flex items-center gap-1.5 text-xs font-medium text-stone-700 flex-nowrap w-max min-w-full">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  ref={isActive ? activeTabMobileRef : null}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs transition-all focus:outline-none cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-amber-100 text-amber-950 font-bold border border-amber-300 shadow-2xs ring-1 ring-amber-400/40'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 font-medium border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-amber-800' : 'text-stone-500'}`} />
                  <span>{isHi ? item.hiLabel : item.enLabel}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Mobile Dropdown Drawer for Instant Section Jumping (< lg) */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-amber-200 bg-white/98 backdrop-blur-lg px-3 py-3 shadow-xl animate-fadeIn">
            <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2 px-1">
              {isHi ? 'नेविगेशन सूची (सभी अनुभाग)' : 'All Sections'}
            </div>
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`flex items-center gap-2 p-2 rounded-xl text-left text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-100 text-amber-950 font-bold border border-amber-300 shadow-2xs'
                        : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900 border border-stone-100'
                    }`}
                  >
                    <div className={`p-1 rounded-lg ${isActive ? 'bg-amber-200 text-amber-900' : 'bg-stone-100 text-stone-600'}`}>
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                    </div>
                    <span className="truncate">{isHi ? item.hiLabel : item.enLabel}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Mobile Action Bar */}
            <div className="mt-3 pt-3 border-t border-stone-200 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDonate();
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-red-600 via-amber-700 to-amber-800 rounded-xl shadow-xs"
              >
                <Heart className="w-3.5 h-3.5 text-white fill-white" />
                <span>{isHi ? 'सहयोग व दान करें' : 'Support Samaj'}</span>
              </button>

              {isAdminLoggedIn ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenAdmin) onOpenAdmin();
                  }}
                  className="px-3 py-2 text-xs font-bold text-amber-950 bg-amber-300 border border-amber-400 rounded-xl"
                >
                  👑 एडमिन
                </button>
              ) : (
                onOpenAdmin && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAdmin();
                    }}
                    className="px-3 py-2 text-xs font-bold text-stone-700 bg-stone-100 border border-stone-300 rounded-xl"
                  >
                    🔒 एडमिन
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </header>

      {/* Universal Floating Sahyog / Dan Action Button - 100% VISIBLE ON ALL SCREENS (PC, Laptop, Mobile) */}
      <button
        type="button"
        onClick={onOpenDonate}
        className="fixed bottom-6 right-4 sm:right-6 z-40 bg-gradient-to-r from-red-600 via-amber-700 to-amber-800 hover:from-red-500 hover:to-amber-700 text-white text-xs sm:text-sm font-bold px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-full shadow-2xl flex items-center gap-1.5 sm:gap-2 ring-2 ring-white/90 active:scale-95 hover:scale-105 transition-all cursor-pointer"
        title={isHi ? 'विश्वकर्मा सहायता प्रकोष्ठ में सहयोग / दान करें' : 'Donate to Samaj Relief Fund'}
        aria-label="Sahyog ya Dan"
      >
        <Heart className="w-4 h-4 text-white fill-white animate-pulse shrink-0" />
        <span className="font-hindi">{isHi ? 'सहयोग / दान' : 'सहयोग करें'}</span>
      </button>
    </>
  );
};
