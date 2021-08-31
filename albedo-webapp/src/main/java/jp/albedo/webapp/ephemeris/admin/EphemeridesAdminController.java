package jp.albedo.webapp.ephemeris.admin;

import jp.albedo.webapp.ephemeris.admin.rest.KernelInfo;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class EphemeridesAdminController {

    private static final Log LOG = LogFactory.getLog(EphemeridesAdminController.class);

    @Autowired
    private EphemeridesAdminOrchestrator ephemeridesAdminOrchestrator;

    @RequestMapping(method = RequestMethod.GET, path = "/api/ephemeris/admin")
    public List<KernelInfo> ephemeris() throws Exception {

        LOG.info("Request to return admin information about JPL Kernels");

        return this.ephemeridesAdminOrchestrator.listKernels();
    }

}
