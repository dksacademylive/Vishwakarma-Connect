import React, { useState } from 'react';
import { Language, NavTab, Post } from '../types';
import {
  FOUNDER_DATA,
  MISSION_VISION_DATA,
  TEAM_MEMBERS,
  HALL_OF_FAME_DATA,
  COMMUNITY_BLOGS,
  SOCIAL_MEDIA_LINKS,
  CommunityBlog,
  FounderInfo,
  TeamMember
} from '../data/homeData';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Flame,
  Globe,
  Heart,
  Landmark,
  Mail,
  MapPin,
  Phone,
  Quote,
  Share2,
  Sparkles,
  Users,
  X,
  Youtube,
  MessageCircle,
  Facebook,
  Twitter,
  Instagram,
  Send,
  GraduationCap,
  Hammer,
  HeartHandshake,
  MessageSquare,
  Plus,
  ArrowRight
} from 'lucide-react';

interface HomeEnhancementsProps {
  lang: Language;
  onOpenDonate: () => void;
  onNavigateTab: (tab: NavTab) => void;
  posts?: Post[];
  onLikePost?: (postId: string) => void;
  onOpenCreatePost?: () => void;
  founderData?: FounderInfo;
  teamMembers?: TeamMember[];
}

export const HomeEnhancements: React.FC<HomeEnhancementsProps> = ({
  lang,
  onOpenDonate,
  onNavigateTab,
  posts = [],
  onLikePost,
  onOpenCreatePost,
  founderData,
  teamMembers,
}) => {
  const isHi = lang === 'hi';
  const currentFounder = founderData || FOUNDER_DATA;
  const currentTeam = teamMembers || TEAM_MEMBERS;
  const [selectedBlog, setSelectedBlog] = useState<CommunityBlog | null>(null);
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  // Helper for dynamic social icon
  const renderSocialIcon = (iconName: string) => {
    switch (iconName) {
      case 'Youtube':
        return <Youtube className="w-5 h-5 text-red-600" />;
      case 'MessageCircle':
        return <MessageCircle className="w-5 h-5 text-emerald-600" />;
      case 'Facebook':
        return <Facebook className="w-5 h-5 text-blue-600" />;
      case 'Twitter':
        return <Twitter className="w-5 h-5 text-stone-900" />;
      case 'Instagram':
        return <Instagram className="w-5 h-5 text-pink-600" />;
      case 'Send':
        return <Send className="w-5 h-5 text-sky-600" />;
      default:
        return <Globe className="w-5 h-5 text-amber-800" />;
    }
  };

  // Helper for pillar icons
  const renderPillarIcon = (iconName: string) => {
    switch (iconName) {
      case 'Hammer':
        return <Hammer className="w-5 h-5 text-amber-700" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-emerald-700" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5 text-red-700" />;
      case 'Landmark':
        return <Landmark className="w-5 h-5 text-amber-800" />;
      default:
        return <Sparkles className="w-5 h-5 text-amber-700" />;
    }
  };

  // Quick share for preview posts
  const handleShare = (post: Post) => {
    const shareText = `विश्वकर्मा समाज संदेश: "${post.content.slice(0, 100)}..."\nलेखक: ${post.author} (${post.city})`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopiedPostId(post.id);
      setTimeout(() => setCopiedPostId(null), 2500);
    }
  };

  return (
    <div className="space-y-14 pt-2">
      {/* ============================================================ */}
      {/* 1. FOUNDER NAME, PHOTO & INSPIRING MESSAGE (संस्थापक संदेश) */}
      {/* ============================================================ */}
      <section className="bg-gradient-to-br from-amber-50/90 via-stone-50 to-amber-100/50 border border-amber-200/90 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Founder Image & Badge Column */}
          <div className="lg:col-span-4 flex flex-col items-center text-center space-y-3">
            <div className="relative">
              <div className="w-48 h-56 sm:w-56 sm:h-64 rounded-2xl overflow-hidden border-4 border-amber-600 shadow-xl bg-amber-950 relative">
                <img
                  src={currentFounder.photo}
                  alt={currentFounder.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-amber-800 text-amber-100 text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap border border-amber-400 shadow-xs">
                {currentFounder.tenure}
              </div>
            </div>

            <div className="pt-2">
              <h3 className="text-xl font-bold font-display text-stone-900">
                {currentFounder.name}
              </h3>
              <p className="text-xs text-amber-900 font-semibold font-hindi mt-0.5">
                {currentFounder.designation}
              </p>
            </div>
          </div>

          {/* Founder Message Column */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider">
              <Quote className="w-4 h-4 text-amber-700" />
              <span>{isHi ? 'संस्थापक संरक्षक का प्रेरणादायी संदेश' : 'Inspiring Message from Founder Patron'}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold font-display text-stone-900 leading-tight">
              "{isHi ? 'ज्ञान, शिल्प और स्वाभिमान ही विश्वकर्मा समाज की शाश्वत पहचान है' : 'Knowledge, Craftsmanship and Dignity are the Eternal Identity of Vishwakarma Community'}"
            </h2>

            <div className="text-xs sm:text-sm text-stone-700 font-hindi leading-relaxed space-y-3">
              {currentFounder.message.split('\n\n').map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            <div className="p-3.5 bg-white/80 border border-amber-300 rounded-xl flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <blockquote className="text-xs sm:text-sm text-amber-950 font-bold font-hindi italic">
                "{currentFounder.quote}"
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. NATIONAL TEAM MEMBERS (संस्थापक के तुरंत नीचे कार्यकारिणी) */}
      {/* ============================================================ */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5 mb-1">
              <Users className="w-4 h-4 text-amber-700" />
              <span>{isHi ? 'संगठन व नेतृत्व · राष्ट्रीय कार्यकारिणी' : 'Organization & Leadership Council'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-stone-900">
              {isHi ? 'केंद्रीय कार्यकारिणी एवं प्रमुख पदाधिकारी' : 'Central Executive Committee & National Officers'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-hindi mt-1">
              {isHi
                ? 'अखिल भारतीय विश्वकर्मा समाज महासंघ के समर्पित राष्ट्रीय मार्गदर्शक व पदाधिकारी।'
                : 'Dedicated national leaders and office bearers of All India Vishwakarma Samaj Mahasangh.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentTeam.map((tm) => (
            <div
              key={tm.id}
              className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-20 h-24 rounded-xl overflow-hidden bg-stone-100 shrink-0 border-2 border-amber-600 shadow-xs">
                  <img
                    src={tm.photo}
                    alt={tm.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {isHi ? tm.postHi : (tm.postEn || tm.postHi)}
                  </span>
                  <h3 className="font-bold text-base text-stone-900 font-display">
                    {tm.name}
                  </h3>
                  <div className="text-xs text-stone-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-stone-400" />
                    <span>{tm.city}, {tm.state}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-stone-600 font-hindi leading-relaxed line-clamp-3">
                {tm.bio}
              </p>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
                {tm.phone && (
                  <span className="flex items-center gap-1 font-mono text-[11px]">
                    <Phone className="w-3 h-3 text-amber-800" />
                    <span>{tm.phone}</span>
                  </span>
                )}
                {tm.email && (
                  <span className="flex items-center gap-1 text-[11px] truncate max-w-[130px]">
                    <Mail className="w-3 h-3 text-stone-400" />
                    <span>{tm.email.split('@')[0]}</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. MISSION & VISION (हमारा संकल्प व दूरदर्शिता) */}
      {/* ============================================================ */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-800">
            लक्ष्य एवं दूरदर्शिता · Goals & Roadmaps
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-stone-900">
            हमारा पावन मिशन एवं दृष्टि 2030
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-hindi">
            परम पूज्य देवशिल्पी की कृपा से समाज के अंतिम बंधु तक विकास, सम्मान और प्रगति की धारा पहुंचाना हमारा संकल्प है।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mission Box */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs hover:border-amber-400 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-display font-bold text-lg border-b border-stone-100 pb-3">
                <Flame className="w-5 h-5 text-amber-700" />
                <span>{MISSION_VISION_DATA.mission.title}</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 font-hindi leading-relaxed font-medium">
                {MISSION_VISION_DATA.mission.statement}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {MISSION_VISION_DATA.mission.pillars.map((pil, idx) => (
                <div
                  key={idx}
                  className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-3.5 space-y-1"
                >
                  <div className="flex items-center gap-2 font-bold text-xs text-amber-950 font-hindi">
                    {renderPillarIcon(pil.icon)}
                    <span>{pil.title}</span>
                  </div>
                  <p className="text-[11px] text-stone-600 font-hindi leading-relaxed">
                    {pil.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Vision Box with 2030 Milestones */}
          <div className="bg-gradient-to-br from-stone-900 via-stone-950 to-amber-950 text-white rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs border border-amber-900/60 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-amber-300 font-display font-bold text-lg border-b border-stone-800 pb-3">
                <Globe className="w-5 h-5 text-amber-400" />
                <span>{MISSION_VISION_DATA.vision.title}</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-300 font-hindi leading-relaxed">
                {MISSION_VISION_DATA.vision.statement}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                विकास मील के पत्थर (Target Milestones):
              </h4>
              <div className="space-y-2.5">
                {MISSION_VISION_DATA.vision.milestones.map((m, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-3"
                  >
                    <span className="font-mono font-bold text-xs text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded shrink-0 border border-amber-700/60">
                      {m.year}
                    </span>
                    <span className="text-xs text-stone-300 font-hindi leading-relaxed">
                      {m.target}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. VISHWAKARMA HALL OF FAME (विश्वकर्मा वंश गौरव विभूतियां) */}
      {/* ============================================================ */}
      <section className="bg-gradient-to-br from-[#FFFDF7] via-amber-50/70 to-stone-100 text-stone-900 rounded-3xl p-6 sm:p-10 border border-amber-300/90 shadow-xs relative overflow-hidden space-y-8">
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
              <Award className="w-4 h-4 text-amber-800" />
              <span>विश्वकर्मा वंश गौरव · Hall of Fame</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-stone-900">
              इतिहास व आधुनिक युग के अमर शिल्पी व विभूतियां
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-hindi max-w-2xl leading-relaxed">
              जिन्होंने अपनी कला, स्थापत्य, वैज्ञानिक प्रतिभा और राष्ट्र निर्माण के योगदान से संपूर्ण विश्व में भारत और विश्वकर्मा कुल का परचम लहराया।
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('luminaries')}
            className="px-4 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer shrink-0"
          >
            <span>अधिक जानकारी व संपूर्ण सूची</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          {HALL_OF_FAME_DATA.map((person) => (
            <div
              key={person.id}
              className="bg-white/95 border border-amber-200/90 rounded-2xl p-6 hover:border-amber-400 hover:shadow-md transition-all space-y-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-20 h-24 rounded-xl overflow-hidden bg-amber-100 shrink-0 border-2 border-amber-300 shadow-xs">
                  <img
                    src={person.photo}
                    alt={person.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                    {person.era}
                  </span>
                  <h3 className="text-lg font-bold font-display text-stone-900">
                    {person.name}
                  </h3>
                  <div className="text-xs text-amber-800 font-hindi font-medium">
                    {person.title}
                  </div>
                </div>
              </div>

              <p className="text-xs text-stone-700 font-hindi leading-relaxed">
                {person.shortBio}
              </p>

              {/* Famous Works */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
                  प्रमुख ऐतिहासिक कृतियां:
                </div>
                <ul className="text-xs text-stone-700 space-y-1 font-hindi">
                  {person.famousWorks.map((work, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
                      <span>{work}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Honors Tags */}
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-stone-100">
                {person.honors.map((hon, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-300"
                  >
                    ★ {hon}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 text-center relative z-10 border-t border-amber-200">
          <button
            onClick={() => onNavigateTab('luminaries')}
            className="px-6 py-3 bg-white hover:bg-amber-50 text-amber-900 hover:text-amber-950 border border-amber-300 rounded-2xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <span>इतिहास व आधुनिक युग की और भी विभूतियों का संपूर्ण जीवन परिचय देखें</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. ताज़ा समाज चर्चा एवं जन-संवाद (शिफ्टेड: ब्लॉग सेक्शन के ऊपर) */}
      {/* केवल नवीनतम 3 संदेश झलक, बाकी सभी 'समाज चर्चा' पेज पर */}
      {/* ============================================================ */}
      <section className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-100 pb-5">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>लाइव समाज संवाद · Live Community Updates</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-stone-900">
              ताज़ा समाज चर्चा एवं जन-संवाद
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-hindi mt-1">
              केवल नवीनतम संदेश झलक। बाकी सभी विस्तृत चर्चाएं, टिप्पणियां व विचार <strong>'समाज चर्चा'</strong> पेज पर ही उपलब्ध हैं।
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigateTab('feed')}
              className="px-4 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <span>बाकी सभी चर्चाएं 'समाज चर्चा' पेज पर देखें</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {onOpenCreatePost && (
              <button
                onClick={onOpenCreatePost}
                className="px-3.5 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>नया संदेश लिखें</span>
              </button>
            )}
          </div>
        </div>

        {/* Latest 3 Messages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {posts.slice(0, 3).map((post) => (
            <div
              key={post.id}
              className="bg-stone-50/70 border border-stone-200 rounded-2xl p-5 hover:border-amber-400 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={post.avatar}
                    alt={post.author}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-amber-300 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-stone-900 truncate">
                      {post.author}
                    </div>
                    <div className="text-[11px] text-stone-500 flex items-center gap-1 font-hindi">
                      <span>{post.city}</span>
                      <span>·</span>
                      <span>{post.createdAt}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-stone-700 font-hindi leading-relaxed line-clamp-3">
                  {post.content}
                </p>

                {post.image && (
                  <div className="h-32 rounded-xl overflow-hidden border border-stone-200">
                    <img
                      src={post.image}
                      alt="Post media"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onLikePost && onLikePost(post.id)}
                    className={`flex items-center gap-1 font-semibold transition-colors cursor-pointer ${
                      post.isLiked ? 'text-red-600' : 'hover:text-red-600'
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        post.isLiked ? 'fill-red-600 text-red-600' : ''
                      }`}
                    />
                    <span>{post.likes}</span>
                  </button>

                  <button
                    onClick={() => onNavigateTab('feed')}
                    className="flex items-center gap-1 hover:text-amber-800 transition-colors cursor-pointer"
                    title="चर्चा में शामिल हों"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{post.comments.length}</span>
                  </button>

                  <button
                    onClick={() => handleShare(post)}
                    className="hover:text-amber-800 transition-colors cursor-pointer"
                    title="शेयर करें"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                  {copiedPostId === post.id && (
                    <span className="text-[10px] text-emerald-600 font-bold">कॉपी!</span>
                  )}
                </div>

                <button
                  onClick={() => onNavigateTab('feed')}
                  className="text-[11px] font-bold text-amber-800 hover:text-amber-900 flex items-center gap-0.5 cursor-pointer"
                >
                  <span>पढ़ें</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 text-center border-t border-stone-100">
          <button
            onClick={() => onNavigateTab('feed')}
            className="text-xs font-bold text-amber-800 hover:text-amber-900 inline-flex items-center gap-1.5 cursor-pointer hover:underline"
          >
            <span>समाज के और भी विचार, शिल्प कृतियां व संवाद पढ़ने हेतु 'समाज चर्चा' पेज पर पधारें</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. COMMUNITY BLOGS & RESEARCH ARTICLES (विचार प्रवाह) */}
      {/* ============================================================ */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5 mb-1">
              <BookOpen className="w-4 h-4 text-amber-700" />
              <span>ज्ञान व शोध आलेख · Community Blogs</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-stone-900">
              वैदिक स्थापत्य, शिल्प विज्ञान एवं सामाजिक विचार
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-hindi mt-1">
              समाज के प्रतिष्ठित विद्वानों, वास्तुविदों एवं शोधकर्ताओं द्वारा लिखे गए सारगर्भित लेख।
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COMMUNITY_BLOGS.map((blog) => (
            <div
              key={blog.id}
              className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-44 overflow-hidden relative">
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-amber-900/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-md backdrop-blur-xs">
                    {blog.category}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-stone-500">
                    <span>{blog.date}</span>
                    <span>{blog.readTime}</span>
                  </div>

                  <h3 className="font-bold text-base text-stone-900 font-display line-clamp-2 hover:text-amber-800 transition-colors">
                    {blog.title}
                  </h3>

                  <p className="text-xs text-stone-600 font-hindi leading-relaxed line-clamp-3">
                    {blog.summary}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-stone-100 flex items-center justify-between mt-3">
                <div className="text-xs font-semibold text-stone-800">
                  {blog.author.split('(')[0]}
                </div>
                <button
                  onClick={() => setSelectedBlog(blog)}
                  className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
                >
                  <span>पूरा पढ़ें</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. SOCIAL MEDIA CHANNELS (सोशल मीडिया कनेक्ट) */}
      {/* ============================================================ */}
      <section className="bg-stone-50 border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-800">
            डिजिटल संवाद नेटवर्क · Social Connect
          </div>
          <h2 className="text-2xl font-bold font-display text-stone-900">
            विश्वकर्मा समाज आधिकारिक सोशल मीडिया मंच
          </h2>
          <p className="text-xs text-stone-600 font-hindi">
            देश-विदेश के समाज बंधुओं, कार्यक्रमों और शिल्पकर्म से निरंतर जुड़े रहने हेतु हमारे आधिकारिक हैंडल्स को फॉलो व सब्सक्राइब करें।
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SOCIAL_MEDIA_LINKS.map((soc) => (
            <a
              key={soc.id}
              href={soc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-stone-200 rounded-2xl p-4 hover:border-amber-400 hover:shadow-xs transition-all flex items-start gap-3.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                {renderSocialIcon(soc.icon)}
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-stone-900 group-hover:text-amber-800 transition-colors">
                    {soc.name}
                  </h4>
                  <span className="text-[10px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded">
                    {soc.badge}
                  </span>
                </div>
                <p className="text-xs text-stone-600 font-hindi leading-relaxed line-clamp-2">
                  {soc.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* FULL BLOG READER MODAL */}
      {/* ============================================================ */}
      {selectedBlog && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-stone-200 max-h-[92vh] overflow-y-auto my-auto p-6 sm:p-8 space-y-4 font-hindi">
            <div className="flex items-start justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded">
                  {selectedBlog.category} · {selectedBlog.readTime}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-stone-900 mt-2">
                  {selectedBlog.title}
                </h3>
                <div className="text-xs text-stone-500 mt-1">
                  लेखक: <strong>{selectedBlog.author}</strong> ({selectedBlog.authorPost}) · {selectedBlog.date}
                </div>
              </div>
              <button
                onClick={() => setSelectedBlog(null)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="h-56 rounded-xl overflow-hidden">
              <img
                src={selectedBlog.coverImage}
                alt={selectedBlog.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-3 text-stone-700 leading-relaxed text-sm">
              <p className="font-semibold text-stone-900 bg-stone-50 p-3 rounded-xl border border-stone-200">
                {selectedBlog.summary}
              </p>
              {selectedBlog.content.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setSelectedBlog(null)}
                className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
