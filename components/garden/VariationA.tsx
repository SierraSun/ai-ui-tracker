"use client";

import React, { useState, useRef } from "react";
import { GARDEN_PRODUCTS, GARDEN_HISTORY, fmtDate } from "./data";
import { Mock } from "./Mocks";
import { DetailModal } from "./DetailModal";
import { VideoCardThumb } from "./VideoCardThumb";
import type { GardenEntry } from "./data";

export function VariationA() {
  const [selected, setSelected] = useState<GardenEntry | null>(null);
  const [filter, setFilter] = useState("all");
  const railRef = useRef<HTMLDivElement>(null);

  // [Claude Code 2026-04-21] Only show entries with a real UI screenshot (previewImage set).
  // Entries without previewImage fall back to video frames or Mock patterns — not suitable
  // for the Timeline River which focuses on visible interface changes.
  const uiEntries = GARDEN_HISTORY.filter((h) => !!h.previewImage);

  const items = (
    filter === "all"
      ? uiEntries
      : uiEntries.filter((h) => h.product === filter)
  ).slice().sort((a, b) => b.date.getTime() - a.date.getTime());

  const cardW = 340;
  const cardH = Math.round(cardW * 0.62);
  const gap = 24;

  const years = Array.from(
    new Set(items.map((i) => i.date.getFullYear()))
  ).sort((a, b) => b - a);

  const selectedProduct = selected
    ? GARDEN_PRODUCTS.find((p) => p.id === selected.product)!
    : null;

  return (
    <div
      className="varA"
      style={{ minHeight: "100vh", padding: "48px 8px 120px" }}
    >
      <div
        style={{
          padding: "0 40px",
          marginBottom: 28,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 32,
        }}
      >
        <div>
          <div className="garden-eyebrow">archive · timeline view</div>
          <h2
            style={{
              fontFamily: "'Newsreader', serif",
              fontWeight: 400,
              fontSize: "clamp(32px, 4vw, 56px)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            The evolution of AI coding &amp; design tools.
          </h2>
          <p className="garden-lede" style={{ fontSize: 16 }}>
            Scroll horizontally through the timeline — click any card to dig in.
          </p>
        </div>
        <div className="filter-chips">
          <button
            className={filter === "all" ? "chip on" : "chip"}
            onClick={() => setFilter("all")}
          >
            All · {uiEntries.length}
          </button>
          {GARDEN_PRODUCTS.map((p) => {
            const count = uiEntries.filter((h) => h.product === p.id).length;
            if (count === 0) return null;
            return (
              <button
                key={p.id}
                className={filter === p.id ? "chip on" : "chip"}
                onClick={() => setFilter(p.id)}
              >
                {p.name} · {count}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rail-wrap" ref={railRef}>
        <div className="rail" style={{ gap, padding: "0 40px" }}>
          {items.map((e) => {
            const product = GARDEN_PRODUCTS.find((p) => p.id === e.product)!;
            return (
              <div
                key={e.id}
                className="rail-card"
                style={{ width: cardW }}
                onClick={() => setSelected(e)}
              >
                <div className="card-meta">
                  <span className="garden-mono">{fmtDate(e.date, "iso")}</span>
                  <span className="garden-mono garden-dim">{product.name}</span>
                </div>
                {/* [Claude Code 2026-04-20] background-image instead of <img> to guarantee
                    image never escapes bounds — <img> can expand past overflow:hidden on first paint.
                    previewImage is derived by getPreviewImage() in garden/data.ts (Mux thumbnail / poster / images[0]). */}
                <div
                  className="card-screen"
                  style={{
                    height: cardH,
                    position: "relative",
                    overflow: "hidden",
                    ...(e.previewImage
                      ? {
                          backgroundImage: `url(${e.previewImage})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center top",
                        }
                      : {}),
                  }}
                >
                  {/* [Claude Code 2026-04-20] VideoCardThumb extracts real frame from mp4 when no static poster */}
                  {!e.previewImage && e.videoThumbUrl && (
                    <VideoCardThumb src={e.videoThumbUrl} />
                  )}
                  {!e.previewImage && !e.videoThumbUrl && (
                    <div style={{ position: "absolute", inset: 0 }}>
                      <Mock kind={e.kind} palette={e.palette} />
                    </div>
                  )}
                  {e.hasVideo && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 6,
                        right: 6,
                        background: "rgba(0,0,0,0.6)",
                        padding: "2px 6px",
                        fontSize: 9,
                        fontFamily: "monospace",
                        color: "rgba(255,255,255,0.8)",
                        zIndex: 3,
                      }}
                    >
                      ▶ VIDEO
                    </div>
                  )}
                </div>
                <div className="card-foot">
                  <div className="card-version">{e.title}</div>
                  {e.note && <div className="card-note">{e.note}</div>}
                </div>
              </div>
            );
          })}
        </div>

        <div className="axis" style={{ padding: "0 40px" }}>
          <div className="axis-line">
            {years.map((y) => (
              <div key={y} className="axis-year">
                <div className="axis-tick" />
                <div className="garden-mono">{y}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "60px 40px 0",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 24,
        }}
      >
        <div className="garden-stat">
          <div className="garden-mono garden-eyebrow" style={{ marginBottom: 0 }}>
            tools tracked
          </div>
          <div className="garden-stat-num">{GARDEN_PRODUCTS.length}</div>
        </div>
        <div className="garden-stat">
          <div className="garden-mono garden-eyebrow" style={{ marginBottom: 0 }}>
            releases archived
          </div>
          <div className="garden-stat-num">{uiEntries.length}</div>
        </div>
        <div className="garden-stat">
          <div className="garden-mono garden-eyebrow" style={{ marginBottom: 0 }}>
            span
          </div>
          <div className="garden-stat-num">
            {years[0]} — {years[years.length - 1]}
          </div>
        </div>
      </div>

      {selected && selectedProduct && (
        <DetailModal
          entry={selected}
          product={selectedProduct}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
