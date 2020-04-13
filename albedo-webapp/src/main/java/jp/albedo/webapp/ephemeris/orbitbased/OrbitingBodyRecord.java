package jp.albedo.webapp.ephemeris.orbitbased;

import jp.albedo.common.BodyDetails;
import jp.albedo.common.magnitude.MagnitudeParameters;
import jp.albedo.jeanmeeus.ephemeris.common.OrbitElements;

public class OrbitingBodyRecord {

    private BodyDetails bodyDetails;

    private MagnitudeParameters magnitudeParameters;

    private OrbitElements orbitElements;

    public OrbitingBodyRecord(BodyDetails bodyDetails, MagnitudeParameters magnitudeParameters, OrbitElements orbitElements) {
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
