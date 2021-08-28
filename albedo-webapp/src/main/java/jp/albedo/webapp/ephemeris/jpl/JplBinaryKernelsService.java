package jp.albedo.webapp.ephemeris.jpl;

import jp.albedo.common.JulianDay;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.kernel.SpkKernelLoader;
import jp.albedo.jpl.kernel.SpkKernelRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;

@Service
public class JplBinaryKernelsService {

    @Value("${binarySpkKernel.fileName}")
    private String binarySpkKernelFileName;

    private SpkKernelRepository spKernel;

    private synchronized SpkKernelRepository loadSPKernel() throws JplException {

        if (this.spKernel != null) {
            return this.spKernel;
        }

        return new SpkKernelLoader()
                .forDateRange(JulianDay.fromDate(1950, 12, 31), JulianDay.fromDate(2100, 1, 25))
                .load(new File(binarySpkKernelFileName))
                .kernel();
    }

    public SpkKernelRepository getSpKernel() throws IOException, JplException {
        if (this.spKernel == null) {
            this.spKernel = loadSPKernel();
        }

        return spKernel;
    }

}
