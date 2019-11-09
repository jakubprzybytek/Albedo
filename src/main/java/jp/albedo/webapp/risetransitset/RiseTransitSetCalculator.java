package jp.albedo.webapp.risetransitset;

import jp.albedo.common.AstronomicalCoordinates;
import jp.albedo.common.SiderealTime;
import jp.albedo.ephemeris.Ephemeris;
import jp.albedo.topographic.GeographicCoordinates;
import jp.albedo.topographic.RiseTransitSet;
import jp.albedo.webapp.ephemeris.ComputedEphemerides;
import jp.albedo.webapp.risetransitset.rest.RiseTransitSetEvent;
import jp.albedo.webapp.risetransitset.rest.RiseTransitSetEventType;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

@Component
public class RiseTransitSetCalculator {

    List<RiseTransitSetEvent> compute(ComputedEphemerides computedEphemerides, GeographicCoordinates observerCoords) {

        final List<RiseTransitSetEvent> riseTransitSetList = new ArrayList<>();

        Ephemeris previousEphemeris = null;
        final LinkedList<AstronomicalCoordinates> coordsTriple = new LinkedList<>();

        for (Ephemeris ephemeris : computedEphemerides.getEphemerides()) {

            coordsTriple.add(ephemeris.coordinates);

            if (coordsTriple.size() >= 3) {
                final double jde = previousEphemeris.jde;
                final double meanGreenwichSiderealTime = SiderealTime.getGreenwichMean(jde); // FixMe: it should be UTC
                RiseTransitSet riseTransitSet = jp.albedo.topographic.RiseTransitSetCalculator.compute(coordsTriple, observerCoords, meanGreenwichSiderealTime, 56.0);
                riseTransitSetList.add(new RiseTransitSetEvent(jde + riseTransitSet.risingTime, computedEphemerides.getBodyDetails(), RiseTransitSetEventType.RAISING));
                riseTransitSetList.add(new RiseTransitSetEvent(jde + riseTransitSet.transitTime, computedEphemerides.getBodyDetails(), RiseTransitSetEventType.TRANSIT));
                riseTransitSetList.add(new RiseTransitSetEvent(jde + riseTransitSet.settingTime, computedEphemerides.getBodyDetails(), RiseTransitSetEventType.SETTING));

                coordsTriple.remove();
            }
            previousEphemeris = ephemeris;
        }

        return riseTransitSetList;
    }

}
