package jp.albedo.webapp.asteroidConjunctions;

import java.time.LocalDateTime;

import jp.albedo.common.BodyDetails;

public class RestConjunction {

  private BodyDetails firstBody;

  private BodyDetails secondBody;

  private LocalDateTime dateTimeTD;

  private double separation;

  public RestConjunction(BodyDetails firstBody, BodyDetails secondBody, LocalDateTime dateTimeTD, double separation) {
    this.firstBody = firstBody;
    this.secondBody = secondBody;
    this.dateTimeTD = dateTimeTD;
    this.separation = separation;
  }

  public BodyDetails getFirstBody() {
    return firstBody;
  }

  public BodyDetails getSecondBody() {
    return secondBody;
  }

  public LocalDateTime getDateTimeTD() {
    return dateTimeTD;
  }

  public double getSeparation() {
    return separation;
  }

}
