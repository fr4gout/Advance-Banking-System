import { describe, expect, it } from "vitest";
import { isNuiFailureResult, isNuiPreviewResult } from "./bridge";

describe("NUI bridge helpers", () => {
  it("detects preview results", () => {
    expect(isNuiPreviewResult({ ok: true, preview: true })).toBe(true);
    expect(isNuiPreviewResult({ ok: false })).toBe(false);
  });

  it("detects failure results", () => {
    expect(isNuiFailureResult({ ok: false, error: "network" })).toBe(true);
    expect(isNuiFailureResult({ ok: true })).toBe(false);
  });
});
