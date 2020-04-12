package jp.albedo.catalogue;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import jp.albedo.common.AstronomicalCoordinates;

/*
 * Object representing single entry in a catalogue.
 */
public class CatalogueEntry {

    // main designation
    final public String name;

    final public CatalogueEntryType type;

    final public AstronomicalCoordinates coordinates;

    @JsonProperty
    @JsonInclude(JsonInclude.Include.NON_NULL)
    final public Double bMagnitude;

    @JsonProperty
    @JsonInclude(JsonInclude.Include.NON_NULL)
    final public Double vMagnitude;

    @JsonProperty
    @JsonInclude(JsonInclude.Include.NON_NULL)
    final public Double majorAxisSize;

    @JsonProperty
    @JsonInclude(JsonInclude.Include.NON_NULL)
    final public Double minorAxisSize;

    @JsonProperty
    @JsonInclude(JsonInclude.Include.NON_NULL)
    final public String morphologicalType;

    public CatalogueEntry(String name, CatalogueEntryType type, AstronomicalCoordinates coordinates, Double bMagnitude, Double vMagnitude, Double majorAxisSize, Double minorAxisSize, String morphologicalType) {
        this.name = name;
        this.type = type;
        this.coordinates = coordinates;
        this.bMagnitude = bMagnitude;
        this.vMagnitude = vMagnitude;
        this.majorAxisSize = majorAxisSize;
        this.minorAxisSize = minorAxisSize;
        this.morphologicalType = morphologicalType;
    }

}
