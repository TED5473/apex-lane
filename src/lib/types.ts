export type BriefingFrontmatter = {
  title: string;
  date: string;
  slug: string;
  tags: string[];
  freePreviewWords?: number;
  membersOnly?: boolean;
  sources?: string[];
  disclaimer?: string;
  excerpt?: string;
};

export type BriefingMeta = BriefingFrontmatter & {
  readingMinutes: number;
  hasPaywall: boolean;
};

export type Briefing = BriefingMeta & {
  content: string;
  freeContent: string;
  paidContent: string;
};
