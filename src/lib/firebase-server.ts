/**
 * Server-side Firebase helper (no "use client" — safe to import in Route Handlers).
 * Reads the same NEXT_PUBLIC_FIREBASE_* env vars as the client build.
 */
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const cfg = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function isConfigured() {
  return Boolean(cfg.apiKey && cfg.projectId);
}

function getDb() {
  const app = getApps().length ? getApps()[0] : initializeApp(cfg as object);
  return getFirestore(app);
}

export interface RazorpayConfig {
  keyId: string;
  keySecret: string;
}

/**
 * Resolve Razorpay credentials. Order of precedence:
 *   1. Keys saved via the admin panel (Firestore: settings/razorpay)
 *   2. Environment variables (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET)
 */
export async function getRazorpayConfig(): Promise<RazorpayConfig | null> {
  if (isConfigured()) {
    try {
      const snap = await getDoc(doc(getDb(), "settings", "razorpay"));
      if (snap.exists()) {
        const data = snap.data();
        if (data.keyId && data.keySecret) {
          return { keyId: data.keyId as string, keySecret: data.keySecret as string };
        }
      }
    } catch {
      // fall through to the env fallback
    }
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (keyId && keySecret) return { keyId, keySecret };

  return null;
}
