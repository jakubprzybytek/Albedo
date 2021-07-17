package jp.albedo.webapp.comets;

import jp.albedo.common.BodyType;
import jp.albedo.common.ephemeris.Ephemeris;
import jp.albedo.jeanmeeus.topocentric.ObserverLocation;
import jp.albedo.utils.FunctionUtils;
import jp.albedo.webapp.ephemeris.ComputedEphemeris;
import jp.albedo.webapp.ephemeris.EphemeridesOrchestrator;
import jp.albedo.webapp.ephemeris.ParallaxCorrection;
import jp.albedo.webapp.ephemeris.orbitbased.OrbitBasedEphemerisCalculator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class CometsOrchestrator {

    @Autowired
    private OrbitBasedEphemerisCalculator orbitBasedEphemerisCalculator;

    public List<ComputedEphemeris> getBrightComets(Double jde, Double magnitudeLimit, ObserverLocation observerLocation) throws IOException {
        return this.orbitBasedEphemerisCalculator.getSupportedBodiesByType(BodyType.Comet).parallelStream()
                .filter(orbitingBodyRecord -> orbitingBodyRecord.getOrbitElements().isOrbitElliptic())
                .map(FunctionUtils.wrap(cometRecord -> {
                    final List<Ephemeris> ephemerisList = this.orbitBasedEphemerisCalculator.compute(cometRecord, jde, jde, 0.0).stream()
                            .map(ParallaxCorrection.correctFor(observerLocation))
                            .collect(Collectors.toList());
                    return new ComputedEphemeris(cometRecord.getBodyDetails(), ephemerisList, cometRecord.getOrbitElements(), cometRecord.getMagnitudeParameters(), EphemeridesOrchestrator.EphemerisMethod.JeanMeeus.description);
                }))
                .filter(computedEphemerides -> computedEphemerides.getEphemerisList().get(0).apparentMagnitude <= magnitudeLimit)
                .collect(Collectors.toList());
    }

}
