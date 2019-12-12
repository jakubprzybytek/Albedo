package jp.albedo.mpc;

import jp.albedo.common.BodyDetails;
import jp.albedo.jeanmeeus.ephemeris.common.MagnitudeParameters;
import jp.albedo.jeanmeeus.ephemeris.common.OrbitElements;

public class MPCRecord {

    public BodyDetails bodyDetails;

    public MagnitudeParameters magnitudeParameters;

    public OrbitElements orbitElements;

    public MPCRecord(BodyDetails bodyDetails, MagnitudeParameters magnitudeParameters, OrbitElements orbitElements) {
        this.bodyDetails = bodyDetails;
        this.magnitudeParameters = magnitudeParameters;
        this.orbitElements = orbitElements;
    }

}
