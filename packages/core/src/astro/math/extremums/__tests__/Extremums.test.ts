import { describe, it, expect } from 'vitest';
import { findSampledLocalExtremums } from '../findSampledLocalExtremums';

const id = (value: number) => value;

describe("findSampledLocalExtremums", () => {
  it("should return empty results on empty inputs", () => {
    expect(findSampledLocalExtremums([], id)).toStrictEqual({
      minimums: [],
      maximums: []
    });
  });

  it("should return single element on single input", () => {
    expect(findSampledLocalExtremums([3], id)).toStrictEqual({
      minimums: [],
      maximums: []
    });
  });

  it("should not return edges", () => {
    expect(findSampledLocalExtremums([3, 5], id)).toStrictEqual({
      minimums: [],
      maximums: []
    });
    expect(findSampledLocalExtremums([5, 3], id)).toStrictEqual({
      minimums: [],
      maximums: []
    });
    expect(findSampledLocalExtremums([5, 8, 3], id)).toStrictEqual({
      minimums: [],
      maximums: [8]
    });
  });

  it("should return extremums", () => {
    expect(findSampledLocalExtremums([5, 4, 5, 3, 6, 4], id)).toStrictEqual({
      minimums: [4, 3],
      maximums: [5, 6]
    });
    expect(findSampledLocalExtremums([3, 4, 2, 3, 1], id)).toStrictEqual({
      minimums: [2],
      maximums: [4, 3]
    });
  });
});
