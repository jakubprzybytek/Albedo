package jp.albedo.jeanmeeus.ephemeris.common;

import jp.albedo.common.BodyInformation;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class AngularSizeTest {

    @Test
    void fromDiameterAndDistance() {
        // Mercury on 2019-10-27
        assertEquals(7.74 / 3600.0, Math.toDegrees(AngularSize.fromRadiusAndDistance(BodyInformation.Mercury.equatorialRadius, 129965000.0)), 1 / 360000.0);
        // Venus on 2019-10-27
        assertEquals(10.55 / 3600.0, Math.toDegrees(AngularSize.fromRadiusAndDistance(BodyInformation.Venus.equatorialRadius, 236582000.0)), 1 / 360000.0);
        // Mars on 2019-10-27
        assertEquals(3.66 / 3600.0, Math.toDegrees(AngularSize.fromRadiusAndDistance(BodyInformation.Mars.equatorialRadius, 382502000.0)), 1 / 360000.0);
        // Jupiter on 2019-10-27
        assertEquals(33.67 / 3600.0, Math.toDegrees(AngularSize.fromRadiusAndDistance(BodyInformation.Jupiter.equatorialRadius, 875826000.0)), 1 / 360000.0);
        // Saturn on 2019-10-27
        assertEquals(16.11 / 3600.0, Math.toDegrees(AngularSize.fromRadiusAndDistance(BodyInformation.Saturn.equatorialRadius, 1543147000.0)), 1 / 360000.0);
    }
}