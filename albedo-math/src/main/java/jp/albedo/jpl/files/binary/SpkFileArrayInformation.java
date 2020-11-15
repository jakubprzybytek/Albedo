package jp.albedo.jpl.files.binary;

import jp.albedo.jpl.JplBody;

public class SpkFileArrayInformation {

    private final double startDate;

    private final double endDate;

    private final JplBody body;

    private final JplBody centerBody;

    private final ReferenceFrame referenceFrame;

    private final DataType dataType;

    private final int startIndex;

    private final int endIndex;

    public SpkFileArrayInformation(double startDate, double endDate, JplBody body, JplBody centerBody, ReferenceFrame referenceFrame, DataType dataType, int startIndex, int endIndex) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.body = body;
        this.centerBody = centerBody;
        this.referenceFrame = referenceFrame;
        this.dataType = dataType;
        this.startIndex = startIndex;
        this.endIndex = endIndex;
    }

    public double getStartDate() {
        return startDate;
    }

    public double getEndDate() {
        return endDate;
    }

    public JplBody getBody() {
        return body;
    }

    public JplBody getCenterBody() {
        return centerBody;
    }

    public ReferenceFrame getReferenceFrame() {
        return referenceFrame;
    }

    public DataType getDataType() {
        return dataType;
    }

    public int getStartIndex() {
        return startIndex;
    }

    public int getEndIndex() {
        return endIndex;
    }
}
