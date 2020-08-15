package jp.albedo.webapp.risetransitset;

import jp.albedo.common.AstronomicalCoordinates;
import jp.albedo.common.BodyInformation;
import jp.albedo.common.ephemeris.Ephemeris;
import jp.albedo.jeanmeeus.sidereal.SiderealTime;
import jp.albedo.jeanmeeus.topocentric.GeographicCoordinates;
import jp.albedo.jeanmeeus.topocentric.RiseSet;
import jp.albedo.jeanmeeus.topocentric.RiseTransitSetEventCalculator;
import jp.albedo.jeanmeeus.topocentric.Transit;
import jp.albedo.webapp.ephemeris.ComputedEphemeris;
import jp.albedo.webapp.risetransitset.rest.RiseTransitSetEvent;
import jp.albedo.webapp.risetransitset.rest.RiseTransitSetEventType;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

@Component
class RiseTransitSetCalculator {

    List<RiseTransitSetEvent> compute(String bodyName, ComputedEphemeris computedEphemeris, GeographicCoordinates observerCoords) {

        final List<RiseTransitSetEvent> riseTransitSetList = new ArrayList<>();

        Ephemeris previousEphemeris = null;
        final LinkedList<AstronomicalCoordinates> coordsTriple = new LinkedList<>();

        for (Ephemeris ephemeris : computedEphemeris.getEphemerisList()) {

            coordsTriple.add(ephemeris.coordinates);

            if (coordsTriple.size() >= 3) {
                final double jde = previousEphemeris.jde;
                final double meanGreenwichSiderealTime = SiderealTime.getGreenwichMean(jde); // FixMe: it should be UTC
                final RiseTransitSetEventCalculator rtsEventCalculator = new RiseTransitSetEventCalculator(coordsTriple, observerCoords, meanGreenwichSiderealTime, 56.0);

                final Transit transit = rtsEventCalculator.computeTransitTime();
                riseTransitSetList.add(RiseTransitSetEvent.forTransit(jde + transit.time, computedEphemeris.getBodyDetails(), transit.altitude));

                RiseSet mainRiseSet;
                if (BodyInformation.Moon.name().equals(bodyName)) {
                    mainRiseSet = rtsEventCalculator.computeRiseAndSetTime(RiseTransitSetEventCalculator.RISE_AND_SET_ALTITUDE_FOR_MOON);
                } else if (BodyInformation.Sun.name().equals(bodyName)) {
                    mainRiseSet = rtsEventCalculator.computeRiseAndSetTime(RiseTransitSetEventCalculator.RISE_AND_SET_ALTITUDE_FOR_SUN);
                } else {
                    mainRiseSet = rtsEventCalculator.computeRiseAndSetTime(RiseTransitSetEventCalculator.RISE_AND_SET_ALTITUDE_FOR_SMALL_BODIES);
                }
                riseTransitSetList.add(RiseTransitSetEvent.forRiseAndSet(jde + mainRiseSet.risingTime, computedEphemeris.getBodyDetails(), RiseTransitSetEventType.Raising, mainRiseSet.risingAzimuth));
                riseTransitSetList.add(RiseTransitSetEvent.forRiseAndSet(jde + mainRiseSet.settingTime, computedEphemeris.getBodyDetails(), RiseTransitSetEventType.Setting, mainRiseSet.settingAzimuth));

                if (BodyInformation.Sun.name().equals(bodyName)) {
                    final RiseSet civilRiseSet = rtsEventCalculator.computeRiseAndSetTime(RiseTransitSetEventCalculator.CIVIL_DAWN_AND_DUSK_ALTITUDE_FOR_SUN);
                    riseTransitSetList.add(RiseTransitSetEvent.forRiseAndSet(jde + civilRiseSet.risingTime, computedEphemeris.getBodyDetails(), RiseTransitSetEventType.CivilDawn));
                    riseTransitSetList.add(RiseTransitSetEvent.forRiseAndSet(jde + civilRiseSet.settingTime, computedEphemeris.getBodyDetails(), RiseTransitSetEventType.CivilDusk));

                    final RiseSet nauticalRiseSet = rtsEventCalculator.computeRiseAndSetTime(RiseTransitSetEventCalculator.NAUTICAL_DAWN_AND_DUSK_ALTITUDE_FOR_SUN);
                    riseTransitSetList.add(RiseTransitSetEvent.forRiseAndSet(jde + nauticalRiseSet.risingTime, computedEphemeris.getBodyDetails(), RiseTransitSetEventType.NauticalDawn));
                    riseTransitSetList.add(RiseTransitSetEvent.forRiseAndSet(jde + nauticalRiseSet.settingTime, computedEphemeris.getBodyDetails(), RiseTransitSetEventType.NauticalDusk));

                    final RiseSet astronomicalRiseSet = rtsEventCalculator.computeRiseAndSetTime(RiseTransitSetEventCalculator.ASTRONOMICAL_DAWN_AND_DUSK_ALTITUDE_FOR_SUN);
                    riseTransitSetList.add(RiseTransitSetEvent.forRiseAndSet(jde + astronomicalRiseSet.risingTime, computedEphemeris.getBodyDetails(), RiseTransitSetEventType.AstronomicalDawn));
                    riseTransitSetList.add(RiseTransitSetEvent.forRiseAndSet(jde + astronomicalRiseSet.settingTime, computedEphemeris.getBodyDetails(), RiseTransitSetEventType.AstronomicalDusk));
                }

                coordsTriple.remove();
            }
            previousEphemeris = ephemeris;
        }

        return riseTransitSetList;
    }

}
