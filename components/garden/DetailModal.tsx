"use client";

import React, { useState } from "react";
import { GardenEntry, GardenProduct, fmtDate } from "./data";
import { Mock } from "./Mocks";
import { tools } from "@/data/tools";
import { VideoPlayer, ImageGallery } from "@/components/MediaPlayer";

export function DetailModal({
  entry,
  product,
  onClose,
}: {
  entry: GardenEntry;
  product: GardenProduct;
  onClose: () => void;
}) {
  const [note, setNote] = useState(entry.note || "");

  // Look up the real change entry for media
  const toolData = tools.find((t) => t.id === entry.product);
  const realChange = toolData?.changes.find((c) => c.title === entry.title);
  const hasVideos = realChange?.videos && realChange.videos.length > 0;
  const hasImages = realChange?.images && realChange.images.length > 0;

  return (
    <div className="garden-modal-bg" onClick={onClose}>
      <div className="garden-modal" onClick={(e) => e.stopPropagation()}>
        <div className="garden-modal-head">
          <div>
            <div className="garden-mono garden-dim">
              {fmtDate(entry.date, "iso")} · {product.name}
            </div>
            <div className="garden-modal-title">{entry.title}</div>
          </div>
          <button className="garden-modal-x" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Videos */}
        {hasVideos && (
          <div className="garden-modal-media">
            {realChange!.videos!.map((v, i) => (
              <VideoPlayer key={i} video={v} />
            ))}
          </div>
        )}

        {/* Images */}
        {hasImages && !hasVideos && (
          <div className="garden-modal-media">
            <ImageGallery images={realChange!.images!} title={entry.title} />
          </div>
        )}

        {/* Fallback: single preview image or mock */}
        {!hasVideos && !hasImages && (
          <div
            className="garden-modal-screen"
            style={{
              position: "relative",
              overflow: "hidden",
              ...(entry.previewImage
                ? { backgroundImage: `url(${entry.previewImage})`, backgroundSize: "cover", backgroundPosition: "center top" }
                : {}),
            }}
          >
            {!entry.previewImage && (
              <div style={{ position: "absolute", inset: 0 }}>
                <Mock kind={entry.kind} palette={entry.palette} />
              </div>
            )}
          </div>
        )}

        {entry.details.length > 0 && (
          <div className="garden-modal-details">
            {entry.details.map((d, i) => (
              <div key={i} className="garden-modal-detail-item">
                {d}
              </div>
            ))}
          </div>
        )}

        <div className="garden-modal-notes">
          <label>your note</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note about this release…"
          />
        </div>
      </div>
    </div>
  );
}
