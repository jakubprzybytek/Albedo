package jp.albedo.webapp.ephemeris;

import java.util.List;

import jp.albedo.common.BodyDetails;

public class EphemerisResponse {

  private BodyDetails bodyDetails;

  private List<RestEphemeris> ephemerisList;

  public EphemerisResponse(BodyDetails bodyDetails, List<RestEphemeris> ephemerisList) {
    this.bodyDetails = bodyDetails;
    this.ephemerisList = ephemerisList;
  }

  public BodyDetails getBodyDetails() {
    return bodyDetails;
  }

  public List<RestEphemeris> getEphemerisList() {
    return ephemerisList;
  }

}
