package jp.albedo.webapp.ephemeris;

import jp.albedo.jpl.JplException;
import jp.albedo.webapp.ephemeris.jpl.BinaryKernelEphemeridesForEarthSolver;
import jp.albedo.webapp.ephemeris.jpl.BinaryKernelEphemeridesForSunSolver;
import jp.albedo.webapp.ephemeris.jpl.BinaryKernelEphemerisBodyParser;
import jp.albedo.webapp.ephemeris.jpl.JplBinaryKernelsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class EphemeridesSolverProvider {

    private BinaryKernelEphemerisBodyParser binaryKernelEphemerisBodyParser;

    private BinaryKernelEphemeridesForEarthSolver binaryKernelEphemeridesForEarthSolver;

    private BinaryKernelEphemeridesForSunSolver binaryKernelEphemeridesForSunSolver;

    @Autowired
    private JplBinaryKernelsService jplBinaryKernelsService;

    public EphemerisBodyParser getEphemerisBodyParser(String ephemerisMethod) throws EphemerisException {
        if (binaryKernelEphemerisBodyParser == null) {
            try {
                binaryKernelEphemerisBodyParser = new BinaryKernelEphemerisBodyParser(jplBinaryKernelsService.getSpKernel());
            } catch (IOException | JplException e) {
                throw new EphemerisException("Cannot create ephemeris body name parser", e);
            }
        }

        return binaryKernelEphemerisBodyParser;
    }

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

    public EphemeridesSolver getEphemeridesForSunSolver(String ephemerisMethod) throws EphemerisException {
        if (binaryKernelEphemeridesForSunSolver == null) {
            try {
                binaryKernelEphemeridesForSunSolver = new BinaryKernelEphemeridesForSunSolver(jplBinaryKernelsService.getSpKernel());
            } catch (IOException | JplException e) {
                throw new EphemerisException("Cannot create ephemeris calculator", e);
            }
        }

        return binaryKernelEphemeridesForSunSolver;
    }

}
