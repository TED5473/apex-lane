import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-24 text-center md:px-8">
      <p className="text-[11px] uppercase tracking-[0.22em] text-brass">404</p>
      <h1 className="mt-3 font-display text-4xl text-paper">Page not found</h1>
      <Link href="/" className="mt-8 inline-block text-brass hover:text-brass-bright">
        ← Home
      </Link>
    </div>
  );
}
