import React, { useState, useRef } from 'react';
import { SamajEvent, Language, EventRegistration } from '../types';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Award,
  Plus,
  Search,
  CheckCircle2,
  Share2,
  Mail,
  Phone,
  Sparkles,
  Ticket,
  Printer,
  Download,
  X,
  Send,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Flame,
  Check,
  UploadCloud,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';

interface EventsSectionProps {
  events: SamajEvent[];
  onAddEvent: (newEvent: SamajEvent) => void;
  lang: Language;
}

export const EventsSection: React.FC<EventsSectionProps> = ({
  events,
  onAddEvent,
  lang,
}) => {
  const isHi = lang === 'hi';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedEventForJoin, setSelectedEventForJoin] = useState<SamajEvent | null>(null);
  const [copiedEventId, setCopiedEventId] = useState<string | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string>('');
  const [imageFileSize, setImageFileSize] = useState<string>('');
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false);

  // Join Registration Form State
  const [joinForm, setJoinForm] = useState({
    fullName: '',
    mobile: '',
    email: '',
    city: '',
    state: '',
    attendeesCount: 1,
    specialRequirement: '',
  });

  // Successful Registration Pass State
  const [confirmedPass, setConfirmedPass] = useState<{
    registration: EventRegistration;
    event: SamajEvent;
  } | null>(null);

  // New Event Form State
  const [newEventForm, setNewEventForm] = useState({
    title: '',
    date: '',
    time: '',
    venue: '',
    city: '',
    state: '',
    organizer: '',
    category: 'धार्मिक व सांस्कृतिक',
    attendeesCount: 500,
    description: '',
    bannerImage: '',
    chiefGuest: '',
    contactNumber: '',
  });

  const categories = [
    { id: 'all', labelHi: 'सभी आयोजन', labelEn: 'All Events' },
    { id: 'धार्मिक व सांस्कृतिक', labelHi: 'धार्मिक व सांस्कृतिक', labelEn: 'Religious & Cultural' },
    { id: 'वैवाहिक सम्मेलन', labelHi: 'वैवाहिक सम्मेलन', labelEn: 'Matrimonial Meets' },
    { id: 'व्यापार व करियर', labelHi: 'व्यापार व MSME', labelEn: 'Trade & MSME' },
    { id: 'शिक्षा व छात्रवृत्ति', labelHi: 'शिक्षा व छात्रवृत्ति', labelEn: 'Education' },
    { id: 'शिल्प व कार्यशाला', labelHi: 'शिल्प व कार्यशाला', labelEn: 'Craft Workshops' },
  ];

  const filteredEvents = events.filter((ev) => {
    const matchesCat = selectedCategory === 'all' || ev.category === selectedCategory;
    const matchesSearch =
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.organizer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleShareEvent = (event: SamajEvent) => {
    const text = `विश्वकर्मा समाज आयोजन: ${event.title}\nदिनांक: ${event.date}\nस्थान: ${event.venue}, ${event.city}\nआयोजक: ${event.organizer}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedEventId(event.id);
      setTimeout(() => setCopiedEventId(null), 2500);
    }
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventForJoin) return;

    const passNumber = `VSM-EVT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReg: EventRegistration = {
      id: `reg-${Date.now()}`,
      eventId: selectedEventForJoin.id,
      fullName: joinForm.fullName,
      mobile: joinForm.mobile,
      email: joinForm.email,
      city: joinForm.city,
      state: joinForm.state,
      attendeesCount: Number(joinForm.attendeesCount) || 1,
      specialRequirement: joinForm.specialRequirement,
      registeredAt: new Date().toLocaleDateString('hi-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      passNumber,
    };

    setConfirmedPass({
      registration: newReg,
      event: selectedEventForJoin,
    });
    setSelectedEventForJoin(null);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('फ़ोटो का आकार 5MB से अधिक है। कृपया 5MB से छोटी फ़ाइल अपलोड करें।');
      return;
    }

    const formattedSize =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    setImageFileName(file.name);
    setImageFileSize(formattedSize);

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setUploadedImagePreview(result);
      setNewEventForm((prev) => ({ ...prev, bannerImage: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveUploadedImage = () => {
    setUploadedImagePreview(null);
    setImageFileName('');
    setImageFileSize('');
    setNewEventForm((prev) => ({ ...prev, bannerImage: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCreateEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventForm.title || !newEventForm.date || !newEventForm.venue) return;

    const createdEvent: SamajEvent = {
      id: `ev-${Date.now()}`,
      title: newEventForm.title,
      date: newEventForm.date,
      time: newEventForm.time || 'समय: प्रातः 10:00 बजे से',
      venue: newEventForm.venue,
      city: newEventForm.city || 'भारत',
      state: newEventForm.state || 'राष्ट्रीय',
      organizer: newEventForm.organizer || 'विश्वकर्मा समाज आयोजन समिति',
      category: newEventForm.category,
      attendeesCount: Number(newEventForm.attendeesCount) || 250,
      description: newEventForm.description,
      bannerImage:
        newEventForm.bannerImage ||
        uploadedImagePreview ||
        'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop&q=80',
      chiefGuest: newEventForm.chiefGuest,
      contactNumber: newEventForm.contactNumber,
      highlights: [
        'वैदिक विश्वकर्मा पूजन एवं दीप प्रज्वलन',
        'समाज बंधुओं का पारस्परिक संवाद व सम्मान',
        'महाप्रसाद व सांस्कृतिक कार्यक्रम'
      ],
      isFeatured: false,
    };

    onAddEvent(createdEvent);
    setIsCreateModalOpen(false);
    handleRemoveUploadedImage();
    setNewEventForm({
      title: '',
      date: '',
      time: '',
      venue: '',
      city: '',
      state: '',
      organizer: '',
      category: 'धार्मिक व सांस्कृतिक',
      attendeesCount: 500,
      description: '',
      bannerImage: '',
      chiefGuest: '',
      contactNumber: '',
    });
  };

  const printPass = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-stone-900 to-amber-950 text-white rounded-3xl p-6 sm:p-10 shadow-sm border border-amber-800/80 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 tracking-wide uppercase">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>
                {isHi
                  ? 'अखिल भारतीय विश्वकर्मा समाज आयोजन एवं महामहोत्सव'
                  : 'All India Vishwakarma Samaj Events & Conventions'}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">
              {isHi ? 'समाज के प्रमुख उत्सव, सम्मेलन व कार्यशालाएं' : 'Community Events, Conventions & Workshops'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 font-hindi leading-relaxed">
              {isHi
                ? 'देशभर में आयोजित होने वाले विश्वकर्मा जयंती महोत्सव, युवक-युवती परिचय सम्मेलन, एमएसएमई शिल्प सम्मेलनों एवं शिक्षा अलंकरणों की सम्पूर्ण विवरणिका। ऑनलाइन सम्मिलित हों और तुरंत ईमेल पर ई-पास प्राप्त करें।'
                : 'Complete registry of nationwide festivals, matrimonial meets, craft workshops, and entrepreneurship summits. Join online and receive instant registration confirmation on your email.'}
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all transform hover:scale-[1.02] shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{isHi ? 'नया समाज आयोजन जोड़ें' : 'Add New Event'}</span>
          </button>
        </div>
      </div>

      {/* 2. Search & Category Filters Bar */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isHi ? 'आयोजन का नाम, शहर या आयोजक से खोजें...' : 'Search event by title, city, or organizer...'}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 font-hindi"
            />
          </div>
          <div className="text-xs font-semibold text-stone-500 flex items-center self-center px-1">
            <span>
              {isHi
                ? `${filteredEvents.length} आयोजन उपलब्ध`
                : `${filteredEvents.length} Events Available`}
            </span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {isHi ? cat.labelHi : cat.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Detailed Event Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between group"
          >
            {/* Banner & Category Overlay */}
            <div>
              <div className="h-52 sm:h-60 overflow-hidden relative bg-stone-900">
                <img
                  src={event.bannerImage || '/src/assets/images/community_event_1790956405903.jpg'}
                  alt={event.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />

                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="bg-amber-900/90 text-white text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-xs shadow-xs border border-amber-500/40">
                    {event.category}
                  </span>
                  {event.isFeatured && (
                    <span className="bg-red-600/90 text-white text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-xs flex items-center gap-1 shadow-xs">
                      <Sparkles className="w-3 h-3" />
                      <span>{isHi ? 'विराट राष्ट्रीय महोत्सव' : 'National Grand Convention'}</span>
                    </span>
                  )}
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300 mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{event.date}</span>
                    {event.time && (
                      <>
                        <span>·</span>
                        <Clock className="w-3.5 h-3.5" />
                        <span>{event.time}</span>
                      </>
                    )}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-display text-white leading-snug drop-shadow-xs">
                    {event.title}
                  </h2>
                </div>
              </div>

              {/* Event Content Details */}
              <div className="p-6 space-y-4 font-hindi">
                {/* Location & Expected Attendees */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-800 shrink-0" />
                    <span className="truncate">
                      <strong>{isHi ? 'स्थान:' : 'Venue:'}</strong> {event.venue}, {event.city}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 sm:justify-end">
                    <Users className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>
                      <strong>{isHi ? 'अपेक्षित बंधु:' : 'Expected Attendees:'}</strong> {event.attendeesCount}+
                    </span>
                  </div>
                </div>

                {/* Description */}
                {event.description && (
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                    {event.description}
                  </p>
                )}

                {/* Key Highlights */}
                {event.highlights && event.highlights.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
                      {isHi ? 'आयोजन की मुख्य विशेषताएं:' : 'Key Highlights:'}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {event.highlights.map((hl, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-xs text-stone-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Chief Guest & Organizer */}
                <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-stone-600">
                  {event.chiefGuest && (
                    <div className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                      <span>
                        <strong>{isHi ? 'मुख्य अतिथि:' : 'Chief Guest:'}</strong> {event.chiefGuest}
                      </span>
                    </div>
                  )}
                  {event.contactNumber && (
                    <div className="flex items-center gap-1 font-mono text-[11px] text-stone-500">
                      <Phone className="w-3 h-3 text-stone-400" />
                      <span>{event.contactNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Action Footer */}
            <div className="p-6 pt-0 border-t border-stone-100 flex items-center justify-between gap-3 mt-4">
              <button
                onClick={() => handleShareEvent(event)}
                className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold shrink-0"
                title={isHi ? 'विवरण कॉपी व शेयर करें' : 'Copy & Share Details'}
              >
                <Share2 className="w-4 h-4" />
                <span>
                  {copiedEventId === event.id
                    ? (isHi ? 'कॉपी हो गया!' : 'Copied!')
                    : (isHi ? 'शेयर' : 'Share')}
                </span>
              </button>

              <button
                onClick={() => {
                  setSelectedEventForJoin(event);
                  setJoinForm({
                    fullName: '',
                    mobile: '',
                    email: '',
                    city: event.city || '',
                    state: event.state || '',
                    attendeesCount: 1,
                    specialRequirement: '',
                  });
                }}
                className="flex-1 py-3 px-5 bg-gradient-to-r from-amber-800 to-amber-900 hover:from-amber-700 hover:to-amber-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer transform hover:scale-[1.01]"
              >
                <Ticket className="w-4 h-4" />
                <span>{isHi ? 'सम्मिलित हों / ई-पास प्राप्त करें' : 'RSVP / Get E-Pass'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ============================================================ */}
      {/* 4. MODAL: JOIN / RSVP EVENT FORM WITH EMAIL AUTOMATION */}
      {/* ============================================================ */}
      {selectedEventForJoin && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-stone-200 max-h-[94vh] overflow-y-auto my-auto p-6 sm:p-8 space-y-5 font-hindi">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-stone-100 pb-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  {isHi ? 'आयोजन सहभागिता पंजीकरण' : 'Event RSVP Registration'}
                </span>
                <h3 className="text-xl font-bold font-display text-stone-900 leading-snug">
                  {selectedEventForJoin.title}
                </h3>
                <div className="text-xs text-stone-500 flex items-center gap-2 font-mono">
                  <span>📅 {selectedEventForJoin.date}</span>
                  <span>·</span>
                  <span>📍 {selectedEventForJoin.city}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedEventForJoin(null)}
                className="text-stone-400 hover:text-stone-700 p-1.5 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Email Auto-Send Guarantee Notice */}
            <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
              <Mail className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-950 leading-relaxed font-medium">
                {isHi ? (
                  <>
                    <strong>स्वचालित ईमेल पुष्टिकरण:</strong> फॉर्म सबमिट करते ही आपका आधिकारिक <strong>ई-प्रवेश पत्र (E-Pass)</strong> और पुष्टि विवरण आपके द्वारा दर्ज किए गए <strong>ईमेल पते</strong> पर स्वतः प्रेषित कर दिया जाएगा।
                  </>
                ) : (
                  <>
                    <strong>Automated Email Confirmation:</strong> Upon submission, your official <strong>E-Pass</strong> and confirmation details will be instantly sent to your <strong>email address</strong>.
                  </>
                )}
              </div>
            </div>

            {/* Join Form */}
            <form onSubmit={handleJoinSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">
                    {isHi ? 'पूरा नाम *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={joinForm.fullName}
                    onChange={(e) => setJoinForm({ ...joinForm, fullName: e.target.value })}
                    placeholder={isHi ? 'उदा. रमेश कुमार शर्मा' : 'e.g. Ramesh Kumar Sharma'}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">
                    {isHi ? 'मोबाइल / व्हाट्सएप नंबर *' : 'Mobile / WhatsApp Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    value={joinForm.mobile}
                    onChange={(e) => setJoinForm({ ...joinForm, mobile: e.target.value })}
                    placeholder={isHi ? '10 अंकों का मोबाइल नंबर' : '10-digit mobile number'}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 font-mono"
                  />
                </div>
              </div>

              {/* Email Address - Essential for automatic sending */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 flex items-center justify-between">
                  <span>{isHi ? 'ईमेल पता *' : 'Email Address *'}</span>
                  <span className="text-[10px] text-emerald-700 font-bold">
                    {isHi ? 'ई-पास इसी पर भेजा जाएगा' : 'E-Pass will be sent here'}
                  </span>
                </label>
                <input
                  type="email"
                  required
                  value={joinForm.email}
                  onChange={(e) => setJoinForm({ ...joinForm, email: e.target.value })}
                  placeholder="yourname@example.com"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">{isHi ? 'शहर *' : 'City *'}</label>
                  <input
                    type="text"
                    required
                    value={joinForm.city}
                    onChange={(e) => setJoinForm({ ...joinForm, city: e.target.value })}
                    placeholder={isHi ? 'उदा. जयपुर' : 'e.g. Jaipur'}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">{isHi ? 'राज्य *' : 'State *'}</label>
                  <input
                    type="text"
                    required
                    value={joinForm.state}
                    onChange={(e) => setJoinForm({ ...joinForm, state: e.target.value })}
                    placeholder={isHi ? 'उदा. राजस्थान' : 'e.g. Rajasthan'}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">
                    {isHi ? 'कुल सदस्य संख्या *' : 'Total Attendees *'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    required
                    value={joinForm.attendeesCount}
                    onChange={(e) => setJoinForm({ ...joinForm, attendeesCount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">
                  {isHi ? 'विशिष्ट आवश्यकता अथवा संदेश (वैकल्पिक)' : 'Special Requests or Notes (Optional)'}
                </label>
                <textarea
                  rows={2}
                  value={joinForm.specialRequirement}
                  onChange={(e) => setJoinForm({ ...joinForm, specialRequirement: e.target.value })}
                  placeholder={
                    isHi
                      ? 'आवास व्यवस्था, रेलवे स्टेशन से पिकअप अथवा अन्य सुझाव...'
                      : 'Accommodation, transport pickup, or dietary preferences...'
                  }
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedEventForJoin(null)}
                  className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  {isHi ? 'रद्द करें' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>{isHi ? 'पंजीकरण करें एवं ई-पास प्राप्त करें' : 'Register & Get E-Pass'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. MODAL: OFFICIAL E-PASS & AUTOMATED EMAIL SENT SUCCESS */}
      {/* ============================================================ */}
      {confirmedPass && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-stone-200 max-h-[96vh] overflow-y-auto my-auto p-6 sm:p-8 space-y-6 font-hindi">
            {/* Automatic Email Toast Announcement */}
            <div className="p-4 bg-emerald-600 text-white rounded-2xl flex items-center gap-3 shadow-md animate-bounce-short">
              <div className="w-10 h-10 rounded-full bg-white text-emerald-800 flex items-center justify-center shrink-0 font-bold">
                <Check className="w-5 h-5" />
              </div>
              <div className="text-xs sm:text-sm leading-relaxed">
                <div className="font-bold">
                  {isHi ? 'सफलतापूर्वक पंजीकृत! पुष्टि ईमेल प्रेषित' : 'Registration Successful! Confirmation Email Sent'}
                </div>
                <div className="text-emerald-100 text-xs">
                  {isHi ? (
                    <>
                      आपका ई-पास स्वचालित रूप से <strong>{confirmedPass.registration.email}</strong> पर भेज दिया गया है।
                    </>
                  ) : (
                    <>
                      Your E-Pass has been automatically sent to <strong>{confirmedPass.registration.email}</strong>.
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Official Royal Pass Card */}
            <div
              id="printable-event-pass"
              className="bg-gradient-to-b from-amber-50/90 via-stone-50 to-amber-100/40 border-2 border-amber-600 rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm relative overflow-hidden"
            >
              {/* Top Invocation */}
              <div className="flex items-center justify-between border-b-2 border-amber-800/40 pb-3">
                <div>
                  <div className="text-[11px] font-bold text-amber-900">
                    {isHi
                      ? 'ॐ श्री विश्वकर्मणे नमः · आधिकारिक आमंत्रण व ई-प्रवेश पत्र'
                      : 'Om Shri Vishwakarma Namah · Official E-Pass & Invitation'}
                  </div>
                  <div className="text-xs text-stone-500 font-mono">
                    {isHi ? 'पास क्रमांक:' : 'Pass No:'} <strong>{confirmedPass.registration.passNumber}</strong>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                    {isHi ? 'स्वीकृत व सत्यापित' : 'Verified & Approved'}
                  </span>
                </div>
              </div>

              {/* Event Name */}
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-bold font-display text-stone-900 leading-snug">
                  {confirmedPass.event.title}
                </h3>
                <div className="text-xs text-amber-900 font-bold">
                  {confirmedPass.event.category}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs text-stone-700 bg-white/80 p-3.5 rounded-2xl border border-amber-200">
                <div>
                  <span className="text-stone-500 block text-[11px]">{isHi ? 'सहभागी का नाम:' : 'Attendee Name:'}</span>
                  <span className="font-bold text-stone-900 text-sm">
                    {confirmedPass.registration.fullName}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px]">{isHi ? 'कुल सदस्य:' : 'Total Members:'}</span>
                  <span className="font-bold text-stone-900 text-sm">
                    {confirmedPass.registration.attendeesCount} {isHi ? 'व्यक्ति' : 'Persons'}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px]">{isHi ? 'दिनांक व समय:' : 'Date & Time:'}</span>
                  <span className="font-bold text-stone-900">
                    {confirmedPass.event.date}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px]">{isHi ? 'स्थान व नगर:' : 'Venue & City:'}</span>
                  <span className="font-bold text-stone-900 truncate block">
                    {confirmedPass.event.venue}, {confirmedPass.event.city}
                  </span>
                </div>
              </div>

              {/* QR Code & Verification Watermark */}
              <div className="flex items-center justify-between pt-2 border-t border-amber-200">
                <div className="flex items-center gap-3">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                      `VSM-EVENT-PASS:${confirmedPass.registration.passNumber}|${confirmedPass.registration.fullName}|${confirmedPass.event.title}`
                    )}`}
                    alt="Entry QR"
                    className="w-16 h-16 rounded-lg border border-amber-300 bg-white p-1"
                  />
                  <div className="text-[11px] text-stone-600 leading-tight">
                    <div className="font-bold text-stone-900">{isHi ? 'गेट एंट्री क्यूआर कोड' : 'Gate Entry QR Code'}</div>
                    <div>
                      {isHi
                        ? 'प्रवेश द्वार पर यह पास मोबाइल पर अथवा प्रिंट करके दिखाएं।'
                        : 'Present this digital pass or printed copy at the entrance.'}
                    </div>
                  </div>
                </div>

                <div className="text-right text-[10px] text-stone-500">
                  <div>{isHi ? 'पंजीकरण तिथि:' : 'Registration Date:'}</div>
                  <div className="font-mono font-bold text-stone-800">
                    {confirmedPass.registration.registeredAt}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={printPass}
                className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>{isHi ? 'ई-पास प्रिंट / PDF सेव करें' : 'Print / Save E-Pass PDF'}</span>
              </button>

              <button
                onClick={() => setConfirmedPass(null)}
                className="py-2.5 px-6 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                {isHi ? 'समाप्त करें' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 6. MODAL: ADD NEW SAMAJ EVENT (नया समाज आयोजन जोड़ें) */}
      {/* ============================================================ */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-stone-200 max-h-[94vh] overflow-y-auto my-auto p-6 sm:p-8 space-y-5 font-hindi">
            <div className="flex items-start justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  {isHi ? 'नया समाज आयोजन प्रविष्टि' : 'New Community Event Entry'}
                </span>
                <h3 className="text-xl font-bold font-display text-stone-900 mt-1">
                  {isHi ? 'समाज आयोजन की सूचना प्रकाशित करें' : 'Publish Community Event Announcement'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  handleRemoveUploadedImage();
                }}
                className="text-stone-400 hover:text-stone-700 p-1.5 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEventSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">
                  {isHi ? 'आयोजन का नाम *' : 'Event Title *'}
                </label>
                <input
                  type="text"
                  required
                  value={newEventForm.title}
                  onChange={(e) => setNewEventForm({ ...newEventForm, title: e.target.value })}
                  placeholder={
                    isHi
                      ? 'उदा. अखिल भारतीय विश्वकर्मा प्रतिभा अलंकरण समारोह 2026'
                      : 'e.g. All India Vishwakarma Talent Award Ceremony 2026'
                  }
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">{isHi ? 'दिनांक *' : 'Date *'}</label>
                  <input
                    type="text"
                    required
                    value={newEventForm.date}
                    onChange={(e) => setNewEventForm({ ...newEventForm, date: e.target.value })}
                    placeholder={isHi ? 'उदा. 25 अक्टूबर 2026' : 'e.g. 25 October 2026'}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">{isHi ? 'समय' : 'Timings'}</label>
                  <input
                    type="text"
                    value={newEventForm.time}
                    onChange={(e) => setNewEventForm({ ...newEventForm, time: e.target.value })}
                    placeholder={isHi ? 'उदा. प्रातः 10:00 से सायं 05:00' : 'e.g. 10:00 AM to 05:00 PM'}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">{isHi ? 'श्रेणी *' : 'Category *'}</label>
                  <select
                    value={newEventForm.category}
                    onChange={(e) => setNewEventForm({ ...newEventForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  >
                    <option value="धार्मिक व सांस्कृतिक">
                      {isHi ? 'धार्मिक व सांस्कृतिक' : 'Religious & Cultural'}
                    </option>
                    <option value="वैवाहिक सम्मेलन">
                      {isHi ? 'वैवाहिक सम्मेलन' : 'Matrimonial Meet'}
                    </option>
                    <option value="व्यापार व करियर">
                      {isHi ? 'व्यापार व MSME' : 'Business & Career'}
                    </option>
                    <option value="शिक्षा व छात्रवृत्ति">
                      {isHi ? 'शिक्षा व छात्रवृत्ति' : 'Education & Scholarships'}
                    </option>
                    <option value="शिल्प व कार्यशाला">
                      {isHi ? 'शिल्प व कार्यशाला' : 'Craft & Workshops'}
                    </option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">
                    {isHi ? 'अपेक्षित उपस्थिति' : 'Expected Attendees'}
                  </label>
                  <input
                    type="number"
                    value={newEventForm.attendeesCount}
                    onChange={(e) => setNewEventForm({ ...newEventForm, attendeesCount: Number(e.target.value) })}
                    placeholder="1000"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">{isHi ? 'स्थान *' : 'Venue *'}</label>
                  <input
                    type="text"
                    required
                    value={newEventForm.venue}
                    onChange={(e) => setNewEventForm({ ...newEventForm, venue: e.target.value })}
                    placeholder={isHi ? 'उदा. श्री विश्वकर्मा मंदिर प्रांगण' : 'e.g. Community Center Hall'}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">{isHi ? 'शहर *' : 'City *'}</label>
                  <input
                    type="text"
                    required
                    value={newEventForm.city}
                    onChange={(e) => setNewEventForm({ ...newEventForm, city: e.target.value })}
                    placeholder={isHi ? 'उदा. जोधपुर' : 'e.g. Jodhpur'}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">{isHi ? 'आयोजक संस्था' : 'Organizer'}</label>
                  <input
                    type="text"
                    value={newEventForm.organizer}
                    onChange={(e) => setNewEventForm({ ...newEventForm, organizer: e.target.value })}
                    placeholder={isHi ? 'उदा. जिला विश्वकर्मा सभा' : 'e.g. Regional Committee'}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">
                    {isHi ? 'संपर्क नंबर / हेल्पलाइन' : 'Contact Helpline'}
                  </label>
                  <input
                    type="text"
                    value={newEventForm.contactNumber}
                    onChange={(e) => setNewEventForm({ ...newEventForm, contactNumber: e.target.value })}
                    placeholder="+91 98290 XXXXX"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">
                  {isHi ? 'आयोजन का विस्तृत विवरण' : 'Event Description'}
                </label>
                <textarea
                  rows={3}
                  value={newEventForm.description}
                  onChange={(e) => setNewEventForm({ ...newEventForm, description: e.target.value })}
                  placeholder={
                    isHi
                      ? 'आयोजन के मुख्य आकर्षण, महाप्रसाद, शोभायात्रा एवं समाज हित के कार्यक्रम...'
                      : 'Highlights, schedule, cultural programs, and event details...'
                  }
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                />
              </div>

              {/* Photo Upload Section with Explicit Size Mentioned in Brackets */}
              <div className="space-y-2 pt-1 border-t border-stone-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-amber-800 shrink-0" />
                    <span>
                      {isHi
                        ? 'आयोजन बैनर / पोस्टर फोटो (अनुशंसित आकार: 1200 × 630 px, अधिकतम फ़ाइल साइज़: 5 MB) *'
                        : 'Event Banner / Poster Photo (Recommended: 1200 × 630 px, Max file size: 5 MB) *'}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="text-[11px] font-bold text-amber-800 hover:text-amber-900 underline cursor-pointer text-left"
                  >
                    {showUrlInput
                      ? (isHi ? 'फ़ाइल अपलोड पर लौटें' : 'Back to File Upload')
                      : (isHi ? 'अथवा वेब लिंक दर्ज करें' : 'Or Enter Image URL')}
                  </button>
                </div>

                {showUrlInput ? (
                  <div className="space-y-1">
                    <input
                      type="url"
                      value={newEventForm.bannerImage}
                      onChange={(e) => {
                        setNewEventForm({ ...newEventForm, bannerImage: e.target.value });
                        setUploadedImagePreview(e.target.value);
                      }}
                      placeholder="https://example.com/event-banner.jpg"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 font-mono"
                    />
                    <p className="text-[11px] text-stone-500 font-hindi">
                      {isHi
                        ? 'सीधा इमेज वेब लिंक दर्ज करें (अनुशंसित आकार: 1200 × 630 पिक्सल)'
                        : 'Enter direct image URL (Recommended: 1200 × 630 pixels)'}
                    </p>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/png, image/jpeg, image/webp, image/jpg"
                      onChange={handleImageFileChange}
                      className="hidden"
                      id="event-photo-upload-input"
                    />

                    {uploadedImagePreview ? (
                      <div className="relative rounded-2xl overflow-hidden border-2 border-amber-500 bg-stone-900 shadow-sm p-2">
                        <div className="h-44 sm:h-52 w-full rounded-xl overflow-hidden relative">
                          <img
                            src={uploadedImagePreview}
                            alt="Uploaded Event Banner"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-md border border-white/20 flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>{isHi ? 'फोटो सफलतापूर्वक चयनित' : 'Photo Attached'}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 px-1 text-xs text-stone-300">
                          <div className="truncate max-w-[70%]">
                            <span className="font-semibold text-white">
                              {imageFileName || (isHi ? 'चयनित बैनर फोटो' : 'Attached Banner Photo')}
                            </span>
                            {imageFileSize && <span className="ml-2 text-stone-400">({imageFileSize})</span>}
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveUploadedImage}
                            className="px-3 py-1 bg-red-600/90 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{isHi ? 'फोटो हटाएं' : 'Remove Photo'}</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/40 hover:bg-amber-50/70 rounded-2xl p-6 text-center cursor-pointer transition-all space-y-2 group"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-2xs">
                          <UploadCloud className="w-6 h-6 text-amber-800" />
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-amber-900">
                            {isHi
                              ? 'मोबाइल अथवा कंप्यूटर से फोटो अपलोड करें (PNG/JPG)'
                              : 'Upload Photo from Mobile or PC (PNG/JPG)'}
                          </div>
                          <div className="text-[11px] text-stone-600 font-hindi mt-0.5">
                            {isHi
                              ? 'अनुशंसित आकार: 1200 × 630 px (अधिकतम फ़ाइल साइज़: 5 MB)'
                              : 'Recommended size: 1200 × 630 px (Max file size: 5 MB)'}
                          </div>
                          <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                            {isHi ? 'समर्थित प्रारूप: JPG, PNG, WEBP' : 'Supported formats: JPG, PNG, WEBP'}
                          </div>
                        </div>
                        <button
                          type="button"
                          className="px-4 py-1.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs pointer-events-none"
                        >
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>{isHi ? 'फोटो चुनें' : 'Choose Photo'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    handleRemoveUploadedImage();
                  }}
                  className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  {isHi ? 'रद्द करें' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isHi ? 'आयोजन प्रकाशित करें' : 'Publish Event'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
