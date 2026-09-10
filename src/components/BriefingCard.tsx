import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { BriefingMeta } from "@/lib/types";
import { LockBadge } from "./LockBadge";

export function BriefingCard({
  briefing,
  featured = false,
}: {
  briefing: BriefingMeta;
  featured?: boolean;
}) {
  return (
    <article
      className={
        featured
          ? "rounded-2xl border border-line bg-panel p-7 md:p-9"
          : "border-b border-line py-7 last:border-0"
      }
    >
      <div className="flex flex-wrap items-center gap-2 text-xs text-mute">
        <time dateTime={briefing.date}>{formatDate(briefing.date)}</time>
        <span aria-hidden>·</span>
        <span>{briefing.readingMinutes} min</span>
        {briefing.hasPaywall && (
          <>
            <span aria-hidden>·</span>
            <LockBadge membersOnly={briefing.membersOnly} />
          </>
        )}
      </div>
      <h2
        className={
          featured
            ? "mt-3 font-display text-3xl leading-tight text-paper md:text-4xl"
            : "mt-2 font-display text-2xl leading-snug text-paper"
        }
      >
        <Link
          href={`/briefings/${briefing.slug}`}
          className="hover:text-brass transition-colors"
        >
          {briefing.title}
        </Link>
      </h2>
      {briefing.excerpt && (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-mute md:text-base">
          {briefing.excerpt}
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        {briefing.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-line px-2.5 py-0.5 text-[11px] text-mute"
          >
            {tag}
          </span>
        ))}
      </div>
      <Link
        href={`/briefings/${briefing.slug}`}
        className="mt-5 inline-flex text-sm text-brass hover:text-brass-bright"
      >
        Read briefing →
      </Link>
    </article>
  );
}
