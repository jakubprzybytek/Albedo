package jp.albedo.webapp.risetransitset;

import jp.albedo.common.AstronomicalCoordinates;
import jp.albedo.common.JulianDay;
import jp.albedo.common.SiderealTime;
import jp.albedo.ephemeris.Ephemeris;
import jp.albedo.topographic.GeographicCoordinates;
import jp.albedo.topographic.RiseTransitSet;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

@Component
public class RiseTransitSetCalculator {

    List<RiseTransitSet> compute(List<Ephemeris> ephemerides, GeographicCoordinates observerCoords) {

        final double meanGreenwichSiderealTime = SiderealTime.getGreenwichMean(JulianDay.fromDate(1988, 3, 20));

        final List<RiseTransitSet> riseTransitSetList = new ArrayList<>();

        LinkedList<AstronomicalCoordinates> coordsTriple = new LinkedList<>();
        for (Ephemeris ephemeris : ephemerides) {

            coordsTriple.add(ephemeris.coordinates);

            if (coordsTriple.size() >= 3) {
                RiseTransitSet riseTransitSet = jp.albedo.topographic.RiseTransitSetCalculator.compute(coordsTriple, observerCoords, meanGreenwichSiderealTime, 56.0);
                riseTransitSetList.add(riseTransitSet);

                coordsTriple.remove();
            }
        }

        return riseTransitSetList;
    }

}
