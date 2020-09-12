package jp.albedo.jeanmeeus.topocentric;

import jp.albedo.common.AstronomicalCoordinates;
import jp.albedo.jeanmeeus.math.Interpolation;
import jp.albedo.jeanmeeus.sidereal.HourAngle;
import org.apache.commons.math3.util.MathUtils;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Based on Jean Meeus's 'Astronomical Algorithms', chapter 15, 'Rising, Transit, and Setting'.
 */
public class RiseTransitSetEventCalculator {

    public final static double RISE_AND_SET_ALTITUDE_FOR_MOON = Math.toRadians(0.125);

    public final static double RISE_AND_SET_ALTITUDE_FOR_SMALL_BODIES = Math.toRadians(-0.5667);

    public final static double RISE_AND_SET_ALTITUDE_FOR_SUN = Math.toRadians(-0.8333);

    public final static double CIVIL_DAWN_AND_DUSK_ALTITUDE_FOR_SUN = Math.toRadians(-6.0);

    public final static double NAUTICAL_DAWN_AND_DUSK_ALTITUDE_FOR_SUN = Math.toRadians(-12.0);

    public final static double ASTRONOMICAL_DAWN_AND_DUSK_ALTITUDE_FOR_SUN = Math.toRadians(-18.0);

    public static final double HALF_PI = Math.PI / 2;

    public static final double TREE_QUARTERS_PI = 3 * Math.PI / 2;

    private final double solarToSidereal = 24.0 * MathUtils.TWO_PI / 23.9344696;

    private final List<AstronomicalCoordinates> coordsTriple;

    private final GeographicCoordinates observerCoords;

    private final double greenwichSiderealTime;

    private final double deltaT;

    private final double mEstimateTransit;

    /**
     * Builds a calculator for rising, transit and setting times.
     *
     * @param coordsTriple          Three consecutive coordinates of the body where the middle one is the closest to the day of interest (0h).
     *                              Other two are at most one day apart from the middle one.
     * @param observerCoords        Observer's location.
     * @param greenwichSiderealTime Greenwich Sidereal Time for the day of interest. Middle coordinate refers that day.
     * @param deltaT
     */
    public RiseTransitSetEventCalculator(List<AstronomicalCoordinates> coordsTriple, GeographicCoordinates observerCoords, double greenwichSiderealTime, double deltaT) {
        this.coordsTriple = coordsTriple;
        this.observerCoords = observerCoords;
        this.greenwichSiderealTime = greenwichSiderealTime;
        this.deltaT = deltaT;

        this.mEstimateTransit = bringToZeroOneRange(-HourAngle.getLocal(greenwichSiderealTime, this.coordsTriple.get(1).rightAscension, this.observerCoords.longitude) / MathUtils.TWO_PI);
    }

    /**
     * Computes transit time as Julian Day
     *
     * @return
     */
    public Transit computeTransit() {
        final AstronomicalCoordinates coordsForEvent = interpolateCoordinates(this.mEstimateTransit);

        final double estimatedEventGreenwichSiderealTime = MathUtils.normalizeAngle(this.greenwichSiderealTime + this.solarToSidereal * this.mEstimateTransit, Math.PI);
        final double estimatedLocalHourAngle = MathUtils.normalizeAngle(HourAngle.getLocal(estimatedEventGreenwichSiderealTime, coordsForEvent.rightAscension, this.observerCoords.longitude), 0);
        //final double finalMTransit = bringToZeroOneRange(this.mEstimateTransit + -estimatedLocalHourAngle / MathUtils.TWO_PI);
        final double finalMTransit = this.mEstimateTransit + -estimatedLocalHourAngle / MathUtils.TWO_PI;

        final double correctedEventGreenwichSiderealTime = MathUtils.normalizeAngle(this.greenwichSiderealTime + this.solarToSidereal * finalMTransit, Math.PI);
        final double correctedLocalHourAngle = MathUtils.normalizeAngle(HourAngle.getLocal(correctedEventGreenwichSiderealTime, coordsForEvent.rightAscension, this.observerCoords.longitude), 0);
        final double transitAltitude = HorizontalCoordinates.getAltitude(coordsForEvent.declination, correctedLocalHourAngle, this.observerCoords.latitude);

        return new Transit(finalMTransit, transitAltitude);
    }

