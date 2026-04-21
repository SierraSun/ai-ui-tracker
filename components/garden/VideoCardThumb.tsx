"use client";

// [Claude Code 2026-04-20] VideoCardThumb: lazily loads an mp4 video and seeks to ~1s
// to display a real video frame as the card thumbnail.
// Uses IntersectionObserver so video metadata is only fetched when the card is near the viewport.
// Replaces the blank black area that appears when poster URLs don't exist.

import { useRef, useEffect, useState } from "react";

export function VideoCardThumb({
  src,
  seekTime = 1,
}: {
  src: string;
  seekTime?: number; // seconds into the video to show (default: 1s)
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [frameReady, setFrameReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let observed = false;

    const onMetadata = () => {
      // Seek to the desired frame — triggers onSeeked which paints the frame
      video.currentTime = seekTime;
    };

    const onSeeked = () => {
      setFrameReady(true);
    };

    video.addEventListener("loadedmetadata", onMetadata);
    video.addEventListener("seeked", onSeeked);

    // Only start loading when the card is within 300px of the viewport
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !observed) {
          observed = true;
          video.preload = "metadata";
          video.load();
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(video);

    return () => {
      observer.disconnect();
      video.removeEventListener("loadedmetadata", onMetadata);
      video.removeEventListener("seeked", onSeeked);
    };
  }, [src, seekTime]);

  return (
    <video
      ref={videoRef}
      src={src}
      preload="none"
      muted
      playsInline
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        opacity: frameReady ? 1 : 0,
        transition: "opacity 0.25s ease",
      }}
    />
  );
}
