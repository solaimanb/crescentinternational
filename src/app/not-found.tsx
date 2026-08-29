import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-3xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Page not found</h1>
        <p className="mt-3 text-slate-600">The page you requested does not exist.</p>
        <Link href="/" className="mt-6 inline-block text-sm font-semibold text-cyan-700">
          Back to Home
        </Link>
      </div>
    </main>
  );
}
