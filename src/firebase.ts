import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  doc,
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
  setDoc
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
        photoPrivacy: data.photoPrivacy || 'public',
        contactPrivacy: data.contactPrivacy || 'public',
        firebaseSynced: true,
      };
    }) as StoredMatrimonialProfile[];
  } catch (err) {
    console.error('Error fetching matrimony profiles from Firestore:', err);
    return [];
  }
}

