package jp.albedo.webapp.ephemeris;

import jp.albedo.common.AstronomicalCoordinates;
import jp.albedo.ephemeris.Ephemeris;
import jp.albedo.ephemeris.SimpleEphemeris;
import jp.albedo.jeanmeeus.topocentric.ObserverLocation;
import jp.albedo.jeanmeeus.topocentric.Parallax;

import java.util.function.Function;

public class ParallaxCorrection implements Function<Ephemeris, Ephemeris> {

    private final ObserverLocation observerLocation;

    private ParallaxCorrection(ObserverLocation observerLocation) {
        this.observerLocation = observerLocation;
    }

    public static ParallaxCorrection correctFor(ObserverLocation observerLocation) {
        return new ParallaxCorrection((observerLocation));
    }

    @Override
    public Ephemeris apply(Ephemeris ephemeris) {
        AstronomicalCoordinates correctedCoords = Parallax.correct(this.observerLocation, ephemeris.jde, ephemeris.coordinates, ephemeris.distanceFromEarth);
        // FixMe: TDE != UT
        return new Ephemeris(ephemeris.jde, correctedCoords, ephemeris.distanceFromSun, ephemeris.distanceFromEarth, ephemeris.elongation, ephemeris.apparentMagnitude, ephemeris.angularSize);
    }

}
