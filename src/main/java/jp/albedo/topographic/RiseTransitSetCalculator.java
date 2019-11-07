package jp.albedo.topographic;

import jp.albedo.common.AstronomicalCoordinates;
import jp.albedo.math.Interpolation;
import org.apache.commons.math3.util.MathUtils;

import java.util.List;
import java.util.stream.Collectors;

public class RiseTransitSetCalculator {

    public static RiseTransitSet compute(List<AstronomicalCoordinates> coordsList, GeographicCoordinates observerCoords, double greenwichSiderealTime, double deltaT) {

        final double h0 = Math.toRadians(-0.5667);

        final double H0 = Math.acos(
                (Math.sin(h0) - Math.sin(observerCoords.latitude) * Math.sin(coordsList.get(1).declination))
                        / (Math.cos(observerCoords.latitude) * Math.cos(coordsList.get(1).declination)));

        final double mTransit = bringToZeroOneRange((coordsList.get(1).rightAscension + observerCoords.longitude - greenwichSiderealTime) / MathUtils.TWO_PI);
        final double mRising = bringToZeroOneRange(mTransit - (H0 / MathUtils.TWO_PI));
        final double mSetting = bringToZeroOneRange(mTransit + (H0 / MathUtils.TWO_PI));

        final double finalMRising = mRising + useInterpolationToFindDeltaForRiseSet(mRising, coordsList, observerCoords, greenwichSiderealTime, deltaT, h0);
        final double finalMTransit = mTransit + useInterpolationToFindDeltaForTransit(mTransit, coordsList, observerCoords, greenwichSiderealTime, deltaT);
        final double finalMSetting = mSetting + useInterpolationToFindDeltaForRiseSet(mSetting, coordsList, observerCoords, greenwichSiderealTime, deltaT, h0);

        return new RiseTransitSet(finalMRising, finalMTransit, finalMSetting);
    }

    private static double useInterpolationToFindDeltaForRiseSet(double m, List<AstronomicalCoordinates> coordsList, GeographicCoordinates observerCoords, double greenwichSiderealTime, double deltaT, double h0) {
        final double eventGreenwichSiderealTime = MathUtils.normalizeAngle(greenwichSiderealTime + 6.3003881 * m, Math.PI);
        final double interpolationFactor = m + deltaT / 86400.0;

        final List<Double> rightAscensionList = coordsList.stream()
                .map(coords -> coords.rightAscension)
                .collect(Collectors.toList());

        final double rightAscension = Interpolation.interpolate(rightAscensionList, interpolationFactor);

        final List<Double> declinationList = coordsList.stream()
                .map(coords -> coords.declination)
                .collect(Collectors.toList());

        final double declination = Interpolation.interpolate(declinationList, interpolationFactor);

        final double risingLocalHourAngle = eventGreenwichSiderealTime - observerCoords.longitude - rightAscension;
        final double altitude = Math.asin(Math.sin(observerCoords.latitude) * Math.sin(declination)
                + Math.cos(observerCoords.latitude) * Math.cos(declination) * Math.cos(risingLocalHourAngle));

        return (altitude - h0) / (MathUtils.TWO_PI * Math.cos(declination) * Math.cos(observerCoords.latitude) * Math.sin(risingLocalHourAngle));
    }

    private static double useInterpolationToFindDeltaForTransit(double m, List<AstronomicalCoordinates> coordsList, GeographicCoordinates observerCoords, double greenwichSiderealTime, double deltaT) {
        final double eventGreenwichSiderealTime = MathUtils.normalizeAngle(greenwichSiderealTime + 6.3003881 * m, Math.PI);
        final double interpolationFactor = m + deltaT / 86400.0;

        final List<Double> rightAscensionList = coordsList.stream()
                .map(coords -> coords.rightAscension)
                .collect(Collectors.toList());

        final double rightAscension = Interpolation.interpolate(rightAscensionList, interpolationFactor);

        final double localHourAngle = eventGreenwichSiderealTime - observerCoords.longitude - rightAscension;
        return -localHourAngle / MathUtils.TWO_PI;
    }

    static double bringToZeroOneRange(double a) {
        return a - Math.floor(a);
    }

}
