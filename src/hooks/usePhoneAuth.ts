"use client";

import { useCallback, useRef, useState } from "react";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from "firebase/auth";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";

export type PhoneAuthStep = "enter-phone" | "enter-code" | "verified";

/**
 * Wraps Firebase phone-number sign-in (invisible reCAPTCHA + OTP confirmation).
 * Requires Firebase Phone Auth to be enabled and configured via env vars
 * (see .env.local.example). Falls back to a disabled state with a clear
 * error when Firebase is not configured, so the rest of the app still builds/runs.
 */
export function usePhoneAuth(recaptchaContainerId: string) {
  const [step, setStep] = useState<PhoneAuthStep>("enter-phone");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const confirmationRef = useRef<ConfirmationResult | null>(null);
  const verifierRef = useRef<RecaptchaVerifier | null>(null);

  const configured = isFirebaseConfigured();

  const ensureVerifier = useCallback(() => {
    const auth = getFirebaseAuth();
    if (!auth) return null;
    if (!verifierRef.current) {
      verifierRef.current = new RecaptchaVerifier(auth, recaptchaContainerId, {
        size: "invisible",
      });
    }
    return verifierRef.current;
  }, [recaptchaContainerId]);

  const sendCode = useCallback(
    async (phone: string) => {
      setError(null);
      const auth = getFirebaseAuth();
      if (!auth) {
        setError(
          "Phone login is not configured yet. Add Firebase credentials to .env.local (see README)."
        );
        return;
      }
      const verifier = ensureVerifier();
      if (!verifier) return;
      setLoading(true);
      try {
        confirmationRef.current = await signInWithPhoneNumber(auth, phone, verifier);
        setPhoneNumber(phone);
        setStep("enter-code");
      } catch {
        setError("Could not send verification code. Check the number and try again.");
      } finally {
        setLoading(false);
      }
    },
    [ensureVerifier]
  );

  const confirmCode = useCallback(async (code: string) => {
    setError(null);
    if (!confirmationRef.current) {
      setError("Please request a new code.");
      return;
    }
    setLoading(true);
    try {
      await confirmationRef.current.confirm(code);
      setStep("verified");
    } catch {
      setError("Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setStep("enter-phone");
    setError(null);
    confirmationRef.current = null;
  }, []);

  return {
    step,
    error,
    loading,
    phoneNumber,
    configured,
    sendCode,
    confirmCode,
    reset,
  };
}
