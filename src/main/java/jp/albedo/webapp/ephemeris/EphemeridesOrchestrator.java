package jp.albedo.webapp.ephemeris;

import jp.albedo.ephemeris.Ephemeris;
import jp.albedo.jpl.Body;
import jp.albedo.webapp.ephemeris.jpl.JplEphemerisCalculator;
import jp.albedo.webapp.ephemeris.orbitbased.OrbitBasedEphemerisCalculator;
import jp.albedo.webapp.services.OrbitingBodyRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Component
public class EphemeridesOrchestrator {

    @Autowired
    private JplEphemerisCalculator jplEphemerisCalculator;

    @Autowired
    private OrbitBasedEphemerisCalculator orbitBasedEphemerisCalculator;

    public ComputedEphemerides ephemeris(String bodyName, LocalDate fromDate, LocalDate toDate, double interval) throws Exception {

        final Optional<Body> jplSupportedBody = this.jplEphemerisCalculator.parseBody(bodyName);
        if (jplSupportedBody.isPresent()) {
            final Body body = jplSupportedBody.get();
            final List<Ephemeris> ephemerides = this.jplEphemerisCalculator.compute(body, fromDate, toDate, interval);

            return new ComputedEphemerides(body.toBodyDetails(), ephemerides);
        }

        final Optional<OrbitingBodyRecord> orbitingBodyRecordOptional = this.orbitBasedEphemerisCalculator.findBody(bodyName);

        if (!orbitingBodyRecordOptional.isPresent()) {
            throw new Exception("Body not found: " + bodyName);
        }

        final OrbitingBodyRecord orbitingBodyRecord = orbitingBodyRecordOptional.get();
        final List<Ephemeris> ephemerides = this.orbitBasedEphemerisCalculator.compute(orbitingBodyRecord, fromDate, toDate, interval);

        return new ComputedEphemerides(orbitingBodyRecord.getBodyDetails(), ephemerides, orbitingBodyRecord.getOrbitElements(), orbitingBodyRecord.getMagnitudeParameters());
    }

}
