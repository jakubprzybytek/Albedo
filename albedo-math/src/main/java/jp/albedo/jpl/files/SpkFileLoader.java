package jp.albedo.jpl.files;

import jp.albedo.jpl.JplException;
import jp.albedo.jpl.files.binary.SpkFileArrayInformation;
import jp.albedo.jpl.files.binary.SpkFileInformationReader;
import jp.albedo.jpl.files.binary.datatypes.SpkFileDataReader;
import jp.albedo.jpl.files.binary.datatypes.SpkFilePositionAndVelocityChebyshevPolynomialsReader;
import jp.albedo.jpl.files.util.EphemerisSeconds;
import jp.albedo.jpl.kernel.PositionAndVelocityChebyshevRecord;
import jp.albedo.jpl.kernel.PositionChebyshevRecord;
import jp.albedo.jpl.kernel.SpkKernelCollection;

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

    public List<SpkKernelCollection> loadAll(double startJde, double endJde) throws JplException {

        final double startEt = EphemerisSeconds.fromJde(startJde);
        final double endEt = EphemerisSeconds.fromJde(endJde);

        try (FileChannel fileChannel = (FileChannel) Files.newByteChannel(file.toPath(), StandardOpenOption.READ)) {

            SpkFileInformationReader infoReader = new SpkFileInformationReader(fileChannel);
            SpkFileDataReader dataReader = new SpkFileDataReader(fileChannel);

            final List<SpkKernelCollection> spkData = new ArrayList<>();

            for (SpkFileArrayInformation arrayInfo : infoReader.readArraysInformation()) {

                switch (arrayInfo.getDataType()) {
                    case ChebyshevPosition:
                        List<PositionChebyshevRecord> positionChebyshevRecords = dataReader.readChebyshevArray(arrayInfo, startEt, endEt);
                        spkData.add(SpkKernelCollection.fromArrayInformationAndPosition(arrayInfo, positionChebyshevRecords));
                        break;

                    case ChebyshevPositionAndVelocity:
                        List<PositionAndVelocityChebyshevRecord> positionAndVelocityChebyshevRecords =
                                new SpkFilePositionAndVelocityChebyshevPolynomialsReader(fileChannel).readChebyshevArray(arrayInfo, startEt, endEt);
                        spkData.add(SpkKernelCollection.fromArrayInformationAndPositionAndVelocity(arrayInfo, positionAndVelocityChebyshevRecords));
                        break;
                }
            }

            return spkData;

        } catch (IOException e) {
            throw new JplException("Cannot read spk file!", e);
        }
    }
}
