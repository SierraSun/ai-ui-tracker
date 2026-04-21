// [Claude Code 2026-04-20] video-proxy: 转发 video.twimg.com 请求
// Twitter 的视频 CDN 校验 Referer，非 twitter.com 来源返回 403。
// 此路由在服务端加上正确的 Referer 头后转发，绕过限制。
// 使用方式：/api/video-proxy?url=https://video.twimg.com/...
// 限制：仅允许 video.twimg.com 域名，防止被用作通用代理。

import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return new Response("Missing url param", { status: 400 });
  }

  // 只代理 twimg 视频，防止滥用
  if (!url.startsWith("https://video.twimg.com/")) {
    return new Response("Only video.twimg.com URLs are proxied", { status: 403 });
  }

  const upstream = await fetch(url, {
    headers: {
      "Referer": "https://twitter.com",
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      // Forward Range header for seek support
      ...(req.headers.get("range") ? { Range: req.headers.get("range")! } : {}),
    },
  });

  if (!upstream.ok && upstream.status !== 206) {
    return new Response(`Upstream error: ${upstream.status}`, { status: upstream.status });
  }

  const headers = new Headers();
  headers.set("Content-Type", upstream.headers.get("Content-Type") || "video/mp4");
  headers.set("Accept-Ranges", "bytes");
  // Allow browser caching
  headers.set("Cache-Control", "public, max-age=3600");

  const contentLength = upstream.headers.get("Content-Length");
  if (contentLength) headers.set("Content-Length", contentLength);

  const contentRange = upstream.headers.get("Content-Range");
  if (contentRange) headers.set("Content-Range", contentRange);

  return new Response(upstream.body, {
    status: upstream.status,
    headers,
  });
}
