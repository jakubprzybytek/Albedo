package jp.albedo.jpl.math;

public class ChebyshevPolynomialExpander {

    private double[] coefficients;

    public ChebyshevPolynomialExpander(double[] coefficients) {
        this.coefficients = coefficients;
    }

    public double computeFor(double x) {
        double value = 0.0;
        for (int i = 0; i < this.coefficients.length; i++) {
            value += this.coefficients[i] * getT(x, i);
        }
        return value;
    }

    private double getT(double x, int n) {
        return (n == 0) ? 1 : (n == 1) ? x : 2 * x * getT(x, n - 1) - getT(x, n - 2);
    }

}
