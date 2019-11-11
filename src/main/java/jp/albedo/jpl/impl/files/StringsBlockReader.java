package jp.albedo.jpl.impl.files;

import java.io.BufferedReader;
import java.io.IOException;

public class StringsBlockReader {

    private BufferedReader reader;

    private String[] buffer;

    private int bufferIndex;

    public StringsBlockReader(BufferedReader reader) {
        this.reader = reader;
    }

    public String read() throws IOException {
        if (this.buffer == null || this.bufferIndex >= this.buffer.length) {
            this.buffer = this.reader.readLine().trim().split("\\s+");
            this.bufferIndex = 0;
        }

        return this.buffer[bufferIndex++];
    }

    public String[] read(int number) throws IOException {
        String[] values = new String[number];
        for (int i = 0; i < number; i++) {
            values[i] = read();
        }
        return values;
    }

}
