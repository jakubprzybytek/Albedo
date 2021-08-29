package jp.albedo.webapp.ephemeris.jpl;

import jp.albedo.common.JulianDay;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.kernel.SpkKernelLoader;
import jp.albedo.jpl.kernel.SpkKernelRepository;
import jp.albedo.utils.FunctionUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.Arrays;

@Service
public class JplBinaryKernelsService {

    private static final Log LOG = LogFactory.getLog(JplBinaryKernelsService.class);

    @Value("${binarySpkKernel.loadData.startDate}")
    private String loadDataStartDate;

    @Value("${binarySpkKernel.loadData.endDate}")
    private String loadDataEndDate;

    @Value("${binarySpkKernel.fileNames}")
    private String binarySpkKernelFileNames;

    private SpkKernelRepository spKernel;

    private synchronized SpkKernelRepository loadSPKernel() throws JplException {

        if (this.spKernel != null) {
            return this.spKernel;
        }

        final double loadDataStartDay = JulianDay.fromDate(LocalDate.parse(loadDataStartDate));
        final double loadDataEndDay = JulianDay.fromDate(LocalDate.parse(loadDataEndDate));

        LOG.info(String.format("Loading SPK kernels for dates %s(%s) and %s(%s)", loadDataStartDate, loadDataStartDay, loadDataEndDate, loadDataEndDay));

        final SpkKernelLoader loader = new SpkKernelLoader()
                .forDateRange(loadDataStartDay, loadDataEndDay);

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
