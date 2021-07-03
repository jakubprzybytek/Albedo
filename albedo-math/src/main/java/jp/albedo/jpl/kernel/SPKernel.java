package jp.albedo.jpl.kernel;

import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplConstantEnum;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.state.impl.chebyshev.PositionCalculator;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Deprecated
public class SPKernel {

    final private Map<JplConstantEnum, Double> constants = new HashMap<>();

    final private Map<JplBody, List<PositionChebyshevRecord>> coefficientsMap = new HashMap<>();

    public void addConstants(Map<JplConstantEnum, Double> newConstants) {
        this.constants.putAll(newConstants);
    }

    public Double getConstant(JplConstantEnum constant) {
        return this.constants.get(constant);
    }

    public void registerBodyCoefficients(JplBody body, List<PositionChebyshevRecord> positionChebyshevRecords) {
        if (!coefficientsMap.containsKey(body)) {
            this.coefficientsMap.put(body, new ArrayList<>());
        }
        this.coefficientsMap.get(body).addAll(positionChebyshevRecords);
    }

    Optional<List<PositionChebyshevRecord>> getCoefficientsForBody(JplBody body) {
        return Optional.ofNullable(this.coefficientsMap.get(body));
    }

    /**
     * Creates and returns a PositionCalculator for given body.
     *
     * @param body
     * @return PositionCalculator.
     * @throws JplException
     */
    public PositionCalculator getPositionCalculatorFor(JplBody body) throws JplException {
        final List<PositionChebyshevRecord> positionChebyshevRecords = getCoefficientsForBody(body)
                .orElseThrow(() -> new JplException(String.format("No coefficients for %s found in SPKernel", body)));

        return new PositionCalculator(positionChebyshevRecords);
    }

}
