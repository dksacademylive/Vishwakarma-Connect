import React, { useState } from 'react';
import { Post, Language, NavTab } from '../types';
import { UPCOMING_EVENTS, ARTISANS_DATA } from '../data/mockData';
import { DonationModal } from './DonationModal';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Send, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Clock, 
  Award,
  PhoneCall,
  CheckCircle2,
  Image as ImageIcon,
  ChevronRight,
  Plus
} from 'lucide-react';

interface FeedSectionProps {
  posts: Post[];
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
  onOpenCreatePost: () => void;
  onSelectArtisan: (artisanId: string) => void;
  onNavigateTab?: (tab: NavTab) => void;
  lang: Language;
}

export const FeedSection: React.FC<FeedSectionProps> = ({
  posts,
  onLikePost,
  onAddComment,
  onOpenCreatePost,
  onSelectArtisan,
  onNavigateTab,
  lang,
}) => {
  const isHi = lang === 'hi';
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDonateOpen, setIsDonateOpen] = useState<boolean>(false);

  const filteredPosts = posts.filter((post) => {
    if (activeCategory === 'all') return true;
    return post.category === activeCategory;
  });

  const handleCommentSubmit = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = commentInputs[postId]?.trim();
    if (text) {
      onAddComment(postId, text);
      setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    }
  };

  const handleShare = (post: Post) => {
    const shareText = `विश्वकर्मा समाज संदेश: "${post.content.slice(0, 100)}..."\nलेखक: ${post.author} (${post.city})`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopiedId(post.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Dedicated Page Header for Samaj Charcha */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-6 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 tracking-wide mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>अखिल भारतीय विश्वकर्मा संवाद</span>
            <span aria-hidden="true">·</span>
            <span>जन-संवाद एवं शिल्प विमर्श मंच</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
            {isHi ? 'विश्वकर्मा समाज चर्चा एवं विचार मंच' : 'Vishwakarma Community Forum'}
          </h1>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl font-hindi leading-relaxed">
            {isHi
              ? 'समाज के प्रत्येक बंधु को अपने विचार, पारंपरिक शिल्प कलाकृतियां, सामाजिक समाचार व उत्सव संदेश साझा करने का समर्पित खुला मंच। (यहाँ लिखा गया संदेश तुरंत होम पेज पर भी दिखता है)'
              : 'The dedicated open forum for community discussions, artisan works, social news, and celebrations.'}
          </p>
        </div>

        <button
          onClick={onOpenCreatePost}
          className="px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isHi ? 'नया विचार / पोस्ट लिखें' : 'Create New Post'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Feed Column (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Quick Create Post Bar */}
          <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center shrink-0 text-sm">
                वि
              </div>
              <button
                onClick={onOpenCreatePost}
                className="w-full text-left px-4 py-2.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg text-sm text-stone-500 transition-colors cursor-pointer"
              >
                {isHi
                  ? 'समाज बंधुओं के साथ विचार, शिल्प या सूचना साझा करें...'
                  : 'Share an update, artisan craft, or news with the community...'}
              </button>
              <button
                onClick={onOpenCreatePost}
                className="p-2.5 text-stone-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer shrink-0"
                title="फोटो जोड़ें"
              >
                <ImageIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Interactive Category Filter Tabs (Single-line, functional controls) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-amber-900 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
              }`}
            >
              {isHi ? 'समस्त चर्चा' : 'All Updates'}
            </button>
            <button
              onClick={() => setActiveCategory('shilp')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeCategory === 'shilp'
                  ? 'bg-amber-900 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
              }`}
            >
              {isHi ? 'शिल्प व उद्योग' : 'Art & Business'}
            </button>
            <button
              onClick={() => setActiveCategory('utsav')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeCategory === 'utsav'
                  ? 'bg-amber-900 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
              }`}
            >
              {isHi ? 'उत्सव व जयंती' : 'Festivals & Events'}
            </button>
            <button
              onClick={() => setActiveCategory('youth')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeCategory === 'youth'
                  ? 'bg-amber-900 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
              }`}
            >
              {isHi ? 'युवा व शिक्षा' : 'Youth & Tech'}
            </button>
            <button
              onClick={() => setActiveCategory('social')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeCategory === 'social'
                  ? 'bg-amber-900 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
              }`}
            >
              {isHi ? 'सामाजिक गतिविधियां' : 'Social News'}
            </button>
          </div>

          {/* Posts List */}
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs hover:border-stone-300 transition-colors"
              >
                {/* Post Header */}
                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.avatar}
                        alt={post.author}
                        referrerPolicy="no-referrer"
                        className="w-11 h-11 rounded-full object-cover border border-stone-200 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-stone-900 text-sm sm:text-base">
                            {post.author}
                          </h3>
                          {post.badge && (
                            <span className="text-[11px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                              {post.badge}
                            </span>
                          )}
                        </div>
                        {/* Unboxed metadata discipline */}
                        <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-0.5">
                          <span>{post.roleOrGotra}</span>
                          <span aria-hidden="true">·</span>
                          <span>{post.city}</span>
                          <span aria-hidden="true">·</span>
                          <span>{post.createdAt}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <p className="text-stone-800 text-sm sm:text-base leading-relaxed whitespace-pre-line mb-4 font-hindi">
                    {post.content}
                  </p>
                </div>

                {/* Post Media (if any) */}
                {post.image && (
                  <div className="relative bg-stone-100 max-h-96 overflow-hidden border-y border-stone-100">
                    <img
                      src={post.image}
                      alt="Post visual"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover hover:scale-[1.01] transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Post Actions & Counts */}
                <div className="px-4 sm:px-5 py-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <div className="flex items-center gap-4">
                    <span className="tabular-nums font-mono">{post.likes} {isHi ? 'प्रशंसा' : 'Likes'}</span>
                    <span>·</span>
                    <span className="tabular-nums font-mono">{post.comments.length} {isHi ? 'विचार' : 'Comments'}</span>
                  </div>
                  {copiedId === post.id && (
                    <span className="text-emerald-700 font-medium">लिंक कॉपी हुआ!</span>
                  )}
                </div>

                <div className="px-4 sm:px-5 py-2.5 bg-stone-50/50 border-t border-stone-100 flex items-center justify-around gap-2">
                  <button
                    onClick={() => onLikePost(post.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                      post.isLiked
                        ? 'text-red-600 bg-red-50'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                    <span>{post.isLiked ? (isHi ? 'प्रशंसित' : 'Liked') : (isHi ? 'प्रशंसा करें' : 'Like')}</span>
                  </button>

                  <button
                    onClick={() =>
                      setActiveCommentPostId(
                        activeCommentPostId === post.id ? null : post.id
                      )
                    }
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{isHi ? 'टिप्पणी करें' : 'Comment'}</span>
                  </button>

                  <button
                    onClick={() => handleShare(post)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>{isHi ? 'साझा करें' : 'Share'}</span>
                  </button>
                </div>

                {/* Comments Section */}
                {activeCommentPostId === post.id && (
                  <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 space-y-4">
                    {/* Add Comment Input */}
                    <form
                      onSubmit={(e) => handleCommentSubmit(post.id, e)}
                      className="flex gap-2"
                    >
                      <input
                        type="text"
                        placeholder={isHi ? 'अपनी विनम्र टिप्पणी लिखें...' : 'Write a respectful comment...'}
                        value={commentInputs[post.id] || ''}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({
                            ...prev,
                            [post.id]: e.target.value,
                          }))
                        }
                        className="flex-1 bg-white border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-900 focus:outline-none focus:border-amber-700"
                      />
                      <button
                        type="submit"
                        disabled={!commentInputs[post.id]?.trim()}
                        className="px-4 py-2 bg-amber-800 disabled:bg-stone-300 text-white rounded-lg text-xs font-semibold hover:bg-amber-900 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isHi ? 'भेजें' : 'Post'}</span>
                      </button>
                    </form>

                    {/* Existing Comments */}
                    {post.comments.length > 0 ? (
                      <div className="space-y-3 pt-2">
                        {post.comments.map((comment) => (
                          <div
                            key={comment.id}
                            className="bg-white p-3 rounded-lg border border-stone-200 text-xs sm:text-sm"
                          >
                            <div className="flex items-center justify-between text-stone-500 mb-1">
                              <span className="font-semibold text-stone-800">
                                {comment.author} ({comment.city})
                              </span>
                              <span className="text-[11px]">{comment.timeAgo}</span>
                            </div>
                            <p className="text-stone-700 font-hindi">{comment.content}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-stone-400 text-center py-2">
                        {isHi ? 'अभी कोई टिप्पणी नहीं। पहला विचार आपका हो सकता है!' : 'No comments yet. Be the first to reply!'}
                      </p>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>

        {/* Sidebar Column (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Aaj Ka Vichar / Subhashita Card */}
          <div className="bg-amber-950 text-amber-50 rounded-xl p-5 shadow-xs border border-amber-900 relative overflow-hidden">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 mb-2">
              <Sparkles className="w-4 h-4" />
              <span>{isHi ? 'आज का शिल्प विचार' : 'Artisan Thought of the Day'}</span>
            </div>
            <blockquote className="text-sm font-hindi leading-relaxed text-amber-100 italic mb-3">
              "यथा काष्ठे च मणौ च शिल्पी रूपं प्रकाशयेत्। <br />
              तथा कर्मणि निष्ठावान् स्वकुलं समुद्धरेत्॥"
            </blockquote>
            <p className="text-xs text-amber-300/90 font-hindi leading-normal">
              {isHi
                ? 'अर्थ: जिस प्रकार कुशल शिल्पी साधारण काष्ठ अथवा पाषाण में दिव्य रूप प्रकट करता है, उसी प्रकार कर्मनिष्ठ व्यक्ति अपने ज्ञान और सदाचार से कुल को गौरवान्वित करता है।'
                : 'Just as a master artisan reveals divinity in raw wood and stone, a devoted craftsman elevates the community through discipline and integrity.'}
            </p>
          </div>

          {/* Upcoming Events Box */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-stone-900 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-800" />
                <span>{isHi ? 'आगामी समाज आयोजन' : 'Upcoming Community Events'}</span>
              </h3>
            </div>

            <div className="space-y-4">
              {UPCOMING_EVENTS.map((event) => (
                <div
                  key={event.id}
                  className="pb-3 border-b border-stone-100 last:border-b-0 last:pb-0"
                >
                  <h4 className="text-xs font-semibold text-stone-800 hover:text-amber-800 transition-colors">
                    {event.title}
                  </h4>
                  <div className="flex items-center gap-3 text-[11px] text-stone-500 mt-1">
                    <span className="flex items-center gap-1 font-mono tabular-nums">
                      <Clock className="w-3 h-3 text-stone-400" />
                      {event.date}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-stone-400" />
                      {event.city}
                    </span>
                  </div>
                  <div className="text-[11px] text-amber-800 font-medium mt-1">
                    {event.attendeesCount} {isHi ? 'बंधु सम्मिलित होंगे' : 'Expected Attendees'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Artisan Spotlight */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-stone-900 text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-800" />
                <span>{isHi ? 'सप्ताह का श्रेष्ठ शिल्पी' : 'Artisan Spotlight'}</span>
              </h3>
            </div>

            {ARTISANS_DATA[0] && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={ARTISANS_DATA[0].image}
                    alt={ARTISANS_DATA[0].name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-lg object-cover border border-stone-200"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-stone-900">
                      {ARTISANS_DATA[0].name}
                    </h4>
                    <p className="text-xs text-stone-500">
                      {ARTISANS_DATA[0].tradeLabelHi}
                    </p>
                    <div className="text-xs text-amber-700 font-medium">
                      ★ {ARTISANS_DATA[0].rating} ({ARTISANS_DATA[0].experienceYears} वर्ष अनुभव)
                    </div>
                  </div>
                </div>

                <p className="text-xs text-stone-600 line-clamp-2">
                  {ARTISANS_DATA[0].specialization}
                </p>

                <div className="pt-2">
                  <a
                    href={`https://wa.me/919829012345?text=${encodeURIComponent('नमस्ते रमेश जी, मैंने विश्वकर्मा समाज पोर्टल पर आपका काष्ठशिल्प कार्य देखा।')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-stone-700" />
                    <span>{isHi ? 'कारीगर से सीधा संपर्क' : 'Direct Contact'}</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Samaj Helpline & Vishwakarma Bandhu Sahayata Prakosth Box with Donate Now */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-5 text-xs text-stone-700 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="font-bold text-amber-950 text-sm flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-red-600 fill-red-600 shrink-0" />
                <span>{isHi ? 'विश्वकर्मा बंधु सहायता प्रकोष्ठ' : 'Samaj Relief & Support Fund'}</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                80G छूट मान्य
              </span>
            </div>

            <p className="text-stone-600 leading-relaxed font-hindi">
              {isHi
                ? 'आपातकालीन चिकित्सा, रक्तदान, मेधावी छात्रवृत्ति एवं असहाय शिल्पियों के कल्याण हेतु समर्पित सामाजिक कोष।'
                : 'Dedicated welfare fund for medical emergencies, student scholarships, and artisan relief.'}
            </p>

            <div className="p-2.5 bg-white/90 rounded-xl border border-amber-200 space-y-1">
              <div className="text-[11px] text-stone-500 font-hindi">24x7 राष्ट्रीय सहायता हेल्पलाइन:</div>
              <div className="text-amber-950 font-bold font-mono text-sm flex items-center gap-1">
                <PhoneCall className="w-3.5 h-3.5 text-amber-800" />
                <span>+91 1800 233 4599</span>
              </div>
            </div>

            {/* Prominent Donate Now Button */}
            <button
              onClick={() => setIsDonateOpen(true)}
              className="w-full py-2.5 bg-gradient-to-r from-red-600 via-amber-700 to-amber-800 hover:from-red-500 hover:to-amber-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all transform hover:scale-[1.02]"
            >
              <Heart className="w-4 h-4 text-white fill-white" />
              <span>{isHi ? 'सहयोग / दान करें (Donate Now)' : 'Donate to Relief Fund'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Donation & Relief Fund Modal (QR Code & A4 PDF Receipt) */}
      <DonationModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
        lang={lang}
      />
    </div>
  );
};
