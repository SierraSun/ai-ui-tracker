"use client";

import React, { useState, useMemo, useEffect } from "react";
import { GARDEN_PRODUCTS, GARDEN_HISTORY, fmtDate } from "./data";
import { Mock } from "./Mocks";
import { VideoCardThumb } from "./VideoCardThumb";

export function VariationD() {
  const [productId, setProductId] = useState(GARDEN_PRODUCTS[0].id);
  const productEntries = useMemo(
    () =>
      GARDEN_HISTORY.filter((h) => h.product === productId).sort(
        (a, b) => a.date.getTime() - b.date.getTime()
      ),
    [productId]
  );
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    setIdx(0);
  }, [productId]);

  const current = productEntries[idx];
  const productMeta = GARDEN_PRODUCTS.find((p) => p.id === productId)!;

  if (!current) return null;

  return (
    <div className="varD">
      <div className="varD-top">
        <div className="garden-eyebrow">
          spotlight · {productMeta.name.toLowerCase()}
        </div>
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
          Scrub through time.
        </h2>
        <div className="varD-products">
          {GARDEN_PRODUCTS.map((p, i) => (
            <button
              key={p.id}
              className={p.id === productId ? "prod on" : "prod"}
              onClick={() => setProductId(p.id)}
            >
              <span className="prod-idx">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="prod-name">{p.name}</span>
              <span className="prod-tag garden-dim">{p.tag}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="varD-stage">
        <div className="stage-overlay">
          <div className="stage-date">{fmtDate(current.date, "iso")}</div>
          <div className="stage-version">{current.title}</div>
          <div className="stage-note">{current.note || "—"}</div>
        </div>
        <div
          className="stage-screen"
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            ...(current.previewImage
              ? { backgroundImage: `url(${current.previewImage})`, backgroundSize: "cover", backgroundPosition: "center top" }
              : {}),
          }}
        >
          {!current.previewImage && current.videoThumbUrl && (
            <VideoCardThumb src={current.videoThumbUrl} />
          )}
          {!current.previewImage && !current.videoThumbUrl && (
            <div style={{ position: "absolute", inset: 0 }}>
              <Mock kind={current.kind} palette={current.palette} />
            </div>
          )}
        </div>
        <div className="stage-crosshairs">
          <div className="xh tl" />
          <div className="xh tr" />
          <div className="xh bl" />
          <div className="xh br" />
        </div>
      </div>

      <div className="varD-scrubber">
        <div className="scrub-head">
          <span>
            {idx + 1} / {productEntries.length}
          </span>
          <span className="garden-dim">click or drag to scrub</span>
        </div>
        <div className="scrub-track">
          {productEntries.map((e, i) => (
            <div
              key={e.id}
              className={i === idx ? "scrub-item on" : "scrub-item"}
              onClick={() => setIdx(i)}
            >
              <div
                className="scrub-thumb"
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
              </div>
              <div className="scrub-date">{fmtDate(e.date, "short")}</div>
            </div>
          ))}
        </div>
        <input
          type="range"
          min="0"
          max={productEntries.length - 1}
          value={idx}
          onChange={(e) => setIdx(parseInt(e.target.value))}
          className="scrub-range"
        />
      </div>
    </div>
  );
}
