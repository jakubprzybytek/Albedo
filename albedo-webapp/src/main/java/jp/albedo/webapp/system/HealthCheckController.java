package jp.albedo.webapp.system;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthCheckController {

    @RequestMapping(method = RequestMethod.GET, path = "/api/healthcheck")
    public ResponseEntity<?> healthCheck() throws Exception {
        return ResponseEntity.status(200).build();
    }

}
