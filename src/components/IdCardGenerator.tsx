import React, { useState, useRef, useEffect } from 'react';
import { Language, SamajIdCardData, IdCardFormConfig } from '../types';
import { DEFAULT_IDCARD_CONFIG } from '../data/formsData';
import { Award, Download, Printer, CheckCircle, ShieldCheck, Upload, Camera, Settings } from 'lucide-react';

interface IdCardGeneratorProps {
  lang: Language;
  idCardConfig?: IdCardFormConfig;
  onOpenAdmin?: () => void;
}

export const IdCardGenerator: React.FC<IdCardGeneratorProps> = ({ lang, idCardConfig, onOpenAdmin }) => {
  const isHi = lang === 'hi';
  const activeConfig = idCardConfig || DEFAULT_IDCARD_CONFIG;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<SamajIdCardData>({
    fullName: 'रमेशचन्द्र जांगिड़',
    fatherOrHusbandName: 'श्री रामविलास जांगिड़',
    subcaste: 'जांगिड़ (सुथार)',
    gotra: 'वशिष्ठ',
    bloodGroup: 'B+',
    dob: '1988-08-15',
    mobile: '+91 98290 12345',
    city: 'जयपुर',
    state: 'राजस्थान',
    membershipId: 'VK-2026-8942',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    issueDate: '2026-10-02',
  });

  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [photoFileName, setPhotoFileName] = useState<string>('');
  const [renderedCardDataUrl, setRenderedCardDataUrl] = useState<string>('');

  // Handle local photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFileName(file.name);
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setFormData((prev) => ({ ...prev, photoUrl: result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Core High-Definition Canvas Generator (100% crisp, cross-browser, prints and downloads perfectly)
  const generateCardCanvasDataUrl = async (): Promise<string> => {
    const canvas = document.createElement('canvas');
    const w = 1012;
    const h = 638;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Canvas context not available');
    }

    // 1. Background Gradient (deep luxury amber-wood tones)
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#3a1303');
    grad.addColorStop(0.35, '#1e0c03');
    grad.addColorStop(1, '#0c0a09');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(12, 12, w - 24, h - 24, 28);
    ctx.fill();

    // 2. Outer Gold Foil Border
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 4.5;
    ctx.stroke();

    // 3. Inner Fine Accent Border
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(24, 24, w - 48, h - 48, 20);
    ctx.stroke();

    // 4. Header Section
    ctx.fillStyle = '#fde68a';
    ctx.font = 'bold 20px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(
      isHi
        ? (activeConfig.issuingAuthority || 'अखिल भारतीय विश्वकर्मा समाज महासंघ')
        : (activeConfig.issuingAuthorityEn || 'All India Vishwakarma Samaj Federation'),
      55,
      68
    );

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px "Rozha One", Georgia, serif';
    ctx.fillText(
      isHi
        ? (activeConfig.titleHi || 'विश्वकर्मा डिजिटल सदस्यता पहचान पत्र')
        : (activeConfig.titleEn || 'Vishwakarma Digital Membership Identity Card'),
      55,
      110
    );

    // 5. Sacred OM Circle Insignia
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(925, 88, 32, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#fef3c7';
    ctx.font = 'bold 32px serif';
    ctx.textAlign = 'center';
    ctx.fillText('ॐ', 925, 99);

    // 6. Hairline Separator
    ctx.strokeStyle = 'rgba(217, 119, 6, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(55, 136);
    ctx.lineTo(w - 55, 136);
    ctx.stroke();

    // 7. Member Photo Box
    const px = 55;
    const py = 160;
    const pw = 205;
    const ph = 255;

    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.roundRect(px, py, pw, ph, 14);
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Load and draw photo
    let photoDrawn = false;
    if (formData.photoUrl) {
      try {
        const img = new Image();
        if (!formData.photoUrl.startsWith('data:')) {
          img.crossOrigin = 'anonymous';
        }
        img.src = formData.photoUrl;

        await new Promise<void>((resolve, reject) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
          } else {
            img.onload = () => resolve();
            img.onerror = () => reject();
            setTimeout(() => resolve(), 1500); // 1.5s timeout safety
          }
        });

        if (img.naturalWidth > 0) {
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(px + 3, py + 3, pw - 6, ph - 6, 12);
          ctx.clip();
          ctx.drawImage(img, px + 3, py + 3, pw - 6, ph - 6);
          ctx.restore();
          photoDrawn = true;
        }
      } catch {
        photoDrawn = false;
      }
    }

    if (!photoDrawn) {
      // Fallback Initial Avatar
      ctx.fillStyle = '#292524';
      ctx.beginPath();
      ctx.roundRect(px + 3, py + 3, pw - 6, ph - 6, 12);
      ctx.fill();

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 80px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(formData.fullName.trim().slice(0, 1) || (isHi ? 'वि' : 'V'), px + pw / 2, py + ph / 2 + 28);
    }

    // 8. Member Details Section
    ctx.textAlign = 'left';

    // Full Name
    ctx.fillStyle = '#fde68a';
    ctx.font = '16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(isHi ? 'सदस्य का नाम:' : 'Member Name:', 290, 192);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 34px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(formData.fullName, 290, 235);

    // Grid of Attributes
    ctx.fillStyle = '#fef3c7';
    ctx.font = '20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`${isHi ? 'पिता / पति:' : 'Father / Husband:'}  ${formData.fatherOrHusbandName}`, 290, 285);
    ctx.fillText(`${isHi ? 'शाखा:' : 'Subcaste:'}  ${formData.subcaste}`, 290, 330);
    ctx.fillText(`${isHi ? 'गोत्र:' : 'Gotra:'}  ${formData.gotra}`, 640, 330);

    ctx.fillText(`${isHi ? 'रक्त समूह:' : 'Blood Group:'}  ${formData.bloodGroup}`, 290, 375);
    ctx.fillText(`${isHi ? 'जन्म तिथि:' : 'DOB:'}  ${formData.dob}`, 640, 375);

    ctx.fillText(`${isHi ? 'निवास:' : 'Residence:'}  ${formData.city}, ${formData.state}`, 290, 420);

    // 9. Bottom Divider Line
    ctx.strokeStyle = 'rgba(217, 119, 6, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(55, 475);
    ctx.lineTo(w - 55, 475);
    ctx.stroke();

    // 10. Footer Details (NO QR CODE as requested)
    ctx.textAlign = 'left';
    ctx.fillStyle = '#fde68a';
    ctx.font = 'bold 22px monospace';
    ctx.fillText(`${isHi ? 'सदस्यता क्र.:' : 'Membership ID:'} ${formData.membershipId}`, 55, 524);

    ctx.fillStyle = '#fef3c7';
    ctx.font = '18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(
      `${isHi ? 'सत्यापित तिथि:' : 'Issue Date:'} ${formData.issueDate}  |  ${isHi ? 'मो.:' : 'Mobile:'} ${formData.mobile}`,
      55,
      564
    );

    // Right Side Seal & Motto
    ctx.textAlign = 'right';
    ctx.font = 'italic bold 24px serif';
    ctx.fillStyle = '#fef3c7';
    ctx.fillText(isHi ? '॥ श्री विश्वकर्माय नमः ॥' : '॥ Shri Vishwakarma Namah ॥', w - 55, 524);

    ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(isHi ? 'अधिकृत समाज पहचान पत्र [सत्यापित]' : 'Official Community ID Card [Verified]', w - 55, 564);

    return canvas.toDataURL('image/png');
  };

  // Update in-page print preview image when form data changes
  useEffect(() => {
    generateCardCanvasDataUrl().then((url) => {
      setRenderedCardDataUrl(url);
    }).catch(() => {});
  }, [formData, isHi]);

  // Download Handler
  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const dataUrl = await generateCardCanvasDataUrl();
      const link = document.createElement('a');
      link.download = `Vishwakarma-Samaj-ID-${formData.membershipId}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Error downloading card:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // 100% Guaranteed Crisp Print Handler (Fix for user's screenshot)
  const handlePrint = async () => {
    setIsGenerating(true);
    try {
      const dataUrl = await generateCardCanvasDataUrl();
      setRenderedCardDataUrl(dataUrl);

      // Open clean print window with actual embedded image (browsers never strip colors from images!)
      const printWindow = window.open('', '_blank', 'width=950,height=750');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html lang="hi">
            <head>
              <meta charset="UTF-8">
              <title>विश्वकर्मा समाज पहचान पत्र - ${formData.fullName}</title>
              <style>
                @page {
                  size: A4 portrait;
                  margin: 15mm;
                }
                * {
                  box-sizing: border-box;
                }
                body {
                  margin: 0;
                  padding: 20px;
                  background-color: white;
                  font-family: system-ui, -apple-system, sans-serif;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: flex-start;
                }
                .no-print-bar {
                  text-align: center;
                  margin-bottom: 25px;
                  color: #78350f;
                }
                .no-print-bar h2 {
                  margin: 0 0 4px 0;
                  font-size: 20px;
                }
                .no-print-bar p {
                  margin: 0;
                  font-size: 13px;
                  color: #71717a;
                }
                .print-card-wrapper {
                  width: 95mm;
                  max-width: 100%;
                  text-align: center;
                  margin: 10px auto;
                }
                .print-card-img {
                  width: 100%;
                  height: auto;
                  display: block;
                  border-radius: 4.5mm;
                  box-shadow: 0 6px 16px rgba(0,0,0,0.15);
                  border: 1px solid #b45309;
                }
                .cut-line {
                  margin-top: 15px;
                  font-size: 11px;
                  color: #888;
                  border-top: 1px dashed #bbb;
                  padding-top: 8px;
                  width: 100%;
                  text-align: center;
                }
                @media print {
                  .no-print-bar {
                    display: none !important;
                  }
                  body {
                    padding: 0;
                    margin: 0;
                  }
                  .print-card-wrapper {
                    width: 85.6mm; /* Exact CR-80 PVC Card Standard Dimension */
                    margin: 15mm auto;
                  }
                  .print-card-img {
                    box-shadow: none;
                    width: 85.6mm;
                  }
                }
              </style>
            </head>
            <body>
              <div class="no-print-bar">
                <h2>अखिल भारतीय विश्वकर्मा समाज महासंघ</h2>
                <p>डिजिटल सदस्यता पहचान पत्र — प्रिंट पूर्वावलोकन</p>
              </div>

              <div class="print-card-wrapper">
                <img src="${dataUrl}" class="print-card-img" alt="विश्वकर्मा समाज पहचान पत्र" />
                <div class="cut-line">✂ यहाँ से काटकर लैमिनेट अथवा पीवीसी कार्ड के रूप में सुरक्षित रखें</div>
              </div>

              <script>
                window.onload = function() {
                  setTimeout(function() {
                    window.print();
                  }, 300);
                };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      } else {
        // Fallback in-page print
        window.print();
      }
    } catch (err) {
      console.error('Error printing card:', err);
      window.print();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hidden container specifically for in-page print fallback */}
      <div id="in-page-print-wrapper" className="hidden">
        {renderedCardDataUrl && (
          <img src={renderedCardDataUrl} alt="Samaj ID Card" className="mx-auto" />
        )}
      </div>

      {/* Header */}
      <div className="border-b border-stone-200 pb-6 no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 tracking-wide mb-1">
            <span>डिजिटल सदस्यता पहचान पत्र</span>
            <span aria-hidden="true">·</span>
            <span>{activeConfig.validityNotice || 'सत्यापित समाज परिचय'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
            {activeConfig.titleHi || (isHi ? 'विश्वकर्मा समाज डिजिटल पहचान पत्र निर्माता' : 'Digital Samaj Identity Card Generator')}
          </h2>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl">
            {isHi
              ? 'अपनी फोटो अपलोड करें, जानकारी भरें और अपना उच्च-गुणवत्ता वाला डिजिटल पहचान पत्र डाउनलोड व प्रिंट करें।'
              : 'Upload your photo, fill details, and download or print your official verified Samaj PVC identity card.'}
          </p>
        </div>

        {onOpenAdmin && (
          <button
            type="button"
            onClick={onOpenAdmin}
            className="px-3.5 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shrink-0 shadow-2xs"
            title="एडमिन पोर्टल में पहचान पत्र फॉर्म सेटिंग्स व उपजातियां संपादित करें"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>⚙️ एडमिन: फॉर्म सेटिंग्स संपादित करें</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start no-print">
        {/* Form Inputs (6 cols on lg) */}
        <div className="lg:col-span-6 bg-white border border-stone-200 rounded-xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-bold text-stone-900 text-base">
              {isHi ? 'सदस्य विवरण एवं फोटो अपलोड' : 'Member Details & Photo Upload'}
            </h3>
            <span className="text-xs text-amber-800 font-medium">लाइव अपडेट चालू है</span>
          </div>

          {/* PHOTO UPLOAD BOX (Request 1) */}
          <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-xl space-y-3">
            <label className="text-xs font-bold text-amber-950 block">
              {isHi ? 'सदस्य फोटो अपलोड करें * (Device / Gallery)' : 'Upload Member Photo *'}
            </label>

            <div className="flex items-center gap-4">
              {/* Photo Thumbnail Preview */}
              <div className="w-16 h-20 rounded-lg overflow-hidden bg-stone-200 border-2 border-amber-600 shrink-0 relative flex items-center justify-center shadow-xs">
                {formData.photoUrl ? (
                  <img
                    src={formData.photoUrl}
                    alt="Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="w-6 h-6 text-stone-400" />
                )}
              </div>

              {/* Upload Action Buttons */}
              <div className="flex-1 space-y-1.5">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isHi ? 'गैलरी / फाइल से फोटो चुनें (PNG/JPG)' : 'Choose Photo from Device (PNG/JPG)'}</span>
                </button>

                {photoFileName ? (
                  <div className="text-[11px] text-emerald-800 font-medium truncate">
                    {isHi ? `✓ फोटो चयनित: ${photoFileName}` : `✓ Photo Selected: ${photoFileName}`}
                  </div>
                ) : (
                  <div className="text-[11px] text-stone-500">
                    {isHi ? 'मोबाइल या कंप्यूटर से PNG या JPG फोटो चुनें' : 'Choose PNG or JPG photo from Mobile or PC'}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                {isHi ? 'पूरा नाम *' : 'Full Name *'}
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs font-semibold text-stone-900 focus:outline-none focus:border-amber-700"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                {isHi ? 'पिता / पति का नाम *' : 'Father / Husband Name *'}
              </label>
              <input
                type="text"
                value={formData.fatherOrHusbandName}
                onChange={(e) =>
                  setFormData({ ...formData, fatherOrHusbandName: e.target.value })
                }
                className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">
                  {isHi ? 'उपजाति / शाखा *' : 'Subcaste *'}
                </label>
                <input
                  type="text"
                  list="idcard-subcastes"
                  value={formData.subcaste}
                  onChange={(e) => setFormData({ ...formData, subcaste: e.target.value })}
                  placeholder="जांगिड़, पांचाल, धीमान आदि"
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                />
                <datalist id="idcard-subcastes">
                  {(activeConfig.subcastes || []).map((sc: string) => (
                    <option key={sc} value={sc} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">
                  {isHi ? 'स्वगोत्र *' : 'Gotra *'}
                </label>
                <input
                  type="text"
                  value={formData.gotra}
                  onChange={(e) => setFormData({ ...formData, gotra: e.target.value })}
                  placeholder="उदा. वशिष्ठ"
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">
                  {isHi ? 'रक्त समूह (Blood Group)' : 'Blood Group'}
                </label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs bg-white"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">
                  {isHi ? 'जन्म तिथि' : 'DOB'}
                </label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">
                  {isHi ? 'शहर / जिला *' : 'City *'}
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">
                  {isHi ? 'राज्य *' : 'State *'}
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                {isHi ? 'मोबाइल नंबर *' : 'Mobile Number *'}
              </label>
              <input
                type="tel"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Live Card Preview Column (6 cols on lg) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-800" />
              <span>{isHi ? 'डिजिटल पहचान पत्र (लाइव पूर्वावलोकन)' : 'Digital ID Live Preview'}</span>
            </h3>
            <span className="text-xs text-stone-400 font-mono">
              ID: {formData.membershipId}
            </span>
          </div>

          {/* The Actual PVC Card Representation */}
          <div
            id="samaj-id-card"
            className="w-full max-w-md mx-auto aspect-[1.586/1] bg-gradient-to-br from-amber-900 via-amber-950 to-stone-950 rounded-2xl p-4 sm:p-5 text-amber-50 shadow-lg border-2 border-amber-500/50 relative overflow-hidden flex flex-col justify-between"
          >
            {/* Background Watermark/Decor */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-amber-500/10 blur-2xl" />

            {/* Card Header */}
            <div className="relative z-10 border-b border-amber-600/40 pb-2 flex items-center justify-between">
              <div>
                <div className="text-[10px] sm:text-xs tracking-widest text-amber-300 uppercase font-semibold font-hindi">
                  {isHi
                    ? (activeConfig.issuingAuthority || 'अखिल भारतीय विश्वकर्मा समाज महासंघ')
                    : (activeConfig.issuingAuthorityEn || 'All India Vishwakarma Samaj Federation')}
                </div>
                <div className="text-sm sm:text-base font-bold font-display text-white tracking-wide">
                  {isHi
                    ? (activeConfig.titleHi || 'विश्वकर्मा डिजिटल सदस्यता पहचान पत्र')
                    : (activeConfig.titleEn || 'Vishwakarma Digital Membership Identity Card')}
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center font-display text-amber-300 text-xs font-bold shrink-0">
                ॐ
              </div>
            </div>

            {/* Card Body with Real Uploaded Photo */}
            <div className="relative z-10 flex items-center gap-4 py-2">
              {/* Member Photo Box */}
              <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-lg overflow-hidden border-2 border-amber-400/60 bg-stone-800 shrink-0 shadow-xs relative flex items-center justify-center">
                {formData.photoUrl ? (
                  <img
                    src={formData.photoUrl}
                    alt={formData.fullName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-amber-400 font-bold text-2xl font-serif">
                    {formData.fullName.slice(0, 1) || (isHi ? 'वि' : 'V')}
                  </div>
                )}
              </div>

              {/* Member Data */}
              <div className="flex-1 space-y-1 text-xs">
                <div>
                  <div className="text-[10px] text-amber-300/80 uppercase">
                    {isHi ? 'सदस्य का नाम:' : 'Member Name:'}
                  </div>
                  <div className="font-bold text-white text-sm sm:text-base leading-none">
                    {formData.fullName}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[11px] pt-1">
                  <div>
                    <span className="text-amber-200/70">{isHi ? 'पिता/पति: ' : 'Father/Husband: '}</span>
                    <span className="text-white font-medium truncate block">{formData.fatherOrHusbandName}</span>
                  </div>
                  <div>
                    <span className="text-amber-200/70">{isHi ? 'शाखा: ' : 'Subcaste: '}</span>
                    <span className="text-white font-medium">{formData.subcaste}</span>
                  </div>
                  <div>
                    <span className="text-amber-200/70">{isHi ? 'गोत्र: ' : 'Gotra: '}</span>
                    <span className="text-white font-medium">{formData.gotra}</span>
                  </div>
                  <div>
                    <span className="text-amber-200/70">{isHi ? 'रक्त समूह: ' : 'Blood Group: '}</span>
                    <span className="text-amber-300 font-bold">{formData.bloodGroup}</span>
                  </div>
                  <div className="col-span-2 truncate">
                    <span className="text-amber-200/70">{isHi ? 'निवास: ' : 'Residence: '}</span>
                    <span className="text-white font-medium">{formData.city}, {formData.state}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Footer (NO QR CODE - Removed cleanly as requested) */}
            <div className="relative z-10 border-t border-amber-600/40 pt-2 flex items-center justify-between text-[10px] text-amber-300/80">
              <div>
                <div>
                  {isHi ? 'सदस्यता क्र.:' : 'Membership ID:'}{' '}
                  <span className="font-mono text-white font-bold">{formData.membershipId}</span>
                </div>
                <div>
                  {isHi ? 'सत्यापित तिथि:' : 'Issue Date:'} {formData.issueDate} | {isHi ? 'मो.:' : 'Mobile:'} {formData.mobile}
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] text-amber-200 font-display italic">
                  {isHi ? '॥ श्री विश्वकर्माय नमः ॥' : '॥ Shri Vishwakarma Namah ॥'}
                </div>
                <div className="text-[9px] text-amber-400/90 font-semibold">
                  {isHi ? 'अधिकृत समाज पहचान पत्र [सत्यापित]' : 'Official Community ID [Verified]'}
                </div>
              </div>
            </div>
          </div>

          {/* Active Download & Print Action Buttons */}
          <div className="flex items-center gap-3 pt-2 no-print">
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="flex-1 py-2.5 bg-amber-800 hover:bg-amber-900 disabled:bg-stone-400 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>
                {isGenerating
                  ? (isHi ? 'कार्ड तैयार हो रहा है...' : 'Generating Image...')
                  : (isHi ? 'पहचान पत्र डाउनलोड करें (HD PNG)' : 'Download ID Card (HD PNG)')}
              </span>
            </button>

            <button
              onClick={handlePrint}
              disabled={isGenerating}
              className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{isHi ? 'प्रिंट करें' : 'Print'}</span>
            </button>
          </div>

          {downloadSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold text-center flex items-center justify-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>
                {isHi
                  ? `आपकी फोटो युक्त पहचान पत्र (${formData.membershipId}) सफलतापूर्वक डाउनलोड हो गया है!`
                  : `ID Card with photo (${formData.membershipId}) downloaded successfully!`}
              </span>
            </div>
          )}

          <div className="text-[11px] text-stone-500 bg-amber-50/60 p-3 rounded-lg border border-amber-100 leading-relaxed font-hindi">
            {isHi
              ? '💡 निर्देश: अपनी फोटो अपलोड करने के बाद "पहचान पत्र डाउनलोड करें" या "प्रिंट करें" पर क्लिक करें। डाउनलोड व प्रिंट दोनों में आपकी फोटो, सुंदर स्वर्ण-काष्ठ बॉर्डर व सभी विवरण 100% सही व स्पष्ट आएंगे।'
              : 'Tip: After uploading your photo, click Download or Print. Both will output a crisp, full-color card with your photo.'}
          </div>
        </div>
      </div>
    </div>
  );
};
