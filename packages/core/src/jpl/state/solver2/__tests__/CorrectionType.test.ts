import { describe, it, expect } from "vitest";
import { CorrectionType2, stringToCorrectionType } from "../..";

describe("CorrectionType", () => {

  it("should cast from string", () => {
    expect(stringToCorrectionType("")).toBeUndefined();
    expect(stringToCorrectionType("INCORRECT")).toBeUndefined();

    expect(stringToCorrectionType("NONE")).toEqual(CorrectionType2.NONE);
    expect(stringToCorrectionType("LT")).toEqual(CorrectionType2.LIGHT_TIME);
    expect(stringToCorrectionType("LT+S")).toEqual(CorrectionType2.LIGHT_TIME_AND_STAR_ABBERATION);
  });
})
