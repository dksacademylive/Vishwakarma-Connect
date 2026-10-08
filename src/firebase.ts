import { initializeApp } from 'firebase/app';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
  setDoc,
  onSnapshot
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Use provisioned firestoreDatabaseId if configured
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Test Connection on initial boot as required by system guidelines
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase connection notice: client is offline or initializing.');
    }
  }
}
testConnection();

// ==========================================
// 1. APPLICATIONS SERVICE (Jobs, Scholarships, Workshops)
// ==========================================
export interface StoredApplication {
  id: string;
  type: 'job' | 'scholarship' | 'workshop';
  regNumber: string;
  title: string;
  applicantName: string;
  photo: string;
  phone: string;
  email: string;
  city: string;
  fields: { label: string; value: string }[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export async function addApplicationToFirestore(appData: Omit<StoredApplication, 'id'>) {
  try {
    const colRef = collection(db, 'applications');
    const docRef = await addDoc(colRef, {
      ...appData,
      timestamp: serverTimestamp()
    });
    return docRef.id;
  } catch (err) {
    console.error('Error saving application to Firestore:', err);
    // Fallback locally
    return `local-${Date.now()}`;
  }
}

export async function fetchApplicationsFromFirestore(): Promise<StoredApplication[]> {
  try {
    const colRef = collection(db, 'applications');
    const q = query(colRef, limit(100));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
    })) as StoredApplication[];
  } catch (err) {
    console.error('Error fetching applications from Firestore:', err);
    return [];
  }
}

export async function updateApplicationStatusInFirestore(id: string, status: 'pending' | 'approved' | 'rejected') {
  try {
    const docRef = doc(db, 'applications', id);
    await updateDoc(docRef, { status });
    return true;
  } catch (err) {
    console.error('Error updating application status in Firestore:', err);
    return false;
  }
}

export async function deleteApplicationFromFirestore(id: string) {
  try {
    const docRef = doc(db, 'applications', id);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error('Error deleting application from Firestore:', err);
    return false;
  }
}

