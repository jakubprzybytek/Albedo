package jp.albedo.webapp.external;

import jp.albedo.common.BodyDetails;
import jp.albedo.ephemeris.common.MagnitudeParameters;
import jp.albedo.ephemeris.common.OrbitElements;

public class BodyRecord {

    private BodyDetails bodyDetails;

    private MagnitudeParameters magnitudeParameters;

    private OrbitElements orbitElements;

    public BodyRecord(BodyDetails bodyDetails, MagnitudeParameters magnitudeParameters, OrbitElements orbitElements) {
        this.bodyDetails = bodyDetails;
        this.magnitudeParameters = magnitudeParameters;
        this.orbitElements = orbitElements;
    }

    public BodyDetails getBodyDetails() {
        return bodyDetails;
    }

    public MagnitudeParameters getMagnitudeParameters() {
        return magnitudeParameters;
    }

    public OrbitElements getOrbitElements() {
        return orbitElements;
    }
}
