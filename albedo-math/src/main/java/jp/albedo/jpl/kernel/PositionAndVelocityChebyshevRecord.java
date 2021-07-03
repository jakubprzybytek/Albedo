package jp.albedo.jpl.kernel;

public class PositionAndVelocityChebyshevRecord extends SpkFileRecord {

    private final XYZCoefficients positionCoefficients;

    private final XYZCoefficients velocityCoefficients;

    public PositionAndVelocityChebyshevRecord(TimeSpan timeSpan, XYZCoefficients positionCoefficients, XYZCoefficients velocityCoefficients) {
        super(timeSpan);
        this.positionCoefficients = positionCoefficients;
        this.velocityCoefficients = velocityCoefficients;
    }

    public XYZCoefficients getPositionCoefficients() {
        return positionCoefficients;
    }

    public XYZCoefficients getVelocityCoefficients() {
        return velocityCoefficients;
    }
}
