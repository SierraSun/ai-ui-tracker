#!/usr/bin/env node
/**
 * scrape-x-tweets.js
 * [Claude Code 2026-04-20] X (Twitter) changelog scraper via yt-dlp
 *
 * Usage:
 *   # Scrape known tweet URLs listed in X_SOURCES config below
 *   node scripts/scrape-x-tweets.js
 *
 *   # Scrape a single tweet URL
 *   node scripts/scrape-x-tweets.js --url=https://x.com/Trae_ai/status/xxx
 *
 *   # Scrape all video tweets from an account (slow, scans timeline)
 *   node scripts/scrape-x-tweets.js --account=Trae_ai --tool=trae
 *
 * Output:
 *   Prints ready-to-paste tools.ts change entries (JSON) to stdout.
 *   Also writes scraped-x-tweets.json for inspection.
 *
 * Requirements:
 *   brew install yt-dlp    (or pip install yt-dlp)
 *
 * How it works:
 *   yt-dlp extracts from X without auth: video URL (≤1280p mp4),
 *   thumbnail (pbs.twimg.com), upload date, and tweet description.
 */

import { execSync, spawnSync } from "child_process";
import { writeFileSync } from "fs";
import { parseArgs } from "util";

// ─── Product → account mapping ───────────────────────────────────────────────
// [Agent: to add a new product, add its X handle(s) here]
const X_SOURCES = {
  trae: {
    // [Claude Code 2026-04-21] @Trae_ai is the official account
    accounts: ["Trae_ai"],
    // Known high-value tweet URLs to always include (add more as you find them)
    knownTweets: [
      "https://x.com/Trae_ai/status/2038813538064494938", // SOLO launch 2026-03-31
    ],
  },
  pencil: {
    // [Claude Code 2026-04-21] @tomkrcha (founder/CVO) posts all major releases
    accounts: ["pencildev", "tomkrcha"],
    knownTweets: [
      "https://x.com/tomkrcha/status/2044433115985457392", // Code on Canvas 2026-04-15
      "https://x.com/tomkrcha/status/2026329359838318906", // SWARM mode 2026-02-24
      "https://x.com/tomkrcha/status/2014028990810300498", // Infinite Design Canvas 2026-01-21
      "https://x.com/tomkrcha/status/1919763769070071867", // Design Mode for Cursor 2025-05-06
    ],
  },
  antigravity: {
    // [Claude Code 2026-04-21] Google Antigravity — official: @antigravity, tutorials: @googleaidevs
    // Note: @antigravity_ai seems inactive; actual account is @antigravity
    accounts: ["antigravity", "googleaidevs"],
    knownTweets: [
      "https://x.com/googleaidevs/status/1992001690216931552", // Launch intro 2025-11-21
    ],
  },
  "v0": {
    // [Claude Code 2026-04-21] @v0 official + @rauchg (Vercel CEO) + @shadcn (creator at Vercel)
    accounts: ["v0", "rauchg", "shadcn"],
    knownTweets: [
      "https://x.com/v0/status/1932892095565660490", // Design Mode 2025-06-11
      "https://x.com/v0/status/1925978235164119070", // v0-1.5 models 2025-05-23
    ],
  },
  "figma-ai": {
    // [Claude Code 2026-04-21] @figma official + @zoink (Dylan Field, CEO) + @yuhkiyam (CPO)
    accounts: ["figma", "zoink", "yuhkiyam"],
    knownTweets: [
      "https://x.com/figma/status/2036434766661296602", // use_figma MCP open beta 2026-03-24
      "https://x.com/figma/status/1915098380331839541", // gpt-image-1 Edit Image 2025-04-23
    ],
  },
  canva: {
    // [Claude Code 2026-04-20] @canva official + @melaniecanva (co-founder/CEO) + @cliffordobrecht (co-founder/COO)
    accounts: ["canva", "melaniecanva", "cliffordobrecht"],
    knownTweets: [
      "https://x.com/canva/status/1983961128914055459", // Creative OS launch 2025-10-30
      "https://x.com/canva/status/1910694459831971844", // Visual Suite 2.0 2025-04-10
    ],
  },
};

