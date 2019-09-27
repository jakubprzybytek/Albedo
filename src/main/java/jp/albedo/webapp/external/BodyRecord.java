package jp.albedo.webapp.external;

import jp.albedo.common.BodyDetails;
import jp.albedo.ephemeris.common.OrbitElements;

public class BodyRecord {

    private BodyDetails bodyDetails;

    private OrbitElements orbitElements;

    public BodyRecord(BodyDetails bodyDetails, OrbitElements orbitElements) {
        this.bodyDetails = bodyDetails;
        this.orbitElements = orbitElements;
    }

    public BodyDetails getBodyDetails() {
        return bodyDetails;
    }

    public OrbitElements getOrbitElements() {
        return orbitElements;
    }
}
