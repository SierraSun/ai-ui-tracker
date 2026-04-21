#!/usr/bin/env node
/**
 * scrape-changelogs.js — AI UI Tracker media scraper (enhanced)
 *
 * Usage:
 *   node scripts/scrape-changelogs.js
 *   node scripts/scrape-changelogs.js --tool=cursor
 *   node scripts/scrape-changelogs.js --year=2026
 *   node scripts/scrape-changelogs.js --tool=cursor --year=2026
 */

const { writeFileSync } = require("fs");

const TOOLS = {
  cursor: {
    name: "Cursor",
    urls: ["https://cursor.com/changelog"],
    imageCdnBase: "ptht05hbb1ssoooe.public.blob.vercel-storage.com/assets/changelog/",
    followHost: "cursor.com",
  },
  v0: {
    name: "v0",
    urls: ["https://v0.dev/changelog"],
    imageCdnBase: "pdgvvgmkdvyeydso.public.blob.vercel-storage.com/changelog/",
    followHost: "v0.dev",
  },
  trae: {
    name: "Trae",
    urls: ["https://www.trae.ai/changelog", "https://www.trae.ai/blog"],
    imageCdnBase: null,
    followHost: "www.trae.ai",
  },
  figma: {
    name: "Figma AI",
    urls: ["https://www.figma.com/whats-new/"],
    imageCdnBase: null,
    followHost: "www.figma.com",
  },
  antigravity: {
    name: "Antigravity",
    urls: [
      "https://developers.googleblog.com/build-with-google-antigravity-our-new-agentic-development-platform/",
      "https://developers.googleblog.com/",
    ],
    imageCdnBase: null,
    followHost: "developers.googleblog.com",
  },
  pencil: {
    name: "Pencil",
    urls: ["https://trypencil.com/resources/release-notes", "https://www.trypencil.dev/"],
    imageCdnBase: null,
    followHost: "trypencil.com",
    followPathAllow: /^\/(resources\/release-notes|blog\/features)/i,
  },
};

async function fetchPage(url) {
  console.log(`  Fetching ${url} ...`);
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124 Safari/537.36",
      "Accept": "application/json,text/plain,*/*",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function cleanUrl(raw) {
  if (!raw) return null;
  let url = String(raw)
    .replace(/\\u0026/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/[\\"]/g, "")
    .trim();

  // Remove common trailing junk captured from CSS/template strings.
  url = url.replace(/[)\]}'",;]+$/g, "");
  url = url.replace(/\);.*$/g, "");
  url = url.replace(/(?:background-size|background-position|object-fit|className|style)=.*$/i, "");
  url = url.trim();

  if (!/^https?:\/\//i.test(url)) return null;
  return url;
}

function uniqueClean(urls) {
  const out = [];
  const seen = new Set();
  for (const u of urls) {
    const c = cleanUrl(u);
    if (!c || seen.has(c)) continue;
    seen.add(c);
    out.push(c);
  }
  return out;
}

function extractJsonBlocks(html) {
  const blocks = [];

  const ldJsonRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = ldJsonRegex.exec(html)) !== null) {
    blocks.push(m[1]);
  }

  const genericJsonRegex = /<script[^>]*>\s*(\{[\s\S]*?"@context"[\s\S]*?\}|\[[\s\S]*?"@context"[\s\S]*?\])\s*<\/script>/gi;
  while ((m = genericJsonRegex.exec(html)) !== null) {
    blocks.push(m[1]);
  }

  return blocks;
}

function crawlForMediaUrls(value, out) {
  if (!value) return;
  if (Array.isArray(value)) {
    value.forEach((v) => crawlForMediaUrls(v, out));
    return;
  }
  if (typeof value === "object") {
    for (const v of Object.values(value)) {
      crawlForMediaUrls(v, out);
    }
    return;
  }
  if (typeof value !== "string") return;

  const str = value.trim();
  if (/^https?:\/\//i.test(str) && /\.(png|jpg|jpeg|webp|gif|mp4|m3u8|webm|mov)(\?.*)?$/i.test(str)) {
    out.push(str);
  }
  if (/image\.mux\.com\/[A-Za-z0-9]{30,60}/i.test(str)) out.push(str);
  if (/stream\.mux\.com\/[A-Za-z0-9]{30,60}/i.test(str)) out.push(str);
}

