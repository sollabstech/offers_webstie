import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-2 text-3xl font-semibold text-text">Page not found</h1>
      <p className="mb-6 text-text-muted">
        We couldn&apos;t find the page you were looking for. It may have moved or no longer exists.
      </p>
      <Link href="/" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
        Back to home
      </Link>
    </main>
  );
}
