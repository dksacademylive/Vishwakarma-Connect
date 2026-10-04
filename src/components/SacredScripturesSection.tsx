import React, { useState, useRef, useMemo } from 'react';
import { jsPDF } from 'jspdf';
import { Language } from '../types';
import { SACRED_SCRIPTURES, SacredScripture, ScriptureSection } from '../data/scripturesData';
import { INDIA_STATES_AND_DISTRICTS } from '../data/indiaLocations';
import { 
  BookOpen, 
  Download, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle, 
  FileText, 
  ShieldCheck, 
  Compass, 
  BookMarked,
  Scroll,
  X,
  Upload,
  Image as ImageIcon,
  ExternalLink,
  Book,
  Check
} from 'lucide-react';

interface SacredScripturesSectionProps {
  lang: Language;
  onBackToHeritage: () => void;
  initialScriptureId?: string;
}

export const SacredScripturesSection: React.FC<SacredScripturesSectionProps> = ({
  lang,
  onBackToHeritage,
  initialScriptureId,
}) => {
  const isHi = lang === 'hi';
  const [selectedScriptureId, setSelectedScriptureId] = useState<string>(
    initialScriptureId || 'vishwakarma-purana'
  );
  const [showMembershipModal, setShowMembershipModal] = useState<boolean>(false);
  const [scriptureToDownload, setScriptureToDownload] = useState<SacredScripture | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [generatedMemberId, setGeneratedMemberId] = useState<string>('');
  
  // State for Archive.org instructions modal (Signup, Login and Read Direct)
  const [archiveNoticeData, setArchiveNoticeData] = useState<{
    scripture: SacredScripture;
    linkOpened?: boolean;
  } | null>(null);

  const handleOpenArchiveWithNotice = (scripture: SacredScripture) => {
    // Show instruction popup first before navigating to Archive
    setArchiveNoticeData({ scripture, linkOpened: false });
  };

  const handleProceedToArchive = (url: string) => {
    if (url) {
      try {
        window.open(url, '_blank', 'noopener,noreferrer');
      } catch (e) {
        console.error('Could not open window:', e);
      }
      if (archiveNoticeData) {
        setArchiveNoticeData({ ...archiveNoticeData, linkOpened: true });
      }
    }
  };

  // Default to Maharashtra & Palghar (from user context)
  const defaultState = 'Maharashtra';
  const defaultDistrict = 'Palghar (पालघर)';

  // Membership & Document Upload Form State
  const [memberForm, setMemberForm] = useState({
    fullName: '',
    fatherOrHusbandName: '',
    mobile: '',
    email: '',
    subcaste: 'जांगिड़ (सुथार)',
    gotra: '',
    state: defaultState,
    city: defaultDistrict,
    customDistrict: '',
    profession: 'काष्ठशिल्प व वास्तुकला',
    address: '',
    documentType: 'आधार कार्ड / पहचान पत्र',
    photoDataUrl: '',
    photoFileName: '',
    acceptedTerms: true,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeScripture =
    SACRED_SCRIPTURES.find((s) => s.id === selectedScriptureId) || SACRED_SCRIPTURES[0];

  // Current districts for selected state
  const currentDistricts = useMemo(() => {
    const found = INDIA_STATES_AND_DISTRICTS.find((s) => s.state === memberForm.state);
    return found ? found.districts : ['Other / अन्य'];
  }, [memberForm.state]);

  const handleOpenDownloadModal = (scripture: SacredScripture) => {
    setScriptureToDownload(scripture);
    setShowMembershipModal(true);
    setDownloadSuccess(false);
  };

  // Handle Photo/Document upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert(isHi ? 'कृपया 5MB से छोटी फाइल चुनें।' : 'Please choose a file smaller than 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setMemberForm((prev) => ({
          ...prev,
          photoDataUrl: uploadEvent.target?.result as string,
          photoFileName: file.name,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Canvas helper for text wrapping
  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number
  ): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      const testLine = currentLine ? currentLine + ' ' + words[i] : words[i];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = words[i];
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
    return lines;
  };

  // High-Resolution A4 Canvas-to-PDF Generator with embedded photo and clickable Complete Book Archive link
  const handleMembershipSubmitAndDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberForm.fullName || !memberForm.mobile || !scriptureToDownload) return;

    setIsGeneratingPdf(true);

    const memberId = `VK-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    setGeneratedMemberId(memberId);

    const finalDistrictName = memberForm.customDistrict
      ? `${memberForm.customDistrict} (${memberForm.city})`
      : memberForm.city;

    try {
      // Create high-res A4 canvas (1240 x 1754 px @ 150 DPI)
      const canvas = document.createElement('canvas');
      const width = 1240;
      const height = 1754;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error('Canvas 2D context unavailable');

      // 1. Clean Parchment Background
      ctx.fillStyle = '#FFFCF5';
      ctx.fillRect(0, 0, width, height);

      // 2. Ornate Vedic Double Borders
      const margin = 50;
      ctx.strokeStyle = '#9A3412'; // rust-amber
      ctx.lineWidth = 6;
      ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);

      ctx.strokeStyle = '#D97706'; // warm gold
      ctx.lineWidth = 2;
      ctx.strokeRect(margin + 8, margin + 8, width - (margin + 8) * 2, height - (margin + 8) * 2);

      // Corner geometric ornaments
      const corners = [
        [margin + 8, margin + 8],
        [width - margin - 8, margin + 8],
        [margin + 8, height - margin - 8],
        [width - margin - 8, height - margin - 8],
      ];
      ctx.fillStyle = '#9A3412';
      corners.forEach(([cx, cy]) => {
        ctx.beginPath();
        ctx.arc(cx, cy, 10, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Royal Header Banner
      const headerTop = margin + 18;
      const headerHeight = 145;
      const grad = ctx.createLinearGradient(margin + 10, headerTop, width - margin - 10, headerTop);
      grad.addColorStop(0, '#431407');
      grad.addColorStop(0.5, '#78350F');
      grad.addColorStop(1, '#431407');
      ctx.fillStyle = grad;
      ctx.fillRect(margin + 10, headerTop, width - margin * 2 - 20, headerHeight);

      // Header Golden Line
      ctx.strokeStyle = '#FCD34D';
      ctx.lineWidth = 3;
      ctx.strokeRect(margin + 14, headerTop + 4, width - margin * 2 - 28, headerHeight - 8);

      // Header Inscriptions
      ctx.textAlign = 'center';
      ctx.fillStyle = '#FEF08A';
      ctx.font = 'bold 22px "Tiro Devanagari Hindi", serif, system-ui';
      ctx.fillText('॥ ॐ श्री विश्वकर्मणे नमः ॥  शिल्पं सर्वकर्मसु कुशलम्', width / 2, headerTop + 36);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 36px "Rozha One", "Tiro Devanagari Hindi", serif';
      ctx.fillText('अखिल भारतीय विश्वकर्मा समाज महासंघ', width / 2, headerTop + 82);

      ctx.fillStyle = '#FDE68A';
      ctx.font = '19px "Tiro Devanagari Hindi", sans-serif';
      ctx.fillText('राष्ट्रीय वैदिक ग्रन्थ अध्ययन एवं प्रामाणिक शोध संस्थान', width / 2, headerTop + 120);

      let currentY = headerTop + headerHeight + 35;

      // 4. Scripture Title Block
      ctx.textAlign = 'center';
      ctx.fillStyle = '#78350F';
      ctx.font = 'bold 32px "Rozha One", "Tiro Devanagari Hindi", serif';
      ctx.fillText(scriptureToDownload.titleHi, width / 2, currentY);

      currentY += 28;
      ctx.fillStyle = '#4B5563';
      ctx.font = 'italic 18px serif';
      ctx.fillText(scriptureToDownload.titleEn, width / 2, currentY);

      currentY += 28;
      ctx.fillStyle = '#B45309';
      ctx.font = 'bold 18px "Tiro Devanagari Hindi", sans-serif';
      ctx.fillText(
        `वैदिक संदर्भ: ${scriptureToDownload.vedicReference}  |  अध्याय: ${scriptureToDownload.totalChapters}  |  ${scriptureToDownload.totalShlokas}`,
        width / 2,
        currentY
      );

      currentY += 35;

      // 5. Official Member Certification Badge (समाज सदस्यता प्रमाण पत्र)
      const memberBoxHeight = 160;
      ctx.fillStyle = '#FFFBEB';
      ctx.fillRect(margin + 20, currentY, width - margin * 2 - 40, memberBoxHeight);
      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(margin + 20, currentY, width - margin * 2 - 40, memberBoxHeight);

      // Ribbon for member box
      ctx.fillStyle = '#9A3412';
      ctx.fillRect(margin + 20, currentY, 260, 32);
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'left';
      ctx.font = 'bold 16px "Tiro Devanagari Hindi", sans-serif';
      ctx.fillText('  आधिकारिक पंजीकृत सदस्य', margin + 25, currentY + 22);

      // Draw photo if provided
      const textStartX = margin + 45;
      if (memberForm.photoDataUrl) {
        try {
          const img = new Image();
          img.src = memberForm.photoDataUrl;
          await new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
          ctx.drawImage(img, width - margin - 150, currentY + 15, 110, 130);
          ctx.strokeStyle = '#B45309';
          ctx.lineWidth = 2;
          ctx.strokeRect(width - margin - 150, currentY + 15, 110, 130);
        } catch {
          // fallback ignore image load failure
        }
      }

      ctx.fillStyle = '#1F2937';
      ctx.font = 'bold 20px "Tiro Devanagari Hindi", sans-serif';
      ctx.fillText(`सदस्य का नाम: ${memberForm.fullName}`, textStartX, currentY + 62);

      ctx.font = '17px "Tiro Devanagari Hindi", sans-serif';
      ctx.fillStyle = '#374151';
      ctx.fillText(
        `पिता/पति: ${memberForm.fatherOrHusbandName || 'श्री विश्वकर्मा साधक'}  |  शाखा: ${memberForm.subcaste}`,
        textStartX,
        currentY + 92
      );
      ctx.fillText(
        `स्वगोत्र: ${memberForm.gotra || 'वैदिक गोत्र'}  |  जिला/स्थान: ${finalDistrictName}, ${memberForm.state}  |  मोबाइल: ${memberForm.mobile}`,
        textStartX,
        currentY + 120
      );
      ctx.fillText(
        `सदस्यता क्रमांक: ${memberId}  |  प्रमाणन दिनांक: ${new Date().toLocaleDateString('hi-IN')}`,
        textStartX,
        currentY + 146
      );

      currentY += memberBoxHeight + 35;

      // 6. Section 1: Overview & Cosmic Significance
      ctx.textAlign = 'left';
      ctx.fillStyle = '#78350F';
      ctx.font = 'bold 22px "Rozha One", "Tiro Devanagari Hindi", serif';
      ctx.fillText('१. ग्रन्थ परिचय एवं सनातन ब्रह्मांडीय महत्व (Cosmogony & Significance)', margin + 20, currentY);

      currentY += 28;
      ctx.fillStyle = '#374151';
      ctx.font = '17px "Tiro Devanagari Hindi", sans-serif';
      const summaryLines = wrapText(
        ctx,
        `${scriptureToDownload.summaryHi} ${scriptureToDownload.profoundSignificance}`,
        width - margin * 2 - 40
      );
      summaryLines.slice(0, 4).forEach((line) => {
        ctx.fillText(line, margin + 25, currentY);
        currentY += 25;
      });

      currentY += 15;

      // 7. Section 2: Core Philosophical Pillars
      ctx.fillStyle = '#78350F';
      ctx.font = 'bold 22px "Rozha One", "Tiro Devanagari Hindi", serif';
      ctx.fillText('२. ग्रन्थ के मूल दार्शनिक आधार (Core Philosophical Pillars)', margin + 20, currentY);

      currentY += 28;
      ctx.font = '16px "Tiro Devanagari Hindi", sans-serif';
      ctx.fillStyle = '#1F2937';
      scriptureToDownload.philosophicalInsights.slice(0, 3).forEach((ins) => {
        const insLines = wrapText(ctx, `• ${ins}`, width - margin * 2 - 40);
        insLines.forEach((line) => {
          ctx.fillText(line, margin + 25, currentY);
          currentY += 24;
        });
      });

      currentY += 15;

      // 8. Section 3: Primary Vedic Shlokas & Engineering Application
      ctx.fillStyle = '#78350F';
      ctx.font = 'bold 22px "Rozha One", "Tiro Devanagari Hindi", serif';
      ctx.fillText('३. शास्त्रीय सूत्र, मूल श्लोक एवं स्थापत्य प्रयोग (Sutras & Architecture)', margin + 20, currentY);

      currentY += 26;

      const firstSec = scriptureToDownload.majorSections[0];
      if (firstSec) {
        // Shloka box
        ctx.fillStyle = '#FEF3C7';
        ctx.fillRect(margin + 20, currentY, width - margin * 2 - 40, 120);
        ctx.strokeStyle = '#D97706';
        ctx.lineWidth = 1;
        ctx.strokeRect(margin + 20, currentY, width - margin * 2 - 40, 120);

        ctx.fillStyle = '#9A3412';
        ctx.font = 'bold 16px "Tiro Devanagari Hindi", sans-serif';
        ctx.fillText(`मूल श्लोक (${firstSec.title.split(':')[0]}):`, margin + 35, currentY + 28);

        ctx.fillStyle = '#111827';
        ctx.font = 'italic bold 17px "Tiro Devanagari Hindi", serif';
        const shlokaLines = wrapText(ctx, `"${firstSec.coreShloka}"`, width - margin * 2 - 70);
        shlokaLines.slice(0, 2).forEach((sLine, idx) => {
          ctx.fillText(sLine, margin + 35, currentY + 54 + idx * 22);
        });

        ctx.fillStyle = '#374151';
        ctx.font = '15px "Tiro Devanagari Hindi", sans-serif';
        const meaningLines = wrapText(ctx, `अर्थ: ${firstSec.shlokaMeaning}`, width - margin * 2 - 70);
        meaningLines.slice(0, 2).forEach((mLine, idx) => {
          ctx.fillText(mLine, margin + 35, currentY + 80 + idx * 20);
        });

        currentY += 135;

        ctx.fillStyle = '#065F46';
        ctx.font = 'bold 16px "Tiro Devanagari Hindi", sans-serif';
        ctx.fillText(`व्यावहारिक स्थापत्य व शिल्प प्रयोग: ${firstSec.practicalApplication}`, margin + 25, currentY);
      }

      currentY += 25;

      // 9. COMPLETE ORIGINAL CANONICAL E-BOOK ARCHIVE BOX (संपूर्ण मूल ग्रन्थ ई-बुक लाइब्रेरी लिंक)
      const archiveBoxY = currentY;
      const archiveBoxHeight = 120;
      ctx.fillStyle = '#FFF7ED'; // light warm amber/orange
      ctx.fillRect(margin + 20, archiveBoxY, width - margin * 2 - 40, archiveBoxHeight);
      ctx.strokeStyle = '#C2410C'; // deep orange-rust border
      ctx.lineWidth = 2;
      ctx.strokeRect(margin + 20, archiveBoxY, width - margin * 2 - 40, archiveBoxHeight);

      // Archive header tag
      ctx.fillStyle = '#9A3412';
      ctx.fillRect(margin + 20, archiveBoxY, 380, 30);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 15px "Tiro Devanagari Hindi", sans-serif';
      ctx.fillText('  📖 सम्पूर्ण मूल ग्रन्थ डिजिटल ई-पुस्तकालय (E-Book Archive)', margin + 25, archiveBoxY + 21);

      ctx.fillStyle = '#7C2D12';
      ctx.font = 'bold 17px "Tiro Devanagari Hindi", sans-serif';
      ctx.fillText(
        `मूल ग्रन्थ: ${scriptureToDownload.fullBookSourceTitle} (${scriptureToDownload.totalArchivePages})`,
        margin + 35,
        archiveBoxY + 56
      );

      ctx.fillStyle = '#374151';
      ctx.font = '15px "Tiro Devanagari Hindi", sans-serif';
      ctx.fillText(
        `डिजिटल लाइब्रेरी आर्काइव स्रोत: ${scriptureToDownload.archiveLibraryName}`,
        margin + 35,
        archiveBoxY + 80
      );

      ctx.fillStyle = '#1D4ED8';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText(
        `🌐 [क्लिक करें / Click to Read Full Book]: ${scriptureToDownload.fullBookArchiveUrl}`,
        margin + 35,
        archiveBoxY + 104
      );

      // 10. Bottom Authentication Seal & Signature Bar
      const footerY = height - margin - 50;
      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(margin + 20, footerY);
      ctx.lineTo(width - margin - 20, footerY);
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.fillStyle = '#78350F';
      ctx.font = 'bold 15px "Tiro Devanagari Hindi", sans-serif';
      ctx.fillText(
        'प्रमाणित शोध संस्करण  *  अखिल भारतीय विश्वकर्मा समाज महासंघ (पंजीकृत)  *  सर्वाधिकार सुरक्षित २०२६',
        width / 2,
        footerY + 24
      );

      ctx.fillStyle = '#6B7280';
      ctx.font = '13px "Tiro Devanagari Hindi", sans-serif';
      ctx.fillText(
        `ई-बुक अभिलेख क्रमांक: ${memberId}  |  इस प्रमाण पत्र में सम्पूर्ण मूल ग्रन्थ का डिजिटल ई-बुक लिंक संलग्न है।`,
        width / 2,
        footerY + 44
      );

      // Now create PDF from Canvas
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);

      // Add clickable hyperlink annotation on the PDF over the complete book archive box!
      const scaleX = 210 / width;
      const scaleY = 297 / height;
      const linkX = (margin + 20) * scaleX;
      const linkY = archiveBoxY * scaleY;
      const linkW = (width - margin * 2 - 40) * scaleX;
      const linkH = archiveBoxHeight * scaleY;

      pdf.link(linkX, linkY, linkW, linkH, { url: scriptureToDownload.fullBookArchiveUrl });

      pdf.save(scriptureToDownload.downloadFileName);

      setDownloadSuccess(true);
    } catch (err) {
      console.error('Error rendering A4 PDF:', err);
      alert('पीडीएफ निर्माण में त्रुटि हुई। कृपया पुनः प्रयास करें।');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Navigation Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
        <button
          onClick={onBackToHeritage}
          className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-amber-900 hover:text-amber-800 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>{isHi ? '← वापस मुख्य तीर्थ व इतिहास पर जाएं' : '← Return to Heritage & Temples'}</span>
        </button>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          <span className="text-xs text-stone-500 font-semibold shrink-0">
            {isHi ? 'धर्मग्रन्थ अध्ययन चुनें:' : 'Select Scripture:'}
          </span>
          {SACRED_SCRIPTURES.map((sc) => (
            <button
              key={sc.id}
              onClick={() => setSelectedScriptureId(sc.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                sc.id === selectedScriptureId
                  ? 'bg-amber-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {sc.titleHi.split('(')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Scripture Hero Banner with direct Full Book Link */}
      <div className="bg-gradient-to-br from-amber-950 via-stone-900 to-amber-950 text-white rounded-2xl p-6 sm:p-10 border border-amber-900 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-amber-400">
            <Scroll className="w-4 h-4" />
            <span>सनातन प्रामाणिक ग्रन्थ अध्ययन</span>
            <span aria-hidden="true">·</span>
            <span>अध्याय संख्या: {activeScripture.totalChapters}</span>
            <span aria-hidden="true">·</span>
            <span>{activeScripture.totalShlokas}</span>
            <span aria-hidden="true">·</span>
            <span className="bg-amber-900/80 px-2 py-0.5 rounded text-amber-200">{activeScripture.totalArchivePages}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold font-display text-white text-balance leading-tight">
            {activeScripture.titleHi}
          </h2>

          <p className="text-xs sm:text-sm text-amber-200/90 font-serif italic">
            {activeScripture.titleEn}
          </p>

          <p className="text-sm sm:text-base text-stone-300 font-hindi leading-relaxed">
            {activeScripture.summaryHi}
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs text-amber-300">
            <div>
              <span className="text-stone-400">आदि प्रणेता:</span>{' '}
              <strong className="text-white">{activeScripture.originalAuthor}</strong>
            </div>
            <div>
              <span className="text-stone-400">वैदिक संदर्भ:</span>{' '}
              <strong className="text-white">{activeScripture.vedicReference}</strong>
            </div>
          </div>

          {/* Direct Link to Full Book in Hero */}
          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleOpenDownloadModal(activeScripture)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>{isHi ? 'A4 ई-बुक व प्रमाण पत्र डाउनलोड' : 'Download A4 E-Book'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenArchiveWithNotice(activeScripture)}
              className="px-4 py-2 bg-amber-900/60 hover:bg-amber-900 border border-amber-600/60 text-amber-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Book className="w-4 h-4 text-amber-400" />
              <span>{isHi ? `सम्पूर्ण मूल ग्रन्थ ऑनलाइन पढ़ें (${activeScripture.totalArchivePages})` : 'Read Full Original E-Book'}</span>
              <ExternalLink className="w-3 h-3 text-amber-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Profound Philosophical & Scientific Significance */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 sm:p-8 space-y-5 shadow-xs">
        <div className="flex items-center gap-2 text-amber-900 font-display font-bold text-lg sm:text-xl border-b border-stone-100 pb-3">
          <BookMarked className="w-5 h-5 text-amber-700" />
          <span>{isHi ? 'अतिगम्भीर शास्त्रीय एवं दार्शनिक विश्लेषण' : 'Deep Philosophical Analysis'}</span>
        </div>

        <p className="text-stone-700 font-hindi leading-relaxed text-sm sm:text-base">
          {activeScripture.profoundSignificance}
        </p>

        {/* Philosophical Pillars Grid */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800">
            {isHi ? 'ग्रन्थ के प्रमुख दार्शनिक स्तम्भ व प्रमाण:' : 'Key Philosophical Pillars & Proofs:'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeScripture.philosophicalInsights.map((insight, idx) => (
              <div
                key={idx}
                className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 text-xs sm:text-sm text-stone-800 font-hindi leading-relaxed flex items-start gap-2.5"
              >
                <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>{insight}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-stone-600 font-hindi pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>हस्तलिखित प्रतियां एवं संग्रहालय:</strong> {activeScripture.historicalManuscripts}
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleOpenArchiveWithNotice(activeScripture)}
            className="text-amber-800 hover:text-amber-900 font-bold flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>{isHi ? 'आर्काइव ई-पुस्तकालय स्रोत' : 'Archive Source'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Chapters & Classical Sanskrit Shlokas */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <h3 className="text-lg sm:text-xl font-bold font-display text-stone-900 flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-700" />
            <span>{isHi ? 'अध्याय-वार प्रामाणिक सूत्र एवं श्लोक' : 'Chapter Canonical Verses'}</span>
          </h3>
          <span className="text-xs text-stone-500 font-medium">
            {activeScripture.majorSections.length} {isHi ? 'प्रमुख खंड' : 'Major Sections'}
          </span>
        </div>

        <div className="space-y-6">
          {activeScripture.majorSections.map((sec: ScriptureSection, idx: number) => (
            <div
              key={idx}
              className="border border-stone-200 rounded-xl p-5 sm:p-6 bg-white hover:border-amber-400 transition-colors space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <h4 className="text-base sm:text-lg font-bold text-stone-900 font-display">
                  {sec.title}
                </h4>
                <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md shrink-0">
                  अध्याय {sec.chapterNumber}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-stone-700 font-hindi leading-relaxed">
                {sec.description}
              </p>

              {/* Sanskrit Verse Box */}
              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
                <div className="text-[11px] font-bold text-amber-800 tracking-wider uppercase">
                  {isHi ? 'मूल शास्त्रीय श्लोक:' : 'Original Sanskrit Shloka:'}
                </div>
                <div className="text-sm font-hindi font-semibold text-stone-900 leading-relaxed italic">
                  "{sec.coreShloka}"
                </div>
                <div className="text-xs text-stone-600 font-hindi pt-1 border-t border-stone-200/80">
                  <strong className="text-stone-800">{isHi ? 'हिन्दी अर्थ: ' : 'Meaning: '}</strong>
                  {sec.shlokaMeaning}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50/70 p-3 rounded-lg border border-emerald-200">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-hindi">
                  <strong>{isHi ? 'व्यावहारिक स्थापत्य व शिल्प प्रयोग: ' : 'Practical Application: '}</strong>
                  {sec.practicalApplication}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prominent Bottom A4 PDF Download Button Box */}
      <div className="bg-amber-950 text-white rounded-2xl p-6 sm:p-10 border border-amber-900 text-center space-y-4 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <FileText className="w-12 h-12 text-amber-300 mx-auto" />
        <div className="max-w-xl mx-auto space-y-2">
          <h3 className="text-xl sm:text-3xl font-bold font-display text-amber-100">
            {isHi
              ? `${activeScripture.titleHi.split('(')[0]} सम्पूर्ण A4 PDF ई-बुक`
              : `Download Full ${activeScripture.titleEn} PDF`}
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 font-hindi leading-relaxed">
            {isHi
              ? 'इस पावन ग्रन्थ के सम्पूर्ण अध्यायों, श्लोकों, व्याख्याओं एवं वैदिक अनुसंधानों का प्रामाणिक A4 साइज पीडीएफ संस्करण निःशुल्क प्राप्त करें। इसमें सम्पूर्ण मूल ग्रन्थ का आर्काइव डिजिटल लिंक भी शामिल है।'
              : 'Click below to register for community membership and download the complete authenticated A4 study manual with full canonical e-book archive link.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => handleOpenDownloadModal(activeScripture)}
            className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-sm sm:text-base shadow-md transition-all inline-flex items-center gap-2 cursor-pointer transform hover:scale-[1.02]"
          >
            <Download className="w-5 h-5" />
            <span>{isHi ? 'सम्पूर्ण ग्रन्थ ई-बुक डाउनलोड करें (A4 PDF)' : 'Download Complete A4 PDF'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenArchiveWithNotice(activeScripture)}
            className="px-6 py-3.5 bg-stone-900/80 hover:bg-stone-900 border border-amber-500/50 text-amber-200 font-semibold rounded-xl text-sm inline-flex items-center gap-2 transition-colors cursor-pointer hover:border-amber-400"
          >
            <Book className="w-4 h-4 text-amber-400" />
            <span>{isHi ? 'सम्पूर्ण मूल ग्रन्थ ऑनलाइन पढ़ें' : 'Read Full Original E-Book'}</span>
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MEMBERSHIP JOINING & PDF DOWNLOAD MODAL (NON-CLIPPING FIXED HEADER/FOOTER) */}
      {/* ============================================================ */}
      {showMembershipModal && scriptureToDownload && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-start justify-center p-3 sm:p-5 md:p-6 overflow-y-auto">
          <div className="relative bg-white rounded-2xl max-w-xl w-full my-auto sm:my-4 shadow-2xl border border-stone-200 flex flex-col max-h-[92vh] overflow-hidden animate-fadeIn">
            {/* 1. Modal Sticky Top Header (NEVER CUT OFF) */}
            <div className="shrink-0 p-5 sm:p-6 pb-4 border-b border-stone-200 bg-stone-50/90 rounded-t-2xl flex items-start justify-between gap-3">
              <div>
                <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>अखिल भारतीय विश्वकर्मा समाज महासंघ</span>
                </div>
                <h3 className="text-lg sm:text-2xl font-bold text-stone-900 font-display">
                  {isHi ? 'समाज सदस्यता एवं A4 पीडीएफ पंजीकरण' : 'Samaj Membership & PDF Registration'}
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  {isHi
                    ? `ग्रन्थ: "${scriptureToDownload.titleHi.split('(')[0]}" - कृपया अपना विवरण दर्ज करें। सबमिट करते ही A4 पीडीएफ डाउनलोड हो जाएगी।`
                    : 'Fill details and submit to immediately trigger your official A4 PDF download.'}
                </p>
              </div>
              <button
                onClick={() => setShowMembershipModal(false)}
                className="text-stone-400 hover:text-stone-700 p-1.5 cursor-pointer rounded-lg hover:bg-stone-200 transition-colors shrink-0"
                title={isHi ? 'बंद करें' : 'Close'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2. Modal Body */}
            {downloadSuccess ? (
              <div className="p-6 sm:p-8 text-center space-y-4 overflow-y-auto flex-1">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h4 className="font-bold text-xl sm:text-2xl text-stone-900 font-display">
                  {isHi ? 'सदस्यता पंजीकरण पूर्ण! पीडीएफ डाउनलोड हो गया!' : 'Registration Complete! PDF Downloaded!'}
                </h4>

                <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-200 text-xs text-stone-800 text-left space-y-1.5 font-hindi max-w-md mx-auto">
                  <div><strong>सदस्य नाम:</strong> {memberForm.fullName}</div>
                  <div><strong>सदस्यता क्रमांक:</strong> {generatedMemberId}</div>
                  <div><strong>राज्य व जिला:</strong> {memberForm.city}, {memberForm.state}</div>
                  <div><strong>डाउनलोड फाइल:</strong> {scriptureToDownload.downloadFileName}</div>
                </div>

                {/* Direct link to read the full original book */}
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl text-left space-y-2 max-w-md mx-auto">
                  <div className="text-xs font-bold text-orange-950 flex items-center gap-1.5">
                    <Book className="w-4 h-4 text-orange-700" />
                    <span>सम्पूर्ण मूल ग्रन्थ ई-बुक आर्काइव लिंक:</span>
                  </div>
                  <p className="text-xs text-stone-700 font-hindi leading-relaxed">
                    आपके डाउनलोड किए गए PDF में भी इसका लिंक सक्रिय है। आप सीधे अभी ऑनलाइन भी पूरा ग्रन्थ पढ़ सकते हैं:
                  </p>
                  <button
                    type="button"
                    onClick={() => handleOpenArchiveWithNotice(scriptureToDownload)}
                    className="w-full py-2.5 px-3 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                  >
                    <span>📖 सम्पूर्ण मूल ग्रन्थ अभी पढ़ें ({scriptureToDownload.totalArchivePages})</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex gap-2 justify-center pt-2">
                  <button
                    onClick={() => setShowMembershipModal(false)}
                    className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-xs"
                  >
                    {isHi ? 'पूर्ण (पॉपअप बंद करें)' : 'Done (Close)'}
                  </button>
                  <button
                    onClick={(e) => handleMembershipSubmitAndDownload(e)}
                    className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isHi ? 'पुनः A4 PDF डाउनलोड करें' : 'Download PDF Again'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleMembershipSubmitAndDownload} className="flex flex-col flex-1 overflow-hidden">
                <div className="overflow-y-auto p-5 sm:p-6 space-y-4 flex-1 scrollbar-thin">
                  {/* Full Name */}
                  <div>
                    <label className="text-xs font-bold text-stone-800 block mb-1">
                      {isHi ? 'सदस्य का पूरा नाम *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={memberForm.fullName}
                      onChange={(e) => setMemberForm({ ...memberForm, fullName: e.target.value })}
                      placeholder="उदा. कैलाश शर्मा (जांगिड़)"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-semibold focus:outline-none focus:border-amber-700"
                    />
                  </div>

                  {/* Father Name & Subcaste */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-stone-700 block mb-1">
                        {isHi ? 'पिता / पति का नाम' : 'Father / Husband Name'}
                      </label>
                      <input
                        type="text"
                        value={memberForm.fatherOrHusbandName}
                        onChange={(e) => setMemberForm({ ...memberForm, fatherOrHusbandName: e.target.value })}
                        placeholder="श्री रामजी शर्मा"
                        className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-stone-700 block mb-1">
                        {isHi ? 'उपजाति / शाखा *' : 'Subcaste / Branch *'}
                      </label>
                      <select
                        value={memberForm.subcaste}
                        onChange={(e) => setMemberForm({ ...memberForm, subcaste: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs bg-white font-medium"
                      >
                        <option value="जांगिड़ (सुथार)">जांगिड़ (सुथार)</option>
                        <option value="पांचाल (लोहार/बढ़ई)">पांचाल (लोहार/बढ़ई)</option>
                        <option value="धीमान (शिल्पी)">धीमान (शिल्पी)</option>
                        <option value="गजधर / मिस्त्री">गजधर / मिस्त्री</option>
                        <option value="सोनी / स्वर्णकार">सोनी / स्वर्णकार</option>
                        <option value="कांस्यकार / ठठेरा">कांस्यकार / ठठेरा</option>
                        <option value="विश्वकर्मा अन्य शाखा">विश्वकर्मा अन्य शाखा</option>
                      </select>
                    </div>
                  </div>

                  {/* Gotra & Mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-stone-700 block mb-1">
                        {isHi ? 'स्वगोत्र' : 'Gotra'}
                      </label>
                      <input
                        type="text"
                        value={memberForm.gotra}
                        onChange={(e) => setMemberForm({ ...memberForm, gotra: e.target.value })}
                        placeholder="उदा. वत्स / भारद्वाज / अंगिरा"
                        className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-stone-700 block mb-1">
                        {isHi ? 'मोबाइल / व्हाट्सएप नंबर *' : 'Mobile / WhatsApp *'}
                      </label>
                      <input
                        type="tel"
                        required
                        value={memberForm.mobile}
                        onChange={(e) => setMemberForm({ ...memberForm, mobile: e.target.value })}
                        placeholder="+91 98290 00000"
                        className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* STATE & DISTRICT DROPDOWNS (राज्य व जिला ड्रॉपडाउन) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-amber-50/50 rounded-xl border border-amber-200/80">
                    <div>
                      <label className="text-xs font-bold text-stone-800 block mb-1 flex items-center justify-between">
                        <span>{isHi ? 'राज्य (State) *' : 'State *'}</span>
                        <span className="text-[10px] text-amber-800 font-semibold">ड्रॉपडाउन</span>
                      </label>
                      <select
                        required
                        value={memberForm.state}
                        onChange={(e) => {
                          const newState = e.target.value;
                          const stateObj = INDIA_STATES_AND_DISTRICTS.find((s) => s.state === newState);
                          const firstDist = stateObj?.districts[0] || 'Other';
                          setMemberForm({
                            ...memberForm,
                            state: newState,
                            city: firstDist,
                          });
                        }}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-semibold bg-white focus:outline-none focus:border-amber-700"
                      >
                        {INDIA_STATES_AND_DISTRICTS.map((item) => (
                          <option key={item.state} value={item.state}>
                            {item.stateHi} ({item.state})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-800 block mb-1 flex items-center justify-between">
                        <span>{isHi ? 'जिला (District) *' : 'District *'}</span>
                        <span className="text-[10px] text-amber-800 font-semibold">{currentDistricts.length} जिले</span>
                      </label>
                      <select
                        required
                        value={memberForm.city}
                        onChange={(e) => setMemberForm({ ...memberForm, city: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-semibold bg-white focus:outline-none focus:border-amber-700"
                      >
                        {currentDistricts.map((dist) => (
                          <option key={dist} value={dist}>
                            {dist}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Optional custom city / tehsil input if needed */}
                    <div className="col-span-1 sm:col-span-2">
                      <label className="text-[11px] font-medium text-stone-600 block mb-0.5">
                        {isHi ? 'कस्बा / तहसील / गांव का नाम (वैकल्पिक)' : 'Specific Town / Tehsil / Area (Optional)'}
                      </label>
                      <input
                        type="text"
                        value={memberForm.customDistrict}
                        onChange={(e) => setMemberForm({ ...memberForm, customDistrict: e.target.value })}
                        placeholder="उदा. पालघर पश्चिम / मनोर रोड"
                        className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs bg-white"
                      />
                    </div>
                  </div>

                  {/* Craft / Profession */}
                  <div>
                    <label className="text-xs font-medium text-stone-700 block mb-1">
                      {isHi ? 'व्यवसाय / शिल्प विधा' : 'Profession / Craft'}
                    </label>
                    <input
                      type="text"
                      value={memberForm.profession}
                      onChange={(e) => setMemberForm({ ...memberForm, profession: e.target.value })}
                      placeholder="उदा. काष्ठशिल्प व वास्तुकला / इंजीनियरिंग / निर्माण कार्य"
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                    />
                  </div>

                  {/* Photo / Document Upload Section */}
                  <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                    <label className="text-xs font-bold text-stone-800 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5 text-amber-700" />
                        <span>{isHi ? 'पहचान फोटो या शिल्प दस्तावेज अपलोड करें (वैकल्पिक)' : 'Upload Member Photo or Document'}</span>
                      </span>
                      <span className="text-[10px] text-stone-500 font-normal">JPG/PNG (अधिकतम 5MB)</span>
                    </label>

                    <div className="flex items-center gap-3">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-2 bg-white border border-stone-300 hover:border-amber-700 rounded-lg text-xs font-medium text-stone-700 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-stone-500" />
                        <span>{isHi ? 'फाइल चुनें / फोटो अपलोड करें' : 'Browse File'}</span>
                      </button>

                      {memberForm.photoDataUrl ? (
                        <div className="flex items-center gap-2">
                          <img
                            src={memberForm.photoDataUrl}
                            alt="Uploaded member"
                            className="w-8 h-8 rounded-md object-cover border border-amber-600 shadow-2xs"
                          />
                          <span className="text-xs text-emerald-700 font-semibold truncate max-w-[150px]">
                            ✓ {memberForm.photoFileName || 'अपलोड हो गया'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-stone-400">
                          {isHi ? 'यह फोटो आपके A4 प्रमाण पत्र में मुद्रित होगी।' : 'Photo will appear on your A4 certificate.'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Direct Link Info to Full Original Canonical Book */}
                  <div className="p-3 bg-amber-50 rounded-lg text-[11px] text-amber-950 border border-amber-200 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Book className="w-4 h-4 text-amber-800 shrink-0" />
                      <span>
                        {isHi
                          ? `सम्पूर्ण मूल ग्रन्थ (${scriptureToDownload.totalArchivePages}) का ई-बुक लिंक भी आपके डाउनलोड होने वाले PDF में संलग्न रहेगा।`
                          : 'Full canonical archive e-book link will be embedded into your downloaded PDF.'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Modal Sticky Bottom Footer */}
                <div className="shrink-0 p-4 sm:p-5 pt-3 bg-stone-50/90 border-t border-stone-200 rounded-b-2xl flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowMembershipModal(false)}
                    className="flex-1 py-2.5 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg cursor-pointer transition-colors"
                  >
                    {isHi ? 'रद्द करें' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={isGeneratingPdf}
                    className="flex-1 py-2.5 text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 disabled:bg-stone-400 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>
                      {isGeneratingPdf
                        ? isHi
                          ? 'A4 पीडीएफ तैयार हो रहा है...'
                          : 'Generating A4 PDF...'
                        : isHi
                        ? 'पंजीकरण पुष्टि करें एवं A4 PDF डाउनलोड करें'
                        : 'Submit & Download A4 PDF'}
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* ARCHIVE.ORG DIGITAL LIBRARY GUIDANCE MODAL */}
      {/* "Signup, login and read direct" */}
      {/* ============================================================ */}
      {archiveNoticeData && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
          <div className="relative bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-amber-300 flex flex-col overflow-hidden my-auto">
            {/* Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 text-white flex items-start justify-between gap-3">
              <div>
                <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <Book className="w-4 h-4 text-amber-400" />
                  <span>Internet Archive (Archive.org) डिजिटल लाइब्रेरी</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold font-display text-white">
                  {isHi ? 'सम्पूर्ण मूल ग्रन्थ: ऑनलाइन पठन निर्देश' : 'Read Full Original Scripture Online'}
                </h3>
                <p className="text-xs text-amber-200/90 mt-0.5 line-clamp-1">
                  {archiveNoticeData.scripture.fullBookSourceTitle}
                </p>
              </div>
              <button
                onClick={() => setArchiveNoticeData(null)}
                className="text-stone-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                title={isHi ? 'बंद करें' : 'Close'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-6 space-y-4 text-stone-800">
              {/* Alert Status: Instructions First or Opened */}
              {archiveNoticeData.linkOpened ? (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-950 space-y-0.5">
                    <div className="font-bold text-emerald-900 text-sm">
                      {isHi ? '✓ Archive.org का आधिकारिक पृष्ठ नए टैब में खुल गया है!' : '✓ Archive.org page opened in new tab!'}
                    </div>
                    <p className="text-emerald-800 leading-relaxed font-hindi">
                      {isHi
                        ? 'कृपया उस टैब में जाकर ऊपर दिए गए निर्देशानुसार Sign Up / Log In करें और सीधे ग्रन्थ पढ़ें।'
                        : 'Please switch to that tab, sign up/log in, and read the original scripture directly.'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-3">
                  <BookMarked className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-950 space-y-0.5">
                    <div className="font-bold text-amber-900 text-sm">
                      {isHi ? '📖 पहले यह निर्देश पढ़ें, फिर ग्रन्थ खोलें:' : '📖 Please read instructions before proceeding:'}
                    </div>
                    <p className="text-stone-700 leading-relaxed font-hindi">
                      {isHi
                        ? 'Archive.org एक विश्वस्तरीय निःशुल्क डिजिटल लाइब्रेरी है। वहाँ बिना किसी शुल्क के पूरा ग्रन्थ सीधे पढ़ने के लिए यह निर्देश अत्यंत आवश्यक है।'
                        : 'Archive.org is a free digital preservation library. Follow these steps to read the book directly online.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Main Instruction Callout: Signup Login and Read Direct */}
              <div className="bg-amber-50/90 border-2 border-amber-300 rounded-xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm sm:text-base font-display">
                  <Sparkles className="w-5 h-5 text-amber-700 shrink-0" />
                  <span>
                    {isHi
                      ? 'महत्वपूर्ण निर्देश: Signup, Login and Read Direct'
                      : 'Instructions: Signup, Login and Read Direct'}
                  </span>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-stone-800 font-hindi leading-relaxed">
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-amber-200 text-amber-950 font-bold flex items-center justify-center shrink-0 text-xs mt-0.5 shadow-2xs">1</span>
                    <div>
                      <strong className="text-amber-950">पहला कदम:</strong> नीचे दिए गए{' '}
                      <span className="font-semibold text-amber-900">"निर्देश पढ़ लिया, अब Archive.org पर ग्रन्थ खोलें"</span>{' '}
                      बटन पर क्लिक करें।
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-amber-200 text-amber-950 font-bold flex items-center justify-center shrink-0 text-xs mt-0.5 shadow-2xs">2</span>
                    <div>
                      <strong className="text-amber-950">Signup / Login:</strong> Archive.org खुलने पर ऊपर दाईं ओर{' '}
                      <span className="bg-amber-200/80 px-1.5 py-0.5 rounded text-amber-950 font-bold">"Sign Up"</span> या{' '}
                      <span className="bg-amber-200/80 px-1.5 py-0.5 rounded text-amber-950 font-bold">"Log In"</span>{' '}
                      (बिलकुल निःशुल्क - 1 मिनट) करें।
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-amber-200 text-amber-950 font-bold flex items-center justify-center shrink-0 text-xs mt-0.5 shadow-2xs">3</span>
                    <div>
                      <strong className="text-amber-950">Read Direct:</strong> लॉगिन करते ही पुस्तक के ऊपर{' '}
                      <span className="bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded font-bold">"Borrow for 1 hour"</span> अथवा{' '}
                      <span className="bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded font-bold">"Read Online"</span>{' '}
                      पर क्लिक कर सम्पूर्ण मूल ग्रन्थ सीधे ऑनलाइन पढ़ें (<strong>Read Direct</strong>)।
                    </div>
                  </div>
                </div>
              </div>

              {/* Archive Metadata snippet */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 text-xs text-stone-600 space-y-1 font-hindi">
                <div>
                  <strong className="text-stone-900">डिजिटल संग्रहालय:</strong>{' '}
                  {archiveNoticeData.scripture.archiveLibraryName} ({archiveNoticeData.scripture.totalArchivePages})
                </div>
                <div>
                  <strong className="text-stone-900">वेबसाइट URL:</strong>{' '}
                  <span className="font-mono text-amber-800 break-all">{archiveNoticeData.scripture.fullBookArchiveUrl}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-1">
                {/* PROMINENT BUTTON: First User Reads Then Clicks to Proceed */}
                <button
                  type="button"
                  onClick={() => handleProceedToArchive(archiveNoticeData.scripture.fullBookArchiveUrl)}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-white rounded-xl text-sm sm:text-base font-bold flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer transform hover:scale-[1.01]"
                >
                  <BookOpen className="w-5 h-5 text-amber-300" />
                  <span>
                    {archiveNoticeData.linkOpened
                      ? (isHi ? 'पुनः Archive.org पर ग्रन्थ खोलें' : 'Re-open on Archive.org')
                      : (isHi ? '👉 निर्देश पढ़ लिया, अब Archive.org पर ग्रन्थ खोलें' : 'I Understand Instructions, Open Scripture')}
                  </span>
                  <ExternalLink className="w-4 h-4 text-amber-300" />
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const sc = archiveNoticeData.scripture;
                      setArchiveNoticeData(null);
                      handleOpenDownloadModal(sc);
                    }}
                    className="flex-1 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-800" />
                    <span>{isHi ? 'A4 PDF भी प्राप्त करें' : 'Get A4 PDF'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setArchiveNoticeData(null)}
                    className="flex-1 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
                  >
                    {isHi ? 'बंद करें (Close)' : 'Close'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