    /**
     * Computes rising and setting times along with corresponding azimuths.
     *
     * @param riseAndSetAltitude Altitude for which rising and setting time should be computed.
     *                           For example, due to Atmospheric refraction, bodies appear to raise over horizon when they are actually half degree bellow it.
     * @return Rising and setting times for corresponding altitude along with azimuths.
     */
    public RiseSet computeRiseAndSet(double riseAndSetAltitude) {
        final double H0 = Math.acos(
                (Math.sin(riseAndSetAltitude) - Math.sin(this.observerCoords.latitude) * Math.sin(this.coordsTriple.get(1).declination))
                        / (Math.cos(this.observerCoords.latitude) * Math.cos(this.coordsTriple.get(1).declination)));

        final double estimatedMRising = bringToZeroOneRange(this.mEstimateTransit - (H0 / MathUtils.TWO_PI));
        final double estimatedMSetting = bringToZeroOneRange(this.mEstimateTransit + (H0 / MathUtils.TWO_PI));
        final AstronomicalCoordinates coordsForRising = interpolateCoordinates(estimatedMRising);
        final AstronomicalCoordinates coordsForSetting = interpolateCoordinates(estimatedMSetting);
        final double finalMRising = estimatedMRising + useInterpolationToFindDeltaForRiseSet(coordsForRising, estimatedMRising, riseAndSetAltitude);
        final double finalMSetting = estimatedMSetting + useInterpolationToFindDeltaForRiseSet(coordsForSetting, estimatedMSetting, riseAndSetAltitude);

        final double correctedRisingGreenwichSiderealTime = MathUtils.normalizeAngle(this.greenwichSiderealTime + this.solarToSidereal * finalMRising, Math.PI);
        final double correctedRisingLocalHourAngle = HourAngle.getLocal(correctedRisingGreenwichSiderealTime, coordsForRising.rightAscension, this.observerCoords.longitude);
        final double risingAzimuth = HorizontalCoordinates.getAzimuth(coordsForRising.declination, correctedRisingLocalHourAngle, this.observerCoords.latitude);

        final double correctedSettingGreenwichSiderealTime = MathUtils.normalizeAngle(this.greenwichSiderealTime + this.solarToSidereal * finalMSetting, Math.PI);
        final double correctedSettingLocalHourAngle = HourAngle.getLocal(correctedSettingGreenwichSiderealTime, coordsForSetting.rightAscension, this.observerCoords.longitude);
        final double settingAzimuth = HorizontalCoordinates.getAzimuth(coordsForSetting.declination, correctedSettingLocalHourAngle, this.observerCoords.latitude);

        return new RiseSet(finalMRising, risingAzimuth, finalMSetting, settingAzimuth);
    }

    private double useInterpolationToFindDeltaForRiseSet(AstronomicalCoordinates coordsForEvent, double m, double h0) {

        final double eventGreenwichSiderealTime = MathUtils.normalizeAngle(this.greenwichSiderealTime + this.solarToSidereal * m, Math.PI);
        final double localHourAngle = HourAngle.getLocal(eventGreenwichSiderealTime, coordsForEvent.rightAscension, this.observerCoords.longitude);

        final double altitude = HorizontalCoordinates.getAltitude(coordsForEvent.declination, localHourAngle, this.observerCoords.latitude);
        return (altitude - h0) / (MathUtils.TWO_PI * Math.cos(coordsForEvent.declination) * Math.cos(this.observerCoords.latitude) * Math.sin(localHourAngle));
    }

    private AstronomicalCoordinates interpolateCoordinates(double m) {
        final double interpolationFactor = m + this.deltaT / 86400.0;

        final double[] rightAscensionTriple = this.coordsTriple.stream()
                .mapToDouble(coords -> coords.rightAscension)
                .toArray();

        double rightAscension;

        if (needsShifting(rightAscensionTriple)) {
            for (int i = 0; i < rightAscensionTriple.length; i++) {
                rightAscensionTriple[i] = MathUtils.normalizeAngle(rightAscensionTriple[i] + Math.PI, Math.PI);
            }
            rightAscension = MathUtils.normalizeAngle(Interpolation.interpolate(rightAscensionTriple, interpolationFactor) - Math.PI, Math.PI);
        } else {
            rightAscension = Interpolation.interpolate(rightAscensionTriple, interpolationFactor);
        }

        final double[] declinationTriple = this.coordsTriple.stream()
                .mapToDouble(coords -> coords.declination)
                .toArray();

        final double declination = Interpolation.interpolate(declinationTriple, interpolationFactor);

        return new AstronomicalCoordinates(rightAscension, declination);
    }

    static boolean needsShifting(double[] angles) {
        return (angles[0] < HALF_PI || angles[1] < HALF_PI || angles[2] < HALF_PI)
                && (angles[0] > TREE_QUARTERS_PI || angles[1] > TREE_QUARTERS_PI || angles[2] > TREE_QUARTERS_PI);
    }

    static double bringToZeroOneRange(double a) {
        return a - Math.floor(a);
    }

}
