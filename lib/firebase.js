import { initializeApp, getApps } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Lazy-initialize Firebase only on the client side to prevent SSR/prerender crashes
let _auth = null;

function getFirebaseAuth() {
  if (typeof window === 'undefined') return null; // Skip on server
  if (_auth) return _auth;

  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  _auth = getAuth(app);
  return _auth;
}

export { getFirebaseAuth, RecaptchaVerifier, signInWithPhoneNumber };
