import { describe, it, expect } from "vitest";
import { ForwardLookingArray } from "./";

function is(value: number): (element: number) => boolean { 
    return (element: number) => element === value;
};

describe('ForwardLookingArray', () => {

    it('should allow to find existing elements', () => {
        const forwardLookingArray = new ForwardLookingArray([1, 3, 5, 7]);
        expect(forwardLookingArray.find(is(3))).toBe(3);
        expect(forwardLookingArray.find(is(5))).toBe(5);
        expect(forwardLookingArray.find(is(1))).toBe(1);
        expect(forwardLookingArray.find(is(7))).toBe(7);
    })

    it('should return undefined for non-existing elements', () => {
        const forwardLookingArray = new ForwardLookingArray([1, 3]);
        expect(forwardLookingArray.find(is(1))).toBe(1);
        expect(forwardLookingArray.find(is(2))).toBeUndefined();
    })

});
