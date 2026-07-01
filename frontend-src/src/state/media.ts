import type { MediaType } from "./types";

// Reusable media-type accent class (Dracula tokens set the actual colour in
// styles.css): music=cyan, game=green, video=orange. Used by Inbox, Catalog and
// the Overview watcher cards.
export function mediaTypeClass(mt: MediaType): string {
  return `media-type-${mt}`;
}
