package jp.albedo.jeanmeeus.sidereal;

import org.apache.commons.math3.util.MathUtils;

public class HourAngle {

    public static double getLocal(double localSiderealTime, double rightAscension) {
        return MathUtils.normalizeAngle(localSiderealTime - rightAscension, Math.PI);
    }

    public static double getLocal(double greenwichSiderealTime, double observerLongitude, double rightAscension) {
        return MathUtils.normalizeAngle(greenwichSiderealTime - observerLongitude - rightAscension, Math.PI);
    }

}
