#!/usr/bin/env bash

set -euo pipefail

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "Error: ffmpeg is not installed. Install it first (e.g. brew install ffmpeg)." >&2
  exit 1
fi

if [[ $# -lt 1 ]]; then
  cat <<'EOF'
Usage:
  scripts/compress-videos.sh <input1.mp4> [input2.mp4 ...]

Output:
  Compressed files are written to app/garden/media-compressed:
    - <name>-fast.mp4   (loading-priority, smaller size)
    - <name>-poster.jpg (preview image)

Notes:
  - This profile prioritizes loading speed over quality.
  - Re-encoding uses 480p max, 24fps, H.264, AAC, and +faststart.
EOF
  exit 1
fi

OUTPUT_DIR="app/garden/media-compressed"
mkdir -p "$OUTPUT_DIR"

for INPUT in "$@"; do
  if [[ ! -f "$INPUT" ]]; then
    echo "Skip (not found): $INPUT" >&2
    continue
  fi

  BASE_NAME="$(basename "$INPUT")"
  STEM="${BASE_NAME%.*}"
  OUTPUT_VIDEO="$OUTPUT_DIR/${STEM}-fast.mp4"
  OUTPUT_POSTER="$OUTPUT_DIR/${STEM}-poster.jpg"

  echo "Compressing: $INPUT -> $OUTPUT_VIDEO"
  ffmpeg -y -i "$INPUT" \
    -vf "fps=24,scale='if(gt(iw,854),854,iw)':'-2'" \
    -c:v libx264 -preset medium -crf 31 \
    -profile:v main -level 3.1 -pix_fmt yuv420p \
    -movflags +faststart \
    -c:a aac -b:a 64k -ac 2 \
    "$OUTPUT_VIDEO"

  echo "Generating poster: $OUTPUT_POSTER"
  ffmpeg -y -ss 00:00:01 -i "$OUTPUT_VIDEO" -frames:v 1 -q:v 3 "$OUTPUT_POSTER"
done

echo "Done. Compressed assets are in: $OUTPUT_DIR"
