"use client";

import Link from "next/link";
import { Tool } from "@/data/tools";
import { GeometricPattern } from "./GeometricPattern";

export function ToolCard({ tool }: { tool: Tool }) {
  const latestChange = tool.changes[0];
  const updateCount = tool.changes.reduce((acc, c) => acc + c.details.length, 0);

  return (
    <Link href={`/tool/${tool.id}`}>
      <div
        className="group relative h-[280px] rounded-none border border-border bg-surface overflow-hidden cursor-pointer transition-all duration-300 hover:border-opacity-60"
        style={{ "--accent": tool.accentColor } as React.CSSProperties}
      >
        {/* Geometric background */}
        <GeometricPattern
          type={tool.patternType}
          color={tool.accentColor}
          opacity={0.12}
          className="transition-opacity duration-300 group-hover:opacity-100"
        />

        {/* Hover glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(ellipse at 30% 50%, ${tool.accentColor}15 0%, transparent 70%)`,
          }}
        />

        {/* Top bar */}
        <div className="relative z-10 p-5 flex justify-between items-start">
          <div>
            <p className="text-[10px] font-mono text-dim uppercase tracking-widest mb-1">
              {tool.company}
            </p>
            <h2 className="text-xl font-mono font-semibold text-text tracking-tight">
              {tool.name}
            </h2>
          </div>
          <div
            className="w-1.5 h-1.5 rounded-full mt-1 opacity-60 group-hover:opacity-100 transition-opacity"
            style={{ backgroundColor: tool.accentColor }}
          />
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-5">
          {/* Latest update tag */}
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-[10px] font-mono px-2 py-0.5 rounded-sm"
              style={{
                backgroundColor: `${tool.accentColor}20`,
                color: tool.accentColor,
                border: `1px solid ${tool.accentColor}40`,
              }}
            >
              {latestChange.date}
            </span>
            {latestChange.version && (
              <span className="text-[10px] font-mono text-dim">
                v{latestChange.version}
              </span>
            )}
          </div>

          <p className="text-xs font-mono text-text/80 leading-relaxed mb-4 line-clamp-2">
            {latestChange.title}
          </p>

          {/* Stats row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-mono text-dim">
                {tool.changes.length} releases
              </span>
              <span className="text-[10px] font-mono text-dim">
                {updateCount} changes
              </span>
            </div>
            <span
              className="text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: tool.accentColor }}
            >
              VIEW TIMELINE →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
