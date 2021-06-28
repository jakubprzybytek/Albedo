package jp.albedo.jpl.kernel;

public class PositionChebyshevRecord {

    private final TimeSpan timeSpan;

    private final XYZCoefficients positionCoefficients;

    public PositionChebyshevRecord(TimeSpan timeSpan, XYZCoefficients positionCoefficients) {
        this.timeSpan = timeSpan;
        this.positionCoefficients = positionCoefficients;
    }

    public TimeSpan getTimeSpan() {
        return timeSpan;
    }

    public XYZCoefficients getPositionCoefficients() {
        return positionCoefficients;
    }
}
