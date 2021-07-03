package jp.albedo.jpl.kernel;

public class PositionChebyshevRecord extends SpkFileRecord {

    private final XYZCoefficients positionCoefficients;

    public PositionChebyshevRecord(TimeSpan timeSpan, XYZCoefficients positionCoefficients) {
        super(timeSpan);
        this.positionCoefficients = positionCoefficients;
    }

    public XYZCoefficients getPositionCoefficients() {
        return positionCoefficients;
    }
}
