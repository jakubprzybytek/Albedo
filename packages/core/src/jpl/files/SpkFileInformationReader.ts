import { readSync } from 'node:fs';
import { jplBodyFromId } from "../";
import { SpkFileDescriptor, SpkFileArrayInformation, LittleEndianByteBufferReader, FileArchitecture, dataTypeFromId, referenceFrameFromId, FILE_BLOCK_SIZE, FILE_DESCRIPTOR_SIZE } from "./";

type SpkFileInformationType = {
    spkFileDescriptor: SpkFileDescriptor;
    spkFileArrayInformationList: SpkFileArrayInformation[];
}

// https://naif.jpl.nasa.gov/pub/naif/toolkit_docs/C/req/spk.html#Type%203:%20Chebyshev%20(position%20and%20velocity)
export function readSpkFileInformation(fd: number): SpkFileInformationType {
    const descriptorBuffer = new Uint8Array(FILE_DESCRIPTOR_SIZE);
    readSync(fd, descriptorBuffer, 0, FILE_DESCRIPTOR_SIZE, null);
    const descriptorByteReader = new LittleEndianByteBufferReader(descriptorBuffer);

    const descriptor = readFileDescriptor(descriptorByteReader);
    if (FileArchitecture.DAF_SPK !== descriptor.architecture) {
        throw Error("Unsupported file architecture: " + descriptor.architecture);
    }

    if (descriptor.fileRecordDoublesNumber != 2 || descriptor.fileRecordIntegersNumber != 6) {
        throw Error("Unsupported file records format: ND=" + descriptor.fileRecordDoublesNumber + ", NI=" + descriptor.fileRecordIntegersNumber);
    }

    // if (descriptor.firstArrayInformationBlockIndex != descriptor.lastArrayInformationBlockIndex) {
    //     throw Error(`Unsupported file structure: first file record index (${descriptor.firstArrayInformationBlockIndex})`
    //         + ` != last (${descriptor.lastArrayInformationBlockIndex}) file record index`);
    // }

    // go to first array information record
    const arrayInformationBuffer = new Uint8Array(FILE_BLOCK_SIZE);
    const arrayInformationList: SpkFileArrayInformation[] = [];

    let arrayInformationBlockIndex = descriptor.firstArrayInformationBlockIndex;

    do {
        const arrayInformationPosition = arrayInformationBlockIndex * FILE_BLOCK_SIZE;
        readSync(fd, arrayInformationBuffer, 0, FILE_BLOCK_SIZE, arrayInformationPosition);
        const arrayInformationByteReader = new LittleEndianByteBufferReader(arrayInformationBuffer);

        arrayInformationBlockIndex = arrayInformationByteReader.getDouble() - 1;
        arrayInformationByteReader.getDouble(); // skip data

        const numberOfRecords = arrayInformationByteReader.getDouble();

        for (let i = 0; i < numberOfRecords; i++) {
            const spkFileArrayInformation = readFileArrayInformation(arrayInformationByteReader);
            arrayInformationList.push(spkFileArrayInformation);
        }
    } while (arrayInformationBlockIndex > 0);

    return {
        spkFileDescriptor: descriptor,
        spkFileArrayInformationList: arrayInformationList
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
function readFileDescriptor(byteBuffer: LittleEndianByteBufferReader): SpkFileDescriptor {
    return {
        architecture: byteBuffer.getString(8).trim(),
        fileRecordDoublesNumber: byteBuffer.getInt(),
        fileRecordIntegersNumber: byteBuffer.getInt(),
        fileName: byteBuffer.getString(60).trim(),
        firstArrayInformationBlockIndex: byteBuffer.getInt() - 1, // '-1' to convert to 0-based index
        lastArrayInformationBlockIndex: byteBuffer.getInt() - 1,
        freeDoubleIndex: byteBuffer.getInt() - 1
    }
}

function readFileArrayInformation(byteBuffer: LittleEndianByteBufferReader): SpkFileArrayInformation {
    const startDate = byteBuffer.getDouble();
    const endDate = byteBuffer.getDouble();

    const bodyId = byteBuffer.getInt();
    const body = jplBodyFromId(bodyId);
    if (body === undefined) {
        throw Error('Cannot parse JplBody id: ' + bodyId);
    }

    const centerBodyId = byteBuffer.getInt();
    const centerBody = jplBodyFromId(centerBodyId);
    if (centerBody === undefined) {
        throw Error('Cannot parse JplBody id: ' + centerBodyId);
    }

    const referenceFrameId = byteBuffer.getInt();
    const referenceFrame = referenceFrameFromId(referenceFrameId);
    if (referenceFrame === undefined) {
        throw Error('Cannot parse reference frame id: ' + referenceFrameId);
    }

    const dataTypeId = byteBuffer.getInt();
    const dataType = dataTypeFromId(dataTypeId);
    if (dataType === undefined) {
        throw Error('Cannot parse data type id: ' + dataTypeId);
    }

    const startIndex = byteBuffer.getInt() - 1; // '-1' to convert to 0-based index
    const endIndex = byteBuffer.getInt() - 1;

    return {
        startDate,
        endDate,
        body,
        centerBody,
        referenceFrame,
        dataType,
        startIndex,
        endIndex
    }
}
