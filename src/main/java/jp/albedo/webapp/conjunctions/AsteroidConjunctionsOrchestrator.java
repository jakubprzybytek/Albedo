package jp.albedo.webapp.conjunctions;

import jp.albedo.webapp.services.OrbitingBodyRecord;
import jp.albedo.webapp.services.OrbitsService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@Component
public class AsteroidConjunctionsOrchestrator {

    private static Log LOG = LogFactory.getLog(AsteroidConjunctionsOrchestrator.class);

    @Autowired
    private OrbitsService orbitsService;

    @Autowired
    private AsteroidConjunctionsCalculator asteroidConjunctionsCalculator;

    public List<AsteroidConjunctionsCalculator.Conjunction> orchestrate(LocalDate fromDate, LocalDate toDate) throws IOException {

        LOG.info(String.format("Processing request for asteroid conjunctions, params: [from=%s, to=%s]", fromDate, toDate));

        final List<OrbitingBodyRecord> bodies = this.orbitsService.getAll();
        return this.asteroidConjunctionsCalculator.calculate(bodies, fromDate, toDate);
    }

}
