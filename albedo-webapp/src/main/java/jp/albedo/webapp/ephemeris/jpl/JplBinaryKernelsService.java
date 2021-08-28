package jp.albedo.webapp.ephemeris.jpl;

import jp.albedo.common.JulianDay;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.kernel.SpkKernelLoader;
import jp.albedo.jpl.kernel.SpkKernelRepository;
import jp.albedo.utils.FunctionUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;

@Service
public class JplBinaryKernelsService {

    @Value("${binarySpkKernel.fileNames}")
    private String binarySpkKernelFileNames;

    private SpkKernelRepository spKernel;

    private synchronized SpkKernelRepository loadSPKernel() throws JplException {

        if (this.spKernel != null) {
            return this.spKernel;
        }

        SpkKernelLoader loader = new SpkKernelLoader()
                .forDateRange(JulianDay.fromDate(1950, 12, 31), JulianDay.fromDate(2100, 1, 25));

        Arrays.stream(binarySpkKernelFileNames.split(","))
                .map(File::new)
                .forEach(FunctionUtils.wrapConsumer(loader::load));

        return loader.kernel();
    }

    public SpkKernelRepository getSpKernel() throws IOException, JplException {
        if (this.spKernel == null) {
            this.spKernel = loadSPKernel();
        }

        return spKernel;
    }

}
