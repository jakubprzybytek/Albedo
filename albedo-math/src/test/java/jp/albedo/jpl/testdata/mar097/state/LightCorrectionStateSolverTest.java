package jp.albedo.jpl.testdata.mar097.state;

import jp.albedo.common.JulianDay;
import jp.albedo.common.RectangularCoordinates;
import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.files.util.EphemerisSeconds;
import jp.albedo.jpl.state.Correction;
import jp.albedo.jpl.state.StateSolver;
import jp.albedo.jpl.testdata.mar097.TestData_mar097;
import org.junit.jupiter.api.Test;

public class LightCorrectionStateSolverTest {

    @Test
    public void testUncorrected() throws JplException {

        StateSolver stateSolver = TestData_mar097.SPK_KERNEL.stateSolver()
                .target(JplBody.MarsBarycenter)
                .observer(JplBody.EarthMoonBarycenter)
                .build();

        RectangularCoordinates coords = stateSolver.positionFor(EphemerisSeconds.fromDate(2019, 10, 9));

        RectangularCoordinates webGeocalcCoords = new RectangularCoordinates(-391225033.66639113, -20387791.35027276, -1784750.62884948);

        System.out.printf("%nUncorrected%n");
        System.out.printf("Computed:    %s%n", coords);
        System.out.printf("Web Geocalc: %s%n", webGeocalcCoords);
        System.out.printf("Difference:  %s%n", webGeocalcCoords.subtract(coords));

        //assertThat(stateSolver.positionForDate(jde)).isEqualTo(expected, offset);
    }

    @Test
    public void testLightTimeCorrected() throws JplException {

        StateSolver stateSolver = TestData_mar097.SPK_KERNEL.stateSolver()
                .target(JplBody.MarsBarycenter)
                .observer(JplBody.EarthMoonBarycenter)
                .corrections(Correction.LightTime)
                .build();

        //RectangularCoordinates coords = stateSolver.positionForDate(JulianDay.fromDate(2019, 10, 9));
        RectangularCoordinates coords = stateSolver.positionFor(EphemerisSeconds.fromJde(JulianDay.fromDate(2019, 10, 9)));

        RectangularCoordinates webGeocalcCoords = new RectangularCoordinates(-391223684.80939984, -20361541.86032661, -1772747.16336980);

        System.out.printf("%nLight Time corrected%n");
        System.out.printf("Computed:    %s%n", coords);
        System.out.printf("Web Geocalc: %s%n", webGeocalcCoords);
        System.out.printf("Difference:  %s%n", webGeocalcCoords.subtract(coords));

        //assertThat(stateSolver.positionForDate(jde)).isEqualTo(expected, offset);
    }

    //@Test
    public void testSteps() throws JplException {

        StateSolver marsBarycenterStateSolver = TestData_mar097.SPK_KERNEL.stateSolver()
                .target(JplBody.MarsBarycenter)
                .observer(JplBody.SolarSystemBarycenter)
                .build();

        StateSolver earthBarycenterStateSolver = TestData_mar097.SPK_KERNEL.stateSolver()
                .target(JplBody.EarthMoonBarycenter)
                .observer(JplBody.SolarSystemBarycenter)
                .build();

        final double jde = JulianDay.fromDate(2019, 10, 9);
        RectangularCoordinates marsBarycenterCoords = marsBarycenterStateSolver.positionFor(jde);
        RectangularCoordinates earthBarycenterCoords = earthBarycenterStateSolver.positionFor(jde);

        RectangularCoordinates marsFromEarthCoords = marsBarycenterCoords.subtract(earthBarycenterCoords);

        RectangularCoordinates webMarsBarycenterCoords = new RectangularCoordinates(-247409747.51617280, 16466167.60750699, 14191652.12720289);
        RectangularCoordinates webEarthBarycenterCoords = new RectangularCoordinates(143815286.15021837, 36853958.95777975, 15976402.75605237);
        RectangularCoordinates webGeocalcCoords = webMarsBarycenterCoords.subtract(webEarthBarycenterCoords);

        System.out.printf("%nSteps%n");
        System.out.printf("Mars Barycenter:    %s%n", marsBarycenterCoords);
        System.out.printf("Mars Barycenter W:  %s%n", webMarsBarycenterCoords);
        System.out.printf("Earth Barycenter:   %s%n", earthBarycenterCoords);
        System.out.printf("Earth Barycenter W: %s%n", webEarthBarycenterCoords);
        System.out.printf("Difference:         %s%n", marsFromEarthCoords);
        System.out.printf("Difference W:       %s%n", webGeocalcCoords);

        double distanceToMars = marsFromEarthCoords.length();
        double distanceToMarsW = 391759970.31118220;

        System.out.printf("%nDistance  :       %s%n", distanceToMars);
        System.out.printf("Distance W:       %s%n", distanceToMarsW);
        System.out.printf("Difference:         %s%n", distanceToMarsW - distanceToMars);

        double lightTravel = distanceToMars / 299792.458;
        double lightTravelW = 1306.77060032;

        System.out.printf("%nLight travel M-E  :       %s%n", lightTravel);
        System.out.printf("Light travel M-E W:       %s%n", lightTravelW);
        System.out.printf("Diff              :       %s%n", lightTravelW - lightTravel);

        double jdeCorrected = jde - lightTravel / (24.0 * 60.0 * 60.0);

        System.out.printf("%nCorrected time  :       %s%n", jdeCorrected);

        RectangularCoordinates correctedMarsBarycenterCoords = marsBarycenterStateSolver.positionFor(jdeCorrected);
        RectangularCoordinates correctedMarsBarycenterCoordsW = new RectangularCoordinates(-247408398.65919995, 16492417.09709396, 14203655.59251832);
        System.out.printf("Corrected Mars Barycenter:    %s%n", correctedMarsBarycenterCoords);
        System.out.printf("Corrected Mars Barycenter W:  %s%n", correctedMarsBarycenterCoordsW);
        System.out.printf("Difference:         %s%n", correctedMarsBarycenterCoordsW.subtract(correctedMarsBarycenterCoords));

        RectangularCoordinates correctedMarsFromEarthCoords = correctedMarsBarycenterCoords.subtract(earthBarycenterCoords);
        RectangularCoordinates correctedMarsFromEarthCoordsW = new RectangularCoordinates(-391223684.80939984, -20361541.86032661, -1772747.16336980);

        System.out.printf("%nCorrected Mars from Eearth:    %s%n", correctedMarsFromEarthCoords);
        System.out.printf("Corrected Mars from Eearth: W  %s%n", correctedMarsFromEarthCoordsW);
        System.out.printf("Difference:         %s%n", correctedMarsFromEarthCoordsW.subtract(correctedMarsFromEarthCoords));

        for (double jdeTick = 2458765.48487533; jdeTick <= 2458765.48487535; jdeTick += 0.000000001) {
            RectangularCoordinates tickedMarsBarycenterCoords = marsBarycenterStateSolver.positionFor(jdeTick);
            RectangularCoordinates tickedMarsFromEarthCoords = tickedMarsBarycenterCoords.subtract(earthBarycenterCoords);

            RectangularCoordinates diff = correctedMarsFromEarthCoordsW.subtract(tickedMarsFromEarthCoords);
            System.out.printf("Tick %s \t %s \t %s%n", jdeTick, diff, diff.length());
        }

    }

}
