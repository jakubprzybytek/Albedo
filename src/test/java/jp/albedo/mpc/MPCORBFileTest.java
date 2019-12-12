package jp.albedo.mpc;

import jp.albedo.common.Epoch;
import jp.albedo.common.JulianDay;
import jp.albedo.jeanmeeus.ephemeris.common.MagnitudeParameters;
import jp.albedo.jeanmeeus.ephemeris.common.OrbitElements;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class MPCORBFileTest {

    @Test
    @DisplayName("Reading 5 orbits from sample file")
    void load() throws IOException, URISyntaxException {

        final URL mpcorbFileULR = MPCORBFileTest.class.getClassLoader().getResource("MPC/MPCORB.DAT.testSample");

        System.out.println("Reading MPCORB file");

        List<MPCRecord> MPCRecords = MPCORBFile.load(new File(mpcorbFileULR.toURI()), 5);
        for (MPCRecord record : MPCRecords) {
            System.out.printf("%s: %s%n", record.bodyDetails.name, record.orbitElements);
        }

        assertEquals(5, MPCRecords.size());
    }

    @Test
    @DisplayName("Finding asteroid by name")
    void find() throws IOException, URISyntaxException {

        final URL mpcorbFileULR = MPCORBFileTest.class.getClassLoader().getResource("MPC/MPCORB.DAT.testSample");

        System.out.println("Reading MPCORB file");

        Optional<MPCRecord> mpcorbRecord = MPCORBFile.find(new File(mpcorbFileULR.toURI()), "Astraea");

        assertTrue(mpcorbRecord.isPresent());
        assertEquals("Astraea", mpcorbRecord.get().bodyDetails.name);
        assertEquals(0.1910946, mpcorbRecord.get().orbitElements.getEccentricity(), 0.0000001);
    }

    @Test
    @DisplayName("Parsing incorrect format line")
    void parseOrbitLineIncorrectFormat() {
        assertFalse(MPCORBFile.parseOrbitLine("wrong line").isPresent());
    }

    @Test
    @DisplayName("Parsing correct format line")
    void parseOrbitLineCorrectFormat() {
        String lineToParse = "00006    5.71  0.24 K194R  86.19795  239.80747  138.64020   14.73791  0.2030070  0.26097173   2.4251600  0 MPO467603  5727  89 1848-2019 0.53 M-v 38h MPCLINUX   0007      (6) Hebe               20190501";

        Optional<MPCRecord> recordOptional = MPCORBFile.parseOrbitLine(lineToParse);
        assertTrue(recordOptional.isPresent());

        assertEquals("Hebe", recordOptional.get().bodyDetails.name);

        MagnitudeParameters magnitudeParameters = recordOptional.get().magnitudeParameters;
        OrbitElements orbitElements = recordOptional.get().orbitElements;

        assertEquals(Epoch.J2000, orbitElements.getEpoch());

        assertEquals(5.71, magnitudeParameters.H, 0.01);
        assertEquals(0.24, magnitudeParameters.G, 0.01);

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
    @DisplayName("Parsing astoroid name with space")
    void parseOrbitLineNameWithSpace() {
        String lineToParse = "01008   10.6   0.15 K194R 179.87298   14.71605   20.55261    8.93362  0.0775509  0.18123176   3.0925247  0 MPO467621  2309  34 1923-2019 0.40 M-v 38h MPCLINUX   0000   (1008) La Paz             20190511";

        Optional<MPCRecord> recordOptional = MPCORBFile.parseOrbitLine(lineToParse);
        assertTrue(recordOptional.isPresent());

        assertEquals("La Paz", recordOptional.get().bodyDetails.name);
    }

    @Test
    @DisplayName("Unpacking date string")
    void unpackDate() {
        assertEquals(JulianDay.fromDate(1996, 1, 1), MPCORBFile.unpackDate("J9611"), 0.000001);
        assertEquals(JulianDay.fromDate(1996, 1, 10), MPCORBFile.unpackDate("J961A"), 0.000001);
        assertEquals(JulianDay.fromDate(1996, 9, 30), MPCORBFile.unpackDate("J969U"), 0.000001);
        assertEquals(JulianDay.fromDate(1996, 10, 1), MPCORBFile.unpackDate("J96A1"), 0.000001);
        assertEquals(JulianDay.fromDate(2001, 10, 22), MPCORBFile.unpackDate("K01AM"), 0.000001);
    }
}