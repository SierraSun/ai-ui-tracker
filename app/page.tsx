import { tools } from "@/data/tools";
import { ToolCard } from "@/components/ToolCard";

export default function Home() {
  const totalChanges = tools.reduce((acc, t) => acc + t.changes.length, 0);
  const latestDate = tools
    .flatMap((t) => t.changes.map((c) => c.date))
    .sort()
    .reverse()[0];

  return (
    <main className="min-h-screen bg-bg">
      {/* Header */}
      <header className="border-b border-border px-8 py-6 flex items-end justify-between">
        <div>
          <p className="text-[10px] font-mono text-dim uppercase tracking-[0.2em] mb-2">
            Interface Evolution Archive
          </p>
          <h1 className="text-2xl font-mono font-semibold text-text tracking-tight">
            AI UI Tracker
          </h1>
        </div>
        <div className="flex items-center gap-8 pb-0.5">
          <div className="text-right">
            <p className="text-xs font-mono text-dim">Tools tracked</p>
            <p className="text-lg font-mono text-text">{tools.length}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-mono text-dim">Total releases</p>
            <p className="text-lg font-mono text-text">{totalChanges}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-mono text-dim">Last updated</p>
            <p className="text-lg font-mono text-text">{latestDate}</p>
          </div>
        </div>
      </header>

      {/* Subheader */}
      <div className="px-8 py-4 border-b border-border flex items-center gap-6">
        <span className="text-[10px] font-mono text-dim uppercase tracking-widest">
          Focus: Agent Chat × Fine-grained Editing Interface Patterns
        </span>
        <span className="w-1 h-1 rounded-full bg-border" />
        <span className="text-[10px] font-mono text-dim">
          Click any tool to view full timeline
        </span>
      </div>

      {/* Grid */}
      <div className="p-8">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-px bg-border">
          {tools.map((tool) => (
            <div key={tool.id} className="bg-bg">
              <ToolCard tool={tool} />
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border px-8 py-4 flex items-center justify-between mt-auto">
        <p className="text-[10px] font-mono text-dim">
          Tracking UI patterns across AI coding & design tools
        </p>
        <p className="text-[10px] font-mono text-dim">
          Updated manually · SierraSun
        </p>
      </footer>
    </main>
  );
}
