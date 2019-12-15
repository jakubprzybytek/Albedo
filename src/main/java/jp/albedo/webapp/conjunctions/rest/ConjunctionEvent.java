package jp.albedo.webapp.conjunctions.rest;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jp.albedo.catalogue.CatalogueEntry;
import jp.albedo.common.BodyDetails;
import jp.albedo.webapp.common.AstronomicalEvent;
import jp.albedo.webapp.common.AstronomicalObjectTypes;
import jp.albedo.webapp.conjunctions.Conjunction;
import jp.albedo.webapp.utils.RadiansToPrecision6DegreesSerializer;

public class ConjunctionEvent extends AstronomicalEvent {

    private static final String EVENT_TYPE = "Conjunction";

    @JsonProperty
    private final AstronomicalObjectTypes firstObjectType;

    @JsonProperty("first")
    private final Object firstObject;

    @JsonProperty
    private final AstronomicalObjectTypes secondObjectType;

    @JsonProperty("second")
    private final Object secondObject;

    @JsonProperty
    @JsonSerialize(using = RadiansToPrecision6DegreesSerializer.class)
    private final double separation;

    private ConjunctionEvent(double jde, AstronomicalObjectTypes firstObjectType, Object firstObject, AstronomicalObjectTypes secondObjectType, Object secondObject, double separation) {
        super(jde, EVENT_TYPE);
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
                conjunction.separation);
    }

    public static ConjunctionEvent fromBodyAndCatalogueEntry(Conjunction<BodyDetails, CatalogueEntry> conjunction) {
        return new ConjunctionEvent(conjunction.jde,
                AstronomicalObjectTypes.Body, new ConjunctionBodyInfo(conjunction.firstObject, conjunction.firstObjectEphemeris),
                AstronomicalObjectTypes.CatalogueEntry, conjunction.secondObject,
                conjunction.separation);
    }

}
