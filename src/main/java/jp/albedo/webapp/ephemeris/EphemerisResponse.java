package jp.albedo.webapp.ephemeris;

import jp.albedo.webapp.external.BodyRecord;

import java.util.List;

public class EphemerisResponse {

    private BodyRecord bodyRecord;

    private List<RestEphemeris> ephemerisList;

    public EphemerisResponse(BodyRecord bodyRecord, List<RestEphemeris> ephemerisList) {
        this.bodyRecord = bodyRecord;
        this.ephemerisList = ephemerisList;
    }

    public BodyRecord getBodyRecord() {
        return bodyRecord;
    }

    public List<RestEphemeris> getEphemerisList() {
        return ephemerisList;
    }

}
