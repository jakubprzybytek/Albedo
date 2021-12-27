package jp.albedo.webapp.ephemeris;

import jp.albedo.jpl.JplException;
import jp.albedo.webapp.ephemeris.jpl.BinaryKernelEphemeridesCalculator;
import jp.albedo.webapp.ephemeris.jpl.JplBinaryKernelsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class EphemeridesCalculatorProvider {

    private BinaryKernelEphemeridesCalculator binaryKernelEphemeridesCalculator;

    @Autowired
    private JplBinaryKernelsService jplBinaryKernelsService;

    public EphemeridesCalculator getEphemeridesCalculator(String ephemerisMethod) throws IOException, JplException {
        if (binaryKernelEphemeridesCalculator == null) {
            binaryKernelEphemeridesCalculator = new BinaryKernelEphemeridesCalculator(jplBinaryKernelsService.getSpKernel());
        }

        return binaryKernelEphemeridesCalculator;
    }

}
