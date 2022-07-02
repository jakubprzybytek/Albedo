import { describe, it, expect } from "vitest";
import { Forest } from './Forest';

describe("Forest", () => {

    /**
     * 1 -> 2 -> 5
     * \  \-> 6
     * \-> 7
     * 3 -> 4
     */
    it("should perform simple tree operations", () => {
        const forest: Forest<number, String> = new Forest();
        forest.addEdge(1, 2, "12");
        forest.addEdge(3, 4, "34");
        forest.addEdge(2, 5, "25");
        forest.addEdge(2, 6, "26");
        forest.addEdge(1, 7, "17");

        expect(forest.findEdge(0, 1)).toBeUndefined();
        expect(forest.findEdge(2, 1)).toBeUndefined();
        expect(forest.findEdge(2, 7)).toBeUndefined();

        expect(forest.findEdge(1, 2)).toBe("12");
        expect(forest.findEdge(3, 4)).toBe("34");
        expect(forest.findEdge(2, 5)).toBe("25");
        expect(forest.findEdge(2, 6)).toBe("26");
        expect(forest.findEdge(1, 7)).toBe("17");

        expect(forest.findPathTo(0)).toBeUndefined();
        expect(forest.findEdgesTo(0)).toBeUndefined();

        expect(forest.findPathTo(1)).toStrictEqual([1]);
        expect(forest.findEdgesTo(1)).toBeUndefined();

        expect(forest.findPathTo(2)).toStrictEqual([1, 2]);
        expect(forest.findEdgesTo(2)).toStrictEqual(["12"]);

        expect(forest.findPathTo(5)).toStrictEqual([1, 2, 5]);
        expect(forest.findEdgesTo(5)).toStrictEqual(["12", "25"]);

        expect(forest.findPathTo(6)).toStrictEqual([1, 2, 6]);
        expect(forest.findEdgesTo(6)).toStrictEqual(["12", "26"]);

        expect(forest.findPathTo(7)).toStrictEqual([1, 7]);
        expect(forest.findEdgesTo(7)).toStrictEqual(["17"]);


        expect(forest.findPathTo(3)).toStrictEqual([3]);
        expect(forest.findEdgesTo(3)).toBeUndefined();

        expect(forest.findPathTo(4)).toStrictEqual([3, 4]);
        expect(forest.findEdgesTo(4)).toStrictEqual(["34"]);
    });

    it("should not allow to add duplicated edge", () => {
        const forest: Forest<number, String> = new Forest();
        forest.addEdge(1, 2, "12");

        expect(() => forest.addEdge(1, 2, "12")).toThrowError();
    });

    // it("should merge trees", () => {
    //     const forest: Forest<number, String> = new Forest();
    //     // first tree
    //     forest.addEdge(1, 2, "12");
    //     forest.addEdge(1, 3, "13");
    //     // second tree
    //     forest.addEdge(4, 5, "45");

    //     // merge trees
    //     forest.addEdge(3, 4, "34");

    //     expect(forest.findPathTo(4)).hasValue([1, 3, 4));
    //     expect(forest.findEdgesTo(4)).hasValue(["13", "34")));

    //     expect(forest.findPathTo(5)).hasValue([1, 3, 4, 5));
    //     expect(forest.findEdgesTo(5)).hasValue(["13", "34", "45")));
    // });

    it("should allow to accept new root", () => {
        const forest: Forest<number, String> = new Forest();
        forest.addEdge(2, 3, "23");
        forest.addEdge(1, 2, "12");

        expect(forest.findPathTo(1)).toStrictEqual([1]);
        expect(forest.findEdgesTo(1)).toBeUndefined();

        expect(forest.findPathTo(2)).toStrictEqual([1, 2]);
        expect(forest.findEdgesTo(2)).toStrictEqual(["12"]);

        expect(forest.findPathTo(3)).toStrictEqual([1, 2, 3]);
        expect(forest.findEdgesTo(3)).toStrictEqual(["12", "23"]);
    });

});
