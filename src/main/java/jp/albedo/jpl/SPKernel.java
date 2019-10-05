package jp.albedo.jpl;

import jp.albedo.jpl.impl.TimeSpan;
import jp.albedo.jpl.math.XYZCoefficients;

import java.util.List;
import java.util.Map;

public class SPKernel {

    private Map<Integer, Map<TimeSpan, List<XYZCoefficients>>> coefficientsMap;

    public SPKernel(Map<Integer, Map<TimeSpan, List<XYZCoefficients>>> coefficientsMap) {
        this.coefficientsMap = coefficientsMap;
    }

    public Map<TimeSpan, List<XYZCoefficients>> getCoefficientsForBody(int bodyIndex) {
        return this.coefficientsMap.get(bodyIndex);
    }

}
