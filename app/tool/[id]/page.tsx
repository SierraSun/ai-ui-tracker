import { notFound } from "next/navigation";
import Link from "next/link";
import { tools } from "@/data/tools";
import { GeometricPattern } from "@/components/GeometricPattern";
import { TimelineEntry } from "@/components/TimelineEntry";

export function generateStaticParams() {
  return tools.map((t) => ({ id: t.id }));
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tool = tools.find((t) => t.id === id);
  if (!tool) notFound();

  // Group changes by year
  const byYear = tool.changes.reduce<Record<string, typeof tool.changes>>(
    (acc, change) => {
      const year = change.date.slice(0, 4);
      if (!acc[year]) acc[year] = [];
      acc[year].push(change);
      return acc;
    },
    {}
  );

  const years = Object.keys(byYear).sort().reverse();

  return (
    <main className="min-h-screen bg-bg">
      {/* Hero header */}
      <div
        className="relative border-b border-border overflow-hidden"
        style={{ minHeight: 200 }}
      >
        <GeometricPattern
          type={tool.patternType}
          color={tool.accentColor}
          opacity={0.1}
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${tool.accentColor}18 0%, transparent 60%)`,
          }}
        />
        <div className="relative z-10 px-8 py-8">
          {/* Back nav */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] font-mono text-dim hover:text-text transition-colors mb-6 uppercase tracking-widest"
          >
            ← All Tools
          </Link>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] mb-2"
                style={{ color: tool.accentColor }}>
                {tool.company}
              </p>
              <h1 className="text-4xl font-mono font-semibold text-text tracking-tight mb-2">
                {tool.name}
              </h1>
              <p className="text-sm font-mono text-dim">{tool.tagline}</p>
            </div>
            <div className="flex items-center gap-6 pb-1">
              <div className="text-right">
                <p className="text-[10px] font-mono text-dim mb-1">Releases</p>
                <p className="text-2xl font-mono text-text">{tool.changes.length}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-mono text-dim mb-1">Since</p>
                <p className="text-2xl font-mono text-text">
                  {tool.changes[tool.changes.length - 1].date.slice(0, 7)}
                </p>
              </div>
              <div className="flex gap-2">
                <a
                  href={tool.changelogUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-mono px-3 py-1.5 border border-border text-dim hover:text-text hover:border-muted transition-colors"
                >
                  CHANGELOG ↗
                </a>
                <a
                  href={tool.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-mono px-3 py-1.5 border transition-colors"
                  style={{
                    borderColor: `${tool.accentColor}60`,
                    color: tool.accentColor,
                  }}
                >
                  WEBSITE ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="px-8 py-10">
        {years.map((year) => (
          <div key={year} className="mb-12">
            {/* Year marker */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-5xl font-mono font-semibold text-border select-none">
                {year}
              </span>
              <div className="flex-1 h-px bg-border" />
              <span className="text-[10px] font-mono text-dim">
                {byYear[year].length} release{byYear[year].length > 1 ? "s" : ""}
              </span>
            </div>

            {/* Timeline entries */}
            <div className="relative ml-4">
              {/* Vertical line */}
              <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />

              <div className="space-y-0">
                {byYear[year].map((change, i) => (
                  <TimelineEntry
                    key={i}
                    change={change}
                    accentColor={tool.accentColor}
                    isLast={i === byYear[year].length - 1}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
