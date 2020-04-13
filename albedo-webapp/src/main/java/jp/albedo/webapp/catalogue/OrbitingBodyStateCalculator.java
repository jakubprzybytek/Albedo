package jp.albedo.webapp.catalogue;

import jp.albedo.common.Orbit;
import jp.albedo.common.Year;
import jp.albedo.webapp.ephemeris.orbitbased.OrbitingBodyRecord;
import org.springframework.stereotype.Service;

@Service
public class OrbitingBodyStateCalculator {

    public OrbitingBodyStateRecord calculateState(OrbitingBodyRecord orbitingBodyRecord) {
        final double orbitalPeriod = Orbit.getOrbitalPeriod(orbitingBodyRecord.getOrbitElements().getSemiMajorAxis());

        return new OrbitingBodyStateRecord(
                orbitingBodyRecord,
                orbitalPeriod / Year.SOLAR_DAYS,
                orbitalPeriod
        );
    }

}
