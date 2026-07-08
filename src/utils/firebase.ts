import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot, increment } from 'firebase/firestore';

// Firebase client configuration from firebase-applet-config.json
const firebaseConfig = {
  apiKey: "AIzaSyD1w4pQ_OFDhOfiyxesudscWE-xPykGyFw",
  authDomain: "gen-lang-client-0386284933.firebaseapp.com",
  projectId: "gen-lang-client-0386284933",
  storageBucket: "gen-lang-client-0386284933.firebasestorage.app",
  messagingSenderId: "1043787449574",
  appId: "1:1043787449574:web:c869146aba654ea5276727"
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore with the custom database ID provided by AI Studio
const databaseId = "ai-studio-84bdf486-1b93-4a80-9777-6b139c5859fa";
export const db = getFirestore(app, databaseId);
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Increment the view count for a specific store in Firestore atomically.
 * Creation-safe: If the document doesn't exist, it will be created with count: 1.
 */
export async function incrementStoreViews(storeId: number) {
  const path = `store_views/${storeId}`;
  try {
    const docRef = doc(db, 'store_views', String(storeId));
    await setDoc(docRef, {
      count: increment(1)
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Subscribe to real-time updates for a specific store's view count.
 */
export function subscribeToStoreViews(storeId: number, callback: (count: number) => void) {
  const path = `store_views/${storeId}`;
  const docRef = doc(db, 'store_views', String(storeId));
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      callback(data.count || 0);
    } else {
      callback(0);
    }
  }, (err) => {
    handleFirestoreError(err, OperationType.GET, path);
  });
}

/**
 * Reset view count for a store (Admin only)
 */
export async function resetStoreViews(storeId: number) {
  const path = `store_views/${storeId}`;
  try {
    const docRef = doc(db, 'store_views', String(storeId));
    await setDoc(docRef, {
      count: 0
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

