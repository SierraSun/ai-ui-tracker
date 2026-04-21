"use client";

import React, { useState } from "react";
import Link from "next/link";
import "./garden.css";
import { GARDEN_PRODUCTS, GARDEN_HISTORY } from "@/components/garden/data";
import { VariationA } from "@/components/garden/VariationA";
import { VariationB } from "@/components/garden/VariationB";
import { VariationC } from "@/components/garden/VariationC";
import { VariationD } from "@/components/garden/VariationD";

type Variation = "A" | "B" | "C" | "D";

const VARIATION_LABELS: Record<Variation, string> = {
  A: "Timeline River",
  B: "Vertical Spine",
  C: "Contact Sheet",
  D: "Spotlight",
};

const latestDate = GARDEN_HISTORY[GARDEN_HISTORY.length - 1]?.date;
const latestYear = latestDate?.getFullYear() ?? 2026;
const earliestYear = GARDEN_HISTORY[0]?.date.getFullYear() ?? 2024;

export default function GardenPage() {
  const [variation, setVariation] = useState<Variation>("A");

  return (
    <div className="garden-root">
      {/* Sticky Nav */}
      <nav className="garden-nav">
        <Link href="/" className="garden-nav-brand">
          <div className="garden-nav-mark" />
          <span className="garden-nav-name">
            Product <em>Garden</em>
          </span>
        </Link>

        <div className="garden-nav-links">
          {(["A", "B", "C", "D"] as Variation[]).map((v) => (
            <button
              key={v}
              className={variation === v ? "on" : ""}
              onClick={() => setVariation(v)}
            >
              {v} · {VARIATION_LABELS[v]}
            </button>
          ))}
        </div>

        <div className="garden-nav-right">
          <Link href="/" className="garden-nav-back">
            ← Back to Tracker
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="garden-hero">
        <div className="garden-hero-grid">
          <div>
            <div className="garden-eyebrow">Product Garden · est. 2026</div>
            <h1 className="garden-display">
              The <em>UI archive</em> for AI tools.
            </h1>
            <p className="garden-lede">
              A calm, time-ordered record of how AI coding and design tools have
              shaped their interfaces. Scroll the timeline, study the changes.
            </p>
          </div>
          <div className="garden-hero-meta">
            <div className="row">
              <span>index</span>
              <span>0001 / live</span>
            </div>
            <div className="row">
              <span>sources</span>
              <span>{GARDEN_PRODUCTS.length} tools</span>
            </div>
            <div className="row">
              <span>releases</span>
              <span>{GARDEN_HISTORY.length} archived</span>
            </div>
            <div className="row">
              <span>span</span>
              <span>
                {earliestYear} — {latestYear}
              </span>
            </div>
            <div className="row">
              <span>license</span>
              <span>research · fair use</span>
            </div>
          </div>
        </div>

        <div className="garden-hero-strip">
          {GARDEN_PRODUCTS.map((p, i) => (
            <div key={p.id} className="cell">
              <span>
                <strong>{String(i + 1).padStart(2, "0")}</strong> · {p.name}
              </span>
              <span className="dot" />
            </div>
          ))}
        </div>
      </section>

      {/* Active Variation */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {variation === "A" && <VariationA />}
        {variation === "B" && <VariationB />}
        {variation === "C" && <VariationC />}
        {variation === "D" && <VariationD />}
      </div>

      {/* Footer */}
      <footer className="garden-foot">
        <div>
          <h4>Product Garden</h4>
          <div>
            An ongoing archive of AI tool UI over time. Built for researchers,
            designers, and historians of interfaces.
          </div>
        </div>
        <div>
          <h4>Archive</h4>
          <Link href="/garden">All snapshots</Link>
          {GARDEN_PRODUCTS.map((p) => (
            <Link key={p.id} href={`/tool/${p.id}`}>
              {p.name}
            </Link>
          ))}
        </div>
        <div>
          <h4>Views</h4>
          {(["A", "B", "C", "D"] as Variation[]).map((v) => (
            <button
              key={v}
              onClick={() => setVariation(v)}
              style={{
                all: "unset",
                cursor: "pointer",
                display: "block",
                padding: "3px 0",
                color: variation === v ? "var(--accent)" : "var(--ink-dim)",
              }}
            >
              {VARIATION_LABELS[v]}
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
}
