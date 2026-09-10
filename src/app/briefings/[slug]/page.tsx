import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBriefing, getBriefingSlugs } from "@/lib/content";
import { isMember } from "@/lib/membership";
import { formatDate } from "@/lib/format";
import { Mdx } from "@/components/Mdx";
import { Paywall } from "@/components/Paywall";
import { LockBadge } from "@/components/LockBadge";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ member?: string | string[] }>;
};

export async function generateStaticParams() {
  return getBriefingSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const briefing = getBriefing(slug);
  if (!briefing) return { title: "Not found" };
  return {
    title: briefing.title,
    description: briefing.excerpt,
  };
}

export default async function BriefingPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const briefing = getBriefing(slug);
  if (!briefing) notFound();

  const member = await isMember(sp);
  const showFull = member || !briefing.hasPaywall;
  // membersOnly: non-members still see free lede when PAYWALL marker present
  const body = showFull
    ? [briefing.freeContent, briefing.paidContent].filter(Boolean).join("\n\n")
    : briefing.freeContent;

  return (
    <article className="mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-20">
      <Link
        href="/briefings"
        className="text-sm text-mute hover:text-brass transition-colors"
      >
        ← Briefings
      </Link>

      <header className="mt-6 border-b border-line pb-10">
        <div className="flex flex-wrap items-center gap-2 text-xs text-mute">
          <time dateTime={briefing.date}>{formatDate(briefing.date)}</time>
          <span aria-hidden>·</span>
          <span>{briefing.readingMinutes} min read</span>
          {briefing.hasPaywall && (
            <>
              <span aria-hidden>·</span>
              <LockBadge membersOnly={briefing.membersOnly} />
              {member && (
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-emerald-300">
                  Member view
                </span>
              )}
            </>
          )}
        </div>
        <h1 className="mt-4 font-display text-4xl leading-tight text-paper md:text-5xl">
          {briefing.title}
        </h1>
        <div className="mt-5 flex flex-wrap gap-2">
          {briefing.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-line px-2.5 py-0.5 text-[11px] text-mute"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div className="mt-10">
        <Mdx source={body} />
      </div>

      {!showFull && <Paywall title="Continue past the lede" />}

      {(briefing.disclaimer || briefing.sources?.length) && (
        <footer className="mt-16 border-t border-line pt-8 text-sm text-mute">
          {briefing.disclaimer && (
            <p className="leading-relaxed">{briefing.disclaimer}</p>
          )}
          {briefing.sources && briefing.sources.length > 0 && (
            <div className="mt-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-mute/70">
                Sources
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {briefing.sources.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </footer>
      )}
    </article>
  );
}
