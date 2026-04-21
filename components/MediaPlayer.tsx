"use client";

import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { VideoAsset } from "@/data/tools";

const MEDIA_VIEWPORT_STYLE: CSSProperties = {
  width: "100%",
  maxWidth: "calc(62vh * 16 / 9)",
  margin: "0 auto",
  aspectRatio: "16 / 9",
  overflow: "hidden",
  background: "#000",
};

declare global {
  interface Window {
    Hls?: {
      new (): {
        loadSource: (url: string) => void;
        attachMedia: (media: HTMLMediaElement) => void;
        on: (event: string, cb: (...args: any[]) => void) => void;
        destroy: () => void;
      };
      isSupported: () => boolean;
      Events: { MANIFEST_PARSED: string; ERROR: string };
    };
    __muxHlsScriptLoading?: Promise<void>;
  }
}

async function ensureHlsScript(): Promise<typeof window.Hls | undefined> {
  if (typeof window === "undefined") return undefined;
  if (window.Hls) return window.Hls;
  if (!window.__muxHlsScriptLoading) {
    window.__muxHlsScriptLoading = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.min.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("failed to load hls.js"));
      document.head.appendChild(script);
    });
  }
  try {
    await window.__muxHlsScriptLoading;
    return window.Hls;
  } catch {
    return undefined;
  }
}

// Mux video embed (public videos, no auth needed)
function AdaptiveVideo({
  poster,
  sources,
  loadOnClick = false,
}: {
  poster?: string;
  sources: string[];
  loadOnClick?: boolean;
}) {
  const [sourceIdx, setSourceIdx] = useState(0);
  const [failed, setFailed] = useState(false);
  const [enabled, setEnabled] = useState(!loadOnClick);
  const [posterFailed, setPosterFailed] = useState(false);

  useEffect(() => {
    setSourceIdx(0);
    setFailed(false);
    setEnabled(!loadOnClick);
    setPosterFailed(false);
  }, [loadOnClick, sources]);

  const handleError = () => {
    setSourceIdx((prev) => {
      const next = prev + 1;
      if (next >= sources.length) {
        setFailed(true);
        return prev;
      }
      return next;
    });
  };

  if (failed || sources.length === 0) {
    return (
      <div className="relative w-full h-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={poster || ""} alt="Video preview" className="block w-full h-full object-cover" />
        <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-white text-xs font-mono tracking-wide">
          VIDEO UNAVAILABLE
        </span>
      </div>
    );
  }

  if (!enabled) {
    return (
      <button
        type="button"
        onClick={() => setEnabled(true)}
        className="relative block w-full h-full cursor-pointer bg-black"
        aria-label="Play video"
      >
        {poster && !posterFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={poster}
            alt="Video preview"
            className="block w-full h-full object-cover"
            onError={() => setPosterFailed(true)}
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-white/80 text-xs font-mono tracking-wide">
            TAP TO LOAD VIDEO
          </span>
        )}
        <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="w-14 h-14 rounded-full border-2 border-white/70 bg-black/60 flex items-center justify-center">
            <span
              style={{
                width: 0,
                height: 0,
                borderTop: "9px solid transparent",
                borderBottom: "9px solid transparent",
                borderLeft: "14px solid white",
                marginLeft: 3,
              }}
            />
          </span>
        </span>
      </button>
    );
  }

  return (
    <video
      key={sources[sourceIdx]}
      src={sources[sourceIdx]}
      poster={poster}
      controls
      playsInline
      preload="metadata"
      onError={handleError}
      data-player="native-adaptive-v2"
      data-source-index={String(sourceIdx)}
      data-source-url={sources[sourceIdx] || ""}
      data-source-count={String(sources.length)}
      className="w-full h-full object-cover native-adaptive-player"
      style={{ background: "#000" }}
    />
  );
}

