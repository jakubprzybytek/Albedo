package jp.albedo.webapp.events.risetransitset;

import jp.albedo.common.AstronomicalCoordinates;
import jp.albedo.common.BodyDetails;
import jp.albedo.common.BodyInformation;
import jp.albedo.ephemeris.Ephemeris;
import jp.albedo.jeanmeeus.sidereal.SiderealTime;
import jp.albedo.jeanmeeus.topocentric.GeographicCoordinates;
import jp.albedo.jeanmeeus.topocentric.RiseSet;
import jp.albedo.jeanmeeus.topocentric.RiseTransitSetEventCalculator;
import jp.albedo.jeanmeeus.topocentric.Transit;
import jp.albedo.webapp.ephemeris.ComputedEphemeris;
import jp.albedo.webapp.events.risetransitset.rest.RiseTransitSetEvent;
import jp.albedo.webapp.events.risetransitset.rest.RiseTransitSetEventType;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

@Component
public class RiseTransitSetCalculator {

    public List<RiseTransitSetEvent> computeEvents(String bodyName, ComputedEphemeris<Ephemeris> computedEphemeris, GeographicCoordinates observerCoords) {

        final List<RiseTransitSetEvent> riseTransitSetList = new ArrayList<>();
        final BodyDetails bodyDetails = computedEphemeris.getBodyDetails();

        Ephemeris previousEphemeris = null;
        final LinkedList<AstronomicalCoordinates> coordsTriple = new LinkedList<>();

        for (Ephemeris ephemeris : computedEphemeris.getEphemerisList()) {

            coordsTriple.add(ephemeris.coordinates);

            if (coordsTriple.size() >= 3) {
                final double jde = previousEphemeris.jde;
                final double meanGreenwichSiderealTime = SiderealTime.getGreenwichMean(jde); // FixMe: it should be UTC
                final RiseTransitSetEventCalculator rtsEventCalculator = new RiseTransitSetEventCalculator(coordsTriple, observerCoords, meanGreenwichSiderealTime, 56.0);

                final Transit transit = rtsEventCalculator.computeTransit();
                riseTransitSetList.add(RiseTransitSetEvent.forTransit(jde + transit.time, bodyDetails, transit.altitude));

                RiseSet mainRiseSet;
                if (BodyInformation.Moon.name().equals(bodyName)) {
                    mainRiseSet = rtsEventCalculator.computeRiseAndSet(RiseTransitSetEventCalculator.RISE_AND_SET_ALTITUDE_FOR_MOON);
                } else if (BodyInformation.Sun.name().equals(bodyName)) {
                    mainRiseSet = rtsEventCalculator.computeRiseAndSet(RiseTransitSetEventCalculator.RISE_AND_SET_ALTITUDE_FOR_SUN);
                } else {
                    mainRiseSet = rtsEventCalculator.computeRiseAndSet(RiseTransitSetEventCalculator.RISE_AND_SET_ALTITUDE_FOR_SMALL_BODIES);
                }
                riseTransitSetList.add(RiseTransitSetEvent.forRiseAndSet(jde + mainRiseSet.risingTime, bodyDetails, RiseTransitSetEventType.Rising, mainRiseSet.risingAzimuth));
                riseTransitSetList.add(RiseTransitSetEvent.forRiseAndSet(jde + mainRiseSet.settingTime, bodyDetails, RiseTransitSetEventType.Setting, mainRiseSet.settingAzimuth));

                if (BodyInformation.Sun.name().equals(bodyName)) {
                    final RiseSet civilRiseSet = rtsEventCalculator.computeRiseAndSet(RiseTransitSetEventCalculator.CIVIL_DAWN_AND_DUSK_ALTITUDE_FOR_SUN);
                    riseTransitSetList.add(RiseTransitSetEvent.forRiseAndSet(jde + civilRiseSet.risingTime, bodyDetails, RiseTransitSetEventType.CivilDawn));
                    riseTransitSetList.add(RiseTransitSetEvent.forRiseAndSet(jde + civilRiseSet.settingTime, bodyDetails, RiseTransitSetEventType.CivilDusk));

                    final RiseSet nauticalRiseSet = rtsEventCalculator.computeRiseAndSet(RiseTransitSetEventCalculator.NAUTICAL_DAWN_AND_DUSK_ALTITUDE_FOR_SUN);
                    riseTransitSetList.add(RiseTransitSetEvent.forRiseAndSet(jde + nauticalRiseSet.risingTime, bodyDetails, RiseTransitSetEventType.NauticalDawn));
                    riseTransitSetList.add(RiseTransitSetEvent.forRiseAndSet(jde + nauticalRiseSet.settingTime, bodyDetails, RiseTransitSetEventType.NauticalDusk));

                    final RiseSet astronomicalRiseSet = rtsEventCalculator.computeRiseAndSet(RiseTransitSetEventCalculator.ASTRONOMICAL_DAWN_AND_DUSK_ALTITUDE_FOR_SUN);
                    riseTransitSetList.add(RiseTransitSetEvent.forRiseAndSet(jde + astronomicalRiseSet.risingTime, bodyDetails, RiseTransitSetEventType.AstronomicalDawn));
                    riseTransitSetList.add(RiseTransitSetEvent.forRiseAndSet(jde + astronomicalRiseSet.settingTime, bodyDetails, RiseTransitSetEventType.AstronomicalDusk));
                }

                coordsTriple.remove();
            }
            previousEphemeris = ephemeris;
        }

        return riseTransitSetList;
    }

    public List<Double> computeRecords(String bodyName, ComputedEphemeris<Ephemeris> computedEphemeris, GeographicCoordinates observerCoords) {

        final List<Double> transitsList = new ArrayList<>();
        final BodyDetails bodyDetails = computedEphemeris.getBodyDetails();

        Ephemeris previousEphemeris = null;
        final LinkedList<AstronomicalCoordinates> coordsTriple = new LinkedList<>();

        for (Ephemeris ephemeris : computedEphemeris.getEphemerisList()) {

            coordsTriple.add(ephemeris.coordinates);

            if (coordsTriple.size() >= 3) {
                final double jde = previousEphemeris.jde;
                final double meanGreenwichSiderealTime = SiderealTime.getGreenwichMean(jde); // FixMe: it should be UTC
                final RiseTransitSetEventCalculator rtsEventCalculator = new RiseTransitSetEventCalculator(coordsTriple, observerCoords, meanGreenwichSiderealTime, 56.0);

                final Transit transit = rtsEventCalculator.computeTransit();
                transitsList.add(transit.altitude);

                coordsTriple.remove();
            }
            previousEphemeris = ephemeris;
        }

        return transitsList;
    }
}
