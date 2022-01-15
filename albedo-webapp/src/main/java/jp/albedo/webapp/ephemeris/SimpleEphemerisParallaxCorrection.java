package jp.albedo.webapp.ephemeris;

import jp.albedo.common.AstronomicalCoordinates;
import jp.albedo.ephemeris.SimpleEphemeris;
import jp.albedo.jeanmeeus.topocentric.ObserverLocation;
import jp.albedo.jeanmeeus.topocentric.Parallax;

import java.util.function.Function;

public class SimpleEphemerisParallaxCorrection implements Function<SimpleEphemeris, SimpleEphemeris> {

    private final ObserverLocation observerLocation;

    private SimpleEphemerisParallaxCorrection(ObserverLocation observerLocation) {
        this.observerLocation = observerLocation;
    }

    public static SimpleEphemerisParallaxCorrection correctFor(ObserverLocation observerLocation) {
        return new SimpleEphemerisParallaxCorrection((observerLocation));
    }

    @Override
    public SimpleEphemeris apply(SimpleEphemeris ephemeris) {
        AstronomicalCoordinates correctedCoords = Parallax.correct(this.observerLocation, ephemeris.jde, ephemeris.coordinates, ephemeris.distanceToBody);
        // FixMe: TDE != UT
        return new SimpleEphemeris(ephemeris.jde, correctedCoords, ephemeris.distanceToBody);
    }

}
