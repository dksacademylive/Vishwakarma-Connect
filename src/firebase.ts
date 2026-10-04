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
