"use client";

import { useRouter } from "next/navigation";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import Button from "@/components/ui/Button";

export default function LoginForm() {
  const router = useRouter();
  const { loading, error, signedIn, configured, signInWithGoogle } = useGoogleAuth();

  if (signedIn) {
    return (
      <div className="rounded-lg border border-border bg-surface p-6 text-center">
        <p className="mb-4 font-medium text-success">You are signed in.</p>
        <Button onClick={() => router.push("/account")}>Go to your account</Button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-8 flex flex-col items-center gap-6">
      {!configured && (
        <p className="w-full rounded-md bg-primary-light px-3 py-2 text-xs text-primary text-center">
          Demo mode: Google sign-in is not wired to a Firebase project yet. Add credentials
          to <code>.env.local</code> to enable real sign-in.
        </p>
      )}

      <div className="flex flex-col items-center gap-2 text-center">
        <div className="w-14 h-14 rounded-full bg-surface-alt flex items-center justify-center mb-2">
          <svg viewBox="0 0 24 24" className="w-8 h-8" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        </div>
        <p className="text-sm text-text-muted">Sign in to track orders and access your account</p>
      </div>

      {error && <p className="w-full text-sm text-danger text-center">{error}</p>}

      <button
        onClick={signInWithGoogle}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-border bg-white hover:bg-slate-50 transition-colors font-medium text-sm text-slate-700 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" aria-hidden="true">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        {loading ? "Signing in..." : "Continue with Google"}
      </button>
    </div>
  );
}
