package jp.albedo.webapp.ephemeris;

import jp.albedo.common.BodyDetails;
import jp.albedo.ephemeris.Ephemeris;
import jp.albedo.common.magnitude.MagnitudeParameters;
import jp.albedo.jeanmeeus.ephemeris.common.OrbitElements;
import org.springframework.lang.Nullable;

import java.util.List;

public class ComputedEphemeris<T> {

    private final BodyDetails bodyDetails;

    private final List<T> ephemerisList;

    @Nullable
    private OrbitElements orbitElements;

    @Nullable
    private MagnitudeParameters magnitudeParameters;

    private final String engine;

    public ComputedEphemeris(BodyDetails bodyDetails, List<T> ephemerisList, OrbitElements orbitElements, MagnitudeParameters magnitudeParameters, String engine) {
        this.bodyDetails = bodyDetails;
        this.ephemerisList = ephemerisList;
        this.orbitElements = orbitElements;
        this.magnitudeParameters = magnitudeParameters;
        this.engine = engine;
    }

    public ComputedEphemeris(BodyDetails bodyDetails, List<T> ephemerisList, String engine) {
        this.bodyDetails = bodyDetails;
        this.ephemerisList = ephemerisList;
        this.engine = engine;
    }

    public BodyDetails getBodyDetails() {
        return bodyDetails;
    }

    public List<T> getEphemerisList() {
        return ephemerisList;
    }

    public OrbitElements getOrbitElements() {
        return orbitElements;
    }

    public MagnitudeParameters getMagnitudeParameters() {
        return magnitudeParameters;
    }

    public String getEngine() {
        return engine;
    }
}
