package jp.albedo.webapp.ephemeris;

import jp.albedo.jpl.JplException;
import jp.albedo.webapp.ephemeris.jpl.BinaryKernelEphemeridesSolver;
import jp.albedo.webapp.ephemeris.jpl.JplBinaryKernelsService;
import jp.albedo.webapp.ephemeris.orbitbased.OrbitBasedEphemerisSolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class EphemeridesSolverProvider {

    private BinaryKernelEphemeridesSolver binaryKernelEphemeridesSolver;

    @Autowired
    private OrbitBasedEphemerisSolver orbitBasedEphemerisSolver;

    @Autowired
    private JplBinaryKernelsService jplBinaryKernelsService;

    public EphemeridesSolver getEphemeridesForEarthSolver(String ephemerisMethod) throws EphemerisException {
        if (EphemerisMethod.JeanMeeus.id.equals(ephemerisMethod)) {
            return orbitBasedEphemerisSolver;
        } else if (EphemerisMethod.binary440.id.equals(ephemerisMethod)) {
            if (binaryKernelEphemeridesSolver == null) {
                try {
                    binaryKernelEphemeridesSolver = new BinaryKernelEphemeridesSolver(jplBinaryKernelsService.getSpKernel());
                } catch (IOException | JplException e) {
                    throw new EphemerisException("Cannot create ephemeris calculator", e);
                }
            }

            return binaryKernelEphemeridesSolver;
        }

        throw new EphemerisException("Unsupported ephemeris method: " + ephemerisMethod);
    }

}
