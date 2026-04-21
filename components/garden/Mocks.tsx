"use client";

import React from "react";
import { GardenKind, GardenPalette } from "./data";

const PALETTES = {
  A: { bg: "#0f1115", panel: "#16181e", ink: "#e8e9ec", dim: "#6b7280", accent: "#7dd3a8" },
  B: { bg: "#faf8f4", panel: "#ffffff", ink: "#1a1a1a", dim: "#9a9a9a", accent: "#d97757" },
  C: { bg: "#0a0a0a", panel: "#141414", ink: "#f0f0f0", dim: "#666", accent: "#e0e0e0" },
  D: { bg: "#f3f1ec", panel: "#ffffff", ink: "#222", dim: "#888", accent: "#3b5bdb" },
  E: { bg: "#1a1625", panel: "#241f33", ink: "#ede9f7", dim: "#8b84a3", accent: "#c084fc" },
  F: { bg: "#ffffff", panel: "#f5f5f5", ink: "#111", dim: "#888", accent: "#111" },
};

function MockChat({ palette = "A" }: { palette?: GardenPalette }) {
  const p = PALETTES[palette];
  const messages = [
    { role: "user", text: "Help me refactor this component" },
    { role: "ai", text: "I'll analyze the component structure and suggest improvements. The main issues are prop drilling and missing memoization." },
    { role: "user", text: "Show me the updated version" },
    { role: "ai", text: "Here's the refactored version with React.memo, proper prop types, and extracted sub-components for clarity." },
  ];
  return (
    <div style={{ width: "100%", height: "100%", background: p.bg, color: p.ink, display: "flex", fontFamily: "system-ui, sans-serif", fontSize: 10, overflow: "hidden" }}>
      <div style={{ width: "22%", background: p.panel, padding: 8, borderRight: `1px solid ${p.dim}22` }}>
        <div style={{ fontSize: 8, color: p.dim, marginBottom: 8, letterSpacing: 1 }}>CHATS</div>
        {["Refactor component", "Debug API call", "Write unit tests", "Plan architecture", "Code review"].map((t, i) => (
          <div key={i} style={{ padding: "5px 6px", borderRadius: 3, background: i === 0 ? p.accent + "22" : "transparent", marginBottom: 2, fontSize: 9, color: i === 0 ? p.ink : p.dim }}>{t}</div>
        ))}
      </div>
      <div style={{ flex: 1, padding: 12, display: "flex", flexDirection: "column", gap: 8, overflow: "hidden" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "78%", background: m.role === "user" ? p.accent + "33" : p.panel, padding: "6px 10px", borderRadius: 8, fontSize: 9, lineHeight: 1.4 }}>{m.text}</div>
        ))}
        <div style={{ marginTop: "auto", background: p.panel, padding: 6, borderRadius: 6, color: p.dim, fontSize: 9 }}>Ask anything…</div>
      </div>
    </div>
  );
}

function MockCanvas({ palette = "B" }: { palette?: GardenPalette }) {
  const p = PALETTES[palette];
  return (
    <div style={{ width: "100%", height: "100%", background: p.bg, color: p.ink, fontFamily: "Georgia, serif", display: "flex", overflow: "hidden" }}>
      <div style={{ width: "18%", borderRight: `1px solid ${p.dim}33`, padding: 8, background: p.panel }}>
        <div style={{ fontSize: 7, color: p.dim, letterSpacing: 1, marginBottom: 6 }}>LAYERS</div>
        {["Frame", "Header", "Card Grid", "Button", "Footer"].map((t, i) => (
          <div key={i} style={{ fontSize: 8, padding: "3px 0", color: i === 2 ? p.accent : p.ink, fontWeight: i === 2 ? 600 : 400 }}>{t}</div>
        ))}
      </div>
      <div style={{ flex: 1, background: p.bg, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <div style={{ width: "70%", background: p.panel, borderRadius: 6, padding: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }}>
          <div style={{ height: 10, background: p.accent + "33", borderRadius: 2, marginBottom: 8, width: "60%" }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{ height: 40, background: p.bg, borderRadius: 4, border: `1px solid ${p.dim}22` }} />
            ))}
          </div>
        </div>
      </div>
      <div style={{ width: "20%", borderLeft: `1px solid ${p.dim}33`, padding: 8, background: p.panel }}>
        <div style={{ fontSize: 7, color: p.dim, letterSpacing: 1, marginBottom: 6 }}>PROPERTIES</div>
        {["Width: 340px", "Height: auto", "Radius: 8px", "Gap: 16px", "Padding: 24px"].map((t, i) => (
          <div key={i} style={{ fontSize: 8, padding: "3px 0", color: p.dim, borderBottom: `1px solid ${p.dim}11` }}>{t}</div>
        ))}
      </div>
    </div>
  );
}

