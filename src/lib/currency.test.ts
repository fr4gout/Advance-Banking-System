import { describe, expect, it } from "vitest";
import { formatMoney } from "./currency";

describe("formatMoney", () => {
  it("formats USD without decimals", () => {
    expect(formatMoney(1500)).toBe("$1,500");
  });

  it("formats zero", () => {
    expect(formatMoney(0)).toBe("$0");
  });
});
