// Types mirroring the title_classifier/v3/* WebSocket payloads (see api_v3.py /
// websockets_v3.py). Used from PR2 onwards; defined here so the scaffold and the
// typed API client share one source of truth.

export type MediaType = "music" | "game" | "video";
export type Context =
  | "homepod"
  | "pc"
  | "ps5"
  | "switch"
  | "stash"
  | "apple_tv";
export type SignalType = "title" | "app";

export interface V3Source {
  entry_id: string;
  name: string;
  media_type: MediaType;
  context: Context;
  signal_type: SignalType;
  source_app: string;
  source_entity: string;
  online: boolean;
  current_key: string | null;
  current_enum: number | null;
  current_entry_id: string | null;
  current_artwork: string | null;
  entry_count: number;
  unmapped_count: number;
}

export interface V3Variant {
  id: string;
  key: string;
  enum: number;
}

export interface V3Entry {
  id: string;
  scope: string;
  media_type: MediaType;
  signal_type: SignalType;
  key: string;
  normalized_key: string;
  enum: number;
  parent_id: string | null;
  is_variant: boolean;
  variants: V3Variant[];
  hidden: boolean;
  is_current: boolean;
  effective_enum: number | null;
  current_context: Context | null;
  current_source_app: string | null;
  first_seen: string;
  last_seen: string;
  seen_count: number;
}
