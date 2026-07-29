"use client";

import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setReady(true);
      return;
    }
    const { onAuthStateChanged } = require("firebase/auth") as typeof import("firebase/auth");
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setReady(true);
    });
    return unsub;
  }, []);

  const signOut = async () => {
    const auth = getFirebaseAuth();
    if (!auth) return;
    const { signOut: firebaseSignOut } = require("firebase/auth") as typeof import("firebase/auth");
    await firebaseSignOut(auth);
    setUser(null);
  };

  return { user, ready, signOut };
}
