import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import mosques from '../src/data/mosques.json' with { type: 'json' };
import * as dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Helper for ESM __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from project root
dotenv.config({ path: resolve(__dirname, '../.env') });

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

const uploadMosques = async () => {
  if (!firebaseConfig.apiKey) {
    console.error("❌ Firebase API Key is missing. Make sure your .env file is correctly set up!");
    return;
  }

  console.log("🚀 Starting mosque upload...");
  console.log(`Using Project ID: ${firebaseConfig.projectId}`);
  
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const mosquesCol = collection(db, 'mosques');

    for (const mosque of mosques) {
      // Remove local ID if it exists and use namn as document ID for idempotency
      const { id, ...data } = mosque as any;
      const docRef = doc(mosquesCol, data.namn);
      await setDoc(docRef, data);
      console.log(`✅ Updated: ${data.namn}`);
    }

    console.log("🏁 Done! All mosques have been uploaded.");
  } catch (e) {
    console.error("❌ Critical error during upload:", e);
  }
};

uploadMosques();
