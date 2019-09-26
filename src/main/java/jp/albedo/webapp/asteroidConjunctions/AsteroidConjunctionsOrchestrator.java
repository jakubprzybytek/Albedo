package jp.albedo.webapp.asteroidConjunctions;

import jp.albedo.common.BodyDetails;
import jp.albedo.ephemeris.common.OrbitElements;
import jp.albedo.mpc.MPCORBFileLoader;
import jp.albedo.mpc.MPCORBRecord;
import jp.albedo.sandbox.AsteroidConjunctionsCalculator;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.commons.math3.util.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class AsteroidConjunctionsOrchestrator {

    private static Log LOG = LogFactory.getLog(AsteroidConjunctionsOrchestrator.class);

    @Autowired
    private AsteroidConjunctionsCalculator asteroidConjunctionsCalculator;

    public List<AsteroidConjunctionsCalculator.Conjunction> orchestrate(LocalDate fromDate, LocalDate toDate) throws IOException {

        LOG.info(String.format("Processing request for asteroid conjunctions, params: [from=%s, to=%s]", fromDate, toDate));

        final List<MPCORBRecord> records = MPCORBFileLoader.load(new File("d:/Workspace/Java/Albedo/misc/MPCORB.DAT"), 400);
        final List<Pair<BodyDetails, OrbitElements>> bodies = records.stream()
                .map(record -> new Pair<>(record.bodyDetails, record.orbitElements))
                .collect(Collectors.toList());

        return this.asteroidConjunctionsCalculator.calculate(bodies, fromDate, toDate);
    }

}
