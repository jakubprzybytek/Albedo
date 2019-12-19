package jp.albedo.webapp.ephemeris;

import jp.albedo.common.BodyDetails;
import jp.albedo.common.ephemeris.Ephemeris;
import jp.albedo.common.magnitude.MagnitudeParameters;
import jp.albedo.jeanmeeus.ephemeris.common.OrbitElements;

import java.util.List;

public class ComputedEphemerides {

    final private BodyDetails bodyDetails;

    final private List<Ephemeris> ephemerides;

    private OrbitElements orbitElements;

    private MagnitudeParameters magnitudeParameters;

    public ComputedEphemerides(BodyDetails bodyDetails, List<Ephemeris> ephemerides, OrbitElements orbitElements, MagnitudeParameters magnitudeParameters) {
        this.bodyDetails = bodyDetails;
        this.ephemerides = ephemerides;
        this.orbitElements = orbitElements;
        this.magnitudeParameters = magnitudeParameters;
    }

    public ComputedEphemerides(BodyDetails bodyDetails, List<Ephemeris> ephemerides) {
        this.bodyDetails = bodyDetails;
        this.ephemerides = ephemerides;
    }

    public BodyDetails getBodyDetails() {
        return bodyDetails;
    }

    public List<Ephemeris> getEphemerides() {
        return ephemerides;
    }

    public OrbitElements getOrbitElements() {
        return orbitElements;
    }

    public MagnitudeParameters getMagnitudeParameters() {
        return magnitudeParameters;
    }
}
