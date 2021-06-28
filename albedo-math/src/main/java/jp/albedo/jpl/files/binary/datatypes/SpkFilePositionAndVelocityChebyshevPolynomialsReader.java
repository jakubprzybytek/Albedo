package jp.albedo.jpl.files.binary.datatypes;

import jp.albedo.jpl.JplException;
import jp.albedo.jpl.files.binary.DataType;
import jp.albedo.jpl.files.binary.SpkFileArrayInformation;
import jp.albedo.jpl.files.binary.SpkFileConsts;
import jp.albedo.jpl.files.util.LittleEndianByteBufferReader;
import jp.albedo.jpl.kernel.PositionAndVelocityChebyshevRecord;
import jp.albedo.jpl.kernel.TimeSpan;
import jp.albedo.jpl.kernel.XYZCoefficients;

import java.io.IOException;
import java.nio.MappedByteBuffer;
import java.nio.channels.FileChannel;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Source: https://naif.jpl.nasa.gov/pub/naif/toolkit_docs/C/req/spk.html#Type%203:%20Chebyshev%20(position%20and%20velocity)
 */
public class SpkFilePositionAndVelocityChebyshevPolynomialsReader {

    private final FileChannel fileChannel;

    public SpkFilePositionAndVelocityChebyshevPolynomialsReader(FileChannel fileChannel) {
        this.fileChannel = fileChannel;
    }

    public List<PositionAndVelocityChebyshevRecord> readChebyshevArray(SpkFileArrayInformation arrayInfo, double startEt, double endEt) throws JplException {

        if (arrayInfo.getDataType() != DataType.ChebyshevPositionAndVelocity) {
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

            final int coefficientsNumber = (chebyshevRecordSize - 2) / 6;
            final List<PositionAndVelocityChebyshevRecord> positionAndVelocityChebyshevRecords = new ArrayList<>();

            // get back to beginning of the array
            byteBuffer.position(0);

            for (int i = 0; i < chebyshevRecordNumber; i++) {
                PositionAndVelocityChebyshevRecord positionAndVelocityChebyshevRecord = readChebyshevRecord(leByteBuffer, coefficientsNumber);

                // check if record overlaps with requested time period
                // TODO: make the test inside getChebyshevRecord method so no unnecessary objects are created
                if (startEt <= positionAndVelocityChebyshevRecord.getTimeSpan().getTo() && endEt >= positionAndVelocityChebyshevRecord.getTimeSpan().getFrom()) {
                    positionAndVelocityChebyshevRecords.add(positionAndVelocityChebyshevRecord);
                }
            }

            return positionAndVelocityChebyshevRecords;
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
    private static PositionAndVelocityChebyshevRecord readChebyshevRecord(LittleEndianByteBufferReader byteBuffer, int coefficientsNumber) {
        final double dateMidPoint = byteBuffer.getDouble();
        final double dateRadius = byteBuffer.getDouble();

        final XYZCoefficients positionCoefficients = new XYZCoefficients();
        positionCoefficients.x = byteBuffer.readDoubles(coefficientsNumber);
        positionCoefficients.y = byteBuffer.readDoubles(coefficientsNumber);
        positionCoefficients.z = byteBuffer.readDoubles(coefficientsNumber);

        final XYZCoefficients velocityCoefficients = new XYZCoefficients();
        velocityCoefficients.x = byteBuffer.readDoubles(coefficientsNumber);
        velocityCoefficients.y = byteBuffer.readDoubles(coefficientsNumber);
        velocityCoefficients.z = byteBuffer.readDoubles(coefficientsNumber);

        TimeSpan timeSpan = new TimeSpan(dateMidPoint - dateRadius, dateMidPoint + dateRadius);
        return new PositionAndVelocityChebyshevRecord(timeSpan, positionCoefficients, velocityCoefficients);
    }
}
