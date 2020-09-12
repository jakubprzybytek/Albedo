package jp.albedo.jeanmeeus.math;

public class Interpolation {

    public static double interpolate(double[] values, double interpolatingFactor) {
        final double a = values[1] - values[0];
        final double b = values[2] - values[1];
        final double c = b - a;
        return values[1] + interpolatingFactor * (a + b + interpolatingFactor * c) / 2.0;
    }

}
