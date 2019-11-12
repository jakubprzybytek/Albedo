package jp.albedo.jeanmeeus.topocentric;

import jp.albedo.common.AstronomicalCoordinates;
import jp.albedo.jeanmeeus.math.Interpolation;
import org.apache.commons.math3.util.MathUtils;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Based on Jean Meeus's 'Astronomical Algorithms', chapter 15, 'Rising, Transit, and Setting'.
 */
public class RiseTransitSetEventCalculator {

    public final static double RISE_AND_SET_ALTITUDE_FOR_PLANETS = Math.toRadians(-0.5667);

    public final static double RISE_AND_SET_ALTITUDE_FOR_SUN = Math.toRadians(-0.8333);

    private final List<AstronomicalCoordinates> coordsList;

    private final GeographicCoordinates observerCoords;

    private final double greenwichSiderealTime;

    private final double deltaT;

    private final double mTransit;

    public RiseTransitSetEventCalculator(List<AstronomicalCoordinates> coordsList, GeographicCoordinates observerCoords, double greenwichSiderealTime, double deltaT) {
        this.coordsList = coordsList;
        this.observerCoords = observerCoords;
        this.greenwichSiderealTime = greenwichSiderealTime;
        this.deltaT = deltaT;

        this.mTransit = bringToZeroOneRange((this.coordsList.get(1).rightAscension + this.observerCoords.longitude - greenwichSiderealTime) / MathUtils.TWO_PI);
    }

    public double computeTransitTime() {
        final double eventGreenwichSiderealTime = MathUtils.normalizeAngle(this.greenwichSiderealTime + 6.3003881 * this.mTransit, Math.PI);
        final double interpolationFactor = this.mTransit + this.deltaT / 86400.0;

        final List<Double> rightAscensionList = this.coordsList.stream()
                .map(coords -> coords.rightAscension)
                .collect(Collectors.toList());

        final double rightAscension = Interpolation.interpolate(rightAscensionList, interpolationFactor);

        final double localHourAngle = eventGreenwichSiderealTime - this.observerCoords.longitude - rightAscension;
        return this.mTransit + -localHourAngle / MathUtils.TWO_PI;
    }

    public RiseSet computeRiseAndSetTime(double riseAndSetAltitude) {

        final double H0 = Math.acos(
                (Math.sin(riseAndSetAltitude) - Math.sin(this.observerCoords.latitude) * Math.sin(this.coordsList.get(1).declination))
                        / (Math.cos(this.observerCoords.latitude) * Math.cos(this.coordsList.get(1).declination)));

        final double mRising = bringToZeroOneRange(this.mTransit - (H0 / MathUtils.TWO_PI));
        final double mSetting = bringToZeroOneRange(this.mTransit + (H0 / MathUtils.TWO_PI));
        final double finalMRising = mRising + useInterpolationToFindDeltaForRiseSet(mRising, riseAndSetAltitude);
        final double finalMSetting = mSetting + useInterpolationToFindDeltaForRiseSet(mSetting, riseAndSetAltitude);

        return new RiseSet(finalMRising, finalMSetting);
    }

    private double useInterpolationToFindDeltaForRiseSet(double m, double h0) {
        final double eventGreenwichSiderealTime = MathUtils.normalizeAngle(this.greenwichSiderealTime + 6.3003881 * m, Math.PI);
        final double interpolationFactor = m + this.deltaT / 86400.0;

        final List<Double> rightAscensionList = this.coordsList.stream()
                .map(coords -> coords.rightAscension)
                .collect(Collectors.toList());

        final double rightAscension = Interpolation.interpolate(rightAscensionList, interpolationFactor);

        final List<Double> declinationList = this.coordsList.stream()
                .map(coords -> coords.declination)
                .collect(Collectors.toList());

        final double declination = Interpolation.interpolate(declinationList, interpolationFactor);

        final double risingLocalHourAngle = eventGreenwichSiderealTime - this.observerCoords.longitude - rightAscension;
        final double altitude = Math.asin(Math.sin(this.observerCoords.latitude) * Math.sin(declination)
                + Math.cos(this.observerCoords.latitude) * Math.cos(declination) * Math.cos(risingLocalHourAngle));

        return (altitude - h0) / (MathUtils.TWO_PI * Math.cos(declination) * Math.cos(this.observerCoords.latitude) * Math.sin(risingLocalHourAngle));
    }

    static double bringToZeroOneRange(double a) {
        return a - Math.floor(a);
    }

}
