"use client";

import { useState } from "react";
import { ChangeEntry } from "@/data/tools";
import { VideoPlayer, ImageGallery } from "@/components/MediaPlayer";

export function TimelineEntry({
  change,
  accentColor,
  isLast,
}: {
  change: ChangeEntry;
  accentColor: string;
  isLast: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const toggleExpanded = () => setExpanded((prev) => !prev);

  const hasMajor = change.tags.includes("Major");

  return (
    <div className="relative pl-8 pb-10">
      {/* Timeline dot */}
      <div
        className="absolute left-0 top-1.5 w-2 h-2 rounded-full -translate-x-[3.5px] border transition-all duration-200"
        style={{
          backgroundColor: expanded ? accentColor : "transparent",
          borderColor: expanded ? accentColor : "#2a2a2a",
          boxShadow: expanded ? `0 0 8px ${accentColor}60` : "none",
        }}
      />

      {/* Entry card */}
      <div
        className="border border-border bg-surface/50 transition-all duration-200 hover:border-muted"
        style={{
          borderLeftColor: hasMajor ? `${accentColor}60` : undefined,
          borderLeftWidth: hasMajor ? 2 : 1,
        }}
      >
        {/* Header row */}
        <div
          className="px-5 py-4 flex items-start justify-between gap-4 cursor-pointer"
          onClick={toggleExpanded}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-[10px] font-mono text-dim">{change.date}</span>
              {change.version && (
                <span
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm"
                  style={{
                    backgroundColor: `${accentColor}15`,
                    color: accentColor,
                    border: `1px solid ${accentColor}30`,
                  }}
                >
                  v{change.version}
                </span>
              )}
              {change.tags.map((tag) => (
                <span
                  key={tag}
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded-sm uppercase tracking-wide ${
                    tag === "Major"
                      ? "text-white"
                      : "text-dim border border-border"
                  }`}
                  style={
                    tag === "Major"
                      ? { backgroundColor: accentColor }
                      : undefined
                  }
                >
                  {tag}
                </span>
              ))}
            </div>
            <h3 className="text-sm font-mono font-medium text-text leading-snug">
              {change.title}
            </h3>
            <p className="text-xs font-mono text-dim mt-1 leading-relaxed">
              {change.summary}
            </p>
          </div>
          <button
            className="text-[10px] font-mono text-dim hover:text-text transition-colors shrink-0 mt-0.5"
            style={{ color: expanded ? accentColor : undefined }}
            onClick={(e) => {
              e.stopPropagation();
              toggleExpanded();
            }}
          >
            {expanded ? "COLLAPSE ↑" : "EXPAND ↓"}
          </button>
        </div>

        {/* Expanded content */}
        {expanded && (
          <div
            className="border-t border-border px-5 py-4 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Videos */}
            {change.videos && change.videos.length > 0 && (
              <div className="mb-2">
                {change.videos.map((v, i) => (
                  <VideoPlayer key={i} video={v} />
                ))}
              </div>
            )}

            {/* Images (multi-shot gallery) */}
            {change.images && change.images.length > 0 && (
              <ImageGallery images={change.images} title={change.title} />
            )}

            {/* Legacy single screenshot */}
            {change.screenshot && !imgError && !change.images && (
              <div className="mb-4 border border-border overflow-hidden">
                <div className="bg-muted/20 px-3 py-1.5 border-b border-border">
                  <span className="text-[9px] font-mono text-dim uppercase tracking-widest">
                    Interface Screenshot
                  </span>
                </div>
                <div
                  className="relative w-full"
                  style={{
                    width: "100%",
                    maxWidth: "calc(62vh * 16 / 9)",
                    margin: "0 auto",
                    aspectRatio: "16 / 9",
                    overflow: "hidden",
                    background: "#000",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={change.screenshot}
                    alt={change.title}
                    className="block w-full h-full object-cover"
                    onError={() => setImgError(true)}
                  />
                </div>
              </div>
            )}

            {/* Details list */}
            <div className="space-y-2">
              {change.details.map((detail, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span
                    className="text-[10px] font-mono mt-0.5 shrink-0"
                    style={{ color: accentColor }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-xs font-mono text-text/80 leading-relaxed">
                    {detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
