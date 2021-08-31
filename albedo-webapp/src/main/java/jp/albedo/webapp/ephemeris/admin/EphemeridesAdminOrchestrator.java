package jp.albedo.webapp.ephemeris.admin;

import jp.albedo.common.JulianDay;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.kernel.SpkKernelCollection;
import jp.albedo.webapp.ephemeris.admin.rest.KernelInfo;
import jp.albedo.webapp.ephemeris.jpl.JplBinaryKernelsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class EphemeridesAdminOrchestrator {

    @Autowired
    private JplBinaryKernelsService jplBinaryKernelsService;

    public List<KernelInfo> listKernels() throws IOException, JplException {
        return jplBinaryKernelsService.getSpKernel().registeredKernelsStream()
                .map(this::describeSpkKernelCollection)
                .collect(Collectors.toList());
    }

    private KernelInfo describeSpkKernelCollection(SpkKernelCollection spkKernelCollection) {

        LocalDateTime positionDataStartDate = !spkKernelCollection.getPositionData().isEmpty() ? JulianDay.toDateTime(
                spkKernelCollection.getPositionData().get(0).getStartJulianDay()) : null;
        LocalDateTime positionDataEndDate = !spkKernelCollection.getPositionData().isEmpty() ? JulianDay.toDateTime(
                spkKernelCollection.getPositionData().get(spkKernelCollection.getPositionData().size() - 1).getEndJulianDay()) : null;

        LocalDateTime positionAndVelocityDataStartDate = !spkKernelCollection.getPositionAndVelocityData().isEmpty() ? JulianDay.toDateTime(
                spkKernelCollection.getPositionAndVelocityData().get(0).getStartJulianDay()) : null;
        LocalDateTime positionAndVelocityDataEndDate = !spkKernelCollection.getPositionAndVelocityData().isEmpty() ? JulianDay.toDateTime(
                spkKernelCollection.getPositionAndVelocityData().get(spkKernelCollection.getPositionAndVelocityData().size() - 1).getEndJulianDay()) : null;

        return new KernelInfo(spkKernelCollection.getKernelFileName(),
                spkKernelCollection.getBody(),
                spkKernelCollection.getCenterBody(),
                spkKernelCollection.getReferenceFrame(),
                spkKernelCollection.getPositionData().size(),
                positionDataStartDate,
                positionDataEndDate,
                spkKernelCollection.getPositionAndVelocityData().size(),
                positionAndVelocityDataStartDate,
                positionAndVelocityDataEndDate);
    }

}
