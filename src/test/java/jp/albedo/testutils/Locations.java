package jp.albedo.testutils;

import jp.albedo.common.Radians;
import jp.albedo.jeanmeeus.topocentric.GeographicCoordinates;
import jp.albedo.jeanmeeus.topocentric.ObserverLocation;

public class Locations {

    public static ObserverLocation PALOMAR_OBSERVATORY = new ObserverLocation(
            new GeographicCoordinates(
                    Radians.fromHours(7, 47, 27.0),
                    Math.toRadians(33.356111)
            ),
            1706
    );

    public static ObserverLocation POSNAN_OBSERVATORY = new ObserverLocation(
            new GeographicCoordinates(
                    Radians.fromDegrees(-16, 52, 28.2),
                    Radians.fromDegrees(52, 23, 39.85)
            ),
            70
    );

}
