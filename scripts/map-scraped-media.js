#!/usr/bin/env node

const { readFileSync, writeFileSync } = require("fs");

function parseToolDateIndex(toolsTsContent) {
  const lines = toolsTsContent.split(/\r?\n/);
  const index = new Map();
  let currentToolId = null;

  for (const line of lines) {
    const idMatch = line.match(/^\s*id:\s*"([^"]+)"/);
    if (idMatch) {
      currentToolId = idMatch[1];
      if (!index.has(currentToolId)) index.set(currentToolId, new Set());
      continue;
    }
    const dateMatch = line.match(/^\s*date:\s*"(\d{4}-\d{2}-\d{2})"/);
    if (dateMatch && currentToolId) {
      index.get(currentToolId).add(dateMatch[1]);
    }
  }
  return index;
}

function toolNameToId(name) {
  const map = {
    Cursor: "cursor",
    Trae: "trae",
    Antigravity: "antigravity",
    Pencil: "pencil",
    v0: "v0",
    "Figma AI": "figma-ai",
  };
  return map[name] || null;
}

function buildVideos(entry) {
  const videos = [];
  for (const id of entry.muxIds || []) videos.push({ type: "mux", playbackId: id });
  for (const url of entry.mp4Urls || []) videos.push({ type: "mp4", url });
  for (const id of entry.youtubeIds || []) videos.push({ type: "youtube", videoId: id });
  return videos;
}

function main() {
  const scraped = JSON.parse(readFileSync("scraped-media.json", "utf8"));
  const toolsTs = readFileSync("data/tools.ts", "utf8");
  const toolDates = parseToolDateIndex(toolsTs);

  const mapped = [];
  const unmatched = [];

  for (const entry of scraped) {
    const toolId = toolNameToId(entry.tool);
    if (!toolId || !entry.date || entry.date === "all" || entry.date === "unknown") {
      unmatched.push({ reason: "missing_tool_or_date", entry });
      continue;
    }
    if (!toolDates.get(toolId)?.has(entry.date)) {
      unmatched.push({ reason: "date_not_in_tools_ts", entry });
      continue;
    }

    mapped.push({
      toolId,
      date: entry.date,
      patch: {
        images: (entry.images || []).slice(0, 3),
        videos: buildVideos(entry),
      },
    });
  }

  const output = { mapped, unmatchedCount: unmatched.length, unmatched };
  writeFileSync("scraped-media-mapped.json", JSON.stringify(output, null, 2));
  console.log(`Mapped entries: ${mapped.length}`);
  console.log(`Unmatched entries: ${unmatched.length}`);
  console.log("Written: scraped-media-mapped.json");
}

main();
