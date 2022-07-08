import { readSync } from 'node:fs';
import { JplBodyId, jplBodyFromId } from "../";
import { SpkFileDescriptor, SpkFileArrayInformation, LittleEndianByteBufferReader, FileArchitecture, dataTypeFromId, referenceFrameFromId, FILE_BLOCK_SIZE, FILE_DESCRIPTOR_SIZE } from "./";

export class SpkFileInformationReader {

    readonly fd: number;

    constructor(fd: number) {
        this.fd = fd;
    }

    /**
     * Returns information about records in given SPK file. It actually starts reading the file
     * to get information about content of the file but it stops there, i.e. it doesn't read actual array data.
     *
     * @return List of record information.
     * @throws JplException If the file cannot be read properly.
     */
    readArraysInformation() {
        this.lookupFileContent();
    }

    private lookupFileContent() {
        const descriptorBuffer = new Uint8Array(FILE_DESCRIPTOR_SIZE);
        readSync(this.fd, descriptorBuffer, 0, FILE_DESCRIPTOR_SIZE, null);
        const descriptorByteReader = new LittleEndianByteBufferReader(descriptorBuffer);

        const descriptor = this.readFileDescriptor(descriptorByteReader);
        if (FileArchitecture.DAF_SPK !== descriptor.architecture) {
            throw Error("Unsupported file architecture: " + descriptor.architecture);
        }

        if (descriptor.fileRecordDoublesNumber != 2 || descriptor.fileRecordIntegersNumber != 6) {
            throw Error("Unsupported file records format: ND=" + descriptor.fileRecordDoublesNumber + ", NI=" + descriptor.fileRecordIntegersNumber);
        }

        if (descriptor.firstArrayInformationBlockIndex != descriptor.lastArrayInformationBlockIndex) {
            throw Error("Unsupported file structure: first file record index != last file record index");
        }
        console.log(descriptor.architecture);
        console.log(descriptor.fileName);
        console.log(descriptor.fileRecordDoublesNumber);
        console.log(descriptor.firstArrayInformationBlockIndex);

        // go to first array information record
        const arrayInformationBuffer = new Uint8Array(FILE_BLOCK_SIZE);
        const arrayInformationPosition = descriptor.firstArrayInformationBlockIndex * FILE_BLOCK_SIZE;
        readSync(this.fd, arrayInformationBuffer, 0, FILE_BLOCK_SIZE, arrayInformationPosition);
        const arrayInformationByteReader = new LittleEndianByteBufferReader(arrayInformationBuffer);

        arrayInformationByteReader.readDoubles(2); // skip first and last index
        const numberOfRecords = arrayInformationByteReader.getDouble();

        //arrayInformationList = new ArrayList<>();

        for (let i = 0; i < numberOfRecords; i++) {
            const spkFileArrayInformation = this.readFileArrayInformation(arrayInformationByteReader);
            console.log(`${spkFileArrayInformation.body.name} w.r.t. ${spkFileArrayInformation.centerBody.name}`);
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
    private readFileDescriptor(byteBuffer: LittleEndianByteBufferReader): SpkFileDescriptor {
        return {
            architecture: byteBuffer.getString(8).trim(),
            fileRecordDoublesNumber: byteBuffer.getInt(),
            fileRecordIntegersNumber: byteBuffer.getInt(),
            fileName: byteBuffer.getString(60).trim(),
            firstArrayInformationBlockIndex: byteBuffer.getInt() - 1, // '-1' to convert to 0-based index
            lastArrayInformationBlockIndex: byteBuffer.getInt() - 1,
            freeDoubleIndex: byteBuffer.getInt()
        }
    }

    private readFileArrayInformation(byteBuffer: LittleEndianByteBufferReader): SpkFileArrayInformation {
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
}
