package jp.albedo.webapp.ephemeris;

import jp.albedo.jpl.JplException;
import jp.albedo.webapp.ephemeris.jpl.BinaryKernelEphemeridesForEarthSolver;
import jp.albedo.webapp.ephemeris.jpl.JplBinaryKernelsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class EphemeridesSolverProvider {

    private BinaryKernelEphemeridesForEarthSolver binaryKernelEphemeridesForEarthSolver;

    @Autowired
    private JplBinaryKernelsService jplBinaryKernelsService;

    public EphemeridesSolver getEphemeridesForEarthSolver(String ephemerisMethod) throws EphemerisException {
        if (binaryKernelEphemeridesForEarthSolver == null) {
            try {
                binaryKernelEphemeridesForEarthSolver = new BinaryKernelEphemeridesForEarthSolver(jplBinaryKernelsService.getSpKernel());
            } catch (IOException | JplException e) {
                throw new EphemerisException("Cannot create ephemeris calculator", e);
            }
        }

        return binaryKernelEphemeridesForEarthSolver;
    }

}
