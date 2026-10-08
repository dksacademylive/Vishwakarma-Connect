import React, { useState } from 'react';
import {
  NavTab,
  Language,
  Post,
  Artisan,
  SamajEvent,
  OrgContactInfo,
  JobItem,
  ScholarshipItem,
  WorkshopItem,
  DonationConfig,
  IdCardFormConfig,
  MatrimonyFormConfig,
  ArtisanFormConfig,
  PostFormConfig
} from './types';
import { INITIAL_POSTS, ARTISANS_DATA, UPCOMING_EVENTS } from './data/mockData';
import { HALL_OF_FAME_DATA, HallOfFamePerson, FOUNDER_DATA, TEAM_MEMBERS, FounderInfo, TeamMember } from './data/homeData';
import {
  DEFAULT_JOBS,
  DEFAULT_SCHOLARSHIPS,
  DEFAULT_WORKSHOPS,
  DEFAULT_DONATION_CONFIG,
  DEFAULT_IDCARD_CONFIG,
  DEFAULT_MATRIMONY_CONFIG,
  DEFAULT_ARTISAN_CONFIG,
  DEFAULT_POST_CONFIG
} from './data/formsData';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { FeedSection } from './components/FeedSection';
import { EventsSection } from './components/EventsSection';
import { ArtisanDirectory } from './components/ArtisanDirectory';
import { MatrimonialSection } from './components/MatrimonialSection';
import { HeritageAndTemples } from './components/HeritageAndTemples';
import { LuminariesSection } from './components/LuminariesSection';
import { YouthAndJobs } from './components/YouthAndJobs';
import { IdCardGenerator } from './components/IdCardGenerator';
import { CreatePostModal } from './components/CreatePostModal';
import { DonationModal } from './components/DonationModal';
import { AdminPanelModal, type AdminTab } from './components/AdminPanelModal';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [lang, setLang] = useState<Language>('hi');
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [artisans, setArtisans] = useState<Artisan[]>(ARTISANS_DATA);
  const [events, setEvents] = useState<SamajEvent[]>(() => {
    try {
      const saved = localStorage.getItem('vsm_events');
      return saved ? JSON.parse(saved) : UPCOMING_EVENTS;
    } catch {
      return UPCOMING_EVENTS;
    }
  });
  const [luminaries, setLuminaries] = useState<HallOfFamePerson[]>(() => {
    try {
      const saved = localStorage.getItem('vsm_luminaries');
      return saved ? JSON.parse(saved) : HALL_OF_FAME_DATA;
    } catch {
      return HALL_OF_FAME_DATA;
    }
  });
  const [isCreatePostOpen, setIsCreatePostOpen] = useState<boolean>(false);
  const [isDonateOpen, setIsDonateOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [adminInitialTab, setAdminInitialTab] = useState<AdminTab>('applications');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('vsm_admin_logged_in') === 'true';
    } catch {
      return false;
    }
  });

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    try {
      localStorage.setItem('vsm_admin_logged_in', 'true');
    } catch (e) {
      console.warn(e);
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    try {
      localStorage.removeItem('vsm_admin_logged_in');
    } catch (e) {
      console.warn(e);
    }
  };

  // Only expose admin editing triggers to sections when Admin is actively logged in!
  const adminEditHandler = isAdminLoggedIn ? () => setIsAdminOpen(true) : undefined;

  // Administrative Editable States (President, Team, Contacts)
  const [founderData, setFounderData] = useState<FounderInfo>(() => {
    try {
      const saved = localStorage.getItem('vsm_founder');
      return saved ? JSON.parse(saved) : FOUNDER_DATA;
    } catch {
      return FOUNDER_DATA;
    }
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    try {
      const saved = localStorage.getItem('vsm_team');
      return saved ? JSON.parse(saved) : TEAM_MEMBERS;
    } catch {
      return TEAM_MEMBERS;
    }
  });

  const [orgContact, setOrgContact] = useState<OrgContactInfo>(() => {
    try {
      const saved = localStorage.getItem('vsm_contact');
      return saved
        ? JSON.parse(saved)
        : {
            address: 'केंद्रीय विश्वकर्मा भवन, 12-B, शिल्पकार मार्ग, नई दिल्ली - 110001',
            helpline: '1800 233 4599 (टोल-फ्री)',
            email: 'sampark@vishwakarmasamaj.org',
            emergencyPhone: '+91 98290 99881',
            regNumber: 'DL/SOC/2018/8842',
            bankUpi: 'vishwakarmatrust@sbi',
            youtube: 'https://youtube.com/@vishwakarmasamaj',
            facebook: 'https://facebook.com/vishwakarmasamajconnect',
            whatsapp: 'https://wa.me/919829099881',
            instagram: 'https://instagram.com/vishwakarmasamaj',
            twitter: 'https://x.com/vishwakarmaorg',
            telegram: 'https://t.me/vishwakarmasamaj',
          };
    } catch {
      return {
        address: 'केंद्रीय विश्वकर्मा भवन, 12-B, शिल्पकार मार्ग, नई दिल्ली - 110001',
        helpline: '1800 233 4599 (टोल-फ्री)',
        email: 'sampark@vishwakarmasamaj.org',
        emergencyPhone: '+91 98290 99881',
        regNumber: 'DL/SOC/2018/8842',
        bankUpi: 'vishwakarmatrust@sbi',
        youtube: 'https://youtube.com/@vishwakarmasamaj',
        facebook: 'https://facebook.com/vishwakarmasamajconnect',
        whatsapp: 'https://wa.me/919829099881',
        instagram: 'https://instagram.com/vishwakarmasamaj',
        twitter: 'https://x.com/vishwakarmaorg',
        telegram: 'https://t.me/vishwakarmasamaj',
      };
    }
  });

  // All Forms Editable States (Persisted & Admin-Controllable)
  const [donationConfig, setDonationConfig] = useState<DonationConfig>(() => {
    try {
      const saved = localStorage.getItem('vsm_donation');
      return saved ? JSON.parse(saved) : DEFAULT_DONATION_CONFIG;
    } catch {
      return DEFAULT_DONATION_CONFIG;
    }
  });

  const [jobs, setJobs] = useState<JobItem[]>(() => {
    try {
      const saved = localStorage.getItem('vsm_jobs');
      return saved ? JSON.parse(saved) : DEFAULT_JOBS;
    } catch {
      return DEFAULT_JOBS;
    }
  });

  const [scholarships, setScholarships] = useState<ScholarshipItem[]>(() => {
    try {
      const saved = localStorage.getItem('vsm_scholarships');
      return saved ? JSON.parse(saved) : DEFAULT_SCHOLARSHIPS;
    } catch {
      return DEFAULT_SCHOLARSHIPS;
    }
  });

  const [workshops, setWorkshops] = useState<WorkshopItem[]>(() => {
    try {
      const saved = localStorage.getItem('vsm_workshops');
      return saved ? JSON.parse(saved) : DEFAULT_WORKSHOPS;
    } catch {
      return DEFAULT_WORKSHOPS;
    }
  });

  const [idCardConfig, setIdCardConfig] = useState<IdCardFormConfig>(() => {
    try {
      const saved = localStorage.getItem('vsm_idcard_config');
      return saved ? JSON.parse(saved) : DEFAULT_IDCARD_CONFIG;
    } catch {
      return DEFAULT_IDCARD_CONFIG;
    }
  });

  const [matrimonyConfig, setMatrimonyConfig] = useState<MatrimonyFormConfig>(() => {
    try {
      const saved = localStorage.getItem('vsm_matrimony_config');
      return saved ? JSON.parse(saved) : DEFAULT_MATRIMONY_CONFIG;
    } catch {
      return DEFAULT_MATRIMONY_CONFIG;
    }
  });

  const [artisanConfig, setArtisanConfig] = useState<ArtisanFormConfig>(() => {
    try {
      const saved = localStorage.getItem('vsm_artisan_config');
      return saved ? JSON.parse(saved) : DEFAULT_ARTISAN_CONFIG;
    } catch {
      return DEFAULT_ARTISAN_CONFIG;
    }
  });

  const [postConfig, setPostConfig] = useState<PostFormConfig>(() => {
    try {
      const saved = localStorage.getItem('vsm_post_config');
      return saved ? JSON.parse(saved) : DEFAULT_POST_CONFIG;
    } catch {
      return DEFAULT_POST_CONFIG;
    }
  });

  // Like a post
  const handleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isLiked = !post.isLiked;
          return {
            ...post,
            isLiked,
            likes: isLiked ? post.likes + 1 : Math.max(0, post.likes - 1),
          };
        }
        return post;
      })
    );
  };

  // Add a comment to a post
  const handleAddComment = (postId: string, commentText: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const newComment = {
            id: `cmt-${Date.now()}`,
            author: 'आप (पंजीकृत बंधु)',
            city: 'समाज सदस्य',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
            content: commentText,
            timeAgo: 'अभी-अभी',
          };
          return {
            ...post,
            comments: [newComment, ...post.comments],
          };
        }
        return post;
      })
    );
  };

  // Add a new post
  const handleAddPost = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  // Add a new artisan to directory
  const handleAddArtisan = (newArtisan: Artisan) => {
    setArtisans((prev) => [newArtisan, ...prev]);
  };

  // Add a new event
  const handleAddEvent = (newEvent: SamajEvent) => {
    setEvents((prev) => [newEvent, ...prev]);
  };

  // Add a new luminary / amar shilpi
  const handleAddLuminary = (newLuminary: HallOfFamePerson) => {
    setLuminaries((prev) => {
      const updated = [newLuminary, ...prev];
      try {
        localStorage.setItem('vsm_luminaries', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
  };

  const handleUpdateLuminaries = (newList: HallOfFamePerson[]) => {
    setLuminaries(newList);
    try {
      localStorage.setItem('vsm_luminaries', JSON.stringify(newList));
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        onOpenDonate={() => setIsDonateOpen(true)}
        onOpenCreatePost={() => setIsCreatePostOpen(true)}
        onOpenIdCard={() => setActiveTab('idcard')}
        onOpenAdmin={() => setIsAdminOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
        onLogoutAdmin={handleAdminLogout}
      />

      {/* Prominent Admin Mode Banner: ONLY visible when Admin is logged in */}
      {isAdminLoggedIn && (
        <div className="bg-stone-900 text-amber-200 border-b border-amber-600/50 px-4 py-2.5 flex flex-wrap items-center justify-between text-xs font-semibold z-30 sticky top-16 shadow-md font-hindi animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-amber-300 font-bold text-xs sm:text-sm">
              {lang === 'hi' ? '👑 एडमिन मोड सक्रिय (Admin Mode Active)' : '👑 Admin Mode Active'}
            </span>
            <span className="text-stone-300 hidden md:inline text-xs">
              {lang === 'hi'
                ? '— सभी फॉर्म सेटिंग्स व संपादन विकल्प सक्रिय हैं। आम जनता का व्यू देखने हेतु लॉगआउट करें।'
                : '— All management controls & form options are active. Logout to view public preview.'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAdminOpen(true)}
              className="px-3 py-1 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 rounded-lg font-bold transition-all shadow-2xs cursor-pointer text-xs"
            >
              {lang === 'hi' ? 'एडमिन डैशबोर्ड खोलें' : 'Open Admin Suite'}
            </button>
            <button
              onClick={handleAdminLogout}
              className="px-2.5 py-1 bg-red-950/90 hover:bg-red-900 border border-red-500/50 text-red-200 rounded-lg transition-colors cursor-pointer text-xs font-medium"
              title="एडमिन सत्र समाप्त कर पब्लिक प्रीव्यू देखें"
            >
              {lang === 'hi' ? 'लॉगआउट (पब्लिक प्रीव्यू)' : 'Logout (Public)'}
            </button>
          </div>
        </div>
      )}

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage
            posts={posts}
            events={events}
            onLikePost={handleLikePost}
            onOpenCreatePost={() => setIsCreatePostOpen(true)}
            onNavigateTab={setActiveTab}
            lang={lang}
            founderData={founderData}
            teamMembers={teamMembers}
            orgContact={orgContact}
          />
        )}

        {activeTab === 'feed' && (
          <FeedSection
            posts={posts}
            onLikePost={handleLikePost}
            onAddComment={handleAddComment}
            onOpenCreatePost={() => setIsCreatePostOpen(true)}
            onSelectArtisan={() => setActiveTab('directory')}
            onNavigateTab={setActiveTab}
            lang={lang}
          />
        )}

        {activeTab === 'events' && (
          <EventsSection
            events={events}
            onAddEvent={handleAddEvent}
            lang={lang}
          />
        )}

        {activeTab === 'directory' && (
          <ArtisanDirectory
            artisans={artisans}
            onAddArtisan={handleAddArtisan}
            lang={lang}
            artisanConfig={artisanConfig}
            onOpenAdmin={adminEditHandler}
          />
        )}

        {activeTab === 'matrimony' && (
          <MatrimonialSection
            lang={lang}
            matrimonyConfig={matrimonyConfig}
            onOpenAdmin={adminEditHandler}
          />
        )}

        {activeTab === 'heritage' && (
          <HeritageAndTemples lang={lang} />
        )}

        {activeTab === 'luminaries' && (
          <LuminariesSection
            luminaries={luminaries}
            onAddLuminary={handleAddLuminary}
            lang={lang}
            isAdminLoggedIn={isAdminLoggedIn}
            onOpenAdmin={() => {
              setAdminInitialTab('luminaries');
              setIsAdminOpen(true);
            }}
          />
        )}

        {activeTab === 'youth' && (
          <YouthAndJobs
            lang={lang}
            onOpenAdmin={adminEditHandler}
            jobs={jobs}
            scholarships={scholarships}
            workshops={workshops}
          />
        )}

        {activeTab === 'idcard' && (
          <IdCardGenerator
            lang={lang}
            idCardConfig={idCardConfig}
            onOpenAdmin={adminEditHandler}
          />
        )}
      </main>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onAddPost={handleAddPost}
        lang={lang}
        postConfig={postConfig}
        onOpenAdmin={adminEditHandler}
      />

      {/* Global Donation & Relief Fund Modal */}
      <DonationModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
        lang={lang}
        donationConfig={donationConfig}
        onOpenAdmin={
          isAdminLoggedIn
            ? () => {
                setAdminInitialTab('donation');
                setIsAdminOpen(true);
              }
            : undefined
        }
      />

      {/* Global Admin Dashboard Modal */}
      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        initialTab={adminInitialTab}
        founderData={founderData}
        onUpdateFounderData={(newData) => setFounderData(newData)}
        teamMembers={teamMembers}
        onUpdateTeamMembers={(newTeam) => setTeamMembers(newTeam)}
        orgContact={orgContact}
        onUpdateOrgContact={(newContact) => setOrgContact(newContact)}
        events={events}
        onUpdateEvents={(newEvents) => setEvents(newEvents)}
        jobs={jobs}
        onUpdateJobs={(newJobs) => setJobs(newJobs)}
        scholarships={scholarships}
        onUpdateScholarships={(newSch) => setScholarships(newSch)}
        workshops={workshops}
        onUpdateWorkshops={(newWs) => setWorkshops(newWs)}
        donationConfig={donationConfig}
        onUpdateDonationConfig={(cfg) => setDonationConfig(cfg)}
        onOpenDonateModal={() => setIsDonateOpen(true)}
        idCardConfig={idCardConfig}
        onUpdateIdCardConfig={(cfg) => setIdCardConfig(cfg)}
        matrimonyConfig={matrimonyConfig}
        onUpdateMatrimonyConfig={(cfg) => setMatrimonyConfig(cfg)}
        artisanConfig={artisanConfig}
        onUpdateArtisanConfig={(cfg) => setArtisanConfig(cfg)}
        postConfig={postConfig}
        onUpdatePostConfig={(cfg) => setPostConfig(cfg)}
        luminaries={luminaries}
        onUpdateLuminaries={handleUpdateLuminaries}
        lang={lang}
        isAuthenticated={isAdminLoggedIn}
        onLoginSuccess={handleAdminLoginSuccess}
        onLogout={handleAdminLogout}
      />

      {/* Footer (No Admin Login button at bottom, only in Top Menubar as requested) */}
      <Footer
        setActiveTab={setActiveTab}
        lang={lang}
        orgContact={orgContact}
      />
    </div>
  );
}
