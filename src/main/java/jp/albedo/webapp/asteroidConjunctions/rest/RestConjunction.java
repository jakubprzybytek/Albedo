package jp.albedo.webapp.asteroidConjunctions.rest;

import com.fasterxml.jackson.annotation.JsonProperty;
import jp.albedo.common.BodyDetails;

import java.time.LocalDateTime;

public class RestConjunction {

    @JsonProperty
    private BodyDetails firstBody;

    @JsonProperty
    private BodyDetails secondBody;

    @JsonProperty
    private LocalDateTime dateTimeTD;

    @JsonProperty
    private double separation;

    public RestConjunction(BodyDetails firstBody, BodyDetails secondBody, LocalDateTime dateTimeTD, double separation) {
        this.firstBody = firstBody;
        this.secondBody = secondBody;
        this.dateTimeTD = dateTimeTD;
        this.separation = separation;
    }

}
