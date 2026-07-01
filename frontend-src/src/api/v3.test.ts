import { describe, expect, it } from "vitest";
import { createV3Api } from "./v3";
import type { Hass } from "../ha";

function fakeHass(handler: (msg: Record<string, unknown>) => unknown): {
  hass: Hass;
  calls: Record<string, unknown>[];
} {
  const calls: Record<string, unknown>[] = [];
  const hass = {
    callWS: async (msg: Record<string, unknown>) => {
      calls.push(msg);
      return handler(msg);
    },
  } as unknown as Hass;
  return { hass, calls };
}

describe("v3 api — entryDetail", () => {
  it("calls the entry_detail command with the entry_id and returns the detail", async () => {
    const { hass, calls } = fakeHass(() => ({ id: "abc", key: "Numb", contexts: [] }));
    const detail = await createV3Api(hass).entryDetail("abc");
    expect(calls[0].type).toBe("title_classifier/v3/entry_detail");
    expect(calls[0].entry_id).toBe("abc");
    expect(detail.id).toBe("abc");
  });

  it("propagates a WS error (so the panel can keep the error visible)", async () => {
    const { hass } = fakeHass(() => {
      throw new Error("unknown entry");
    });
    await expect(createV3Api(hass).entryDetail("nope")).rejects.toThrow(
      "unknown entry"
    );
  });
});
