package jp.albedo.jeanmeeus.ephemeris.common;

public class AngularSize {

    /**
     * Return size of a body with given radius as seen from a given distance.
     *
     * @param radius Radius of the body in kilometers.
     * @param distance Distance to the body in kilometers.
     * @return Angular size (over provided diameter) in radians.
     */
    public static double fromRadiusAndDistance(double radius, double distance) {
        return Math.atan(radius / distance) * 2.0;
    }

}
