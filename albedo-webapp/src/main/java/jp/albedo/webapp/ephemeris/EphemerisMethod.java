package jp.albedo.webapp.ephemeris;

public enum EphemerisMethod {

    JeanMeeus("Jean Meeus", ""),
    ascii438("ASCII SPK: DE438", ""),
    binary440("Binary SPK: DE440", "de440");

    public final String description;

    public final String id;

    EphemerisMethod(String description, String id) {
        this.description = description;
        this.id = id;
    }
}