package jp.albedo.jeanmeeus.topocentric;

import jp.albedo.common.AstronomicalCoordinates;
import jp.albedo.common.JulianDay;
import jp.albedo.common.Radians;
import jp.albedo.testutils.Degrees;
import jp.albedo.utils.Formatter;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ParallaxTest {

    @Test
    void computeRhoSinAndCosPhiPrim() {
        assertEquals(0.546861, Parallax.computeRhoSinPhiPrim(Math.toRadians(33.356111), 1706), 0.000001);
        assertEquals(0.836339, Parallax.computeRhoCosPhiPrim(Math.toRadians(33.356111), 1706), 0.000001);
    }

    /**
     * From Meeus
     */
    @Test
    void correctMars() {
        final GeographicCoordinates observer = new GeographicCoordinates(
                Radians.fromHours(7, 47, 27.0),
                Math.toRadians(33.356111)
        );
        final double height = 1706;

        final double ut = JulianDay.fromDateTime(2003, 8, 28, 3, 17, 0.0);

        final AstronomicalCoordinates object = new AstronomicalCoordinates(
                Radians.fromHours(22, 38, 7.25),
                Radians.fromDegrees(-15, 46, 15.9)
        );

        final AstronomicalCoordinates corrected = Parallax.correct(observer, height, ut, object, 0.37276);

        System.out.printf("Δα=%s, Δδ=%s",
                Formatter.SECONDS.apply(corrected.rightAscension - object.rightAscension),
                Formatter.ARCSECONDS.apply(corrected.declination - object.declination));

        assertEquals(Math.toDegrees(Radians.fromHours(22, 38, 8.54)), Math.toDegrees(corrected.rightAscension), Degrees.ONE_HUNDREDTH_SECOND);
        assertEquals(Math.toDegrees(Radians.fromDegrees(-15, 46, 30.0)), Math.toDegrees(corrected.declination), Degrees.ONE_TENTH_ARCSECOND);
    }

    @Test
    void correctMoon() {
        final GeographicCoordinates observer = new GeographicCoordinates(
                Radians.fromDegrees(-16, 52, 28.2),
                Radians.fromDegrees(52, 23, 39.85)
        );
        final double height = 70;

        final double ut = JulianDay.fromDateTime(2019, 11, 15, 0, 0, 0.0);

        final AstronomicalCoordinates object = new AstronomicalCoordinates(
                Radians.fromHours(5, 20, 31.53),
                Radians.fromDegrees(21, 31, 29.45)
        );

        final AstronomicalCoordinates corrected = Parallax.correct(observer, height, ut, object, 0.002543);

        System.out.println("Original: " + object.toString());
        System.out.println("Corrected: " + corrected.toString());
        System.out.printf("Δα=%s Δδ=%s",
                Formatter.SECONDS.apply(corrected.rightAscension - object.rightAscension),
                Formatter.ARCSECONDS.apply(corrected.declination - object.declination));

        assertEquals(Math.toDegrees(Radians.fromHours(5, 20, 56.71)), Math.toDegrees(corrected.rightAscension), Degrees.ONE_HUNDREDTH_SECOND);
        assertEquals(Math.toDegrees(Radians.fromDegrees(21, 1, 32.2)), Math.toDegrees(corrected.declination), Degrees.ONE_TENTH_ARCSECOND);
    }

}