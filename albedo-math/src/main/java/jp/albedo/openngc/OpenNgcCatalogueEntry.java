package jp.albedo.openngc;

import jp.albedo.catalogue.CatalogueEntryType;
import jp.albedo.common.AstronomicalCoordinates;

/*
 * Object representing single entry in a catalogue.
 */
public class OpenNgcCatalogueEntry {

    // main designation
    final public String name;

    final public CatalogueEntryType type;

    final public AstronomicalCoordinates coordinates;

    final public Double bMagnitude;

    final public Double vMagnitude;

    final public Double majorAxisSize;

    final public Double minorAxisSize;

    final public String morphologicalType;

    final public Integer messierNumber;

    public OpenNgcCatalogueEntry(String name, CatalogueEntryType type, AstronomicalCoordinates coordinates, Double bMagnitude, Double vMagnitude, Double majorAxisSize, Double minorAxisSize, String morphologicalType, Integer messierNumber) {
        this.name = name;
        this.type = type;
        this.coordinates = coordinates;
        this.bMagnitude = bMagnitude;
        this.vMagnitude = vMagnitude;
        this.majorAxisSize = majorAxisSize;
        this.minorAxisSize = minorAxisSize;
        this.morphologicalType = morphologicalType;
        this.messierNumber = messierNumber;
    }

}
