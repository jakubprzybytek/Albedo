package jp.albedo.webapp.conjunctions;

import com.fasterxml.jackson.annotation.JsonProperty;
import jp.albedo.catalogue.CatalogueEntry;
import jp.albedo.common.BodyDetails;
import jp.albedo.common.JulianDay;
import jp.albedo.webapp.common.AstronomicalEvent;

public class ConjunctionEvent extends AstronomicalEvent {

    @JsonProperty("first")
    private final Object firstObject;

    @JsonProperty("second")
    private final Object secondObject;

    @JsonProperty
    private final double separation;

    private ConjunctionEvent(double jde, Object firstObject, Object secondObject, double separation) {
        super(jde, JulianDay.toDateTime(jde));
        this.firstObject = firstObject;
        this.secondObject = secondObject;
        this.separation = separation;
    }

    static ConjunctionEvent fromTwoBodies(Conjunction<BodyDetails, BodyDetails> conjunction) {
        return new ConjunctionEvent(conjunction.jde, conjunction.first, conjunction.second, Math.toDegrees(conjunction.separation));
    }

    static ConjunctionEvent fromBodyAndCatalogueEntry(Conjunction<BodyDetails, CatalogueEntry> conjunction) {
        return new ConjunctionEvent(conjunction.jde, conjunction.first, conjunction.second, Math.toDegrees(conjunction.separation));
    }

}
