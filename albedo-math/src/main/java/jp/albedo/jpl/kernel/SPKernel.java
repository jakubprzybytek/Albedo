package jp.albedo.jpl.kernel;

import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplConstant;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.state.impl.PositionCalculator;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public class SPKernel {

    final private Map<JplConstant, Double> constants = new HashMap<>();

    final private Map<JplBody, List<ChebyshevRecord>> coefficientsMap = new HashMap<>();

    public void addConstants(Map<JplConstant, Double> newConstants) {
        this.constants.putAll(newConstants);
    }

    public Double getConstant(JplConstant constant) {
        return this.constants.get(constant);
    }

    public void registerBodyCoefficients(JplBody body, List<ChebyshevRecord> chebyshevRecords) {
        if (!coefficientsMap.containsKey(body)) {
            this.coefficientsMap.put(body, new ArrayList<>());
        }
        this.coefficientsMap.get(body).addAll(chebyshevRecords);
    }

    Optional<List<ChebyshevRecord>> getCoefficientsForBody(JplBody body) {
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
        final List<ChebyshevRecord> chebyshevRecords = getCoefficientsForBody(body)
                .orElseThrow(() -> new JplException(String.format("No coefficients for %s found in SPKernel", body)));

        return new PositionCalculator(chebyshevRecords);
    }

}
