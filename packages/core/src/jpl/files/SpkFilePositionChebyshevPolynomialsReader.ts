import { readSync } from 'node:fs';
import { XYZCoefficients, TimeSpan, PositionChebyshevRecord } from '../kernel';
import { SpkFileArrayInformation, LittleEndianByteBufferReader, DataType, SPK_DOUBLE_SIZE } from '.';
/**
 * Source: https://naif.jpl.nasa.gov/pub/naif/toolkit_docs/C/req/spk.html#Type%203:%20Chebyshev%20(position%20and%20velocity)
 */
export function readSpkPositionChebyshevPolynomials(fd: number, arrayInfo: SpkFileArrayInformation, startEt: number, endEt: number): PositionChebyshevRecord[] {

    if (arrayInfo.dataType !== DataType.ChebyshevPosition) {
        throw Error(`Unsupported data type id: ${arrayInfo.dataType}`);
    }

    if (startEt > arrayInfo.endDate || endEt < arrayInfo.startDate) {
        return [];
    }

    const position = arrayInfo.startIndex * SPK_DOUBLE_SIZE;
    const bufferSize = (arrayInfo.endIndex - arrayInfo.startIndex + 1) * SPK_DOUBLE_SIZE;

    const buffer = new Uint8Array(bufferSize);
    readSync(fd, buffer, 0, bufferSize, position);
    const reader = new LittleEndianByteBufferReader(buffer);

    // lookup array details - they are at the end
    reader.position(bufferSize - 2 * SPK_DOUBLE_SIZE);
    const chebyshevRecordSize = Math.floor(reader.getDouble());
    const chebyshevRecordNumber = Math.floor(reader.getDouble());

    const coefficientsNumber = Math.floor((chebyshevRecordSize - 2) / 3);
    const positionChebyshevRecords: PositionChebyshevRecord[] = [];

    // get back to beginning of the array
    reader.position(0);

    for (let i = 0; i < chebyshevRecordNumber; i++) {
        const positionChebyshevRecord = readChebyshevRecord(reader, coefficientsNumber);

        // check if record overlaps with requested time period
        // TODO: make the test inside getChebyshevRecord method so no unnecessary objects are created
        if (startEt <= positionChebyshevRecord.timeSpan.to && endEt >= positionChebyshevRecord.timeSpan.from) {
            positionChebyshevRecords.push(positionChebyshevRecord);
        }
    }

    return positionChebyshevRecords;
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
function readChebyshevRecord(byteBuffer: LittleEndianByteBufferReader, coefficientsNumber: number): PositionChebyshevRecord {
    const dateMidPoint = byteBuffer.getDouble();
    const dateRadius = byteBuffer.getDouble();

    const positionCoefficients: XYZCoefficients = {
        x: byteBuffer.readDoubles(coefficientsNumber),
        y: byteBuffer.readDoubles(coefficientsNumber),
        z: byteBuffer.readDoubles(coefficientsNumber)
    }

    const timeSpan = new TimeSpan(dateMidPoint - dateRadius, dateMidPoint + dateRadius);
    return { timeSpan, positionCoefficients };
}
