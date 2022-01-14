package jp.albedo.webapp.ephemeris;

import jp.albedo.webapp.ephemeris.jpl.BinaryKernelEphemeridesSolver;
import jp.albedo.webapp.ephemeris.orbitbased.OrbitBasedEphemerisSolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class EphemeridesSolverProvider {

    @Autowired
    private OrbitBasedEphemerisSolver orbitBasedEphemerisSolver;

    @Autowired
    private BinaryKernelEphemeridesSolver binaryKernelEphemeridesSolver;

    public EphemeridesSolver getForBodyName(String bodyName) throws EphemerisException {
        if (binaryKernelEphemeridesSolver.parse(bodyName).isPresent()) {
            return binaryKernelEphemeridesSolver;
        }

        if (orbitBasedEphemerisSolver.parse(bodyName).isPresent()) {
            return orbitBasedEphemerisSolver;
        }

        throw new EphemerisException("Cannot find solver for: " + bodyName);
    }

}
