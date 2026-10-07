import React, { useState, useRef } from 'react';
import { Language, JobItem, ScholarshipItem, WorkshopItem } from '../types';
import { DEFAULT_JOBS, DEFAULT_SCHOLARSHIPS, DEFAULT_WORKSHOPS } from '../data/formsData';
import { addApplicationToFirestore } from '../firebase';
import {
  GraduationCap,
  Briefcase,
  Award,
  CheckCircle,
  ChevronRight,
  BookOpen,
  Users,
  Compass,
  Plus,
  Search,
  X,
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  Check,
  Printer,
  Download,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  ShieldCheck,
  Clock,
  Calendar,
  Building,
  User,
  Share2
} from 'lucide-react';

interface YouthAndJobsProps {
  lang: Language;
  onOpenAdmin?: () => void;
  jobs?: JobItem[];
  scholarships?: ScholarshipItem[];
  workshops?: WorkshopItem[];
}

interface ConfirmationData {
  type: 'job' | 'scholarship' | 'workshop';
  regNumber: string;
  date: string;
  title: string;
  subtitle: string;
  applicantName: string;
  photo: string;
  phone: string;
  email: string;
  city: string;
  fields: { label: string; value: string }[];
}

export const YouthAndJobs: React.FC<YouthAndJobsProps> = ({
  lang,
  onOpenAdmin,
  jobs,
  scholarships,
  workshops,
}) => {
  const isHi = lang === 'hi';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeJobs = jobs && jobs.length > 0 ? jobs : DEFAULT_JOBS;
  const activeScholarships = scholarships && scholarships.length > 0 ? scholarships : DEFAULT_SCHOLARSHIPS;
  const activeWorkshops = workshops && workshops.length > 0 ? workshops : DEFAULT_WORKSHOPS;

  const JOBS = activeJobs;
  const SCHOLARSHIPS = activeScholarships;
  const WORKSHOPS = activeWorkshops;

  const [activeTab, setActiveTab] = useState<'jobs' | 'scholarships' | 'skills'>('jobs');

  // Applied tracking
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [appliedScholarshipIds, setAppliedScholarshipIds] = useState<string[]>([]);
  const [appliedWorkshopIds, setAppliedWorkshopIds] = useState<string[]>([]);

  // Selected for Modal
  const [selectedJob, setSelectedJob] = useState<JobItem | null>(null);
  const [selectedScholarship, setSelectedScholarship] = useState<ScholarshipItem | null>(null);
  const [selectedWorkshop, setSelectedWorkshop] = useState<WorkshopItem | null>(null);

  // Photo Upload States (Universal for all 3 forms)
  const [uploadedPhotoPreview, setUploadedPhotoPreview] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState<string>('');
  const [photoFileSize, setPhotoFileSize] = useState<string>('');
  const [showPhotoUrlInput, setShowPhotoUrlInput] = useState<boolean>(false);

  // Confirmation Result State
  const [confirmationData, setConfirmationData] = useState<ConfirmationData | null>(null);

  // 1. Job Form State
  const [jobForm, setJobForm] = useState({
    fullName: '',
    subcaste: 'जांगिड़ (सुथार)',
    phone: '',
    email: '',
    city: '',
    state: '',
    qualification: 'बी.टेक / डिप्लोमा',
    experienceYears: '3 वर्ष',
    skills: '',
    resumeLink: '',
    message: '',
  });

  // 2. Scholarship Form State
  const [scholarshipForm, setScholarshipForm] = useState({
    fullName: '',
    fatherName: '',
    subcaste: 'जांगिड़ (सुथार)',
    phone: '',
    email: '',
    city: '',
    state: '',
    college: '',
    course: '',
    percentage: '',
    annualIncome: '',
    bankAccount: '',
    statement: '',
  });

  // 3. Workshop Form State
  const [workshopForm, setWorkshopForm] = useState({
    fullName: '',
    age: '',
    phone: '',
    email: '',
    city: '',
    state: '',
    profession: 'काष्ठशिल्पी / छात्र',
    batchPreference: 'शनिवार प्रातः 10:00 से 01:00',
    learningGoal: '',
  });

  // Photo Upload Handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setPhotoFileName(file.name);
    setPhotoFileSize(formattedSize);

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setUploadedPhotoPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setUploadedPhotoPreview(null);
    setPhotoFileName('');
    setPhotoFileSize('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Submit Job Application
  const handleJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    const regNumber = `VSM-JOB-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const date = new Date().toLocaleDateString('hi-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const candidatePhoto =
      uploadedPhotoPreview ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';

    const appData = {
      type: 'job' as const,
      regNumber,
      title: selectedJob.title,
      applicantName: jobForm.fullName,
      photo: candidatePhoto,
      phone: jobForm.phone,
      email: jobForm.email,
      city: `${jobForm.city}, ${jobForm.state}`,
      fields: [
        { label: 'उपजाति / शाखा', value: jobForm.subcaste },
        { label: 'उच्चतम शैक्षणिक योग्यता', value: jobForm.qualification },
        { label: 'कुल कार्य अनुभव', value: jobForm.experienceYears },
        { label: 'प्रमुख तकनीकी कौशल', value: jobForm.skills || selectedJob.skills },
        { label: 'रिज्यूमे / पोर्टफोलियो', value: jobForm.resumeLink || 'संलग्न व सत्यापित' },
      ],
      status: 'pending' as const,
      createdAt: date,
    };

    // Save automatically to Firebase Firestore
    addApplicationToFirestore(appData);

    setConfirmationData({
      ...appData,
      subtitle: `${selectedJob.company} · ${selectedJob.location} (${selectedJob.salary})`,
      date,
    });

    setAppliedJobIds((prev) => [...prev, selectedJob.id]);
    setSelectedJob(null);
    handleRemovePhoto();
  };

  // Submit Scholarship Application
  const handleScholarshipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedScholarship) return;

    const regNumber = `VSM-SCH-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const date = new Date().toLocaleDateString('hi-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const studentPhoto =
      uploadedPhotoPreview ||
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80';

    const appData = {
      type: 'scholarship' as const,
      regNumber,
      title: selectedScholarship.title,
      applicantName: scholarshipForm.fullName,
      photo: studentPhoto,
      phone: scholarshipForm.phone,
      email: scholarshipForm.email,
      city: `${scholarshipForm.city}, ${scholarshipForm.state}`,
      fields: [
        { label: 'पिता / अभिभावक का नाम', value: scholarshipForm.fatherName },
        { label: 'उपजाति / गोत्र', value: scholarshipForm.subcaste },
        { label: 'अध्ययनरत कॉलेज / विश्वविद्यालय', value: scholarshipForm.college },
        { label: 'पाठ्यक्रम व वर्ष', value: scholarshipForm.course },
        { label: 'गत परीक्षा प्राप्तांक', value: `${scholarshipForm.percentage}%` },
        { label: 'वार्षिक पारिवारिक आय', value: scholarshipForm.annualIncome || 'नियम अनुसार' },
      ],
      status: 'pending' as const,
      createdAt: date,
    };

    // Save automatically to Firebase Firestore
    addApplicationToFirestore(appData);

    setConfirmationData({
      ...appData,
      subtitle: `सहायता राशि: ${selectedScholarship.amount}`,
      date,
    });

    setAppliedScholarshipIds((prev) => [...prev, selectedScholarship.id]);
    setSelectedScholarship(null);
    handleRemovePhoto();
  };

  // Submit Workshop Application
  const handleWorkshopSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorkshop) return;

    const regNumber = `VSM-WS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const date = new Date().toLocaleDateString('hi-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const participantPhoto =
      uploadedPhotoPreview ||
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80';

    const appData = {
      type: 'workshop' as const,
      regNumber,
      title: selectedWorkshop.title,
      applicantName: workshopForm.fullName,
      photo: participantPhoto,
      phone: workshopForm.phone,
      email: workshopForm.email,
      city: `${workshopForm.city}, ${workshopForm.state}`,
      fields: [
        { label: 'आयु', value: `${workshopForm.age} वर्ष` },
        { label: 'वर्तमान कार्य / पेशा', value: workshopForm.profession },
        { label: 'प्रशिक्षण बैच प्राथमिकता', value: workshopForm.batchPreference },
        { label: 'प्रशिक्षण माध्यम', value: selectedWorkshop.mode },
        { label: 'सीखने का उद्देश्य', value: workshopForm.learningGoal || 'कौशल संवर्धन एवं आधुनिक तकनीकी ज्ञान' },
      ],
      status: 'pending' as const,
      createdAt: date,
    };

    // Save automatically to Firebase Firestore
    addApplicationToFirestore(appData);

    setConfirmationData({
      ...appData,
      subtitle: `${selectedWorkshop.schedule} · प्रशिक्षक: ${selectedWorkshop.instructor}`,
      date,
    });

    setAppliedWorkshopIds((prev) => [...prev, selectedWorkshop.id]);
    setSelectedWorkshop(null);
    handleRemovePhoto();
  };

  const printReceipt = () => {
    window.print();
  };

  // Reusable Photo Upload Component with Bracket Size
  const renderPhotoUploadField = (labelTitle: string) => (
    <div className="space-y-2 pt-1 border-t border-stone-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4 text-amber-800 shrink-0" />
          <span>
            {labelTitle}{' '}
            {isHi
              ? '(अनुशंसित आकार: 400 × 500 px या 1:1, अधिकतम 5 MB) *'
              : '(Recommended: 400 × 500 px or 1:1, Max 5 MB) *'}
          </span>
        </label>
        <button
          type="button"
          onClick={() => setShowPhotoUrlInput(!showPhotoUrlInput)}
          className="text-[11px] font-bold text-amber-800 hover:text-amber-900 underline cursor-pointer text-left"
        >
          {showPhotoUrlInput
            ? (isHi ? 'फ़ाइल अपलोड पर लौटें' : 'Back to File Upload')
            : (isHi ? 'अथवा वेब लिंक दर्ज करें' : 'Or Enter Image URL')}
        </button>
      </div>

      {showPhotoUrlInput ? (
        <div className="space-y-1">
          <input
            type="url"
            onChange={(e) => setUploadedPhotoPreview(e.target.value)}
            placeholder="https://example.com/passport-photo.jpg"
            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 font-mono"
          />
          <p className="text-[11px] text-stone-500 font-hindi">
            {isHi
              ? 'सीधा इमेज लिंक दर्ज करें (अनुशंसित पासपोर्ट आकार: 400 × 500 पिक्सल)'
              : 'Enter direct image URL (Recommended: 400 × 500 pixels)'}
          </p>
        </div>
      ) : (
        <div>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/png, image/jpeg, image/webp, image/jpg"
            onChange={handlePhotoUpload}
            className="hidden"
            id="youth-photo-upload-input"
          />

          {uploadedPhotoPreview ? (
            <div className="relative rounded-2xl overflow-hidden border-2 border-amber-500 bg-stone-900 shadow-xs p-2">
              <div className="h-40 w-full sm:w-48 mx-auto rounded-xl overflow-hidden relative">
                <img
                  src={uploadedPhotoPreview}
                  alt="Candidate Photo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded border border-white/20 flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>{isHi ? 'फोटो चयनित' : 'Photo Attached'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 px-1 text-xs text-stone-300">
                <div className="truncate max-w-[70%]">
                  <span className="font-semibold text-white">
                    {photoFileName || (isHi ? 'पासपोर्ट फोटो' : 'Passport Photo')}
                  </span>
                  {photoFileSize && <span className="ml-1.5 text-stone-400">({photoFileSize})</span>}
                </div>
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>{isHi ? 'फोटो हटाएं' : 'Remove'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/40 hover:bg-amber-50/70 rounded-2xl p-5 text-center cursor-pointer transition-all space-y-1.5 group"
            >
              <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-2xs">
                <UploadCloud className="w-6 h-6 text-amber-800" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-amber-900">
                  {isHi
                    ? 'कंप्यूटर अथवा मोबाइल से फोटो अपलोड करें (PNG/JPG)'
                    : 'Upload Photo from Mobile or PC (PNG/JPG)'}
                </div>
                <div className="text-[11px] text-stone-600 font-hindi mt-0.5">
                  {isHi
                    ? 'अनुशंसित आकार: 400 × 500 px या 1:1 (अधिकतम फ़ाइल साइज़: 5 MB)'
                    : 'Recommended size: 400 × 500 px or 1:1 (Max file size: 5 MB)'}
                </div>
                <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                  {isHi ? 'स्वीकृत प्रारूप: JPG, PNG, WEBP' : 'Accepted formats: JPG, PNG, WEBP'}
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
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-hindi animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 tracking-wide mb-1">
            <span>{isHi ? 'युवा सशक्तिकरण एवं रोजगार मंच' : 'Youth Empowerment & Career Platform'}</span>
            <span aria-hidden="true">·</span>
            <span>{isHi ? 'शिक्षा व कौशल विकास' : 'Education & Skill Development'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
            {isHi ? 'विश्वकर्मा युवा, शिक्षा एवं रोजगार केंद्र' : 'Youth, Education & Career Portal'}
          </h2>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl">
            {isHi
              ? 'पारंपरिक शिल्प ज्ञान और 21वीं सदी की उच्च तकनीक का संयोजन। समाज के युवाओं के लिए रोजगार अवसर, छात्रवृत्ति एवं कौशल कार्यशालाएं।'
              : 'Bridging timeless craft heritage with cutting-edge engineering, jobs, and merit scholarships for community youths.'}
          </p>
        </div>

        {onOpenAdmin && (
          <button
            onClick={onOpenAdmin}
            className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-500/50 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer shrink-0 self-start sm:self-auto transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>{isHi ? '⚙️ एडमिन: युवा व शिक्षा सेटिंग्स' : '⚙️ Admin: Youth & Jobs Settings'}</span>
          </button>
        )}
      </div>

      {/* Segmented Controls for Sub-views (Mobile, Laptop & PC responsive) */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3 overflow-x-auto scrollbar-none px-0.5">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'jobs'
              ? 'bg-amber-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>{isHi ? 'रोजगार व रिक्तियां (Job Board)' : 'Jobs & Internships'}</span>
        </button>

        <button
          onClick={() => setActiveTab('scholarships')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'scholarships'
              ? 'bg-amber-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>{isHi ? 'मेधावी छात्रवृत्तियां' : 'Scholarships'}</span>
        </button>

        <button
          onClick={() => setActiveTab('skills')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'skills'
              ? 'bg-amber-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>{isHi ? 'निःशुल्क कौशल कार्यशालाएं' : 'Skill Workshops'}</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* Tab 1: Jobs (रोजगार व रिक्तियां) */}
      {/* ============================================================ */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          <div className="text-xs text-stone-500 font-mono">
            {JOBS.length} {isHi ? 'समाज उद्यमों द्वारा घोषित सक्रिय रिक्तियां' : 'Active Openings'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {JOBS.map((job) => {
              const isApplied = appliedJobIds.includes(job.id);
              return (
                <div
                  key={job.id}
                  className="bg-gradient-to-b from-[#FFFDF7] via-amber-50/40 to-stone-50 border border-amber-200/90 rounded-2xl p-6 shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-stone-900 text-lg leading-snug">
                        {job.title}
                      </h3>
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full shrink-0">
                        {job.type}
                      </span>
                    </div>

                    <div className="text-xs text-amber-900 font-semibold flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-amber-700" />
                      <span>{job.company} · {job.location}</span>
                    </div>

                    <div className="text-xs text-stone-600 bg-white/80 p-3 rounded-xl border border-stone-200">
                      <span className="text-stone-400 block text-[11px] mb-0.5">
                        {isHi ? 'अपेक्षित तकनीकी कौशल:' : 'Skills:'}
                      </span>
                      <span className="font-semibold text-stone-800">{job.skills}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-amber-200/80">
                      <span className="font-bold text-stone-900 text-sm">{job.salary}</span>
                      <span className="text-amber-900 font-semibold">{job.deadline}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    {isApplied ? (
                      <div className="w-full py-2.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-2xs">
                        <CheckCircle className="w-4 h-4 text-emerald-700" />
                        <span>{isHi ? '✓ आवेदन सफलतापूर्वक प्रेषित' : '✓ Application Submitted'}</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedJob(job);
                          handleRemovePhoto();
                        }}
                        className="w-full py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Briefcase className="w-4 h-4 text-amber-200" />
                        <span>{isHi ? 'सीधा आवेदन करें' : 'Apply Now'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* Tab 2: Scholarships (मेधावी छात्रवृत्तियां) */}
      {/* ============================================================ */}
      {activeTab === 'scholarships' && (
        <div className="space-y-5">
          {SCHOLARSHIPS.map((sch) => {
            const isApplied = appliedScholarshipIds.includes(sch.id);
            return (
              <div
                key={sch.id}
                className="bg-gradient-to-b from-[#FFFDF7] via-amber-50/50 to-stone-50 border border-amber-200/90 rounded-2xl p-6 sm:p-7 shadow-xs hover:border-amber-400 hover:shadow-md transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/80 pb-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                      {isHi ? 'वार्षिक समाज छात्रवृत्ति योजना' : 'Annual Samaj Scholarship Scheme'}
                    </span>
                    <h3 className="font-bold text-stone-900 text-xl font-display">
                      {sch.title}
                    </h3>
                  </div>
                  <span className="text-sm sm:text-base font-bold text-amber-900 bg-amber-100 border border-amber-300 px-3.5 py-1.5 rounded-xl shrink-0">
                    {sch.amount}
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-stone-700 space-y-2 bg-white/80 p-4 rounded-xl border border-stone-200">
                  <div>
                    <span className="text-stone-500 font-semibold">{isHi ? 'लक्षित विद्यार्थी:' : 'Target:'} </span>
                    <span className="text-stone-800 font-medium">{sch.target}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 font-semibold">{isHi ? 'पात्रता:' : 'Eligibility:'} </span>
                    <span className="text-stone-800">{sch.eligibility}</span>
                  </div>
                  <div className="text-amber-900 font-bold">
                    {isHi ? 'आवेदन की अंतिम तिथि:' : 'Last Date:'} {sch.lastDate}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  {isApplied ? (
                    <div className="py-2.5 px-6 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-700" />
                      <span>{isHi ? '✓ छात्रवृत्ति आवेदन पंजीकृत' : '✓ Scholarship Applied'}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedScholarship(sch);
                        handleRemovePhoto();
                      }}
                      className="px-6 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs sm:text-sm font-bold cursor-pointer transition-all flex items-center gap-2 shadow-xs"
                    >
                      <GraduationCap className="w-4 h-4 text-amber-200" />
                      <span>{isHi ? 'छात्रवृत्ति हेतु ऑनलाइन आवेदन करें' : 'Apply For Scholarship'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ============================================================ */}
      {/* Tab 3: Skills Workshops (निःशुल्क कौशल कार्यशालाएं) */}
      {/* ============================================================ */}
      {activeTab === 'skills' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {WORKSHOPS.map((ws) => {
            const isApplied = appliedWorkshopIds.includes(ws.id);
            return (
              <div
                key={ws.id}
                className="bg-gradient-to-b from-[#FFFDF7] via-amber-50/40 to-stone-50 border border-amber-200/90 rounded-2xl p-6 shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                      {ws.category}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                      {ws.seats}
                    </span>
                  </div>

                  <h4 className="font-bold text-stone-900 text-lg leading-snug">
                    {ws.title}
                  </h4>

                  <p className="text-xs text-stone-600 font-hindi leading-relaxed">
                    {ws.desc}
                  </p>

                  <div className="bg-white/90 p-3 rounded-xl border border-stone-200 space-y-1 text-xs">
                    <div className="text-amber-900 font-semibold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-700" />
                      <span>{ws.schedule}</span>
                    </div>
                    <div className="text-stone-600 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-stone-400" />
                      <span>{isHi ? 'प्रशिक्षक:' : 'Instructor:'} <strong>{ws.instructor}</strong></span>
                    </div>
                    <div className="text-stone-500">
                      {isHi ? 'माध्यम:' : 'Mode:'} <span className="text-stone-800 font-medium">{ws.mode}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  {isApplied ? (
                    <div className="w-full py-2.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-700" />
                      <span>{isHi ? '✓ सीट आरक्षित' : '✓ Seat Reserved'}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedWorkshop(ws);
                        handleRemovePhoto();
                      }}
                      className="w-full py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Compass className="w-4 h-4 text-amber-200" />
                      <span>{isHi ? 'निःशुल्क सीट आरक्षित करें' : 'Register Free Seat'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ============================================================ */}
      {/* 1. POPUP: JOB APPLICATION FORM (रोजगार आवेदन प्रपत्र) */}
      {/* ============================================================ */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn font-hindi">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-stone-200 max-h-[94vh] overflow-y-auto my-auto p-6 sm:p-8 space-y-5">
            <div className="flex items-start justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  {isHi ? 'सीधा रोजगार आवेदन प्रपत्र' : 'Direct Job Application'}
                </span>
                <h3 className="text-xl font-bold font-display text-stone-900 mt-1">
                  {selectedJob.title}
                </h3>
                <div className="text-xs text-amber-800 font-semibold mt-0.5">
                  {selectedJob.company} · {selectedJob.location} ({selectedJob.salary})
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedJob(null);
                  handleRemovePhoto();
                }}
                className="text-stone-400 hover:text-stone-700 p-1.5 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleJobSubmit} className="space-y-4">
              {/* Photo Upload Section */}
              {renderPhotoUploadField(isHi ? 'उम्मीदवार पासपोर्ट फोटो' : 'Applicant Passport Photo')}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">{isHi ? 'पूरा नाम *' : 'Full Name *'}</label>
                  <input
                    type="text"
                    required
                    value={jobForm.fullName}
                    onChange={(e) => setJobForm({ ...jobForm, fullName: e.target.value })}
                    placeholder={isHi ? 'उदा. राहुल जांगिड़' : 'e.g. Rahul Jangid'}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">{isHi ? 'उपजाति / शाखा *' : 'Subcaste / Branch *'}</label>
                  <select
                    value={jobForm.subcaste}
                    onChange={(e) => setJobForm({ ...jobForm, subcaste: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  >
                    <option value="जांगिड़ (सुथार)">{isHi ? 'जांगिड़ (सुथार)' : 'Jangid (Suthar)'}</option>
                    <option value="पंचाल (लुहार)">{isHi ? 'पंचाल (लुहार)' : 'Panchal (Luhar)'}</option>
                    <option value="सोनी (स्वर्णकार)">{isHi ? 'सोनी (स्वर्णकार)' : 'Soni (Swarnakar)'}</option>
                    <option value="शिल्पकार (मूर्तिकार)">{isHi ? 'शिल्पकार (मूर्तिकार)' : 'Shilpkar (Sculptor)'}</option>
                    <option value="कंसारा / कास्यकार">{isHi ? 'कंसारा / कास्यकार' : 'Kansara (Metal Crafts)'}</option>
                    <option value="विश्वकर्मा अन्य">{isHi ? 'विश्वकर्मा अन्य' : 'Other Vishwakarma'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">{isHi ? 'मोबाइल / व्हाट्सएप *' : 'Mobile / WhatsApp *'}</label>
                  <input
                    type="tel"
                    required
                    value={jobForm.phone}
                    onChange={(e) => setJobForm({ ...jobForm, phone: e.target.value })}
                    placeholder="+91 98290 00000"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">{isHi ? 'ईमेल पता *' : 'Email Address *'}</label>
                  <input
                    type="email"
                    required
                    value={jobForm.email}
                    onChange={(e) => setJobForm({ ...jobForm, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">{isHi ? 'वर्तमान शहर *' : 'Current City *'}</label>
                  <input
                    type="text"
                    required
                    value={jobForm.city}
                    onChange={(e) => setJobForm({ ...jobForm, city: e.target.value })}
                    placeholder={isHi ? 'उदा. जयपुर' : 'e.g. Jaipur'}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">{isHi ? 'राज्य *' : 'State *'}</label>
                  <input
                    type="text"
                    required
                    value={jobForm.state}
                    onChange={(e) => setJobForm({ ...jobForm, state: e.target.value })}
                    placeholder={isHi ? 'उदा. राजस्थान' : 'e.g. Rajasthan'}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">{isHi ? 'उच्चतम शैक्षणिक योग्यता *' : 'Highest Qualification *'}</label>
                  <input
                    type="text"
                    required
                    value={jobForm.qualification}
                    onChange={(e) => setJobForm({ ...jobForm, qualification: e.target.value })}
                    placeholder={isHi ? 'उदा. बी.टेक (सिविल) / आईटीआई' : 'e.g. B.Tech / Diploma / ITI'}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">{isHi ? 'कुल कार्य अनुभव *' : 'Work Experience *'}</label>
                  <input
                    type="text"
                    required
                    value={jobForm.experienceYears}
                    onChange={(e) => setJobForm({ ...jobForm, experienceYears: e.target.value })}
                    placeholder={isHi ? 'उदा. 3 वर्ष अथवा फ्रेशर' : 'e.g. 3 years or Fresher'}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">
                  {isHi ? 'तकनीकी कौशल व सॉफ्टवेयर ज्ञान' : 'Technical Skills & Software'}
                </label>
                <input
                  type="text"
                  value={jobForm.skills}
                  onChange={(e) => setJobForm({ ...jobForm, skills: e.target.value })}
                  placeholder={isHi ? 'उदा. AutoCAD, CNC Programming, SketchUp...' : 'e.g. AutoCAD, CNC, SketchUp...'}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">
                  {isHi
                    ? 'रिज्यूमे अथवा पोर्टफोलियो लिंक (Google Drive / LinkedIn / Behance)'
                    : 'Resume or Portfolio Link (Google Drive / LinkedIn)'}
                </label>
                <input
                  type="url"
                  value={jobForm.resumeLink}
                  onChange={(e) => setJobForm({ ...jobForm, resumeLink: e.target.value })}
                  placeholder="https://drive.google.com/your-resume.pdf"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedJob(null);
                    handleRemovePhoto();
                  }}
                  className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  {isHi ? 'रद्द करें' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <Briefcase className="w-4 h-4 text-amber-200" />
                  <span>{isHi ? 'आवेदन सबमिट करें' : 'Submit Application'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. POPUP: SCHOLARSHIP APPLICATION FORM (छात्रवृत्ति आवेदन प्रपत्र) */}
      {/* ============================================================ */}
      {selectedScholarship && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn font-hindi">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-stone-200 max-h-[94vh] overflow-y-auto my-auto p-6 sm:p-8 space-y-5">
            <div className="flex items-start justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  {isHi ? 'मेधावी छात्रवृत्ति आवेदन प्रपत्र' : 'Scholarship Application Form'}
                </span>
                <h3 className="text-xl font-bold font-display text-stone-900 mt-1">
                  {selectedScholarship.title}
                </h3>
                <div className="text-xs text-amber-800 font-semibold mt-0.5">
                  {isHi ? 'सहायता राशि:' : 'Amount:'} {selectedScholarship.amount}
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedScholarship(null);
                  handleRemovePhoto();
                }}
                className="text-stone-400 hover:text-stone-700 p-1.5 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScholarshipSubmit} className="space-y-4">
              {/* Photo Upload Section */}
              {renderPhotoUploadField(isHi ? 'विद्यार्थी पासपोर्ट फोटो' : 'Student Passport Photo')}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">{isHi ? 'विद्यार्थी का नाम *' : 'Student Full Name *'}</label>
                  <input
                    type="text"
                    required
                    value={scholarshipForm.fullName}
                    onChange={(e) => setScholarshipForm({ ...scholarshipForm, fullName: e.target.value })}
                    placeholder={isHi ? 'उदा. पूजा शर्मा' : 'e.g. Pooja Sharma'}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">{isHi ? 'पिता / अभिभावक का नाम *' : 'Father / Guardian Name *'}</label>
                  <input
                    type="text"
                    required
                    value={scholarshipForm.fatherName}
                    onChange={(e) => setScholarshipForm({ ...scholarshipForm, fatherName: e.target.value })}
                    placeholder={isHi ? 'उदा. श्री सत्यनारायण शर्मा' : 'e.g. Satyanarayan Sharma'}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">{isHi ? 'उपजाति / गोत्र *' : 'Subcaste / Gotra *'}</label>
                  <input
                    type="text"
                    required
                    value={scholarshipForm.subcaste}
                    onChange={(e) => setScholarshipForm({ ...scholarshipForm, subcaste: e.target.value })}
                    placeholder={isHi ? 'उदा. जांगिड़ / कश्यप गोत्र' : 'e.g. Jangid / Kashyap'}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">{isHi ? 'मोबाइल / व्हाट्सएप नंबर *' : 'Mobile / WhatsApp Number *'}</label>
                  <input
                    type="tel"
                    required
                    value={scholarshipForm.phone}
                    onChange={(e) => setScholarshipForm({ ...scholarshipForm, phone: e.target.value })}
                    placeholder="+91 98290 XXXXX"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">{isHi ? 'अध्ययनरत कॉलेज / विश्वविद्यालय *' : 'College / University *'}</label>
                  <input
                    type="text"
                    required
                    value={scholarshipForm.college}
                    onChange={(e) => setScholarshipForm({ ...scholarshipForm, college: e.target.value })}
                    placeholder={isHi ? 'उदा. एमएनआईटी जयपुर' : 'e.g. National Institute of Tech'}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">{isHi ? 'पाठ्यक्रम व वर्तमान वर्ष *' : 'Course & Academic Year *'}</label>
                  <input
                    type="text"
                    required
                    value={scholarshipForm.course}
                    onChange={(e) => setScholarshipForm({ ...scholarshipForm, course: e.target.value })}
                    placeholder={isHi ? 'उदा. बी.टेक तृतीय वर्ष' : 'e.g. B.Tech 3rd Year'}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">{isHi ? 'गत परीक्षा प्राप्तांक (%) *' : 'Previous Exam Score (%) *'}</label>
                  <input
                    type="text"
                    required
                    value={scholarshipForm.percentage}
                    onChange={(e) => setScholarshipForm({ ...scholarshipForm, percentage: e.target.value })}
                    placeholder="उदा. 86.5%"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">{isHi ? 'पारिवारिक वार्षिक आय *' : 'Annual Family Income *'}</label>
                  <input
                    type="text"
                    required
                    value={scholarshipForm.annualIncome}
                    onChange={(e) => setScholarshipForm({ ...scholarshipForm, annualIncome: e.target.value })}
                    placeholder="उदा. ₹ 2,50,000"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">{isHi ? 'मूल निवास शहर / राज्य *' : 'City / State *'}</label>
                  <input
                    type="text"
                    required
                    value={scholarshipForm.city}
                    onChange={(e) => setScholarshipForm({ ...scholarshipForm, city: e.target.value })}
                    placeholder={isHi ? 'उदा. जोधपुर, राज.' : 'e.g. Jodhpur, Raj.'}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">
                  {isHi
                    ? 'बैंक खाता विवरण (बैंक नाम, खाता संख्या, IFSC)'
                    : 'Bank Account Details (Bank Name, A/C No, IFSC)'}
                </label>
                <input
                  type="text"
                  value={scholarshipForm.bankAccount}
                  onChange={(e) => setScholarshipForm({ ...scholarshipForm, bankAccount: e.target.value })}
                  placeholder="उदा. SBI, A/C: 38290192831, IFSC: SBIN0001234"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedScholarship(null);
                    handleRemovePhoto();
                  }}
                  className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  {isHi ? 'रद्द करें' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <GraduationCap className="w-4 h-4 text-amber-200" />
                  <span>{isHi ? 'छात्रवृत्ति आवेदन सबमिट करें' : 'Submit Scholarship Application'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. POPUP: WORKSHOP SEAT REGISTRATION FORM (कार्यशाला पंजीकरण) */}
      {/* ============================================================ */}
      {selectedWorkshop && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn font-hindi">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-stone-200 max-h-[94vh] overflow-y-auto my-auto p-6 sm:p-8 space-y-5">
            <div className="flex items-start justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  {isHi ? 'निःशुल्क कौशल कार्यशाला सीट आरक्षण' : 'Free Skill Workshop Seat Booking'}
                </span>
                <h3 className="text-xl font-bold font-display text-stone-900 mt-1">
                  {selectedWorkshop.title}
                </h3>
                <div className="text-xs text-amber-800 font-semibold mt-0.5">
                  {selectedWorkshop.schedule} · {selectedWorkshop.mode}
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedWorkshop(null);
                  handleRemovePhoto();
                }}
                className="text-stone-400 hover:text-stone-700 p-1.5 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleWorkshopSubmit} className="space-y-4">
              {/* Photo Upload Section */}
              {renderPhotoUploadField(isHi ? 'प्रतिभागी पासपोर्ट फोटो' : 'Participant Passport Photo')}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">{isHi ? 'प्रतिभागी का नाम *' : 'Participant Name *'}</label>
                  <input
                    type="text"
                    required
                    value={workshopForm.fullName}
                    onChange={(e) => setWorkshopForm({ ...workshopForm, fullName: e.target.value })}
                    placeholder={isHi ? 'उदा. विक्रम सुथार' : 'e.g. Vikram Suthar'}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">{isHi ? 'आयु (वर्ष) *' : 'Age (Years) *'}</label>
                  <input
                    type="number"
                    required
                    min="15"
                    max="65"
                    value={workshopForm.age}
                    onChange={(e) => setWorkshopForm({ ...workshopForm, age: e.target.value })}
                    placeholder={isHi ? 'उदा. 24' : 'e.g. 24'}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">{isHi ? 'मोबाइल / व्हाट्सएप नंबर *' : 'Mobile / WhatsApp Number *'}</label>
                  <input
                    type="tel"
                    required
                    value={workshopForm.phone}
                    onChange={(e) => setWorkshopForm({ ...workshopForm, phone: e.target.value })}
                    placeholder="+91 98290 XXXXX"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">{isHi ? 'ईमेल *' : 'Email *'}</label>
                  <input
                    type="email"
                    required
                    value={workshopForm.email}
                    onChange={(e) => setWorkshopForm({ ...workshopForm, email: e.target.value })}
                    placeholder="vikram@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">{isHi ? 'वर्तमान कार्य / पेशा *' : 'Current Profession / Work *'}</label>
                  <input
                    type="text"
                    required
                    value={workshopForm.profession}
                    onChange={(e) => setWorkshopForm({ ...workshopForm, profession: e.target.value })}
                    placeholder={isHi ? 'उदा. पारंपरिक काष्ठशिल्पी / छात्र' : 'e.g. Woodcraft Artisan / Student'}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">{isHi ? 'शहर व राज्य *' : 'City & State *'}</label>
                  <input
                    type="text"
                    required
                    value={workshopForm.city}
                    onChange={(e) => setWorkshopForm({ ...workshopForm, city: e.target.value })}
                    placeholder={isHi ? 'उदा. अहमदाबाद, गुजरात' : 'e.g. Ahmedabad, Gujarat'}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">{isHi ? 'बैच प्राथमिकता *' : 'Batch Preference *'}</label>
                <select
                  value={workshopForm.batchPreference}
                  onChange={(e) => setWorkshopForm({ ...workshopForm, batchPreference: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                >
                  <option value={isHi ? 'शनिवार प्रातः 10:00 से 01:00' : 'Saturday Morning 10:00 to 01:00'}>
                    {isHi ? 'शनिवार प्रातः 10:00 से 01:00' : 'Saturday Morning 10:00 to 01:00'}
                  </option>
                  <option value={isHi ? 'रविवार दोपहर 02:00 से 05:00' : 'Sunday Afternoon 02:00 to 05:00'}>
                    {isHi ? 'रविवार दोपहर 02:00 से 05:00' : 'Sunday Afternoon 02:00 to 05:00'}
                  </option>
                  <option value={isHi ? 'सप्ताह के दिन (शाम 06:00 से 08:00)' : 'Weekdays (Evening 06:00 to 08:00)'}>
                    {isHi ? 'सप्ताह के दिन (शाम 06:00 से 08:00)' : 'Weekdays (Evening 06:00 to 08:00)'}
                  </option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">
                  {isHi
                    ? 'इस कार्यशाला से आप विशेष रूप से क्या सीखना चाहते हैं?'
                    : 'What specific skills would you like to master in this workshop?'}
                </label>
                <textarea
                  rows={2}
                  value={workshopForm.learningGoal}
                  onChange={(e) => setWorkshopForm({ ...workshopForm, learningGoal: e.target.value })}
                  placeholder={
                    isHi
                      ? 'उदा. सीएनसी रूटिंग, 3D डिजाइनिंग अथवा अपने पारिवारिक शिल्प को आधुनिक रूप देना...'
                      : 'e.g. CNC routing, 3D cad design, or modernizing traditional artisan craft...'
                  }
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedWorkshop(null);
                    handleRemovePhoto();
                  }}
                  className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  {isHi ? 'रद्द करें' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <Compass className="w-4 h-4 text-amber-200" />
                  <span>{isHi ? 'सीट आरक्षित करें' : 'Confirm Seat'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. MODAL: OFFICIAL CONFIRMATION RECEIPT (सफल पंजीकरण पावती) */}
      {/* ============================================================ */}
      {confirmationData && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn font-hindi">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-stone-200 max-h-[96vh] overflow-y-auto my-auto p-6 sm:p-8 space-y-6">
            {/* Success Celebration Alert Banner */}
            <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl flex items-center gap-3.5 shadow-md animate-bounce-short">
              <div className="w-12 h-12 rounded-full bg-white text-emerald-800 flex items-center justify-center shrink-0 font-bold shadow-xs">
                <ShieldCheck className="w-7 h-7 text-emerald-600" />
              </div>
              <div className="text-xs sm:text-sm leading-relaxed">
                <div className="font-bold text-base flex items-center gap-1.5">
                  <span>{isHi ? 'आवेदन सफलतापूर्वक पंजीकृत!' : 'Application Successfully Registered!'}</span>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>
                <div className="text-emerald-100 text-xs mt-0.5">
                  {isHi
                    ? 'आपकी आधिकारिक पावती (E-Receipt) जनरेट हो चुकी है तथा रिकॉर्ड दर्ज कर लिया गया है।'
                    : 'Your official E-Receipt has been generated and the record has been securely submitted.'}
                </div>
              </div>
            </div>

            {/* Official Pass / Receipt Card (Printable) */}
            <div
              id="printable-youth-receipt"
              className="bg-gradient-to-br from-[#FFFDF7] via-amber-50/60 to-stone-50 border-2 border-amber-500 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xs relative overflow-hidden"
            >
              {/* Top Invocation Header */}
              <div className="flex items-center justify-between border-b-2 border-amber-700/30 pb-3">
                <div>
                  <div className="text-[11px] font-bold text-amber-900">
                    {isHi
                      ? 'ॐ श्री विश्वकर्मणे नमः · अखिल भारतीय विश्वकर्मा युवा व शिक्षा प्रकोष्ठ'
                      : 'Om Shri Vishwakarma Namah · All India Vishwakarma Youth & Education Wing'}
                  </div>
                  <div className="text-xs font-mono text-stone-500 mt-0.5">
                    {isHi ? 'पंजीकरण सं.:' : 'Reg No:'} <strong>{confirmationData.regNumber}</strong>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                  {isHi ? 'स्वीकृत व अग्रेषित' : 'Verified & Approved'}
                </span>
              </div>

              {/* Applicant Profile Bar */}
              <div className="flex items-start gap-4">
                <div className="w-20 h-24 rounded-2xl overflow-hidden bg-amber-100 shrink-0 border-2 border-amber-400 shadow-xs">
                  <img
                    src={confirmationData.photo}
                    alt={confirmationData.applicantName}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-2 py-0.5 rounded inline-block">
                    {confirmationData.type === 'job'
                      ? (isHi ? 'रोजगार अभ्यर्थी (Job Candidate)' : 'Job Candidate')
                      : confirmationData.type === 'scholarship'
                      ? (isHi ? 'छात्रवृत्ति लाभार्थी (Scholarship)' : 'Scholarship Beneficiary')
                      : (isHi ? 'कार्यशाला प्रतिभागी (Workshop)' : 'Workshop Participant')}
                  </div>
                  <h4 className="text-lg font-bold text-stone-900 font-display">
                    {confirmationData.applicantName}
                  </h4>
                  <div className="text-xs font-semibold text-amber-900">
                    {confirmationData.title}
                  </div>
                  <div className="text-[11px] text-stone-500">
                    {confirmationData.subtitle}
                  </div>
                </div>
              </div>

              {/* Submitted Details Grid */}
              <div className="bg-white/90 rounded-2xl p-4 border border-amber-200 text-xs space-y-2">
                <div className="grid grid-cols-2 gap-2 pb-2 border-b border-stone-100">
                  <div>
                    <span className="text-stone-400 block text-[10px]">{isHi ? 'मोबाइल:' : 'Mobile:'}</span>
                    <span className="font-semibold text-stone-800 font-mono">{confirmationData.phone}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">{isHi ? 'ईमेल:' : 'Email:'}</span>
                    <span className="font-semibold text-stone-800 font-mono truncate block">{confirmationData.email}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {confirmationData.fields.map((f, idx) => (
                    <div key={idx}>
                      <span className="text-stone-400 block text-[10px]">{f.label}:</span>
                      <span className="font-semibold text-stone-800">{f.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* QR Verification Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-amber-200">
                <div className="flex items-center gap-3">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                      `VSM-YOUTH:${confirmationData.regNumber}|${confirmationData.applicantName}|${confirmationData.title}`
                    )}`}
                    alt="Verification QR"
                    className="w-14 h-14 rounded-lg border border-amber-300 bg-white p-1"
                  />
                  <div className="text-[11px] text-stone-600 leading-tight">
                    <div className="font-bold text-stone-900">{isHi ? 'डिजिटल सत्यापन क्यूआर' : 'Digital Verification QR'}</div>
                    <div>{isHi ? 'अभिलेख सत्यापन हेतु प्रस्तुत करें।' : 'Scan for instant authentication.'}</div>
                  </div>
                </div>

                <div className="text-right text-[10px] text-stone-500">
                  <div>{isHi ? 'पंजीकरण तिथि:' : 'Reg Date:'}</div>
                  <div className="font-mono font-bold text-stone-800">
                    {confirmationData.date}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={printReceipt}
                className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>{isHi ? 'ई-पावती प्रिंट / PDF सेव करें' : 'Print E-Receipt / Save PDF'}</span>
              </button>

              <button
                onClick={() => setConfirmationData(null)}
                className="py-2.5 px-6 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                {isHi ? 'समाप्त करें' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
