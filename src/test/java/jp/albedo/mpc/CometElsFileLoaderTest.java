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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CometElsFileLoaderTest {

    @Test
    @DisplayName("Reading 6 orbits from sample file")
    void load() throws IOException, URISyntaxException {

        final URL cometElsFileULR = CometElsFileLoaderTest.class.getClassLoader().getResource("MPC/CometEls.txt.testSample");

        System.out.println("Reading Comets file: " + cometElsFileULR);

        List<MPCORBRecord> cometRecords = CometElsFileLoader.load(new File(cometElsFileULR.toURI()), 5);
        for (MPCORBRecord record : cometRecords) {
            System.out.printf("%s: %s%n", record.bodyDetails.name, record.orbitElements);
        }

        assertEquals(6, cometRecords.size());
    }

    @Test
    @DisplayName("Parsing correct format line")
    void parseOrbitLineCorrectFormat() {
        String lineToParse = "0391P         2018 03 17.4927  4.109579  0.120770  186.4949  124.7349   21.2761  20191209   8.0  4.0  391P/Kowalski                                            MPEC 2019-VB6";

        Optional<MPCORBRecord> recordOptional = CometElsFileLoader.parseCometLine(lineToParse);
        assertTrue(recordOptional.isPresent());

        assertEquals("391P/Kowalski", recordOptional.get().bodyDetails.name);

        MagnitudeParameters magnitudeParameters = recordOptional.get().magnitudeParameters;
        OrbitElements orbitElements = recordOptional.get().orbitElements;

        assertEquals(Epoch.J2000, orbitElements.getEpoch());

        assertEquals(8.0, magnitudeParameters.H, 0.01);
        assertEquals(4.0, magnitudeParameters.G, 0.01);

        assertEquals(186.4949, orbitElements.getArgumentOfPerihelion(), 0.0001);
        assertEquals(124.7349, orbitElements.getLongitudeOfAscendingNode(), 0.0001);
        assertEquals(21.2761, orbitElements.getInclination(), 0.0001);

        assertEquals(0.120770, orbitElements.getEccentricity(), 0.000001);
        assertEquals(3.666746076, orbitElements.getSemiMajorAxis(), 0.0000001);
        assertEquals(0.140372754, orbitElements.getMeanMotion(), 0.000000001);

        assertEquals(JulianDay.fromDate(2018, 3, 17.4927), orbitElements.getMeanAnomalyEpoch(), 0.000001);
        assertEquals(0.0, orbitElements.getMeanAnomalyAtEpoch(), 0.00001);
    }
}