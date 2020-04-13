package jp.albedo.webapp.catalogue;

import jp.albedo.common.Orbit;
import jp.albedo.webapp.ephemeris.orbitbased.OrbitingBodyRecord;
import org.springframework.stereotype.Service;

@Service
public class OrbitingBodyStateCalculator {

    public OrbitingBodyStateRecord calculateState(OrbitingBodyRecord orbitingBodyRecord) {

        final OrbitingBodyStateRecord orbitingBodyStateRecord = new OrbitingBodyStateRecord(orbitingBodyRecord);

        if (orbitingBodyRecord.getOrbitElements().getSemiMajorAxis() != null) {
            final double orbitalPeriod = Orbit.getOrbitalPeriod(orbitingBodyRecord.getOrbitElements().getSemiMajorAxis());
            orbitingBodyStateRecord.setOrbitalPeriod(orbitalPeriod);
        }

        return orbitingBodyStateRecord;
    }

}
