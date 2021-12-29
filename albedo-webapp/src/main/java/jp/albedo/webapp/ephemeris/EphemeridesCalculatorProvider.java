package jp.albedo.webapp.ephemeris;

import jp.albedo.jpl.JplException;
import jp.albedo.webapp.ephemeris.jpl.BinaryKernelEphemeridesCalculator;
import jp.albedo.webapp.ephemeris.jpl.BinaryKernelEphemerisBodyParser;
import jp.albedo.webapp.ephemeris.jpl.JplBinaryKernelsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class EphemeridesCalculatorProvider {

    private BinaryKernelEphemerisBodyParser binaryKernelEphemerisBodyParser;

    private BinaryKernelEphemeridesCalculator binaryKernelEphemeridesCalculator;

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

    public EphemeridesCalculator getEphemeridesCalculator(String ephemerisMethod) throws EphemerisException {
        if (binaryKernelEphemeridesCalculator == null) {
            try {
                binaryKernelEphemeridesCalculator = new BinaryKernelEphemeridesCalculator(jplBinaryKernelsService.getSpKernel());
            } catch (IOException | JplException e) {
                throw new EphemerisException("Cannot create ephemeris calculator", e);
            }
        }

        return binaryKernelEphemeridesCalculator;
    }

}
