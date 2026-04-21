"use client";

import React, { useState } from "react";
import { GARDEN_PRODUCTS, GARDEN_HISTORY, fmtDate } from "./data";
import { Mock } from "./Mocks";
import { VideoCardThumb } from "./VideoCardThumb";

export function VariationB() {
  const [focus, setFocus] = useState(
    GARDEN_HISTORY[Math.floor(GARDEN_HISTORY.length / 2)]
  );

  const focusProduct = GARDEN_PRODUCTS.find((p) => p.id === focus.product)!;

  return (
    <div className="varB">
      <div className="varB-head">
        <div className="garden-eyebrow">vertical log</div>
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
          {GARDEN_PRODUCTS.length} tools.{" "}
          <em style={{ fontStyle: "italic", color: "var(--accent)" }}>
            {GARDEN_HISTORY.length} releases.
          </em>{" "}
          One spine.
        </h2>
        <p className="garden-lede" style={{ fontSize: 16, marginTop: 14 }}>
          A linear record of interface changes — click any entry to focus.
        </p>
      </div>

      <div className="varB-grid">
        <div className="varB-spine">
          {GARDEN_HISTORY.map((e) => {
            const product = GARDEN_PRODUCTS.find((p) => p.id === e.product)!;
            const isFocus = focus && focus.id === e.id;
            return (
              <div
                key={e.id}
                className={isFocus ? "spine-row on" : "spine-row"}
                onClick={() => setFocus(e)}
              >
                <div className="spine-date garden-mono">
                  {fmtDate(e.date, "iso")}
                </div>
                <div className="spine-bullet">
                  <div className="spine-dot" />
                </div>
                <div className="spine-content">
                  <div className="spine-product garden-mono">
                    {product.name.toUpperCase()}
                  </div>
                  <div className="spine-version">{e.title}</div>
                  <div
                    className="spine-thumb"
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
                  {e.note && (
                    <div className="spine-note">&ldquo;{e.note}&rdquo;</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="varB-aside">
          <div className="aside-sticky">
            <div className="garden-mono garden-eyebrow">focus</div>
            {focus && (
              <>
                <div className="aside-title">
                  {focusProduct.name} — {focus.title}
                </div>
                <div className="garden-mono garden-dim">
                  {fmtDate(focus.date, "long")}
                </div>
                <div
                  className="aside-big-screen"
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    ...(focus.previewImage
                      ? { backgroundImage: `url(${focus.previewImage})`, backgroundSize: "cover", backgroundPosition: "center top" }
                      : {}),
                  }}
                >
                  {!focus.previewImage && focus.videoThumbUrl && (
                    <VideoCardThumb src={focus.videoThumbUrl} />
                  )}
                  {!focus.previewImage && !focus.videoThumbUrl && (
                    <div style={{ position: "absolute", inset: 0 }}>
                      <Mock kind={focus.kind} palette={focus.palette} />
                    </div>
                  )}
                </div>
                <div className="aside-meta">
                  <div>
                    <span className="garden-mono garden-dim">tool</span>{" "}
                    <span>{focusProduct.name}</span>
                  </div>
                  <div>
                    <span className="garden-mono garden-dim">kind</span>{" "}
                    <span>{focusProduct.tag}</span>
                  </div>
                  <div>
                    <span className="garden-mono garden-dim">company</span>{" "}
                    <span>{focusProduct.company}</span>
                  </div>
                  {focus.note && (
                    <div>
                      <span className="garden-mono garden-dim">summary</span>{" "}
                      <span style={{ fontSize: 12, color: "var(--ink-dim)" }}>
                        {focus.note}
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