function MuxPlayer({ playbackId }: { playbackId: string }) {
  const thumbnailUrl = useMemo(
    () => `https://image.mux.com/${playbackId}/thumbnail.png?width=1280&height=720&fit_mode=preserve`,
    [playbackId]
  );
  const hlsUrl = useMemo(() => `https://stream.mux.com/${playbackId}.m3u8`, [playbackId]);
  const mp4Sources = useMemo(
    () => [
      `https://stream.mux.com/${playbackId}.mp4`,
      `https://stream.mux.com/${playbackId}/high.mp4`,
      `https://stream.mux.com/${playbackId}/medium.mp4`,
      `https://stream.mux.com/${playbackId}/low.mp4`,
    ],
    [playbackId]
  );
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<any>(null);
  const [enabled, setEnabled] = useState(false);
  const [useHls, setUseHls] = useState(true);
  const [mp4Idx, setMp4Idx] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setUseHls(true);
    setMp4Idx(0);
    setFailed(false);
    setEnabled(false);
  }, [playbackId]);

  useEffect(() => {
    if (!enabled || !useHls || failed) return;
    const video = videoRef.current;
    if (!video) return;

    // Safari can play HLS natively without hls.js.
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = hlsUrl;
      video.load();
      void video.play().catch(() => {});
      return;
    }

    let cancelled = false;
    const attachWithHlsJs = async () => {
      const Hls = await ensureHlsScript();
      if (cancelled || !videoRef.current || !Hls || !Hls.isSupported()) {
        setUseHls(false);
        return;
      }

      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(hlsUrl);
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        void videoRef.current?.play().catch(() => {});
      });
      hls.on(Hls.Events.ERROR, (_: unknown, data: { fatal?: boolean }) => {
        if (data?.fatal) {
          hls.destroy();
          hlsRef.current = null;
          setUseHls(false);
        }
      });
    };

    void attachWithHlsJs();

    return () => {
      cancelled = true;
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [enabled, useHls, hlsUrl, failed]);

  const handleVideoError = () => {
    if (useHls) {
      setUseHls(false);
      return;
    }
    setMp4Idx((prev) => {
      const next = prev + 1;
      if (next >= mp4Sources.length) {
        setFailed(true);
        return prev;
      }
      return next;
    });
  };

  if (!enabled && !failed) {
    return (
      <button
        type="button"
        onClick={() => setEnabled(true)}
        className="relative block w-full h-full cursor-pointer"
        aria-label="Play video"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={thumbnailUrl} alt="Video preview" className="block w-full h-full object-cover" />
        <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="w-14 h-14 rounded-full border-2 border-white/70 bg-black/60 flex items-center justify-center">
            <span
              style={{
                width: 0,
                height: 0,
                borderTop: "9px solid transparent",
                borderBottom: "9px solid transparent",
                borderLeft: "14px solid white",
                marginLeft: 3,
              }}
            />
          </span>
        </span>
      </button>
    );
  }

  if (failed) {
    return (
      <div className="relative w-full h-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={thumbnailUrl} alt="Video preview" className="block w-full h-full object-cover" />
        <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-white text-xs font-mono tracking-wide">
          VIDEO UNAVAILABLE
        </span>
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      src={!useHls ? mp4Sources[mp4Idx] : undefined}
      poster={thumbnailUrl}
      controls
      playsInline
      autoPlay
      preload="metadata"
      onError={handleVideoError}
      data-player="native-adaptive-v3"
      data-source-mode={useHls ? "hls" : "mp4"}
      data-source-index={String(mp4Idx)}
      data-source-url={useHls ? hlsUrl : (mp4Sources[mp4Idx] || "")}
      data-source-count={String(mp4Sources.length + 1)}
      className="w-full h-full object-cover native-adaptive-player"
      style={{ background: "#000" }}
    />
  );
}

function Mp4Player({ url, poster }: { url: string; poster?: string }) {
  return <AdaptiveVideo poster={poster} sources={[url]} loadOnClick />;
}

function YouTubePlayer({ videoId }: { videoId: string }) {
  return (
    <iframe
      src={`https://www.youtube.com/embed/${videoId}?rel=0`}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="w-full h-full border-0"
    />
  );
}

export function VideoPlayer({
  video,
}: {
  video: VideoAsset;
}) {
  return (
    <div className="relative border border-border overflow-hidden mb-2">
      <div className="relative w-full" style={MEDIA_VIEWPORT_STYLE}>
        <div className="absolute inset-0">
          {video.type === "mux" && <MuxPlayer playbackId={video.playbackId} />}
          {video.type === "mp4" && <Mp4Player url={video.url} poster={video.poster} />}
          {video.type === "youtube" && <YouTubePlayer videoId={video.videoId} />}
        </div>
      </div>
    </div>
  );
}

export function ImageGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  const [err, setErr] = useState<Set<string>>(new Set());

  const normalizedImages = useMemo(
    () =>
      images
        .map((src) => src.trim().replace(/\\+$/, ""))
        .filter((src) => /^https?:\/\//i.test(src)),
    [images]
  );

  const validImages = normalizedImages.filter((src) => !err.has(src));

  useEffect(() => {
    if (active >= validImages.length) setActive(0);
  }, [active, validImages.length]);

  if (validImages.length === 0) return null;

  return (
    <div className="border border-border overflow-hidden mb-3">
      <div className="relative w-full" style={MEDIA_VIEWPORT_STYLE}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={validImages[active]}
          alt={`${title} screenshot ${active + 1}`}
          className="block w-full h-full object-cover"
          onError={() =>
            setErr((prev) => {
              const next = new Set(prev);
              next.add(validImages[active]);
              return next;
            })
          }
        />
      </div>
    </div>
  );
}
