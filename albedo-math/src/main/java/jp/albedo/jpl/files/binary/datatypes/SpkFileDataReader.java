package jp.albedo.jpl.files.binary.datatypes;

import jp.albedo.jpl.JplException;
import jp.albedo.jpl.files.binary.DataType;
import jp.albedo.jpl.files.binary.SpkFileArrayInformation;
import jp.albedo.jpl.files.binary.SpkFileConsts;
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

public class SpkFileDataReader {

    private final FileChannel fileChannel;

    public SpkFileDataReader(FileChannel fileChannel) {
        this.fileChannel = fileChannel;
    }

    public List<PositionChebyshevRecord> readChebyshevArray(SpkFileArrayInformation arrayInfo, double startEt, double endEt) throws JplException {

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
                PositionChebyshevRecord positionChebyshevRecord = readChebyshevRecord(leByteBuffer, coefficientsNumber);

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
    private static PositionChebyshevRecord readChebyshevRecord(LittleEndianByteBufferReader byteBuffer, int coefficientsNumber) {
        final double dateMidPoint = byteBuffer.getDouble();
        final double dateRadius = byteBuffer.getDouble();

        final XYZCoefficients coefficients = new XYZCoefficients();
        coefficients.x = byteBuffer.readDoubles(coefficientsNumber);
        coefficients.y = byteBuffer.readDoubles(coefficientsNumber);
        coefficients.z = byteBuffer.readDoubles(coefficientsNumber);

        TimeSpan timeSpan = new TimeSpan(dateMidPoint - dateRadius, dateMidPoint + dateRadius);
        return new PositionChebyshevRecord(timeSpan, coefficients);
    }
}
