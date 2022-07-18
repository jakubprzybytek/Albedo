import { describe, it, expect } from 'vitest';
import { localMinimums } from './LocalMinimums';

function id(value: number) {
    return value;
}

describe("LocalMinimums", () => {

    it("should return empty results on empty inputs", () => {
        expect(localMinimums([], id)).toStrictEqual([]);
    });

    it("should return single element on single input", () => {
        expect(localMinimums([3], id)).toStrictEqual([3]);
    });

    it("should return edges", () => {
        expect(localMinimums([3, 5], id)).toStrictEqual([3]);
        expect(localMinimums([5, 3], id)).toStrictEqual([3]);
        expect(localMinimums([5, 8, 3], id)).toStrictEqual([5, 3]);
    });

    it("should return minimums", () => {
        expect(localMinimums([5, 4, 5, 3, 6], id)).toStrictEqual([4, 3]);
        expect(localMinimums([5, 4, 2, 3, 6], id)).toStrictEqual([2]);
    });

    it("should return minimums on edge and in the middle", () => {
        expect(localMinimums([2, 3, 5, 3, 6], id)).toStrictEqual([2, 3]);
        expect(localMinimums([5, 4, 2, 3, 2], id)).toStrictEqual([2, 2]);
    });

});
