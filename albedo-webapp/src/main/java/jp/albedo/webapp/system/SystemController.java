package jp.albedo.webapp.system;

import jp.albedo.webapp.system.rest.SystemInformation;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SystemController {

    @RequestMapping(method = RequestMethod.GET, path = "/api/system")
    public SystemInformation systemInformation() throws Exception {
        Runtime runtime = Runtime.getRuntime();
        return new SystemInformation(runtime.availableProcessors(), runtime.maxMemory(), runtime.totalMemory(), runtime.freeMemory());
    }

}
