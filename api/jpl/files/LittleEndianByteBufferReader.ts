export class LittleEndianByteBufferReader {

    private dataView: DataView;
    private index: number = 0;

    constructor(byteBuffer: Uint8Array) {
        this.dataView = new DataView(byteBuffer.buffer);
    }

    getInt(): number {
        if (this.index + 4 > this.dataView.byteLength) {
            throw Error('Out of index error');
        }
        const value = this.dataView.getUint32(this.index, true);
        this.index += 4;
        return value;
    }

    getDouble(): number {
        if (this.index + 8 > this.dataView.byteLength) {
            throw Error('Out of index error');
        }
        const value = this.dataView.getFloat64(this.index, true);
        this.index += 8;
        return value;
    }

    readDoubles(n: number): number[] {
        if (this.index + n * 8 > this.dataView.byteLength) {
            throw Error('Out of index error');
        }
        const doubles = new Array<number>(n);
        for (let i = 0; i < n; i++) {
            doubles[i] = this.getDouble();
        }
        return doubles;
    }

    getString(n: number): string {
        if (this.index + n > this.dataView.byteLength) {
            throw Error('Out of index error');
        }
        var result = '';
        for (let i = 0; i < n; i++) {
            result += String.fromCharCode(this.dataView.getUint8(this.index + i));
        }
        this.index += n;
        return result;
    }

}
