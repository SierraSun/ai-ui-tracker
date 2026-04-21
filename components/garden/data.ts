import { tools } from "@/data/tools";
import type { ChangeEntry } from "@/data/tools";

export type GardenKind = "chat" | "canvas" | "agent" | "gen" | "dash" | "search";
export type GardenPalette = "A" | "B" | "C" | "D" | "E" | "F";

export type GardenProduct = {
  id: string;
  name: string;
  kind: GardenKind;
  palette: GardenPalette;
  tag: string;
  company: string;
};

export type GardenEntry = {
  id: string;
  product: string;
  date: Date;
  version: string;
  title: string;
  note: string;
  details: string[];
  kind: GardenKind;
  palette: GardenPalette;
  // previewImage: static image URL (images[0] / screenshot / Mux thumbnail / YouTube thumbnail)
  previewImage?: string;
  // [Claude Code 2026-04-20] videoThumbUrl: mp4 URL to extract first frame from when no static poster exists
  // Used by VideoCardThumb component to lazy-load the real video frame as the card thumbnail.
  videoThumbUrl?: string;
  hasVideo: boolean; // has real video assets
};

const KIND_MAP: Record<string, GardenKind> = {
  cursor: "agent",
  trae: "agent",
  antigravity: "agent",
  pencil: "canvas",
  "v0": "gen",
  "figma-ai": "canvas",
  canva: "gen",
};

const PALETTE_MAP: Record<string, GardenPalette> = {
  cursor: "A",
  trae: "C",
  antigravity: "D",
  pencil: "B",
  "v0": "F",
  "figma-ai": "E",
  canva: "E",
};

const TAG_MAP: Record<string, string> = {
  cursor: "coding agent",
  trae: "coding agent",
  antigravity: "coding agent",
  pencil: "design canvas",
  "v0": "ui generator",
  "figma-ai": "design ai",
  canva: "design platform",
};

// [Claude Code + Cursor 2026-04-20] Card thumbnail priority:
//   1. images[0]         — explicit screenshot from changelog
//   2. screenshot        — legacy single-image field
//   3. Mux thumbnail     — auto-generated from playbackId (image.mux.com)
//   4. mp4 poster        — provided alongside mp4 URL
//   5. YouTube thumbnail — hqdefault from ytimg
// Ensures garden card thumbnail always matches the media shown in the detail modal.
function getPreviewImage(change: ChangeEntry): string | undefined {
  if (change.images?.[0]) return change.images[0];
  if (change.screenshot) return change.screenshot;

  const firstVideo = change.videos?.[0];
  if (!firstVideo) return undefined;

  if (firstVideo.type === "mux") {
    return `https://image.mux.com/${firstVideo.playbackId}/thumbnail.png?width=1280&height=720&fit_mode=preserve`;
  }
  if (firstVideo.type === "mp4") {
    return firstVideo.poster;
  }
  if (firstVideo.type === "youtube") {
    return `https://i.ytimg.com/vi/${firstVideo.videoId}/hqdefault.jpg`;
  }
  return undefined;
}

export const GARDEN_PRODUCTS: GardenProduct[] = tools.map((t) => ({
  id: t.id,
  name: t.name,
  kind: KIND_MAP[t.id] ?? "agent",
  palette: PALETTE_MAP[t.id] ?? "A",
  tag: TAG_MAP[t.id] ?? t.tagline,
  company: t.company,
}));

export const GARDEN_HISTORY: GardenEntry[] = tools
  .flatMap((t) =>
    t.changes.map((c, i) => ({
      id: `${t.id}-${i}`,
      product: t.id,
      date: new Date(c.date),
      version: c.version ? `${c.version} — ${c.title}` : c.title,
      title: c.title,
      note: c.summary,
      details: c.details,
      kind: KIND_MAP[t.id] ?? "agent",
      palette: PALETTE_MAP[t.id] ?? "A",
      // Keep card preview aligned with actual media in the detail modal.
      previewImage: getPreviewImage(c),
      // For mp4 without poster: pass the URL so VideoCardThumb can extract a real frame
      videoThumbUrl: (!getPreviewImage(c) && c.videos?.[0]?.type === "mp4")
        ? c.videos[0].url
        : undefined,
      hasVideo: !!(c.videos && c.videos.length > 0),
    }))
  )
  .sort((a, b) => a.date.getTime() - b.date.getTime());

export function fmtDate(d: Date, style: "short" | "iso" | "long" = "short"): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const m = months[d.getMonth()];
  if (style === "short") return `${m} ${d.getFullYear()}`;
  if (style === "iso") return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  return `${String(d.getDate()).padStart(2, "0")} ${m} ${d.getFullYear()}`;
}
