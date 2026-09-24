import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-5 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-gold">
        404
      </p>
      <h1 className="font-serif text-4xl text-ink md:text-5xl">Page not found</h1>
      <p className="max-w-sm text-muted">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-4 rounded-full bg-ink px-8 py-4 text-sm font-medium tracking-wide text-white transition hover:bg-rose-gold"
      >
        Back to Home
      </Link>
    </div>
  );
}
