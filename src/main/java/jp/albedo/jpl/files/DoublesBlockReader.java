package jp.albedo.jpl.files;

import java.io.BufferedReader;
import java.io.IOException;

public class DoublesBlockReader {

    private BufferedReader reader;

    private String[] buffer;

    private int bufferIndex;

    public DoublesBlockReader(BufferedReader reader) {
        this.reader = reader;
    }

    public double readDouble() throws IOException {
        if (this.buffer == null || this.bufferIndex >= this.buffer.length) {
            this.buffer = this.reader.readLine().trim().split("\\s+");
            this.bufferIndex = 0;
        }

        String doubleString = this.buffer[bufferIndex++].replace('D', 'E');
        return Double.parseDouble(doubleString);
    }

    public double[] readDoubles(int number) throws IOException {
        double[] values = new double[number];
        for (int i = 0; i < number; i++) {
            values[i] = readDouble();
        }
        return values;
    }

}
