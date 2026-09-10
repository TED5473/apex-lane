import { MDXRemote } from "next-mdx-remote/rsc";
import type { ReactNode } from "react";

const components = {
  h2: (props: { children?: ReactNode }) => (
    <h2
      className="mt-10 mb-4 font-display text-2xl text-paper scroll-mt-24"
      {...props}
    />
  ),
  h3: (props: { children?: ReactNode }) => (
    <h3
      className="mt-8 mb-3 font-display text-xl text-paper scroll-mt-24"
      {...props}
    />
  ),
  p: (props: { children?: ReactNode }) => (
    <p className="my-4 text-[1.05rem] leading-[1.75] text-paper/90" {...props} />
  ),
  ul: (props: { children?: ReactNode }) => (
    <ul className="my-4 list-disc space-y-2 pl-6 text-paper/90" {...props} />
  ),
  ol: (props: { children?: ReactNode }) => (
    <ol className="my-4 list-decimal space-y-2 pl-6 text-paper/90" {...props} />
  ),
  li: (props: { children?: ReactNode }) => (
    <li className="leading-relaxed" {...props} />
  ),
  strong: (props: { children?: ReactNode }) => (
    <strong className="font-semibold text-paper" {...props} />
  ),
  a: (props: { children?: ReactNode; href?: string }) => (
    <a
      className="text-brass underline decoration-brass/40 underline-offset-2 hover:decoration-brass"
      {...props}
    />
  ),
  blockquote: (props: { children?: ReactNode }) => (
    <blockquote
      className="my-6 border-l-2 border-brass/50 pl-5 text-mute italic"
      {...props}
    />
  ),
  table: (props: { children?: ReactNode }) => (
    <div className="my-8 overflow-x-auto rounded-xl border border-line">
      <table className="min-w-full text-left text-sm" {...props} />
    </div>
  ),
  thead: (props: { children?: ReactNode }) => (
    <thead className="bg-panel text-mute" {...props} />
  ),
  th: (props: { children?: ReactNode }) => (
    <th
      className="border-b border-line px-4 py-3 font-medium tracking-wide"
      {...props}
    />
  ),
  td: (props: { children?: ReactNode }) => (
    <td className="border-b border-line/70 px-4 py-3 text-paper/90" {...props} />
  ),
  hr: () => <hr className="my-10 border-line" />,
  code: (props: { children?: ReactNode }) => (
    <code
      className="rounded bg-panel px-1.5 py-0.5 text-[0.9em] text-brass"
      {...props}
    />
  ),
};

export function Mdx({ source }: { source: string }) {
  return <MDXRemote source={source} components={components} />;
}
