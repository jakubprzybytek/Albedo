package jp.albedo.webapp.comets;

import jp.albedo.common.BodyType;
import jp.albedo.ephemeris.Ephemeris;
import jp.albedo.jeanmeeus.topocentric.ObserverLocation;
import jp.albedo.webapp.ephemeris.ComputedEphemeris;
import jp.albedo.webapp.ephemeris.EphemeridesOrchestrator;
import jp.albedo.webapp.ephemeris.EphemerisException;
import jp.albedo.webapp.ephemeris.EphemerisMethod;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CometsOrchestrator {

    @Autowired
    private EphemeridesOrchestrator ephemeridesOrchestrator;

    public List<ComputedEphemeris<Ephemeris>> getBrightComets(Double jde, Double magnitudeLimit, ObserverLocation observerLocation) throws EphemerisException {
        return ephemeridesOrchestrator.computeAllByType(BodyType.Comet, jde, jde, 0.0, observerLocation, EphemerisMethod.JeanMeeus.id);
    }

}
