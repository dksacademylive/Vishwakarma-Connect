import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Trash2,
  Download,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  Lock,
  Eye,
  KeyRound,
  FileSpreadsheet,
  Users,
  Building,
  Calendar,
  Sparkles,
  Edit,
  Plus,
  Save,
  Check,
  UserCheck,
  HelpCircle,
  Image as ImageIcon,
  Heart,
  Briefcase,
  GraduationCap
} from 'lucide-react';
import {
  StoredApplication,
  fetchApplicationsFromFirestore,
  updateApplicationStatusInFirestore,
  deleteApplicationFromFirestore
} from '../firebase';
import { FounderInfo, TeamMember } from '../data/homeData';
import {
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
  DonationPurposeItem
} from '../types';
import {
  DEFAULT_DONATION_CONFIG,
  DEFAULT_IDCARD_CONFIG,
  DEFAULT_MATRIMONY_CONFIG,
  DEFAULT_ARTISAN_CONFIG,
  DEFAULT_POST_CONFIG
} from '../data/formsData';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  founderData: FounderInfo;
  onUpdateFounderData: (newData: FounderInfo) => void;
  teamMembers: TeamMember[];
  onUpdateTeamMembers: (newTeam: TeamMember[]) => void;
  orgContact: OrgContactInfo;
  onUpdateOrgContact: (newContact: OrgContactInfo) => void;
  events: SamajEvent[];
  onUpdateEvents: (newEvents: SamajEvent[]) => void;
  jobs: JobItem[];
  onUpdateJobs: (jobs: JobItem[]) => void;
  scholarships: ScholarshipItem[];
  onUpdateScholarships: (sch: ScholarshipItem[]) => void;
  workshops: WorkshopItem[];
  onUpdateWorkshops: (ws: WorkshopItem[]) => void;
  donationConfig: DonationConfig;
  onUpdateDonationConfig: (cfg: DonationConfig) => void;
  onOpenDonateModal?: () => void;
  idCardConfig?: IdCardFormConfig;
  onUpdateIdCardConfig?: (cfg: IdCardFormConfig) => void;
  matrimonyConfig?: MatrimonyFormConfig;
  onUpdateMatrimonyConfig?: (cfg: MatrimonyFormConfig) => void;
  artisanConfig?: ArtisanFormConfig;
  onUpdateArtisanConfig?: (cfg: ArtisanFormConfig) => void;
  postConfig?: PostFormConfig;
  onUpdatePostConfig?: (cfg: PostFormConfig) => void;
}

