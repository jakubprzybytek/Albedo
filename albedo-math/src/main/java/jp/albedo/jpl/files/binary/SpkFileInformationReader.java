package jp.albedo.jpl.files.binary;

import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.files.util.LittleEndianByteBufferReader;
import jp.albedo.jpl.kernel.PositionChebyshevRecord;
import jp.albedo.jpl.kernel.TimeSpan;
import jp.albedo.jpl.kernel.XYZCoefficients;

import java.io.IOException;
import java.nio.MappedByteBuffer;
import java.nio.channels.FileChannel;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class SpkFileInformationReader {

    private final FileChannel fileChannel;

    private SpkFileDescriptor descriptor;

    private List<SpkFileArrayInformation> arrayInformationList;

    public SpkFileInformationReader(FileChannel fileChannel) {
        this.fileChannel = fileChannel;
    }

    /**
     * Returns information about records in given SPK file. It actually starts reading the file
     * to get information about content of the file but it stops there, i.e. it doesn't read actual array data.
     *
     * @return List of record information.
     * @throws JplException If the file cannot be read properly.
     */
    public List<SpkFileArrayInformation> readArraysInformation() throws JplException {
        try {
            if (descriptor == null) {
                lookupFileContent();
            }
            return Collections.unmodifiableList(arrayInformationList);
        } catch (IOException e) {
            throw new JplException("Cannot read SPK file!", e);
        }
    }

    /**
     * Attempts to read entire array assuming it contains Chebyshev coefficients for positions.
     *
     * @param arrayInfo Record describing which array to load.
     * @param startEt   Start of the time period for which records should be returned. Time is provided in
     *                  ephemeris seconds past the epoch of the J2000 reference system (Julian Ephemeris Date 2451545.0 ).
     * @param endEt     End of the time period for which records should be returned. Same units as for startEt.
     * @return List of Chebyshev records.
     * @throws JplException if cannot read from file.
     */
    public List<PositionChebyshevRecord> getChebyshevArray(SpkFileArrayInformation arrayInfo, double startEt, double endEt) throws JplException {

        if (arrayInfo.getDataType() != DataType.ChebyshevPosition) {
            throw new UnsupportedOperationException("Unsupported data type id: " + arrayInfo.getDataType());
        }

        if (startEt > arrayInfo.getEndDate() || endEt < arrayInfo.getStartDate()) {
            return Collections.emptyList();
        }

        try {
            final int position = arrayInfo.getStartIndex() * SpkFileConsts.DOUBLE_SIZE;
            final int bufferSize = (arrayInfo.getEndIndex() - arrayInfo.getStartIndex() + 1) * SpkFileConsts.DOUBLE_SIZE;

            MappedByteBuffer byteBuffer = fileChannel.map(FileChannel.MapMode.READ_ONLY, position, bufferSize);
            LittleEndianByteBufferReader leByteBuffer = new LittleEndianByteBufferReader(byteBuffer);

            // lookup array details - they are at the end
            byteBuffer.position(bufferSize - 2 * SpkFileConsts.DOUBLE_SIZE);
            final int chebyshevRecordSize = (int) leByteBuffer.getDouble();
            final int chebyshevRecordNumber = (int) leByteBuffer.getDouble();

            final int coefficientsNumber = (chebyshevRecordSize - 2) / 3;
            final List<PositionChebyshevRecord> positionChebyshevRecords = new ArrayList<>();

            // get back to beginning of the array
            byteBuffer.position(0);

            for (int i = 0; i < chebyshevRecordNumber; i++) {
                PositionChebyshevRecord positionChebyshevRecord = getChebyshevRecord(leByteBuffer, coefficientsNumber);

                // check if record overlaps with requested time period
                // TODO: make the test inside getChebyshevRecord method so no unnecessary objects are created
                if (startEt <= positionChebyshevRecord.getTimeSpan().getTo() && endEt >= positionChebyshevRecord.getTimeSpan().getFrom()) {
                    positionChebyshevRecords.add(positionChebyshevRecord);
                }
            }

            return positionChebyshevRecords;
        } catch (IOException e) {
            throw new JplException("Cannot read SPK file!", e);
        }
    }

    /**
     * Reads single Chebyshev record.
     * <p>
     * Format:
     * date mid point - 8 byte LE double
     * date radius - 8 byte LE double
     * coefficients for X - n times 8 byte LE double
     * coefficients for Y - n times 8 byte LE double
     * coefficients for Z - n times 8 byte LE double
     *
     * @param byteBuffer         Byte buffer to read from.
     * @param coefficientsNumber number of coefficients per position vector (n).
     * @return Parsed Chebyshev record.
     */
    private static PositionChebyshevRecord getChebyshevRecord(LittleEndianByteBufferReader byteBuffer, int coefficientsNumber) {
        final double dateMidPoint = byteBuffer.getDouble();
        final double dateRadius = byteBuffer.getDouble();

        final XYZCoefficients coefficients = new XYZCoefficients();
        coefficients.x = byteBuffer.readDoubles(coefficientsNumber);
        coefficients.y = byteBuffer.readDoubles(coefficientsNumber);
        coefficients.z = byteBuffer.readDoubles(coefficientsNumber);

        TimeSpan timeSpan = new TimeSpan(dateMidPoint - dateRadius, dateMidPoint + dateRadius);
        return new PositionChebyshevRecord(timeSpan, coefficients);
    }

    private void lookupFileContent() throws IOException, JplException {
        MappedByteBuffer descriptorByteBuffer = fileChannel.map(FileChannel.MapMode.READ_ONLY, 0, SpkFileConsts.FILE_DESCRIPTOR_SIZE);
        LittleEndianByteBufferReader leDescriptorByteBuffer = new LittleEndianByteBufferReader(descriptorByteBuffer);

        descriptor = readFileDescriptor(leDescriptorByteBuffer);

        if (!FileArchitecture.DAF_SPK.value.equals(descriptor.getArchitecture())) {
            throw new JplException("Unsupported file architecture: " + descriptor.getArchitecture());
        }

        if (descriptor.getFileRecordDoublesNumber() != 2 || descriptor.getFileRecordIntegersNumber() != 6) {
            throw new JplException("Unsupported file records format: ND=" + descriptor.getFileRecordDoublesNumber() + ", NI=" + descriptor.getFileRecordIntegersNumber());
        }

        if (descriptor.getFirstArrayInformationBlockIndex() != descriptor.getLastArrayInformationBlockIndex()) {
            throw new JplException("Unsupported file structure: first file record index != last file record index");
        }

        // go to first array information record
        final int arrayInformationPosition = descriptor.getFirstArrayInformationBlockIndex() * SpkFileConsts.FILE_BLOCK_SIZE;
        MappedByteBuffer arrayInformationByteBuffer = fileChannel.map(FileChannel.MapMode.READ_ONLY, arrayInformationPosition, SpkFileConsts.FILE_BLOCK_SIZE);
        LittleEndianByteBufferReader leArrayInformationByteBuffer = new LittleEndianByteBufferReader(arrayInformationByteBuffer);

        arrayInformationByteBuffer.position(2 * SpkFileConsts.DOUBLE_SIZE); // skip first and last index
        final int numberOfRecords = (int) leArrayInformationByteBuffer.getDouble();

        arrayInformationList = new ArrayList<>();

        for (int i = 0; i < numberOfRecords; i++) {
            try {
                arrayInformationList.add(readFileArrayInformation(leArrayInformationByteBuffer));
            } catch (UnsupportedOperationException e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * Reads file description. It is at the beginning of the file.
     * <p>
     * Format:
     * file architecture string - 8 chars
     * nd - 4 byte LE integer
     * ni - 4 byte LE integer
     * file name string - 60 chars
     * forwardSearchIndex - 4 byte LE integer
     * backwardSearchIndex - 4 byte LE integer
     * freePointer - 4 byte LE integer
     * <p>
     * Total: 88 bytes
     *
     * @param byteBuffer Byte buffer to read from.
     * @return Parsed file description object.
     */
    private static SpkFileDescriptor readFileDescriptor(LittleEndianByteBufferReader byteBuffer) {
        final String fileArchitecture = byteBuffer.getString(8).trim();
        final int nd = byteBuffer.getInt();
        final int ni = byteBuffer.getInt();
        final String fileName = byteBuffer.getString(60).trim();
        final int forwardSearchIndex = byteBuffer.getInt() - 1; // '-1' to convert to 0-based index
        final int backwardSearchIndex = byteBuffer.getInt() - 1;
        final int freePointer = byteBuffer.getInt();

        return new SpkFileDescriptor(fileArchitecture, nd, ni, fileName, forwardSearchIndex, backwardSearchIndex, freePointer);
    }

    private static SpkFileArrayInformation readFileArrayInformation(LittleEndianByteBufferReader byteBuffer) {
        final double startDate = byteBuffer.getDouble();
        final double endDate = byteBuffer.getDouble();
        final JplBody body = JplBody.forId(byteBuffer.getInt());
        final JplBody centerBody = JplBody.forId(byteBuffer.getInt());
        final ReferenceFrame referenceFrame = ReferenceFrame.forId(byteBuffer.getInt());
        final DataType dataType = DataType.forId(byteBuffer.getInt());
        final int startIndex = byteBuffer.getInt() - 1; // '-1' to convert to 0-based index
        final int endIndex = byteBuffer.getInt() - 1;

        return new SpkFileArrayInformation(startDate, endDate, body, centerBody, referenceFrame, dataType, startIndex, endIndex);
    }

}
