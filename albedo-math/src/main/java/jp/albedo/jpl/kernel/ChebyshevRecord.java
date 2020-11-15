package jp.albedo.jpl.kernel;

public class ChebyshevRecord {

    private final TimeSpan timeSpan;

    private final XYZCoefficients coefficients;

    public ChebyshevRecord(TimeSpan timeSpan, XYZCoefficients coefficients) {
        this.timeSpan = timeSpan;
        this.coefficients = coefficients;
    }

    public TimeSpan getTimeSpan() {
        return timeSpan;
    }

    public XYZCoefficients getCoefficients() {
        return coefficients;
    }
}
