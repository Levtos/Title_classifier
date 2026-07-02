import type { MediaType } from "./types";

// Reusable media-type accent class (Dracula tokens set the actual colour in
// styles.css): music=cyan, game=green, video=orange. Used by Inbox, Catalog and
// the Overview watcher cards.
export function mediaTypeClass(mt: MediaType): string {
  return `media-type-${mt}`;
}

const MEDIA_LABEL: Record<MediaType, string> = {
  music: "🎵 Musik",
  game: "🎮 Game",
  video: "🎬 Video",
};

/** Icon + text label for the Art column (Inbox / Katalog). */
export function mediaTypeLabel(mt: MediaType): string {
  return MEDIA_LABEL[mt] ?? mt;
}
