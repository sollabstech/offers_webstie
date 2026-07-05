import type { Metadata } from "next";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to Offerss.com with your mobile number to track orders and get personalized recommendations.",
};

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="mb-1 text-2xl font-semibold text-text">Sign in</h1>
      <p className="mb-6 text-sm text-text-muted">
        Use your mobile number to sign in or create an account.
      </p>
      <LoginForm />
    </main>
  );
}
