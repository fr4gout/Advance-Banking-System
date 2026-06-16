import { describe, expect, it } from "vitest";
import { isValidIban } from "./iban";

describe("isValidIban", () => {
  it("accepts valid Pacific Standard IBAN", () => {
    expect(isValidIban("LS12 3456 7890 1234")).toBe(true);
  });

  it("rejects invalid format", () => {
    expect(isValidIban("INVALID")).toBe(false);
  });
});
