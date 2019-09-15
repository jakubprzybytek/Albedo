package jp.albedo.mpc;

import jp.albedo.common.BodyDetails;
import jp.albedo.ephemeris.common.OrbitElements;

public class MPCORBRecord {

    public BodyDetails bodyDetails;

    public OrbitElements orbitElements;

    public MPCORBRecord(BodyDetails bodyDetails, OrbitElements orbitElements) {
        this.bodyDetails = bodyDetails;
        this.orbitElements = orbitElements;
    }

}
