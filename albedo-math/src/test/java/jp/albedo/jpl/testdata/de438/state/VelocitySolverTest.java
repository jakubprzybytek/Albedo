package jp.albedo.jpl.testdata.de438.state;

import jp.albedo.common.AstronomicalCoordinates;
import jp.albedo.common.JulianDay;
import jp.albedo.common.Radians;
import jp.albedo.common.RectangularCoordinates;
import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.state.StateSolver;
import jp.albedo.jpl.testdata.de438.TestData_de438;
import jp.albedo.jpl.WebGeocalc;
import jp.albedo.jpl.kernel.SpkKernelRepository;
import jp.albedo.testutils.AlbedoAssertions;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.within;

public class VelocitySolverTest {

    private static final SpkKernelRepository kernel = TestData_de438.SPK_KERNEL;

    @Test
    @Disabled
    void test() throws JplException {
        // https://naif.jpl.nasa.gov/pub/naif/toolkit_docs/C/req/abcorr.html
        // https://naif.jpl.nasa.gov/pub/naif/toolkit_docs/C/cspice/spkezr_c.html
        StateSolver earthStateSolver = kernel.stateSolver()
                .target(JplBody.Earth)
                .observer(JplBody.SolarSystemBarycenter)
                .build();
        StateSolver venusStateSolver = kernel.stateSolver()
                .target(JplBody.Venus)
                .observer(JplBody.SolarSystemBarycenter)
                .build();

        final double jde = JulianDay.fromDate(2019, 10, 9);
        final double h = 20.0 / 24.0 / 60.0;

        final RectangularCoordinates earthCoords = earthStateSolver.positionFor(jde);
        final RectangularCoordinates earthVeocity = solveForVelocity(earthStateSolver, jde, h);

        AlbedoAssertions.assertThat(earthCoords)
                .isEqualTo(new RectangularCoordinates(143811431.38536263, 36856636.26047815, 15977858.62839704), WebGeocalc.WEB_GEOCALC_OFFSET);

        Assertions.assertAll(
                () -> assertThat(earthVeocity.x).isEqualTo(-8.28800016, within(0.00000005)), // should be 0.00000001
                () -> assertThat(earthVeocity.y).isEqualTo(26.26862273, within(0.00000005)),
                () -> assertThat(earthVeocity.z).isEqualTo(11.38875396, within(0.00000005)));

        System.out.println(earthCoords);
        System.out.printf("Velocity [%f, %f, %f]%n", earthVeocity.x, earthVeocity.y, earthVeocity.z);

        final RectangularCoordinates venusCoords = venusStateSolver.positionFor(jde);
        AlbedoAssertions.assertThat(venusCoords)
                .isEqualTo(new RectangularCoordinates(-68662675.63881429, -77239788.61925617, -30455268.59037707), WebGeocalc.WEB_GEOCALC_OFFSET);

        final RectangularCoordinates earthToVenusCoors = venusCoords.subtract(earthCoords);
        AlbedoAssertions.assertThat(earthToVenusCoors)
                .isEqualTo(new RectangularCoordinates(-212474107.02417690, -114096424.87973432, -46433127.21877411), WebGeocalc.WEB_GEOCALC_OFFSET);

        double lightTime = earthToVenusCoors.length() / 299792.457999999984;
        assertThat(lightTime).isEqualTo(819.23284486, within(0.00000001));

        double correctedJde = jde - lightTime / (24.0 * 60.0 * 60.0);
        System.out.println("Corrected jde: " + correctedJde);

        final RectangularCoordinates correctedVenusCoords = venusStateSolver.positionFor(correctedJde);
        AlbedoAssertions.assertThat(correctedVenusCoords)
                .isEqualTo(new RectangularCoordinates(-68684745.81877930, -77223690.37511934, -30446628.31928106), WebGeocalc.WEB_GEOCALC_OFFSET);

        final RectangularCoordinates correctedEarthToVenusCoors = correctedVenusCoords.subtract(earthCoords);
        AlbedoAssertions.assertThat(correctedEarthToVenusCoors)
                .isEqualTo(new RectangularCoordinates(-212496177.20393000, -114080326.63575213, -46424486.94776109), within(0.0003));

        final double w = Radians.between(earthVeocity, correctedEarthToVenusCoors);
        final double phi = Math.asin(earthVeocity.length() * Math.sin(w) / 299792.457999999984);

        assertThat(Math.toDegrees(w)).isEqualTo(103.94531687918045);
        assertThat(Math.toDegrees(phi)).isEqualTo(0.005528687737315572);

        final RectangularCoordinates rotationVector = correctedEarthToVenusCoors.crossProduct(earthVeocity);

        final RectangularCoordinates starAberrationCorrected = correctedEarthToVenusCoors.rotate(rotationVector, phi);
        AlbedoAssertions.assertThat(starAberrationCorrected)
                .isEqualTo(new RectangularCoordinates(-212508057.87354735, -114061538.56867133, -46416268.67949757), within(0.0002));

        final AstronomicalCoordinates astroCoords = AstronomicalCoordinates.fromRectangular(starAberrationCorrected);
        AlbedoAssertions.assertThat(astroCoords)
                .isEqualTo(AstronomicalCoordinates.fromDegrees(208.22422699, -10.89348428));
    }

    private RectangularCoordinates solveForVelocity(StateSolver stateSolver, double jde, double h) {
        RectangularCoordinates coordsMinus = stateSolver.positionFor(jde - h);
        RectangularCoordinates coordsPlus = stateSolver.positionFor(jde + h);

        return new RectangularCoordinates(
                (coordsPlus.x - coordsMinus.x) / (2 * h) / (24.0 * 60.0 * 60.0),
                (coordsPlus.y - coordsMinus.y) / (2 * h) / (24.0 * 60.0 * 60.0),
                (coordsPlus.z - coordsMinus.z) / (2 * h) / (24.0 * 60.0 * 60.0));
    }

    private RectangularCoordinates solveForVelocity2(StateSolver stateSolver, double jde, double h) {
        RectangularCoordinates coordsMinus2 = stateSolver.positionFor(jde - 2.0 * h);
        RectangularCoordinates coordsMinus = stateSolver.positionFor(jde - h);
        RectangularCoordinates coordsPlus = stateSolver.positionFor(jde + h);
        RectangularCoordinates coordsPlus2 = stateSolver.positionFor(jde + 2.0 * h);

        return new RectangularCoordinates(
                (-coordsPlus2.x + 8.0 * coordsPlus.x - 8.0 * coordsMinus.x + coordsMinus2.x) / (12.0 * h) / (24.0 * 60.0 * 60.0),
                (-coordsPlus2.y + 8.0 * coordsPlus.y - 8.0 * coordsMinus.y + coordsMinus2.y) / (12.0 * h) / (24.0 * 60.0 * 60.0),
                (-coordsPlus2.z + 8.0 * coordsPlus.z - 8.0 * coordsMinus.z + coordsMinus2.z) / (12.0 * h) / (24.0 * 60.0 * 60.0));
    }

}
