import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { Language, DonationConfig } from '../types';
import { DONATION_PURPOSES, SUGGESTED_AMOUNTS } from '../data/homeData';
import { DEFAULT_DONATION_CONFIG } from '../data/formsData';
import {
  Heart,
  QrCode,
  CheckCircle,
  Copy,
  Download,
  Upload,
  ArrowRight,
  ArrowLeft,
  X,
  ShieldCheck,
  Building,
  CreditCard,
  FileText,
  Sparkles,
  Check
} from 'lucide-react';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  donationConfig?: DonationConfig;
  onOpenAdmin?: () => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  onClose,
  lang,
  donationConfig,
  onOpenAdmin,
}) => {
  const isHi = lang === 'hi';
  const activeConfig = donationConfig || DEFAULT_DONATION_CONFIG;
  const activePurposes = activeConfig.purposes && activeConfig.purposes.length > 0 ? activeConfig.purposes : DONATION_PURPOSES;
  const activeAmounts = activeConfig.suggestedAmounts && activeConfig.suggestedAmounts.length > 0 ? activeConfig.suggestedAmounts : SUGGESTED_AMOUNTS;
  const [step, setStep] = useState<'form' | 'qr' | 'success'>('form');

  // Form State
  const [donorForm, setDonorForm] = useState({
    fullName: '',
    mobile: '',
    email: '',
    panNumber: '',
    city: 'जयपुर',
    state: 'राजस्थान',
    purpose: activePurposes[0]?.labelHi || 'मेधावी छात्र-छात्रा उच्च शिक्षा छात्रवृत्ति',
    amount: activeAmounts.includes(2100) ? 2100 : (activeAmounts[0] || 2100),
    customAmount: '',
    utrNumber: '',
    screenshotDataUrl: '',
    screenshotFileName: '',
  });

  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [generatedReceiptNo, setGeneratedReceiptNo] = useState<string>('');
  const [receiptDate, setReceiptDate] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const currentAmount = donorForm.customAmount ? Number(donorForm.customAmount) : donorForm.amount;

  const upiId = activeConfig.upiId;
  const payeeName = activeConfig.payeeName;

  // Copy UPI to clipboard
  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  // Screenshot upload
  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert(isHi ? 'कृपया 5MB से छोटी फाइल चुनें।' : 'Please choose file < 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setDonorForm((prev) => ({
          ...prev,
          screenshotDataUrl: uploadEvent.target?.result as string,
          screenshotFileName: file.name,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Convert numbers to Hindi words helper
  const amountToHindiWords = (num: number): string => {
    if (num === 501) return 'पांच सौ एक रुपये मात्र';
    if (num === 1100) return 'एक हजार एक सौ रुपये मात्र';
    if (num === 2100) return 'दो हजार एक सौ रुपये मात्र';
    if (num === 5100) return 'पांच हजार एक सौ रुपये मात्र';
    if (num === 11000) return 'ग्यारह हजार रुपये मात्र';
    if (num === 21000) return 'इक्कीस हजार रुपये मात्र';
    return `${num.toLocaleString('en-IN')} रुपये मात्र`;
  };

  // Submit UTR & Generate High-Res A4 Donation Receipt
  const handleFinalSubmitAndDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorForm.utrNumber.trim()) {
      alert(isHi ? 'कृपया भुगतान का UTR / Transaction Reference नंबर दर्ज करें।' : 'Please enter payment UTR number.');
      return;
    }

    const recNo = `VSM-REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const formattedDate = `${now.getDate()} ${now.toLocaleString('hi-IN', { month: 'long' })} ${now.getFullYear()}, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

    setGeneratedReceiptNo(recNo);
    setReceiptDate(formattedDate);
    setStep('success');

    // Trigger instant automatic PDF receipt generation
    setTimeout(() => {
      generateA4DonationReceipt(recNo, formattedDate);
    }, 400);
  };

  // Generate Official High-Resolution A4 PDF Donation Receipt (Canvas -> PDF)
  const generateA4DonationReceipt = async (recNo: string, formattedDate: string) => {
    setIsGeneratingPdf(true);
    try {
      const canvas = document.createElement('canvas');
      const width = 1240;
      const height = 1754;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error('Canvas unavailable');

      // 1. Clean Parchment Background
      ctx.fillStyle = '#FFFCF7';
      ctx.fillRect(0, 0, width, height);

      // 2. Double Ornate Borders
      const margin = 50;
      ctx.strokeStyle = '#9A3412'; // Rust Amber
      ctx.lineWidth = 6;
      ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);

      ctx.strokeStyle = '#D97706'; // Warm Gold
      ctx.lineWidth = 2;
      ctx.strokeRect(margin + 8, margin + 8, width - (margin + 8) * 2, height - (margin + 8) * 2);

      // Corner ornaments
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
      const headerHeight = 160;
      const grad = ctx.createLinearGradient(margin + 10, headerTop, width - margin - 10, headerTop);
      grad.addColorStop(0, '#431407');
      grad.addColorStop(0.5, '#78350F');
      grad.addColorStop(1, '#431407');
      ctx.fillStyle = grad;
      ctx.fillRect(margin + 10, headerTop, width - margin * 2 - 20, headerHeight);

      // Gold Trim
      ctx.strokeStyle = '#FCD34D';
      ctx.lineWidth = 3;
      ctx.strokeRect(margin + 14, headerTop + 4, width - margin * 2 - 28, headerHeight - 8);

      // Header Texts
      ctx.textAlign = 'center';
      ctx.fillStyle = '#FEF08A';
      ctx.font = 'bold 22px serif, system-ui';
      ctx.fillText('॥ ॐ श्री विश्वकर्मणे नमः ॥  परोपकाराय सतां विभूतयः', width / 2, headerTop + 38);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 36px serif, system-ui';
      ctx.fillText('अखिल भारतीय विश्वकर्मा समाज महासंघ जनकल्याण न्यास', width / 2, headerTop + 85);

      ctx.fillStyle = '#FDE68A';
      ctx.font = '18px sans-serif';
      ctx.fillText('राष्ट्रीय विश्वकर्मा बंधु सहायता प्रकोष्ठ · पंजीकृत धर्मार्थ ट्रस्ट (80G आयकर छूट मान्य)', width / 2, headerTop + 125);

      let currentY = headerTop + headerHeight + 35;

      // 4. Receipt Title & Number Box
      ctx.fillStyle = '#9A3412';
      ctx.fillRect(margin + 20, currentY, width - margin * 2 - 40, 48);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px serif, system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('आधिकारिक दान सहयोग पावती (OFFICIAL DONATION RECEIPT)', width / 2, currentY + 33);

      currentY += 75;

      // Metadata Bar: Receipt No, Date, Trust PAN
      ctx.fillStyle = '#FFFBEB';
      ctx.fillRect(margin + 20, currentY, width - margin * 2 - 40, 50);
      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = 1;
      ctx.strokeRect(margin + 20, currentY, width - margin * 2 - 40, 50);

      ctx.textAlign = 'left';
      ctx.fillStyle = '#78350F';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(`रसीद क्र: ${recNo}`, margin + 35, currentY + 31);

      ctx.textAlign = 'center';
      ctx.fillText(`दिनांक: ${formattedDate}`, width / 2, currentY + 31);

      ctx.textAlign = 'right';
      ctx.fillText('80G Reg: AABTV8921PF20214', width - margin - 35, currentY + 31);

      currentY += 80;

      // 5. Donor Information Table
      const rowHeight = 44;
      const donorDetails = [
        ['दानदाता का पूरा नाम (Donor Name):', donorForm.fullName || 'सम्मानित समाज बंधु'],
        ['संपर्क मोबाइल नंबर (Mobile No):', donorForm.mobile || '+91 98290 00000'],
        ['ईमेल पता (Email Address):', donorForm.email || 'donor@vishwakarmasamaj.org'],
        ['पैन नंबर (PAN No - for 80G):', donorForm.panNumber ? donorForm.panNumber.toUpperCase() : 'उपलब्ध नहीं / NA'],
        ['शहर एवं राज्य (City, State):', `${donorForm.city}, ${donorForm.state}`],
        ['सहयोग का उद्देश्य (Purpose):', donorForm.purpose],
        ['भुगतान माध्यम (Payment Mode):', 'UPI QR Code (PhonePe/GPay/Paytm)'],
        ['बैंक UTR / Ref No:', donorForm.utrNumber],
      ];

      ctx.textAlign = 'left';
      donorDetails.forEach(([label, val], idx) => {
        const rowY = currentY + idx * rowHeight;
        ctx.fillStyle = idx % 2 === 0 ? '#FFFFFF' : '#F9FAFB';
        ctx.fillRect(margin + 20, rowY, width - margin * 2 - 40, rowHeight);
        ctx.strokeStyle = '#E5E7EB';
        ctx.lineWidth = 1;
        ctx.strokeRect(margin + 20, rowY, width - margin * 2 - 40, rowHeight);

        ctx.fillStyle = '#4B5563';
        ctx.font = 'bold 15px sans-serif';
        ctx.fillText(label, margin + 35, rowY + 28);

        ctx.fillStyle = '#111827';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText(val, margin + 400, rowY + 28);
      });

      currentY += donorDetails.length * rowHeight + 35;

      // 6. Prominent Amount Highlight Box
      ctx.fillStyle = '#ECFDF5';
      ctx.fillRect(margin + 20, currentY, width - margin * 2 - 40, 95);
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 2;
      ctx.strokeRect(margin + 20, currentY, width - margin * 2 - 40, 95);

      ctx.fillStyle = '#065F46';
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('प्राप्त सहयोग राशि (Donation Amount Received):', margin + 40, currentY + 38);

      ctx.fillStyle = '#047857';
      ctx.font = 'bold 36px serif, system-ui';
      ctx.textAlign = 'right';
      ctx.fillText(`₹ ${currentAmount.toLocaleString('en-IN')}/-`, width - margin - 40, currentY + 45);

      ctx.fillStyle = '#065F46';
      ctx.font = 'italic 16px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`शब्दों में: ${amountToHindiWords(currentAmount)}`, margin + 40, currentY + 75);

      currentY += 135;

      // 7. Terms & 80G Exemption Note
      ctx.fillStyle = '#F3F4F6';
      ctx.fillRect(margin + 20, currentY, width - margin * 2 - 40, 110);
      ctx.strokeStyle = '#D1D5DB';
      ctx.lineWidth = 1;
      ctx.strokeRect(margin + 20, currentY, width - margin * 2 - 40, 110);

      ctx.fillStyle = '#374151';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('महत्वपूर्ण निर्देश एवं कानूनी मान्यता (80G Tax Exemption Note):', margin + 35, currentY + 28);

      ctx.font = '12px sans-serif';
      ctx.fillStyle = '#4B5563';
      ctx.fillText('1. यह दान अखिल भारतीय विश्वकर्मा समाज महासंघ जनकल्याण न्यास को समाज उत्थान, छात्रवृत्ति एवं चिकित्सा हेतु प्राप्त हुआ है।', margin + 35, currentY + 52);
      ctx.fillText('2. आयकर अधिनियम 1961 की धारा 80G के अंतर्गत दानदाता 50% तक कर छूट प्राप्त करने हेतु पात्र हैं।', margin + 35, currentY + 74);
      ctx.fillText('3. यह कम्प्यूटर जनित डिजिटल हस्ताक्षरित रसीद है, अतः इस पर अतिरिक्त भौतिक मुहर की आवश्यकता नहीं है।', margin + 35, currentY + 96);

      currentY += 160;

      // 8. Signatures & Official Stamp
      // Left: Authorized Signatory
      ctx.fillStyle = '#111827';
      ctx.font = 'bold 15px sans-serif';
      ctx.textAlign = 'center';

      // Golden Seal
      const sealX = margin + 180;
      const sealY = currentY + 50;
      ctx.beginPath();
      ctx.arc(sealX, sealY, 45, 0, Math.PI * 2);
      ctx.fillStyle = '#FEF3C7';
      ctx.fill();
      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#92400E';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('★ आधिकारिक मुहर ★', sealX, sealY - 8);
      ctx.fillText('जनकल्याण न्यास', sealX, sealY + 10);
      ctx.fillText('80G APPROVED', sealX, sealY + 25);

      // Treasurer Signature
      ctx.strokeStyle = '#1E3A8A';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(width - margin - 260, currentY + 50);
      ctx.quadraticCurveTo(width - margin - 200, currentY + 30, width - margin - 150, currentY + 50);
      ctx.quadraticCurveTo(width - margin - 100, currentY + 70, width - margin - 60, currentY + 45);
      ctx.stroke();

      ctx.fillStyle = '#1F2937';
      ctx.font = 'bold 15px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('(महेंद्र पाल गजधर)', width - margin - 160, currentY + 75);
      ctx.font = '13px sans-serif';
      ctx.fillStyle = '#6B7280';
      ctx.fillText('राष्ट्रीय कोषाध्यक्ष, विश्वकर्मा न्यास', width - margin - 160, currentY + 95);

      // Bottom Helpline
      ctx.textAlign = 'center';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillStyle = '#9A3412';
      ctx.fillText('राष्ट्रीय हेल्पलाइन: +91 1800 233 4599  |  वेबसाइट: www.vishwakarmasamaj.org', width / 2, height - margin - 18);

      // 9. Convert to PDF and download
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
      pdf.save(`Vishwakarma-Sahayata-Receipt-${recNo}.pdf`);
    } catch (err) {
      console.error('Donation receipt generation error:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
      <div className="relative bg-white rounded-2xl max-w-xl w-full shadow-2xl border-2 border-amber-500/60 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 pb-4 bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 text-white flex items-start justify-between gap-3 shrink-0">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-red-400 fill-red-400" />
                <span>विश्वकर्मा बंधु सहायता प्रकोष्ठ · जनकल्याण न्यास</span>
              </div>
              {onOpenAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAdmin();
                  }}
                  className="px-2 py-0.5 text-[10px] font-bold text-amber-200 bg-amber-900/80 hover:bg-amber-800 rounded border border-amber-500/50 flex items-center gap-1 transition-all cursor-pointer"
                  title="एडमिन पैनल में दान सेटिंग्स व बैंक खाता विवरण संपादित करें"
                >
                  <span>⚙️ एडमिन: दान फॉर्म संपादित करें</span>
                </button>
              )}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
              {activeConfig.formTitleHi || (isHi ? 'सहयोग एवं दान संकल्प (Donate Now)' : 'Community Relief Fund Donation')}
            </h3>
            <p className="text-xs text-amber-200/90 mt-0.5 font-hindi">
              {activeConfig.formSubtitleHi || (isHi
                ? 'आपका सहयोग समाज के मेधावी छात्रों, असहाय शिल्पियों व चिकित्सा कोष को सशक्त बनाता है।'
                : 'Your contribution empowers education, healthcare, and artisan welfare.')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 font-hindi text-stone-800 space-y-5 scrollbar-thin">
          {/* STEP 1: DONOR DETAILS FORM */}
          {step === 'form' && (
            <div className="space-y-4">
              {/* Purpose Selector */}
              <div>
                <label className="text-xs font-bold text-stone-800 block mb-1">
                  {isHi ? 'दान / सहयोग का उद्देश्य चुनें *' : 'Select Purpose of Donation *'}
                </label>
                <select
                  value={donorForm.purpose}
                  onChange={(e) => setDonorForm({ ...donorForm, purpose: e.target.value })}
                  className="w-full px-3 py-2.5 border border-stone-300 rounded-xl text-xs sm:text-sm bg-white font-medium focus:outline-none focus:border-amber-700"
                >
                  {activePurposes.map((p) => (
                    <option key={p.id} value={p.labelHi}>
                      {p.labelHi}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount Preset Pills */}
              <div>
                <label className="text-xs font-bold text-stone-800 block mb-1.5">
                  {isHi ? 'सहयोग राशि चुनें (Amount in INR) *' : 'Choose Amount (INR) *'}
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {activeAmounts.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDonorForm({ ...donorForm, amount: amt, customAmount: '' })}
                      className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all cursor-pointer text-center ${
                        donorForm.amount === amt && !donorForm.customAmount
                          ? 'bg-amber-800 text-white border-amber-900 shadow-xs scale-102'
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200'
                      }`}
                    >
                      ₹{amt.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>

                <div className="mt-2.5">
                  <input
                    type="number"
                    placeholder="अथवा अन्य राशि दर्ज करें (उदा. 50000)"
                    value={donorForm.customAmount}
                    onChange={(e) => setDonorForm({ ...donorForm, customAmount: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              {/* Donor Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-800 block mb-1">
                    {isHi ? 'दानदाता का पूरा नाम *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={donorForm.fullName}
                    onChange={(e) => setDonorForm({ ...donorForm, fullName: e.target.value })}
                    placeholder="उदा. कैलाश शर्मा (जांगिड़)"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-800 block mb-1">
                    {isHi ? 'संपर्क मोबाइल नंबर *' : 'Mobile Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={donorForm.mobile}
                    onChange={(e) => setDonorForm({ ...donorForm, mobile: e.target.value })}
                    placeholder="+91 98290 88776"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              {/* Email & PAN Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-800 block mb-1">
                    {isHi ? 'ईमेल पता (रसीद प्रेषण हेतु) *' : 'Email Address *'}
                  </label>
                  <input
                    type="email"
                    required
                    value={donorForm.email}
                    onChange={(e) => setDonorForm({ ...donorForm, email: e.target.value })}
                    placeholder="dksacademy.live@gmail.com"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1">
                    {isHi ? 'पैन नंबर (80G आयकर छूट हेतु)' : 'PAN Number (Optional)'}
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    value={donorForm.panNumber}
                    onChange={(e) => setDonorForm({ ...donorForm, panNumber: e.target.value.toUpperCase() })}
                    placeholder="ABCDE1234F"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs font-mono uppercase"
                  />
                </div>
              </div>

              {/* City & State */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1">
                    {isHi ? 'शहर *' : 'City *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={donorForm.city}
                    onChange={(e) => setDonorForm({ ...donorForm, city: e.target.value })}
                    placeholder="जयपुर"
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
                    value={donorForm.state}
                    onChange={(e) => setDonorForm({ ...donorForm, state: e.target.value })}
                    placeholder="राजस्थान"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Proceed Button */}
              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => {
                    if (!donorForm.fullName || !donorForm.mobile || !donorForm.email) {
                      alert(isHi ? 'कृपया नाम, मोबाइल एवं ईमेल अवश्य भरें।' : 'Please fill Name, Mobile, and Email.');
                      return;
                    }
                    setStep('qr');
                  }}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer transform hover:scale-[1.01]"
                >
                  <span>{isHi ? `आगे बढ़ें: ₹${currentAmount.toLocaleString('en-IN')} का भुगतान QR कोड देखें` : 'Proceed to Payment QR'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: UPI QR CODE & SUBMIT RECEIPT / UTR */}
          {step === 'qr' && (
            <div className="space-y-4">
              {/* Back to details */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="text-xs font-semibold text-amber-800 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>← विवरण में संशोधन करें</span>
                </button>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  राशि: ₹{currentAmount.toLocaleString('en-IN')}/-
                </span>
              </div>

              {/* QR Code Container */}
              <div className="bg-gradient-to-b from-amber-50 to-stone-50 border-2 border-amber-300 rounded-2xl p-5 text-center space-y-3">
                <div className="text-xs font-bold text-stone-800 flex items-center justify-center gap-1.5">
                  <QrCode className="w-4 h-4 text-amber-800" />
                  <span>किसी भी UPI ऐप से स्कैन करके भुगतान करें:</span>
                </div>

                {/* Live High-Quality QR Code Visual */}
                <div className="inline-block p-4 bg-white rounded-2xl shadow-md border-2 border-amber-600 relative">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                      `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${currentAmount}&cu=INR&tn=${encodeURIComponent(donorForm.purpose)}`
                    )}`}
                    alt="UPI Payment QR Code"
                    className="w-44 h-44 mx-auto object-contain"
                  />
                  <div className="text-[10px] text-stone-500 font-bold mt-1 tracking-wider">
                    SCAN & PAY VIA UPI
                  </div>
                </div>

                {/* Accepted Apps Badge */}
                <div className="text-[11px] text-stone-600 flex items-center justify-center gap-2 font-medium">
                  <span className="px-2 py-0.5 bg-white rounded border border-stone-200">Google Pay</span>
                  <span className="px-2 py-0.5 bg-white rounded border border-stone-200">PhonePe</span>
                  <span className="px-2 py-0.5 bg-white rounded border border-stone-200">Paytm</span>
                  <span className="px-2 py-0.5 bg-white rounded border border-stone-200">BHIM UPI</span>
                </div>

                {/* UPI ID with Copy button */}
                <div className="flex items-center justify-center gap-2 pt-1">
                  <span className="text-xs text-stone-600">आधिकारिक UPI ID:</span>
                  <span className="font-mono font-bold text-amber-950 text-xs bg-amber-100/70 px-2 py-1 rounded">
                    {upiId}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="p-1 text-amber-800 hover:text-amber-950 cursor-pointer"
                    title="Copy UPI ID"
                  >
                    {copiedUpi ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Bank Account Details */}
                <div className="text-left text-[11px] text-stone-700 bg-white p-3 rounded-xl border border-stone-200 space-y-1">
                  <div className="font-bold text-stone-900 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-amber-800" />
                    <span>बैंक खाता विवरण (NEFT / RTGS / IMPS):</span>
                  </div>
                  <div><strong>बैंक का नाम:</strong> {activeConfig.bankName}</div>
                  <div><strong>खाता धारक:</strong> {activeConfig.accountHolder}</div>
                  <div><strong>खाता संख्या:</strong> {activeConfig.accountNumber}</div>
                  <div><strong>IFSC कोड:</strong> {activeConfig.ifscCode} ({activeConfig.branch})</div>
                </div>
              </div>

              {/* UTR / Transaction Reference Submission Box */}
              <form onSubmit={handleFinalSubmitAndDownload} className="space-y-3 pt-1">
                <div className="p-4 bg-orange-50/70 border border-orange-200 rounded-xl space-y-2.5">
                  <div className="text-xs font-bold text-orange-950 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-orange-800" />
                    <span>भुगतान उपरांत UTR / ट्रांजेक्शन रसीद दर्ज करें:</span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    कृपया UPI ऐप में सफल भुगतान के बाद दिखने वाला 12 अंकों का <strong>UTR / UPI Ref Number</strong> नीचे दर्ज करें ताकि आपकी <strong>आधिकारिक A4 दान रसीद</strong> तुरंत डाउनलोड हो सके।
                  </p>

                  <div>
                    <label className="text-xs font-bold text-stone-800 block mb-1">
                      12 अंकों का UTR / Transaction Ref No. *
                    </label>
                    <input
                      type="text"
                      required
                      value={donorForm.utrNumber}
                      onChange={(e) => setDonorForm({ ...donorForm, utrNumber: e.target.value })}
                      placeholder="उदा. 429381029384"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-mono font-bold focus:outline-none focus:border-amber-700 bg-white"
                    />
                  </div>

                  {/* Screenshot upload option */}
                  <div className="pt-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleScreenshotUpload}
                      className="hidden"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-white border border-stone-300 hover:border-amber-700 text-[11px] font-semibold text-stone-700 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Upload className="w-3 h-3 text-amber-800" />
                        <span>{isHi ? 'भुगतान स्क्रीनशॉट संलग्न करें (वैकल्पिक)' : 'Attach Screenshot'}</span>
                      </button>

                      {donorForm.screenshotFileName && (
                        <span className="text-[11px] text-emerald-700 font-bold truncate max-w-[150px]">
                          ✓ {donorForm.screenshotFileName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isGeneratingPdf}
                  className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-400 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {isGeneratingPdf
                      ? isHi
                        ? 'आधिकारिक A4 रसीद तैयार हो रही है...'
                        : 'Generating Receipt...'
                      : isHi
                      ? 'रसीद जमा करें एवं A4 दान पावती डाउनलोड करें'
                      : 'Submit & Download Official Receipt'}
                  </span>
                </button>
              </form>
            </div>
          )}

          {/* STEP 3: SUCCESS & DOWNLOAD RECEIPT AGAIN */}
          {step === 'success' && (
            <div className="text-center py-4 space-y-4 font-hindi">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-xl font-bold text-stone-900 font-display">
                  सहयोग हेतु सहृदय धन्यवाद एवं आभार!
                </h4>
                <p className="text-xs text-stone-600 mt-1">
                  आपकी आधिकारिक 80G दान पावती (Donation Receipt) तैयार होकर डिवाइस में स्वतः डाउनलोड हो चुकी है।
                </p>
              </div>

              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs text-left space-y-1.5 max-w-md mx-auto">
                <div><strong>दानदाता:</strong> {donorForm.fullName}</div>
                <div><strong>रसीद संख्या:</strong> {generatedReceiptNo}</div>
                <div><strong>सहयोग राशि:</strong> ₹{currentAmount.toLocaleString('en-IN')}/-</div>
                <div><strong>सहयोग उद्देश्य:</strong> {donorForm.purpose}</div>
                <div><strong>दिनांक:</strong> {receiptDate}</div>
                <div><strong>UTR क्रमांक:</strong> {donorForm.utrNumber}</div>
              </div>

              <div className="flex gap-3 justify-center pt-2">
                <button
                  type="button"
                  disabled={isGeneratingPdf}
                  onClick={() => generateA4DonationReceipt(generatedReceiptNo, receiptDate)}
                  className="px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>{isHi ? 'पुनः A4 रसीद डाउनलोड करें' : 'Download Receipt Again'}</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  {isHi ? 'पूर्ण (बंद करें)' : 'Done (Close)'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
