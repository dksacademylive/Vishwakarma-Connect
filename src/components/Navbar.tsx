import React from 'react';
import { NavTab, Language } from '../types';
import { Plus, User, Sparkles, Heart, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  onOpenDonate: () => void;
  onOpenCreatePost?: () => void;
  onOpenIdCard: () => void;
  onOpenAdmin?: () => void;
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
                विश्वकर्मा समाज
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

            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-amber-900 bg-amber-100/90 hover:bg-amber-200 border border-amber-300 rounded-lg transition-colors cursor-pointer"
                title="समाज प्रबंधक एवं एडमिन पोर्टल"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-800" />
                <span className="hidden sm:inline">प्रबंधक</span>
              </button>
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
        <div className="md:hidden flex items-center gap-3 py-2 overflow-x-auto text-xs font-medium text-stone-600 border-t border-stone-100 scrollbar-none">
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="whitespace-nowrap px-2.5 py-1 rounded bg-stone-900 text-amber-300 font-bold flex items-center gap-1 text-[11px]"
            >
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              <span>प्रबंधक</span>
            </button>
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
