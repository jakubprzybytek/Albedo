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
      minimums: [3],
      maximums: [3]
    });
  });

  it("should return edges", () => {
    expect(localExtremums([3, 5], id)).toStrictEqual({
      minimums: [3],
      maximums: [5]
    });
    expect(localExtremums([5, 3], id)).toStrictEqual({
      minimums: [3],
      maximums: [5]
    });
    expect(localExtremums([5, 8, 3], id)).toStrictEqual({
      minimums: [5, 3],
      maximums: [8]
    });
  });

  it("should return extremums", () => {
    expect(localExtremums([5, 4, 5, 3, 6], id)).toStrictEqual({
      minimums: [4, 3],
      maximums: [5, 5, 6]
    });
    expect(localExtremums([5, 4, 2, 3, 6], id)).toStrictEqual({
      minimums: [2],
      maximums: [5, 6]
    });
  });

  it("should return extremums on edge and in the middle", () => {
    expect(localExtremums([2, 3, 5, 3, 6], id)).toStrictEqual({
      minimums: [2, 3],
      maximums: [5, 6]
    });
    expect(localExtremums([5, 4, 2, 3, 2], id)).toStrictEqual({
      minimums: [2, 2],
      maximums: [5, 3]
    });
  });
});
