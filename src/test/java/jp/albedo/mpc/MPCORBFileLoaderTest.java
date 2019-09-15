package jp.albedo.mpc;

import jp.albedo.common.Epoch;
import jp.albedo.common.JulianDay;
import jp.albedo.ephemeris.common.OrbitElements;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class MPCORBFileLoaderTest {

    @Test
    @DisplayName("Reading 5 orbits from sample file")
    void load() throws IOException, URISyntaxException {

        final URL mpcorbFileULR = MPCORBFileLoaderTest.class.getClassLoader().getResource("MPC/MPCORB.DAT.testSample");
        final Path mpcorbFilePath = Paths.get(mpcorbFileULR.toURI());
        ;

        System.out.println("Reading MPCORB file");

        List<MPCORBRecord> mpcorbRecords = MPCORBFileLoader.load(mpcorbFilePath.toFile(), 5);
        for (MPCORBRecord record : mpcorbRecords) {
            System.out.printf("%s: %s%n", record.bodyDetails.name, record.orbitElements);
        }

        assertEquals(5, mpcorbRecords.size());
    }

    @Test
    @DisplayName("Parsing incorrect format line")
    void parseOrbitLineIncorrectFormat() {
        assertFalse(MPCORBFileLoader.parseOrbitLine("wrong line").isPresent());
    }

    @Test
    @DisplayName("Parsing correct format line")
    void parseOrbitLineCorrectFormat() {
        String lineToParse = "00006    5.71  0.24 K194R  86.19795  239.80747  138.64020   14.73791  0.2030070  0.26097173   2.4251600  0 MPO467603  5727  89 1848-2019 0.53 M-v 38h MPCLINUX   0007      (6) Hebe               20190501";

        Optional<MPCORBRecord> recordOptional = MPCORBFileLoader.parseOrbitLine(lineToParse);
        assertTrue(recordOptional.isPresent());

        assertEquals("Hebe", recordOptional.get().bodyDetails.name);

        OrbitElements orbitElements = recordOptional.get().orbitElements;

        assertEquals(Epoch.J2000, orbitElements.getEpoch());

        assertEquals(239.80747, orbitElements.getArgumentOfPerihelion(), 0.00001);
        assertEquals(138.64020, orbitElements.getLongitudeOfAscendingNode(), 0.00001);
        assertEquals(14.73791, orbitElements.getInclination(), 0.00001);

        assertEquals(0.2030070, orbitElements.getEccentricity(), 0.0000001);
        assertEquals(0.26097173, orbitElements.getMeanMotion(), 0.00000001);
        assertEquals(2.4251600, orbitElements.getSemiMajorAxis(), 0.0000001);

        assertEquals(JulianDay.fromDate(2019, 4, 27.0), orbitElements.getMeanAnomalyEpoch(), 0.000001);
        assertEquals(86.19795, orbitElements.getMeanAnomalyAtEpoch(), 0.00001);
    }

    @Test
    @DisplayName("Unpacking date string")
    void unpackDate() {
        assertEquals(JulianDay.fromDate(1996, 1, 1), MPCORBFileLoader.unpackDate("J9611"), 0.000001);
        assertEquals(JulianDay.fromDate(1996, 1, 10), MPCORBFileLoader.unpackDate("J961A"), 0.000001);
        assertEquals(JulianDay.fromDate(1996, 9, 30), MPCORBFileLoader.unpackDate("J969U"), 0.000001);
        assertEquals(JulianDay.fromDate(1996, 10, 1), MPCORBFileLoader.unpackDate("J96A1"), 0.000001);
        assertEquals(JulianDay.fromDate(2001, 10, 22), MPCORBFileLoader.unpackDate("K01AM"), 0.000001);
    }
}