import { describe, it, expect } from 'vitest';
import { localExtremums } from '../Extremums';

const id = (value: number) => value;

describe("localExtremumsMinimums", () => {
  it("should return empty results on empty inputs", () => {
    expect(localExtremums([], id)).toStrictEqual({
      minimums: [],
      maximums: []
    });
  });

  it("should return single element on single input", () => {
    expect(localExtremums([3], id)).toStrictEqual({
      minimums: [],
      maximums: []
    });
  });

  it("should not return edges", () => {
    expect(localExtremums([3, 5], id)).toStrictEqual({
      minimums: [],
      maximums: []
    });
    expect(localExtremums([5, 3], id)).toStrictEqual({
      minimums: [],
      maximums: []
    });
    expect(localExtremums([5, 8, 3], id)).toStrictEqual({
      minimums: [],
      maximums: [8]
    });
  });

  it("should return extremums", () => {
    expect(localExtremums([5, 4, 5, 3, 6, 4], id)).toStrictEqual({
      minimums: [4, 3],
      maximums: [5, 6]
    });
    expect(localExtremums([3, 4, 2, 3, 1], id)).toStrictEqual({
      minimums: [2],
      maximums: [4, 3]
    });
  });
});
