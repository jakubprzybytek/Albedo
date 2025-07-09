import { describe, it, expect } from "vitest";
import { CorrectionType, stringToCorrectionType } from "../..";

describe("CorrectionType", () => {

  it("should cast from string", () => {
    expect(stringToCorrectionType("")).toBeUndefined();
    expect(stringToCorrectionType("INCORRECT")).toBeUndefined();

    expect(stringToCorrectionType("NONE")).toEqual(CorrectionType.NONE);
    expect(stringToCorrectionType("LT")).toEqual(CorrectionType.LIGHT_TIME);
    expect(stringToCorrectionType("LT+S")).toEqual(CorrectionType.LIGHT_TIME_AND_STAR_ABBERATION);
  });
})
