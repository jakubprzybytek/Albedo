import { describe, it, expect } from "vitest";
import { LittleEndianByteBufferReader } from './';

describe("LittleEndianByteBufferReader", () => {

    it("should read int", () => {
        const byteBuffer = new Uint8Array([29, 44, 59, 74, 1, 2, 3, 4]);

        const leBufferReader = new LittleEndianByteBufferReader(byteBuffer);

        expect(leBufferReader.getInt()).toBe(1245391901);
        expect(leBufferReader.getInt()).toBe(67305985);
    });

    it("should read int using position", () => {
        const byteBuffer = new Uint8Array([29, 44, 59, 74, 1, 2, 3, 4]);

        const leBufferReader = new LittleEndianByteBufferReader(byteBuffer);

        leBufferReader.position(4);
        expect(leBufferReader.getInt()).toBe(67305985);

        leBufferReader.position(0);
        expect(leBufferReader.getInt()).toBe(1245391901);
    });

    it("should read double", () => {
        const byteBuffer = new Uint8Array([29, 44, 59, 74, 11, 22, 33, 44, 1, 2, 3, 4, 5, 6, 7, 8]);

        const leBufferReader = new LittleEndianByteBufferReader(byteBuffer);

        expect(leBufferReader.getDouble()).toBe(3.999581805475242e-96);
        expect(leBufferReader.getDouble()).toBe(5.447603722011605e-270);
    });

    it("should read multiple doubles", () => {
        const byteBuffer = new Uint8Array([29, 44, 59, 74, 11, 22, 33, 44, 1, 2, 3, 4, 5, 6, 7, 8]);

        const leBufferReader = new LittleEndianByteBufferReader(byteBuffer);

        expect(leBufferReader.readDoubles(2)).toStrictEqual([3.999581805475242e-96, 5.447603722011605e-270]);
    });

    it("should read string", () => {
        const byteBuffer = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f]);

        const leBufferReader = new LittleEndianByteBufferReader(byteBuffer);

        expect(leBufferReader.getString(5)).toBe('Hello');
    });
});
