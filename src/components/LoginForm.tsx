"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePhoneAuth } from "@/hooks/usePhoneAuth";
import Button from "@/components/ui/Button";

/**
 * Mobile-number login using Firebase Phone Authentication (invisible reCAPTCHA + OTP).
 * TODO: set NEXT_PUBLIC_FIREBASE_* env vars and enable Phone sign-in in the
 * Firebase console before this becomes fully functional; see .env.local.example.
 */
export default function LoginForm() {
  const router = useRouter();
  const { step, error, loading, configured, sendCode, confirmCode, reset } =
    usePhoneAuth("recaptcha-container");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");

  if (step === "verified") {
    return (
      <div className="rounded-lg border border-border bg-surface p-6 text-center">
        <p className="mb-4 font-medium text-success">You are signed in.</p>
        <Button onClick={() => router.push("/account")}>Go to your account</Button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      {!configured && (
        <p className="mb-4 rounded-md bg-primary-light px-3 py-2 text-xs text-primary">
          Demo mode: phone login is not wired to a Firebase project yet. Add credentials
          to <code>.env.local</code> to enable real OTP sign-in.
        </p>
      )}

      {step === "enter-phone" && (
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            sendCode(`+91${phone}`);
          }}
        >
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-text">Mobile number</span>
            <div className="flex overflow-hidden rounded-md border border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary-light">
              <span className="flex items-center border-r border-border bg-surface-alt px-3 text-sm text-text-muted">
                +91
              </span>
              <input
                type="tel"
                required
                inputMode="numeric"
                pattern="[0-9]{10}"
                maxLength={10}
                placeholder="98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="flex-1 min-w-0 px-3 py-2 text-sm outline-none"
              />
            </div>
            <span className="text-xs text-text-muted">Enter your 10-digit mobile number.</span>
          </label>
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button type="submit" disabled={loading || phone.length !== 10} className="w-full">
            {loading ? "Sending code..." : "Send verification code"}
          </Button>
        </form>
      )}

      {step === "enter-code" && (
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            confirmCode(code);
          }}
        >
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-text">Enter the 6-digit code</span>
            <input
              type="text"
              inputMode="numeric"
              required
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="rounded-md border border-border px-3 py-2 text-sm tracking-widest outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
            />
          </label>
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Verifying..." : "Verify & sign in"}
          </Button>
          <button
            type="button"
            onClick={reset}
            className="text-sm text-primary underline underline-offset-2"
          >
            Use a different number
          </button>
        </form>
      )}

      <div id="recaptcha-container" />
    </div>
  );
}