// Keywords that signal a product update tweet (any match = include)
const RELEASE_KEYWORDS = [
  "introducing", "launching", "new", "release", "update",
  "now available", "ship", "feature", "announce", "beta",
  "v0\\.\\d", "v\\d+\\.\\d", "just dropped",
];
const RELEASE_RE = new RegExp(RELEASE_KEYWORDS.join("|"), "i");

// ─── Args ─────────────────────────────────────────────────────────────────────
const { values: args } = parseArgs({
  options: {
    url:     { type: "string" },
    account: { type: "string" },
    tool:    { type: "string" },
    all:     { type: "boolean", default: false },
    limit:   { type: "string", default: "50" }, // max tweets to scan per account
  },
  allowPositionals: true,
});

// ─── Core: extract one tweet via yt-dlp ──────────────────────────────────────
function extractTweet(url) {
  const result = spawnSync(
    "yt-dlp",
    ["--dump-json", "--no-download", "--no-warnings", url],
    { encoding: "utf8", timeout: 30_000 }
  );

  if (result.status !== 0 || !result.stdout.trim()) {
    console.error(`  ✗ Failed to extract: ${url}`);
    console.error(result.stderr?.slice(0, 200) || "no output");
    return null;
  }

  let data;
  try {
    data = JSON.parse(result.stdout.trim());
  } catch {
    console.error(`  ✗ JSON parse failed for: ${url}`);
    return null;
  }

  // Pick best mp4 ≤ 1280px wide (720p is a good balance)
  let bestMp4 = null;
  for (const f of data.formats || []) {
    if (
      f.ext === "mp4" &&
      f.width &&
      f.url?.includes("twimg") &&
      f.width <= 1280
    ) {
      if (!bestMp4 || f.width > bestMp4.width) bestMp4 = f;
    }
  }

  // Parse date: upload_date is "YYYYMMDD"
  const raw = data.upload_date || "";
  const date = raw
    ? `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`
    : null;

  return {
    tweetUrl: data.webpage_url || url,
    tweetId:  data.id || data.display_id || "",
    uploader: data.uploader_id || "",
    date,
    description: (data.description || "").replace(/https?:\/\/\S+/g, "").trim(),
    thumbnail: data.thumbnail || null, // pbs.twimg.com/... (can use as poster)
    videoMp4: bestMp4?.url || null,    // direct 720p mp4 URL
    width:    bestMp4?.width || null,
    height:   bestMp4?.height || null,
    // Raw formats for debugging
    _hasVideo: !!bestMp4,
  };
}

// ─── Scan account timeline ────────────────────────────────────────────────────
function scanAccount(handle, limit = 50) {
  console.error(`  Scanning @${handle} timeline (up to ${limit} tweets)…`);
  const result = spawnSync(
    "yt-dlp",
    [
      "--dump-json",
      "--flat-playlist",
      "--no-warnings",
      `--playlist-end`, String(limit),
      `https://x.com/${handle}`,
    ],
    { encoding: "utf8", timeout: 120_000 }
  );

  if (result.status !== 0) {
    console.error(`  ✗ Account scan failed for @${handle}: ${result.stderr?.slice(0, 200)}`);
    return [];
  }

  const urls = [];
  for (const line of (result.stdout || "").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const item = JSON.parse(trimmed);
      // flat-playlist gives {url, title, ...}
      const tweetUrl = item.url || item.webpage_url;
      if (tweetUrl && tweetUrl.includes("/status/")) {
        urls.push(tweetUrl);
      }
    } catch { /* skip */ }
  }

  console.error(`  Found ${urls.length} tweet URLs from @${handle}`);
  return urls;
}

