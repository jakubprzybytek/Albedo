package jp.albedo.webapp.events.eclipses;

public class EarthShadow {

    /**
     * Computes radius of umbra in kilometers.
     *
     * @param distanceToMoon
     * @param distanceToSun
     * @param earthRadius    Radius of earth in kilometers.
     * @param sunRadius      Radius of sun in kilometers.
     * @return Radius of umbra in kilometers.
     */
    static public double umbra(double distanceToMoon, double distanceToSun, double earthRadius, double sunRadius) {
        return earthRadius - (distanceToMoon / distanceToSun) * (sunRadius - earthRadius);
    }


    /**
     * Computes radius of penumbra in kilometers.
     *
     * @param distanceToMoon
     * @param distanceToSun
     * @param earthDiameter  Radius of earth in kilometers.
     * @param sunDiameter    Radius of sun in kilometers.
     * @return Radius of penumbra in kilometers.
     */
    static public double penumbra(double distanceToMoon, double distanceToSun, double earthDiameter, double sunDiameter) {
        return distanceToMoon * (sunDiameter + earthDiameter) / distanceToSun + earthDiameter;
    }

}
