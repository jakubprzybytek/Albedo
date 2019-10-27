package jp.albedo.jpl;

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

    public void registerBodyCoefficients(JplBody body, Map<TimeSpan, XYZCoefficients> coefficientsByTime) {
        if (!coefficientsMap.containsKey(body)) {
            this.coefficientsMap.put(body, new HashMap<>());
        }
        this.coefficientsMap.get(body).putAll(coefficientsByTime);
    }

    public Optional<Map<TimeSpan, XYZCoefficients>> getCoefficientsForBody(JplBody body) {
        return Optional.ofNullable(this.coefficientsMap.get(body));
    }

}
