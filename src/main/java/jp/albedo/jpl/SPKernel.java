package jp.albedo.jpl;

import jp.albedo.jpl.impl.PositionCalculator;
import jp.albedo.jpl.impl.TimeSpan;
import jp.albedo.jpl.math.XYZCoefficients;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

public class SPKernel {

    final private Map<Constant, Double> constants = new HashMap<>();

    final private Map<JplBody, Map<TimeSpan, XYZCoefficients>> coefficientsMap = new HashMap<>();

    public void addConstants(Map<Constant, Double> newConstants) {
        this.constants.putAll(newConstants);
    }

    public Double getConstant(Constant constant) {
        return this.constants.get(constant);
    }

    void registerBodyCoefficients(JplBody body, Map<TimeSpan, XYZCoefficients> coefficientsByTime) {
        if (!coefficientsMap.containsKey(body)) {
            this.coefficientsMap.put(body, new HashMap<>());
        }
        this.coefficientsMap.get(body).putAll(coefficientsByTime);
    }

    Optional<Map<TimeSpan, XYZCoefficients>> getCoefficientsForBody(JplBody body) {
        return Optional.ofNullable(this.coefficientsMap.get(body));
    }

    /**
     * Creates and returns a PositionCalculator for given body.
     * @param body
     * @return PositionCalculator.
     * @throws JPLException
     */
    public PositionCalculator getPositionCalculatorFor(JplBody body) throws JPLException {
        final Map<TimeSpan, XYZCoefficients> coefficients = getCoefficientsForBody(body)
                .orElseThrow(() -> new JPLException(String.format("No coefficients for %s found in SPKernel", body)));

        return new PositionCalculator(coefficients);
    }

}