function MockAgent({ palette = "C" }: { palette?: GardenPalette }) {
  const p = PALETTES[palette];
  return (
    <div style={{ width: "100%", height: "100%", background: p.bg, color: p.ink, fontFamily: "ui-monospace, Menlo, monospace", fontSize: 8, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ padding: "6px 10px", borderBottom: `1px solid ${p.dim}22`, color: p.dim, display: "flex", gap: 8 }}>
        <span>▸ agent</span><span>·</span><span>main.ts</span><span style={{ marginLeft: "auto", color: p.accent }}>● running</span>
      </div>
      <div style={{ flex: 1, display: "flex" }}>
        <div style={{ width: "30%", background: p.panel, padding: 8, borderRight: `1px solid ${p.dim}22` }}>
          <div style={{ color: p.dim, marginBottom: 4, fontSize: 7, letterSpacing: 1 }}>FILES</div>
          {["src/app.ts", "src/utils.ts", "tests/app.test.ts", "package.json"].map((f, i) => (
            <div key={i} style={{ padding: "3px 0", color: i === 0 ? p.accent : p.dim, fontSize: 8 }}>{f}</div>
          ))}
        </div>
        <div style={{ flex: 1, padding: 10 }}>
          {["import { Router } from 'express';", "import { db } from './database';", "", "const router = new Router();", "", "router.get('/users', async (req, res) => {", "  const users = await db.query(", "    'SELECT * FROM users'", "  );", "  res.json(users);", "});"].map((l, i) => (
            <div key={i} style={{ color: l.startsWith("import") || l.startsWith("const") ? p.accent : p.ink, marginBottom: 2, opacity: l === "" ? 0 : 1 }}>{l || " "}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MockGen({ palette = "D" }: { palette?: GardenPalette }) {
  const p = PALETTES[palette];
  return (
    <div style={{ width: "100%", height: "100%", background: p.bg, color: p.ink, fontFamily: "system-ui, sans-serif", fontSize: 9, display: "flex", overflow: "hidden" }}>
      <div style={{ flex: 1, padding: 12, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "6px 10px", background: p.panel, borderRadius: 4, marginBottom: 12, fontSize: 9, color: p.dim, border: `1px solid ${p.dim}22` }}>
          Build a landing page with hero, features, and CTA…
        </div>
        <div style={{ flex: 1, background: p.panel, borderRadius: 6, overflow: "hidden", border: `1px solid ${p.dim}22` }}>
          <div style={{ padding: 10, borderBottom: `1px solid ${p.dim}22`, display: "flex", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5f57" }} />
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#febc2e" }} />
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#28c840" }} />
          </div>
          <div style={{ padding: 12 }}>
            <div style={{ height: 12, background: p.accent + "33", borderRadius: 2, marginBottom: 8, width: "50%" }} />
            <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ flex: 1, height: 24, background: `${p.accent}${i === 0 ? "88" : "22"}`, borderRadius: 3 }} />
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4 }}>
              {[0, 1, 2, 3, 4, 5].map(i => (
                <div key={i} style={{ height: 16, background: p.dim + "22", borderRadius: 2 }} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div style={{ width: "45%", background: p.panel, borderLeft: `1px solid ${p.dim}22`, padding: 10, fontSize: 8, fontFamily: "ui-monospace, monospace" }}>
        <div style={{ color: p.dim, marginBottom: 6, fontSize: 7, letterSpacing: 1 }}>GENERATED CODE</div>
        {["export function Hero() {", "  return (", "    <section>", "      <h1>Build faster</h1>", "      <p>with AI</p>", "    </section>", "  );", "}"].map((l, i) => (
          <div key={i} style={{ color: l.includes("export") || l.includes("return") ? p.accent : p.ink, marginBottom: 1 }}>{l}</div>
        ))}
      </div>
    </div>
  );
}

function MockDashboard({ palette = "E" }: { palette?: GardenPalette }) {
  const p = PALETTES[palette];
  return (
    <div style={{ width: "100%", height: "100%", background: p.bg, color: p.ink, fontFamily: "system-ui, sans-serif", fontSize: 9, padding: 10, display: "flex", flexDirection: "column", gap: 8, overflow: "hidden" }}>
      <div style={{ display: "flex", gap: 6 }}>
        {["Queries", "Avg latency", "Cost / day", "Cache hit"].map((t, i) => (
          <div key={i} style={{ flex: 1, background: p.panel, borderRadius: 4, padding: 8 }}>
            <div style={{ fontSize: 7, color: p.dim, letterSpacing: 1 }}>{t.toUpperCase()}</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2, color: i === 1 ? p.accent : p.ink }}>{["1.2M", "184ms", "$47", "76%"][i]}</div>
          </div>
        ))}
      </div>
      <div style={{ flex: 1, background: p.panel, borderRadius: 4, padding: 10, position: "relative" }}>
        <div style={{ fontSize: 8, color: p.dim, marginBottom: 6 }}>Request volume — last 24h</div>
        <svg viewBox="0 0 200 60" style={{ width: "100%", height: "70%" }}>
          <path d="M0,45 Q20,30 40,35 T80,20 T120,25 T160,15 T200,22" fill="none" stroke={p.accent} strokeWidth="1.5" />
          <path d="M0,45 Q20,30 40,35 T80,20 T120,25 T160,15 T200,22 L200,60 L0,60 Z" fill={p.accent} opacity="0.15" />
        </svg>
      </div>
    </div>
  );
}

function MockSearch({ palette = "F" }: { palette?: GardenPalette }) {
  const p = PALETTES[palette];
  return (
    <div style={{ width: "100%", height: "100%", background: p.bg, color: p.ink, fontFamily: "system-ui, sans-serif", fontSize: 9, overflow: "hidden" }}>
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${p.dim}22` }}>
        <div style={{ background: p.panel, borderRadius: 20, padding: "6px 12px", fontSize: 9, color: p.ink, border: `1px solid ${p.dim}22` }}>create a dashboard with charts…</div>
      </div>
      <div style={{ padding: 14, display: "flex", gap: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 600, marginBottom: 6 }}>Generated</div>
          <div style={{ fontSize: 9, lineHeight: 1.55, color: p.ink }}>
            Here&apos;s a dashboard layout with bar charts, line graphs, and summary cards using shadcn/ui components.
            <span style={{ color: p.accent, fontSize: 7, verticalAlign: "super" }}> [preview]</span>
          </div>
          <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{ height: 24, background: p.panel, borderRadius: 3, border: `1px solid ${p.dim}22` }} />
            ))}
          </div>
        </div>
        <div style={{ width: "30%", borderLeft: `1px solid ${p.dim}22`, paddingLeft: 12 }}>
          <div style={{ fontSize: 8, color: p.dim, letterSpacing: 1, marginBottom: 6 }}>COMPONENTS</div>
          {["BarChart", "LineGraph", "StatCard", "DataTable"].map((t, i) => (
            <div key={i} style={{ fontSize: 8, padding: "3px 0" }}>· {t}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

const MOCKS: Record<GardenKind, React.ComponentType<{ palette?: GardenPalette }>> = {
  chat: MockChat,
  canvas: MockCanvas,
  agent: MockAgent,
  gen: MockGen,
  dash: MockDashboard,
  search: MockSearch,
};

export function Mock({ kind, palette }: { kind: GardenKind; palette: GardenPalette }) {
  const C = MOCKS[kind] ?? MockAgent;
  return <C palette={palette} />;
}
