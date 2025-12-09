import { describe, it, expect } from "vitest";
import { separationFactor } from "../ConjunctionUtils";

describe("ConjunctionUtlis", () => {

  it("should compute separation factor", () => {
    expect(separationFactor(10, 1, 3)).toBe(5);
    expect(separationFactor(10, 1)).toBe(10);
  });
});
