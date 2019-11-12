package jp.albedo.webapp.risetransitset;

import jp.albedo.common.AstronomicalCoordinates;
import jp.albedo.common.SiderealTime;
import jp.albedo.jeanmeeus.ephemeris.Ephemeris;
import jp.albedo.jeanmeeus.topocentric.GeographicCoordinates;
import jp.albedo.jeanmeeus.topocentric.RiseSet;
import jp.albedo.jeanmeeus.topocentric.RiseTransitSetEventCalculator;
import jp.albedo.webapp.ephemeris.ComputedEphemerides;
import jp.albedo.webapp.risetransitset.rest.RiseTransitSetEvent;
import jp.albedo.webapp.risetransitset.rest.RiseTransitSetEventType;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

@Component
class RiseTransitSetCalculator {

    List<RiseTransitSetEvent> compute(String bodyName, ComputedEphemerides computedEphemerides, GeographicCoordinates observerCoords) {

        final List<RiseTransitSetEvent> riseTransitSetList = new ArrayList<>();

        Ephemeris previousEphemeris = null;
        final LinkedList<AstronomicalCoordinates> coordsTriple = new LinkedList<>();

        for (Ephemeris ephemeris : computedEphemerides.getEphemerides()) {

            coordsTriple.add(ephemeris.coordinates);

            if (coordsTriple.size() >= 3) {
                final double jde = previousEphemeris.jde;
                final double meanGreenwichSiderealTime = SiderealTime.getGreenwichMean(jde); // FixMe: it should be UTC
                final RiseTransitSetEventCalculator rtsEventCalculator = new RiseTransitSetEventCalculator(coordsTriple, observerCoords, meanGreenwichSiderealTime, 56.0);
                riseTransitSetList.add(new RiseTransitSetEvent(jde + rtsEventCalculator.computeTransitTime(), computedEphemerides.getBodyDetails(), RiseTransitSetEventType.TRANSIT));

                final RiseSet riseSet = rtsEventCalculator.computeRiseAndSetTime(RiseTransitSetEventCalculator.RISE_AND_SET_ALTITUDE_FOR_PLANETS);
                riseTransitSetList.add(new RiseTransitSetEvent(jde + riseSet.risingTime, computedEphemerides.getBodyDetails(), RiseTransitSetEventType.RAISING));
                riseTransitSetList.add(new RiseTransitSetEvent(jde + riseSet.settingTime, computedEphemerides.getBodyDetails(), RiseTransitSetEventType.SETTING));

                coordsTriple.remove();
            }
            previousEphemeris = ephemeris;
        }

        return riseTransitSetList;
    }

}
