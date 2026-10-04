export type NavTab = 'home' | 'feed' | 'events' | 'directory' | 'matrimony' | 'heritage' | 'luminaries' | 'youth' | 'idcard';

export type Language = 'hi' | 'en';

export interface Comment {
  id: string;
  author: string;
  city: string;
  avatar: string;
  content: string;
  timeAgo: string;
}

export interface Post {
  id: string;
  author: string;
  roleOrGotra: string;
  city: string;
  avatar: string;
  category: 'utsav' | 'shilp' | 'social' | 'youth' | 'general';
  content: string;
  image?: string;
  likes: number;
  isLiked?: boolean;
  shares: number;
  comments: Comment[];
  createdAt: string;
  badge?: string;
}

export interface Artisan {
  id: string;
  name: string;
  subcaste: string;
  trade: 'wood' | 'metal' | 'jewelry' | 'architecture' | 'engineering' | 'stone';
  tradeLabelHi: string;
  tradeLabelEn: string;
  city: string;
  state: string;
  experienceYears: number;
  businessName: string;
  specialization: string;
  phone: string;
  rating: number;
  reviewCount: number;
  image: string;
  verified: boolean;
  featuredWork: string[];
}

export interface MatrimonialProfile {
  id: string;
  fullName: string;
  gender: 'groom' | 'bride';
  age: number;
  height: string;
  subcaste: string;
  gotra: string;
  motherGotra: string;
  education: string;
  occupation: string;
  annualIncome: string;
  city: string;
  state: string;
  photo: string;
  kundaliMatch: string;
  about: string;
  familyDetails: string;
  contactPerson: string;
  contactNumber: string;
  email?: string;
  verified?: boolean;
  isOtpVerified?: boolean;
  photoPrivacy?: 'public' | 'blur_request' | 'members_only';
  contactPrivacy?: 'public' | 'on_request' | 'guardian_only';
  profileVisibility?: 'active' | 'hidden';
}

export interface Temple {
  id: string;
  name: string;
  location: string;
  state: string;
  description: string;
  facilities: string[];
  contact: string;
  dailyTimings: string;
  dharamshalaRooms: number;
  image: string;
  verified?: boolean;
}

export interface MythologicalCreation {
  id: string;
  titleHi: string;
  titleEn: string;
  shortSummaryHi: string;
  fullStoryHi: string;
  architecturalSignificance: string;
  shloka: string;
  shlokaMeaning: string;
  patronDeity: string;
  keyFeatures: string[];
  connectedScriptureId?: string;
  puranaReference?: string;
  scripturalEvidence?: string;
  relatedScriptures?: { name: string; chapter: string; scriptureId: string }[];
}

export interface ShilpVanshaDetail {
  id: string;
  nameHi: string;
  rishi: string;
  craftHi: string;
  craftEn: string;
  symbol: string;
  deityHi: string;
  associatedGotras: string[];
  holyScriptures: string[];
  historicalRole: string;
  traditionalTools: string[];
  modernEvolution: string;
  salientContribution: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  fullName: string;
  mobile: string;
  email: string;
  city: string;
  state: string;
  attendeesCount: number;
  specialRequirement?: string;
  registeredAt: string;
  passNumber: string;
}

export interface SamajEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  venue: string;
  city: string;
  state?: string;
  organizer: string;
  category: string;
  attendeesCount: number;
  description?: string;
  bannerImage?: string;
  chiefGuest?: string;
  contactNumber?: string;
  highlights?: string[];
  isFeatured?: boolean;
}

export interface SamajIdCardData {
  fullName: string;
  fatherOrHusbandName: string;
  subcaste: string;
  gotra: string;
  bloodGroup: string;
  dob: string;
  mobile: string;
  city: string;
  state: string;
  membershipId: string;
  photoUrl: string;
  issueDate: string;
}

export interface OrgContactInfo {
  address: string;
  helpline: string;
  email: string;
  emergencyPhone: string;
  regNumber: string;
  bankUpi: string;
}

export interface JobItem {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  skills: string;
  deadline: string;
}

export interface ScholarshipItem {
  id: string;
  title: string;
  target: string;
  amount: string;
  eligibility: string;
  lastDate: string;
}

export interface WorkshopItem {
  id: string;
  title: string;
  category: string;
  desc: string;
  schedule: string;
  mode: string;
  seats: string;
  instructor: string;
}

export interface DonationPurposeItem {
  id: string;
  labelHi: string;
  labelEn: string;
  desc: string;
}

export interface DonationConfig {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  ifscCode: string;
  branch: string;
  upiId: string;
  payeeName: string;
  tax80gNumber: string;
  ngoDarpanId: string;
  supportPhone: string;
  suggestedAmounts?: number[];
  purposes?: DonationPurposeItem[];
  formTitleHi?: string;
  formSubtitleHi?: string;
}

export interface IdCardFormConfig {
  titleHi: string;
  issuingAuthority: string;
  validityNotice: string;
  helplinePhone: string;
  subcastes: string[];
  termsNote: string;
}

export interface MatrimonyFormConfig {
  formTitle: string;
  verificationNotice: string;
  disclaimer: string;
  contactHelpline: string;
  allowedSubcastes: string[];
}

export interface ArtisanFormConfig {
  formTitle: string;
  verificationNotice: string;
  benefitsNotice: string;
  trades: string[];
}

export interface PostFormConfig {
  formTitle: string;
  guidelinesNotice: string;
  categories: string[];
}


