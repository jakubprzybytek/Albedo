package jp.albedo.webapp.altitude;

import jp.albedo.common.ephemeris.Ephemeris;
import jp.albedo.jeanmeeus.sidereal.HourAngle;
import jp.albedo.jeanmeeus.sidereal.SiderealTime;
import jp.albedo.jeanmeeus.topocentric.GeographicCoordinates;
import jp.albedo.jeanmeeus.topocentric.HorizontalCoordinates;
import org.apache.commons.math3.util.MathUtils;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AltitudeCalculator {

    public Double[] compute(List<Ephemeris> ephemerisList, GeographicCoordinates observerCoords) {
        return ephemerisList.stream()
                .map(ephemeris -> {
                    final double meanGreenwichSiderealTime = SiderealTime.getGreenwichMean(ephemeris.jde);
                    final double localHourAngle = MathUtils.normalizeAngle(HourAngle.getLocal(meanGreenwichSiderealTime, ephemeris.coordinates.rightAscension, observerCoords.longitude), 0);
                    return HorizontalCoordinates.getAltitude(ephemeris.coordinates.declination, localHourAngle, observerCoords.latitude);
                })
                .toArray(Double[]::new);
    }

}