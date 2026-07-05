// Pure hash-route helpers for the Trace full view (v3.2.1). The v3 panel has no
// router — navigation is App-level state. To deep-link a single entry into the
// large Trace view (and survive a reload), we mirror the selection in the URL
// hash: "#trace" (no entry) or "#trace/<entry_id>". Entry ids are opaque and
// URL-encoded; there is no manual UUID entry anywhere in the UI.

const PREFIX = "trace";

/** Build the hash for the Trace page, optionally deep-linking one entry. */
export function buildTraceHash(entryId: string | null): string {
  return entryId ? `#${PREFIX}/${encodeURIComponent(entryId)}` : `#${PREFIX}`;
}

export interface ParsedTraceHash {
  /** True when the hash addresses the Trace page at all. */
  isTrace: boolean;
  /** The deep-linked entry id, or null when none / malformed. */
  entryId: string | null;
}

/** Parse a location hash into a Trace route. Tolerates a leading '#', an empty
 *  hash, and a trailing slash; never throws. */
export function parseTraceHash(hash: string): ParsedTraceHash {
  const raw = (hash || "").replace(/^#/, "");
  if (raw === PREFIX) return { isTrace: true, entryId: null };
  const withSlash = `${PREFIX}/`;
  if (raw.startsWith(withSlash)) {
    const encoded = raw.slice(withSlash.length);
    if (!encoded) return { isTrace: true, entryId: null };
    let entryId: string;
    try {
      entryId = decodeURIComponent(encoded);
    } catch {
      // Malformed percent-encoding → treat as no deep-link, not a crash.
      entryId = encoded;
    }
    return { isTrace: true, entryId: entryId || null };
  }
  return { isTrace: false, entryId: null };
}
