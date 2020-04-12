package jp.albedo.vsop87;

import jp.albedo.common.RectangularCoordinates;
import jp.albedo.jeanmeeus.ephemeris.common.SphericalCoordinates;
import jp.albedo.vsop87.files.VSOP87Files;
import jp.albedo.vsop87.files.VSOP87FilesLoader;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;

public class VSOP87Calculator {

    private static Log LOG = LogFactory.getLog(VSOP87Calculator.class);

    static private VSOP87Coefficients earthEclipticSphericalCoefficientsJ2000;

    // TODO: Better synchronization
    public static synchronized VSOP87Coefficients getEarthEclipticSphericalCoefficientsJ2000() throws IOException, URISyntaxException {
        if (earthEclipticSphericalCoefficientsJ2000 == null) {
            earthEclipticSphericalCoefficientsJ2000 = VSOP87FilesLoader.load(VSOP87Files.VSOP87B_EARTH);
            LOG.info("Loaded " + VSOP87Files.VSOP87B_EARTH);
        }
        return earthEclipticSphericalCoefficientsJ2000;
    }

    public static SphericalCoordinates computeEarthEclipticSphericalCoordinatesJ2000(double jde) throws VSOPException {
        final double t = (jde - 2451545.0d) / 365250.0d;

        try {
            VSOP87Coefficients coefficientsJ2000 = getEarthEclipticSphericalCoefficientsJ2000();

            double longitude = calculateCoordinate(t, coefficientsJ2000.getLongitudeCoefficients());
            double latitude = calculateCoordinate(t, coefficientsJ2000.getLatitudeCoefficients());
            double distance = calculateCoordinate(t, coefficientsJ2000.getDistanceCoefficients());

            return new SphericalCoordinates(longitude, latitude, distance);

        } catch (IOException e) {
            throw new VSOPException("Cannot read VSOP87 file", e);
        } catch (URISyntaxException e) {
            throw new VSOPException("Cannot find VSOP87 file", e);
        }
    }

     public static SphericalCoordinates computeSunEclipticSphericalCoordinatesJ2000(double jde) throws VSOPException {
        SphericalCoordinates sphericalCoordinates = computeEarthEclipticSphericalCoordinatesJ2000(jde);
        return new SphericalCoordinates(sphericalCoordinates.longitude + Math.PI,
                -sphericalCoordinates.latitude,
                sphericalCoordinates.distance);
    }

    private static double calculateCoordinate(double t, List<List<Coefficients>> setOfCoefficients) {
        double coordinate = 0.0;
        double tPower = 1.0;
        for (List<Coefficients> coefficientsList : setOfCoefficients) {
            double L = 0.0;
            for (Coefficients coefficients : coefficientsList) {
                L += coefficients.A * Math.cos(coefficients.B + coefficients.C * t);
            }
            coordinate += L * tPower;
            tPower *= t;
        }
        return coordinate;
    }

    public static RectangularCoordinates toFK5(RectangularCoordinates rc) {
        double X = rc.x + 0.000000440360 * rc.y - 0.000000190919 * rc.z;
        double Y = -0.000000479966 * rc.x + 0.917482137087 * rc.y - 0.397776982902 * rc.z;
        double Z = 0.397776982902 * rc.y + 0.917482137087 * rc.z;
        return new RectangularCoordinates(X, Y, Z);
    }
}
