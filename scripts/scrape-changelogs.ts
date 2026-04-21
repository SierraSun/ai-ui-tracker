/**
 * scrape-changelogs.ts
 *
 * Fetches changelog pages from Cursor, v0, Trae, Figma AI, Pencil
 * and extracts image URLs and video assets (Mux, mp4, YouTube).
 *
 * Run:
 *   npx tsx scripts/scrape-changelogs.ts
 *   npx tsx scripts/scrape-changelogs.ts --tool cursor
 *   npx tsx scripts/scrape-changelogs.ts --year 2026
 *
 * Output: scraped-media.json (paste into tools.ts manually or pipe to update script)
 */

const TOOLS = {
  cursor: {
    name: "Cursor",
    url: "https://cursor.com/changelog",
    imageCdnPattern: /ptht05hbb1ssoooe\.public\.blob\.vercel-storage\.com\/assets\/changelog\/[^\s"')]+/g,
    muxPattern: /playbackId['":\s]+([A-Za-z0-9]{40,60})/g,
    mp4Pattern: /["'](https?:\/\/[^\s"']+\.mp4)['"]/g,
    datePattern: /\b(202[4-9]|2030)[-/](0[1-9]|1[0-2])[-/](0[1-9]|[12]\d|3[01])\b/g,
  },
  v0: {
    name: "v0",
    url: "https://v0.dev/changelog",
    imageCdnPattern: /pdgvvgmkdvyeydso\.public\.blob\.vercel-storage\.com\/changelog\/[^\s"')]+/g,
    muxPattern: /playbackId['":\s]+([A-Za-z0-9]{40,60})/g,
    mp4Pattern: /["'](https?:\/\/[^\s"']+\.mp4)['"]/g,
    datePattern: /\b(202[4-9]|2030)[-/](0[1-9]|1[0-2])[-/](0[1-9]|[12]\d|3[01])\b/g,
  },
  trae: {
    name: "Trae",
    url: "https://www.trae.ai/changelog",
    imageCdnPattern: /https?:\/\/[^\s"']+\.(png|jpg|webp|gif)/g,
    muxPattern: /playbackId['":\s]+([A-Za-z0-9]{40,60})/g,
    mp4Pattern: /["'](https?:\/\/[^\s"']+\.mp4)['"]/g,
    datePattern: /\b(202[4-9]|2030)[-/](0[1-9]|1[0-2])[-/](0[1-9]|[12]\d|3[01])\b/g,
  },
  figma: {
    name: "Figma AI",
    url: "https://www.figma.com/whats-new/",
    imageCdnPattern: /https?:\/\/[^\s"']+\.(png|jpg|webp)/g,
    muxPattern: /playbackId['":\s]+([A-Za-z0-9]{40,60})/g,
    mp4Pattern: /["'](https?:\/\/[^\s"']+\.mp4)['"]/g,
    datePattern: /\b(202[4-9]|2030)[-/](0[1-9]|1[0-2])[-/](0[1-9]|[12]\d|3[01])\b/g,
  },
  pencil: {
    name: "Pencil",
    url: "https://docs.pencil.dev/changelog",
    imageCdnPattern: /https?:\/\/[^\s"']+\.(png|jpg|webp|gif)/g,
    muxPattern: /playbackId['":\s]+([A-Za-z0-9]{40,60})/g,
    mp4Pattern: /["'](https?:\/\/[^\s"']+\.mp4)['"]/g,
    datePattern: /\b(202[4-9]|2030)[-/](0[1-9]|1[0-2])[-/](0[1-9]|[12]\d|3[01])\b/g,
  },
};

type ScrapedEntry = {
  tool: string;
  date?: string;
  images: string[];
  muxIds: string[];
  mp4Urls: string[];
  youtubeIds: string[];
  rawHtmlSnippet?: string;
};

async function fetchPage(url: string): Promise<string> {
  console.log(`  Fetching ${url}...`);
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      Accept: "text/html,application/xhtml+xml",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

function extractMatches(html: string, pattern: RegExp): string[] {
  const results = new Set<string>();
  const regex = new RegExp(pattern.source, pattern.flags);
  let m: RegExpExecArray | null;
  while ((m = regex.exec(html)) !== null) {
    results.add(m[1] ?? m[0]);
  }
  return Array.from(results);
}

function extractYouTubeIds(html: string): string[] {
  const ids = new Set<string>();
  const patterns = [
    /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/g,
    /youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})/g,
    /youtu\.be\/([A-Za-z0-9_-]{11})/g,
  ];
  for (const p of patterns) {
    let m: RegExpExecArray | null;
    while ((m = new RegExp(p.source, p.flags).exec(html)) !== null) {
      ids.add(m[1]);
    }
  }
  return Array.from(ids);
}

// Heuristic: split HTML near date markers and extract media per section
function chunkByDate(html: string, datePattern: RegExp): Array<{ date: string; chunk: string }> {
  const chunks: Array<{ date: string; chunk: string }> = [];
  const regex = new RegExp(datePattern.source, "g");
  let lastIdx = 0;
  let lastDate = "";
  let m: RegExpExecArray | null;
  while ((m = regex.exec(html)) !== null) {
    if (lastDate) {
      chunks.push({ date: lastDate, chunk: html.slice(lastIdx, m.index) });
    }
    lastDate = m[0].replace(/\//g, "-");
    lastIdx = m.index;
  }
  if (lastDate) {
    chunks.push({ date: lastDate, chunk: html.slice(lastIdx) });
  }
  return chunks;
}

async function scrapeTool(
  toolId: string,
  filterYear?: number
): Promise<ScrapedEntry[]> {
  const cfg = TOOLS[toolId as keyof typeof TOOLS];
  if (!cfg) throw new Error(`Unknown tool: ${toolId}`);

  const html = await fetchPage(cfg.url);
  const chunks = chunkByDate(html, cfg.datePattern);

  console.log(`  Found ${chunks.length} date sections`);

  const results: ScrapedEntry[] = [];

  for (const { date, chunk } of chunks) {
    if (filterYear && !date.startsWith(String(filterYear))) continue;

    const images = extractMatches(chunk, cfg.imageCdnPattern).filter(
      (u) =>
        !u.includes("favicon") &&
        !u.includes("logo") &&
        !u.includes("avatar") &&
        !u.includes("icon")
    );
    const muxIds = extractMatches(chunk, cfg.muxPattern);
    const mp4Urls = extractMatches(chunk, cfg.mp4Pattern);
    const youtubeIds = extractYouTubeIds(chunk);

    if (images.length || muxIds.length || mp4Urls.length || youtubeIds.length) {
      results.push({
        tool: cfg.name,
        date,
        images,
        muxIds,
        mp4Urls,
        youtubeIds,
      });
    }
  }

  // Fallback: if no chunks found with dates, return global extraction
  if (results.length === 0) {
    const images = extractMatches(html, cfg.imageCdnPattern).filter(
      (u) => !u.includes("favicon") && !u.includes("logo")
    );
    const muxIds = extractMatches(html, cfg.muxPattern);
    const mp4Urls = extractMatches(html, cfg.mp4Pattern);
    const youtubeIds = extractYouTubeIds(html);

    if (images.length || muxIds.length || mp4Urls.length || youtubeIds.length) {
      results.push({
        tool: cfg.name,
        date: "unknown",
        images,
        muxIds,
        mp4Urls,
        youtubeIds,
      });
    }
  }

  return results;
}

async function main() {
  const args = process.argv.slice(2);
  const toolArg = args.find((a) => a.startsWith("--tool="))?.split("=")[1];
  const yearArg = args.find((a) => a.startsWith("--year="))?.split("=")[1];
  const filterYear = yearArg ? parseInt(yearArg) : undefined;

  const toolIds = toolArg ? [toolArg] : Object.keys(TOOLS);

  console.log("=== AI UI Tracker — Changelog Scraper ===");
  console.log(`Tools: ${toolIds.join(", ")}`);
  if (filterYear) console.log(`Year filter: ${filterYear}`);
  console.log("");

  const allResults: ScrapedEntry[] = [];

  for (const toolId of toolIds) {
    console.log(`\n[${toolId.toUpperCase()}]`);
    try {
      const results = await scrapeTool(toolId, filterYear);
      allResults.push(...results);
      for (const r of results) {
        console.log(`  ${r.date}:`);
        if (r.images.length) console.log(`    images: ${r.images.join(", ")}`);
        if (r.muxIds.length) console.log(`    mux: ${r.muxIds.join(", ")}`);
        if (r.mp4Urls.length) console.log(`    mp4: ${r.mp4Urls.join(", ")}`);
        if (r.youtubeIds.length) console.log(`    youtube: ${r.youtubeIds.join(", ")}`);
      }
      if (results.length === 0) console.log("  No media found.");
    } catch (e) {
      console.error(`  ERROR: ${(e as Error).message}`);
    }
  }

  // Write output
  const outFile = "scraped-media.json";
  const { writeFileSync } = await import("fs");
  writeFileSync(outFile, JSON.stringify(allResults, null, 2));
  console.log(`\n✓ Written to ${outFile}`);
  console.log("\n=== How to use ===");
  console.log(
    "1. Check scraped-media.json for extracted URLs"
  );
  console.log(
    "2. Match each entry to the corresponding change in data/tools.ts"
  );
  console.log(
    "3. Add images/videos fields to the matching ChangeEntry"
  );
  console.log(
    "\nFor automated updates, add this to a cron job or GitHub Actions:"
  );
  console.log("  npx tsx scripts/scrape-changelogs.ts --year=$(date +%Y)");
}

main().catch(console.error);