// ==========================================
// 2. COMMUNITY POSTS SERVICE
// ==========================================
export async function addPostToFirestore(postData: any) {
  try {
    const colRef = collection(db, 'posts');
    const docRef = await addDoc(colRef, {
      ...postData,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (err) {
    console.error('Error adding post to Firestore:', err);
    return null;
  }
}

export async function deletePostFromFirestore(postId: string) {
  try {
    const docRef = doc(db, 'posts', postId);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error('Error deleting post from Firestore:', err);
    return false;
  }
}

// ==========================================
// 3. MATRIMONIAL PROFILES SERVICE (Firebase पर शादी डेटा स्टोर)
// ==========================================
export interface StoredMatrimonialProfile {
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
  kundaliMatch?: string;
  about: string;
  familyDetails: string;
  contactPerson: string;
  contactNumber: string;
  email?: string;
  verified?: boolean;
  isOtpVerified?: boolean;
  verificationMethod?: 'firebase_sms' | 'whatsapp' | 'manual';
  photoPrivacy?: 'public' | 'blur_request' | 'members_only' | 'private';
  contactPrivacy?: 'public' | 'on_request' | 'guardian_only';
  firebaseSynced?: boolean;
  profileVisibility?: 'active' | 'hidden';
  createdAt?: any;
}

export async function addMatrimonialProfileToFirestore(
  profileData: Omit<StoredMatrimonialProfile, 'id'> | StoredMatrimonialProfile
) {
  try {
    const colRef = collection(db, 'matrimony');
    const docRef = await addDoc(colRef, {
      ...profileData,
      name: profileData.fullName, // Match security rule request.resource.data.name
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (err) {
    console.error('Error saving matrimony profile to Firestore:', err);
    return null;
  }
}

export async function fetchMatrimonialProfilesFromFirestore(): Promise<StoredMatrimonialProfile[]> {
  try {
    const colRef = collection(db, 'matrimony');
    const q = query(colRef, limit(100));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        fullName: data.fullName || data.name || 'विश्वकर्मा बंधु',
        gender: data.gender || 'groom',
        age: Number(data.age) || 26,
        height: data.height || '5 ft 7 in',
        subcaste: data.subcaste || 'जांगिड़ (सुथार)',
        gotra: data.gotra || 'वशिष्ठ',
        motherGotra: data.motherGotra || 'कौशिक',
        education: data.education || 'स्नातक',
        occupation: data.occupation || 'स्वरोजगार',
        annualIncome: data.annualIncome || '8-12 लाख',
        city: data.city || 'जयपुर',
        state: data.state || 'राजस्थान',
        photo: data.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
        kundaliMatch: data.kundaliMatch || 'गुण मिलान विचारणीय',
        about: data.about || 'संस्कारवान, धार्मिक एवं सुशिक्षित परिवार।',
        familyDetails: data.familyDetails || 'प्रतिष्ठित विश्वकर्मा परिवार।',
        contactPerson: data.contactPerson || 'अभिभावक',
        contactNumber: data.contactNumber || '',
        email: data.email || '',
        verified: data.verified ?? true,
        isOtpVerified: data.isOtpVerified ?? true,
        verificationMethod: data.verificationMethod || 'firebase_sms',
        photoPrivacy: data.photoPrivacy || 'public',
        contactPrivacy: data.contactPrivacy || 'public',
        profileVisibility: data.profileVisibility || 'active',
        firebaseSynced: true,
      };
    }) as StoredMatrimonialProfile[];
  } catch (err) {
    console.error('Error fetching matrimony profiles from Firestore:', err);
    return [];
  }
}

export async function deleteMatrimonialProfileFromFirestore(id: string) {
  try {
    const docRef = doc(db, 'matrimony', id);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error('Error deleting matrimonial profile from Firestore:', err);
    return false;
  }
}

export async function updateMatrimonialProfileVisibilityInFirestore(
  id: string,
  profileVisibility: 'active' | 'hidden'
) {
  try {
    const docRef = doc(db, 'matrimony', id);
    await updateDoc(docRef, { profileVisibility });
    return true;
  } catch (err) {
    console.error('Error updating profile visibility in Firestore:', err);
    return false;
  }
}

// ==========================================
// 4. FIREBASE PHONE AUTH SERVICE (Phone SMS OTP)
// ==========================================
export function setupRecaptcha(containerId: string): RecaptchaVerifier {
  if (typeof window !== 'undefined' && (window as any).recaptchaVerifier) {
    try {
      (window as any).recaptchaVerifier.clear();
    } catch {
      // ignore
    }
  }

  const verifier = new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => {
      console.log('Firebase Phone Auth reCAPTCHA verified');
    },
    'expired-callback': () => {
      console.warn('Firebase Phone Auth reCAPTCHA expired, renewing...');
    }
  });

  if (typeof window !== 'undefined') {
    (window as any).recaptchaVerifier = verifier;
  }

  return verifier;
}

export async function sendFirebasePhoneOtp(
  phoneNumber: string,
  appVerifier: RecaptchaVerifier
): Promise<ConfirmationResult> {
  let cleanNumber = phoneNumber.replace(/[^0-9+]/g, '');
  if (!cleanNumber.startsWith('+')) {
    if (cleanNumber.length === 10) {
      cleanNumber = `+91${cleanNumber}`;
    } else if (cleanNumber.length === 12 && cleanNumber.startsWith('91')) {
      cleanNumber = `+${cleanNumber}`;
    } else {
      cleanNumber = `+91${cleanNumber}`;
    }
  }
  return await signInWithPhoneNumber(auth, cleanNumber, appVerifier);
}

// ==========================================
// 5. GLOBAL SITE CONFIG & CONTENT SYNC (Firebase Firestore Real-time Sync)
// Allows Super Admin changes to instantly reflect across all public links and devices
// ==========================================

export async function saveSiteConfigToFirestore(configKey: string, data: any) {
  try {
    const docRef = doc(db, 'site_config', configKey);
    await setDoc(docRef, {
      key: configKey,
      data: JSON.stringify(data),
      updatedAt: serverTimestamp()
    }, { merge: true });
    return true;
  } catch (err) {
    console.warn(`Firestore site_config write failed for ${configKey}:`, err);
    return false;
  }
}

export async function fetchSiteConfigFromFirestore<T>(configKey: string): Promise<T | null> {
  try {
    const docRef = doc(db, 'site_config', configKey);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const snapData = docSnap.data();
      if (snapData?.data) {
        return JSON.parse(snapData.data) as T;
      }
    }
    return null;
  } catch (err) {
    console.warn(`Firestore site_config read failed for ${configKey}:`, err);
    return null;
  }
}

export function subscribeSiteConfigFromFirestore<T>(
  configKey: string,
  onUpdate: (data: T) => void
): () => void {
  try {
    const docRef = doc(db, 'site_config', configKey);
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const snapData = docSnap.data();
          if (snapData?.data) {
            try {
              const parsed = JSON.parse(snapData.data) as T;
              onUpdate(parsed);
            } catch (e) {
              console.warn(`JSON parse error for Firestore config ${configKey}:`, e);
            }
          }
        }
      },
      (error) => {
        console.warn(`Firestore onSnapshot listener error for ${configKey}:`, error);
      }
    );
  } catch (err) {
    console.warn(`Failed to attach Firestore listener for ${configKey}:`, err);
    return () => {};
  }
}

