package jp.albedo.jpl.files.ascii;

public class AsciiFileBodyCoefficientDescriptor {

    private final int startIndex;

    private final int coefficientNumber;

    private final int setsNumber;

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
