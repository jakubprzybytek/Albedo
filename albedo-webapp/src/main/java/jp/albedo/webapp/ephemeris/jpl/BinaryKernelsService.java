package jp.albedo.webapp.ephemeris.jpl;

import jp.albedo.common.JulianDay;
import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.kernel.SpkKernelLoader;
import jp.albedo.jpl.kernel.SpkKernelRepository;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BinaryKernelsService {

    private static final Log LOG = LogFactory.getLog(BinaryKernelsService.class);

    @Value("${binarySpkKernel.loadData.startDate}")
    private String loadDataStartDate;

    @Value("${binarySpkKernel.loadData.endDate}")
    private String loadDataEndDate;

    @Value("${binarySpkKernel.fileNames}")
    private String binarySpkKernelFileNames;

    private SpkKernelRepository spKernel;

    private synchronized SpkKernelRepository loadSPKernel() {

        if (this.spKernel != null) {
            return this.spKernel;
        }

        final double loadDataStartDay = JulianDay.fromDate(LocalDate.parse(loadDataStartDate));
        final double loadDataEndDay = JulianDay.fromDate(LocalDate.parse(loadDataEndDate));

        LOG.info(String.format("Loading SPK kernels for dates %s(%s) and %s(%s)", loadDataStartDate, loadDataStartDay, loadDataEndDate, loadDataEndDay));

        final SpkKernelLoader loader = new SpkKernelLoader()
                .forDateRange(loadDataStartDay, loadDataEndDay);

        Arrays.stream(binarySpkKernelFileNames.split(";"))
                .forEach(spkKernelFileOption -> {
                    File kernelFile = new File(parseSpkKernelFileName(spkKernelFileOption));
                    List<JplBody> bodiesToLoad = Arrays.stream(parseSpkKernelBodyNames(spkKernelFileOption))
                            .map(JplBody::valueOf)
                            .collect(Collectors.toList());
                    try {
                        loader.load(kernelFile, bodiesToLoad);
                    } catch (JplException e) {
                        LOG.error("Cannot read kernel file", e);
                    }
                });

        return loader.kernel();
    }

    public SpkKernelRepository getSpKernel() {
        if (this.spKernel == null) {
            this.spKernel = loadSPKernel();
        }

        return spKernel;
    }

    private String parseSpkKernelFileName(String spkKernelFileOption) {
        return spkKernelFileOption.split("\\|")[0];
    }

    private String[] parseSpkKernelBodyNames(String spkKernelFileOption) {
        String[] splitOption = spkKernelFileOption.split("\\|");

        if (splitOption.length == 1) {
            return new String[0];
        }
        return splitOption[1].split(",");
    }

}
