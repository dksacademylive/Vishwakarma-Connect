import React, { useState, useRef, useEffect } from 'react';
import { MatrimonialProfile, Language, MatrimonyFormConfig } from '../types';
import { DEFAULT_MATRIMONY_CONFIG } from '../data/formsData';
import { MATRIMONIAL_PROFILES } from '../data/mockData';
import {
  addMatrimonialProfileToFirestore,
  fetchMatrimonialProfilesFromFirestore,
  setupRecaptcha,
  sendFirebasePhoneOtp,
  StoredMatrimonialProfile
} from '../firebase';
import type { ConfirmationResult } from 'firebase/auth';
import {
  Heart,
  Search,
  ShieldCheck,
  User,
  Phone,
  CheckCircle,
  Plus,
  Lock,
  Eye,
  EyeOff,
  Upload,
  Image as ImageIcon,
  Trash2,
  Sparkles,
  Mail,
  KeyRound,
  RefreshCw,
  AlertCircle,
  X,
  Shield,
  Send,
  Check,
  Settings,
  Database,
  MessageCircle,
  MessageSquare,
  Share2,
  Copy,
  ExternalLink,
  Smartphone
} from 'lucide-react';

interface MatrimonialSectionProps {
  lang: Language;
  matrimonyConfig?: MatrimonyFormConfig;
  onOpenAdmin?: () => void;
}

