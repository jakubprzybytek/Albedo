package jp.albedo.catalogue;

public class CatalogueEntry {

    // main designation
    public String name;

    public String type;

    // in degrees
    public double rightAscention;

    // in degress
    public double declination;

    public CatalogueEntry(String name, String type, double rightAscention, double declination) {
        this.name = name;
        this.type = type;
        this.rightAscention = rightAscention;
        this.declination = declination;
    }

}
