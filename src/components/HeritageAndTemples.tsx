import React, { useState } from 'react';
import { Temple, Language, MythologicalCreation, ShilpVanshaDetail } from '../types';
import { 
  VISHWAKARMA_TEMPLES, 
  VISHWAKARMA_FIVE_SONS, 
  MYTHOLOGICAL_CREATIONS, 
  SHILP_VANSHA_DETAILS 
} from '../data/mockData';
import { SacredScripturesSection } from './SacredScripturesSection';
import { SACRED_SCRIPTURES } from '../data/scripturesData';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Bed, 
  Sparkles, 
  BookOpen, 
  Compass, 
  CheckCircle, 
  ArrowLeft, 
  ExternalLink, 
  Plus, 
  X, 
  ChevronRight, 
  ShieldCheck,
  Building2,
  Unlink,
  Link as LinkIcon,
  Scroll,
  FileText
} from 'lucide-react';

interface HeritageAndTemplesProps {
  lang: Language;
}

type HeritageViewMode = 'overview' | 'creation-detail' | 'shilp-vansha' | 'scriptures';

export const HeritageAndTemples: React.FC<HeritageAndTemplesProps> = ({ lang }) => {
  const isHi = lang === 'hi';

  // Sub-view management: 'overview' | 'creation-detail' | 'shilp-vansha' | 'scriptures'
  const [viewMode, setViewMode] = useState<HeritageViewMode>('overview');
  const [selectedCreationId, setSelectedCreationId] = useState<string>('dwarka');
  const [selectedVanshaId, setSelectedVanshaId] = useState<string | null>(null);
  const [activeScriptureId, setActiveScriptureId] = useState<string>('vishwakarma-purana');

  // Temples state with In-listing support
  const [templesList, setTemplesList] = useState<Temple[]>(VISHWAKARMA_TEMPLES);
  const [selectedTempleForBooking, setSelectedTempleForBooking] = useState<Temple | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [showInlistModal, setShowInlistModal] = useState<boolean>(false);
  const [inlistSuccess, setInlistSuccess] = useState<boolean>(false);

  // Inlist form state
  const [newTempleForm, setNewTempleForm] = useState({
    name: '',
    location: '',
    state: '',
    description: '',
    dharamshalaRooms: 20,
    dailyTimings: 'प्रातः 06:00 से रात्रि 09:00 तक',
    contact: '',
    facilities: ['कमरे उपलब्ध', 'पार्किंग', 'भोजनालय / लंगर'],
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&auto=format&fit=crop&q=80',
  });

  const selectedCreation = MYTHOLOGICAL_CREATIONS.find((c) => c.id === selectedCreationId) || MYTHOLOGICAL_CREATIONS[0];

  const handleOpenCreationDetail = (creationId: string) => {
    setSelectedCreationId(creationId);
    setViewMode('creation-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenShilpVansha = (vanshaId?: string) => {
    if (vanshaId) setSelectedVanshaId(vanshaId);
    setViewMode('shilp-vansha');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenScripture = (scriptureId: string = 'vishwakarma-purana') => {
    setActiveScriptureId(scriptureId);
    setViewMode('scriptures');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setSelectedTempleForBooking(null);
    }, 2500);
  };

  const handleInlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTempleForm.name || !newTempleForm.location || !newTempleForm.contact) return;

    const newTemple: Temple = {
      id: `tmp-${Date.now()}`,
      name: newTempleForm.name,
      location: newTempleForm.location,
      state: newTempleForm.state || 'भारत',
      description: newTempleForm.description || 'विश्वकर्मा समाज का पवित्र देवालय एवं धर्मशाला।',
      dharamshalaRooms: Number(newTempleForm.dharamshalaRooms) || 15,
      dailyTimings: newTempleForm.dailyTimings,
      contact: newTempleForm.contact,
      facilities: newTempleForm.facilities,
      image: newTempleForm.image,
      verified: true,
    };

    setTemplesList([newTemple, ...templesList]);
    setInlistSuccess(true);
    setTimeout(() => {
      setInlistSuccess(false);
      setShowInlistModal(false);
      // Reset form
      setNewTempleForm({
        name: '',
        location: '',
        state: '',
        description: '',
        dharamshalaRooms: 20,
        dailyTimings: 'प्रातः 06:00 से रात्रि 09:00 तक',
        contact: '',
        facilities: ['कमरे उपलब्ध', 'पार्किंग', 'भोजनालय / लंगर'],
        image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&auto=format&fit=crop&q=80',
      });
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Sub-Navigation Ribbon between Heritage Pages */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('overview')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              viewMode === 'overview'
                ? 'bg-amber-900 text-white'
                : 'text-stone-600 hover:text-stone-900 bg-stone-100'
            }`}
          >
            {isHi ? 'मुख्य इतिहास व तीर्थ' : 'Heritage Overview'}
          </button>

          <button
            onClick={() => handleOpenShilpVansha()}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'shilp-vansha'
                ? 'bg-amber-900 text-white'
                : 'text-stone-600 hover:text-stone-900 bg-stone-100'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{isHi ? 'पंचपुत्र शिल्प वंश (विस्तृत पृष्ठ)' : 'Shilp Lineages Page'}</span>
          </button>

          <button
            onClick={() => setViewMode('scriptures')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'scriptures'
                ? 'bg-amber-900 text-white'
                : 'text-stone-600 hover:text-stone-900 bg-stone-100'
            }`}
          >
            <Scroll className="w-3.5 h-3.5" />
            <span>{isHi ? 'विश्वकर्मा पुराण व धर्मग्रन्थ' : 'Sacred Scriptures & Purana'}</span>
          </button>

          {viewMode === 'creation-detail' && (
            <div className="flex items-center gap-1 text-xs font-semibold text-amber-900 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{isHi ? 'कथा विवरण पृष्ठ' : 'Story Detail Page'}</span>
            </div>
          )}
        </div>

        {/* Action: In-list new temple */}
        <button
          onClick={() => setShowInlistModal(true)}
          className="px-3.5 py-2 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isHi ? 'मंदिर या धर्मशाला इनलिस्ट करें' : 'In-list Temple / Dharamshala'}</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* VIEW 1: CREATION DETAIL PAGE (विस्तृत पौराणिक कथा पृष्ठ) */}
      {/* ============================================================ */}
      {viewMode === 'creation-detail' && selectedCreation && (
        <div className="space-y-8 animate-fadeIn">
          {/* Top Unlink & Return Bar */}
          <div className="flex items-center justify-between bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
            <button
              onClick={() => setViewMode('overview')}
              className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-amber-900 hover:text-amber-800 transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <Unlink className="w-4 h-4 text-stone-400" />
              <span>{isHi ? 'वापस मुख्य सूची पर जाएं (अनलिंक करें)' : 'Unlink & Return to Overview'}</span>
            </button>

            {/* Quick selector of other stories (Responsive with shrink-0) */}
            <div className="flex items-center gap-2 text-xs text-stone-500 overflow-x-auto scrollbar-none px-0.5">
              <span className="hidden sm:inline font-medium shrink-0">{isHi ? 'अन्य कथाएं:' : 'Other Stories:'}</span>
              {MYTHOLOGICAL_CREATIONS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCreationId(c.id)}
                  className={`px-2.5 py-1 rounded text-xs whitespace-nowrap cursor-pointer transition-colors shrink-0 ${
                    c.id === selectedCreationId
                      ? 'bg-amber-900 text-white font-bold'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  {c.titleHi.split('(')[0].trim()}
                </button>
              ))}
            </div>
          </div>

          {/* Creation Detail Banner */}
          <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-10 border border-stone-800 relative overflow-hidden">
            <div className="relative z-10 max-w-3xl space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 tracking-wider">
                <span>दिव्य रचना आख्यान</span>
                <span aria-hidden="true">·</span>
                <span>संरक्षक देव: {selectedCreation.patronDeity}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-bold font-display text-white text-balance leading-tight">
                {selectedCreation.titleHi}
              </h2>

              <p className="text-sm sm:text-base text-stone-300 font-hindi leading-relaxed">
                {selectedCreation.shortSummaryHi}
              </p>
            </div>
          </div>

          {/* Sacred Sanskrit Shloka Box */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>{isHi ? 'पौराणिक शास्त्रीय श्लोक व प्रमाण' : 'Scriptural Sanskrit Shloka'}</span>
            </div>
            <blockquote className="text-base sm:text-lg font-hindi text-amber-950 font-semibold italic border-l-4 border-amber-700 pl-4 py-1 leading-relaxed">
              "{selectedCreation.shloka}"
            </blockquote>
            <div className="text-xs sm:text-sm text-stone-700 font-hindi pl-4">
              <strong>{isHi ? 'हिन्दी अर्थ: ' : 'Meaning: '}</strong>
              {selectedCreation.shlokaMeaning}
            </div>
          </div>

          {/* Detailed Narrative & Secrets Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Main Narrative (8 cols) */}
            <div className="lg:col-span-8 bg-white border border-stone-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-xs">
              <div>
                <h3 className="text-lg font-bold text-stone-900 font-display mb-3 border-b border-stone-100 pb-2">
                  {isHi ? 'पौराणिक इतिहास एवं निर्माण गाथा' : 'Sacred Legend and Construction'}
                </h3>
                <p className="text-stone-700 font-hindi leading-relaxed text-sm sm:text-base whitespace-pre-line">
                  {selectedCreation.fullStoryHi}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100">
                <h4 className="text-base font-bold text-stone-900 font-display mb-2 text-amber-900">
                  {isHi ? 'वास्तु व वैज्ञानिक विशिष्टता (Architectural Secrets)' : 'Vedic Architectural Secrets'}
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 font-hindi leading-relaxed bg-stone-50 p-4 rounded-lg border border-stone-200">
                  {selectedCreation.architecturalSignificance}
                </p>
              </div>

              {/* Key Features List */}
              <div className="pt-4 border-t border-stone-100">
                <h4 className="text-base font-bold text-stone-900 font-display mb-3">
                  {isHi ? 'इस रचना की अलौकिक विशेषताएं:' : 'Salient Divine Features:'}
                </h4>
                <div className="space-y-2.5">
                  {selectedCreation.keyFeatures.map((feat: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-stone-700">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="font-hindi">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comprehensive Scriptural Evidences & Sacred Treatises Section */}
              <div className="pt-6 border-t border-stone-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="text-base sm:text-lg font-bold text-amber-950 font-display flex items-center gap-2">
                    <Scroll className="w-5 h-5 text-amber-800" />
                    <span>{isHi ? 'शास्त्रीय प्रमाण एवं सम्बन्धित धर्मग्रन्थ' : 'Scriptural Evidences & Treatises'}</span>
                  </h4>
                  {selectedCreation.puranaReference && (
                    <span className="text-[11px] font-semibold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                      {selectedCreation.puranaReference}
                    </span>
                  )}
                </div>

                {selectedCreation.scripturalEvidence && (
                  <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-2">
                    <div className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-700" />
                      <span>{isHi ? 'वैदिक व पौराणिक ऐतिहासिक साक्ष्य (Scriptural Proof):' : 'Scriptural Proof:'}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-800 font-hindi leading-relaxed">
                      {selectedCreation.scripturalEvidence}
                    </p>
                  </div>
                )}

                {/* Related Scriptures Action Cards */}
                {selectedCreation.relatedScriptures && selectedCreation.relatedScriptures.length > 0 && (
                  <div className="space-y-2.5 pt-2">
                    <div className="text-xs font-bold text-stone-700 font-hindi">
                      {isHi ? 'इस रचना का प्रमाण देने वाले मूल धर्मग्रन्थ (अध्ययन हेतु लिंक खोलें):' : 'Authentic Treatises Documenting this Creation (Click to study):'}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedCreation.relatedScriptures.map((rel, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl border border-stone-200 bg-stone-50 hover:bg-white hover:border-amber-400 transition-all flex flex-col justify-between space-y-2 shadow-2xs"
                        >
                          <div>
                            <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                              <BookOpen className="w-4 h-4 text-amber-700" />
                              <span>{rel.name}</span>
                            </div>
                            <div className="text-[11px] text-stone-600 font-hindi mt-1">
                              {rel.chapter}
                            </div>
                          </div>
                          <button
                            onClick={() => handleOpenScripture(rel.scriptureId)}
                            className="mt-2 py-2 px-3 bg-amber-900 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                          >
                            <span>{isHi ? 'ग्रन्थ का अध्ययन करें व A4 PDF प्राप्त करें →' : 'Study Treatise & Get A4 PDF →'}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar with Navigation and Lineage Connection (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Connected Lineage Card */}
              <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-3">
                <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-amber-800" />
                  <span>{isHi ? 'संबंधित शिल्प वंश' : 'Connected Craft Lineage'}</span>
                </h4>
                <p className="text-xs text-stone-600 font-hindi leading-relaxed">
                  इस दिव्य रचना का संपादन देवशिल्पी के पंचपुत्रों के ज्ञान और उनके शिल्पकर्म की सर्वोच्च परिणति है।
                </p>
                <button
                  onClick={() => handleOpenShilpVansha()}
                  className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>{isHi ? 'पंचपुत्र शिल्प वंश पृष्ठ देखें' : 'View Shilp Lineages'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Connected Scripture Proof Card */}
              <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-5 shadow-xs space-y-3">
                <h4 className="font-bold text-amber-950 text-sm flex items-center gap-1.5">
                  <Scroll className="w-4 h-4 text-amber-800" />
                  <span>{isHi ? 'शास्त्रीय प्रमाण व धर्मग्रन्थ' : 'Scriptural Source Proof'}</span>
                </h4>
                <p className="text-xs text-stone-700 font-hindi leading-relaxed">
                  {selectedCreation.puranaReference
                    ? `इस रचना का प्रामाणिक उल्लेख "${selectedCreation.puranaReference}" में विस्तार से उपलब्ध है।`
                    : 'इस रचना का विस्तृत प्रमाण श्री विश्वकर्मा पुराण तथा मयमतम् वास्तु शास्त्र में वर्णित है।'}
                </p>
                <button
                  onClick={() => handleOpenScripture(selectedCreation.connectedScriptureId || 'vishwakarma-purana')}
                  className="w-full py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{isHi ? 'सम्बन्धित धर्मग्रन्थ खोलें व A4 PDF लें' : 'Read Scripture & Get A4 PDF'}</span>
                </button>
              </div>

              {/* Bottom Unlink Button */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 text-center space-y-3">
                <p className="text-xs text-stone-500">
                  {isHi
                    ? 'अन्य सभी पौराणिक रचनाओं एवं मंदिर निर्देशिका को देखने के लिए वापस मुख्य पृष्ठ पर जाएं।'
                    : 'Return to view all divine creations and temple directory.'}
                </p>
                <button
                  onClick={() => setViewMode('overview')}
                  className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Unlink className="w-4 h-4" />
                  <span>{isHi ? 'अनलिंक करें व वापस सूची देखें' : 'Unlink & Return to List'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* VIEW: SACRED SCRIPTURES & VISHWAKARMA PURANA DEDICATED PAGE */}
      {/* ============================================================ */}
      {viewMode === 'scriptures' && (
        <SacredScripturesSection
          lang={lang}
          onBackToHeritage={() => setViewMode('overview')}
          initialScriptureId={activeScriptureId}
        />
      )}

      {/* ============================================================ */}
      {/* VIEW 2: DEDICATED SHILP VANSHA PAGE (पंचपुत्र शिल्प वंश पृष्ठ) */}
      {/* ============================================================ */}
      {viewMode === 'shilp-vansha' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Back Header */}
          <div className="flex items-center justify-between bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
            <button
              onClick={() => setViewMode('overview')}
              className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-amber-900 hover:text-amber-800 transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>{isHi ? '← वापस मुख्य इतिहास पर जाएं' : '← Return to Heritage Overview'}</span>
            </button>
            <div className="text-xs text-stone-500 font-medium">
              पंचपुत्र शिल्प परंपरा · 5 Lineages of Craft
            </div>
          </div>

          {/* Shilp Vansha Hero Banner */}
          <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 text-white rounded-2xl p-6 sm:p-10 border border-amber-900">
            <div className="max-w-3xl space-y-3">
              <span className="text-xs font-semibold text-amber-400 tracking-wider uppercase">
                अखिल भारतीय विश्वकर्मा पंचपुत्र महावंश
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold font-display text-amber-200">
                {isHi ? 'भगवान विश्वकर्मा के पंचपुत्र एवं उनकी अमर शिल्प शाखाएं' : 'The Five Sacred Shilp Lineages of Lord Vishwakarma'}
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-hindi">
                {isHi
                  ? 'सृष्टि के आरंभ में भगवान विश्वकर्मा ने ब्रह्मांड के कार्य संचालन और मानव सभ्यता के उत्थान हेतु पांच ऋषियों को अपने तेज से प्रकट किया। इन पांचों महर्षियों ने धातु, काष्ठ, कांस्य, पाषाण और स्वर्ण शिल्प के वैदिक विज्ञान की स्थापना की।'
                  : 'The primordial architectural and engineering guilds founded by the five sons of Lord Vishwakarma.'}
              </p>
            </div>
          </div>

          {/* The 5 Lineages In-Depth Cards */}
          <div className="space-y-8">
            {SHILP_VANSHA_DETAILS.map((vansha, idx) => (
              <div
                key={vansha.id}
                id={`vansha-${vansha.id}`}
                className={`bg-white border rounded-2xl p-6 sm:p-8 shadow-xs transition-colors ${
                  selectedVanshaId === vansha.id ? 'border-amber-500 ring-2 ring-amber-200' : 'border-stone-200'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 border-b border-stone-100 pb-5 mb-5">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-800 mb-1">
                      <span className="font-mono text-sm">0{idx + 1}.</span>
                      <span>{vansha.rishi}</span>
                      <span>·</span>
                      <span>आराध्य: {vansha.deityHi}</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">
                      {vansha.nameHi}
                    </h3>
                    <div className="text-xs text-amber-900 font-semibold mt-1">
                      {vansha.craftHi} ({vansha.craftEn})
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 px-3.5 py-2 rounded-xl shrink-0 text-xs">
                    <span className="text-stone-500 font-medium">{isHi ? 'पवित्र प्रतीक:' : 'Sacred Symbol:'}</span>
                    <span className="font-bold text-amber-900">{vansha.symbol}</span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs mb-6">
                  <div className="p-3 bg-stone-50 rounded-lg">
                    <span className="text-stone-400 block mb-1 font-medium">{isHi ? 'संबद्ध प्रमुख गोत्र:' : 'Associated Gotras:'}</span>
                    <div className="flex flex-wrap gap-1">
                      {vansha.associatedGotras.map((g: string, i: number) => (
                        <span key={i} className="bg-white border border-stone-200 px-2 py-0.5 rounded text-stone-800 font-medium">
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-lg">
                    <span className="text-stone-400 block mb-1 font-medium">{isHi ? 'प्रमाणिक ग्रन्थ व संहिता:' : 'Holy Scriptures:'}</span>
                    <div className="text-stone-800 font-semibold space-y-0.5 font-hindi">
                      {vansha.holyScriptures.map((sc: string, i: number) => (
                        <div key={i}>• {sc}</div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-lg">
                    <span className="text-stone-400 block mb-1 font-medium">{isHi ? 'पारंपरिक औजार:' : 'Traditional Tools:'}</span>
                    <div className="text-stone-700 font-hindi space-y-0.5">
                      {vansha.traditionalTools.slice(0, 3).join(', ')} आदि
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg">
                    <span className="text-amber-800 block mb-1 font-bold">{isHi ? 'विशेष योगदान:' : 'Special Contribution:'}</span>
                    <p className="text-stone-700 font-hindi leading-snug">
                      {vansha.salientContribution}
                    </p>
                  </div>
                </div>

                {/* Historical Role & Modern Evolution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div className="p-4 bg-stone-50/60 border border-stone-100 rounded-xl">
                    <h4 className="font-bold text-stone-900 mb-1.5 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-amber-800" />
                      <span>{isHi ? 'वैदिक व पौराणिक भूमिका' : 'Historical Vedic Role'}</span>
                    </h4>
                    <p className="text-stone-600 font-hindi leading-relaxed text-xs">
                      {vansha.historicalRole}
                    </p>
                  </div>

                  <div className="p-4 bg-stone-50/60 border border-stone-100 rounded-xl">
                    <h4 className="font-bold text-stone-900 mb-1.5 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-800" />
                      <span>{isHi ? 'आधुनिक 21वीं सदी में विस्तार' : 'Modern Industrial Evolution'}</span>
                    </h4>
                    <p className="text-stone-600 font-hindi leading-relaxed text-xs">
                      {vansha.modernEvolution}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 text-center">
            <button
              onClick={() => setViewMode('overview')}
              className="px-6 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              {isHi ? '← वापस मुख्य इतिहास व तीर्थ निर्देशिका पर जाएं' : '← Return to Main Heritage & Temples'}
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* VIEW 3: MAIN OVERVIEW (डैशबोर्ड अवलोकन) */}
      {/* ============================================================ */}
      {viewMode === 'overview' && (
        <div className="space-y-12">
          {/* Main Heritage Header */}
          <div className="border-b border-stone-200 pb-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 tracking-wide mb-1">
              <span>सनातन स्थापत्य व देवशिल्प परंपरा</span>
              <span aria-hidden="true">·</span>
              <span>पंचपुत्र वंश व पवित्र धाम</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
              {isHi ? 'भगवान विश्वकर्मा गौरव गाथा एवं तीर्थ निर्देशिका' : 'Heritage of Lord Vishwakarma & Sacred Temples'}
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-3xl leading-relaxed">
              {isHi
                ? 'सृष्टि के प्रथम वास्तुकार, शिल्पकला के आदिगुरु भगवान विश्वकर्मा और उनके पांचों मानस पुत्रों की अमर विरासत, जिन्होंने ब्रह्मांड की संरचना और मानव सभ्यता को शिल्प से अलंकृत किया।'
                : 'Honoring the cosmic architect of the universe and the five divine lineages of iron, wood, bronze, stone, and gold craftsmanship.'}
            </p>
          </div>

          {/* 5 Divine Lineages Preview Box */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-stone-900 font-display flex items-center gap-2">
                  <Compass className="w-5 h-5 text-amber-800" />
                  <span>{isHi ? 'भगवान विश्वकर्मा के पंचपुत्र एवं शिल्प शाखाएं' : 'The Five Divine Lineages of Craft'}</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {isHi ? 'किसी भी वंश पर क्लिक कर उसका विस्तृत शास्त्र, गोत्र व इतिहास देखें।' : 'Click any lineage to explore scriptures, gotras, and tools.'}
                </p>
              </div>

              <button
                onClick={() => handleOpenShilpVansha()}
                className="text-xs font-bold text-amber-900 hover:text-amber-800 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
              >
                <span>{isHi ? 'पंचपुत्र शिल्प वंश विस्तृत पृष्ठ खोलें' : 'Open Shilp Lineages Page'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {VISHWAKARMA_FIVE_SONS.map((son, index) => (
                <div
                  key={index}
                  onClick={() => handleOpenShilpVansha(son.id)}
                  className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs hover:border-amber-400 hover:shadow-sm transition-all flex flex-col justify-between cursor-pointer group"
                >
                  <div>
                    <div className="text-xs font-mono text-amber-800 font-bold mb-1">
                      0{index + 1}.
                    </div>
                    <h4 className="font-bold text-stone-900 text-sm group-hover:text-amber-900 transition-colors">
                      {son.nameHi}
                    </h4>
                    <div className="text-xs font-semibold text-amber-900 mt-1 mb-2">
                      {son.craftHi}
                    </div>
                    <p className="text-xs text-stone-600 font-hindi leading-relaxed line-clamp-3">
                      {son.descHi}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                    <span>{son.symbol}</span>
                    <span className="text-amber-800 font-semibold group-hover:translate-x-0.5 transition-transform">विवरण →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Historic Mythological Masterpieces with Details Link */}
          <div className="bg-amber-950 text-amber-50 rounded-2xl p-6 sm:p-8 border border-amber-900 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-amber-200">
                  {isHi ? 'देवशिल्पी की अमर पौराणिक रचनाएं एवं कथाएं' : 'Legendary Architectural Creations & Stories'}
                </h3>
                <p className="text-xs sm:text-sm text-amber-100/80 mt-1 max-w-2xl leading-relaxed">
                  {isHi
                    ? 'प्रत्येक रचना पर क्लिक कर उसका संपूर्ण पौराणिक आख्यान, संस्कृत श्लोक एवं गुप्त वास्तुकला रहस्य पढ़ें:'
                    : 'Click any creation to open its dedicated narrative, shlokas, and architectural secrets:'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {MYTHOLOGICAL_CREATIONS.map((creation) => (
                <div
                  key={creation.id}
                  className="bg-amber-900/40 p-5 rounded-xl border border-amber-800/60 hover:border-amber-400 transition-colors flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold text-amber-300/80 uppercase">
                      संरक्षक: {creation.patronDeity}
                    </span>
                    <h4 className="font-bold text-amber-200 text-base leading-snug">
                      {creation.titleHi.split('(')[0].trim()}
                    </h4>
                    <p className="text-xs text-amber-100/90 leading-relaxed font-hindi line-clamp-3">
                      {creation.shortSummaryHi}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-amber-800/60 flex items-center justify-between">
                    <button
                      onClick={() => handleOpenCreationDetail(creation.id)}
                      className="text-xs font-bold text-amber-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{isHi ? 'विस्तृत कथा व रहस्य पढ़ें' : 'Read Full Details'}</span>
                    </button>
                    <ChevronRight className="w-4 h-4 text-amber-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dedicated Section for Vishwakarma Purana & Sacred Books (धर्मग्रन्थ एवं A4 PDF डाउनलोड) */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
                  <Scroll className="w-4 h-4 text-amber-700" />
                  <span>वैदिक एवं पौराणिक वाङ्मय संग्रह</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-stone-900">
                  {isHi ? 'श्री विश्वकर्मा पुराण एवं समस्त प्रामाणिक धर्मग्रन्थ' : 'Sacred Vishwakarma Purana & Vedic Treatises'}
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 font-hindi mt-1 max-w-3xl leading-relaxed">
                  {isHi
                    ? 'सनातन वास्तुकला, ब्रह्मांड विज्ञान, धातुकर्म एवं शिल्पकला के वे अमूल्य ग्रन्थ जो हमारे गौरवशाली इतिहास और वैज्ञानिक ज्ञान के अकाट्य प्रमाण हैं। किसी भी ग्रन्थ का अध्ययन करें एवं निःशुल्क A4 साइज PDF प्राप्त करें:'
                    : 'The authentic scriptural authorities of ancient Indian engineering, cosmology, and Vedic architecture. Read details or download official A4 study manuals:'}
                </p>
              </div>

              <button
                onClick={() => handleOpenScripture('vishwakarma-purana')}
                className="px-4 py-2 bg-amber-900 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto shrink-0 shadow-xs"
              >
                <BookOpen className="w-4 h-4" />
                <span>{isHi ? 'सम्पूर्ण ग्रन्थ संग्रहालय खोलें' : 'Open All Scriptures'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {SACRED_SCRIPTURES.map((sc) => (
                <div
                  key={sc.id}
                  className="bg-stone-50/70 border border-stone-200/90 rounded-xl p-5 hover:border-amber-400 hover:bg-white transition-all flex flex-col justify-between space-y-4 shadow-2xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded uppercase tracking-wider">
                        {sc.category}
                      </span>
                      <span className="text-[11px] font-mono text-stone-500">
                        {sc.totalChapters} अध्याय · {sc.totalShlokas}
                      </span>
                    </div>

                    <h4 className="font-bold text-stone-900 text-base font-display">
                      {sc.titleHi.split('(')[0].trim()}
                    </h4>

                    <div className="text-[11px] text-amber-900 font-medium font-hindi">
                      प्रणेता: {sc.originalAuthor}
                    </div>

                    <p className="text-xs text-stone-600 font-hindi leading-relaxed line-clamp-3">
                      {sc.summaryHi}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-200/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleOpenScripture(sc.id)}
                      className="text-xs font-bold text-amber-900 hover:text-amber-800 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{isHi ? 'गहन अध्ययन' : 'Study Text'}</span>
                    </button>

                    <button
                      onClick={() => handleOpenScripture(sc.id)}
                      className="px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-800" />
                      <span>{isHi ? 'A4 PDF' : 'A4 PDF'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Temples & Dharamshalas Directory + In-list Option */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-stone-900 font-display flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-800" />
                  <span>{isHi ? 'प्रमुख विश्वकर्मा मंदिर व समाज धर्मशालाएं' : 'Sacred Temples & Pilgrim Dharamshalas'}</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {isHi
                    ? 'तीर्थ यात्रा पर जाने वाले समाज बंधुओं के लिए सुगम आवास, भोजन एवं दर्शन विवरण।'
                    : 'Verified accommodation and daily pooja details for visiting community families.'}
                </p>
              </div>

              {/* Inlist Action Button */}
              <button
                onClick={() => setShowInlistModal(true)}
                className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isHi ? 'नया मंदिर या धर्मशाला इनलिस्ट करें' : 'In-list Temple / Dharamshala'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {templesList.map((temple) => (
                <div
                  key={temple.id}
                  className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs hover:border-amber-300 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 bg-stone-100">
                      <img
                        src={temple.image}
                        alt={temple.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-stone-900/80 text-white text-[11px] px-2 py-0.5 rounded font-mono flex items-center gap-1">
                        <Bed className="w-3 h-3 text-amber-300" />
                        <span>{temple.dharamshalaRooms} कक्ष उपलब्ध</span>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <h4 className="font-bold text-stone-900 text-base leading-snug">
                        {temple.name}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs text-stone-500">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span>{temple.location}, {temple.state}</span>
                      </div>

                      <p className="text-xs text-stone-600 font-hindi leading-relaxed line-clamp-3">
                        {temple.description}
                      </p>

                      <div className="pt-2">
                        <div className="text-[11px] text-stone-400 font-medium uppercase mb-1">
                          {isHi ? 'उपलब्ध सुविधाएं:' : 'Facilities:'}
                        </div>
                        <div className="flex flex-wrap gap-1 text-[11px] text-stone-600">
                          {temple.facilities.map((fac, i) => (
                            <span key={i} className="bg-stone-50 border border-stone-200 px-2 py-0.5 rounded">
                              {fac}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-xs text-stone-500 pt-1 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span className="truncate">{temple.dailyTimings}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center gap-2">
                    <a
                      href={`tel:${temple.contact.split('/')[0].trim()}`}
                      className="flex-1 py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-200 hover:bg-stone-100 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{isHi ? 'सीधा फोन' : 'Call'}</span>
                    </a>
                    <button
                      onClick={() => setSelectedTempleForBooking(temple)}
                      className="flex-1 py-2 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-lg transition-colors cursor-pointer"
                    >
                      {isHi ? 'कमरा अग्रिम निवेदन' : 'Book Room'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 1: IN-LIST NEW TEMPLE / DHARAMSHALA (मंदिर इनलिस्ट फॉर्म) */}
      {/* ============================================================ */}
      {showInlistModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4">
              <div>
                <h3 className="text-lg font-bold text-stone-900 font-display">
                  {isHi ? 'विश्वकर्मा मंदिर / धर्मशाला इनलिस्ट करें' : 'In-list Temple / Dharamshala'}
                </h3>
                <p className="text-xs text-stone-500">
                  {isHi ? 'अपने नगर के समाज मंदिर या विश्राम गृह की प्रविष्टि दर्ज करें।' : 'Add your regional community temple or pilgrim guest house.'}
                </p>
              </div>
              <button
                onClick={() => setShowInlistModal(false)}
                className="text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {inlistSuccess ? (
              <div className="p-6 bg-emerald-50 text-emerald-800 rounded-lg text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-base">{isHi ? 'मंदिर / धर्मशाला सफलतापूर्वक इनलिस्ट हो गई!' : 'In-listed Successfully!'}</h4>
                <p className="text-xs text-stone-600">यह प्रविष्टि अब तीर्थ व मंदिर निर्देशिका में दिखाई दे रही है।</p>
              </div>
            ) : (
              <form onSubmit={handleInlistSubmit} className="space-y-3.5">
                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1">
                    {isHi ? 'मंदिर / धर्मशाला का नाम *' : 'Name of Temple / Dharamshala *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newTempleForm.name}
                    onChange={(e) => setNewTempleForm({ ...newTempleForm, name: e.target.value })}
                    placeholder="उदा. श्री विश्वकर्मा मंदिर व धर्मशाला, उज्जैन"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-stone-700 block mb-1">
                      {isHi ? 'स्थान / पता *' : 'Address / City *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={newTempleForm.location}
                      onChange={(e) => setNewTempleForm({ ...newTempleForm, location: e.target.value })}
                      placeholder="उदा. रामघाट मार्ग, उज्जैन"
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
                      value={newTempleForm.state}
                      onChange={(e) => setNewTempleForm({ ...newTempleForm, state: e.target.value })}
                      placeholder="उदा. मध्य प्रदेश"
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1">
                    {isHi ? 'संक्षिप्त परिचय व ऐतिहासिक महत्व' : 'Description'}
                  </label>
                  <textarea
                    rows={2}
                    value={newTempleForm.description}
                    onChange={(e) => setNewTempleForm({ ...newTempleForm, description: e.target.value })}
                    placeholder="मंदिर के निर्माण, उत्सवों एवं यात्रियों के लिए व्यवस्था का विवरण..."
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs font-hindi"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-stone-700 block mb-1">
                      {isHi ? 'उपलब्ध कमरों की संख्या' : 'No. of Rooms'}
                    </label>
                    <input
                      type="number"
                      value={newTempleForm.dharamshalaRooms}
                      onChange={(e) => setNewTempleForm({ ...newTempleForm, dharamshalaRooms: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-stone-700 block mb-1">
                      {isHi ? 'दर्शन व आरती समय' : 'Daily Timings'}
                    </label>
                    <input
                      type="text"
                      value={newTempleForm.dailyTimings}
                      onChange={(e) => setNewTempleForm({ ...newTempleForm, dailyTimings: e.target.value })}
                      placeholder="प्रातः 05:30 से रात्रि 09:30 तक"
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1">
                    {isHi ? 'व्यवस्थापक / कार्यालय फोन नंबर *' : 'Contact Phone *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={newTempleForm.contact}
                    onChange={(e) => setNewTempleForm({ ...newTempleForm, contact: e.target.value })}
                    placeholder="+91 98290 00000"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1">
                    {isHi ? 'मंदिर / धर्मशाला फोटो लिंक' : 'Photo URL'}
                  </label>
                  <input
                    type="url"
                    value={newTempleForm.image}
                    onChange={(e) => setNewTempleForm({ ...newTempleForm, image: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                  />
                </div>

                <div className="flex gap-2 pt-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setShowInlistModal(false)}
                    className="flex-1 py-2 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg cursor-pointer"
                  >
                    {isHi ? 'रद्द करें' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-lg transition-colors cursor-pointer"
                  >
                    {isHi ? 'निर्देशिका में इनलिस्ट करें' : 'Submit In-listing'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: ROOM RESERVATION (कमरा आरक्षण फॉर्म) */}
      {/* ============================================================ */}
      {selectedTempleForBooking && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-stone-200">
            <h3 className="text-base font-bold text-stone-900 mb-1">
              {isHi ? 'धर्मशाला कक्ष आरक्षण निवेदन' : 'Dharamshala Room Booking Request'}
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              {selectedTempleForBooking.name}
            </p>

            {bookingSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-medium text-center space-y-1">
                <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto" />
                <div>{isHi ? 'कक्ष आरक्षण निवेदन प्राप्त हुआ!' : 'Request submitted successfully!'}</div>
                <div className="text-[11px] text-stone-500">मंदिर व्यवस्थापक शीघ्र आपके नंबर पर पुष्टि करेंगे।</div>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1">
                    {isHi ? 'यात्री का नाम' : 'Pilgrim Name'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. कैलाश शर्मा"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-stone-700 block mb-1">
                      {isHi ? 'आगमन तिथि' : 'Check-in Date'}
                    </label>
                    <input
                      type="date"
                      required
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-stone-700 block mb-1">
                      {isHi ? 'यात्रियों की संख्या' : 'No. of Persons'}
                    </label>
                    <input
                      type="number"
                      defaultValue={2}
                      min={1}
                      max={15}
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1">
                    {isHi ? 'संपर्क फोन / व्हाट्सएप' : 'Phone / WhatsApp'}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 00000"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTempleForBooking(null)}
                    className="flex-1 py-2 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg cursor-pointer"
                  >
                    {isHi ? 'रद्द करें' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-lg cursor-pointer"
                  >
                    {isHi ? 'आरक्षण निवेदन भेजें' : 'Send Booking Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
