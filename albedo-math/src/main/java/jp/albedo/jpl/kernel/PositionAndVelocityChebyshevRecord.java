package jp.albedo.jpl.kernel;

public class PositionAndVelocityChebyshevRecord {

    private final TimeSpan timeSpan;

    private final XYZCoefficients positionCoefficients;

    private final XYZCoefficients velocityCoefficients;

    public PositionAndVelocityChebyshevRecord(TimeSpan timeSpan, XYZCoefficients positionCoefficients, XYZCoefficients velocityCoefficients) {
        this.timeSpan = timeSpan;
        this.positionCoefficients = positionCoefficients;
        this.velocityCoefficients = velocityCoefficients;
    }

    public TimeSpan getTimeSpan() {
        return timeSpan;
    }

    public XYZCoefficients getPositionCoefficients() {
        return positionCoefficients;
    }

    public XYZCoefficients getVelocityCoefficients() {
        return velocityCoefficients;
    }
}
