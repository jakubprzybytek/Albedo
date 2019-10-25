package jp.albedo.webapp.conjunctions;

import com.fasterxml.jackson.annotation.JsonProperty;
import jp.albedo.catalogue.CatalogueEntry;
import jp.albedo.common.AstronomicalCoordinates;
import jp.albedo.common.BodyDetails;
import jp.albedo.common.JulianDay;
import jp.albedo.webapp.common.AstronomicalEvent;
import jp.albedo.webapp.common.AstronomicalObjectTypes;

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

    static ConjunctionEvent fromTwoBodies(Conjunction<BodyDetails, BodyDetails> conjunction) {
        return new ConjunctionEvent(
                conjunction.jde,
                AstronomicalObjectTypes.Body, conjunction.first,
                AstronomicalObjectTypes.Body, conjunction.second,
                Math.toDegrees(conjunction.separation));
    }

    static ConjunctionEvent fromBodyAndCatalogueEntry(Conjunction<BodyDetails, CatalogueEntry> conjunction) {
        return new ConjunctionEvent(conjunction.jde,
                AstronomicalObjectTypes.Body, conjunction.first,
                AstronomicalObjectTypes.CatalogueEntry, translateToDegrees(conjunction.second),
                Math.toDegrees(conjunction.separation));
    }

    static CatalogueEntry translateToDegrees(CatalogueEntry catalogueEntry) {
        return new CatalogueEntry(catalogueEntry.name, catalogueEntry.type,
                new AstronomicalCoordinates(
                        Math.toDegrees(catalogueEntry.coordinates.rightAscension),
                        Math.toDegrees(catalogueEntry.coordinates.declination)),
                catalogueEntry.bMagnitude, catalogueEntry.vMagnitude,
                catalogueEntry.majorAxisSize, catalogueEntry.minorAxisSize,
                catalogueEntry.morphologicalType);
    }

}