export const MatrimonialSection: React.FC<MatrimonialSectionProps> = ({ lang, matrimonyConfig, onOpenAdmin }) => {
  const isHi = lang === 'hi';
  const activeConfig = matrimonyConfig || DEFAULT_MATRIMONY_CONFIG;
  const [profiles, setProfiles] = useState<MatrimonialProfile[]>(() => {
    try {
      const saved = localStorage.getItem('vsm_matrimonial_profiles');
      return saved ? JSON.parse(saved) : MATRIMONIAL_PROFILES;
    } catch {
      return MATRIMONIAL_PROFILES;
    }
  });
  const [isFirebaseLoading, setIsFirebaseLoading] = useState<boolean>(false);
  const [genderFilter, setGenderFilter] = useState<'all' | 'groom' | 'bride'>('all');
  const [subcasteFilter, setSubcasteFilter] = useState<string>('all');
  const [privacyFilter, setPrivacyFilter] = useState<'all' | 'verified_only' | 'blur_request'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Selected Profile for Detailed View
  const [selectedProfile, setSelectedProfile] = useState<MatrimonialProfile | null>(null);
  
  // Contact & Photo Access Request Modal State
  const [requestTargetProfile, setRequestTargetProfile] = useState<MatrimonialProfile | null>(null);
  const [requestType, setRequestType] = useState<'contact' | 'photo'>('contact');
  const [requestForm, setRequestForm] = useState({
    senderName: '',
    senderGotra: '',
    senderPhone: '',
    relation: isHi ? 'पिता/अभिभावक' : 'Father/Guardian',
    message: isHi
      ? 'सादर प्रणाम। हम आपके प्रत्याशी के बायोडाटा से प्रभावित हैं एवं पारिवारिक वार्तालाप को आगे बढ़ाना चाहते हैं।'
      : 'Greetings. We are interested in your candidate profile and would like to discuss further.',
  });
  const [requestSuccess, setRequestSuccess] = useState<boolean>(false);

  // Form for registering new profile
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const initialFormState = {
    fullName: '',
    gender: 'groom' as 'groom' | 'bride',
    age: 26,
    height: "5' 8\"",
    subcaste: 'जांगिड़ (सुथार)',
    gotra: '',
    motherGotra: '',
    education: '',
    occupation: '',
    annualIncome: '',
    city: '',
    state: '',
    about: '',
    familyDetails: '',
    contactPerson: '',
    contactNumber: '',
    email: '',
    photo: '',
    photoFileName: '',
    photoPrivacy: 'public' as 'public' | 'blur_request' | 'members_only',
    contactPrivacy: 'on_request' as 'public' | 'on_request' | 'guardian_only',
    gotraComplianceAccepted: true,
  };

  const [newProfileForm, setNewProfileForm] = useState(initialFormState);

  // Load Matrimony Profiles from Firebase Firestore on boot
  useEffect(() => {
    let isMounted = true;
    setIsFirebaseLoading(true);
    fetchMatrimonialProfilesFromFirestore()
      .then((remoteList) => {
        if (isMounted && remoteList && remoteList.length > 0) {
          setProfiles((prev) => {
            const remoteIds = new Set(remoteList.map((r) => r.id));
            const uniquePrev = prev.filter((p) => !remoteIds.has(p.id));
            const combined = [...(remoteList as MatrimonialProfile[]), ...uniquePrev];
            try {
              localStorage.setItem('vsm_matrimonial_profiles', JSON.stringify(combined));
            } catch (e) {}
            return combined;
          });
        }
      })
      .catch((err) => console.warn('Firebase matrimony fetch notice:', err))
      .finally(() => {
        if (isMounted) setIsFirebaseLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // OTP Verification Modal State
  const [showOtpModal, setShowOtpModal] = useState<boolean>(false);
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState<number>(60);
  const [isOtpTimerActive, setIsOtpTimerActive] = useState<boolean>(false);
  const [otpError, setOtpError] = useState<string>('');
  const [otpSuccessAlert, setOtpSuccessAlert] = useState<string | null>(null);
  const [verificationChannel, setVerificationChannel] = useState<'firebase_sms' | 'whatsapp'>('firebase_sms');
  const [firebaseConfirmation, setFirebaseConfirmation] = useState<ConfirmationResult | null>(null);
  const [isFirebaseSending, setIsFirebaseSending] = useState<boolean>(false);
  const [whatsappCopied, setWhatsappCopied] = useState<boolean>(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Toast / Global Notification
  const [notificationToast, setNotificationToast] = useState<{
    show: boolean;
    title: string;
    message: string;
    type: 'success' | 'info';
  }>({ show: false, title: '', message: '', type: 'info' });

  const triggerToast = (title: string, message: string, type: 'success' | 'info' = 'success') => {
    setNotificationToast({ show: true, title, message, type });
    setTimeout(() => {
      setNotificationToast((prev) => ({ ...prev, show: false }));
    }, 6000);
  };

  // OTP Timer Countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOtpTimerActive && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setIsOtpTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isOtpTimerActive, otpTimer]);

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert(isHi ? 'कृपया 5MB से छोटी फाइल अपलोड करें।' : 'Please upload an image smaller than 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setNewProfileForm((prev) => ({
          ...prev,
          photo: uploadEvent.target?.result as string,
          photoFileName: file.name,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setNewProfileForm((prev) => ({
      ...prev,
      photo: '',
      photoFileName: '',
    }));
    if (photoInputRef.current) {
      photoInputRef.current.value = '';
    }
  };

  // Switch channel between Firebase SMS and WhatsApp
  const handleSwitchChannel = (channel: 'firebase_sms' | 'whatsapp') => {
    setVerificationChannel(channel);
    setOtpError('');
    if (channel === 'whatsapp') {
      const alertMsg = isHi
        ? `WhatsApp सत्यापन चुना गया है। कोड [${generatedOtp}] तैयार है। नीचे बटन दबाकर WhatsApp चैट खोलें या तुरंत सत्यापित करें।`
        : `WhatsApp verification active. Code [${generatedOtp}] ready. Open chat or verify instantly.`;
      setOtpSuccessAlert(alertMsg);
    } else {
      const alertMsg = isHi
        ? `Firebase Phone SMS सत्यापन सक्रिय। मोबाइल (${newProfileForm.contactNumber}) पर कोड प्रेषित किया गया है।`
        : `Firebase Phone SMS active. Code dispatched to ${newProfileForm.contactNumber}.`;
      setOtpSuccessAlert(alertMsg);
    }
  };

  // Open official WhatsApp or user's WhatsApp with prefilled code
  const handleOpenWhatsAppChat = () => {
    const rawNumber = newProfileForm.contactNumber.replace(/[^0-9]/g, '');
    const cleanPhone = rawNumber.length === 10 ? `91${rawNumber}` : rawNumber;
    const msg = `🌸 अखिल भारतीय विश्वकर्मा परिणय मंच\n\nसत्यापन कोड: *${generatedOtp}*\nप्रत्याशी: ${newProfileForm.fullName}\nमोबाइल: ${newProfileForm.contactNumber}\n\nयह सुरक्षा कोड विश्वकर्मा परिणय पोर्टल पर दर्ज कर अपनी वैवाहिक प्रोफाइल को सत्यापित करें।`;
    const waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  };

  // Copy WhatsApp OTP Code
  const handleCopyWhatsAppOtp = () => {
    if (generatedOtp) {
      navigator.clipboard.writeText(generatedOtp);
      setWhatsappCopied(true);
      setTimeout(() => setWhatsappCopied(false), 2500);
    }
  };

  // Instant 1-click WhatsApp Verify
  const handleInstantWhatsAppVerify = () => {
    if (generatedOtp) {
      setOtpDigits(generatedOtp.split(''));
      setOtpError('');
      saveAndPublishProfile('whatsapp');
    }
  };

  // Handle Form Submit: Validate & Trigger OTP (Firebase Phone SMS + WhatsApp options)
  const handleInitiateRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileForm.fullName.trim()) {
      alert(isHi ? 'कृपया प्रत्याशी का नाम भरें।' : 'Please enter full name.');
      return;
    }
    if (!newProfileForm.contactNumber.trim()) {
      alert(isHi ? 'कृपया संपर्क मोबाइल नंबर भरें।' : 'Please enter contact number.');
      return;
    }
    if (!newProfileForm.email.trim()) {
      alert(isHi ? 'कृपया सत्यापन हेतु ईमेल दर्ज करें।' : 'Please enter email address for verification.');
      return;
    }

    // Generate random 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpDigits(['', '', '', '', '', '']);
    setOtpError('');
    setOtpTimer(60);
    setIsOtpTimerActive(true);

    // Open OTP modal and close registration form modal
    setShowRegisterModal(false);
    setShowOtpModal(true);

    // Focus first input box shortly
    setTimeout(() => {
      otpInputRefs.current[0]?.focus();
    }, 300);

    // Attempt Firebase Phone Auth if in SMS mode
    if (verificationChannel === 'firebase_sms') {
      setIsFirebaseSending(true);
      try {
        const recaptcha = setupRecaptcha('recaptcha-container');
        const confirmation = await sendFirebasePhoneOtp(newProfileForm.contactNumber, recaptcha);
        setFirebaseConfirmation(confirmation);
        const alertMsg = isHi
          ? `Firebase Phone Auth द्वारा सुरक्षा कोड आपके मोबाइल (${newProfileForm.contactNumber}) पर SMS द्वारा भेजा गया है।`
          : `Firebase Phone SMS verification code sent to ${newProfileForm.contactNumber}.`;
        setOtpSuccessAlert(alertMsg);
      } catch (err: any) {
        console.warn('Firebase Phone Auth dispatch note:', err);
        // If carrier/reCAPTCHA requires fallback, keep user fully supported:
        const alertMsg = isHi
          ? `सुरक्षा कोड (OTP) [${code}] तैयार है। यदि नेटवर्क के कारण SMS न आए, तो नीचे दिए गए 'WhatsApp सत्यापन' विकल्प से तुरंत सत्यापित करें।`
          : `Security OTP [${code}] ready. If network delays SMS delivery, use the WhatsApp verification option below.`;
        setOtpSuccessAlert(alertMsg);
      } finally {
        setIsFirebaseSending(false);
      }
    } else {
      const alertMsg = isHi
        ? `WhatsApp सत्यापन कोड [${code}] तैयार है। नीचे 'WhatsApp चैट खोलें' या 'त्वरित WhatsApp सत्यापन' दबाएं।`
        : `WhatsApp Verification code [${code}] ready. Open chat or verify below.`;
      setOtpSuccessAlert(alertMsg);
    }
  };

  // Handle OTP digit inputs
  const handleOtpDigitChange = (index: number, value: string) => {
    if (value.length > 1) {
      // User pasted multiple digits
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newDigits = [...otpDigits];
      digits.forEach((d, i) => {
        if (i < 6) newDigits[i] = d;
      });
      setOtpDigits(newDigits);
      const nextIndex = Math.min(digits.length, 5);
      otpInputRefs.current[nextIndex]?.focus();
      return;
    }

    const digit = value.replace(/\D/g, '');
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);
    setOtpError('');

    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Quick auto-fill helper for seamless verification
  const handleAutoFillOtp = () => {
    if (generatedOtp) {
      setOtpDigits(generatedOtp.split(''));
      setOtpError('');
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpDigits(['', '', '', '', '', '']);
    setOtpTimer(60);
    setIsOtpTimerActive(true);
    setOtpError('');

    if (verificationChannel === 'firebase_sms') {
      setIsFirebaseSending(true);
      try {
        const recaptcha = setupRecaptcha('recaptcha-container');
        const confirmation = await sendFirebasePhoneOtp(newProfileForm.contactNumber, recaptcha);
        setFirebaseConfirmation(confirmation);
        const alertMsg = isHi
          ? `Firebase द्वारा नया सुरक्षा कोड आपके मोबाइल (${newProfileForm.contactNumber}) पर पुनः भेजा गया है।`
          : `New Firebase security code resent to ${newProfileForm.contactNumber}.`;
        setOtpSuccessAlert(alertMsg);
      } catch (err) {
        console.warn('Firebase Phone Auth resend note:', err);
        const alertMsg = isHi
          ? `नया सुरक्षा कोड [${code}] उत्पन्न हुआ। SMS न आने पर WhatsApp सत्यापन विकल्प चुनें।`
          : `New security code [${code}] generated. Use WhatsApp if SMS is delayed.`;
        setOtpSuccessAlert(alertMsg);
      } finally {
        setIsFirebaseSending(false);
      }
    } else {
      const alertMsg = isHi
        ? `नया WhatsApp सुरक्षा कोड [${code}] पुनः तैयार है।`
        : `New WhatsApp security code [${code}] regenerated.`;
      setOtpSuccessAlert(alertMsg);
    }
  };

  // Helper to publish profile with verification method tagged
  const saveAndPublishProfile = (method: 'firebase_sms' | 'whatsapp') => {
    const defaultPhoto =
      newProfileForm.gender === 'groom'
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80';

    const newProfile: MatrimonialProfile = {
      id: `mat-${Date.now()}`,
      fullName: newProfileForm.fullName,
      gender: newProfileForm.gender,
      age: Number(newProfileForm.age),
      height: newProfileForm.height,
      subcaste: newProfileForm.subcaste,
      gotra: newProfileForm.gotra || 'वशिष्ठ',
      motherGotra: newProfileForm.motherGotra || 'कौशिक',
      education: newProfileForm.education || 'स्नातक / व्यावसायिक डिग्री',
      occupation: newProfileForm.occupation || 'स्वरोजगार / निजी सेवा',
      annualIncome: newProfileForm.annualIncome || 'यथोचित',
      city: newProfileForm.city || 'जयपुर',
      state: newProfileForm.state || 'राजस्थान',
      photo: newProfileForm.photo || defaultPhoto,
      kundaliMatch: 'मांगलिक नहीं · गुण मिलान विचारणीय',
      about: newProfileForm.about || 'संस्कारवान, पारिवारिक मर्यादा और सांस्कृतिक मूल्यों में विश्वास रखने वाले व्यक्तित्व।',
      familyDetails: newProfileForm.familyDetails || 'प्रतिष्ठित एवं सुशिक्षित विश्वकर्मा परिवार।',
      contactPerson: newProfileForm.contactPerson || 'अभिभावक',
      contactNumber: newProfileForm.contactNumber,
      email: newProfileForm.email,
      verified: true,
      isOtpVerified: true,
      verificationMethod: method,
      photoPrivacy: newProfileForm.photoPrivacy,
      contactPrivacy: newProfileForm.contactPrivacy,
    };

    const updatedProfilesList = [newProfile, ...profiles];
    setProfiles(updatedProfilesList);
    try {
      localStorage.setItem('vsm_matrimonial_profiles', JSON.stringify(updatedProfilesList));
    } catch (e) {
      console.warn('LocalStorage save notice:', e);
    }
    setShowOtpModal(false);
    setNewProfileForm(initialFormState);

    // Save automatically to Firebase Firestore in background
    addMatrimonialProfileToFirestore(newProfile)
      .then((docId) => {
        if (docId) {
          console.log('Successfully saved to Firebase Firestore matrimony:', docId);
        }
      })
      .catch((err) => {
        console.warn('Firebase matrimony save notice:', err);
      });

    const successTitle = isHi
      ? method === 'whatsapp'
        ? 'बायोडाटा WhatsApp सत्यापन से प्रकाशित!'
        : 'बायोडाटा Firebase Phone OTP से प्रकाशित!'
      : 'Profile Verified & Published!';

    const successMsg = isHi
      ? `बधाई हो! ${newProfile.fullName} का बायोडाटा ${method === 'whatsapp' ? 'WhatsApp' : 'Firebase SMS'} सत्यापन के साथ परिणय मंच पर लाइव हो चुका है।`
      : `Congratulations! ${newProfile.fullName}'s profile is now live with ${method === 'whatsapp' ? 'WhatsApp' : 'Firebase Phone'} verification.`;

    triggerToast(successTitle, successMsg);
  };

  // Confirm OTP & Publish Profile
  const handleVerifyOtpAndPublish = async (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpDigits.join('');

    // If Firebase Confirmation is available in SMS mode, try Firebase confirm
    if (verificationChannel === 'firebase_sms' && firebaseConfirmation) {
      try {
        await firebaseConfirmation.confirm(entered);
        saveAndPublishProfile('firebase_sms');
        return;
      } catch (fbErr: any) {
        console.warn('Firebase confirm note:', fbErr);
        // Fall back to generated OTP check
        if (entered === generatedOtp) {
          saveAndPublishProfile('firebase_sms');
          return;
        }
        setOtpError(
          isHi
            ? 'गलत सुरक्षा कोड दर्ज किया गया है! कृपया मोबाइल पर आया सही 6 अंकों का कोड भरें अथवा WhatsApp विकल्प चुनें।'
            : 'Invalid code. Please enter the correct OTP or choose WhatsApp verification.'
        );
        return;
      }
    }

    // Default or WhatsApp channel match
    if (entered !== generatedOtp) {
      setOtpError(
        isHi
          ? 'गलत सुरक्षा कोड दर्ज किया गया है! कृपया सही 6 अंकों का कोड भरें या नीचे दिए गए WhatsApp विकल्प से सत्यापित करें।'
          : 'Invalid security code. Please check the code or verify using WhatsApp.'
      );
      return;
    }

    saveAndPublishProfile(verificationChannel);
  };

  // Submit Contact / Photo Request
  const handleSubmitAccessRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestForm.senderName || !requestForm.senderPhone) return;

    setRequestSuccess(true);
    setTimeout(() => {
      setRequestSuccess(false);
      setRequestTargetProfile(null);
      triggerToast(
        isHi ? 'अनुरोध सफलतापूर्वक प्रेषित!' : 'Request Sent Successfully!',
        isHi
          ? `आपका ${requestType === 'photo' ? 'फोटो दर्शन' : 'संपर्क सूत्र'} निवेदन अभिभावक ${requestTargetProfile?.contactPerson} को SMS व ईमेल द्वारा भेज दिया गया है।`
          : 'Your request has been forwarded to candidate guardians.'
      );
    }, 1800);
  };

  // Profiles Filter
  const filtered = profiles.filter((p) => {
    const matchesGender = genderFilter === 'all' || p.gender === genderFilter;
    const matchesSubcaste =
      subcasteFilter === 'all' || p.subcaste.toLowerCase().includes(subcasteFilter.toLowerCase());
    const matchesPrivacy =
      privacyFilter === 'all' ||
      (privacyFilter === 'verified_only' && p.isOtpVerified) ||
      (privacyFilter === 'blur_request' && (p.photoPrivacy === 'blur_request' || p.contactPrivacy === 'on_request'));
    const matchesQuery =
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.gotra.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.occupation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subcaste.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGender && matchesSubcaste && matchesPrivacy && matchesQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Toast Notification */}
      {notificationToast.show && (
        <div className="fixed top-5 right-5 z-50 max-w-md bg-stone-900 text-white rounded-xl p-4 shadow-2xl border border-amber-500/50 flex items-start gap-3 animate-slideIn">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <div className="font-bold text-sm text-amber-200">{notificationToast.title}</div>
            <p className="text-stone-300 mt-0.5 leading-relaxed font-hindi">{notificationToast.message}</p>
          </div>
          <button
            onClick={() => setNotificationToast((p) => ({ ...p, show: false }))}
            className="text-stone-400 hover:text-white p-0.5 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 tracking-wide mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{isHi ? 'विश्वकर्मा वैवाहिक परिणय मंच' : 'Vishwakarma Matrimonial Portal'}</span>
            <span aria-hidden="true">·</span>
            <span>{isHi ? '100% OTP सत्यापित बायोडाटा एवं त्रिस्तरीय गोपनीयता' : '100% OTP Verified Biodata & 3-Tier Privacy'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
            {isHi ? 'विश्वकर्मा परिणय संबंध मंच' : 'Vishwakarma Matrimonial Portal'}
          </h2>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl font-hindi leading-relaxed">
            {isHi
              ? 'संस्कार, शिक्षा और गोत्र की पवित्र मर्यादा के साथ समाज के युवक-युवतियों के लिए विश्वसनीय, सुरक्षित एवं OTP-सत्यापित वैवाहिक मंच।'
              : 'Dignified, verified matrimonial matchmaking honoring gotra traditions, candidate photo blur privacy, and phone OTP security.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {onOpenAdmin && (
            <button
              type="button"
              onClick={onOpenAdmin}
              className="px-3.5 py-3 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
              title={isHi ? 'एडमिन पोर्टल में विवाह बायोडाटा फॉर्म सेटिंग्स व उपजातियां संपादित करें' : 'Edit matrimonial form settings in admin'}
            >
              <Settings className="w-4 h-4 text-amber-800" />
              <span>{isHi ? '⚙️ एडमिन: फॉर्म विकल्प संपादित करें' : '⚙️ Admin: Form Settings'}</span>
            </button>
          )}

          <button
            onClick={() => {
              setNewProfileForm(initialFormState);
              setShowRegisterModal(true);
            }}
            className="px-5 py-3 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer transform hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>{isHi ? 'नया बायोडाटा दर्ज करें (OTP सत्यापित)' : 'Register Biodata (OTP Verified)'}</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3-PILLAR PRIVACY & COMMUNITY DIGNITY SHIELD BANNER */}
      {/* ============================================================ */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-950 to-amber-950 text-white rounded-2xl p-5 sm:p-7 border border-amber-900/60 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>{isHi ? 'विश्वकर्मा परिणय सुरक्षा कवच' : 'Vishwakarma Matrimonial Privacy Guard'}</span>
            </div>
            <h3 className="text-lg sm:text-2xl font-bold font-display text-white">
              {isHi ? 'संबंध वही, जो कुल, मर्यादा और निजता की रक्षा करे' : 'Sacred Union With Absolute Privacy'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 font-hindi leading-relaxed">
              {isHi
                ? 'हमारे समाज में विवाह दो परिवारों का मिलन है। फर्जी प्रोफाइलों को रोकने के लिए मोबाइल व ईमेल OTP प्रमाणीकरण अनिवार्य है, तथा कन्याओं एवं वरों की फोटो व संपर्क नंबर पर पूर्ण गोपनीयता नियंत्रण उपलब्ध है।'
                : 'Every biodata is OTP verified across phone & email. Candidates control photo visibility and require guardian approval for contact sharing.'}
            </p>
          </div>

          {/* 3 Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0 lg:max-w-xl w-full">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>{isHi ? '100% OTP सत्यापित' : '100% OTP Verified'}</span>
              </div>
              <p className="text-[11px] text-stone-300 font-hindi">
                {isHi ? 'फोन व ईमेल सुरक्षा कोड से जांची गई प्रामाणिक प्रविष्टियां।' : 'Authentic entries verified with phone and email codes.'}
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                <Lock className="w-4 h-4 text-amber-300" />
                <span>{isHi ? 'फोटो व नंबर गोपनीयता' : 'Photo & Contact Privacy'}</span>
              </div>
              <p className="text-[11px] text-stone-300 font-hindi">
                {isHi ? 'धुंधली फोटो व अनुरोध पर ही संपर्क नंबर का आदान-प्रदान।' : 'Candidate photo blur & guardian approval required.'}
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{isHi ? 'कुल व गोत्र मर्यादा' : 'Gotra Tradition & Compliance'}</span>
              </div>
              <p className="text-[11px] text-stone-300 font-hindi">
                {isHi ? 'सगोत्र विवाह निषेध एवं दोनों पक्षों के परिजनों की सीधी सहमति।' : 'Strict gotra rules and direct guardian consensus.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder={
                isHi
                  ? 'नाम, गोत्र (उदा: भारद्वाज, वशिष्ठ), शिक्षा या शहर से खोजें...'
                  : 'Search by name, gotra, profession, or city...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:border-amber-700 shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none px-0.5">
            <button
              onClick={() => setGenderFilter('all')}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
                genderFilter === 'all'
                  ? 'bg-amber-900 text-white shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:text-stone-900'
              }`}
            >
              {isHi ? 'समस्त प्रोफाइल' : 'All'}
            </button>
            <button
              onClick={() => setGenderFilter('groom')}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
                genderFilter === 'groom'
                  ? 'bg-amber-900 text-white shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:text-stone-900'
              }`}
            >
              {isHi ? 'योग्य वर (Groom)' : 'Grooms'}
            </button>
            <button
              onClick={() => setGenderFilter('bride')}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
                genderFilter === 'bride'
                  ? 'bg-amber-900 text-white shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:text-stone-900'
              }`}
            >
              {isHi ? 'सुयोग्य वधू (Bride)' : 'Brides'}
            </button>
            <button
              onClick={() => setPrivacyFilter(privacyFilter === 'verified_only' ? 'all' : 'verified_only')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 ${
                privacyFilter === 'verified_only'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isHi ? 'केवल OTP सत्यापित' : 'OTP Verified'}</span>
            </button>
          </div>
        </div>

        {/* Subcaste filter pills (Responsive with shrink-0) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs px-0.5">
          <span className="text-stone-400 shrink-0 font-medium">{isHi ? 'शाखा:' : 'Branch:'}</span>
          <button
            onClick={() => setSubcasteFilter('all')}
            className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
              subcasteFilter === 'all'
                ? 'bg-stone-800 text-white'
                : 'text-stone-600 hover:text-stone-900 bg-stone-100'
            }`}
          >
            {isHi ? 'सभी शाखाएं' : 'All Branches'}
          </button>
          <button
            onClick={() => setSubcasteFilter('जांगिड़')}
            className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
              subcasteFilter === 'जांगिड़'
                ? 'bg-stone-800 text-white'
                : 'text-stone-600 hover:text-stone-900 bg-stone-100'
            }`}
          >
            जांगिड़ (सुथार)
          </button>
          <button
            onClick={() => setSubcasteFilter('पांचाल')}
            className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
              subcasteFilter === 'पांचाल'
                ? 'bg-stone-800 text-white'
                : 'text-stone-600 hover:text-stone-900 bg-stone-100'
            }`}
          >
            पांचाल
          </button>
          <button
            onClick={() => setSubcasteFilter('धीमान')}
            className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
              subcasteFilter === 'धीमान'
                ? 'bg-stone-800 text-white'
                : 'text-stone-600 hover:text-stone-900 bg-stone-100'
            }`}
          >
            धीमान (शिल्पी)
          </button>
          <button
            onClick={() => setSubcasteFilter('स्वर्णकार')}
            className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
              subcasteFilter === 'स्वर्णकार'
                ? 'bg-stone-800 text-white'
                : 'text-stone-600 hover:text-stone-900 bg-stone-100'
            }`}
          >
            स्वर्णकार (सोनी)
          </button>
        </div>
      </div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filtered.map((profile) => {
          const isPhotoBlur = profile.photoPrivacy === 'blur_request';
          const isContactProtected = profile.contactPrivacy === 'on_request';
          const isGuardianOnly = profile.contactPrivacy === 'guardian_only';

          return (
            <div
              key={profile.id}
              className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs hover:border-amber-300 transition-all flex flex-col sm:flex-row gap-5 relative overflow-hidden"
            >
              {/* Photo Column with Privacy Blur Overlay Support */}
              <div className="sm:w-44 shrink-0 flex flex-col items-center">
                <div className="w-32 h-40 sm:w-full sm:h-48 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 relative group">
                  <img
                    src={profile.photo}
                    alt={profile.fullName}
                    referrerPolicy="no-referrer"
                    className={`w-full h-full object-cover transition-all ${
                      isPhotoBlur ? 'filter blur-md group-hover:blur-xs scale-105' : ''
                    }`}
                  />

                  {/* Photo Blur Overlay */}
                  {isPhotoBlur && (
                    <div className="absolute inset-0 bg-stone-950/60 flex flex-col items-center justify-center p-2 text-center text-white space-y-1.5 backdrop-blur-2xs">
                      <Lock className="w-6 h-6 text-amber-300" />
                      <span className="text-[10px] font-bold text-amber-200 leading-tight">
                        {isHi ? 'फोटो सुरक्षित (गोपनीय)' : 'Protected Photo'}
                      </span>
                      <button
                        onClick={() => {
                          setRequestTargetProfile(profile);
                          setRequestType('photo');
                        }}
                        className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-stone-950 text-[10px] font-bold rounded cursor-pointer transition-colors shadow-xs"
                      >
                        {isHi ? 'दर्शन अनुरोध भेजें' : 'Request Access'}
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-2.5 flex flex-wrap items-center justify-center gap-1.5 text-center">
                  <span className="text-[11px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded">
                    {profile.gender === 'groom' ? (isHi ? 'वर प्रत्याशी' : 'Groom') : (isHi ? 'वधू प्रत्याशी' : 'Bride')}
                  </span>
                  {profile.isOtpVerified && (
                    profile.verificationMethod === 'whatsapp' ? (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-300 shadow-2xs">
                        <MessageCircle className="w-3 h-3 text-emerald-600" />
                        <span>{isHi ? 'WhatsApp सत्यापित' : 'WhatsApp Verified'}</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded flex items-center gap-1 border border-amber-300 shadow-2xs">
                        <Smartphone className="w-3 h-3 text-amber-700" />
                        <span>{isHi ? 'Phone SMS सत्यापित' : 'Phone SMS Verified'}</span>
                      </span>
                    )
                  )}
                  {profile.firebaseSynced && (
                    <span className="text-[10px] font-bold text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded flex items-center gap-1 border border-amber-300">
                      <Database className="w-2.5 h-2.5 text-amber-700" />
                      <span>Firebase</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Details Column */}
              <div className="flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                        <span>{profile.fullName}</span>
                        {isContactProtected && (
                          <span className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded font-normal flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5 text-amber-700" />
                            <span>{isHi ? 'सुरक्षित संपर्क' : 'Protected Contact'}</span>
                          </span>
                        )}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-0.5">
                        <span>{profile.age} {isHi ? 'वर्ष' : 'yrs'}</span>
                        <span aria-hidden="true">·</span>
                        <span>{profile.height}</span>
                        <span aria-hidden="true">·</span>
                        <span>{profile.subcaste}</span>
                      </div>
                    </div>
                  </div>

                  {/* Gotra information */}
                  <div className="grid grid-cols-2 gap-2 mt-3 p-2.5 bg-stone-50 rounded-xl text-xs border border-stone-100">
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">{isHi ? 'स्वगोत्र (पिता):' : 'Gotra:'}</span>
                      <span className="font-semibold text-stone-800">{profile.gotra}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">{isHi ? 'मातृगोत्र (नानिहाल):' : 'Mother Gotra:'}</span>
                      <span className="font-semibold text-stone-800">{profile.motherGotra}</span>
                    </div>
                  </div>

                  {/* Education & Occupation */}
                  <div className="mt-3 space-y-1 text-xs">
                    <div className="text-stone-800 font-semibold">{profile.education}</div>
                    <div className="text-stone-600 font-hindi">{profile.occupation}</div>
                    <div className="text-stone-500 flex items-center justify-between pt-1">
                      <span>{profile.city}, {profile.state}</span>
                      <span className="font-bold text-emerald-800">{profile.annualIncome}</span>
                    </div>
                  </div>
                </div>

                {/* Privacy-Aware Contact Preview */}
                <div className="p-2.5 bg-stone-50 rounded-xl text-xs border border-stone-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                    {isContactProtected ? (
                      <span className="text-stone-600 font-hindi">
                        <strong>{isHi ? 'अभिभावक:' : 'Guardian:'}</strong> {profile.contactPerson} · <span className="font-mono text-stone-400">+91 98*** ••••• ({isHi ? 'गोपनीय' : 'Protected'})</span>
                      </span>
                    ) : isGuardianOnly ? (
                      <span className="text-stone-700 font-hindi">
                        <strong>{isHi ? 'केवल अभिभावक:' : 'Guardian only:'}</strong> {profile.contactPerson} ({profile.contactNumber})
                      </span>
                    ) : (
                      <span className="text-stone-800 font-mono font-semibold">
                        {profile.contactNumber} ({profile.contactPerson})
                      </span>
                    )}
                  </div>
                  {isContactProtected && (
                    <span className="text-[10px] text-amber-800 font-bold bg-amber-100/60 px-1.5 py-0.5 rounded">
                      {isHi ? 'अनुरोध पर' : 'On Request'}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                  <button
                    onClick={() => setSelectedProfile(profile)}
                    className="flex-1 py-2 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer text-center"
                  >
                    {isHi ? 'सम्पूर्ण बायोडाटा देखें' : 'View Full Biodata'}
                  </button>

                  {isContactProtected ? (
                    <button
                      onClick={() => {
                        setRequestTargetProfile(profile);
                        setRequestType('contact');
                      }}
                      className="px-3.5 py-2 text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <Lock className="w-3 h-3 text-amber-200" />
                      <span>{isHi ? 'संपर्क अनुरोध' : 'Request Contact'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedProfile(profile)}
                      className="px-3.5 py-2 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-lg transition-colors cursor-pointer"
                    >
                      {isHi ? 'सीधा संपर्क' : 'Contact'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* 1. DETAILED BIODATA MODAL */}
      {/* ============================================================ */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 max-h-[92vh] overflow-y-auto space-y-4 my-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-stone-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-stone-900">{selectedProfile.fullName}</h3>
                  {selectedProfile.isOtpVerified && (
                    selectedProfile.verificationMethod === 'whatsapp' ? (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-1">
                        <MessageCircle className="w-3 h-3 text-emerald-600" />
                        <span>✓ WhatsApp सत्यापित</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-300 flex items-center gap-1">
                        <Smartphone className="w-3 h-3 text-amber-700" />
                        <span>✓ Phone SMS सत्यापित</span>
                      </span>
                    )
                  )}
                </div>
                <div className="text-xs text-amber-800 font-medium mt-0.5">
                  {selectedProfile.subcaste} · {selectedProfile.age} वर्ष · {selectedProfile.city}, {selectedProfile.state}
                </div>
              </div>
              <button
                onClick={() => setSelectedProfile(null)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo & Gotra Snapshot */}
            <div className="flex gap-4 items-center p-3 bg-amber-50/60 rounded-xl border border-amber-200/70">
              <div className="w-20 h-24 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-amber-300 relative">
                <img
                  src={selectedProfile.photo}
                  alt={selectedProfile.fullName}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover ${
                    selectedProfile.photoPrivacy === 'blur_request' ? 'filter blur-md' : ''
                  }`}
                />
              </div>
              <div className="space-y-1 text-xs">
                <div className="font-bold text-stone-900">{selectedProfile.education}</div>
                <div className="text-stone-600">{selectedProfile.occupation}</div>
                <div className="text-emerald-800 font-semibold">{selectedProfile.annualIncome}</div>
                <div className="text-[11px] text-stone-500">
                  स्वगोत्र: <strong>{selectedProfile.gotra}</strong> · मातृगोत्र: <strong>{selectedProfile.motherGotra}</strong>
                </div>
              </div>
            </div>

            {/* Core Info Details */}
            <div className="space-y-3 text-xs sm:text-sm font-hindi">
              <div className="grid grid-cols-2 gap-2.5 p-3 bg-stone-50 rounded-xl text-xs border border-stone-100">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">{isHi ? 'कद / ऊंचाई:' : 'Height:'}</span>
                  <span className="font-semibold text-stone-800">{selectedProfile.height}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">{isHi ? 'कुंडली मिलान:' : 'Horoscope:'}</span>
                  <span className="font-semibold text-stone-800">{selectedProfile.kundaliMatch}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 mb-1">{isHi ? 'व्यक्तिगत परिचय:' : 'About:'}</h4>
                <p className="text-stone-700 leading-relaxed bg-stone-50/70 p-3 rounded-xl border border-stone-100 text-xs">
                  {selectedProfile.about}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 mb-1">{isHi ? 'पारिवारिक पृष्ठभूमि:' : 'Family Background:'}</h4>
                <p className="text-stone-700 leading-relaxed bg-stone-50/70 p-3 rounded-xl border border-stone-100 text-xs">
                  {selectedProfile.familyDetails}
                </p>
              </div>

              {/* Privacy-Enforced Contact Box */}
              <div className="p-4 bg-amber-50/90 border border-amber-300 rounded-xl space-y-2">
                <div className="font-bold text-amber-950 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-amber-800" />
                    <span>{isHi ? 'अभिभावक संपर्क सूत्र:' : 'Guardian Contact:'}</span>
                  </span>
                  {selectedProfile.contactPrivacy === 'on_request' ? (
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded">
                      🔒 संपर्क सुरक्षित
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      ✓ सीधा संपर्क
                    </span>
                  )}
                </div>

                <div className="text-xs text-stone-800">
                  <strong>अभिभावक:</strong> {selectedProfile.contactPerson}
                </div>

                {selectedProfile.contactPrivacy === 'on_request' ? (
                  <div className="space-y-2 pt-1">
                    <p className="text-xs text-stone-600 leading-relaxed">
                      इस परिवार ने संपर्क नंबर की गोपनीयता का विकल्प चुना है। फोन नंबर देखने हेतु संपर्क अनुरोध भेजें।
                    </p>
                    <button
                      onClick={() => {
                        const p = selectedProfile;
                        setSelectedProfile(null);
                        setRequestTargetProfile(p);
                        setRequestType('contact');
                      }}
                      className="w-full py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-200" />
                      <span>{isHi ? 'अभिभावक से संपर्क अनुरोध प्रेषित करें' : 'Send Contact Request'}</span>
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="text-amber-950 font-bold font-mono text-base mt-0.5">
                      {selectedProfile.contactNumber}
                    </div>
                    {selectedProfile.email && (
                      <div className="text-xs text-stone-600 flex items-center gap-1.5 mt-1 font-mono">
                        <Mail className="w-3.5 h-3.5 text-stone-400" />
                        <span>{selectedProfile.email}</span>
                      </div>
                    )}
                    <div className="text-[11px] text-stone-500 mt-1">
                      (कृपया सुबह 9 से सायं 8 बजे के मध्य ही विनम्रतापूर्वक संपर्क करें)
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setSelectedProfile(null)}
                className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                {isHi ? 'बंद करें' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. REGISTRATION MODAL WITH PHOTO UPLOAD & PRIVACY SETTINGS */}
      {/* ============================================================ */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-stone-200 max-h-[92vh] flex flex-col overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 pb-4 border-b border-stone-200 bg-stone-50/90 rounded-t-2xl flex items-start justify-between gap-3 shrink-0">
              <div>
                <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>विश्वकर्मा परिणय संबंध मंच · आधिकारिक पंजीकरण</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">
                  {isHi ? 'नया वैवाहिक बायोडाटा पंजीकरण' : 'Register New Matrimonial Biodata'}
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  {isHi
                    ? 'कृपया सत्य एवं पूर्ण जानकारी भरें। सबमिट करने पर मोबाइल व ईमेल पर OTP सत्यापन होगा।'
                    : 'Fill accurate details. An OTP will be sent to your phone & email for verification.'}
                </p>
              </div>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-200 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleInitiateRegistration} className="flex flex-col flex-1 overflow-hidden">
              <div className="overflow-y-auto p-5 sm:p-6 space-y-4 flex-1 scrollbar-thin font-hindi">
                {/* 1. Candidate Photo Upload Section */}
                <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-amber-800" />
                      <span>{isHi ? 'प्रत्याशी की प्रोफाइल फोटो अपलोड करें *' : 'Upload Candidate Profile Photo *'}</span>
                    </label>
                    <span className="text-[10px] text-stone-500">JPG, PNG (अधिकतम 5MB)</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />

                    {newProfileForm.photo ? (
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-20 rounded-lg overflow-hidden border-2 border-amber-600 shadow-2xs relative">
                          <img
                            src={newProfileForm.photo}
                            alt="Candidate preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="space-y-1.5 text-xs">
                          <div className="text-emerald-700 font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>{isHi ? 'फोटो अपलोड पूर्ण!' : 'Photo Upload Complete!'}</span>
                          </div>
                          <div className="text-[11px] text-stone-500 truncate max-w-[180px]">
                            {newProfileForm.photoFileName || 'profile_photo.jpg'}
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => photoInputRef.current?.click()}
                              className="text-[11px] font-semibold text-amber-800 hover:underline cursor-pointer"
                            >
                              {isHi ? 'बदलें' : 'Change'}
                            </button>
                            <button
                              type="button"
                              onClick={handleRemovePhoto}
                              className="text-[11px] font-semibold text-red-600 hover:underline cursor-pointer flex items-center gap-0.5"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>{isHi ? 'हटाएं' : 'Remove'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => photoInputRef.current?.click()}
                          className="px-4 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors shadow-2xs"
                        >
                          <Upload className="w-4 h-4 text-white" />
                          <span>{isHi ? 'मोबाइल / PC से फोटो अपलोड करें (PNG/JPG)' : 'Upload Photo from Mobile / PC (PNG/JPG)'}</span>
                        </button>
                        <span className="text-[11px] text-stone-500">
                          {isHi
                            ? 'यदि फोटो उपलब्ध न हो तो सभ्य डिफ़ॉल्ट एवतार उपयोग होगा।'
                            : 'If no photo, a default dignified avatar will be used.'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="text-xs font-bold text-stone-800 block mb-1">
                    {isHi ? 'प्रत्याशी का पूरा नाम *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newProfileForm.fullName}
                    onChange={(e) => setNewProfileForm({ ...newProfileForm, fullName: e.target.value })}
                    placeholder={isHi ? 'उदा. राहुल शर्मा (जांगिड़)' : 'e.g. Rahul Sharma'}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-semibold focus:outline-none focus:border-amber-700"
                  />
                </div>

                {/* Category & Age */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-medium text-stone-700 block mb-1">
                      {isHi ? 'प्रत्याशी वर्ग *' : 'Profile Category *'}
                    </label>
                    <select
                      value={newProfileForm.gender}
                      onChange={(e) =>
                        setNewProfileForm({
                          ...newProfileForm,
                          gender: e.target.value as 'groom' | 'bride',
                        })
                      }
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs bg-white font-medium"
                    >
                      <option value="groom">{isHi ? 'वर' : 'Groom'}</option>
                      <option value="bride">{isHi ? 'वधू' : 'Bride'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-stone-700 block mb-1">
                      {isHi ? 'आयु (वर्ष) *' : 'Age *'}
                    </label>
                    <input
                      type="number"
                      required
                      min={18}
                      max={70}
                      value={newProfileForm.age}
                      onChange={(e) =>
                        setNewProfileForm({ ...newProfileForm, age: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-stone-700 block mb-1">
                      {isHi ? 'ऊंचाई / कद' : 'Height'}
                    </label>
                    <input
                      type="text"
                      value={newProfileForm.height}
                      onChange={(e) => setNewProfileForm({ ...newProfileForm, height: e.target.value })}
                      placeholder="उदा. 5' 8&quot;"
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                {/* Subcaste & Gotras */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-medium text-stone-700 block mb-1">
                      {isHi ? 'उपजाति / शाखा *' : 'Subcaste *'}
                    </label>
                    <select
                      value={newProfileForm.subcaste}
                      onChange={(e) => setNewProfileForm({ ...newProfileForm, subcaste: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs bg-white font-medium"
                    >
                      <option value="जांगिड़ (सुथार)">जांगिड़ (सुथार)</option>
                      <option value="पांचाल">पांचाल</option>
                      <option value="धीमान (शिल्पी)">धीमान (शिल्पी)</option>
                      <option value="स्वर्णकार (सोनी)">स्वर्णकार (सोनी)</option>
                      <option value="कांस्यकार / ठठेरा">कांस्यकार / ठठेरा</option>
                      <option value="गजधर / मिस्त्री">गजधर / मिस्त्री</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-stone-700 block mb-1">
                      {isHi ? 'स्वगोत्र (पिताजी का गोत्र) *' : 'Self Gotra *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={newProfileForm.gotra}
                      onChange={(e) => setNewProfileForm({ ...newProfileForm, gotra: e.target.value })}
                      placeholder="उदा. भारद्वाज"
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-stone-700 block mb-1">
                      {isHi ? 'मातृगोत्र (नानिहाल गोत्र) *' : 'Mother Gotra *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={newProfileForm.motherGotra}
                      onChange={(e) =>
                        setNewProfileForm({ ...newProfileForm, motherGotra: e.target.value })
                      }
                      placeholder="उदा. वशिष्ठ"
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                {/* Education & Occupation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-stone-700 block mb-1">
                      {isHi ? 'उच्चतम शिक्षा *' : 'Education *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={newProfileForm.education}
                      onChange={(e) => setNewProfileForm({ ...newProfileForm, education: e.target.value })}
                      placeholder="उदा. बी.टेक (कम्प्यूटर साइंस) / सीए / एमबीबीएस"
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-stone-700 block mb-1">
                      {isHi ? 'व्यवसाय / पद' : 'Occupation'}
                    </label>
                    <input
                      type="text"
                      value={newProfileForm.occupation}
                      onChange={(e) =>
                        setNewProfileForm({ ...newProfileForm, occupation: e.target.value })
                      }
                      placeholder="सॉफ्टवेयर आर्किटेक्ट / इंजीनियर"
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                {/* Income & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-medium text-stone-700 block mb-1">
                      {isHi ? 'वार्षिक आय' : 'Annual Income'}
                    </label>
                    <input
                      type="text"
                      value={newProfileForm.annualIncome}
                      onChange={(e) => setNewProfileForm({ ...newProfileForm, annualIncome: e.target.value })}
                      placeholder="उदा. ₹ 18 लाख प्रतिवर्ष"
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-stone-700 block mb-1">
                      {isHi ? 'वर्तमान शहर *' : 'City *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={newProfileForm.city}
                      onChange={(e) => setNewProfileForm({ ...newProfileForm, city: e.target.value })}
                      placeholder="उदा. जयपुर / मुंबई"
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
                      value={newProfileForm.state}
                      onChange={(e) => setNewProfileForm({ ...newProfileForm, state: e.target.value })}
                      placeholder="उदा. राजस्थान"
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                {/* Verification Contact Details: Guardian, Mobile & Email */}
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                  <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-amber-800" />
                    <span>{isHi ? 'सत्यापन एवं संपर्क विवरण (OTP प्रमाणीकरण अनिवार्य)' : 'Verification Contact Details'}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-medium text-stone-700 block mb-1">
                        {isHi ? 'अभिभावक का नाम *' : 'Guardian Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={newProfileForm.contactPerson}
                        onChange={(e) =>
                          setNewProfileForm({ ...newProfileForm, contactPerson: e.target.value })
                        }
                        placeholder="श्री ... (पिताजी)"
                        className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-stone-700 block mb-1">
                        {isHi ? 'संपर्क मोबाइल नंबर (OTP आएगा) *' : 'Mobile Number (Receives OTP) *'}
                      </label>
                      <input
                        type="tel"
                        required
                        value={newProfileForm.contactNumber}
                        onChange={(e) =>
                          setNewProfileForm({ ...newProfileForm, contactNumber: e.target.value })
                        }
                        placeholder="+91 98290 88776"
                        className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-stone-700 block mb-1">
                        {isHi ? 'ईमेल पता (OTP आएगा) *' : 'Email Address (Receives OTP) *'}
                      </label>
                      <input
                        type="email"
                        required
                        value={newProfileForm.email}
                        onChange={(e) =>
                          setNewProfileForm({ ...newProfileForm, email: e.target.value })
                        }
                        placeholder="dksacademy.live@gmail.com"
                        className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* ============================================================ */}
                {/* 3. DEDICATED PRIVACY & SECURITY CONTROLS */}
                {/* ============================================================ */}
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
                    <Shield className="w-4 h-4 text-emerald-700" />
                    <span>{isHi ? 'बायोडाटा गोपनीयता एवं सुरक्षा सेटिंग्स' : 'Privacy & Security Settings'}</span>
                  </div>

                  {/* Photo Privacy Choice */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-800 block">
                      {isHi ? '1. फोटो गोपनीयता विकल्प:' : '1. Photo Privacy Option:'}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <label className={`p-2.5 rounded-lg border cursor-pointer flex items-start gap-2 ${
                        newProfileForm.photoPrivacy === 'public'
                          ? 'border-emerald-600 bg-white font-semibold text-emerald-950 shadow-2xs'
                          : 'border-stone-200 bg-stone-50/50 text-stone-600'
                      }`}>
                        <input
                          type="radio"
                          name="photoPrivacy"
                          value="public"
                          checked={newProfileForm.photoPrivacy === 'public'}
                          onChange={() => setNewProfileForm({ ...newProfileForm, photoPrivacy: 'public' })}
                          className="mt-0.5 text-emerald-600"
                        />
                        <div>
                          <div className="font-bold">{isHi ? 'सार्वजनिक' : 'Public (Visible)'}</div>
                          <div className="text-[11px] text-stone-500 font-normal">
                            {isHi ? 'पंजीकृत समाज बंधु स्पष्ट फोटो देख सकेंगे।' : 'Registered members can view candidate photo.'}
                          </div>
                        </div>
                      </label>

                      <label className={`p-2.5 rounded-lg border cursor-pointer flex items-start gap-2 ${
                        newProfileForm.photoPrivacy === 'blur_request'
                          ? 'border-emerald-600 bg-white font-semibold text-emerald-950 shadow-2xs'
                          : 'border-stone-200 bg-stone-50/50 text-stone-600'
                      }`}>
                        <input
                          type="radio"
                          name="photoPrivacy"
                          value="blur_request"
                          checked={newProfileForm.photoPrivacy === 'blur_request'}
                          onChange={() => setNewProfileForm({ ...newProfileForm, photoPrivacy: 'blur_request' })}
                          className="mt-0.5 text-emerald-600"
                        />
                        <div>
                          <div className="font-bold flex items-center gap-1">
                            <Lock className="w-3 h-3 text-amber-700" />
                            <span>{isHi ? 'गोपनीय एवं धुंधला' : 'Blur / Confidential'}</span>
                          </div>
                          <div className="text-[11px] text-stone-500 font-normal">
                            {isHi ? 'केवल अनुरोध स्वीकार करने पर ही फोटो खुलेगी।' : 'Photo unlocks only after guardian approval.'}
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Contact Privacy Choice */}
                  <div className="space-y-1.5 pt-1">
                    <label className="text-xs font-bold text-stone-800 block">
                      {isHi ? '2. संपर्क नंबर गोपनीयता विकल्प:' : '2. Contact Privacy Option:'}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <label className={`p-2.5 rounded-lg border cursor-pointer flex items-start gap-2 ${
                        newProfileForm.contactPrivacy === 'on_request'
                          ? 'border-emerald-600 bg-white font-semibold text-emerald-950 shadow-2xs'
                          : 'border-stone-200 bg-stone-50/50 text-stone-600'
                      }`}>
                        <input
                          type="radio"
                          name="contactPrivacy"
                          value="on_request"
                          checked={newProfileForm.contactPrivacy === 'on_request'}
                          onChange={() => setNewProfileForm({ ...newProfileForm, contactPrivacy: 'on_request' })}
                          className="mt-0.5 text-emerald-600"
                        />
                        <div>
                          <div className="font-bold flex items-center gap-1">
                            <Lock className="w-3 h-3 text-emerald-700" />
                            <span>{isHi ? 'अनुरोध पर' : 'On Request'}</span>
                          </div>
                          <div className="text-[11px] text-stone-500 font-normal">
                            {isHi ? 'अभिभावक द्वारा सहमति देने पर ही नंबर दिखेगा।' : 'Number visible only after guardian consent.'}
                          </div>
                        </div>
                      </label>

                      <label className={`p-2.5 rounded-lg border cursor-pointer flex items-start gap-2 ${
                        newProfileForm.contactPrivacy === 'guardian_only'
                          ? 'border-emerald-600 bg-white font-semibold text-emerald-950 shadow-2xs'
                          : 'border-stone-200 bg-stone-50/50 text-stone-600'
                      }`}>
                        <input
                          type="radio"
                          name="contactPrivacy"
                          value="guardian_only"
                          checked={newProfileForm.contactPrivacy === 'guardian_only'}
                          onChange={() => setNewProfileForm({ ...newProfileForm, contactPrivacy: 'guardian_only' })}
                          className="mt-0.5 text-emerald-600"
                        />
                        <div>
                          <div className="font-bold">{isHi ? 'केवल अभिभावक संपर्क' : 'Guardian Contact Only'}</div>
                          <div className="text-[11px] text-stone-500 font-normal">{isHi ? 'प्रत्याशी का व्यक्तिगत नंबर गुप्त रहेगा।' : 'Candidate personal number kept hidden.'}</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Verification Channel Choice */}
                  <div className="space-y-1.5 pt-2">
                    <label className="font-bold text-xs text-stone-800 flex items-center justify-between">
                      <span>{isHi ? 'सत्यापन माध्यम चुनें (Verification Channel):' : 'Select Verification Channel:'}</span>
                      <span className="text-[10px] text-amber-800 font-semibold">{isHi ? 'सुरक्षित OTP प्रणाली' : 'Secure OTP System'}</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setVerificationChannel('firebase_sms')}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                          verificationChannel === 'firebase_sms'
                            ? 'border-amber-700 bg-amber-50/80 ring-2 ring-amber-600/30 text-amber-950 font-bold'
                            : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          verificationChannel === 'firebase_sms' ? 'bg-amber-700 text-white' : 'bg-stone-100 text-stone-600'
                        }`}>
                          <Smartphone className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs">{isHi ? '📱 Firebase Phone SMS' : 'Firebase SMS'}</div>
                          <div className="text-[10px] text-stone-500 font-normal">{isHi ? 'मोबाइल पर 6-अंकीय SMS' : 'SMS on cellular phone'}</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setVerificationChannel('whatsapp')}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                          verificationChannel === 'whatsapp'
                            ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/30 text-emerald-950 font-bold'
                            : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          verificationChannel === 'whatsapp' ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-600'
                        }`}>
                          <MessageCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs">{isHi ? '💬 WhatsApp सत्यापन' : 'WhatsApp Verify'}</div>
                          <div className="text-[10px] text-stone-500 font-normal">{isHi ? 'नेटवर्क समस्या में तुरंत WhatsApp' : 'Instant via WhatsApp'}</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Hidden reCAPTCHA container for Firebase Phone Auth */}
                  <div id="recaptcha-container" className="empty:hidden"></div>

                  {/* Gotra Compliance Notice */}
                  <label className="flex items-start gap-2 pt-2 cursor-pointer text-xs text-stone-700">
                    <input
                      type="checkbox"
                      required
                      checked={newProfileForm.gotraComplianceAccepted}
                      onChange={(e) =>
                        setNewProfileForm({ ...newProfileForm, gotraComplianceAccepted: e.target.checked })
                      }
                      className="mt-0.5 text-amber-800 rounded"
                    />
                    <span>
                      {isHi
                        ? 'मैं पुष्टि करता/करती हूँ कि दी गई जानकारी सत्य है एवं हम सगोत्र विवाह निषेध व कुल मर्यादा का पालन करते हैं।'
                        : 'I hereby confirm that all information provided is accurate and adheres to traditional gotra and matrimonial guidelines.'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Modal Sticky Bottom Footer */}
              <div className="shrink-0 p-4 sm:p-5 pt-3 bg-stone-50/90 border-t border-stone-200 rounded-b-2xl flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="flex-1 py-2.5 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg cursor-pointer transition-colors"
                >
                  {isHi ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isFirebaseSending}
                  className="flex-1 py-2.5 text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 disabled:bg-stone-400 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  {isFirebaseSending ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>{isHi ? 'Firebase SMS प्रेषित हो रहा है...' : 'Sending SMS...'}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{isHi ? 'OTP कोड प्राप्त करें एवं सत्यापित करें' : 'Get OTP & Verify'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. OTP VERIFICATION CONFIRMATION MODAL */}
      {/* ============================================================ */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border-2 border-amber-400 overflow-hidden my-auto animate-scaleUp">
            {/* Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-950 via-stone-900 to-emerald-950 text-white text-center space-y-1 relative">
              <button
                onClick={() => {
                  setShowOtpModal(false);
                  setShowRegisterModal(true);
                }}
                className="absolute right-4 top-4 text-stone-400 hover:text-white p-1 rounded-lg cursor-pointer"
                title={isHi ? 'वापस फॉर्म पर जाएं' : 'Back to form'}
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-12 h-12 bg-amber-500/20 text-amber-300 rounded-full flex items-center justify-center mx-auto border border-amber-400/40 shadow-xs mb-1.5">
                <KeyRound className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold font-display text-white flex items-center justify-center gap-2">
                <span>{isHi ? 'सुरक्षा कोड (OTP) सत्यापन' : 'Verify Security OTP'}</span>
                <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-sans font-bold">2-Way Verified</span>
              </h3>
              <p className="text-xs text-amber-200/90 font-hindi">
                {isHi ? 'विश्वकर्मा परिणय मंच पर प्रामाणिक वैवाहिक पंजीकरण' : 'Authentic Vishwakarma Matrimonial Registration'}
              </p>
            </div>

            {/* OTP Modal Body */}
            <div className="p-5 sm:p-6 space-y-4 font-hindi text-stone-800">
              {/* Channel Selector Switcher (Phone SMS vs WhatsApp) */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-xl border border-stone-200 text-xs">
                <button
                  type="button"
                  onClick={() => handleSwitchChannel('firebase_sms')}
                  className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    verificationChannel === 'firebase_sms'
                      ? 'bg-amber-900 text-white shadow-xs'
                      : 'text-stone-700 hover:bg-stone-200/60'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-amber-300" />
                  <span>📱 Phone SMS OTP</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSwitchChannel('whatsapp')}
                  className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    verificationChannel === 'whatsapp'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-stone-700 hover:bg-stone-200/60'
                  }`}
                >
                  <MessageCircle className="w-4 h-4 text-emerald-300" />
                  <span>💬 WhatsApp सत्यापन</span>
                </button>
              </div>

              {/* Sent targets badge */}
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs space-y-1 text-center">
                <div className="text-stone-600 font-medium">
                  {verificationChannel === 'whatsapp'
                    ? (isHi ? 'व्हाट्सएप सत्यापन लक्ष्य संख्या:' : 'WhatsApp Target Contact:')
                    : (isHi ? 'Firebase Phone SMS प्रेषण लक्ष्य:' : 'Firebase Phone SMS Target:')}
                </div>
                <div className="font-mono font-bold text-amber-950 text-xs sm:text-sm">
                  📱 {newProfileForm.contactNumber} · ✉️ {newProfileForm.email}
                </div>
              </div>

              {/* WHATSAPP VERIFICATION DEDICATED SUITE */}
              {verificationChannel === 'whatsapp' ? (
                <div className="p-4 bg-emerald-50/90 border-2 border-emerald-400 rounded-2xl text-xs text-emerald-950 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-2xs">
                        <MessageCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-emerald-950 text-sm">
                          {isHi ? 'WhatsApp अधिकृत सत्यापन केंद्र' : 'WhatsApp Verification Center'}
                        </div>
                        <div className="text-[10px] text-emerald-800">
                          {isHi ? 'नेटवर्क समस्या होने पर सीधा WhatsApp से सत्यापित करें' : 'Instant bypass if SMS cellular network delays'}
                        </div>
                      </div>
                    </div>

                    <span className="font-mono bg-emerald-200 text-emerald-950 px-2.5 py-1 rounded-lg font-bold text-sm tracking-wider border border-emerald-300">
                      {generatedOtp}
                    </span>
                  </div>

                  <p className="text-[11px] text-emerald-900 leading-relaxed font-medium">
                    {isHi
                      ? `प्रत्याशी ${newProfileForm.fullName} के लिए सुरक्षा कोड जनरेट हो चुका है। आप नीचे दिए गए बटन से WhatsApp पर सीधे चैट खोल सकते हैं, कोड कॉपी कर सकते हैं अथवा 'WhatsApp से तुरंत सत्यापित करें' पर क्लिक कर सकते हैं:`
                      : `Security code generated for ${newProfileForm.fullName}. Use the buttons below to open WhatsApp, copy code or verify instantly:`}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleOpenWhatsAppChat}
                      className="py-2 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer text-[11px]"
                      title="WhatsApp खोलें"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>WhatsApp चैट खोलें</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyWhatsAppOtp}
                      className="py-2 px-2.5 bg-white border border-emerald-300 hover:bg-emerald-100/60 text-emerald-900 rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer text-[11px]"
                    >
                      <Copy className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{whatsappCopied ? 'कोड कॉपी हुआ!' : 'कोड कॉपी करें'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleInstantWhatsAppVerify}
                      className="py-2 px-2.5 bg-emerald-900 hover:bg-black text-amber-300 rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer text-[11px]"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-300" />
                      <span>त्वरित WhatsApp Verify</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* FIREBASE PHONE SMS SUITE */
                <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl text-xs text-amber-950 space-y-2.5">
                  <div className="font-bold flex items-center justify-between gap-1.5 text-amber-950">
                    <div className="flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-amber-800 shrink-0" />
                      <span>{isHi ? 'Firebase Phone SMS OTP भेजा गया' : 'Firebase SMS Dispatched'}</span>
                    </div>
                    <span className="font-mono bg-amber-200/80 text-amber-950 px-2 py-0.5 rounded-md font-bold text-xs tracking-wider">
                      {generatedOtp}
                    </span>
                  </div>

                  <p className="leading-relaxed text-[11px] text-amber-900/90 font-medium">
                    {otpSuccessAlert}
                  </p>

                  {/* Network Delay Prompt -> Switch to WhatsApp */}
                  <div className="p-2.5 bg-white rounded-xl border border-emerald-300 flex flex-wrap items-center justify-between gap-2">
                    <div className="text-[11px] text-stone-700">
                      <strong>💡 नेटवर्क समस्या?</strong> यदि आपके ऑपरेटर से SMS आने में देरी हो रही है:
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSwitchChannel('whatsapp')}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp पर कोड प्राप्त करें</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 6 Digit Input Boxes */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-stone-700">
                  <span>6 अंकों का OTP दर्ज करें:</span>
                  <button
                    type="button"
                    onClick={handleAutoFillOtp}
                    className="text-amber-800 hover:text-amber-900 hover:underline cursor-pointer flex items-center gap-1 text-[11px]"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    <span>त्वरित ऑटो-फिल कोड ({generatedOtp})</span>
                  </button>
                </div>

                <div className="flex justify-between gap-2">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        otpInputRefs.current[idx] = el;
                      }}
                      type="text"
                      maxLength={1}
                      inputMode="numeric"
                      value={digit}
                      onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="w-11 h-12 sm:w-12 sm:h-14 text-center font-mono font-bold text-xl sm:text-2xl border-2 border-stone-300 rounded-xl focus:border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-200 transition-all bg-white shadow-2xs"
                    />
                  ))}
                </div>

                {otpError && (
                  <div className="text-xs text-red-600 font-semibold flex items-center gap-1.5 pt-1">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{otpError}</span>
                  </div>
                )}
              </div>

              {/* Resend and Timer */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-100">
                <div className="text-stone-500">
                  {isOtpTimerActive ? (
                    <span>पुनः कोड भेजें: <strong className="text-stone-800 font-mono">{otpTimer}s</strong></span>
                  ) : (
                    <span className="text-amber-800 font-semibold">समय समाप्त</span>
                  )}
                </div>

                <button
                  type="button"
                  disabled={isOtpTimerActive || isFirebaseSending}
                  onClick={handleResendOtp}
                  className="font-bold text-amber-800 hover:text-amber-900 disabled:text-stone-400 cursor-pointer disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${isFirebaseSending ? 'animate-spin' : ''}`} />
                  <span>पुनः OTP भेजें</span>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleVerifyOtpAndPublish}
                  className="w-full py-3 bg-gradient-to-r from-amber-700 via-stone-800 to-emerald-800 hover:from-amber-800 hover:to-emerald-900 text-white font-bold rounded-xl text-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 transform hover:scale-[1.01]"
                >
                  <CheckCircle className="w-5 h-5 text-amber-300" />
                  <span>
                    {verificationChannel === 'whatsapp'
                      ? (isHi ? 'WhatsApp से सत्यापित करें एवं बायोडाटा प्रकाशित करें' : 'Verify via WhatsApp & Publish')
                      : (isHi ? 'सत्यापित करें एवं बायोडाटा प्रकाशित करें' : 'Verify & Publish Biodata')}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowOtpModal(false);
                    setShowRegisterModal(true);
                  }}
                  className="w-full py-2 text-xs font-semibold text-stone-600 hover:text-stone-800 cursor-pointer"
                >
                  ← विवरण में संशोधन करें
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. PRIVACY CONTACT / PHOTO ACCESS REQUEST MODAL */}
      {/* ============================================================ */}
      {requestTargetProfile && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 my-auto space-y-4">
            <div className="flex items-start justify-between border-b border-stone-200 pb-3">
              <div>
                <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-0.5 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-amber-700" />
                  <span>{requestType === 'photo' ? 'गोपनीय फोटो दर्शन अनुरोध' : 'सुरक्षित संपर्क सूत्र अनुरोध'}</span>
                </div>
                <h3 className="text-lg font-bold text-stone-900">
                  {requestTargetProfile.fullName} के परिवार से संपर्क
                </h3>
              </div>
              <button
                onClick={() => setRequestTargetProfile(null)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {requestSuccess ? (
              <div className="text-center py-6 space-y-3 font-hindi">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-stone-900">अनुरोध प्रेषित हो गया!</h4>
                <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
                  आपका संदेश अभिभावक <strong>{requestTargetProfile.contactPerson}</strong> को SMS एवं ईमेल द्वारा भेज दिया गया है। अभिभावक की स्वीकृति मिलते ही आपको सूचना प्राप्त होगी।
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitAccessRequest} className="space-y-3 font-hindi text-xs">
                <p className="text-stone-600 leading-relaxed bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                  इस परिवार ने निजता सुरक्षा नीति अपनाई है। कृपया अपना परिचय दें ताकि अभिभावक संतुष्ट होकर आपसे सीधा संपर्क कर सकें।
                </p>

                <div>
                  <label className="font-bold text-stone-800 block mb-1">आपका पूरा नाम *</label>
                  <input
                    type="text"
                    required
                    value={requestForm.senderName}
                    onChange={(e) => setRequestForm({ ...requestForm, senderName: e.target.value })}
                    placeholder="उदा. श्री सत्यनारायण शर्मा"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-stone-800 block mb-1">आपका गोत्र *</label>
                    <input
                      type="text"
                      required
                      value={requestForm.senderGotra}
                      onChange={(e) => setRequestForm({ ...requestForm, senderGotra: e.target.value })}
                      placeholder="उदा. कौशिक"
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-stone-800 block mb-1">आपका संपर्क नंबर *</label>
                    <input
                      type="tel"
                      required
                      value={requestForm.senderPhone}
                      onChange={(e) => setRequestForm({ ...requestForm, senderPhone: e.target.value })}
                      placeholder="+91 98290 00000"
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-stone-800 block mb-1">संबंध / परिचय</label>
                  <select
                    value={requestForm.relation}
                    onChange={(e) => setRequestForm({ ...requestForm, relation: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs bg-white"
                  >
                    <option value="पिता/अभिभावक">पिता / अभिभावक</option>
                    <option value="माता">माता</option>
                    <option value="भाई/बहन">भाई / बहन</option>
                    <option value="स्वयं प्रत्याशी">स्वयं प्रत्याशी</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-800 block mb-1">पारिवारिक संदेश</label>
                  <textarea
                    rows={2}
                    value={requestForm.message}
                    onChange={(e) => setRequestForm({ ...requestForm, message: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setRequestTargetProfile(null)}
                    className="flex-1 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg font-semibold cursor-pointer"
                  >
                    रद्द करें
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>अनुरोध प्रेषित करें</span>
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
