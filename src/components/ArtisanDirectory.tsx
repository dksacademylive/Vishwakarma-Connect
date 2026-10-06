import React, { useState, useRef } from 'react';
import { Artisan, Language, ArtisanFormConfig } from '../types';
import { DEFAULT_ARTISAN_CONFIG } from '../data/formsData';
import {
  Search,
  MapPin,
  Phone,
  MessageSquare,
  ShieldCheck,
  Star,
  Award,
  CheckCircle,
  ExternalLink,
  Plus,
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  Check,
  Sparkles,
  X,
  Printer,
  Settings
} from 'lucide-react';

interface ArtisanDirectoryProps {
  artisans: Artisan[];
  onAddArtisan: (artisan: Artisan) => void;
  lang: Language;
  artisanConfig?: ArtisanFormConfig;
  onOpenAdmin?: () => void;
}

export const ArtisanDirectory: React.FC<ArtisanDirectoryProps> = ({
  artisans,
  onAddArtisan,
  lang,
  artisanConfig,
  onOpenAdmin,
}) => {
  const isHi = lang === 'hi';
  const activeConfig = artisanConfig || DEFAULT_ARTISAN_CONFIG;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedTrade, setSelectedTrade] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
  const [selectedArtisanForQuote, setSelectedArtisanForQuote] = useState<Artisan | null>(null);
  const [quoteSuccess, setQuoteSuccess] = useState<boolean>(false);

  // Photo upload states
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string>('');
  const [imageFileSize, setImageFileSize] = useState<string>('');
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false);

  // Verification celebration modal state
  const [verificationSuccess, setVerificationSuccess] = useState<{
    artisan: Artisan;
    certNumber: string;
    date: string;
  } | null>(null);

  // Filter artisans
  const filtered = artisans.filter((art) => {
    const matchesTrade = selectedTrade === 'all' || art.trade === selectedTrade;
    const matchesQuery =
      art.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.businessName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTrade && matchesQuery;
  });

  // Simple state for registering new artisan
  const [newArtisanForm, setNewArtisanForm] = useState({
    name: '',
    subcaste: 'जांगिड़ (सुथार)',
    trade: 'wood' as Artisan['trade'],
    tradeLabelHi: 'काष्ठकला (Woodwork)',
    city: '',
    state: '',
    experienceYears: 5,
    businessName: '',
    specialization: '',
    phone: '',
    image: '',
  });

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('फ़ोटो का आकार 5MB से अधिक है। कृपया 5MB से छोटी फ़ाइल चुनें।');
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
      setNewArtisanForm((prev) => ({ ...prev, image: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveUploadedImage = () => {
    setUploadedImagePreview(null);
    setImageFileName('');
    setImageFileSize('');
    setNewArtisanForm((prev) => ({ ...prev, image: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArtisanForm.name || !newArtisanForm.phone || !newArtisanForm.city) return;

    const certNumber = `VSM-SHILPI-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const verifiedDate = new Date().toLocaleDateString('hi-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const newArtisan: Artisan = {
      id: `art-${Date.now()}`,
      name: newArtisanForm.name,
      subcaste: newArtisanForm.subcaste,
      trade: newArtisanForm.trade,
      tradeLabelHi: newArtisanForm.tradeLabelHi || 'पारंपरिक शिल्प',
      tradeLabelEn: 'Traditional Craft',
      city: newArtisanForm.city,
      state: newArtisanForm.state || 'भारत',
      experienceYears: Number(newArtisanForm.experienceYears) || 5,
      businessName: newArtisanForm.businessName || `${newArtisanForm.name} शिल्प उद्योग`,
      specialization: newArtisanForm.specialization || 'हस्तशिल्प व निर्माण कार्य',
      phone: newArtisanForm.phone,
      rating: 5.0,
      reviewCount: 1,
      image:
        uploadedImagePreview ||
        newArtisanForm.image ||
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
      verified: true, // Successful verification as requested!
      featuredWork: ['कस्टम वर्क ऑर्डर', 'पारंपरिक कला', 'विश्वकर्मा शिल्प धरोहर'],
    };

    onAddArtisan(newArtisan);
    setShowRegisterModal(false);
    handleRemoveUploadedImage();

    // Trigger verification celebration modal
    setVerificationSuccess({
      artisan: newArtisan,
      certNumber,
      date: verifiedDate,
    });

    // Reset form
    setNewArtisanForm({
      name: '',
      subcaste: 'जांगिड़ (सुथार)',
      trade: 'wood' as Artisan['trade'],
      tradeLabelHi: 'काष्ठकला (Woodwork)',
      city: '',
      state: '',
      experienceYears: 5,
      businessName: '',
      specialization: '',
      phone: '',
      image: '',
    });
  };

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSuccess(true);
    setTimeout(() => {
      setQuoteSuccess(false);
      setSelectedArtisanForQuote(null);
    }, 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 tracking-wide mb-1">
            <span>विश्वकर्मा शिल्पी व व्यापार महामंच</span>
            <span aria-hidden="true">·</span>
            <span>प्रमाणित कारीगर</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
            {isHi ? 'कारीगर, वास्तुविद व व्यापार निर्देशिका' : 'Artisans & Craftsmen Directory'}
          </h2>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl">
            {isHi
              ? 'काष्ठ, लौह, स्वर्ण, पाषाण, वैदिक वास्तुकला एवं आधुनिक तकनीकी उद्यमों से जुड़े समाज के सिद्धहस्त शिल्पकर्मियों से सीधे जुड़ें।'
              : 'Connect directly with certified carpenters, metalsmiths, jewelers, stone carvers, and architects from the Vishwakarma fraternity.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {onOpenAdmin && (
            <button
              type="button"
              onClick={onOpenAdmin}
              className="px-3.5 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
              title="एडमिन पोर्टल में शिल्पकार पंजीयन फॉर्म श्रेणियां व विकल्प संपादित करें"
            >
              <Settings className="w-4 h-4 text-amber-800" />
              <span>⚙️ एडमिन: फॉर्म सेटिंग्स संपादित करें</span>
            </button>
          )}

          <button
            onClick={() => setShowRegisterModal(true)}
            className="px-4 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isHi ? 'अपना शिल्प / व्यापार पंजीकृत करें' : 'Register Your Business'}</span>
          </button>
        </div>
      </div>

      {/* Search and Trade Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder={
                isHi
                  ? 'कारीगर का नाम, शहर (उदा: जयपुर, दिल्ली) या कला खोजें...'
                  : 'Search by artisan name, city, or trade...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:border-amber-700"
            />
          </div>

          <div className="text-xs text-stone-500 flex items-center justify-end font-mono tabular-nums">
            {filtered.length} {isHi ? 'कारीगर उपलब्ध' : 'Artisans Found'}
          </div>
        </div>

        {/* Trade Segmented Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedTrade('all')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              selectedTrade === 'all'
                ? 'bg-amber-900 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
            }`}
          >
            {isHi ? 'समस्त विधाएं' : 'All Crafts'}
          </button>
          <button
            onClick={() => setSelectedTrade('wood')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              selectedTrade === 'wood'
                ? 'bg-amber-900 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
            }`}
          >
            {isHi ? 'काष्ठकला (Woodwork)' : 'Woodwork'}
          </button>
          <button
            onClick={() => setSelectedTrade('metal')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              selectedTrade === 'metal'
                ? 'bg-amber-900 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
            }`}
          >
            {isHi ? 'लौह व धातु (Metal & Forge)' : 'Metal & Forge'}
          </button>
          <button
            onClick={() => setSelectedTrade('jewelry')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              selectedTrade === 'jewelry'
                ? 'bg-amber-900 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
            }`}
          >
            {isHi ? 'स्वर्ण व आभूषण (Jewelry)' : 'Jewelry'}
          </button>
          <button
            onClick={() => setSelectedTrade('architecture')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              selectedTrade === 'architecture'
                ? 'bg-amber-900 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
            }`}
          >
            {isHi ? 'वास्तु व स्थापत्य (Architecture)' : 'Architecture'}
          </button>
          <button
            onClick={() => setSelectedTrade('stone')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              selectedTrade === 'stone'
                ? 'bg-amber-900 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
            }`}
          >
            {isHi ? 'प्रस्तर व मूर्ति (Stone Art)' : 'Stone & Statues'}
          </button>
          <button
            onClick={() => setSelectedTrade('engineering')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              selectedTrade === 'engineering'
                ? 'bg-amber-900 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
            }`}
          >
            {isHi ? 'आधुनिक टेक व सीएनसी (Tech)' : 'Tech & CNC'}
          </button>
        </div>
      </div>

      {/* Artisans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((artisan) => (
          <div
            key={artisan.id}
            className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs hover:border-amber-300 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Image Banner */}
              <div className="relative h-48 bg-stone-100 overflow-hidden">
                <img
                  src={artisan.image}
                  alt={artisan.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                {artisan.verified && (
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2 py-1 rounded text-xs font-medium text-emerald-800 flex items-center gap-1 shadow-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isHi ? 'सत्यापित शिल्पी' : 'Verified'}</span>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 bg-stone-950/70 text-white text-[11px] px-2 py-0.5 rounded font-mono">
                  {artisan.experienceYears} {isHi ? 'वर्ष अनुभव' : 'Yrs Exp'}
                </div>
              </div>

              {/* Body Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-stone-900 leading-snug">
                  {artisan.name}
                </h3>
                <div className="text-xs text-amber-800 font-medium mt-0.5">
                  {artisan.businessName}
                </div>

                {/* Unboxed metadata discipline */}
                <div className="flex items-center gap-2 text-xs text-stone-500 mt-2">
                  <span>{artisan.tradeLabelHi}</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-stone-400" />
                    {artisan.city}, {artisan.state}
                  </span>
                </div>

                <p className="text-xs text-stone-600 mt-3 line-clamp-2 leading-relaxed font-hindi">
                  {artisan.specialization}
                </p>

                {/* Featured Works */}
                <div className="mt-4 pt-3 border-t border-stone-100">
                  <div className="text-[11px] text-stone-400 uppercase tracking-wider mb-1.5">
                    {isHi ? 'प्रमुख कार्य एवं विशिष्टता:' : 'Specialities:'}
                  </div>
                  <div className="space-y-1">
                    {artisan.featuredWork.map((work, idx) => (
                      <div key={idx} className="text-xs text-stone-700 flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-amber-600" />
                        <span className="truncate">{work}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Contact Actions */}
            <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center gap-2">
              <a
                href={`https://wa.me/${artisan.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `नमस्ते ${artisan.name} जी, मैंने विश्वकर्मा समाज पोर्टल पर आपका कार्य देखा और आपसे कार्य सम्बन्धी परामर्श हेतु संपर्क कर रहा हूँ।`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{isHi ? 'व्हाट्सएप चैट' : 'WhatsApp'}</span>
              </a>

              <button
                onClick={() => setSelectedArtisanForQuote(artisan)}
                className="py-2 px-3 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              >
                {isHi ? 'कोटेशन मांगें' : 'Get Quote'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quote Request Modal */}
      {selectedArtisanForQuote && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-stone-200 relative">
            <h3 className="text-base font-bold text-stone-900 mb-1">
              {isHi ? 'कार्य कोटेशन निवेदन' : 'Request Work Quote'}
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              {selectedArtisanForQuote.name} ({selectedArtisanForQuote.businessName})
            </p>

            {quoteSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-medium text-center space-y-1">
                <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto" />
                <div>{isHi ? 'आपका निवेदन कारीगर को प्रेषित कर दिया गया है!' : 'Quote request sent successfully!'}</div>
                <div className="text-[11px] text-stone-500">कारीगर शीघ्र आपसे फोन/व्हाट्सएप पर संपर्क करेंगे।</div>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1">
                    {isHi ? 'आपका नाम' : 'Your Name'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. रमेश कुमार"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-amber-700"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1">
                    {isHi ? 'मोबाइल / व्हाट्सएप नंबर' : 'Phone / WhatsApp'}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-amber-700"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1">
                    {isHi ? 'कार्य का विवरण' : 'Work Requirements'}
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder={isHi ? 'जैसे: सागवान का नक्काशीदार मंदिर बनवाना है अथवा 3D एलिवेशन...' : 'Briefly describe your requirements...'}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-amber-700 font-hindi"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedArtisanForQuote(null)}
                    className="flex-1 py-2 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
                  >
                    {isHi ? 'रद्द करें' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-lg transition-colors cursor-pointer"
                  >
                    {isHi ? 'निवेदन भेजें' : 'Send Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Register Artisan Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-stone-900 mb-1">
              {isHi ? 'शिल्पकार व व्यापार पंजीकरण' : 'Artisan Business Registration'}
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              {isHi
                ? 'विश्वकर्मा समाज निर्देशिका में अपनी सेवा या दुकान दर्ज कर पूरे भारत के ग्राहकों से जुड़ें।'
                : 'Join the directory to reach patrons across India.'}
            </p>

            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">
                  {isHi ? 'शिल्पकार / स्वामी का नाम *' : 'Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={newArtisanForm.name}
                  onChange={(e) => setNewArtisanForm({ ...newArtisanForm, name: e.target.value })}
                  placeholder="उदा. गोपाल शर्मा"
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">
                  {isHi ? 'उपजाति / शाखा *' : 'Subcaste *'}
                </label>
                <input
                  type="text"
                  required
                  value={newArtisanForm.subcaste}
                  onChange={(e) => setNewArtisanForm({ ...newArtisanForm, subcaste: e.target.value })}
                  placeholder="जांगिड़, पांचाल, धीमान, सुथार, लोहार, स्वर्णकार आदि"
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1">
                    {isHi ? 'शिल्प विधा' : 'Trade Category'}
                  </label>
                  <select
                    value={newArtisanForm.trade}
                    onChange={(e) =>
                      setNewArtisanForm({
                        ...newArtisanForm,
                        trade: e.target.value as Artisan['trade'],
                      })
                    }
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs bg-white"
                  >
                    <option value="wood">काष्ठकला (Woodwork)</option>
                    <option value="metal">लौह व धातु (Metal)</option>
                    <option value="jewelry">स्वर्ण व आभूषण (Jewelry)</option>
                    <option value="architecture">वास्तु व स्थापत्य (Architecture)</option>
                    <option value="stone">प्रस्तर व मूर्ति (Stone)</option>
                    <option value="engineering">इंजीनियरिंग व सीएनसी (Tech)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1">
                    {isHi ? 'अनुभव (वर्ष)' : 'Experience (Yrs)'}
                  </label>
                  <input
                    type="number"
                    value={newArtisanForm.experienceYears}
                    onChange={(e) =>
                      setNewArtisanForm({
                        ...newArtisanForm,
                        experienceYears: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">
                  {isHi ? 'प्रतिष्ठान / फर्म का नाम' : 'Business Name'}
                </label>
                <input
                  type="text"
                  value={newArtisanForm.businessName}
                  onChange={(e) =>
                    setNewArtisanForm({ ...newArtisanForm, businessName: e.target.value })
                  }
                  placeholder="उदा. श्री विश्वकर्मा फर्नीचर व इंटीरियर्स"
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1">
                    {isHi ? 'शहर / जिला *' : 'City *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newArtisanForm.city}
                    onChange={(e) => setNewArtisanForm({ ...newArtisanForm, city: e.target.value })}
                    placeholder="उदा. जयपुर"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1">
                    {isHi ? 'राज्य *' : 'State *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newArtisanForm.state}
                    onChange={(e) => setNewArtisanForm({ ...newArtisanForm, state: e.target.value })}
                    placeholder="उदा. राजस्थान"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">
                  {isHi ? 'मोबाइल / व्हाट्सएप नंबर *' : 'Mobile *'}
                </label>
                <input
                  type="tel"
                  required
                  value={newArtisanForm.phone}
                  onChange={(e) => setNewArtisanForm({ ...newArtisanForm, phone: e.target.value })}
                  placeholder="+91 98290 00000"
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">
                  {isHi ? 'कार्य विशिष्टता (Specialization)' : 'Specialization'}
                </label>
                <textarea
                  rows={2}
                  value={newArtisanForm.specialization}
                  onChange={(e) =>
                    setNewArtisanForm({ ...newArtisanForm, specialization: e.target.value })
                  }
                  placeholder="जैसे: सागवान मंदिर, सीएनसी कटिंग, मॉड्यूलर किचन, हेरिटेज नक्काशी..."
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs font-hindi"
                />
              </div>

              {/* Photo Upload Section with Explicit Size in Brackets */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-amber-800 shrink-0" />
                    <span>{isHi ? 'कारीगर / वर्कशॉप फोटो (अधिकतम 5 MB) *' : 'Artisan / Workshop Photo (Max 5 MB) *'}</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="text-[11px] font-bold text-amber-800 hover:text-amber-900 underline cursor-pointer text-left"
                  >
                    {showUrlInput
                      ? (isHi ? 'फ़ाइल अपलोड पर लौटें' : 'Back to File Upload')
                      : (isHi ? 'अथवा वेब लिंक (URL) दर्ज करें' : 'Or Enter Image URL')}
                  </button>
                </div>

                {showUrlInput ? (
                  <div className="space-y-1">
                    <input
                      type="url"
                      value={newArtisanForm.image}
                      onChange={(e) => {
                        setNewArtisanForm({ ...newArtisanForm, image: e.target.value });
                        setUploadedImagePreview(e.target.value);
                      }}
                      placeholder="https://example.com/artisan-photo.jpg"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono"
                    />
                    <p className="text-[11px] text-stone-500 font-hindi">
                      {isHi ? 'सीधा इमेज वेब लिंक दर्ज करें' : 'Direct image web link'}
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
                      id="artisan-photo-file-input"
                    />

                    {uploadedImagePreview ? (
                      <div className="relative rounded-xl overflow-hidden border-2 border-amber-500 bg-stone-900 shadow-xs p-1.5">
                        <div className="h-36 sm:h-44 w-full rounded-lg overflow-hidden relative">
                          <img
                            src={uploadedImagePreview}
                            alt="Artisan Preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded border border-white/20 flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>{isHi ? 'फोटो चयनित' : 'Photo Selected'}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1.5 px-1 text-xs text-stone-300">
                          <div className="truncate max-w-[70%]">
                            <span className="font-semibold text-white">
                              {imageFileName || (isHi ? 'चयनित फोटो' : 'Selected Photo')}
                            </span>
                            {imageFileSize && <span className="ml-1.5 text-stone-400">({imageFileSize})</span>}
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveUploadedImage}
                            className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>{isHi ? 'हटाएं' : 'Remove'}</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/40 hover:bg-amber-50/70 rounded-xl p-4 text-center cursor-pointer transition-all space-y-1.5 group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                          <UploadCloud className="w-5 h-5 text-amber-800" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-stone-900 group-hover:text-amber-900">
                            {isHi ? 'मोबाइल या कंप्यूटर से फोटो चुनें (PNG/JPG)' : 'Choose Photo from Mobile or PC (PNG/JPG)'}
                          </div>
                          <div className="text-[11px] text-stone-600 font-hindi">
                            {isHi
                              ? 'अनुशंसित आकार: 800 × 600 px (अधिकतम फ़ाइल साइज़: 5 MB)'
                              : 'Recommended size: 800 × 600 px (Max: 5 MB)'}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowRegisterModal(false);
                    handleRemoveUploadedImage();
                  }}
                  className="flex-1 py-2 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg cursor-pointer"
                >
                  {isHi ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 rounded-lg cursor-pointer flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-200" />
                  <span>{isHi ? 'सत्यापन व पंजीकरण पूर्ण करें' : 'Verify & Register'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SUCCESSFUL VERIFICATION CELEBRATION MODAL */}
      {/* ============================================================ */}
      {verificationSuccess && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 my-auto p-6 sm:p-8 space-y-6 font-hindi">
            {/* Celebration Header */}
            <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl flex items-center gap-3 shadow-md">
              <div className="w-12 h-12 rounded-full bg-white text-emerald-800 flex items-center justify-center shrink-0 font-bold shadow-sm">
                <ShieldCheck className="w-7 h-7 text-emerald-600" />
              </div>
              <div className="text-xs sm:text-sm leading-relaxed">
                <div className="font-bold text-base flex items-center gap-1.5">
                  <span>{isHi ? 'सफलतापूर्वक सत्यापित व पंजीकृत!' : 'Successfully Verified & Registered!'}</span>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>
                <div className="text-emerald-100 text-xs mt-0.5">
                  {isHi
                    ? 'आपका शिल्पकार प्रोफाइल राष्ट्रीय निर्देशिका में सत्यापित बैज के साथ लाइव हो चुका है।'
                    : 'Your artisan profile is now live with the Verified Badge in the national directory.'}
                </div>
              </div>
            </div>

            {/* Official Certificate Card Preview */}
            <div className="bg-gradient-to-br from-amber-50 via-white to-amber-100/50 border-2 border-amber-600 rounded-2xl p-5 shadow-xs space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-amber-200 pb-2.5">
                <div>
                  <div className="text-[11px] font-bold text-amber-900">
                    {isHi
                      ? 'अखिल भारतीय विश्वकर्मा शिल्पी महामंच · डिजिटल प्रमाण पत्र'
                      : 'All India Vishwakarma Artisan Federation · Digital Certificate'}
                  </div>
                  <div className="text-xs font-mono text-stone-500">
                    {isHi ? 'प्रमाणन सं.:' : 'Cert No:'} <strong>{verificationSuccess.certNumber}</strong>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{isHi ? 'सत्यापित शिल्पकार' : 'Verified Artisan'}</span>
                </span>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-20 h-24 rounded-xl overflow-hidden bg-stone-100 shrink-0 border-2 border-amber-600 shadow-xs">
                  <img
                    src={verificationSuccess.artisan.image}
                    alt={verificationSuccess.artisan.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1 min-w-0">
                  <h4 className="font-bold text-base text-stone-900 truncate">
                    {verificationSuccess.artisan.name}
                  </h4>
                  <div className="text-xs font-bold text-amber-900">
                    {isHi ? verificationSuccess.artisan.tradeLabelHi : (verificationSuccess.artisan.tradeLabelEn || verificationSuccess.artisan.tradeLabelHi)}
                  </div>
                  <div className="text-xs text-stone-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>{verificationSuccess.artisan.city}, {verificationSuccess.artisan.state}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-amber-700 font-bold pt-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{verificationSuccess.artisan.rating} ({isHi ? 'सत्यापित शिल्पकार' : 'Verified Artisan'})</span>
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-stone-200 text-xs text-stone-700 space-y-1">
                <div className="font-semibold text-stone-900">
                  {verificationSuccess.artisan.businessName}
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  {verificationSuccess.artisan.specialization}
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-amber-200">
                <span>{isHi ? 'सत्यापन तिथि:' : 'Verification Date:'} {verificationSuccess.date}</span>
                <span className="text-emerald-700 font-bold">{isHi ? '100% प्रामाणिक सदस्यता' : '100% Verified Member'}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setVerificationSuccess(null)}
                className="w-full py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer text-center"
              >
                {isHi ? 'निर्देशिका में देखें एवं समाप्त करें' : 'View in Directory & Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
