package jp.albedo.jpl;

import jp.albedo.jpl.impl.TimeSpan;
import jp.albedo.jpl.math.XYZCoefficients;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public class SPKernel {

    private Map<Body, Map<TimeSpan, List<XYZCoefficients>>> coefficientsMap = new HashMap<>();

    public void registerBodyCoefficients(Body body, Map<TimeSpan, List<XYZCoefficients>> coefficientsByTime) {
        if (!coefficientsMap.containsKey(body)) {
            this.coefficientsMap.put(body, new HashMap<>());
        }
        this.coefficientsMap.get(body).putAll(coefficientsByTime);
    }

    public Optional<Map<TimeSpan, List<XYZCoefficients>>> getCoefficientsForBody(Body body) {
        return Optional.ofNullable(this.coefficientsMap.get(body));
    }

}