// ─── Format output for tools.ts ──────────────────────────────────────────────
function formatEntry(tweet, toolId) {
  const descShort = tweet.description.slice(0, 100).replace(/\n/g, " ").trim();
  const lines = [
    `      {`,
    `        // Source: ${tweet.tweetUrl}`,
    `        // [Claude Code 2026-04-20] scraped via scrape-x-tweets.js`,
    `        date: "${tweet.date || "TODO"}",`,
    `        title: "TODO: ${descShort.slice(0, 60)}",`,
    `        summary: "${descShort}",`,
    `        tags: ["TODO"],`,
    `        details: [`,
    `          // TODO: fill from tweet text`,
    `          "${tweet.description.split("\n")[0]?.slice(0, 80).replace(/"/g, '\\"')}",`,
    `        ],`,
  ];

  if (tweet.videoMp4) {
    // [Claude Code 2026-04-20] Wrap twimg URLs in proxy to bypass 403 (Referer restriction)
    const proxiedUrl = tweet.videoMp4.startsWith("https://video.twimg.com/")
      ? `/api/video-proxy?url=${tweet.videoMp4}`
      : tweet.videoMp4;
    lines.push(
      `        images: [`,
      `          "${tweet.thumbnail}",  // tweet thumbnail (auto-generated)`,
      `        ],`,
      `        videos: [`,
      `          {`,
      `            type: "mp4",`,
      `            // [Claude Code 2026-04-20] twimg 视频需通过 /api/video-proxy 转发（直接访问 403）`,
      `            url: "${proxiedUrl}",`,
      `            poster: "${tweet.thumbnail}",`,
      `          },`,
      `        ],`,
    );
  } else if (tweet.thumbnail) {
    lines.push(
      `        images: [`,
      `          "${tweet.thumbnail}",`,
      `        ],`,
    );
  }

  lines.push(`      },`);
  return lines.join("\n");
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const results = [];

  if (args.url) {
    // Single tweet mode
    console.error(`Extracting single tweet: ${args.url}`);
    const tweet = extractTweet(args.url);
    if (tweet) results.push({ toolId: args.tool || "unknown", tweet });

  } else if (args.account) {
    // Single account scan mode
    const tool = args.tool || "unknown";
    const urls = scanAccount(args.account, Number(args.limit));
    for (const url of urls) {
      const tweet = extractTweet(url);
      if (!tweet) continue;
      if (!RELEASE_RE.test(tweet.description)) continue;
      if (!tweet._hasVideo) continue; // only video tweets
      results.push({ toolId: tool, tweet });
      process.stderr.write(`  ✓ ${tweet.date} ${tweet.description.slice(0, 60)}\n`);
    }

  } else {
    // Default: process all known tweet URLs + optionally scan accounts
    for (const [toolId, config] of Object.entries(X_SOURCES)) {
      console.error(`\n── ${toolId} ──`);

      // Known tweet URLs first (always processed)
      for (const url of config.knownTweets) {
        console.error(`  Extracting known tweet: ${url}`);
        const tweet = extractTweet(url);
        if (tweet) {
          results.push({ toolId, tweet });
          console.error(`  ✓ ${tweet.date} ${tweet.description.slice(0, 60)}`);
        }
      }

      // If --all flag, also scan account timelines
      if (args.all) {
        for (const handle of config.accounts) {
          const urls = scanAccount(handle, Number(args.limit));
          for (const url of urls) {
            if (config.knownTweets.includes(url)) continue; // already got it
            const tweet = extractTweet(url);
            if (!tweet) continue;
            if (!RELEASE_RE.test(tweet.description)) continue;
            if (!tweet._hasVideo) continue;
            results.push({ toolId, tweet });
            console.error(`  ✓ ${tweet.date} ${tweet.description.slice(0, 60)}`);
          }
        }
      }
    }
  }

  // ── Output ──
  if (results.length === 0) {
    console.error("\nNo results found.");
    return;
  }

  // Write raw JSON for inspection
  writeFileSync("scraped-x-tweets.json", JSON.stringify(results, null, 2));
  console.error(`\nWrote scraped-x-tweets.json (${results.length} tweets)`);

  // Print formatted tools.ts snippets grouped by tool
  console.log("\n\n// ===== PASTE INTO data/tools.ts =====\n");
  const byTool = {};
  for (const { toolId, tweet } of results) {
    if (!byTool[toolId]) byTool[toolId] = [];
    byTool[toolId].push(tweet);
  }

  for (const [toolId, tweets] of Object.entries(byTool)) {
    // Sort newest first (matches tools.ts convention)
    tweets.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    console.log(`// ── ${toolId} ──`);
    for (const tweet of tweets) {
      console.log(formatEntry(tweet, toolId));
    }
    console.log();
  }
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