function extractMediaFromJson(html) {
  const urls = [];
  const blocks = extractJsonBlocks(html);
  for (const block of blocks) {
    try {
      const parsed = JSON.parse(block);
      crawlForMediaUrls(parsed, urls);
    } catch {
      // Ignore non-strict JSON blocks.
    }
  }
  return uniqueClean(urls);
}

function extractLinksToFollow(html, baseUrl, host, limit = 12) {
  const links = new Set();
  const hrefRegex = /href=["']([^"']+)["']/gi;
  let m;
  while ((m = hrefRegex.exec(html)) !== null) {
    const raw = m[1];
    try {
      const u = new URL(raw, baseUrl);
      if (u.hostname !== host) continue;
      if (/^\/[a-z]{2}-[a-z]{2}\//i.test(u.pathname)) continue;
      const cfg = Object.values(TOOLS).find((t) => t.followHost === host);
      if (cfg?.followPathAllow && !cfg.followPathAllow.test(u.pathname.replace(/^\//, ""))) continue;
      if (!/(changelog|whats-new|release|blog|updates)/i.test(u.pathname)) continue;
      links.add(u.toString());
      if (links.size >= limit) break;
    } catch {
      // Ignore malformed URLs.
    }
  }
  return Array.from(links);
}

function extractMetaContent(html, key) {
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${key}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${key}["']`, "i"),
    new RegExp(`<meta[^>]+name=["']${key}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${key}["']`, "i"),
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m?.[1]) return cleanUrl(m[1]) || m[1];
  }
  return null;
}

async function fetchXProfileMarkdown(handle) {
  const url = `https://r.jina.ai/http://x.com/${handle}`;
  return fetchPage(url);
}

function extractStatusIdsFromProfileMarkdown(markdown) {
  const ids = new Set();
  const re = /x\.com\/[^/\s]+\/status\/(\d{10,20})/g;
  let m;
  while ((m = re.exec(markdown)) !== null) ids.add(m[1]);
  return Array.from(ids);
}

function extractStatusCandidatesFromMarkdown(markdown) {
  const lines = markdown.split(/\r?\n/);
  const candidates = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/x\.com\/[^/\s]+\/status\/(\d{10,20})/);
    if (!m) continue;
    const id = m[1];
    const context = lines.slice(Math.max(0, i - 4), Math.min(lines.length, i + 5)).join(" ");
    candidates.push({ id, context: context.toLowerCase() });
  }
  const seen = new Set();
  return candidates.filter((c) => {
    if (seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  });
}

function textMatchesKeywords(text, keywords) {
  const lower = String(text || "").toLowerCase();
  return keywords.some((k) => lower.includes(k));
}

function pickBestVideoUrl(videoObj) {
  const variants = videoObj?.variants || [];
  const mp4 = variants
    .filter((v) => v.type === "video/mp4" && v.src)
    .sort((a, b) => (Number(b.bitrate || 0) - Number(a.bitrate || 0)));
  if (mp4[0]?.src) return mp4[0].src;
  const hls = variants.find((v) => v.type === "application/x-mpegURL" && v.src);
  return hls?.src || null;
}

async function scrapeXVideoTweets({ toolName, handles, keywords, filterYear }) {
  const entries = [];
  for (const handle of handles) {
    let markdown = "";
    try {
      markdown = await fetchXProfileMarkdown(handle);
    } catch {
      continue;
    }
    const candidates = extractStatusCandidatesFromMarkdown(markdown);
    let statusIds = candidates
      .filter((c) => keywords.some((k) => c.context.includes(k)))
      .map((c) => c.id);
    if (statusIds.length === 0) {
      statusIds = extractStatusIdsFromProfileMarkdown(markdown);
    }
    statusIds = statusIds.slice(0, 20);
    for (const id of statusIds) {
      try {
        const tweet = await fetchJson(`https://cdn.syndication.twimg.com/tweet-result?id=${id}&token=1`);
        const text = tweet?.text || "";
        if (!textMatchesKeywords(text, keywords)) continue;

        const date = (tweet?.created_at || "").slice(0, 10);
        if (!date) continue;
        if (filterYear && !date.startsWith(String(filterYear))) continue;

        const videoUrl = pickBestVideoUrl(tweet?.video);
        if (!videoUrl) continue; // only keep tweets with video

        const poster = cleanUrl(tweet?.video?.poster);
        entries.push({
          tool: toolName,
          date,
          images: poster ? [poster] : [],
          muxIds: [],
          mp4Urls: /\.mp4(\?|$)/i.test(videoUrl) ? [videoUrl] : [],
          m3u8Urls: /\.m3u8(\?|$)/i.test(videoUrl) ? [videoUrl] : [],
          youtubeIds: [],
        });
      } catch {
        // Skip invalid/blocked tweet ids.
      }
    }
  }
  return mergeEntries(entries);
}

function looksLikeMarketingNoise(url) {
  return /(favicon|apple-touch|logo|icon|avatar|sprite|placeholder|analytics)/i.test(url);
}

function filterPencilImages(urls) {
  return uniqueClean(urls).filter((u) => {
    if (looksLikeMarketingNoise(u)) return false;
    if (/cdn\.prod\.website-files\.com/i.test(u)) return true;
    return /(release|feature|nano|gemini|pencil|integration)/i.test(u);
  });
}

async function scrapeTraeFromBlog(filterYear) {
  const blogUrl = "https://www.trae.ai/blog";
  const indexHtml = await fetchPage(blogUrl);
  const hrefRegex = /href=["'](\/blog\/[^"']+)["']/gi;
  const links = new Set();
  let m;
  while ((m = hrefRegex.exec(indexHtml)) !== null) {
    links.add(new URL(m[1], blogUrl).toString());
  }

  const results = [];
  for (const url of Array.from(links).slice(0, 20)) {
    try {
      const html = await fetchPage(url);
      const dateSections = extractByDate(html, filterYear);
      const date = dateSections[0]?.date ?? "unknown";
      if (filterYear && !date.startsWith(String(filterYear))) continue;

      const images = [];
      const ogImage = extractMetaContent(html, "og:image");
      const twitterImage = extractMetaContent(html, "twitter:image");
      if (ogImage) images.push(ogImage);
      if (twitterImage) images.push(twitterImage);
      images.push(...extractImages(html, null));

      const mp4Urls = extractMp4s(html);
      const m3u8Urls = extractM3u8(html);
      const muxIds = extractMuxIds(html);
      const youtubeIds = extractYouTube(html);

      if (images.length || mp4Urls.length || m3u8Urls.length || muxIds.length || youtubeIds.length) {
        results.push({
          tool: "Trae",
          date,
          images: uniqueClean(images).filter((u) => !looksLikeMarketingNoise(u)),
          muxIds,
          mp4Urls,
          m3u8Urls,
          youtubeIds,
        });
      }
    } catch {
      // Skip problematic post page.
    }
  }
  const blogResults = mergeEntries(results);
  const xResults = await scrapeXVideoTweets({
    toolName: "Trae",
    handles: ["Trae_ai"],
    keywords: ["new", "introducing", "launch", "beta"],
    filterYear,
  });
  return mergeEntries([...blogResults, ...xResults]);
}

async function scrapePencilFromX(filterYear) {
  // Pencil official account has little/no direct posts; founder account often carries launch videos.
  return scrapeXVideoTweets({
    toolName: "Pencil",
    handles: ["tomkrcha", "pencildev"],
    keywords: ["new", "introducing", "code on canvas", "pencil"],
    filterYear,
  });
}

function mergeEntries(entries) {
  const byDate = new Map();
  for (const e of entries) {
    const key = `${e.tool}::${e.date}`;
    if (!byDate.has(key)) {
      byDate.set(key, {
        tool: e.tool,
        date: e.date,
        images: [],
        muxIds: [],
        mp4Urls: [],
        m3u8Urls: [],
        youtubeIds: [],
      });
    }
    const target = byDate.get(key);
    target.images.push(...(e.images || []));
    target.muxIds.push(...(e.muxIds || []));
    target.mp4Urls.push(...(e.mp4Urls || []));
    target.m3u8Urls.push(...(e.m3u8Urls || []));
    target.youtubeIds.push(...(e.youtubeIds || []));
  }

  return Array.from(byDate.values()).map((e) => ({
    ...e,
    images: uniqueClean(e.images),
    muxIds: Array.from(new Set(e.muxIds)),
    mp4Urls: uniqueClean(e.mp4Urls),
    m3u8Urls: uniqueClean(e.m3u8Urls),
    youtubeIds: Array.from(new Set(e.youtubeIds)),
  }));
}

function extractMuxIds(html) {
  const ids = new Set();
  // Various patterns Mux IDs appear in
  const patterns = [
    /playbackId['":\s]+["']?([A-Za-z0-9]{30,60})["']?/g,
    /"playback_id"\s*:\s*"([A-Za-z0-9]{30,60})"/g,
    /stream\.mux\.com\/([A-Za-z0-9]{30,60})/g,
    /image\.mux\.com\/([A-Za-z0-9]{30,60})/g,
  ];
  for (const p of patterns) {
    const re = new RegExp(p.source, "g");
    let m;
    while ((m = re.exec(html)) !== null) {
      if (m[1] && m[1].length >= 30) ids.add(m[1]);
    }
  }
  return Array.from(ids);
}

function extractImages(html, cdnBase) {
  const urls = new Set();

  // Known CDN pattern
  if (cdnBase) {
    const re = new RegExp(
      cdnBase.replace(/\./g, "\\.") + "[^\\s\"'\\)>]+",
      "g"
    );
    let m;
    while ((m = re.exec(html)) !== null) {
      const url = m[0].replace(/['")\s]+$/, "");
      if (/\.(png|jpg|jpeg|webp|gif|svg)/.test(url)) urls.add(url);
    }
  }

  // Generic image patterns
  const patterns = [
    /https?:\/\/[^\s"'<>]+\.(png|jpg|jpeg|webp|gif)(?:\?[^\s"'<>]*)?/gi,
  ];
  for (const p of patterns) {
    const re = new RegExp(p.source, "gi");
    let m;
    while ((m = re.exec(html)) !== null) {
      const url = m[0];
      // Filter out icons, favicons, avatars, logos
      if (!url.includes("favicon") && !url.includes("avatar") && !url.includes("/icon") && !url.includes("logo")) {
        urls.add(url);
      }
    }
  }
  return uniqueClean(Array.from(urls));
}

function extractMp4s(html) {
  const urls = new Set();
  const re = /https?:\/\/[^\s"'<>]+\.mp4(?:\?[^\s"'<>]*)?/gi;
  let m;
  while ((m = re.exec(html)) !== null) urls.add(m[0].replace(/['")\s]+$/, ""));
  return uniqueClean(Array.from(urls));
}

function extractM3u8(html) {
  const urls = new Set();
  const re = /https?:\/\/[^\s"'<>]+\.m3u8(?:\?[^\s"'<>]*)?/gi;
  let m;
  while ((m = re.exec(html)) !== null) urls.add(m[0].replace(/['")\s]+$/, ""));
  return uniqueClean(Array.from(urls));
}

function extractYouTube(html) {
  const ids = new Set();
  const patterns = [
    /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/g,
    /youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})/g,
    /youtu\.be\/([A-Za-z0-9_-]{11})/g,
    /"videoId"\s*:\s*"([A-Za-z0-9_-]{11})"/g,
  ];
  for (const p of patterns) {
    const re = new RegExp(p.source, "g");
    let m;
    while ((m = re.exec(html)) !== null) ids.add(m[1]);
  }
  return Array.from(ids);
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// Try to find date-labeled sections in the HTML
function extractByDate(html, filterYear) {
  // Match both YYYY-MM-DD and "Month D, YYYY" formats
  const patterns = [
    { re: /\b(202[4-9])-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])\b/g, type: 'iso' },
    { re: /\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(\d{1,2}),?\s+(202[4-9])\b/g, type: 'mdy' },
  ];

  // Collect all date positions
  const datePositions = [];
  for (const { re, type } of patterns) {
    const regex = new RegExp(re.source, 'g');
    let m;
    while ((m = regex.exec(html)) !== null) {
      let date;
      if (type === 'iso') {
        date = `${m[1]}-${m[2]}-${m[3]}`;
      } else {
        const monthIdx = MONTHS.findIndex(mo => m[1].toLowerCase().startsWith(mo.toLowerCase()));
        if (monthIdx < 0) continue;
        date = `${m[3]}-${String(monthIdx+1).padStart(2,'0')}-${m[2].padStart(2,'0')}`;
      }
      datePositions.push({ date, idx: m.index });
    }
  }

  // Sort by position and deduplicate nearby positions
  datePositions.sort((a, b) => a.idx - b.idx);
  const deduped = [];
  let lastIdx = -200;
  for (const pos of datePositions) {
    if (pos.idx - lastIdx > 100) { // only keep if > 100 chars apart
      deduped.push(pos);
      lastIdx = pos.idx;
    }
  }

  const sections = [];
  for (let i = 0; i < deduped.length; i++) {
    const { date, idx } = deduped[i];
    const end = i + 1 < deduped.length ? deduped[i + 1].idx : html.length;
    sections.push({ date, start: idx, end });
  }

  return sections.filter(s => !filterYear || s.date.startsWith(String(filterYear)));
}

async function scrapeTool(toolId, filterYear) {
  if (toolId === "trae") {
    return scrapeTraeFromBlog(filterYear);
  }
  if (toolId === "pencil") {
    const siteResults = await (async () => {
      const cfg = TOOLS[toolId];
      const baseHtml = await fetchPage(cfg.urls[0]);
      const followLinks = extractLinksToFollow(baseHtml, cfg.urls[0], cfg.followHost);
      const pageUrls = Array.from(new Set([...cfg.urls, ...followLinks]));
      const pageHtml = [];
      for (const url of pageUrls) {
        try {
          const html = url === cfg.urls[0] ? baseHtml : await fetchPage(url);
          pageHtml.push({ url, html });
        } catch {}
      }
      const results = [];
      for (const { html } of pageHtml) {
        const sections = extractByDate(html, filterYear);
        if (sections.length === 0) continue;
        for (const sec of sections) {
          const chunk = html.slice(sec.start, sec.end);
          let images = extractImages(chunk, cfg.imageCdnBase);
          images = filterPencilImages(images);
          if (images.length) {
            results.push({ tool: cfg.name, date: sec.date, images, muxIds: [], mp4Urls: [], m3u8Urls: [], youtubeIds: [] });
          }
        }
      }
      return mergeEntries(results);
    })();
    const xResults = await scrapePencilFromX(filterYear);
    return mergeEntries([...siteResults, ...xResults]);
  }

  const cfg = TOOLS[toolId];
  if (!cfg) throw new Error(`Unknown tool: ${toolId}`);

  const baseHtml = await fetchPage(cfg.urls[0]);
  const followLinks = extractLinksToFollow(baseHtml, cfg.urls[0], cfg.followHost);
  const pageUrls = Array.from(new Set([...cfg.urls, ...followLinks]));
  const pageHtml = [];

  for (const url of pageUrls) {
    try {
      const html = url === cfg.urls[0] ? baseHtml : await fetchPage(url);
      pageHtml.push({ url, html });
    } catch (e) {
      console.log(`  Skip ${url} (${e.message})`);
    }
  }

  console.log(`  Visited ${pageHtml.length} page(s)${filterYear ? `, filtering year ${filterYear}` : ""}`);

  const results = [];
  for (const { html } of pageHtml) {
    const sections = extractByDate(html, filterYear);
    if (sections.length === 0) continue;
    for (const sec of sections) {
      const chunk = html.slice(sec.start, sec.end);
      const jsonMedia = extractMediaFromJson(chunk);
      let images = extractImages(chunk, cfg.imageCdnBase).concat(
        jsonMedia.filter((u) => /\.(png|jpg|jpeg|webp|gif)(\?.*)?$/i.test(u))
      );
      if (toolId === "pencil") images = filterPencilImages(images);
      const muxIds = extractMuxIds(chunk);
      const mp4Urls = extractMp4s(chunk).concat(
        jsonMedia.filter((u) => /\.mp4(\?.*)?$/i.test(u))
      );
      const m3u8Urls = extractM3u8(chunk).concat(
        jsonMedia.filter((u) => /\.m3u8(\?.*)?$/i.test(u))
      );
      const youtubeIds = extractYouTube(chunk);

      if (images.length || muxIds.length || mp4Urls.length || m3u8Urls.length || youtubeIds.length) {
        results.push({
          tool: cfg.name,
          date: sec.date,
          images: uniqueClean(images),
          muxIds: Array.from(new Set(muxIds)),
          mp4Urls: uniqueClean(mp4Urls),
          m3u8Urls: uniqueClean(m3u8Urls),
          youtubeIds: Array.from(new Set(youtubeIds)),
        });
      }
    }
  }

  // Fallback: whole-page scan over all visited pages.
  if (results.length === 0) {
    let images = [];
    const muxIds = [];
    const mp4Urls = [];
    const m3u8Urls = [];
    const youtubeIds = [];

    for (const { html } of pageHtml) {
      const jsonMedia = extractMediaFromJson(html);
      images.push(...extractImages(html, cfg.imageCdnBase));
      images.push(...jsonMedia.filter((u) => /\.(png|jpg|jpeg|webp|gif)(\?.*)?$/i.test(u)));
      muxIds.push(...extractMuxIds(html));
      mp4Urls.push(...extractMp4s(html));
      mp4Urls.push(...jsonMedia.filter((u) => /\.mp4(\?.*)?$/i.test(u)));
      m3u8Urls.push(...extractM3u8(html));
      m3u8Urls.push(...jsonMedia.filter((u) => /\.m3u8(\?.*)?$/i.test(u)));
      youtubeIds.push(...extractYouTube(html));
    }

    if (images.length || muxIds.length || mp4Urls.length || m3u8Urls.length || youtubeIds.length) {
      results.push({
        tool: cfg.name,
        date: "all",
        images: toolId === "pencil" ? filterPencilImages(images) : uniqueClean(images),
        muxIds: Array.from(new Set(muxIds)),
        mp4Urls: uniqueClean(mp4Urls),
        m3u8Urls: uniqueClean(m3u8Urls),
        youtubeIds: Array.from(new Set(youtubeIds)),
      });
    }
  }

  return mergeEntries(results);
}

async function main() {
  const args = process.argv.slice(2);
  const toolArg = (args.find(a => a.startsWith("--tool=")) || "").replace("--tool=", "") || null;
  const yearArg = (args.find(a => a.startsWith("--year=")) || "").replace("--year=", "") || null;
  const filterYear = yearArg ? parseInt(yearArg) : null;

  const toolIds = toolArg ? [toolArg] : Object.keys(TOOLS);

  console.log("=== AI UI Tracker — Changelog Scraper ===");
  console.log(`Tools: ${toolIds.join(", ")}`);
  if (filterYear) console.log(`Year filter: ${filterYear}`);
  console.log("");

  const allResults = [];

  for (const toolId of toolIds) {
    console.log(`\n[${toolId.toUpperCase()}]`);
    try {
      const results = await scrapeTool(toolId, filterYear);
      allResults.push(...results);

      if (results.length === 0) {
        console.log("  No media found.");
      } else {
        for (const r of results) {
          console.log(`  ${r.date}:`);
          if (r.images.length) console.log(`    images (${r.images.length}):\n      ${r.images.slice(0, 5).join("\n      ")}`);
          if (r.muxIds.length) console.log(`    mux (${r.muxIds.length}): ${r.muxIds.join(", ")}`);
          if (r.mp4Urls.length) console.log(`    mp4 (${r.mp4Urls.length}):\n      ${r.mp4Urls.join("\n      ")}`);
          if (r.m3u8Urls && r.m3u8Urls.length) console.log(`    m3u8 (${r.m3u8Urls.length}):\n      ${r.m3u8Urls.join("\n      ")}`);
          if (r.youtubeIds.length) console.log(`    youtube: ${r.youtubeIds.join(", ")}`);
        }
      }
    } catch (e) {
      console.error(`  ERROR: ${e.message}`);
    }
  }

  const outFile = "scraped-media.json";
  writeFileSync(outFile, JSON.stringify(allResults, null, 2));
  console.log(`\n✓ Results written to ${outFile}`);
  console.log(`  Total entries with media: ${allResults.length}`);
  console.log("\n=== Next steps ===");
  console.log("  Review scraped-media.json");
  console.log("  Match each entry to a ChangeEntry in data/tools.ts");
  console.log("  Add images[] and videos[] fields accordingly");
}

main().catch(e => { console.error(e); process.exit(1); });
