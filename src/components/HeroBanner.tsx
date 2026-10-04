import React from 'react';
import { NavTab, Language } from '../types';
import { ShieldCheck, Compass, Users, HeartHandshake, ChevronRight, Award, Sparkles } from 'lucide-react';

interface HeroBannerProps {
  setActiveTab: (tab: NavTab) => void;
  lang: Language;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ setActiveTab, lang }) => {
  const isHi = lang === 'hi';

  return (
    <div className="relative bg-gradient-to-r from-[#23140a] via-[#331a0e] to-[#24130a] text-stone-100 overflow-hidden border-b border-amber-900/60 shadow-lg">
      {/* Background Image with Enhanced Dark Rich Overlay (Deepened as requested) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/src/assets/images/lord_vishwakarma_radiant_1791050449348.jpg"
          alt="Lord Vishwakarma Cosmic Architect"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-15 filter brightness-75 contrast-110 saturate-90"
        />
        {/* Darkening Scrims - Rich Dark Elegant Overlay */}
        <div className="absolute inset-0 bg-stone-950/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-[#100703]/96 to-stone-950/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-stone-950/85" />
        {/* Soft golden ambient radial light */}
        <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Heading, Context & Action Buttons */}
          <div className="lg:col-span-7 space-y-6">
            {/* Sacred metadata invocation */}
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-amber-300 tracking-wide">
              <span className="flex items-center gap-1.5 bg-amber-950/80 border border-amber-500/50 px-2.5 py-0.5 rounded-full shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>ॐ श्री विश्वकर्मणे नमः</span>
              </span>
              <span aria-hidden="true" className="text-amber-500">·</span>
              <span className="hidden sm:inline">शिल्पं सर्वकर्मसु कुशलम्</span>
              <span aria-hidden="true" className="text-amber-500 hidden sm:inline">·</span>
              <span className="text-amber-200">अखिल भारतीय महामंच</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-white font-display text-balance leading-tight drop-shadow-sm">
              {isHi ? (
                <>
                  शिल्प, संस्कार और शक्ति का <br className="hidden sm:inline" />
                  <span className="text-amber-300 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 bg-clip-text text-transparent">
                    अमर संगम — विश्वकर्मा समाज
                  </span>
                </>
              ) : (
                <>
                  Heritage of Craft & Vision — <br className="hidden sm:inline" />
                  <span className="text-amber-300 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 bg-clip-text text-transparent">
                    Vishwakarma Community Hub
                  </span>
                </>
              )}
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-stone-200 max-w-2xl leading-relaxed font-hindi">
              {isHi
                ? 'देवशिल्पी भगवान विश्वकर्मा के वंशजों का संयुक्त महामंच। सामाजिक विचार-विमर्श, पारंपरिक काष्ठ, लौह, स्वर्ण, पाषाण शिल्प व आधुनिक इंजीनियरिंग का संगम, विश्वसनीय वैवाहिक संबंध और समाज सेवा।'
                : 'The sovereign digital home for the artisan, engineering, architecture, and craftsmanship fraternity. Connect with community members, verified craftmasters, matrimonial matches, and sacred temples.'}
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
              <button
                onClick={() => setActiveTab('directory')}
                className="px-5 py-2.5 text-xs sm:text-sm font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer transform hover:scale-[1.02]"
              >
                <span>{isHi ? 'कारीगर व व्यवसाय निर्देशिका' : 'Explore Artisan Directory'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('matrimony')}
                className="px-5 py-2.5 text-xs sm:text-sm font-bold text-stone-100 bg-white/10 hover:bg-white/20 border border-amber-400/40 rounded-xl transition-all flex items-center gap-2 cursor-pointer backdrop-blur-2xs"
              >
                <span>{isHi ? 'विश्वकर्मा परिणय मंच' : 'Matrimonial Profiles'}</span>
              </button>

              <button
                onClick={() => setActiveTab('idcard')}
                className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-amber-300 hover:text-amber-200 transition-colors flex items-center gap-1.5 cursor-pointer underline-offset-4 hover:underline"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>{isHi ? 'पहचान पत्र बनाएं' : 'Get Samaj ID Card'}</span>
              </button>
            </div>

            {/* Proof / Quantitative Rigor with Tabular Numerals */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-amber-800/40">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums">
                  48,250+
                </div>
                <div className="text-xs text-amber-200/80 mt-0.5 font-hindi">
                  {isHi ? 'पंजीकृत समाज बंधु' : 'Community Members'}
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-bold text-amber-300 font-mono tabular-nums">
                  1,420+
                </div>
                <div className="text-xs text-amber-200/80 mt-0.5 font-hindi">
                  {isHi ? 'प्रमाणित कारीगर व उद्योग' : 'Verified Artisans'}
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums">
                  380+
                </div>
                <div className="text-xs text-amber-200/80 mt-0.5 font-hindi">
                  {isHi ? 'सफल वैवाहिक संबंध' : 'Matrimony Matches'}
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-bold text-amber-300 font-mono tabular-nums">
                  85+
                </div>
                <div className="text-xs text-amber-200/80 mt-0.5 font-hindi">
                  {isHi ? 'मंदिर व धर्मशालाएं' : 'Temples & Inns'}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Radiant, Bright & Attractive Portrait of Lord Vishwakarma */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative group max-w-sm sm:max-w-md w-full">
              {/* Outer Golden Aura Glow */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 rounded-3xl blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-700 animate-pulse pointer-events-none" />

              {/* Card Container */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#2e170b] via-[#3a1d0e] to-[#251208] border-2 border-amber-400/90 shadow-2xl p-2.5">
                {/* Image Container with high brightness and radiant golden border */}
                <div className="relative h-72 sm:h-84 lg:h-92 w-full rounded-2xl overflow-hidden border border-amber-300/80 bg-stone-900 shadow-inner">
                  <img
                    src="/src/assets/images/lord_vishwakarma_radiant_1791050449348.jpg"
                    alt="भगवान श्री विश्वकर्मा - देवाधिदेव एवं ब्रह्मांड के आदि शिल्पी"
                    className="w-full h-full object-cover object-center filter brightness-110 contrast-105 saturate-110 transform group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Subtle inner corner gold shine */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Top Floating Badge */}
                  <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-xs text-amber-300 text-[11px] font-bold px-3 py-1 rounded-full border border-amber-400/60 shadow-md flex items-center gap-1.5 font-hindi">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>सृष्टि के आदि शिल्पी</span>
                  </div>
                </div>

                {/* Bottom Inscription Ribbon */}
                <div className="pt-3 pb-1 text-center font-hindi space-y-0.5">
                  <div className="text-base sm:text-lg font-bold font-display text-amber-300 drop-shadow-sm flex items-center justify-center gap-2">
                    <span>ॐ श्री विश्वकर्मणे नमः</span>
                  </div>
                  <div className="text-xs text-amber-100/90 font-medium">
                    ब्रह्मांड के प्रथम वास्तुकार, शिल्प एवं तकनीकी प्रणेता भगवान विश्वकर्मा
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

