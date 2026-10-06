import React from 'react';
import { NavTab, Language } from '../types';
import { Plus, User, Sparkles, Heart, ShieldCheck, Lock, LogOut } from 'lucide-react';

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

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Brand title, one line (Single text element wordmark) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('home')}
              className="text-left group cursor-pointer focus:outline-none"
            >
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-amber-900 group-hover:text-amber-800 transition-colors font-display">
                {isHi ? 'विश्वकर्मा समाज' : 'Vishwakarma Samaj'}
              </span>
            </button>
          </div>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-7 text-sm font-medium text-stone-600">
            <button
              onClick={() => setActiveTab('home')}
              className={`pb-1 transition-colors relative focus:outline-none cursor-pointer ${
                activeTab === 'home'
                  ? 'text-amber-900 font-semibold border-b-2 border-amber-800'
                  : 'hover:text-stone-900'
              }`}
            >
              {isHi ? 'मुख्य पृष्ठ' : 'Home'}
            </button>

            <button
              onClick={() => setActiveTab('feed')}
              className={`pb-1 transition-colors relative focus:outline-none cursor-pointer ${
                activeTab === 'feed'
                  ? 'text-amber-900 font-semibold border-b-2 border-amber-800'
                  : 'hover:text-stone-900'
              }`}
            >
              <span>{isHi ? 'समाज चर्चा' : 'Social Feed'}</span>
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`pb-1 transition-colors relative focus:outline-none cursor-pointer ${
                activeTab === 'events'
                  ? 'text-amber-900 font-semibold border-b-2 border-amber-800'
                  : 'hover:text-stone-900'
              }`}
            >
              {isHi ? 'समाज आयोजन' : 'Events'}
            </button>

            <button
              onClick={() => setActiveTab('directory')}
              className={`pb-1 transition-colors relative focus:outline-none cursor-pointer ${
                activeTab === 'directory'
                  ? 'text-amber-900 font-semibold border-b-2 border-amber-800'
                  : 'hover:text-stone-900'
              }`}
            >
              {isHi ? 'शिल्प व व्यापार' : 'Artisans & Trade'}
            </button>

            <button
              onClick={() => setActiveTab('matrimony')}
              className={`pb-1 transition-colors relative focus:outline-none cursor-pointer ${
                activeTab === 'matrimony'
                  ? 'text-amber-900 font-semibold border-b-2 border-amber-800'
                  : 'hover:text-stone-900'
              }`}
            >
              {isHi ? 'परिणय मंच' : 'Matrimonial'}
            </button>

            <button
              onClick={() => setActiveTab('heritage')}
              className={`pb-1 transition-colors relative focus:outline-none cursor-pointer ${
                activeTab === 'heritage'
                  ? 'text-amber-900 font-semibold border-b-2 border-amber-800'
                  : 'hover:text-stone-900'
              }`}
            >
              {isHi ? 'तीर्थ, इतिहास व पुराण' : 'Heritage & Scriptures'}
            </button>

            <button
              onClick={() => setActiveTab('luminaries')}
              className={`pb-1 transition-colors relative focus:outline-none cursor-pointer ${
                activeTab === 'luminaries'
                  ? 'text-amber-900 font-semibold border-b-2 border-amber-800'
                  : 'hover:text-stone-900'
              }`}
            >
              {isHi ? 'अमर विभूतियां' : 'Luminaries'}
            </button>

            <button
              onClick={() => setActiveTab('youth')}
              className={`pb-1 transition-colors relative focus:outline-none cursor-pointer ${
                activeTab === 'youth'
                  ? 'text-amber-900 font-semibold border-b-2 border-amber-800'
                  : 'hover:text-stone-900'
              }`}
            >
              {isHi ? 'युवा व शिक्षा' : 'Youth & Jobs'}
            </button>

            <button
              onClick={() => setActiveTab('idcard')}
              className={`pb-1 transition-colors relative focus:outline-none cursor-pointer ${
                activeTab === 'idcard'
                  ? 'text-amber-900 font-semibold border-b-2 border-amber-800'
                  : 'hover:text-stone-900'
              }`}
            >
              {isHi ? 'पहचान पत्र' : 'Samaj ID Card'}
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setLang(isHi ? 'en' : 'hi')}
              className="px-2.5 py-1 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded transition-colors"
              title="भाषा बदलें"
            >
              {isHi ? 'English' : 'हिंदी'}
            </button>

            {isAdminLoggedIn ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onOpenAdmin}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 hover:from-amber-200 hover:to-amber-300 border border-amber-500 rounded-lg shadow-2xs transition-all cursor-pointer animate-pulse-subtle"
                  title={isHi ? 'केंद्रीय एडमिन कंट्रोल पैनल' : 'Master Admin Suite'}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-950" />
                  <span>{isHi ? '👑 एडमिन पैनल' : '👑 Admin Suite'}</span>
                </button>
                {onLogoutAdmin && (
                  <button
                    onClick={onLogoutAdmin}
                    className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-semibold text-red-700 hover:text-red-900 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    title={isHi ? 'एडमिन मोड से लॉगआउट करें (पब्लिक प्रीव्यू देखें)' : 'Logout (View Public Preview)'}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{isHi ? 'लॉगआउट' : 'Logout'}</span>
                  </button>
                )}
              </div>
            ) : (
              onOpenAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 hover:from-amber-200 hover:to-amber-300 border border-amber-500 rounded-lg shadow-2xs transition-all cursor-pointer whitespace-nowrap"
                  title={isHi ? 'प्रबंधक लॉगिन (पासकोड: 1234)' : 'Admin Login (PIN: 1234)'}
                >
                  <Lock className="w-3.5 h-3.5 text-amber-950" />
                  <span>{isHi ? '👑 एडमिन लॉगिन' : '👑 Admin'}</span>
                </button>
              )
            )}

            <button
              onClick={onOpenDonate}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-red-600 via-amber-700 to-amber-800 hover:from-red-500 hover:to-amber-700 rounded-lg shadow-sm transition-all whitespace-nowrap cursor-pointer transform hover:scale-[1.02]"
              title={isHi ? 'विश्वकर्मा सहायता प्रकोष्ठ में सहयोग / दान करें' : 'Donate to Samaj Relief Fund'}
            >
              <Heart className="w-3.5 h-3.5 text-white fill-white" />
              <span>{isHi ? 'सहयोग / दान करें' : 'Donate Now'}</span>
            </button>
          </div>
        </div>

        {/* Mobile secondary navigation strip */}
        <div className="md:hidden flex items-center gap-2 py-2 overflow-x-auto text-xs font-medium text-stone-600 border-t border-stone-100 scrollbar-none">
          {isAdminLoggedIn ? (
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={onOpenAdmin}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-amber-400 text-stone-950 font-bold flex items-center gap-1 text-[11px]"
              >
                <ShieldCheck className="w-3 h-3 text-stone-950" />
                <span>{isHi ? '👑 एडमिन' : '👑 Admin'}</span>
              </button>
              {onLogoutAdmin && (
                <button
                  onClick={onLogoutAdmin}
                  className="whitespace-nowrap px-2 py-1 rounded-lg bg-red-100 text-red-800 font-bold text-[10px]"
                >
                  {isHi ? 'लॉगआउट' : 'Exit'}
                </button>
              )}
            </div>
          ) : (
            onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold flex items-center gap-1 text-[11px] shrink-0 border border-amber-500/80 shadow-2xs cursor-pointer"
                title={isHi ? 'प्रबंधक लॉगिन (पासकोड: 1234)' : 'Admin Login (PIN: 1234)'}
              >
                <Lock className="w-3 h-3 text-stone-950" />
                <span>{isHi ? '👑 एडमिन लॉगिन' : '👑 Admin'}</span>
              </button>
            )
          )}
          <button
            onClick={() => setActiveTab('home')}
            className={`whitespace-nowrap px-2.5 py-1 rounded ${
              activeTab === 'home' ? 'bg-amber-100 text-amber-900 font-semibold' : ''
            }`}
          >
            {isHi ? 'होम' : 'Home'}
          </button>
          <button
            onClick={() => setActiveTab('feed')}
            className={`whitespace-nowrap px-2.5 py-1 rounded ${
              activeTab === 'feed' ? 'bg-amber-100 text-amber-900 font-semibold' : ''
            }`}
          >
            <span>{isHi ? 'चर्चा' : 'Feed'}</span>
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`whitespace-nowrap px-2.5 py-1 rounded ${
              activeTab === 'events' ? 'bg-amber-100 text-amber-900 font-semibold' : ''
            }`}
          >
            {isHi ? 'आयोजन' : 'Events'}
          </button>
          <button
            onClick={() => setActiveTab('directory')}
            className={`whitespace-nowrap px-2 py-1 rounded ${
              activeTab === 'directory' ? 'bg-amber-100 text-amber-900 font-semibold' : ''
            }`}
          >
            {isHi ? 'कारीगर निर्देशिका' : 'Directory'}
          </button>
          <button
            onClick={() => setActiveTab('matrimony')}
            className={`whitespace-nowrap px-2 py-1 rounded ${
              activeTab === 'matrimony' ? 'bg-amber-100 text-amber-900 font-semibold' : ''
            }`}
          >
            {isHi ? 'परिणय' : 'Matrimony'}
          </button>
          <button
            onClick={() => setActiveTab('heritage')}
            className={`whitespace-nowrap px-2 py-1 rounded ${
              activeTab === 'heritage' ? 'bg-amber-100 text-amber-900 font-semibold' : ''
            }`}
          >
            {isHi ? 'तीर्थ, कथा व पुराण' : 'Heritage & Scriptures'}
          </button>
          <button
            onClick={() => setActiveTab('luminaries')}
            className={`whitespace-nowrap px-2 py-1 rounded ${
              activeTab === 'luminaries' ? 'bg-amber-100 text-amber-900 font-semibold' : ''
            }`}
          >
            {isHi ? 'अमर विभूतियां' : 'Luminaries'}
          </button>
          <button
            onClick={() => setActiveTab('youth')}
            className={`whitespace-nowrap px-2 py-1 rounded ${
              activeTab === 'youth' ? 'bg-amber-100 text-amber-900 font-semibold' : ''
            }`}
          >
            {isHi ? 'युवा मंच' : 'Youth'}
          </button>
          <button
            onClick={() => setActiveTab('idcard')}
            className={`whitespace-nowrap px-2 py-1 rounded ${
              activeTab === 'idcard' ? 'bg-amber-100 text-amber-900 font-semibold' : ''
            }`}
          >
            {isHi ? 'पहचान पत्र' : 'ID Card'}
          </button>
        </div>
      </div>
    </header>
  );
};
