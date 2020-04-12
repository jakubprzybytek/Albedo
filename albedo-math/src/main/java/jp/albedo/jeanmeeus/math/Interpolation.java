package jp.albedo.jeanmeeus.math;

import java.util.List;

public class Interpolation {

    public static double interpolate(List<Double> values, double interpolatingFactor) {
        final double a = values.get(1) - values.get(0);
        final double b = values.get(2) - values.get(1);
        final double c = b - a;
        return values.get(1) + interpolatingFactor * (a + b + interpolatingFactor * c) / 2.0;
    }

}
