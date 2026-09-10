import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Briefing, BriefingFrontmatter, BriefingMeta } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content/briefings");
const PAYWALL_MARKER = "<!-- PAYWALL -->";

function estimateMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

function splitPaywall(
  body: string,
  freePreviewWords?: number
): { freeContent: string; paidContent: string; hasPaywall: boolean } {
  if (body.includes(PAYWALL_MARKER)) {
    const [free, ...rest] = body.split(PAYWALL_MARKER);
    return {
      freeContent: free.trim(),
      paidContent: rest.join(PAYWALL_MARKER).trim(),
      hasPaywall: true,
    };
  }

  if (freePreviewWords && freePreviewWords > 0) {
    const words = body.trim().split(/\s+/);
    if (words.length > freePreviewWords) {
      return {
        freeContent: words.slice(0, freePreviewWords).join(" ") + "…",
        paidContent: words.slice(freePreviewWords).join(" "),
        hasPaywall: true,
      };
    }
  }

  return { freeContent: body.trim(), paidContent: "", hasPaywall: false };
}

function parseFile(filename: string): Briefing {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), "utf8");
  const { data, content } = matter(raw);
  const fm = data as BriefingFrontmatter;
  const { freeContent, paidContent, hasPaywall } = splitPaywall(
    content,
    fm.freePreviewWords
  );

  const plain = freeContent.replace(/[#>*`|_\[\]]/g, "").replace(/\s+/g, " ").trim();
  const excerpt =
    fm.excerpt ||
    (plain.length > 180 ? plain.slice(0, 180).trim() + "…" : plain);

  return {
    title: fm.title,
    date: fm.date,
    slug: fm.slug || filename.replace(/\.mdx?$/, ""),
    tags: fm.tags || [],
    freePreviewWords: fm.freePreviewWords,
    membersOnly: fm.membersOnly,
    sources: fm.sources,
    disclaimer: fm.disclaimer,
    excerpt,
    readingMinutes: estimateMinutes(content),
    content: content.trim(),
    freeContent,
    paidContent,
    hasPaywall: hasPaywall || Boolean(fm.membersOnly),
  };
}

export function getAllBriefings(): BriefingMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => {
      const b = parseFile(f);
      return {
        title: b.title,
        date: b.date,
        slug: b.slug,
        tags: b.tags,
        freePreviewWords: b.freePreviewWords,
        membersOnly: b.membersOnly,
        sources: b.sources,
        disclaimer: b.disclaimer,
        excerpt: b.excerpt,
        readingMinutes: b.readingMinutes,
        hasPaywall: b.hasPaywall,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getBriefing(slug: string): Briefing | null {
  if (!fs.existsSync(CONTENT_DIR)) return null;
  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
  for (const f of files) {
    const b = parseFile(f);
    if (b.slug === slug || f.replace(/\.mdx?$/, "") === slug) return b;
  }
  return null;
}

export function getBriefingSlugs(): string[] {
  return getAllBriefings().map((b) => b.slug);
}
