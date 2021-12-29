package jp.albedo.webapp.ephemeris;

import jp.albedo.jpl.JplException;
import jp.albedo.webapp.ephemeris.jpl.BinaryKernelEphemeridesSolver;
import jp.albedo.webapp.ephemeris.jpl.BinaryKernelEphemerisBodyParser;
import jp.albedo.webapp.ephemeris.jpl.JplBinaryKernelsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class EphemeridesSolverProvider {

    private BinaryKernelEphemerisBodyParser binaryKernelEphemerisBodyParser;

    private BinaryKernelEphemeridesSolver binaryKernelEphemeridesSolver;

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

    public EphemeridesSolver getEphemeridesCalculator(String ephemerisMethod) throws EphemerisException {
        if (binaryKernelEphemeridesSolver == null) {
            try {
                binaryKernelEphemeridesSolver = new BinaryKernelEphemeridesSolver(jplBinaryKernelsService.getSpKernel());
            } catch (IOException | JplException e) {
                throw new EphemerisException("Cannot create ephemeris calculator", e);
            }
        }

        return binaryKernelEphemeridesSolver;
    }

}
