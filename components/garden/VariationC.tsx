"use client";

import React, { useState, useMemo } from "react";
import { GARDEN_PRODUCTS, GARDEN_HISTORY, fmtDate } from "./data";
import { Mock } from "./Mocks";
import { VideoCardThumb } from "./VideoCardThumb";
import { DetailModal } from "./DetailModal";
import type { GardenEntry } from "./data";

export function VariationC() {
  const [selected, setSelected] = useState<GardenEntry | null>(null);

  const byYear = useMemo(() => {
    const g: Record<number, GardenEntry[]> = {};
    GARDEN_HISTORY.forEach((h) => {
      const y = h.date.getFullYear();
      if (!g[y]) g[y] = [];
      g[y].push(h);
    });
    return g;
  }, []);

  const cols = 4;
  const selectedProduct = selected
    ? GARDEN_PRODUCTS.find((p) => p.id === selected.product)!
    : null;

  return (
    <div className="varC">
      <div className="varC-head">
        <div className="head-l">
          <div className="garden-eyebrow">contact sheet</div>
          <h2
            style={{
              fontFamily: "'Newsreader', serif",
              fontWeight: 400,
              fontSize: "clamp(36px, 4.5vw, 64px)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            AI tool UI archive.
          </h2>
        </div>
        <div className="head-r garden-mono">
          <div>
            <span className="garden-dim">TOTAL</span> {GARDEN_HISTORY.length}
          </div>
          <div>
            <span className="garden-dim">TOOLS</span> {GARDEN_PRODUCTS.length}
          </div>
          <div>
            <span className="garden-dim">YEARS</span>{" "}
            {Object.keys(byYear).length}
          </div>
        </div>
      </div>

      {Object.keys(byYear)
        .map(Number)
        .sort()
        .map((year) => (
          <div key={year} className="year-block">
            <div className="year-label">
              <div className="year-num">{year}</div>
              <div className="year-rule" />
              <div className="garden-mono garden-dim">
                {byYear[year].length} release
                {byYear[year].length > 1 ? "s" : ""}
              </div>
            </div>
            <div
              className="contact-grid"
              style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
            >
              {byYear[year].map((e) => {
                const product = GARDEN_PRODUCTS.find(
                  (p) => p.id === e.product
                )!;
                return (
                  <div
                    key={e.id}
                    className="contact-cell"
                    onClick={() => setSelected(e)}
                  >
                    <div
                      className="contact-thumb"
                      style={{
                        position: "relative",
                        overflow: "hidden",
                        ...(e.previewImage
                          ? { backgroundImage: `url(${e.previewImage})`, backgroundSize: "cover", backgroundPosition: "center top" }
                          : {}),
                      }}
                    >
                      {!e.previewImage && e.videoThumbUrl && (
                        <VideoCardThumb src={e.videoThumbUrl} />
                      )}
                      {!e.previewImage && !e.videoThumbUrl && (
                        <div style={{ position: "absolute", inset: 0 }}>
                          <Mock kind={e.kind} palette={e.palette} />
                        </div>
                      )}
                      <div className="contact-crosshair tl" />
                      <div className="contact-crosshair tr" />
                      <div className="contact-crosshair bl" />
                      <div className="contact-crosshair br" />
                    </div>
                    <div className="contact-meta">
                      <span className="garden-mono">
                        {fmtDate(e.date, "iso")}
                      </span>
                      <span className="garden-mono garden-dim">
                        {product.name}
                      </span>
                    </div>
                    <div className="contact-ver garden-mono">{e.title}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

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
