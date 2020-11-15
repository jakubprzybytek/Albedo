package jp.albedo.jpl.files.util;

import java.nio.ByteBuffer;

import static java.nio.ByteOrder.LITTLE_ENDIAN;

public class LittleEndianByteBufferReader {

    private final ByteBuffer byteBuffer;

    private final byte[] intBuffer = new byte[4];

    private final byte[] doubleBuffer = new byte[8];

    private final byte[] stringBugger = new byte[100];

    public LittleEndianByteBufferReader(ByteBuffer byteBuffer) {
        this.byteBuffer = byteBuffer;
    }

    public int getInt() {
        byteBuffer.get(intBuffer);
        return ByteBuffer.wrap(intBuffer).order(LITTLE_ENDIAN).getInt();
    }

    public double getDouble() {
        byteBuffer.get(doubleBuffer);
        return ByteBuffer.wrap(doubleBuffer).order(LITTLE_ENDIAN).getDouble();
    }

    public double[] readDoubles(int n) {
        double[] doubles = new double[n];
        for (int i = 0; i < n; i++) {
            byteBuffer.get(doubleBuffer);
            doubles[i] = ByteBuffer.wrap(doubleBuffer).order(LITTLE_ENDIAN).getDouble();
        }
        return doubles;
    }

    public String getString(int n) {
        if (n > 100) {
            throw new UnsupportedOperationException("Buffer too small to read " + n + " chars!");
        }

        byteBuffer.get(stringBugger, 0, n);
        return new String(stringBugger);
    }

}
