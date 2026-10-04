import React, { useState } from 'react';
import { Post, Language, NavTab } from '../types';
import { HeroBanner } from './HeroBanner';
import { HomeEnhancements } from './HomeEnhancements';
import { DonationModal } from './DonationModal';
import { UPCOMING_EVENTS, ARTISANS_DATA } from '../data/mockData';
import { SamajEvent } from '../types';
import { FounderInfo, TeamMember } from '../data/homeData';
import {
  Heart,
  Calendar,
  Clock,
  MapPin,
  Award,
  PhoneCall,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Users,
  ShieldCheck,
  Check,
  Ticket
} from 'lucide-react';

interface HomePageProps {
  posts: Post[];
  events: SamajEvent[];
  onLikePost: (postId: string) => void;
  onOpenCreatePost: () => void;
  onNavigateTab: (tab: NavTab) => void;
  lang: Language;
  founderData?: FounderInfo;
  teamMembers?: TeamMember[];
}

export const HomePage: React.FC<HomePageProps> = ({
  posts,
  events,
  onLikePost,
  onOpenCreatePost,
  onNavigateTab,
  lang,
  founderData,
  teamMembers,
}) => {
  const isHi = lang === 'hi';
  const [isDonateOpen, setIsDonateOpen] = useState<boolean>(false);
  const displayEvents = events && events.length > 0 ? events : UPCOMING_EVENTS;

  const featuredArtisan = ARTISANS_DATA[0];

  return (
    <div className="space-y-12 animate-fadeIn pb-12">
      {/* 1. Grand Hero Banner */}
      <HeroBanner setActiveTab={onNavigateTab} lang={lang} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* ============================================================ */}
        {/* 2. REPLACED SPOTLIGHT SECTION (Hero के ठीक नीचे) */}
        {/* आगामी समाज आयोजन | सप्ताह का श्रेष्ठ शिल्पी | विश्वकर्मा बंधु सहायता प्रकोष्ठ */}
        {/* ============================================================ */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-stone-200 pb-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5 mb-1">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>राष्ट्रीय समाज मंच · Spotlight Showcase</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-stone-900">
                समाज आयोजन, शिल्पी गौरव एवं सहायता प्रकोष्ठ
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 font-hindi">
              सक्रिय सामाजिक सहभागिता, शिल्पकार प्रोत्साहन व परोपकार का त्रिवेणी संगम
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ---------------------------------------------------- */}
            {/* CARD 1: आगामी समाज आयोजन (Upcoming Events) */}
            {/* ---------------------------------------------------- */}
            <div className="bg-gradient-to-b from-white to-amber-50/40 border border-stone-200 rounded-3xl p-6 shadow-xs hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                      <Calendar className="w-4 h-4 text-amber-800" />
                    </div>
                    <div>
                      <h3 className="font-bold text-stone-900 text-base font-display">
                        आगामी समाज आयोजन
                      </h3>
                      <div className="text-[10px] text-stone-500">Upcoming Events</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-300">
                    महोत्सव 2026
                  </span>
                </div>

                <div className="space-y-3.5">
                  {displayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      onClick={() => onNavigateTab('events')}
                      className="p-3 bg-white rounded-xl border border-stone-200 hover:border-amber-400 hover:shadow-xs transition-all space-y-1.5 cursor-pointer group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-stone-900 leading-snug line-clamp-1 group-hover:text-amber-800 transition-colors">
                          {event.title}
                        </h4>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-stone-500 font-hindi">
                        <span className="flex items-center gap-1 font-mono text-amber-900 font-semibold">
                          <Clock className="w-3 h-3 text-stone-400" />
                          {event.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-stone-400" />
                          {event.city.split(',')[0]}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-stone-100">
                        <span className="text-[10px] text-emerald-800 font-bold">
                          {event.attendeesCount} बंधु अपेक्षित
                        </span>
                        <span className="text-[10px] text-amber-800 font-bold flex items-center gap-0.5 group-hover:underline">
                          <Ticket className="w-3 h-3 text-amber-700" />
                          <span>विवरण व ई-पास</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100">
                <button
                  onClick={() => onNavigateTab('events')}
                  className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>सभी समाज आयोजन व तिथियां देखें</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* ---------------------------------------------------- */}
            {/* CARD 2: सप्ताह का श्रेष्ठ शिल्पी (Artisan Spotlight) */}
            {/* ---------------------------------------------------- */}
            <div className="bg-gradient-to-b from-white to-amber-50/40 border border-stone-200 rounded-3xl p-6 shadow-xs hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                      <Award className="w-4 h-4 text-amber-800" />
                    </div>
                    <div>
                      <h3 className="font-bold text-stone-900 text-base font-display">
                        सप्ताह का श्रेष्ठ शिल्पी
                      </h3>
                      <div className="text-[10px] text-stone-500">Artisan of the Week</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    ★ 5.0 प्रमाणित
                  </span>
                </div>

                {featuredArtisan && (
                  <div className="space-y-3.5">
                    <div className="flex items-start gap-3.5">
                      <div className="relative">
                        <img
                          src={featuredArtisan.image}
                          alt={featuredArtisan.name}
                          referrerPolicy="no-referrer"
                          className="w-20 h-22 rounded-2xl object-cover border-2 border-amber-600 shadow-xs"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-amber-800 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                          28 वर्ष
                        </div>
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <h4 className="font-bold text-sm text-stone-900 truncate">
                          {featuredArtisan.name}
                        </h4>
                        <div className="text-xs text-amber-900 font-bold font-hindi">
                          {featuredArtisan.tradeLabelHi}
                        </div>
                        <div className="text-[11px] text-stone-500 font-hindi">
                          {featuredArtisan.city}, {featuredArtisan.state}
                        </div>
                        <div className="text-[10px] text-stone-600 pt-0.5 font-medium line-clamp-1">
                          {featuredArtisan.businessName}
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-xs text-stone-700 font-hindi space-y-1">
                      <div className="font-bold text-amber-950 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-700" />
                        <span>मुख्य कला व विशेषज्ञता:</span>
                      </div>
                      <p className="text-[11px] text-stone-600 leading-relaxed">
                        {featuredArtisan.specialization} (राम मंदिर मॉडल एवं सागवान नक्काशीदार भव्य द्वार)।
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <a
                        href={`https://wa.me/919829012345?text=${encodeURIComponent('नमस्ते रमेश जी, मैंने विश्वकर्मा समाज पोर्टल के होम पेज पर आपका श्रेष्ठ शिल्पी कार्य देखा।')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>व्हाट्सएप संपर्क</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-stone-100">
                <button
                  onClick={() => onNavigateTab('directory')}
                  className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>संपूर्ण कारीगर निर्देशिका खोलें</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* ---------------------------------------------------- */}
            {/* CARD 3: विश्वकर्मा बंधु सहायता प्रकोष्ठ (Relief & Donate) */}
            {/* ---------------------------------------------------- */}
            <div className="bg-gradient-to-br from-amber-900 via-amber-950 to-stone-950 text-white border-2 border-amber-500/70 rounded-3xl p-6 shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-5 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 w-44 h-44 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between border-b border-amber-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500 text-amber-950 flex items-center justify-center font-bold">
                      <Heart className="w-4 h-4 text-red-600 fill-red-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base font-display">
                        विश्वकर्मा बंधु सहायता प्रकोष्ठ
                      </h3>
                      <div className="text-[10px] text-amber-200/80">Welfare & Relief Fund</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-amber-300 bg-amber-900/80 px-2 py-0.5 rounded-full border border-amber-500/60">
                    80G आयकर छूट
                  </span>
                </div>

                <p className="text-xs text-stone-300 font-hindi leading-relaxed">
                  आपातकालीन चिकित्सा, रक्तदान, मेधावी छात्रवृत्ति एवं असहाय शिल्पियों के कल्याण हेतु समर्पित न्यास।
                </p>

                <div className="space-y-2 text-xs text-stone-200 font-hindi">
                  <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg border border-white/10">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>मेधावी बालक-बालिका उच्च शिक्षा छात्रवृत्ति</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg border border-white/10">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>आपातकालीन चिकित्सा व 24x7 रक्तदान कोष</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg border border-white/10">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>वृद्ध व दिव्यांग शिल्पी औजार व पेंशन सहयोग</span>
                  </div>
                </div>

                <div className="p-2.5 bg-black/40 rounded-xl border border-amber-700/50 flex items-center justify-between">
                  <span className="text-[11px] text-amber-300 font-hindi">हेल्पलाइन:</span>
                  <span className="text-xs font-mono font-bold text-white">+91 1800 233 4599</span>
                </div>
              </div>

              {/* Prominent Donate Now Button */}
              <div className="pt-2 relative z-10">
                <button
                  onClick={() => setIsDonateOpen(true)}
                  className="w-full py-3 bg-gradient-to-r from-red-600 via-amber-600 to-amber-700 hover:from-red-500 hover:to-amber-600 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all transform hover:scale-[1.02]"
                >
                  <Heart className="w-4 h-4 text-white fill-white" />
                  <span>सहयोग / दान करें (Donate Now)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 3. ALL REMAINING HOME SECTIONS */}
        {/* - 1. संस्थापक धर्मेन्द्र कुमार शर्मा (Founder) */}
        {/* - 2. केंद्रीय कार्यकारिणी एवं प्रमुख पदाधिकारी (Under Founder!) */}
        {/* - 3. हमारा संकल्प व दृष्टि 2030 (Mission & Vision) */}
        {/* - 4. विश्वकर्मा वंश गौरव विभूतियां (Hall of Fame) */}
        {/* - 5. ताज़ा समाज चर्चा एवं जन-संवाद (Shifted: ABOVE Blogs!) */}
        {/* - 6. वैदिक स्थापत्य, शिल्प विज्ञान एवं सामाजिक विचार (Blogs) */}
        {/* - 7. सोशल मीडिया नेटवर्क */}
        {/* ============================================================ */}
        <HomeEnhancements
          lang={lang}
          onOpenDonate={() => setIsDonateOpen(true)}
          onNavigateTab={onNavigateTab}
          posts={posts}
          onLikePost={onLikePost}
          onOpenCreatePost={onOpenCreatePost}
          founderData={founderData}
          teamMembers={teamMembers}
        />
      </div>

      {/* Donation & Relief Fund Modal (Live QR Code & Automatic A4 PDF Receipt) */}
      <DonationModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
        lang={lang}
      />
    </div>
  );
};
