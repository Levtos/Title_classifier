export interface GroupPayload {
  parent_id: string;
  child_ids: string[];
}

export function buildGroupPayload(
  selectedIds: Iterable<string>,
  masterId: string
): GroupPayload {
  const ids = Array.from(new Set(Array.from(selectedIds).filter(Boolean)));
  if (ids.length < 2) {
    throw new Error("at least two entries are required");
  }
  if (!ids.includes(masterId)) {
    throw new Error("master must be part of the selection");
  }
  const child_ids = ids.filter((id) => id !== masterId);
  if (child_ids.length === 0) {
    throw new Error("at least one child entry is required");
  }
  return { parent_id: masterId, child_ids };
}
