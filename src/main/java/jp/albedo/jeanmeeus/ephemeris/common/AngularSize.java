package jp.albedo.jeanmeeus.ephemeris.common;

public class AngularSize {

    /**
     * Return size of a body with given radius as seen from a given distance.
     *
     * @param radius
     * @param distance
     * @return Angular size (over provided dimater) in radians.
     */
    public static double fromRadiusAndDistance(double radius, double distance) {
        return Math.atan(radius / distance) * 2.0;
    }

}
