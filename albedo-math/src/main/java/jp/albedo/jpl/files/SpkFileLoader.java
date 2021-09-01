package jp.albedo.jpl.files;

import jp.albedo.jpl.JplBody;
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
import java.util.Collections;
import java.util.List;

public class SpkFileLoader {

    private final File file;

    private final String fileName;

    public SpkFileLoader(File file) {
        this.file = file;
        this.fileName = file.getName();
    }

    public List<SpkKernelCollection> load(double startJde, double endJde, List<JplBody> bodiesToLoad) throws JplException {

        final double startEt = EphemerisSeconds.fromJde(startJde);
        final double endEt = EphemerisSeconds.fromJde(endJde);

        final List<SpkKernelCollection> spkData = new ArrayList<>();

        try (FileChannel fileChannel = (FileChannel) Files.newByteChannel(file.toPath(), StandardOpenOption.READ)) {

            final SpkFileInformationReader infoReader = new SpkFileInformationReader(fileChannel);
            for (SpkFileArrayInformation arrayInfo : infoReader.readArraysInformation()) {
                if (bodiesToLoad.isEmpty() || bodiesToLoad.contains(arrayInfo.getBody())) {
                    switch (arrayInfo.getDataType()) {
                        case ChebyshevPosition:
                            final SpkFileDataReader positionDataReader = new SpkFileDataReader(fileChannel);
                            final List<PositionChebyshevRecord> positionChebyshevRecords = positionDataReader.readChebyshevArray(arrayInfo, startEt, endEt);
                            if (!positionChebyshevRecords.isEmpty()) {
                                spkData.add(SpkKernelCollection.fromPositionData(fileName, arrayInfo, positionChebyshevRecords));
                            }
                            break;

                        case ChebyshevPositionAndVelocity:
                            final SpkFilePositionAndVelocityChebyshevPolynomialsReader positionAndVelocityDataReader = new SpkFilePositionAndVelocityChebyshevPolynomialsReader(fileChannel);
                            final List<PositionAndVelocityChebyshevRecord> positionAndVelocityChebyshevRecords = positionAndVelocityDataReader.readChebyshevArray(arrayInfo, startEt, endEt);
                            if (!positionAndVelocityChebyshevRecords.isEmpty()) {
                                spkData.add(SpkKernelCollection.fromPositionAndVelocityData(fileName, arrayInfo, positionAndVelocityChebyshevRecords));
                            }
                            break;
                    }
                }
            }

            return spkData;

        } catch (IOException e) {
            throw new JplException("Cannot read spk file!", e);
        }
    }
}
