package jp.albedo.jpl.state;

import jp.albedo.common.JulianDay;
import jp.albedo.common.RectangularCoordinates;
import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.files.util.EphemerisSeconds;
import jp.albedo.jpl.kernel.KernelRepository;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class StateSolverTest {

    @Mock
    private static KernelRepository kernel;

    @BeforeAll
    static void setup() throws JplException {
        kernel = mock(KernelRepository.class);

        when(kernel.getChebyshevDataFor(JplBody.EarthMoonBarycenter, JplBody.SolarSystemBarycenter))
                .thenReturn(TestData.MOON_EARTH_BARYCENTER_FOR_2019_10_09);
    }

    @Test
    public void test() throws JplException {
        StateSolver solver = new StateSolver(kernel, JplBody.EarthMoonBarycenter, JplBody.SolarSystemBarycenter);
        final RectangularCoordinates coordinates = solver.forDate(EphemerisSeconds.fromJde(JulianDay.fromDate(2019, 10, 9)));

        assertAll(
                () -> assertEquals(1.4381528622865087E8, coordinates.x),
                () -> assertEquals(3.685395897885629E7, coordinates.y),
                () -> assertEquals(1.5976402576868005E7, coordinates.z));
    }

}
