package jp.albedo.webapp.ephemeris;

import jp.albedo.common.BodyDetails;
import jp.albedo.ephemeris.Ephemeris;

import java.util.List;

public class EphemerisResponse {

    private BodyDetails bodyDetails;

    private List<Ephemeris> ephemerisList;

    public EphemerisResponse(BodyDetails bodyDetails, List<Ephemeris> ephemerisList) {
        this.bodyDetails = bodyDetails;
        this.ephemerisList = ephemerisList;
    }

    public BodyDetails getBodyDetails() {
        return bodyDetails;
    }

    public List<Ephemeris> getEphemerisList() {
        return ephemerisList;
    }
}
