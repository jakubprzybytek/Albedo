package jp.albedo.jpl.files.impl;

import java.io.BufferedReader;
import java.io.IOException;

public class DoublesBlockReader {

    final private BufferedReader reader;

    private String[] buffer;

    private int bufferIndex;

    public DoublesBlockReader(BufferedReader reader) {
        this.reader = reader;
    }

    public double read() throws IOException {
        if (this.buffer == null || this.bufferIndex >= this.buffer.length) {
            this.buffer = this.reader.readLine().trim().split("\\s+");
            this.bufferIndex = 0;
        }

        String doubleString = this.buffer[bufferIndex++].replace('D', 'E');
        return Double.parseDouble(doubleString);
    }

    public double[] read(int number) throws IOException {
        double[] values = new double[number];
        for (int i = 0; i < number; i++) {
            values[i] = read();
        }
        return values;
    }

}
