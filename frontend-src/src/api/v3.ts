// Typed client for the title_classifier/v3/* WebSocket API. Thin wrappers around
// hass.callWS — the only HA coupling. Wired into the pages from PR2 onwards.

import type { Hass } from "../ha";
import type { Context, MediaType, V3Entry, V3Source } from "../state/types";

const NS = "title_classifier/v3";

export interface ListEntriesParams {
  media_type?: MediaType;
  search?: string;
  unclassified?: boolean;
  include_hidden?: boolean;
  limit?: number;
}

export function createV3Api(hass: Hass) {
  const ws = <T>(type: string, extra: object = {}) =>
    hass.callWS<T>({ type: `${NS}/${type}`, ...extra });

  return {
    listSources: () => ws<V3Source[]>("list_sources"),
    listEntries: (params: ListEntriesParams = {}) =>
      ws<V3Entry[]>("list_entries", params),
    setEnum: (entry_id: string, enumValue: number) =>
      ws<{ ok: boolean; enum: number }>("set_enum", {
        entry_id,
        enum: enumValue,
      }),
    setHidden: (entry_id: string, hidden: boolean) =>
      ws<{ ok: boolean; hidden: boolean }>("set_hidden", { entry_id, hidden }),
    deleteEntry: (entry_id: string) =>
      ws<{ deleted: boolean }>("delete_entry", { entry_id }),
    group: (child_id: string, parent_id: string) =>
      ws<{ ok: boolean }>("group", { child_id, parent_id }),
    ungroup: (child_id: string) => ws<{ ok: boolean }>("ungroup", { child_id }),
    rename: (entry_id: string, new_key: string) =>
      ws<{ ok: boolean; key: string }>("rename_entry", { entry_id, new_key }),
    setMediaType: (entry_id: string, media_type: MediaType) =>
      ws<{ ok: boolean; media_type: MediaType }>("set_media_type", {
        entry_id,
        media_type,
      }),
    setContext: (
      entry_id: string,
      context: Context,
      new_context: Context,
      source_app = "",
      new_source_app = ""
    ) =>
      ws<{ ok: boolean }>("set_context", {
        entry_id,
        context,
        new_context,
        source_app,
        new_source_app,
      }),
    setContextOverride: (
      entry_id: string,
      context: Context,
      enum_override: number | null,
      source_app = ""
    ) =>
      ws<{ ok: boolean }>("set_context_override", {
        entry_id,
        context,
        enum_override,
        source_app,
      }),
    exportEntries: (media_type?: MediaType) =>
      ws<{ version: number; entries: unknown[] }>("export_entries", {
        ...(media_type ? { media_type } : {}),
      }),
    importEntries: (entries: unknown[]) =>
      ws<{ imported: number; rejected: number }>("import_entries", { entries }),
  };
}

export type V3Api = ReturnType<typeof createV3Api>;
