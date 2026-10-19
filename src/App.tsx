import React, { useState, useEffect } from 'react';
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
  PostFormConfig,
  Temple
} from './types';
import {
  subscribeSiteConfigFromFirestore,
  saveSiteConfigToFirestore,
  syncAllDataToFirebase,
  checkAndSeedInitialSiteData,
  deletePostFromFirestore
} from './firebase';
import { INITIAL_POSTS, ARTISANS_DATA, UPCOMING_EVENTS, VISHWAKARMA_TEMPLES } from './data/mockData';
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
import {
  isCurrentlyAdminAuthenticated,
  saveAdminSession,
  clearAdminSession
} from './utils/adminAuth';
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
  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const saved = localStorage.getItem('vsm_posts');
      return saved ? JSON.parse(saved) : INITIAL_POSTS;
    } catch {
      return INITIAL_POSTS;
    }
  });
  const [artisans, setArtisans] = useState<Artisan[]>(() => {
    try {
      const saved = localStorage.getItem('vsm_artisans');
      return saved ? JSON.parse(saved) : ARTISANS_DATA;
    } catch {
      return ARTISANS_DATA;
    }
  });
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
  const [temples, setTemples] = useState<Temple[]>(() => {
    try {
      const saved = localStorage.getItem('vsm_temples');
      return saved ? JSON.parse(saved) : VISHWAKARMA_TEMPLES;
    } catch {
      return VISHWAKARMA_TEMPLES;
    }
  });
  const [isCreatePostOpen, setIsCreatePostOpen] = useState<boolean>(false);
  const [isDonateOpen, setIsDonateOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [adminInitialTab, setAdminInitialTab] = useState<AdminTab>('applications');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return isCurrentlyAdminAuthenticated();
  });

  const handleAdminLoginSuccess = (adminIdentifier?: string) => {
    setIsAdminLoggedIn(true);
    if (adminIdentifier) {
      saveAdminSession(adminIdentifier);
    }
  };

  const handleAdminLogout = () => {
    clearAdminSession();
    setIsAdminLoggedIn(false);
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

  // REAL-TIME FIRESTORE SYNCHRONIZATION (Global Live Sync Across Public Devices & Links)
  useEffect(() => {
    // 1. Initial check and seed to Firestore so fresh database is immediately filled!
    checkAndSeedInitialSiteData({
      founder: FOUNDER_DATA,
      team: TEAM_MEMBERS,
      contact: orgContact,
      events: UPCOMING_EVENTS,
      luminaries: HALL_OF_FAME_DATA,
      donation: DEFAULT_DONATION_CONFIG,
      jobs: DEFAULT_JOBS,
      scholarships: DEFAULT_SCHOLARSHIPS,
      workshops: DEFAULT_WORKSHOPS,
      posts: INITIAL_POSTS,
      artisans: ARTISANS_DATA,
      idcard_config: DEFAULT_IDCARD_CONFIG,
      matrimony_config: DEFAULT_MATRIMONY_CONFIG,
      artisan_config: DEFAULT_ARTISAN_CONFIG,
      post_config: DEFAULT_POST_CONFIG,
      temples: VISHWAKARMA_TEMPLES,
    });

    const unsubEvents = subscribeSiteConfigFromFirestore<SamajEvent[]>('events', (data) => {
      if (Array.isArray(data) && data.length > 0) {
        setEvents(data);
        localStorage.setItem('vsm_events', JSON.stringify(data));
      }
    });

    const unsubLuminaries = subscribeSiteConfigFromFirestore<HallOfFamePerson[]>('luminaries', (data) => {
      if (Array.isArray(data) && data.length > 0) {
        setLuminaries(data);
        localStorage.setItem('vsm_luminaries', JSON.stringify(data));
      }
    });

    const unsubFounder = subscribeSiteConfigFromFirestore<FounderInfo>('founder', (data) => {
      if (data && data.name) {
        setFounderData(data);
        localStorage.setItem('vsm_founder', JSON.stringify(data));
      }
    });

    const unsubTeam = subscribeSiteConfigFromFirestore<TeamMember[]>('team', (data) => {
      if (Array.isArray(data) && data.length > 0) {
        setTeamMembers(data);
        localStorage.setItem('vsm_team', JSON.stringify(data));
      }
    });

    const unsubContact = subscribeSiteConfigFromFirestore<OrgContactInfo>('contact', (data) => {
      if (data && data.address) {
        setOrgContact(data);
        localStorage.setItem('vsm_contact', JSON.stringify(data));
      }
    });

    const unsubDonation = subscribeSiteConfigFromFirestore<DonationConfig>('donation', (data) => {
      if (data && data.upiId) {
        setDonationConfig(data);
        localStorage.setItem('vsm_donation', JSON.stringify(data));
      }
    });

    const unsubJobs = subscribeSiteConfigFromFirestore<JobItem[]>('jobs', (data) => {
      if (Array.isArray(data)) {
        setJobs(data);
        localStorage.setItem('vsm_jobs', JSON.stringify(data));
      }
    });

    const unsubScholarships = subscribeSiteConfigFromFirestore<ScholarshipItem[]>('scholarships', (data) => {
      if (Array.isArray(data)) {
        setScholarships(data);
        localStorage.setItem('vsm_scholarships', JSON.stringify(data));
      }
    });

    const unsubWorkshops = subscribeSiteConfigFromFirestore<WorkshopItem[]>('workshops', (data) => {
      if (Array.isArray(data)) {
        setWorkshops(data);
        localStorage.setItem('vsm_workshops', JSON.stringify(data));
      }
    });

    const unsubIdCard = subscribeSiteConfigFromFirestore<IdCardFormConfig>('idcard_config', (data) => {
      if (data) {
        setIdCardConfig(data);
        localStorage.setItem('vsm_idcard_config', JSON.stringify(data));
      }
    });

    const unsubMatrimony = subscribeSiteConfigFromFirestore<MatrimonyFormConfig>('matrimony_config', (data) => {
      if (data) {
        setMatrimonyConfig(data);
        localStorage.setItem('vsm_matrimony_config', JSON.stringify(data));
      }
    });

    const unsubArtisan = subscribeSiteConfigFromFirestore<ArtisanFormConfig>('artisan_config', (data) => {
      if (data) {
        setArtisanConfig(data);
        localStorage.setItem('vsm_artisan_config', JSON.stringify(data));
      }
    });

    const unsubPost = subscribeSiteConfigFromFirestore<PostFormConfig>('post_config', (data) => {
      if (data) {
        setPostConfig(data);
        localStorage.setItem('vsm_post_config', JSON.stringify(data));
      }
    });

    const unsubPosts = subscribeSiteConfigFromFirestore<Post[]>('posts', (data) => {
      if (Array.isArray(data) && data.length > 0) {
        setPosts(data);
        localStorage.setItem('vsm_posts', JSON.stringify(data));
      }
    });

    const unsubArtisans = subscribeSiteConfigFromFirestore<Artisan[]>('artisans', (data) => {
      if (Array.isArray(data) && data.length > 0) {
        setArtisans(data);
        localStorage.setItem('vsm_artisans', JSON.stringify(data));
      }
    });

    const unsubTemples = subscribeSiteConfigFromFirestore<Temple[]>('temples', (data) => {
      if (Array.isArray(data) && data.length > 0) {
        setTemples(data);
        localStorage.setItem('vsm_temples', JSON.stringify(data));
      }
    });

    return () => {
      unsubEvents();
      unsubLuminaries();
      unsubFounder();
      unsubTeam();
      unsubContact();
      unsubDonation();
      unsubJobs();
      unsubScholarships();
      unsubWorkshops();
      unsubIdCard();
      unsubMatrimony();
      unsubArtisan();
      unsubPost();
      unsubPosts();
      unsubArtisans();
      unsubTemples();
    };
  }, []);

  // Handlers that update both local memory and Firebase Firestore in real-time
  const handleLikePost = (postId: string) => {
    setPosts((prev) => {
      const updated = prev.map((post) => {
        if (post.id === postId) {
          const isLiked = !post.isLiked;
          return {
            ...post,
            isLiked,
            likes: isLiked ? post.likes + 1 : Math.max(0, post.likes - 1),
          };
        }
        return post;
      });
      try {
        localStorage.setItem('vsm_posts', JSON.stringify(updated));
        saveSiteConfigToFirestore('posts', updated);
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
  };

  const handleAddComment = (postId: string, commentText: string) => {
    setPosts((prev) => {
      const updated = prev.map((post) => {
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
      });
      try {
        localStorage.setItem('vsm_posts', JSON.stringify(updated));
        saveSiteConfigToFirestore('posts', updated);
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
  };

  const handleAddPost = (newPost: Post) => {
    setPosts((prev) => {
      const updated = [newPost, ...prev];
      try {
        localStorage.setItem('vsm_posts', JSON.stringify(updated));
        saveSiteConfigToFirestore('posts', updated);
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
  };

  const handleUpdatePosts = (newPosts: Post[]) => {
    setPosts(newPosts);
    try {
      localStorage.setItem('vsm_posts', JSON.stringify(newPosts));
      saveSiteConfigToFirestore('posts', newPosts);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleDeletePost = async (postId: string) => {
    setPosts((prev) => {
      const updated = prev.filter((p) => p.id !== postId);
      try {
        localStorage.setItem('vsm_posts', JSON.stringify(updated));
        saveSiteConfigToFirestore('posts', updated);
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
    try {
      await deletePostFromFirestore(postId);
    } catch (e) {
      console.warn('Failed to delete post from Firestore:', e);
    }
  };

  const handleAddArtisan = (newArtisan: Artisan) => {
    setArtisans((prev) => {
      const updated = [newArtisan, ...prev];
      try {
        localStorage.setItem('vsm_artisans', JSON.stringify(updated));
        saveSiteConfigToFirestore('artisans', updated);
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
  };

  const handleUpdateArtisans = (newArtisans: Artisan[]) => {
    setArtisans(newArtisans);
    try {
      localStorage.setItem('vsm_artisans', JSON.stringify(newArtisans));
      saveSiteConfigToFirestore('artisans', newArtisans);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleAddEvent = (newEvent: SamajEvent) => {
    setEvents((prev) => {
      const updated = [newEvent, ...prev];
      try {
        localStorage.setItem('vsm_events', JSON.stringify(updated));
        saveSiteConfigToFirestore('events', updated);
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
  };

  const handleUpdateEvents = (newEvents: SamajEvent[]) => {
    setEvents(newEvents);
    try {
      localStorage.setItem('vsm_events', JSON.stringify(newEvents));
      saveSiteConfigToFirestore('events', newEvents);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleAddLuminary = (newLuminary: HallOfFamePerson) => {
    setLuminaries((prev) => {
      const updated = [newLuminary, ...prev];
      try {
        localStorage.setItem('vsm_luminaries', JSON.stringify(updated));
        saveSiteConfigToFirestore('luminaries', updated);
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
      saveSiteConfigToFirestore('luminaries', newList);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleAddTemple = (newTemple: Temple) => {
    setTemples((prev) => {
      const updated = [newTemple, ...prev];
      try {
        localStorage.setItem('vsm_temples', JSON.stringify(updated));
        saveSiteConfigToFirestore('temples', updated);
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
  };

  const handleUpdateTemples = (newTemples: Temple[]) => {
    setTemples(newTemples);
    try {
      localStorage.setItem('vsm_temples', JSON.stringify(newTemples));
      saveSiteConfigToFirestore('temples', newTemples);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleUpdateFounderData = (newData: FounderInfo) => {
    setFounderData(newData);
    try {
      localStorage.setItem('vsm_founder', JSON.stringify(newData));
      saveSiteConfigToFirestore('founder', newData);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleUpdateTeamMembers = (newTeam: TeamMember[]) => {
    setTeamMembers(newTeam);
    try {
      localStorage.setItem('vsm_team', JSON.stringify(newTeam));
      saveSiteConfigToFirestore('team', newTeam);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleUpdateOrgContact = (newContact: OrgContactInfo) => {
    setOrgContact(newContact);
    try {
      localStorage.setItem('vsm_contact', JSON.stringify(newContact));
      saveSiteConfigToFirestore('contact', newContact);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleUpdateJobs = (newJobs: JobItem[]) => {
    setJobs(newJobs);
    try {
      localStorage.setItem('vsm_jobs', JSON.stringify(newJobs));
      saveSiteConfigToFirestore('jobs', newJobs);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleUpdateScholarships = (newSch: ScholarshipItem[]) => {
    setScholarships(newSch);
    try {
      localStorage.setItem('vsm_scholarships', JSON.stringify(newSch));
      saveSiteConfigToFirestore('scholarships', newSch);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleUpdateWorkshops = (newWs: WorkshopItem[]) => {
    setWorkshops(newWs);
    try {
      localStorage.setItem('vsm_workshops', JSON.stringify(newWs));
      saveSiteConfigToFirestore('workshops', newWs);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleUpdateDonationConfig = (cfg: DonationConfig) => {
    setDonationConfig(cfg);
    try {
      localStorage.setItem('vsm_donation', JSON.stringify(cfg));
      saveSiteConfigToFirestore('donation', cfg);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleUpdateIdCardConfig = (cfg: IdCardFormConfig) => {
    setIdCardConfig(cfg);
    try {
      localStorage.setItem('vsm_idcard_config', JSON.stringify(cfg));
      saveSiteConfigToFirestore('idcard_config', cfg);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleUpdateMatrimonyConfig = (cfg: MatrimonyFormConfig) => {
    setMatrimonyConfig(cfg);
    try {
      localStorage.setItem('vsm_matrimony_config', JSON.stringify(cfg));
      saveSiteConfigToFirestore('matrimony_config', cfg);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleUpdateArtisanConfig = (cfg: ArtisanFormConfig) => {
    setArtisanConfig(cfg);
    try {
      localStorage.setItem('vsm_artisan_config', JSON.stringify(cfg));
      saveSiteConfigToFirestore('artisan_config', cfg);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleUpdatePostConfig = (cfg: PostFormConfig) => {
    setPostConfig(cfg);
    try {
      localStorage.setItem('vsm_post_config', JSON.stringify(cfg));
      saveSiteConfigToFirestore('post_config', cfg);
    } catch (e) {
      console.warn(e);
    }
  };

  // Force Synchronize ALL current data to Firebase Firestore
  const handleForceSyncAllDataToFirebase = async () => {
    return await syncAllDataToFirebase({
      founder: founderData,
      team: teamMembers,
      contact: orgContact,
      events: events,
      luminaries: luminaries,
      donation: donationConfig,
      jobs: jobs,
      scholarships: scholarships,
      workshops: workshops,
      posts: posts,
      artisans: artisans,
      idcard_config: idCardConfig,
      matrimony_config: matrimonyConfig,
      artisan_config: artisanConfig,
      post_config: postConfig,
      temples: temples,
    });
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
        <div className="bg-stone-900 text-amber-200 border-b border-amber-600/50 px-4 py-2.5 flex flex-wrap items-center justify-between text-xs font-semibold z-30 sticky top-[94px] lg:top-[108px] shadow-md font-hindi animate-fadeIn">
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
            artisans={artisans}
            luminaries={luminaries}
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
            isAdminLoggedIn={isAdminLoggedIn}
            onOpenAdmin={() => {
              setAdminInitialTab('events');
              setIsAdminOpen(true);
            }}
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
          <HeritageAndTemples
            lang={lang}
            temples={temples}
            onAddTemple={handleAddTemple}
          />
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
        onUpdateFounderData={handleUpdateFounderData}
        teamMembers={teamMembers}
        onUpdateTeamMembers={handleUpdateTeamMembers}
        orgContact={orgContact}
        onUpdateOrgContact={handleUpdateOrgContact}
        events={events}
        onUpdateEvents={handleUpdateEvents}
        jobs={jobs}
        onUpdateJobs={handleUpdateJobs}
        scholarships={scholarships}
        onUpdateScholarships={handleUpdateScholarships}
        workshops={workshops}
        onUpdateWorkshops={handleUpdateWorkshops}
        donationConfig={donationConfig}
        onUpdateDonationConfig={handleUpdateDonationConfig}
        onOpenDonateModal={() => setIsDonateOpen(true)}
        idCardConfig={idCardConfig}
        onUpdateIdCardConfig={handleUpdateIdCardConfig}
        matrimonyConfig={matrimonyConfig}
        onUpdateMatrimonyConfig={handleUpdateMatrimonyConfig}
        artisanConfig={artisanConfig}
        onUpdateArtisanConfig={handleUpdateArtisanConfig}
        postConfig={postConfig}
        onUpdatePostConfig={handleUpdatePostConfig}
        luminaries={luminaries}
        onUpdateLuminaries={handleUpdateLuminaries}
        posts={posts}
        onUpdatePosts={handleUpdatePosts}
        artisans={artisans}
        onUpdateArtisans={handleUpdateArtisans}
        onSyncAllToFirebase={handleForceSyncAllDataToFirebase}
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
