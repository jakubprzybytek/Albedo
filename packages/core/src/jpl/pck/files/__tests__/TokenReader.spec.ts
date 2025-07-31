import { describe, it, expect } from "vitest";
import { Readable } from 'stream';
import { loadStreamTokens } from '../TokenReader';

describe("TokenReader", () => {
    it("should read tokens from stream", async () => {
        const input = new Readable();
        input.push("        BODY399_RADII     = ( 6378.1366   6378.1366 \n  6356.7519 )");
        input.push(null);

        const tokens = loadStreamTokens(input);
        
        expect((await tokens.next()).value).toStrictEqual({ value: "BODY399_RADII", lineNumber: 1 });
        expect((await tokens.next()).value).toStrictEqual({ value: "=", lineNumber: 1 });
        expect((await tokens.next()).value).toStrictEqual({ value: "(", lineNumber: 1 });
        expect((await tokens.next()).value).toStrictEqual({ value: "6378.1366", lineNumber: 1 });
        expect((await tokens.next()).value).toStrictEqual({ value: "6378.1366", lineNumber: 1 });
        expect((await tokens.next()).value).toStrictEqual({ value: "6356.7519", lineNumber: 2 });
        expect((await tokens.next()).value).toStrictEqual({ value: ")", lineNumber: 2 });
        expect((await tokens.next()).done).toBe(true);
    });
});
