package jp.albedo.catalogue;

import jp.albedo.common.AstronomicalCoordinates;

public class CatalogueEntry {

    // main designation
    final public String name;

    final public CatalogueEntryType type;

    final public AstronomicalCoordinates coordinates;

    final public Double bMagnitude;

    final public Double vMagnitude;

    final public Double majorAxisSize;

    final public Double minorAxisSize;

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
