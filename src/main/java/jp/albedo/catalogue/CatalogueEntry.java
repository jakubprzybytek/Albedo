package jp.albedo.catalogue;

import jp.albedo.common.AstronomicalCoordinates;

public class CatalogueEntry {

    // main designation
    final public String name;

    final public String type;

    final public AstronomicalCoordinates coordinates;

    public CatalogueEntry(String name, String type, AstronomicalCoordinates coordinates) {
        this.name = name;
        this.type = type;
        this.coordinates = coordinates;
    }

}
