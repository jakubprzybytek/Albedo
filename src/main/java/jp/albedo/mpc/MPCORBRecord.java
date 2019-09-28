package jp.albedo.mpc;

import jp.albedo.common.BodyDetails;
import jp.albedo.ephemeris.common.MagnitudeParameters;
import jp.albedo.ephemeris.common.OrbitElements;

public class MPCORBRecord {

    public BodyDetails bodyDetails;

    public MagnitudeParameters magnitudeParameters;

    public OrbitElements orbitElements;

    public MPCORBRecord(BodyDetails bodyDetails, MagnitudeParameters magnitudeParameters, OrbitElements orbitElements) {
        this.bodyDetails = bodyDetails;
        this.magnitudeParameters = magnitudeParameters;
        this.orbitElements = orbitElements;
    }

}
