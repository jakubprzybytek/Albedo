package jp.albedo.jpl.files.binary;

public class SpkFileDescriptor {

    private final String architecture;

    private final int fileRecordDoublesNumber;

    private final int fileRecordIntegersNumber;

    private final String fileName;

    private final int firstArrayInformationBlockIndex;

    private final int lastArrayInformationBlockIndex;

    private final int freeDoubleIndex;

    public SpkFileDescriptor(String architecture, int fileRecordDoublesNumber, int fileRecordIntegersNumber, String fileName, int firstArrayInformationBlockIndex, int lastArrayInformationBlockIndex, int freeDoubleIndex) {
        this.architecture = architecture;
        this.fileRecordDoublesNumber = fileRecordDoublesNumber;
        this.fileRecordIntegersNumber = fileRecordIntegersNumber;
        this.fileName = fileName;
        this.firstArrayInformationBlockIndex = firstArrayInformationBlockIndex;
        this.lastArrayInformationBlockIndex = lastArrayInformationBlockIndex;
        this.freeDoubleIndex = freeDoubleIndex;
    }

    public String getArchitecture() {
        return architecture;
    }

    public int getFileRecordDoublesNumber() {
        return fileRecordDoublesNumber;
    }

    public int getFileRecordIntegersNumber() {
        return fileRecordIntegersNumber;
    }

    public String getFileName() {
        return fileName;
    }

    public int getFirstArrayInformationBlockIndex() {
        return firstArrayInformationBlockIndex;
    }

    public int getLastArrayInformationBlockIndex() {
        return lastArrayInformationBlockIndex;
    }

    public int getFreeDoubleIndex() {
        return freeDoubleIndex;
    }
}
