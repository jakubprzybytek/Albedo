package jp.albedo.jpl.files;

import jp.albedo.jpl.JplException;
import jp.albedo.jpl.files.binary.SpkFileArrayInformation;
import jp.albedo.jpl.files.binary.SpkFileReader;
import jp.albedo.jpl.files.util.EphemerisSeconds;
import jp.albedo.jpl.kernel.ChebyshevRecord;
import jp.albedo.jpl.kernel.SpkKernelObjectChebyshevData;

import java.io.File;
import java.io.IOException;
import java.nio.channels.FileChannel;
import java.nio.file.Files;
import java.nio.file.StandardOpenOption;
import java.util.ArrayList;
import java.util.List;

public class SpkFileLoader {

    private final File file;

    public SpkFileLoader(File file) {
        this.file = file;
    }

    public List<SpkKernelObjectChebyshevData> loadAll(double startJde, double endJde) throws JplException {
        try (FileChannel fileChannel = (FileChannel) Files.newByteChannel(file.toPath(), StandardOpenOption.READ)) {

            final List<SpkKernelObjectChebyshevData> spkData = new ArrayList<>();

            SpkFileReader reader = new SpkFileReader(fileChannel);
            for (SpkFileArrayInformation arrayInfo : reader.getArraysInformation()) {
                List<ChebyshevRecord> chebyshevRecords = reader.getEntireChebyshevArray(arrayInfo, EphemerisSeconds.fromJde(startJde), EphemerisSeconds.fromJde(endJde));

                spkData.add(
                        SpkKernelObjectChebyshevData.fromArrayInformation(arrayInfo, chebyshevRecords));
            }

            return spkData;

        } catch (IOException e) {
            throw new JplException("Cannot read spk file!", e);
        }
    }

}