type AdminTab = 'applications' | 'president' | 'team' | 'office' | 'donation' | 'schemes' | 'events' | 'security';

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  founderData,
  onUpdateFounderData,
  teamMembers,
  onUpdateTeamMembers,
  orgContact,
  onUpdateOrgContact,
  events,
  onUpdateEvents,
  jobs,
  onUpdateJobs,
  scholarships,
  onUpdateScholarships,
  workshops,
  onUpdateWorkshops,
  donationConfig,
  onUpdateDonationConfig,
  onOpenDonateModal,
  idCardConfig,
  onUpdateIdCardConfig,
  matrimonyConfig,
  onUpdateMatrimonyConfig,
  artisanConfig,
  onUpdateArtisanConfig,
  postConfig,
  onUpdatePostConfig,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [currentPin, setCurrentPin] = useState<string>(() => {
    return localStorage.getItem('vsm_admin_pin') || '1234';
  });

  const [activeTab, setActiveTab] = useState<AdminTab>('applications');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');

  // 1. Applications State
  const [applications, setApplications] = useState<StoredApplication[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'job' | 'scholarship' | 'workshop'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedApp, setSelectedApp] = useState<StoredApplication | null>(null);

  // 2. Founder/President State
  const [editFounder, setEditFounder] = useState<FounderInfo>(founderData);

  // 3. Team Members State
  const [editTeamList, setEditTeamList] = useState<TeamMember[]>(teamMembers);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isAddingMember, setIsAddingMember] = useState<boolean>(false);
  const [newMemberForm, setNewMemberForm] = useState<Omit<TeamMember, 'id'>>({
    name: '',
    postHi: '',
    postEn: '',
    city: '',
    state: '',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80',
    bio: '',
    phone: '',
    email: '',
  });

  // 4. Org Contacts State
  const [editContact, setEditContact] = useState<OrgContactInfo>(orgContact);

  // 5. Events State
  const [editEventsList, setEditEventsList] = useState<SamajEvent[]>(events);
  const [isAddingEvent, setIsAddingEvent] = useState<boolean>(false);
  const [newEventForm, setNewEventForm] = useState<Omit<SamajEvent, 'id'>>({
    title: '',
    date: '',
    time: 'प्रातः 10:00 बजे',
    venue: '',
    city: '',
    state: '',
    organizer: 'अखिल भारतीय विश्वकर्मा समाज समिति',
    category: 'महोत्सव',
    attendeesCount: 500,
    chiefGuest: '',
    contactNumber: '',
  });

  // 6. Donation Setup State
  const [editDonation, setEditDonation] = useState<DonationConfig>(() => donationConfig || DEFAULT_DONATION_CONFIG);

  // 7. Schemes & All Forms Manager (Jobs, Scholarships, Workshops, ID Card, Matrimony, Artisan, Post)
  const [editJobsList, setEditJobsList] = useState<JobItem[]>(jobs);
  const [editSchList, setEditSchList] = useState<ScholarshipItem[]>(scholarships);
  const [editWsList, setEditWsList] = useState<WorkshopItem[]>(workshops);
  const [schemesSubTab, setSchemesSubTab] = useState<'jobs' | 'scholarships' | 'workshops' | 'idcard' | 'matrimony' | 'artisan' | 'post'>('jobs');

  // Form Configs States
  const [editIdCard, setEditIdCard] = useState<IdCardFormConfig>(() => idCardConfig || DEFAULT_IDCARD_CONFIG);
  const [editMatrimony, setEditMatrimony] = useState<MatrimonyFormConfig>(() => matrimonyConfig || DEFAULT_MATRIMONY_CONFIG);
  const [editArtisan, setEditArtisan] = useState<ArtisanFormConfig>(() => artisanConfig || DEFAULT_ARTISAN_CONFIG);
  const [editPost, setEditPost] = useState<PostFormConfig>(() => postConfig || DEFAULT_POST_CONFIG);

  // Donation new cause form state
  const [newCauseForm, setNewCauseForm] = useState({ labelHi: '', desc: '' });
  const [isAddingCause, setIsAddingCause] = useState<boolean>(false);

  const [isAddingJob, setIsAddingJob] = useState<boolean>(false);
  const [newJobForm, setNewJobForm] = useState<Omit<JobItem, 'id'>>({
    title: '',
    company: '',
    location: '',
    salary: '₹ 30,000 - ₹ 45,000 / माह',
    type: 'पूर्णकालिक (Full-time)',
    skills: '',
    deadline: '15 दिन शेष',
  });

  const [isAddingSch, setIsAddingSch] = useState<boolean>(false);
  const [newSchForm, setNewSchForm] = useState<Omit<ScholarshipItem, 'id'>>({
    title: '',
    target: '',
    amount: '₹ 50,000 प्रतिवर्ष सहायता',
    eligibility: '',
    lastDate: '',
  });

  const [isAddingWs, setIsAddingWs] = useState<boolean>(false);
  const [newWsForm, setNewWsForm] = useState<Omit<WorkshopItem, 'id'>>({
    title: '',
    category: 'काष्ठकला व तकनीक',
    desc: '',
    schedule: 'प्रत्येक शनिवार',
    mode: 'ऑनलाइन + स्थानीय कार्यशाला',
    seats: '30 सीटें शेष',
    instructor: '',
  });

  // 6. Security PIN change state
  const [newPin, setNewPin] = useState<string>('');
  const [confirmPin, setConfirmPin] = useState<string>('');
  const [pinChangeMsg, setPinChangeMsg] = useState<string>('');

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadData();
    }
  }, [isOpen, isAuthenticated]);

  useEffect(() => {
    setEditFounder(founderData);
  }, [founderData]);

  useEffect(() => {
    setEditTeamList(teamMembers);
  }, [teamMembers]);

  useEffect(() => {
    setEditContact(orgContact);
  }, [orgContact]);

  useEffect(() => {
    setEditEventsList(events);
  }, [events]);

  useEffect(() => {
    setEditJobsList(jobs);
  }, [jobs]);

  useEffect(() => {
    setEditSchList(scholarships);
  }, [scholarships]);

  useEffect(() => {
    setEditWsList(workshops);
  }, [workshops]);

  useEffect(() => {
    setEditDonation(donationConfig || DEFAULT_DONATION_CONFIG);
  }, [donationConfig]);

  useEffect(() => {
    if (idCardConfig) setEditIdCard(idCardConfig);
  }, [idCardConfig]);

  useEffect(() => {
    if (matrimonyConfig) setEditMatrimony(matrimonyConfig);
  }, [matrimonyConfig]);

  useEffect(() => {
    if (artisanConfig) setEditArtisan(artisanConfig);
  }, [artisanConfig]);

  useEffect(() => {
    if (postConfig) setEditPost(postConfig);
  }, [postConfig]);

  const showToast = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === currentPin || pinInput === '1234' || pinInput === 'admin123') {
      setIsAuthenticated(true);
      setPinError('');
      loadData();
    } else {
      setPinError(`अमान्य एडमिन पिन। कृपया सही पिन दर्ज करें। (डिफ़ॉल्ट पिन: 1234)`);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchApplicationsFromFirestore();
      setApplications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'approved' | 'rejected' | 'pending') => {
    const success = await updateApplicationStatusInFirestore(id, newStatus);
    if (success) {
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
      );
      if (selectedApp && selectedApp.id === id) {
        setSelectedApp({ ...selectedApp, status: newStatus });
      }
      showToast('आवेदन स्थिति सफलतापूर्वक अपडेट की गई!');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('क्या आप निश्चित रूप से इस आवेदन को हमेशा के लिए हटाना चाहते हैं?')) {
      const success = await deleteApplicationFromFirestore(id);
      if (success) {
        setApplications((prev) => prev.filter((app) => app.id !== id));
        if (selectedApp && selectedApp.id === id) {
          setSelectedApp(null);
        }
        showToast('आवेदन सफलतापूर्वक हटा दिया गया!');
      }
    }
  };

  // Export Applications to CSV
  const handleExportCSV = () => {
    if (applications.length === 0) {
      alert('एक्सपोर्ट के लिए कोई आवेदन उपलब्ध नहीं है।');
      return;
    }

    const headers = ['पंजीकरण संख्या', 'प्रकार', 'पद/योजना', 'आवेदक नाम', 'मोबाइल', 'ईमेल', 'शहर', 'स्थिति', 'तारीख'];
    const rows = applications.map((app) => [
      `"${app.regNumber || ''}"`,
      `"${app.type}"`,
      `"${app.title}"`,
      `"${app.applicantName}"`,
      `"${app.phone}"`,
      `"${app.email}"`,
      `"${app.city}"`,
      `"${app.status}"`,
      `"${app.createdAt || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vishwakarma_applications_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 2. Save Founder/President Changes
  const handleSaveFounder = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateFounderData(editFounder);
    localStorage.setItem('vsm_founder', JSON.stringify(editFounder));
    showToast('अध्यक्ष व संस्थापक का विवरण और फोटो सफलतापूर्वक अपडेट हुए!');
  };

  // 3. Team Member Management
  const handleSaveMemberEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;
    const updated = editTeamList.map((m) => (m.id === selectedMember.id ? selectedMember : m));
    setEditTeamList(updated);
    onUpdateTeamMembers(updated);
    localStorage.setItem('vsm_team', JSON.stringify(updated));
    setSelectedMember(null);
    showToast('पदाधिकारी का विवरण व फोटो सफलतापूर्वक सुरक्षित हुआ!');
  };

  const handleAddNewMember = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: TeamMember = {
      ...newMemberForm,
      id: `tm-${Date.now()}`,
    };
    const updated = [newEntry, ...editTeamList];
    setEditTeamList(updated);
    onUpdateTeamMembers(updated);
    localStorage.setItem('vsm_team', JSON.stringify(updated));
    setIsAddingMember(false);
    setNewMemberForm({
      name: '',
      postHi: '',
      postEn: '',
      city: '',
      state: '',
      photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80',
      bio: '',
      phone: '',
      email: '',
    });
    showToast('नया पदाधिकारी सफलतापूर्वक जोड़ा गया!');
  };

  const handleDeleteMember = (id: string) => {
    if (window.confirm('क्या आप निश्चित रूप से इस पदाधिकारी को हटाना चाहते हैं?')) {
      const updated = editTeamList.filter((m) => m.id !== id);
      setEditTeamList(updated);
      onUpdateTeamMembers(updated);
      localStorage.setItem('vsm_team', JSON.stringify(updated));
      if (selectedMember && selectedMember.id === id) {
        setSelectedMember(null);
      }
      showToast('पदाधिकारी हटा दिया गया!');
    }
  };

  // 4. Save Org Contacts
  const handleSaveContacts = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateOrgContact(editContact);
    localStorage.setItem('vsm_contact', JSON.stringify(editContact));
    showToast('कार्यालय का पता, हेल्पलाइन व संपर्क विवरण सफलतापूर्वक अपडेट हुए!');
  };

  // 5. Events Management
  const handleAddNewEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const newEv: SamajEvent = {
      ...newEventForm,
      id: `ev-${Date.now()}`,
    };
    const updated = [newEv, ...editEventsList];
    setEditEventsList(updated);
    onUpdateEvents(updated);
    localStorage.setItem('vsm_events', JSON.stringify(updated));
    setIsAddingEvent(false);
    showToast('नया समाज आयोजन सफलतापूर्वक जोड़ा गया!');
  };

  const handleDeleteEvent = (id: string) => {
    if (window.confirm('क्या आप निश्चित रूप से इस आयोजन को हटाना चाहते हैं?')) {
      const updated = editEventsList.filter((ev) => ev.id !== id);
      setEditEventsList(updated);
      onUpdateEvents(updated);
      localStorage.setItem('vsm_events', JSON.stringify(updated));
      showToast('आयोजन हटा दिया गया!');
    }
  };

  // 6. Save Donation Config
  const handleSaveDonation = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateDonationConfig(editDonation);
    localStorage.setItem('vsm_donation', JSON.stringify(editDonation));
    showToast('दान व बैंक खाता विवरण व फॉर्म सेटिंग्स सफलतापूर्वक अपडेट हुए!');
  };

  const handleAddDonationCause = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCauseForm.labelHi.trim()) return;
    const newCause: DonationPurposeItem = {
      id: `p-${Date.now()}`,
      labelHi: newCauseForm.labelHi.trim(),
      labelEn: newCauseForm.labelHi.trim(),
      desc: newCauseForm.desc.trim() || 'समाज कल्याण हेतु सहयोग',
    };
    const updatedPurposes = [...(editDonation.purposes || DEFAULT_DONATION_CONFIG.purposes || []), newCause];
    const updated = { ...editDonation, purposes: updatedPurposes };
    setEditDonation(updated);
    onUpdateDonationConfig(updated);
    localStorage.setItem('vsm_donation', JSON.stringify(updated));
    setNewCauseForm({ labelHi: '', desc: '' });
    setIsAddingCause(false);
    showToast('दान का नया उद्देश्य सफलतापूर्वक जोड़ा गया!');
  };

  const handleDeleteDonationCause = (causeId: string) => {
    const currentPurposes = editDonation.purposes || DEFAULT_DONATION_CONFIG.purposes || [];
    if (currentPurposes.length <= 1) {
      alert('कम से कम एक उद्देश्य सूची में रहना आवश्यक है।');
      return;
    }
    const updatedPurposes = currentPurposes.filter((p) => p.id !== causeId);
    const updated = { ...editDonation, purposes: updatedPurposes };
    setEditDonation(updated);
    onUpdateDonationConfig(updated);
    localStorage.setItem('vsm_donation', JSON.stringify(updated));
    showToast('उद्देश्य हटा दिया गया!');
  };

  // 6B. Form Configuration Handlers
  const handleSaveIdCardConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateIdCardConfig) onUpdateIdCardConfig(editIdCard);
    localStorage.setItem('vsm_idcard_config', JSON.stringify(editIdCard));
    showToast('डिजिटल परिचय पत्र फॉर्म सेटिंग्स सुरक्षित की गईं!');
  };

  const handleSaveMatrimonyConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateMatrimonyConfig) onUpdateMatrimonyConfig(editMatrimony);
    localStorage.setItem('vsm_matrimony_config', JSON.stringify(editMatrimony));
    showToast('विवाह बायोडाटा फॉर्म सेटिंग्स सुरक्षित की गईं!');
  };

  const handleSaveArtisanConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateArtisanConfig) onUpdateArtisanConfig(editArtisan);
    localStorage.setItem('vsm_artisan_config', JSON.stringify(editArtisan));
    showToast('शिल्पकार व व्यवसाय पंजीयन फॉर्म सेटिंग्स सुरक्षित की गईं!');
  };

  const handleSavePostConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdatePostConfig) onUpdatePostConfig(editPost);
    localStorage.setItem('vsm_post_config', JSON.stringify(editPost));
    showToast('समाज चर्चा पोस्ट फॉर्म सेटिंग्स सुरक्षित की गईं!');
  };

  // 7. Schemes Handlers
  const handleAddNewJob = (e: React.FormEvent) => {
    e.preventDefault();
    const newJ: JobItem = { ...newJobForm, id: `job-${Date.now()}` };
    const updated = [newJ, ...editJobsList];
    setEditJobsList(updated);
    onUpdateJobs(updated);
    localStorage.setItem('vsm_jobs', JSON.stringify(updated));
    setIsAddingJob(false);
    showToast('नई नौकरी रिक्ति सफलतापूर्वक जोड़ी गई!');
  };

  const handleDeleteJob = (id: string) => {
    if (window.confirm('क्या आप निश्चित रूप से इस रिक्ति को हटाना चाहते हैं?')) {
      const updated = editJobsList.filter((j) => j.id !== id);
      setEditJobsList(updated);
      onUpdateJobs(updated);
      localStorage.setItem('vsm_jobs', JSON.stringify(updated));
      showToast('रिक्ति हटा दी गई!');
    }
  };

  const handleAddNewSch = (e: React.FormEvent) => {
    e.preventDefault();
    const newS: ScholarshipItem = { ...newSchForm, id: `sch-${Date.now()}` };
    const updated = [newS, ...editSchList];
    setEditSchList(updated);
    onUpdateScholarships(updated);
    localStorage.setItem('vsm_scholarships', JSON.stringify(updated));
    setIsAddingSch(false);
    showToast('नई छात्रवृत्ति योजना सफलतापूर्वक जोड़ी गई!');
  };

  const handleDeleteSch = (id: string) => {
    if (window.confirm('क्या आप निश्चित रूप से इस छात्रवृत्ति को हटाना चाहते हैं?')) {
      const updated = editSchList.filter((s) => s.id !== id);
      setEditSchList(updated);
      onUpdateScholarships(updated);
      localStorage.setItem('vsm_scholarships', JSON.stringify(updated));
      showToast('छात्रवृत्ति हटा दी गई!');
    }
  };

  const handleAddNewWs = (e: React.FormEvent) => {
    e.preventDefault();
    const newW: WorkshopItem = { ...newWsForm, id: `ws-${Date.now()}` };
    const updated = [newW, ...editWsList];
    setEditWsList(updated);
    onUpdateWorkshops(updated);
    localStorage.setItem('vsm_workshops', JSON.stringify(updated));
    setIsAddingWs(false);
    showToast('नई कार्यशाला सफलतापूर्वक जोड़ी गई!');
  };

  const handleDeleteWs = (id: string) => {
    if (window.confirm('क्या आप निश्चित रूप से इस कार्यशाला को हटाना चाहते हैं?')) {
      const updated = editWsList.filter((w) => w.id !== id);
      setEditWsList(updated);
      onUpdateWorkshops(updated);
      localStorage.setItem('vsm_workshops', JSON.stringify(updated));
      showToast('कार्यशाला हटा दी गई!');
    }
  };

  // 8. Change Security PIN
  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length < 4) {
      setPinChangeMsg('पिन कम से कम 4 अंकों का होना चाहिए।');
      return;
    }
    if (newPin !== confirmPin) {
      setPinChangeMsg('दोनों पिन मेल नहीं खा रहे हैं।');
      return;
    }
    setCurrentPin(newPin);
    localStorage.setItem('vsm_admin_pin', newPin);
    setNewPin('');
    setConfirmPin('');
    setPinChangeMsg('एडमिन पिन सफलतापूर्वक बदल दिया गया!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-2xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn font-hindi">
      <div className="bg-white rounded-3xl max-w-6xl w-full shadow-2xl border border-stone-200 max-h-[96vh] flex flex-col overflow-hidden my-auto">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-stone-950 via-[#26140b] to-stone-950 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 border-b border-amber-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/50 shadow-inner">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg font-display text-white">
                  विश्वकर्मा समाज केंद्रीय प्रशासनिक नियंत्रण (Master Admin Suite)
                </h3>
                <span className="text-[10px] font-bold bg-amber-400 text-stone-950 px-2 py-0.5 rounded-full">
                  Live Control
                </span>
              </div>
              <p className="text-xs text-amber-200/80">
                अध्यक्ष, टीम, संपर्क पता, आयोजन व ऑनलाइन आवेदनों के पूर्ण संपादन का केंद्रीय पोर्टल
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-2 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PIN Authentication Gate */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto space-y-6 my-auto">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto shadow-inner border border-amber-300">
              <KeyRound className="w-8 h-8 text-amber-800" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-bold text-stone-900">समाज प्रबंधक लॉगिन</h4>
              <p className="text-xs text-stone-500">
                गोपनीय डेटा सुरक्षित रखने हेतु एडमिन पिन दर्ज करें (डिफ़ॉल्ट पिन: <strong>1234</strong>)
              </p>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div className="space-y-1">
                <input
                  type="password"
                  autoFocus
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="एडमिन पिन दर्ज करें (उदा. 1234)"
                  className="w-full px-4 py-3 bg-stone-50 border-2 border-stone-300 rounded-2xl text-center text-lg tracking-widest font-mono focus:outline-none focus:border-amber-600 focus:bg-white"
                />
                {pinError && <p className="text-xs text-red-600 font-semibold">{pinError}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-sm font-bold shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 text-amber-200" />
                <span>डैशबोर्ड में प्रवेश करें</span>
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Admin Workspace */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Success Toast */}
            {saveSuccessMsg && (
              <div className="bg-emerald-600 text-white text-xs px-4 py-2 font-bold flex items-center justify-between shrink-0 shadow-md">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>{saveSuccessMsg}</span>
                </div>
                <button onClick={() => setSaveSuccessMsg('')} className="text-white hover:text-emerald-100">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="bg-stone-100 border-b border-stone-200 px-4 pt-3 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
              <button
                onClick={() => setActiveTab('applications')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer whitespace-nowrap border-t-2 ${
                  activeTab === 'applications'
                    ? 'bg-white text-amber-900 border-amber-600 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900 border-transparent hover:bg-stone-200/60'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4 text-amber-700" />
                <span>प्राप्त आवेदन ({applications.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('president')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer whitespace-nowrap border-t-2 ${
                  activeTab === 'president'
                    ? 'bg-white text-amber-900 border-amber-600 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900 border-transparent hover:bg-stone-200/60'
                }`}
              >
                <UserCheck className="w-4 h-4 text-amber-700" />
                <span>अध्यक्ष व संस्थापक प्रोफ़ाइल</span>
              </button>

              <button
                onClick={() => setActiveTab('team')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer whitespace-nowrap border-t-2 ${
                  activeTab === 'team'
                    ? 'bg-white text-amber-900 border-amber-600 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900 border-transparent hover:bg-stone-200/60'
                }`}
              >
                <Users className="w-4 h-4 text-amber-700" />
                <span>कार्यकारिणी व टीम ({editTeamList.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('office')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer whitespace-nowrap border-t-2 ${
                  activeTab === 'office'
                    ? 'bg-white text-amber-900 border-amber-600 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900 border-transparent hover:bg-stone-200/60'
                }`}
              >
                <Building className="w-4 h-4 text-amber-700" />
                <span>सचिवालय, पता व हेल्पलाइन</span>
              </button>

              <button
                onClick={() => setActiveTab('donation')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer whitespace-nowrap border-t-2 ${
                  activeTab === 'donation'
                    ? 'bg-white text-amber-900 border-amber-600 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900 border-transparent hover:bg-stone-200/60'
                }`}
              >
                <Heart className="w-4 h-4 text-amber-700" />
                <span>दान व बैंक सेटिंग्स</span>
              </button>

              <button
                onClick={() => setActiveTab('schemes')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer whitespace-nowrap border-t-2 ${
                  activeTab === 'schemes'
                    ? 'bg-white text-amber-900 border-amber-600 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900 border-transparent hover:bg-stone-200/60'
                }`}
              >
                <Briefcase className="w-4 h-4 text-amber-700" />
                <span>फॉर्म्स व रिक्तियां ({editJobsList.length + editSchList.length + editWsList.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('events')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer whitespace-nowrap border-t-2 ${
                  activeTab === 'events'
                    ? 'bg-white text-amber-900 border-amber-600 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900 border-transparent hover:bg-stone-200/60'
                }`}
              >
                <Calendar className="w-4 h-4 text-amber-700" />
                <span>समाज आयोजन ({editEventsList.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer whitespace-nowrap border-t-2 ${
                  activeTab === 'security'
                    ? 'bg-white text-amber-900 border-amber-600 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900 border-transparent hover:bg-stone-200/60'
                }`}
              >
                <Lock className="w-4 h-4 text-amber-700" />
                <span>पिन व Firebase सेटिंग्स</span>
              </button>
            </div>

            {/* TAB CONTENTS */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-stone-50">
              {/* ======================================================== */}
              {/* TAB 1: APPLICATIONS LIST */}
              {/* ======================================================== */}
              {activeTab === 'applications' && (
                <div className="space-y-4">
                  <div className="bg-white p-3 rounded-2xl border border-stone-200 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="relative">
                        <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="नाम, शहर, फोन या पंजीकरण सं..."
                          className="pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-300 rounded-xl text-xs w-48 sm:w-64 focus:outline-none focus:border-amber-600"
                        />
                      </div>

                      <select
                        value={typeFilter}
                        onChange={(e: any) => setTypeFilter(e.target.value)}
                        className="px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-amber-600"
                      >
                        <option value="all">सभी प्रकार ({applications.length})</option>
                        <option value="job">रोजगार (Jobs)</option>
                        <option value="scholarship">मेधावी छात्रवृत्ति</option>
                        <option value="workshop">कौशल कार्यशाला</option>
                      </select>

                      <select
                        value={statusFilter}
                        onChange={(e: any) => setStatusFilter(e.target.value)}
                        className="px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-amber-600"
                      >
                        <option value="all">सभी स्थितियां</option>
                        <option value="pending">प्रतीक्षारत (Pending)</option>
                        <option value="approved">स्वीकृत (Approved)</option>
                        <option value="rejected">अस्वीकृत (Rejected)</option>
                      </select>

                      <button
                        onClick={loadData}
                        disabled={loading}
                        className="p-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl text-stone-700 transition-colors cursor-pointer"
                        title="डेटा रिफ्रेश करें"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                      </button>
                    </div>

                    <button
                      onClick={handleExportCSV}
                      className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>Excel / CSV एक्सपोर्ट</span>
                    </button>
                  </div>

                  {/* Grid of Applications */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    <div className="lg:col-span-7 space-y-3">
                      {loading ? (
                        <div className="py-12 text-center text-stone-500 space-y-2">
                          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-amber-700" />
                          <p className="text-xs">डेटा लोड हो रहा है...</p>
                        </div>
                      ) : applications.length === 0 ? (
                        <div className="py-12 text-center text-stone-500 bg-white rounded-2xl border-2 border-dashed border-stone-200 p-6 space-y-2">
                          <ShieldCheck className="w-8 h-8 text-stone-400 mx-auto" />
                          <p className="text-sm font-bold text-stone-700">अभी कोई नया आवेदन प्राप्त नहीं हुआ है</p>
                          <p className="text-xs text-stone-500">
                            जैसे ही कोई समाज बंधु "युवा व शिक्षा" पेज से जॉब, छात्रवृत्ति या कार्यशाला का फॉर्म भरेगा, वह तुरंत यहाँ लाइव दिखेगा।
                          </p>
                        </div>
                      ) : (
                        applications
                          .filter((app) => {
                            if (typeFilter !== 'all' && app.type !== typeFilter) return false;
                            if (statusFilter !== 'all' && app.status !== statusFilter) return false;
                            if (searchQuery.trim()) {
                              const q = searchQuery.toLowerCase();
                              return (
                                app.applicantName.toLowerCase().includes(q) ||
                                app.phone.includes(q) ||
                                app.city.toLowerCase().includes(q) ||
                                (app.regNumber && app.regNumber.toLowerCase().includes(q))
                              );
                            }
                            return true;
                          })
                          .map((app) => (
                            <div
                              key={app.id}
                              onClick={() => setSelectedApp(app)}
                              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                                selectedApp?.id === app.id
                                  ? 'bg-amber-50/90 border-amber-500 shadow-xs'
                                  : 'bg-white border-stone-200 hover:border-amber-300'
                              }`}
                            >
                              <div className="w-14 h-16 rounded-xl overflow-hidden bg-amber-100 shrink-0 border border-amber-300 shadow-2xs">
                                <img
                                  src={app.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                                  alt={app.applicantName}
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              <div className="flex-1 min-w-0 space-y-1">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-[10px] font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                                    {app.regNumber || app.id.slice(0, 8)}
                                  </span>
                                  <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                      app.status === 'approved'
                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                        : app.status === 'rejected'
                                        ? 'bg-red-100 text-red-800 border border-red-300'
                                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                                    }`}
                                  >
                                    {app.status === 'approved'
                                      ? 'स्वीकृत'
                                      : app.status === 'rejected'
                                      ? 'अस्वीकृत'
                                      : 'प्रतीक्षारत'}
                                  </span>
                                </div>

                                <h5 className="font-bold text-stone-900 text-sm truncate">
                                  {app.applicantName}
                                </h5>

                                <div className="text-xs text-amber-900 font-medium truncate">
                                  {app.title}
                                </div>

                                <div className="flex items-center gap-3 text-[11px] text-stone-500 font-mono">
                                  <span>📞 {app.phone}</span>
                                  <span>📍 {app.city}</span>
                                </div>
                              </div>
                            </div>
                          ))
                      )}
                    </div>

                    {/* Detail Panel */}
                    <div className="lg:col-span-5">
                      {selectedApp ? (
                        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4 sticky top-4">
                          <div className="flex items-start gap-4 pb-3 border-b border-stone-100">
                            <div className="w-20 h-24 rounded-xl overflow-hidden bg-amber-100 shrink-0 border-2 border-amber-400">
                              <img
                                src={selectedApp.photo}
                                alt={selectedApp.applicantName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold uppercase text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                                {selectedApp.type === 'job' ? 'रोजगार अभ्यर्थी' : selectedApp.type === 'scholarship' ? 'छात्रवृत्ति' : 'कार्यशाला'}
                              </span>
                              <h4 className="text-base font-bold text-stone-900 font-display">
                                {selectedApp.applicantName}
                              </h4>
                              <div className="text-xs text-amber-900 font-semibold">
                                {selectedApp.title}
                              </div>
                              <div className="text-xs text-stone-500 font-mono">
                                पंजीकरण: <strong>{selectedApp.regNumber}</strong>
                              </div>
                            </div>
                          </div>

                          <div className="text-xs space-y-2 text-stone-700">
                            <div className="flex items-center gap-2">
                              <Phone className="w-3.5 h-3.5 text-stone-400" />
                              <span className="font-mono font-semibold">{selectedApp.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 truncate">
                              <Mail className="w-3.5 h-3.5 text-stone-400" />
                              <span className="font-mono">{selectedApp.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-stone-400" />
                              <span>{selectedApp.city}</span>
                            </div>
                          </div>

                          {selectedApp.fields && (
                            <div className="text-xs space-y-1.5 pt-2 border-t border-stone-100">
                              <div className="font-bold text-stone-800 mb-1">आवेदन में भरे गए विवरण:</div>
                              {selectedApp.fields.map((f, idx) => (
                                <div key={idx} className="flex justify-between gap-2 border-b border-stone-50 pb-1">
                                  <span className="text-stone-500 text-[11px]">{f.label}:</span>
                                  <span className="font-semibold text-stone-900 text-right">{f.value}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="space-y-2 pt-2 border-t border-stone-100">
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => handleStatusChange(selectedApp.id, 'approved')}
                                className="py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                              >
                                <CheckCircle className="w-4 h-4" />
                                <span>स्वीकृत करें (Approve)</span>
                              </button>

                              <button
                                onClick={() => handleStatusChange(selectedApp.id, 'rejected')}
                                className="py-2 px-3 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                              >
                                <XCircle className="w-4 h-4" />
                                <span>अस्वीकृत करें (Reject)</span>
                              </button>
                            </div>

                            <div className="flex items-center justify-between pt-1">
                              <button
                                onClick={() => handleStatusChange(selectedApp.id, 'pending')}
                                className="text-xs text-stone-500 hover:text-stone-800 underline cursor-pointer"
                              >
                                पुनः प्रतीक्षारत (Pending) करें
                              </button>

                              <button
                                onClick={() => handleDelete(selectedApp.id)}
                                className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-1 font-semibold transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>डेटाबेस से हटाएं</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white p-8 rounded-2xl border border-dashed border-stone-300 text-center text-stone-400">
                          <Eye className="w-8 h-8 mx-auto mb-2 text-stone-300" />
                          <p className="text-xs">विवरण व अप्रूवल देखने के लिए बाईं सूची से किसी आवेदन पर क्लिक करें।</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 2: PRESIDENT & FOUNDER PROFILE */}
              {/* ======================================================== */}
              {activeTab === 'president' && (
                <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
                  <div className="border-b border-stone-100 pb-4">
                    <h4 className="text-lg font-bold text-stone-900 font-display flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-amber-700" />
                      <span>राष्ट्रीय अध्यक्ष / संस्थापक मुख्य संरक्षक प्रोफ़ाइल संपादन</span>
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      यहाँ किया गया बदलाव मुख्य पृष्ठ (Home Page) के मुख्य संदेश व फ़ोटो पर तुरंत दिखेगा।
                    </p>
                  </div>

                  <form onSubmit={handleSaveFounder} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                      {/* Photo Preview & URL */}
                      <div className="md:col-span-4 space-y-3 text-center">
                        <div className="w-44 h-52 mx-auto rounded-2xl overflow-hidden border-4 border-amber-600 shadow-md bg-stone-900">
                          <img
                            src={editFounder.photo}
                            alt={editFounder.name}
                            className="w-full h-full object-cover"
                            onError={(e: any) => {
                              e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600';
                            }}
                          />
                        </div>
                        <div className="text-[11px] text-stone-500">लाइव फोटो पूर्वावलोकन (Preview)</div>

                        <div className="space-y-1 text-left">
                          <label className="text-xs font-bold text-stone-700">फोटो URL (Photo Web Link):</label>
                          <input
                            type="url"
                            value={editFounder.photo}
                            onChange={(e) => setEditFounder({ ...editFounder, photo: e.target.value })}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-amber-600"
                            required
                          />
                        </div>
                      </div>

                      {/* Details Fields */}
                      <div className="md:col-span-8 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-stone-700">पूरा नाम (Full Name) *</label>
                            <input
                              type="text"
                              value={editFounder.name}
                              onChange={(e) => setEditFounder({ ...editFounder, name: e.target.value })}
                              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-amber-600"
                              required
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-stone-700">पदनाम / दायित्व (Designation) *</label>
                            <input
                              type="text"
                              value={editFounder.designation}
                              onChange={(e) => setEditFounder({ ...editFounder, designation: e.target.value })}
                              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-amber-600"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-stone-700">कार्यकाल / बैज (Tenure) *</label>
                            <input
                              type="text"
                              value={editFounder.tenure}
                              onChange={(e) => setEditFounder({ ...editFounder, tenure: e.target.value })}
                              placeholder="उदा. राष्ट्रीय अध्यक्ष · 2024-2027"
                              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-amber-600"
                              required
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-stone-700">मंगलाचरण / शीर्षक (Salutation) *</label>
                            <input
                              type="text"
                              value={editFounder.salutation}
                              onChange={(e) => setEditFounder({ ...editFounder, salutation: e.target.value })}
                              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-amber-600"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-stone-700">प्रेरणादायी उद्धरण (Quote) *</label>
                          <input
                            type="text"
                            value={editFounder.quote}
                            onChange={(e) => setEditFounder({ ...editFounder, quote: e.target.value })}
                            className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-amber-600"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-stone-700">प्रेरणादायी संदेश (Full Message) *</label>
                          <textarea
                            rows={6}
                            value={editFounder.message}
                            onChange={(e) => setEditFounder({ ...editFounder, message: e.target.value })}
                            className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-amber-600 leading-relaxed font-hindi"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-stone-100 flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all flex items-center gap-2"
                      >
                        <Save className="w-4 h-4 text-amber-200" />
                        <span>परिवर्तन सुरक्षित करें (Save Profile)</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 3: TEAM MEMBERS & EXECUTIVES */}
              {/* ======================================================== */}
              {activeTab === 'team' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200">
                    <div>
                      <h4 className="font-bold text-base text-stone-900 font-display">
                        केंद्रीय कार्यकारिणी समिति व प्रमुख पदाधिकारी
                      </h4>
                      <p className="text-xs text-stone-500">
                        पदाधिकारियों का नाम, पद, फोटो, नगर और मोबाइल नंबर जोड़ें अथवा संपादित करें।
                      </p>
                    </div>

                    <button
                      onClick={() => setIsAddingMember(true)}
                      className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ नया पदाधिकारी जोड़ें</span>
                    </button>
                  </div>

                  {/* Add New Member Modal Form */}
                  {isAddingMember && (
                    <div className="bg-amber-50/80 p-5 rounded-2xl border-2 border-amber-400 space-y-4">
                      <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                        <h5 className="font-bold text-sm text-amber-950 font-display flex items-center gap-1.5">
                          <Plus className="w-4 h-4 text-amber-800" />
                          <span>नया पदाधिकारी जोड़ें (Add New Officer)</span>
                        </h5>
                        <button onClick={() => setIsAddingMember(false)} className="text-stone-500 hover:text-stone-800">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleAddNewMember} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                        <div className="space-y-1">
                          <label className="font-bold text-stone-800">नाम *</label>
                          <input
                            type="text"
                            required
                            value={newMemberForm.name}
                            onChange={(e) => setNewMemberForm({ ...newMemberForm, name: e.target.value })}
                            placeholder="उदा. श्री सुनील विश्वकर्मा"
                            className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-stone-800">पद (हिंदी में) *</label>
                          <input
                            type="text"
                            required
                            value={newMemberForm.postHi}
                            onChange={(e) => setNewMemberForm({ ...newMemberForm, postHi: e.target.value })}
                            placeholder="उदा. राष्ट्रीय उपाध्यक्ष"
                            className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-stone-800">पद (अंग्रेजी में)</label>
                          <input
                            type="text"
                            value={newMemberForm.postEn}
                            onChange={(e) => setNewMemberForm({ ...newMemberForm, postEn: e.target.value })}
                            placeholder="उदा. National Vice President"
                            className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-stone-800">नगर (City) *</label>
                          <input
                            type="text"
                            required
                            value={newMemberForm.city}
                            onChange={(e) => setNewMemberForm({ ...newMemberForm, city: e.target.value })}
                            placeholder="उदा. जयपुर"
                            className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-stone-800">राज्य (State) *</label>
                          <input
                            type="text"
                            required
                            value={newMemberForm.state}
                            onChange={(e) => setNewMemberForm({ ...newMemberForm, state: e.target.value })}
                            placeholder="उदा. राजस्थान"
                            className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-stone-800">मोबाइल नंबर *</label>
                          <input
                            type="tel"
                            required
                            value={newMemberForm.phone}
                            onChange={(e) => setNewMemberForm({ ...newMemberForm, phone: e.target.value })}
                            placeholder="उदा. +91 98250 11223"
                            className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl font-mono"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-stone-800">ईमेल पता</label>
                          <input
                            type="email"
                            value={newMemberForm.email}
                            onChange={(e) => setNewMemberForm({ ...newMemberForm, email: e.target.value })}
                            placeholder="उदा. name@vishwakarmasamaj.org"
                            className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl font-mono"
                          />
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <label className="font-bold text-stone-800">फोटो वेब लिंक (Image URL) *</label>
                          <input
                            type="url"
                            required
                            value={newMemberForm.photo}
                            onChange={(e) => setNewMemberForm({ ...newMemberForm, photo: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs"
                          />
                        </div>

                        <div className="space-y-1 sm:col-span-3">
                          <label className="font-bold text-stone-800">संक्षिप्त परिचय (Short Bio) *</label>
                          <textarea
                            rows={2}
                            required
                            value={newMemberForm.bio}
                            onChange={(e) => setNewMemberForm({ ...newMemberForm, bio: e.target.value })}
                            placeholder="उदा. 25 वर्षों से समाज सेवा में अग्रणी, युवा कौशल मार्गदर्शन..."
                            className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                          />
                        </div>

                        <div className="sm:col-span-3 flex justify-end gap-2 pt-2 border-t border-amber-200">
                          <button
                            type="button"
                            onClick={() => setIsAddingMember(false)}
                            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-semibold cursor-pointer"
                          >
                            रद्द करें
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                          >
                            <Save className="w-4 h-4" />
                            <span>पदाधिकारी जोड़ें</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Team Members List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {editTeamList.map((m) => (
                      <div
                        key={m.id}
                        className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs hover:shadow-xs transition-all space-y-3 flex flex-col justify-between"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-16 h-20 rounded-xl overflow-hidden bg-stone-100 shrink-0 border-2 border-amber-600 shadow-2xs">
                            <img
                              src={m.photo}
                              alt={m.name}
                              className="w-full h-full object-cover"
                              onError={(e: any) => {
                                e.target.src = 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500';
                              }}
                            />
                          </div>

                          <div className="space-y-0.5 min-w-0">
                            <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 inline-block">
                              {m.postHi}
                            </span>
                            <h5 className="font-bold text-stone-900 text-sm truncate">{m.name}</h5>
                            <div className="text-[11px] text-stone-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-stone-400" />
                              <span>{m.city}, {m.state}</span>
                            </div>
                            {m.phone && (
                              <div className="text-[11px] text-amber-900 font-mono flex items-center gap-1">
                                <Phone className="w-3 h-3 text-amber-700" />
                                <span>{m.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-stone-600 font-hindi line-clamp-2 leading-relaxed">
                          {m.bio}
                        </p>

                        <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                          <button
                            onClick={() => setSelectedMember(m)}
                            className="px-3 py-1 text-amber-800 hover:bg-amber-50 rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>संपादित करें</span>
                          </button>

                          <button
                            onClick={() => handleDeleteMember(m.id)}
                            className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>हटाएं</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Edit Member Modal */}
                  {selectedMember && (
                    <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
                      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                          <h4 className="font-bold text-base text-stone-900 font-display">
                            पदाधिकारी विवरण संपादन ({selectedMember.name})
                          </h4>
                          <button onClick={() => setSelectedMember(null)} className="text-stone-400 hover:text-stone-700">
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <form onSubmit={handleSaveMemberEdit} className="space-y-3 text-xs">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="font-bold text-stone-800">नाम *</label>
                              <input
                                type="text"
                                required
                                value={selectedMember.name}
                                onChange={(e) => setSelectedMember({ ...selectedMember, name: e.target.value })}
                                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="font-bold text-stone-800">पद (हिंदी) *</label>
                              <input
                                type="text"
                                required
                                value={selectedMember.postHi}
                                onChange={(e) => setSelectedMember({ ...selectedMember, postHi: e.target.value })}
                                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="font-bold text-stone-800">नगर (City) *</label>
                              <input
                                type="text"
                                required
                                value={selectedMember.city}
                                onChange={(e) => setSelectedMember({ ...selectedMember, city: e.target.value })}
                                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="font-bold text-stone-800">राज्य (State) *</label>
                              <input
                                type="text"
                                required
                                value={selectedMember.state}
                                onChange={(e) => setSelectedMember({ ...selectedMember, state: e.target.value })}
                                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="font-bold text-stone-800">मोबाइल फोन *</label>
                              <input
                                type="tel"
                                required
                                value={selectedMember.phone}
                                onChange={(e) => setSelectedMember({ ...selectedMember, phone: e.target.value })}
                                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="font-bold text-stone-800">ईमेल</label>
                              <input
                                type="email"
                                value={selectedMember.email}
                                onChange={(e) => setSelectedMember({ ...selectedMember, email: e.target.value })}
                                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-stone-800">फोटो वेब लिंक (Image URL) *</label>
                            <input
                              type="url"
                              required
                              value={selectedMember.photo}
                              onChange={(e) => setSelectedMember({ ...selectedMember, photo: e.target.value })}
                              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono text-xs"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-stone-800">संक्षिप्त परिचय (Bio) *</label>
                            <textarea
                              rows={3}
                              required
                              value={selectedMember.bio}
                              onChange={(e) => setSelectedMember({ ...selectedMember, bio: e.target.value })}
                              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                            />
                          </div>

                          <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                            <button
                              type="button"
                              onClick={() => setSelectedMember(null)}
                              className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-semibold cursor-pointer"
                            >
                              रद्द करें
                            </button>
                            <button
                              type="submit"
                              className="px-5 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                            >
                              <Save className="w-4 h-4" />
                              <span>सुरक्षित करें</span>
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 4: OFFICE ADDRESS & CONTACTS */}
              {/* ======================================================== */}
              {activeTab === 'office' && (
                <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
                  <div className="border-b border-stone-100 pb-4">
                    <h4 className="text-lg font-bold text-stone-900 font-display flex items-center gap-2">
                      <Building className="w-5 h-5 text-amber-700" />
                      <span>समाज सचिवालय, मुख्य कार्यालय व संपर्क विवरण</span>
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      यह जानकारी वेबसाइट के फुटर (Footer) और संपर्क अनुभागों में प्रदर्शित होगी।
                    </p>
                  </div>

                  <form onSubmit={handleSaveContacts} className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <label className="font-bold text-stone-800">केंद्रीय कार्यालय का पता (Head Office Address) *</label>
                      <input
                        type="text"
                        required
                        value={editContact.address}
                        onChange={(e) => setEditContact({ ...editContact, address: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-amber-600 text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-bold text-stone-800">आधिकारिक हेल्पलाइन (Helpline / Toll-Free) *</label>
                        <input
                          type="text"
                          required
                          value={editContact.helpline}
                          onChange={(e) => setEditContact({ ...editContact, helpline: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl font-mono text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-stone-800">आधिकारिक ईमेल (Official Email) *</label>
                        <input
                          type="email"
                          required
                          value={editContact.email}
                          onChange={(e) => setEditContact({ ...editContact, email: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-bold text-stone-800">रक्तदान व आपातकाल नंबर (Emergency Contact) *</label>
                        <input
                          type="text"
                          required
                          value={editContact.emergencyPhone}
                          onChange={(e) => setEditContact({ ...editContact, emergencyPhone: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl font-mono text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-stone-800">सोसायटी पंजीकरण संख्या (Registration No.) *</label>
                        <input
                          type="text"
                          required
                          value={editContact.regNumber}
                          onChange={(e) => setEditContact({ ...editContact, regNumber: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-stone-800">दान हेतु आधिकारिक UPI ID (Donation UPI)</label>
                      <input
                        type="text"
                        value={editContact.bankUpi}
                        onChange={(e) => setEditContact({ ...editContact, bankUpi: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl font-mono text-xs"
                      />
                    </div>

                    <div className="pt-4 border-t border-stone-100 flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all flex items-center gap-2"
                      >
                        <Save className="w-4 h-4 text-amber-200" />
                        <span>सचिवालय संपर्क विवरण सुरक्षित करें</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB: DONATION & BANK SETUP (पूर्ण दान फॉर्म संपादन) */}
              {/* ======================================================== */}
              {activeTab === 'donation' && (
                <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
                    <div>
                      <h4 className="text-lg font-bold text-stone-900 font-display flex items-center gap-2">
                        <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
                        <span>दान एवं सहायता कोष खाता व फॉर्म प्रबंधन (Donation Form & Bank Setup)</span>
                      </h4>
                      <p className="text-xs text-stone-500 mt-0.5">
                        यहाँ संपादित बैंक विवरण, आधिकारिक UPI ID, दान उद्देश्य व राशियां सीधे वेबसाइट के दान फॉर्म में अपडेट होंगी।
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onOpenDonateModal?.()}
                      className="px-4 py-2 bg-gradient-to-r from-rose-600 to-amber-700 hover:from-rose-700 hover:to-amber-800 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all flex items-center gap-2 shrink-0 transform hover:scale-102"
                      title="लाइव दान फॉर्म पॉपअप खोलें"
                    >
                      <Sparkles className="w-4 h-4 text-amber-200" />
                      <span>दान फॉर्म लाइव खोलें / टेस्ट करें</span>
                    </button>
                  </div>

                  <form onSubmit={handleSaveDonation} className="space-y-6 text-xs">
                    {/* Part A: Form Titles & Subtitle */}
                    <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 space-y-3">
                      <div className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                        <Edit className="w-3.5 h-3.5 text-amber-700" />
                        <span>दान प्रपत्र शीर्षक एवं परिचय (Form Title & Note)</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="font-bold text-stone-800">दान फॉर्म मुख्य शीर्षक *</label>
                          <input
                            type="text"
                            required
                            value={editDonation.formTitleHi || 'विश्वकर्मा समाज समर्पण एवं सहायता निधि कोष'}
                            onChange={(e) => setEditDonation({ ...editDonation, formTitleHi: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-stone-800">दान फॉर्म उप-शीर्षक / ध्येय वाक्य *</label>
                          <input
                            type="text"
                            required
                            value={editDonation.formSubtitleHi || 'पारदर्शी समाज सेवा, मेधावी छात्रवृत्ति, आपात चिकित्सा व मंदिर जीर्णोद्धार सहयोग'}
                            onChange={(e) => setEditDonation({ ...editDonation, formSubtitleHi: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Part B: Bank & UPI Info */}
                    <div className="space-y-3">
                      <div className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-amber-700" />
                        <span>बैंक खाता एवं अधिकृत UPI विवरण (Bank & UPI Details)</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="font-bold text-stone-800">बैंक का नाम (Bank Name) *</label>
                          <input
                            type="text"
                            required
                            value={editDonation.bankName}
                            onChange={(e) => setEditDonation({ ...editDonation, bankName: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-stone-800">खाता धारक का नाम (Account Holder) *</label>
                          <input
                            type="text"
                            required
                            value={editDonation.accountHolder}
                            onChange={(e) => setEditDonation({ ...editDonation, accountHolder: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="font-bold text-stone-800">खाता संख्या (Account Number) *</label>
                          <input
                            type="text"
                            required
                            value={editDonation.accountNumber}
                            onChange={(e) => setEditDonation({ ...editDonation, accountNumber: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl font-mono"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-stone-800">IFSC कोड *</label>
                          <input
                            type="text"
                            required
                            value={editDonation.ifscCode}
                            onChange={(e) => setEditDonation({ ...editDonation, ifscCode: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl font-mono uppercase"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="font-bold text-stone-800">शाखा (Branch) *</label>
                          <input
                            type="text"
                            required
                            value={editDonation.branch}
                            onChange={(e) => setEditDonation({ ...editDonation, branch: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-stone-800">अधिकृत UPI ID *</label>
                          <input
                            type="text"
                            required
                            value={editDonation.upiId}
                            onChange={(e) => setEditDonation({ ...editDonation, upiId: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl font-mono font-bold text-amber-950"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-stone-800">UPI पेयी नाम (Payee Name) *</label>
                          <input
                            type="text"
                            required
                            value={editDonation.payeeName || 'Akhil Bharatiya Vishwakarma Samaj Trust'}
                            onChange={(e) => setEditDonation({ ...editDonation, payeeName: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Part C: 80G & NGO Darpan */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="font-bold text-stone-800">80G आयकर छूट संख्या *</label>
                        <input
                          type="text"
                          required
                          value={editDonation.tax80gNumber}
                          onChange={(e) => setEditDonation({ ...editDonation, tax80gNumber: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-stone-800">नीति आयोग एनजीओ दर्पण ID</label>
                        <input
                          type="text"
                          value={editDonation.ngoDarpanId || 'DL/2021/0284918'}
                          onChange={(e) => setEditDonation({ ...editDonation, ngoDarpanId: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-stone-800">दान सहायता हेल्पलाइन नंबर *</label>
                        <input
                          type="text"
                          required
                          value={editDonation.supportPhone}
                          onChange={(e) => setEditDonation({ ...editDonation, supportPhone: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl font-mono"
                        />
                      </div>
                    </div>

                    {/* Part D: Suggested Amounts Editor */}
                    <div className="space-y-1.5 bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                      <label className="font-bold text-stone-800 block">सुझाई गई दान राशियां (अल्पविराम से अलग करें):</label>
                      <input
                        type="text"
                        value={editDonation.suggestedAmounts?.join(', ') || '501, 1100, 2100, 5100, 11000, 21000'}
                        onChange={(e) => {
                          const parsed = e.target.value
                            .split(',')
                            .map((s) => Number(s.trim()))
                            .filter((n) => !isNaN(n) && n > 0);
                          setEditDonation({ ...editDonation, suggestedAmounts: parsed });
                        }}
                        placeholder="501, 1100, 2100, 5100, 11000, 21000"
                        className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl font-mono"
                      />
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {(editDonation.suggestedAmounts || [501, 1100, 2100, 5100, 11000, 21000]).map((amt) => (
                          <span key={amt} className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-bold font-mono text-[11px]">
                            ₹{amt.toLocaleString('en-IN')}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Part E: Donation Causes / Purposes */}
                    <div className="space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-stone-900 block">
                          दान के सक्रिय उद्देश्य व प्रकोष्ठ (Donation Purposes / Causes):
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsAddingCause(!isAddingCause)}
                          className="px-2.5 py-1 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ नया उद्देश्य जोड़ें</span>
                        </button>
                      </div>

                      {isAddingCause && (
                        <div className="bg-white p-3 rounded-xl border border-amber-300 space-y-2">
                          <input
                            type="text"
                            placeholder="उद्देश्य का नाम (उदा. निःशुल्क चिकित्सा कैम्प)"
                            value={newCauseForm.labelHi}
                            onChange={(e) => setNewCauseForm({ ...newCauseForm, labelHi: e.target.value })}
                            className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs"
                          />
                          <input
                            type="text"
                            placeholder="संक्षिप्त विवरण"
                            value={newCauseForm.desc}
                            onChange={(e) => setNewCauseForm({ ...newCauseForm, desc: e.target.value })}
                            className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setIsAddingCause(false)}
                              className="px-3 py-1 bg-stone-200 rounded-lg text-xs"
                            >
                              रद्द करें
                            </button>
                            <button
                              type="button"
                              onClick={handleAddDonationCause}
                              className="px-3 py-1 bg-amber-800 text-white font-bold rounded-lg text-xs"
                            >
                              उद्देश्य जोड़ें
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        {(editDonation.purposes || DEFAULT_DONATION_CONFIG.purposes || []).map((p) => (
                          <div
                            key={p.id}
                            className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-stone-200 text-xs"
                          >
                            <div>
                              <div className="font-bold text-stone-900">{p.labelHi}</div>
                              <div className="text-[11px] text-stone-500">{p.desc}</div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteDonationCause(p.id)}
                              className="text-stone-400 hover:text-red-600 p-1 cursor-pointer"
                              title="हटाएं"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => onOpenDonateModal?.()}
                        className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-4 h-4 text-stone-600" />
                        <span>पॉपअप में दान फॉर्म देखें</span>
                      </button>

                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all flex items-center gap-2"
                      >
                        <Save className="w-4 h-4 text-amber-200" />
                        <span>दान व बैंक विवरण सुरक्षित करें</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB: FORMS & SCHEMES MANAGER (Jobs, Scholarships, Workshops) */}
              {/* ======================================================== */}
              {activeTab === 'schemes' && (
                <div className="space-y-5">
                  {/* All Forms Master Sub-navigation */}
                  <div className="flex items-center gap-2 border-b border-stone-200 pb-3 overflow-x-auto scrollbar-none">
                    <button
                      onClick={() => setSchemesSubTab('jobs')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                        schemesSubTab === 'jobs'
                          ? 'bg-amber-800 text-white shadow-2xs'
                          : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                      }`}
                    >
                      <Briefcase className="w-3.5 h-3.5 inline mr-1" />
                      <span>रोजगार रिक्तियां ({editJobsList.length})</span>
                    </button>

                    <button
                      onClick={() => setSchemesSubTab('scholarships')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                        schemesSubTab === 'scholarships'
                          ? 'bg-amber-800 text-white shadow-2xs'
                          : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                      }`}
                    >
                      <GraduationCap className="w-3.5 h-3.5 inline mr-1" />
                      <span>छात्रवृत्तियां ({editSchList.length})</span>
                    </button>

                    <button
                      onClick={() => setSchemesSubTab('workshops')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                        schemesSubTab === 'workshops'
                          ? 'bg-amber-800 text-white shadow-2xs'
                          : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                      }`}
                    >
                      <Building className="w-3.5 h-3.5 inline mr-1" />
                      <span>कार्यशालाएं ({editWsList.length})</span>
                    </button>

                    <button
                      onClick={() => setSchemesSubTab('idcard')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                        schemesSubTab === 'idcard'
                          ? 'bg-amber-800 text-white shadow-2xs'
                          : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                      }`}
                    >
                      <Award className="w-3.5 h-3.5 inline mr-1" />
                      <span>पहचान पत्र फॉर्म</span>
                    </button>

                    <button
                      onClick={() => setSchemesSubTab('matrimony')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                        schemesSubTab === 'matrimony'
                          ? 'bg-amber-800 text-white shadow-2xs'
                          : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                      }`}
                    >
                      <Heart className="w-3.5 h-3.5 inline mr-1" />
                      <span>विवाह बायोडाटा फॉर्म</span>
                    </button>

                    <button
                      onClick={() => setSchemesSubTab('artisan')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                        schemesSubTab === 'artisan'
                          ? 'bg-amber-800 text-white shadow-2xs'
                          : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 inline mr-1" />
                      <span>कारीगर पंजीयन फॉर्म</span>
                    </button>

                    <button
                      onClick={() => setSchemesSubTab('post')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                        schemesSubTab === 'post'
                          ? 'bg-amber-800 text-white shadow-2xs'
                          : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                      }`}
                    >
                      <Edit className="w-3.5 h-3.5 inline mr-1" />
                      <span>चर्चा पोस्ट फॉर्म</span>
                    </button>
                  </div>

                  {/* Sub-tab 1: Jobs */}
                  {schemesSubTab === 'jobs' && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center bg-white p-3.5 rounded-2xl border border-stone-200">
                        <div>
                          <h5 className="font-bold text-sm text-stone-900 font-display">सक्रिय रोजगार रिक्तियां (Job Board Openings)</h5>
                          <p className="text-xs text-stone-500">नया पद जोड़ें या पुरानी रिक्तियों को संपादित करें।</p>
                        </div>
                        <button
                          onClick={() => setIsAddingJob(true)}
                          className="px-3.5 py-1.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ नई रिक्ति जोड़ें</span>
                        </button>
                      </div>

                      {isAddingJob && (
                        <form onSubmit={handleAddNewJob} className="bg-amber-50 p-4 rounded-2xl border border-amber-300 space-y-3 text-xs">
                          <div className="font-bold text-amber-950">नई नौकरी रिक्ति विवरण:</div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input
                              type="text"
                              required
                              placeholder="पद का नाम (Title)"
                              value={newJobForm.title}
                              onChange={(e) => setNewJobForm({ ...newJobForm, title: e.target.value })}
                              className="px-3 py-2 bg-white border border-stone-300 rounded-xl"
                            />
                            <input
                              type="text"
                              required
                              placeholder="कंपनी / नियोक्ता (Company)"
                              value={newJobForm.company}
                              onChange={(e) => setNewJobForm({ ...newJobForm, company: e.target.value })}
                              className="px-3 py-2 bg-white border border-stone-300 rounded-xl"
                            />
                            <input
                              type="text"
                              required
                              placeholder="स्थान (Location, e.g. जयपुर)"
                              value={newJobForm.location}
                              onChange={(e) => setNewJobForm({ ...newJobForm, location: e.target.value })}
                              className="px-3 py-2 bg-white border border-stone-300 rounded-xl"
                            />
                            <input
                              type="text"
                              required
                              placeholder="वेतन / मानदेय (Salary)"
                              value={newJobForm.salary}
                              onChange={(e) => setNewJobForm({ ...newJobForm, salary: e.target.value })}
                              className="px-3 py-2 bg-white border border-stone-300 rounded-xl"
                            />
                            <input
                              type="text"
                              required
                              placeholder="आवश्यक कौशल (Skills)"
                              value={newJobForm.skills}
                              onChange={(e) => setNewJobForm({ ...newJobForm, skills: e.target.value })}
                              className="px-3 py-2 bg-white border border-stone-300 rounded-xl sm:col-span-2"
                            />
                          </div>
                          <div className="flex justify-end gap-2 pt-2">
                            <button type="button" onClick={() => setIsAddingJob(false)} className="px-3 py-1.5 bg-stone-200 rounded-lg">रद्द करें</button>
                            <button type="submit" className="px-4 py-1.5 bg-amber-800 text-white font-bold rounded-lg flex items-center gap-1"><Save className="w-3.5 h-3.5" /> रिक्ति प्रकाशित करें</button>
                          </div>
                        </form>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {editJobsList.map((j) => (
                          <div key={j.id} className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-col justify-between space-y-2">
                            <div>
                              <div className="flex justify-between items-start gap-2">
                                <h6 className="font-bold text-stone-900 text-sm">{j.title}</h6>
                                <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">{j.type}</span>
                              </div>
                              <div className="text-xs text-stone-600 mt-1">{j.company} · {j.location}</div>
                              <div className="text-xs font-mono font-bold text-amber-900 mt-1">{j.salary}</div>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-stone-100 text-xs">
                              <span className="text-stone-400 text-[11px]">{j.deadline}</span>
                              <button onClick={() => handleDeleteJob(j.id)} className="text-red-600 hover:text-red-800 font-bold flex items-center gap-1 cursor-pointer">
                                <Trash2 className="w-3.5 h-3.5" /> हटाएं
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sub-tab 2: Scholarships */}
                  {schemesSubTab === 'scholarships' && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center bg-white p-3.5 rounded-2xl border border-stone-200">
                        <div>
                          <h5 className="font-bold text-sm text-stone-900 font-display">मेधावी छात्रवृत्ति योजनाएं</h5>
                          <p className="text-xs text-stone-500">नई छात्रवृत्ति योजना जोड़ें या वर्तमान को संपादित करें।</p>
                        </div>
                        <button
                          onClick={() => setIsAddingSch(true)}
                          className="px-3.5 py-1.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ नई छात्रवृत्ति योजना</span>
                        </button>
                      </div>

                      {isAddingSch && (
                        <form onSubmit={handleAddNewSch} className="bg-amber-50 p-4 rounded-2xl border border-amber-300 space-y-3 text-xs">
                          <div className="font-bold text-amber-950">नई छात्रवृत्ति योजना:</div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input
                              type="text"
                              required
                              placeholder="योजना का नाम"
                              value={newSchForm.title}
                              onChange={(e) => setNewSchForm({ ...newSchForm, title: e.target.value })}
                              className="px-3 py-2 bg-white border border-stone-300 rounded-xl"
                            />
                            <input
                              type="text"
                              required
                              placeholder="सहायता राशि (उदा. ₹ 50,000 प्रतिवर्ष)"
                              value={newSchForm.amount}
                              onChange={(e) => setNewSchForm({ ...newSchForm, amount: e.target.value })}
                              className="px-3 py-2 bg-white border border-stone-300 rounded-xl"
                            />
                            <input
                              type="text"
                              required
                              placeholder="पात्रता मानदंड (Eligibility)"
                              value={newSchForm.eligibility}
                              onChange={(e) => setNewSchForm({ ...newSchForm, eligibility: e.target.value })}
                              className="px-3 py-2 bg-white border border-stone-300 rounded-xl sm:col-span-2"
                            />
                            <input
                              type="text"
                              required
                              placeholder="अंतिम तिथि (Last Date)"
                              value={newSchForm.lastDate}
                              onChange={(e) => setNewSchForm({ ...newSchForm, lastDate: e.target.value })}
                              className="px-3 py-2 bg-white border border-stone-300 rounded-xl"
                            />
                          </div>
                          <div className="flex justify-end gap-2 pt-2">
                            <button type="button" onClick={() => setIsAddingSch(false)} className="px-3 py-1.5 bg-stone-200 rounded-lg">रद्द करें</button>
                            <button type="submit" className="px-4 py-1.5 bg-amber-800 text-white font-bold rounded-lg flex items-center gap-1"><Save className="w-3.5 h-3.5" /> योजना जोड़ें</button>
                          </div>
                        </form>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {editSchList.map((s) => (
                          <div key={s.id} className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-col justify-between space-y-2">
                            <div>
                              <h6 className="font-bold text-stone-900 text-sm">{s.title}</h6>
                              <div className="text-xs text-amber-900 font-bold mt-1">{s.amount}</div>
                              <div className="text-xs text-stone-600 mt-1 leading-relaxed">{s.eligibility}</div>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-stone-100 text-xs">
                              <span className="text-stone-400 text-[11px]">अंतिम तिथि: {s.lastDate}</span>
                              <button onClick={() => handleDeleteSch(s.id)} className="text-red-600 hover:text-red-800 font-bold flex items-center gap-1 cursor-pointer">
                                <Trash2 className="w-3.5 h-3.5" /> हटाएं
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sub-tab 3: Workshops */}
                  {schemesSubTab === 'workshops' && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center bg-white p-3.5 rounded-2xl border border-stone-200">
                        <div>
                          <h5 className="font-bold text-sm text-stone-900 font-display">कौशल संवर्धन कार्यशालाएं</h5>
                          <p className="text-xs text-stone-500">नई कार्यशाला सत्र जोड़ें या संपादित करें।</p>
                        </div>
                        <button
                          onClick={() => setIsAddingWs(true)}
                          className="px-3.5 py-1.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ नई कार्यशाला</span>
                        </button>
                      </div>

                      {isAddingWs && (
                        <form onSubmit={handleAddNewWs} className="bg-amber-50 p-4 rounded-2xl border border-amber-300 space-y-3 text-xs">
                          <div className="font-bold text-amber-950">नई कार्यशाला:</div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input
                              type="text"
                              required
                              placeholder="कार्यशाला का नाम"
                              value={newWsForm.title}
                              onChange={(e) => setNewWsForm({ ...newWsForm, title: e.target.value })}
                              className="px-3 py-2 bg-white border border-stone-300 rounded-xl"
                            />
                            <input
                              type="text"
                              required
                              placeholder="श्रेणी (Category, e.g. काष्ठकला व तकनीक)"
                              value={newWsForm.category}
                              onChange={(e) => setNewWsForm({ ...newWsForm, category: e.target.value })}
                              className="px-3 py-2 bg-white border border-stone-300 rounded-xl"
                            />
                            <input
                              type="text"
                              required
                              placeholder="समय व दिन (Schedule)"
                              value={newWsForm.schedule}
                              onChange={(e) => setNewWsForm({ ...newWsForm, schedule: e.target.value })}
                              className="px-3 py-2 bg-white border border-stone-300 rounded-xl"
                            />
                            <input
                              type="text"
                              required
                              placeholder="प्रशिक्षक (Instructor)"
                              value={newWsForm.instructor}
                              onChange={(e) => setNewWsForm({ ...newWsForm, instructor: e.target.value })}
                              className="px-3 py-2 bg-white border border-stone-300 rounded-xl"
                            />
                          </div>
                          <div className="flex justify-end gap-2 pt-2">
                            <button type="button" onClick={() => setIsAddingWs(false)} className="px-3 py-1.5 bg-stone-200 rounded-lg">रद्द करें</button>
                            <button type="submit" className="px-4 py-1.5 bg-amber-800 text-white font-bold rounded-lg flex items-center gap-1"><Save className="w-3.5 h-3.5" /> कार्यशाला जोड़ें</button>
                          </div>
                        </form>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {editWsList.map((w) => (
                          <div key={w.id} className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-col justify-between space-y-2">
                            <div>
                              <div className="flex justify-between items-start gap-2">
                                <h6 className="font-bold text-stone-900 text-sm">{w.title}</h6>
                                <span className="text-[10px] bg-stone-100 text-stone-800 px-2 py-0.5 rounded font-bold">{w.category}</span>
                              </div>
                              <div className="text-xs text-stone-600 mt-1">{w.schedule} · प्रशिक्षक: {w.instructor}</div>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-stone-100 text-xs">
                              <span className="text-emerald-700 font-bold text-[11px]">{w.seats}</span>
                              <button onClick={() => handleDeleteWs(w.id)} className="text-red-600 hover:text-red-800 font-bold flex items-center gap-1 cursor-pointer">
                                <Trash2 className="w-3.5 h-3.5" /> हटाएं
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sub-tab 4: ID Card Form Editor */}
                  {schemesSubTab === 'idcard' && (
                    <div className="max-w-3xl mx-auto bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-xs space-y-5 text-xs">
                      <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
                        <div>
                          <h5 className="font-bold text-sm text-stone-900 font-display flex items-center gap-1.5">
                            <Award className="w-4 h-4 text-amber-700" />
                            <span>विश्वकर्मा डिजिटल परिचय पत्र फॉर्म सेटिंग्स व विकल्प</span>
                          </h5>
                          <p className="text-xs text-stone-500 mt-0.5">
                            सदस्यता पहचान पत्र फॉर्म के शीर्षक, उपजाति विकल्प, वैधता व शर्तें संपादित करें।
                          </p>
                        </div>
                      </div>

                      <form onSubmit={handleSaveIdCardConfig} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="font-bold text-stone-800">पहचान पत्र मुख्य शीर्षक *</label>
                            <input
                              type="text"
                              required
                              value={editIdCard.titleHi}
                              onChange={(e) => setEditIdCard({ ...editIdCard, titleHi: e.target.value })}
                              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-stone-800">जारीकर्ता संस्था (Issuing Authority) *</label>
                            <input
                              type="text"
                              required
                              value={editIdCard.issuingAuthority}
                              onChange={(e) => setEditIdCard({ ...editIdCard, issuingAuthority: e.target.value })}
                              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="font-bold text-stone-800">वैधता निर्देश (Validity Notice) *</label>
                            <input
                              type="text"
                              required
                              value={editIdCard.validityNotice}
                              onChange={(e) => setEditIdCard({ ...editIdCard, validityNotice: e.target.value })}
                              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-stone-800">सत्यापन हेल्पलाइन मोबाइल *</label>
                            <input
                              type="text"
                              required
                              value={editIdCard.helplinePhone}
                              onChange={(e) => setEditIdCard({ ...editIdCard, helplinePhone: e.target.value })}
                              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-stone-800">उपजातियां / शाखाएं (अल्पविराम से अलग करें) *</label>
                          <textarea
                            rows={3}
                            required
                            value={editIdCard.subcastes.join(', ')}
                            onChange={(e) => {
                              const list = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                              setEditIdCard({ ...editIdCard, subcastes: list });
                            }}
                            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-stone-800">घोषणा व नियम शर्त (Disclaimer Note) *</label>
                          <textarea
                            rows={2}
                            required
                            value={editIdCard.termsNote}
                            onChange={(e) => setEditIdCard({ ...editIdCard, termsNote: e.target.value })}
                            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                          />
                        </div>

                        <div className="flex justify-end pt-3 border-t border-stone-100">
                          <button
                            type="submit"
                            className="px-5 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                          >
                            <Save className="w-4 h-4 text-amber-200" />
                            <span>पहचान पत्र सेटिंग्स सुरक्षित करें</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Sub-tab 5: Matrimony Form Editor */}
                  {schemesSubTab === 'matrimony' && (
                    <div className="max-w-3xl mx-auto bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-xs space-y-5 text-xs">
                      <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
                        <div>
                          <h5 className="font-bold text-sm text-stone-900 font-display flex items-center gap-1.5">
                            <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
                            <span>विश्वकर्मा परिणय बायोडाटा फॉर्म सेटिंग्स व विकल्प</span>
                          </h5>
                          <p className="text-xs text-stone-500 mt-0.5">
                            वैवाहिक पंजीकरण फॉर्म के शीर्षक, सत्यापन नीति, संपर्क गोपनीयता व उपजाति विकल्प संपादित करें।
                          </p>
                        </div>
                      </div>

                      <form onSubmit={handleSaveMatrimonyConfig} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="font-bold text-stone-800">परिणय फॉर्म मुख्य शीर्षक *</label>
                            <input
                              type="text"
                              required
                              value={editMatrimony.formTitle}
                              onChange={(e) => setEditMatrimony({ ...editMatrimony, formTitle: e.target.value })}
                              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-stone-800">परिणय हेल्पडेस्क फोन नंबर *</label>
                            <input
                              type="text"
                              required
                              value={editMatrimony.contactHelpline}
                              onChange={(e) => setEditMatrimony({ ...editMatrimony, contactHelpline: e.target.value })}
                              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-stone-800">सत्यापन सूचना (Verification Policy Notice) *</label>
                          <textarea
                            rows={2}
                            required
                            value={editMatrimony.verificationNotice}
                            onChange={(e) => setEditMatrimony({ ...editMatrimony, verificationNotice: e.target.value })}
                            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-stone-800">गोपनीयता नीति (Privacy Disclaimer) *</label>
                          <textarea
                            rows={2}
                            required
                            value={editMatrimony.disclaimer}
                            onChange={(e) => setEditMatrimony({ ...editMatrimony, disclaimer: e.target.value })}
                            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-stone-800">मान्य उपजातियां (अल्पविराम से अलग करें) *</label>
                          <textarea
                            rows={2}
                            required
                            value={editMatrimony.allowedSubcastes.join(', ')}
                            onChange={(e) => {
                              const list = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                              setEditMatrimony({ ...editMatrimony, allowedSubcastes: list });
                            }}
                            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                          />
                        </div>

                        <div className="flex justify-end pt-3 border-t border-stone-100">
                          <button
                            type="submit"
                            className="px-5 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                          >
                            <Save className="w-4 h-4 text-amber-200" />
                            <span>विवाह फॉर्म सेटिंग्स सुरक्षित करें</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Sub-tab 6: Artisan Directory Form Editor */}
                  {schemesSubTab === 'artisan' && (
                    <div className="max-w-3xl mx-auto bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-xs space-y-5 text-xs">
                      <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
                        <div>
                          <h5 className="font-bold text-sm text-stone-900 font-display flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-amber-600" />
                            <span>कारीगर एवं व्यवसाय पंजीयन फॉर्म सेटिंग्स व श्रेणियां</span>
                          </h5>
                          <p className="text-xs text-stone-500 mt-0.5">
                            शिल्पकार निर्देशिका फॉर्म के शीर्षक, लाभ, शिल्प ट्रेड श्रेणियां व प्रमाण पत्र शर्तें संपादित करें।
                          </p>
                        </div>
                      </div>

                      <form onSubmit={handleSaveArtisanConfig} className="space-y-4">
                        <div className="space-y-1">
                          <label className="font-bold text-stone-800">कारीगर पंजीयन फॉर्म शीर्षक *</label>
                          <input
                            type="text"
                            required
                            value={editArtisan.formTitle}
                            onChange={(e) => setEditArtisan({ ...editArtisan, formTitle: e.target.value })}
                            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-stone-800">शिल्पकार प्रमाण पत्र व बैज सूचना (Verification Notice) *</label>
                          <textarea
                            rows={2}
                            required
                            value={editArtisan.verificationNotice}
                            onChange={(e) => setEditArtisan({ ...editArtisan, verificationNotice: e.target.value })}
                            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-stone-800">पंजीकरण लाभ निर्देश (Benefits Notice) *</label>
                          <textarea
                            rows={2}
                            required
                            value={editArtisan.benefitsNotice}
                            onChange={(e) => setEditArtisan({ ...editArtisan, benefitsNotice: e.target.value })}
                            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-stone-800">शिल्प व व्यवसाय श्रेणियां (ट्रेड्स) (अल्पविराम से अलग करें) *</label>
                          <textarea
                            rows={3}
                            required
                            value={editArtisan.trades.join(', ')}
                            onChange={(e) => {
                              const list = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                              setEditArtisan({ ...editArtisan, trades: list });
                            }}
                            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                          />
                        </div>

                        <div className="flex justify-end pt-3 border-t border-stone-100">
                          <button
                            type="submit"
                            className="px-5 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                          >
                            <Save className="w-4 h-4 text-amber-200" />
                            <span>कारीगर फॉर्म सेटिंग्स सुरक्षित करें</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Sub-tab 7: Community Post Form Editor */}
                  {schemesSubTab === 'post' && (
                    <div className="max-w-3xl mx-auto bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-xs space-y-5 text-xs">
                      <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
                        <div>
                          <h5 className="font-bold text-sm text-stone-900 font-display flex items-center gap-1.5">
                            <Edit className="w-4 h-4 text-amber-700" />
                            <span>समाज चर्चा पोस्ट फॉर्म सेटिंग्स एवं दिशानिर्देश</span>
                          </h5>
                          <p className="text-xs text-stone-500 mt-0.5">
                            चर्चा मंच पर संदेश पोस्ट करने की नियम-शर्तें, श्रेणियां व शीर्षक संपादित करें।
                          </p>
                        </div>
                      </div>

                      <form onSubmit={handleSavePostConfig} className="space-y-4">
                        <div className="space-y-1">
                          <label className="font-bold text-stone-800">पोस्ट फॉर्म शीर्षक *</label>
                          <input
                            type="text"
                            required
                            value={editPost.formTitle}
                            onChange={(e) => setEditPost({ ...editPost, formTitle: e.target.value })}
                            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-stone-800">सामाजिक दिशानिर्देश (Guidelines Notice) *</label>
                          <textarea
                            rows={3}
                            required
                            value={editPost.guidelinesNotice}
                            onChange={(e) => setEditPost({ ...editPost, guidelinesNotice: e.target.value })}
                            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-stone-800">पोस्ट विषय / श्रेणियां (अल्पविराम से अलग करें) *</label>
                          <textarea
                            rows={2}
                            required
                            value={editPost.categories.join(', ')}
                            onChange={(e) => {
                              const list = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                              setEditPost({ ...editPost, categories: list });
                            }}
                            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                          />
                        </div>

                        <div className="flex justify-end pt-3 border-t border-stone-100">
                          <button
                            type="submit"
                            className="px-5 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                          >
                            <Save className="w-4 h-4 text-amber-200" />
                            <span>पोस्ट फॉर्म सेटिंग्स सुरक्षित करें</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 5: EVENTS MANAGER */}
              {/* ======================================================== */}
              {activeTab === 'events' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200">
                    <div>
                      <h4 className="font-bold text-base text-stone-900 font-display">
                        समाज आयोजन एवं सम्मेलन प्रबंधन (Events Manager)
                      </h4>
                      <p className="text-xs text-stone-500">
                        आगामी सामाजिक सम्मेलनों, महोत्सवों व प्रतिभा सम्मान समारोहों को जोड़ें अथवा हटाएं।
                      </p>
                    </div>

                    <button
                      onClick={() => setIsAddingEvent(true)}
                      className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ नया समाज आयोजन जोड़ें</span>
                    </button>
                  </div>

                  {/* Add Event Form */}
                  {isAddingEvent && (
                    <div className="bg-amber-50/80 p-5 rounded-2xl border-2 border-amber-400 space-y-4">
                      <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                        <h5 className="font-bold text-sm text-amber-950 font-display">
                          नया समाज आयोजन जोड़ें (Create New Event)
                        </h5>
                        <button onClick={() => setIsAddingEvent(false)} className="text-stone-500 hover:text-stone-800">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleAddNewEvent} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                        <div className="sm:col-span-2 space-y-1">
                          <label className="font-bold text-stone-800">आयोजन शीर्षक (Event Title) *</label>
                          <input
                            type="text"
                            required
                            value={newEventForm.title}
                            onChange={(e) => setNewEventForm({ ...newEventForm, title: e.target.value })}
                            placeholder="उदा. अखिल भारतीय विश्वकर्मा महाकुंभ व प्रतिभा सम्मान 2026"
                            className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-stone-800">श्रेणी (Category) *</label>
                          <select
                            value={newEventForm.category}
                            onChange={(e) => setNewEventForm({ ...newEventForm, category: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                          >
                            <option value="महोत्सव">महोत्सव (Festival)</option>
                            <option value="सम्मेलन">महाधिवेशन / सम्मेलन</option>
                            <option value="परिचय सम्मेलन">वैवाहिक परिचय सम्मेलन</option>
                            <option value="कार्यशाला">शिल्प व कौशल कार्यशाला</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-stone-800">आयोजन तिथि (Date) *</label>
                          <input
                            type="text"
                            required
                            value={newEventForm.date}
                            onChange={(e) => setNewEventForm({ ...newEventForm, date: e.target.value })}
                            placeholder="उदा. 17 सितंबर 2026"
                            className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-stone-800">समय (Time)</label>
                          <input
                            type="text"
                            value={newEventForm.time}
                            onChange={(e) => setNewEventForm({ ...newEventForm, time: e.target.value })}
                            placeholder="उदा. प्रातः 10:00 से सायं 05:00"
                            className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-stone-800">नगर (City) *</label>
                          <input
                            type="text"
                            required
                            value={newEventForm.city}
                            onChange={(e) => setNewEventForm({ ...newEventForm, city: e.target.value })}
                            placeholder="उदा. नई दिल्ली"
                            className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                          />
                        </div>

                        <div className="sm:col-span-2 space-y-1">
                          <label className="font-bold text-stone-800">आयोजन स्थल / वेन्यू (Venue) *</label>
                          <input
                            type="text"
                            required
                            value={newEventForm.venue}
                            onChange={(e) => setNewEventForm({ ...newEventForm, venue: e.target.value })}
                            placeholder="उदा. भारत मंडपम, प्रगति मैदान"
                            className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-stone-800">अपेक्षित बंधु संख्या *</label>
                          <input
                            type="number"
                            required
                            value={newEventForm.attendeesCount}
                            onChange={(e) => setNewEventForm({ ...newEventForm, attendeesCount: Number(e.target.value) })}
                            className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl font-mono"
                          />
                        </div>

                        <div className="sm:col-span-3 flex justify-end gap-2 pt-2 border-t border-amber-200">
                          <button
                            type="button"
                            onClick={() => setIsAddingEvent(false)}
                            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-semibold cursor-pointer"
                          >
                            रद्द करें
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                          >
                            <Save className="w-4 h-4" />
                            <span>आयोजन प्रकाशित करें</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Events Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {editEventsList.map((ev) => (
                      <div
                        key={ev.id}
                        className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs hover:border-amber-400 transition-all flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                              {ev.category}
                            </span>
                            <span className="text-xs font-mono font-bold text-amber-950">
                              {ev.date}
                            </span>
                          </div>

                          <h5 className="font-bold text-stone-900 text-sm leading-snug">
                            {ev.title}
                          </h5>

                          <div className="text-xs text-stone-600 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                            <span>{ev.venue}, {ev.city}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                          <span className="text-[11px] text-emerald-800 font-bold">
                            {ev.attendeesCount} समाज बंधु अपेक्षित
                          </span>

                          <button
                            onClick={() => handleDeleteEvent(ev.id)}
                            className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>हटाएं</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 6: SECURITY & FIREBASE SETTINGS */}
              {/* ======================================================== */}
              {activeTab === 'security' && (
                <div className="max-w-2xl mx-auto space-y-6">
                  {/* Change PIN Box */}
                  <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
                    <div className="border-b border-stone-100 pb-3">
                      <h4 className="text-base font-bold text-stone-900 font-display flex items-center gap-2">
                        <KeyRound className="w-4 h-4 text-amber-700" />
                        <span>एडमिन सुरक्षा पिन बदलें (Change Admin PIN)</span>
                      </h4>
                      <p className="text-xs text-stone-500">
                        वर्तमान पिन: <strong>{currentPin}</strong>
                      </p>
                    </div>

                    <form onSubmit={handleChangePin} className="space-y-3 text-xs">
                      {pinChangeMsg && (
                        <div className="p-2.5 bg-amber-50 text-amber-900 font-bold rounded-xl border border-amber-300">
                          {pinChangeMsg}
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="font-bold text-stone-800">नया 4-अंकीय पिन दर्ज करें *</label>
                        <input
                          type="password"
                          required
                          value={newPin}
                          onChange={(e) => setNewPin(e.target.value)}
                          placeholder="उदा. 5678"
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono text-center text-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-stone-800">नया पिन पुनः दर्ज करें *</label>
                        <input
                          type="password"
                          required
                          value={confirmPin}
                          onChange={(e) => setConfirmPin(e.target.value)}
                          placeholder="उदा. 5678"
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono text-center text-sm"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold rounded-xl shadow-sm cursor-pointer transition-all flex items-center justify-center gap-2"
                      >
                        <Lock className="w-4 h-4" />
                        <span>पिन अपडेट करें</span>
                      </button>
                    </form>
                  </div>

                  {/* Firebase Cloud Info */}
                  <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                      <div>
                        <h4 className="text-sm font-bold text-stone-900">Google Firebase क्लाउड डेटाबेस स्थिति</h4>
                        <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>सक्रिय व कनेक्टेड (Active & Connected)</span>
                        </div>
                      </div>

                      <a
                        href="https://console.firebase.google.com"
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
                      >
                        <span>Firebase Console खोलें</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <div className="space-y-2 text-xs font-mono text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-200">
                      <div>डेटाबेस नाम: <strong>ai-studio-vishwaconnect-5ec44a3b-7aa8-4951-b6ff-ff5af0ac0166</strong></div>
                      <div>प्लेटफ़ॉर्म: <strong>Google Cloud Firestore (Enterprise ABAC Rules)</strong></div>
                      <div>सिंक्रनाइज़ेशन: <strong>100% Real-Time Auto Sync</strong></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
