package jp.albedo.webapp.conjunctions.rest;

import com.fasterxml.jackson.annotation.JsonProperty;
import jp.albedo.catalogue.CatalogueEntry;
import jp.albedo.common.BodyDetails;
import jp.albedo.common.JulianDay;
import jp.albedo.webapp.common.AstronomicalEvent;
import jp.albedo.webapp.common.AstronomicalObjectTypes;
import jp.albedo.webapp.conjunctions.Conjunction;

public class ConjunctionEvent extends AstronomicalEvent {

    @JsonProperty
    private final AstronomicalObjectTypes firstObjectType;

    @JsonProperty("first")
    private final Object firstObject;

    @JsonProperty
    private final AstronomicalObjectTypes secondObjectType;

    @JsonProperty("second")
    private final Object secondObject;

    @JsonProperty
    private final double separation;

    private ConjunctionEvent(double jde, AstronomicalObjectTypes firstObjectType, Object firstObject, AstronomicalObjectTypes secondObjectType, Object secondObject, double separation) {
        super(jde, JulianDay.toDateTime(jde));
        this.firstObjectType = firstObjectType;
        this.firstObject = firstObject;
        this.secondObjectType = secondObjectType;
        this.secondObject = secondObject;
        this.separation = separation;
    }

    public static ConjunctionEvent fromTwoBodies(Conjunction<BodyDetails, BodyDetails> conjunction) {
        return new ConjunctionEvent(
                conjunction.jde,
                AstronomicalObjectTypes.Body, new ConjunctionBodyInfo(conjunction.firstObject, conjunction.firstObjectEphemeris),
                AstronomicalObjectTypes.Body, new ConjunctionBodyInfo(conjunction.secondObject, conjunction.secondObjectEphemeris),
                Math.toDegrees(conjunction.separation));
    }

    public static ConjunctionEvent fromBodyAndCatalogueEntry(Conjunction<BodyDetails, CatalogueEntry> conjunction) {
        return new ConjunctionEvent(conjunction.jde,
                AstronomicalObjectTypes.Body, new ConjunctionBodyInfo(conjunction.firstObject, conjunction.firstObjectEphemeris),
                AstronomicalObjectTypes.CatalogueEntry, conjunction.secondObject,
                Math.toDegrees(conjunction.separation));
    }

}
