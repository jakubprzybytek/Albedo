package jp.albedo.webapp.ephemeris.admin;

import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.kernel.SpkKernelCollection;
import jp.albedo.jpl.kernel.SpkKernelRepository;
import jp.albedo.jpl.kernel.tree.ForestEdgeVisitor;
import jp.albedo.webapp.ephemeris.admin.rest.KernelInfo;
import jp.albedo.webapp.ephemeris.jpl.JplBinaryKernelsService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Optional;

@Component
public class EphemeridesAdminOrchestrator {

    private static final Log LOG = LogFactory.getLog(EphemeridesAdminOrchestrator.class);

    @Autowired
    private JplBinaryKernelsService jplBinaryKernelsService;

    public ArrayList<KernelInfo> listKernels() throws IOException, JplException {
        SpkKernelRepository repository = jplBinaryKernelsService.getSpKernel();

        ArrayList<KernelInfo> kernelInfos = new ArrayList<>();
        ForestEdgeVisitor<JplBody, SpkKernelCollection, KernelInfo> forestEdgeVisitor = repository.edgeVisitor(this::describeSpkKernelCollection);

        Optional<KernelInfo> kernelInfo = forestEdgeVisitor.visitNext();
        while (kernelInfo.isPresent()) {
            kernelInfos.add(kernelInfo.get());
            kernelInfo = forestEdgeVisitor.visitNext();
        }

        return kernelInfos;
    }

    private KernelInfo describeSpkKernelCollection(SpkKernelCollection spkKernelCollection) {
        return new KernelInfo(spkKernelCollection.getBody(),
                spkKernelCollection.getCenterBody(),
                spkKernelCollection.getReferenceFrame(),
                spkKernelCollection.getPositionData().size(),
                spkKernelCollection.getPositionAndVelocityData().size());
    }

}
