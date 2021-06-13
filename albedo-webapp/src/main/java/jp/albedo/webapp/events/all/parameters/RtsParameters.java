package jp.albedo.webapp.events.all.parameters;

public class RtsParameters {

    private final boolean sunEnabled;

    private final boolean moonEnabled;

    public RtsParameters(boolean sunEnabled, boolean moonEnabled) {
        this.sunEnabled = sunEnabled;
        this.moonEnabled = moonEnabled;
    }

    public boolean isSunEnabled() {
        return sunEnabled;
    }

    public boolean isMoonEnabled() {
        return moonEnabled;
    }
}
