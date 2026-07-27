"use client";

import { useCallback, useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";
import { writeUser } from "@/lib/db";

export function useGoogleAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signedIn, setSignedIn] = useState(false);

  const configured = isFirebaseConfigured();

  const signInWithGoogle = useCallback(async () => {
    setError(null);
    const auth = getFirebaseAuth();
    if (!auth) {
      setError("Firebase is not configured. Add credentials to .env.local to enable Google sign-in.");
      return;
    }
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const now = new Date().toISOString().split("T")[0];
      void writeUser({
        id: user.uid,
        phone: user.phoneNumber ?? "",
        name: user.displayName ?? "",
        email: user.email ?? "",
        status: "active",
        ordersCount: 0,
        totalSpent: 0,
        joinedAt: now,
        lastLoginAt: now,
        avatar: user.photoURL ?? `https://placehold.co/40x40/f97316/ffffff?text=${(user.displayName ?? "U")[0].toUpperCase()}`,
      });

      setSignedIn(true);
    } catch (err) {
      const code = (err as { code?: string })?.code;
      const messages: Record<string, string> = {
        "auth/popup-closed-by-user": "Sign-in cancelled. Please try again.",
        "auth/popup-blocked": "Popup was blocked by the browser. Please allow popups for this site.",
        "auth/unauthorized-domain": "This domain isn't authorized in Firebase. Add it under Authentication → Settings → Authorized domains.",
        "auth/cancelled-popup-request": "Another sign-in is in progress.",
      };
      setError((code && messages[code]) || "Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, signedIn, configured, signInWithGoogle };
}
