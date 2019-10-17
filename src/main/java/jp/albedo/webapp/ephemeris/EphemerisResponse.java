package jp.albedo.webapp.ephemeris;

import jp.albedo.webapp.services.OrbitingBodyRecord;

import java.util.List;

public class EphemerisResponse {

    private OrbitingBodyRecord orbitingBodyRecord;

    private List<RestEphemeris> ephemerisList;

    public EphemerisResponse(OrbitingBodyRecord orbitingBodyRecord, List<RestEphemeris> ephemerisList) {
        this.orbitingBodyRecord = orbitingBodyRecord;
        this.ephemerisList = ephemerisList;
    }

    public OrbitingBodyRecord getOrbitingBodyRecord() {
        return orbitingBodyRecord;
    }

    public List<RestEphemeris> getEphemerisList() {
        return ephemerisList;
    }

}
