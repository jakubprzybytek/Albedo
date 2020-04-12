package jp.albedo.jpl.files.impl;

public class AsciiFileBodyCoefficientDescriptor {

    private int startIndex;

    private int coefficientNumber;

    private int setsNumber;

    public AsciiFileBodyCoefficientDescriptor(int startIndex, int coefficientNumber, int setsNumber) {
        this.startIndex = startIndex;
        this.coefficientNumber = coefficientNumber;
        this.setsNumber = setsNumber;
    }

    public int getStartIndex() {
        return startIndex;
    }

    public int getCoefficientNumber() {
        return coefficientNumber;
    }

    public int getSetsNumber() {
        return setsNumber;
    }
}
