package jp.albedo.utils;

public class Polynomial {

    public static double compute(double variable, double c0, double c1, double c2, double c3) {
        double variablePower = variable;
        double value = c0 + variablePower * c1;
        variablePower *= variable;
        value += variablePower * c2;
        variablePower *= variable;
        return value + variablePower * c3;
    }

}
