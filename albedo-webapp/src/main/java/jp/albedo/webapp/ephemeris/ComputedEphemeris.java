package jp.albedo.webapp.ephemeris;

import jp.albedo.common.BodyDetails;
import jp.albedo.common.ephemeris.Ephemeris;
import jp.albedo.common.magnitude.MagnitudeParameters;
import jp.albedo.jeanmeeus.ephemeris.common.OrbitElements;

import java.util.List;

public class ComputedEphemeris {

    final private BodyDetails bodyDetails;

    final private List<Ephemeris> ephemerisList;

    private OrbitElements orbitElements;

    private MagnitudeParameters magnitudeParameters;

    public ComputedEphemeris(BodyDetails bodyDetails, List<Ephemeris> ephemerisList, OrbitElements orbitElements, MagnitudeParameters magnitudeParameters) {
        this.bodyDetails = bodyDetails;
        this.ephemerisList = ephemerisList;
        this.orbitElements = orbitElements;
        this.magnitudeParameters = magnitudeParameters;
    }

    public ComputedEphemeris(BodyDetails bodyDetails, List<Ephemeris> ephemerisList) {
        this.bodyDetails = bodyDetails;
        this.ephemerisList = ephemerisList;
    }

    public BodyDetails getBodyDetails() {
        return bodyDetails;
    }

    public List<Ephemeris> getEphemerisList() {
        return ephemerisList;
    }

    public OrbitElements getOrbitElements() {
        return orbitElements;
    }

    public MagnitudeParameters getMagnitudeParameters() {
        return magnitudeParameters;
    }
}
