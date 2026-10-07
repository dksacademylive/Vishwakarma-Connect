import React, { useState, useRef } from 'react';
import { HallOfFamePerson } from '../data/homeData';
import { Language } from '../types';
import {
  Award,
  Plus,
  Search,
  BookOpen,
  Calendar,
  Sparkles,
  ChevronRight,
  X,
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  Check,
  Share2,
  ExternalLink,
  Flame,
  ShieldCheck
} from 'lucide-react';

interface LuminariesSectionProps {
  luminaries: HallOfFamePerson[];
  onAddLuminary: (luminary: HallOfFamePerson) => void;
  lang: Language;
}

export const LuminariesSection: React.FC<LuminariesSectionProps> = ({
  luminaries,
  onAddLuminary,
  lang,
}) => {
  const isHi = lang === 'hi';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedLuminaryDetail, setSelectedLuminaryDetail] = useState<HallOfFamePerson | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Photo upload states for Luminary Form
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string>('');
  const [imageFileSize, setImageFileSize] = useState<string>('');
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false);

  // Form State
  const [newLuminaryForm, setNewLuminaryForm] = useState({
    name: '',
    title: '',
    category: 'modern' as HallOfFamePerson['category'],
    era: '',
    photo: '',
    famousWorks: '',
    honors: '',
    shortBio: '',
  });

  const categories = [
    { id: 'all', labelHi: 'समस्त विभूतियां', labelEn: 'All Legends' },
    { id: 'modern', labelHi: 'आधुनिक काल', labelEn: 'Modern Era' },
    { id: 'ancient', labelHi: 'पौराणिक व ऐतिहासिक काल', labelEn: 'Ancient & Heritage' },
    { id: 'architecture', labelHi: 'स्थापत्य व वास्तु', labelEn: 'Architecture' },
    { id: 'art', labelHi: 'मूर्तिकला व कला', labelEn: 'Sculpture & Art' },
    { id: 'engineering', labelHi: 'इंजीनियरिंग व विज्ञान', labelEn: 'Engineering & Tech' },
  ];

  const filteredLuminaries = luminaries.filter((person) => {
    const matchesCategory =
      selectedCategory === 'all' || person.category === selectedCategory;
    const matchesSearch =
      person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.era.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.famousWorks.some((w) => w.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
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
      setNewLuminaryForm((prev) => ({ ...prev, photo: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveUploadedImage = () => {
    setUploadedImagePreview(null);
    setImageFileName('');
    setImageFileSize('');
    setNewLuminaryForm((prev) => ({ ...prev, photo: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddLuminarySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLuminaryForm.name || !newLuminaryForm.title || !newLuminaryForm.era) return;

    // Parse famousWorks into array
    const worksList = newLuminaryForm.famousWorks
      .split('\n')
      .map((w) => w.trim())
      .filter((w) => w.length > 0);

    // Parse honors into array
    const honorsList = newLuminaryForm.honors
      .split(',')
      .map((h) => h.trim())
      .filter((h) => h.length > 0);

    const createdLuminary: HallOfFamePerson = {
      id: `hof-${Date.now()}`,
      name: newLuminaryForm.name,
      title: newLuminaryForm.title,
      category: newLuminaryForm.category,
      era: newLuminaryForm.era,
      photo:
        uploadedImagePreview ||
        newLuminaryForm.photo ||
        'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
      famousWorks: worksList.length > 0 ? worksList : ['विशिष्ट स्थापत्य एवं शिल्प योगदान'],
      honors: honorsList.length > 0 ? honorsList : ['राष्ट्रीय गौरव सम्मान'],
      shortBio: newLuminaryForm.shortBio,
    };

    onAddLuminary(createdLuminary);
    setIsAddModalOpen(false);
    handleRemoveUploadedImage();

    // Reset Form
    setNewLuminaryForm({
      name: '',
      title: '',
      category: 'modern',
      era: '',
      photo: '',
      famousWorks: '',
      honors: '',
      shortBio: '',
    });
  };

  const handleShare = (person: HallOfFamePerson) => {
    const text = `विश्वकर्मा वंश गौरव विभूति: ${person.name} (${person.title})\nकालखंड: ${person.era}\nप्रमुख कृतियां: ${person.famousWorks.join(', ')}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(person.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn font-hindi">
      {/* 1. Majestic Hero Banner */}
      <div className="bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950 text-white rounded-3xl p-6 sm:p-10 shadow-sm border border-amber-800/80 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 tracking-wide uppercase">
              <Award className="w-4 h-4 text-amber-400" />
              <span>विश्वकर्मा वंश गौरव · Hall of Fame Directory</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">
              इतिहास व आधुनिक युग के अमर शिल्पी व विभूतियां
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-hindi">
              जिन्होंने अपनी दिव्य स्थापत्य कला, मूर्तिकला, वैज्ञानिक दृष्टि और राष्ट्र निर्माण के अप्रतिम योगदान से भारत और विश्वकर्मा कुल का गौरव संपूर्ण विश्व में अमर कर दिया।
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all transform hover:scale-[1.02] shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>नई विभूति / अमर शिल्पी जोड़ें</span>
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
              placeholder="विभूति का नाम, उपाधि, कालखंड या प्रमुख कृति से खोजें..."
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
            />
          </div>
          <div className="text-xs font-semibold text-stone-500 flex items-center self-center px-1">
            <span>{filteredLuminaries.length} विभूतियां सूचीबद्ध</span>
          </div>
        </div>

        {/* Category Pills (Responsive with shrink-0) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none px-0.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
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

      {/* 3. Luminaries Grid - Matched Light Yellow (Amber) Royal Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredLuminaries.map((person) => (
          <div
            key={person.id}
            className="bg-gradient-to-b from-[#FFFDF7] via-amber-50/70 to-amber-100/30 text-stone-900 rounded-3xl p-6 sm:p-7 border border-amber-300/80 shadow-xs hover:border-amber-500 hover:shadow-md transition-all flex flex-col justify-between space-y-5 group relative overflow-hidden"
          >
            <div className="space-y-4">
              {/* Header with Photo, Name & Era */}
              <div className="flex items-start gap-4">
                <div className="w-22 h-28 sm:w-24 sm:h-32 rounded-2xl overflow-hidden bg-amber-100 shrink-0 border-2 border-amber-300 shadow-xs">
                  <img
                    src={person.photo}
                    alt={person.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="space-y-1.5 min-w-0">
                  <span className="text-[11px] font-bold text-amber-900 bg-amber-100/90 px-2.5 py-0.5 rounded-full border border-amber-300">
                    {person.era}
                  </span>
                  <h3 className="text-xl font-bold font-display text-stone-900 leading-snug">
                    {person.name}
                  </h3>
                  <div className="text-xs text-amber-800 font-semibold">
                    {person.title}
                  </div>
                </div>
              </div>

              {/* Short Bio */}
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-hindi">
                {person.shortBio}
              </p>

              {/* Famous Historical Works */}
              <div className="space-y-1.5 pt-2 border-t border-amber-200/80">
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
                  प्रमुख ऐतिहासिक कृतियां / आविष्कार:
                </div>
                <ul className="text-xs text-stone-700 space-y-1">
                  {person.famousWorks.map((work, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5" />
                      <span>{work}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Honors Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {person.honors.map((hon, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-bold text-amber-900 bg-amber-100/90 px-2.5 py-0.5 rounded-md border border-amber-300"
                  >
                    ★ {hon}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-amber-200/80 flex items-center justify-between">
              <button
                onClick={() => handleShare(person)}
                className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedId === person.id ? 'कॉपी हो गया!' : 'शेयर'}</span>
              </button>

              <button
                onClick={() => setSelectedLuminaryDetail(person)}
                className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>अधिक जानकारी / विवरण</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ============================================================ */}
      {/* 4. MODAL: DETAILED LUMINARY BIOGRAPHY MODAL (LIGHT THEME) */}
      {/* ============================================================ */}
      {selectedLuminaryDetail && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
          <div className="bg-gradient-to-b from-[#FFFDF7] via-white to-amber-50/50 text-stone-900 rounded-3xl max-w-xl w-full shadow-2xl border-2 border-amber-400 max-h-[92vh] overflow-y-auto my-auto p-6 sm:p-8 space-y-5">
            <div className="flex items-start justify-between border-b border-amber-200 pb-3">
              <div>
                <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                  {selectedLuminaryDetail.era}
                </span>
                <h3 className="text-2xl font-bold font-display text-stone-900 mt-1">
                  {selectedLuminaryDetail.name}
                </h3>
                <div className="text-xs text-amber-800 font-semibold mt-0.5">
                  {selectedLuminaryDetail.title}
                </div>
              </div>
              <button
                onClick={() => setSelectedLuminaryDetail(null)}
                className="text-stone-400 hover:text-stone-700 p-1.5 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="h-56 rounded-2xl overflow-hidden border-2 border-amber-300 bg-amber-50 shadow-xs">
              <img
                src={selectedLuminaryDetail.photo}
                alt={selectedLuminaryDetail.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed font-hindi">
              <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200">
                <div className="font-bold text-amber-900 text-xs mb-1">जीवन परिचय व साधना:</div>
                <p className="text-stone-800 leading-relaxed">{selectedLuminaryDetail.shortBio}</p>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-amber-900 text-xs uppercase tracking-wider">
                  ऐतिहासिक कृतियां व राष्ट्र निर्माण में योगदान:
                </div>
                <ul className="space-y-1.5">
                  {selectedLuminaryDetail.famousWorks.map((work, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-amber-200 text-stone-800">
                      <span className="text-emerald-700 font-bold">✓</span>
                      <span>{work}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="font-bold text-amber-900 text-xs">प्राप्त राष्ट्रीय व वैश्विक सम्मान:</div>
                <div className="flex flex-wrap gap-2">
                  {selectedLuminaryDetail.honors.map((hon, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-bold text-amber-900 bg-amber-100/90 px-3 py-1 rounded-lg border border-amber-300 shadow-2xs"
                    >
                      ★ {hon}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-amber-200 flex justify-end">
              <button
                onClick={() => setSelectedLuminaryDetail(null)}
                className="px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl text-xs sm:text-sm cursor-pointer transition-colors shadow-xs"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. MODAL: ADD NEW LUMINARY FORM (EXACT HALL OF FAME FORMAT) */}
      {/* ============================================================ */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn font-hindi">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-stone-200 max-h-[94vh] overflow-y-auto my-auto p-6 sm:p-8 space-y-5">
            <div className="flex items-start justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  विश्वकर्मा वंश गौरव प्रविष्टि
                </span>
                <h3 className="text-xl font-bold font-display text-stone-900 mt-1">
                  नई अमर विभूति / शिल्पी का विवरण जोड़ें
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  handleRemoveUploadedImage();
                }}
                className="text-stone-400 hover:text-stone-700 p-1.5 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddLuminarySubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">
                  विभूति / शिल्पी का नाम (Name) *
                </label>
                <input
                  type="text"
                  required
                  value={newLuminaryForm.name}
                  onChange={(e) => setNewLuminaryForm({ ...newLuminaryForm, name: e.target.value })}
                  placeholder="उदा. पद्मश्री कांतिलाल पांचाल (मूर्तिकार)"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">
                    उपाधि / कार्यक्षेत्र (Title) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newLuminaryForm.title}
                    onChange={(e) => setNewLuminaryForm({ ...newLuminaryForm, title: e.target.value })}
                    placeholder="उदा. पाषाण मंदिर वास्तुशिल्पी"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">
                    कालखंड / युग (Era) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newLuminaryForm.era}
                    onChange={(e) => setNewLuminaryForm({ ...newLuminaryForm, era: e.target.value })}
                    placeholder="उदा. 1930 - 2018 अथवा आधुनिक काल"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">श्रेणी (Category) *</label>
                <select
                  value={newLuminaryForm.category}
                  onChange={(e) =>
                    setNewLuminaryForm({
                      ...newLuminaryForm,
                      category: e.target.value as HallOfFamePerson['category'],
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                >
                  <option value="modern">आधुनिक काल (Modern Era)</option>
                  <option value="ancient">पौराणिक व ऐतिहासिक काल (Ancient & Heritage)</option>
                  <option value="architecture">स्थापत्य व वास्तु (Architecture)</option>
                  <option value="art">मूर्तिकला व कला (Sculpture & Art)</option>
                  <option value="engineering">इंजीनियरिंग व विज्ञान (Engineering)</option>
                </select>
              </div>

              {/* Photo Upload Section with Explicit Size Mentioned in Brackets */}
              <div className="space-y-2 pt-1 border-t border-stone-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-amber-800 shrink-0" />
                    <span>{isHi ? 'विभूति चित्र / फोटो (अधिकतम 5 MB) *' : 'Luminary Portrait / Photo (Max 5 MB) *'}</span>
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
                      value={newLuminaryForm.photo}
                      onChange={(e) => {
                        setNewLuminaryForm({ ...newLuminaryForm, photo: e.target.value });
                        setUploadedImagePreview(e.target.value);
                      }}
                      placeholder="https://example.com/luminary-photo.jpg"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 font-mono"
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
                      id="luminary-photo-input"
                    />

                    {uploadedImagePreview ? (
                      <div className="relative rounded-2xl overflow-hidden border-2 border-amber-500 bg-stone-900 shadow-sm p-2">
                        <div className="h-44 w-full rounded-xl overflow-hidden relative">
                          <img
                            src={uploadedImagePreview}
                            alt="Uploaded Luminary"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-md border border-white/20 flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>{isHi ? 'फोटो चयनित' : 'Photo Selected'}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 px-1 text-xs text-stone-300">
                          <div className="truncate max-w-[70%]">
                            <span className="font-semibold text-white">
                              {imageFileName || (isHi ? 'चयनित फोटो' : 'Selected Photo')}
                            </span>
                            {imageFileSize && <span className="ml-2 text-stone-400">({imageFileSize})</span>}
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveUploadedImage}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{isHi ? 'फोटो हटाएं' : 'Remove Photo'}</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/40 hover:bg-amber-50/70 rounded-2xl p-5 text-center cursor-pointer transition-all space-y-1.5 group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-2xs">
                          <UploadCloud className="w-5 h-5 text-amber-800" />
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-amber-900">
                            {isHi ? 'मोबाइल या कंप्यूटर से फोटो चुनें (PNG/JPG)' : 'Choose Photo from Mobile or PC (PNG/JPG)'}
                          </div>
                          <div className="text-[11px] text-stone-600 font-hindi">
                            {isHi
                              ? 'अनुशंसित आकार: 600 × 800 px (अधिकतम 5 MB)'
                              : 'Recommended size: 600 × 800 px (Max: 5 MB)'}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Short Bio */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">
                  {isHi ? 'संक्षिप्त जीवन परिचय एवं योगदान *' : 'Short Bio & Contribution *'}
                </label>
                <textarea
                  rows={2}
                  required
                  value={newLuminaryForm.shortBio}
                  onChange={(e) =>
                    setNewLuminaryForm({ ...newLuminaryForm, shortBio: e.target.value })
                  }
                  placeholder={
                    isHi
                      ? 'विभूति का संक्षिप्त परिचय, जन्म स्थान, साधना और समाज व राष्ट्र के लिए उनका गौरवमयी योगदान...'
                      : 'Brief bio, birthplace, notable achievements, and service to society...'
                  }
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                />
              </div>

              {/* Famous Works */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 flex items-center justify-between">
                  <span>{isHi ? 'प्रमुख ऐतिहासिक कृतियां / आविष्कार *' : 'Key Works & Inventions *'}</span>
                  <span className="text-[10px] text-stone-500">
                    {isHi ? 'प्रत्येक कृति नई पंक्ति में लिखें' : 'Enter each on a new line'}
                  </span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={newLuminaryForm.famousWorks}
                  onChange={(e) =>
                    setNewLuminaryForm({ ...newLuminaryForm, famousWorks: e.target.value })
                  }
                  placeholder={
                    isHi
                      ? 'उदा.&#10;स्टैच्यू ऑफ यूनिटी निर्माण&#10;अक्षरधाम मंदिर स्थापत्य नक्काशी'
                      : 'e.g.&#10;Statue of Unity Architecture&#10;Sacred Temple Carvings'
                  }
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                />
              </div>

              {/* Honors and Awards */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 flex items-center justify-between">
                  <span>{isHi ? 'प्राप्त सम्मान व पुरस्कार' : 'Honors & Awards'}</span>
                  <span className="text-[10px] text-stone-500">
                    {isHi ? 'कॉमा (,) लगाकर अलग करें' : 'Separate with commas'}
                  </span>
                </label>
                <input
                  type="text"
                  value={newLuminaryForm.honors}
                  onChange={(e) =>
                    setNewLuminaryForm({ ...newLuminaryForm, honors: e.target.value })
                  }
                  placeholder={
                    isHi
                      ? 'उदा. पद्म श्री (2002), राष्ट्रीय शिल्प गुरु सम्मान, मानद उपाधि'
                      : 'e.g. Padma Shri (2002), National Shilp Guru Award'
                  }
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
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
                  <span>{isHi ? 'विभूति विवरण प्रकाशित करें' : 'Publish Luminary Profile'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
