package jp.albedo.jpl.kernel;

import jp.albedo.jpl.files.util.EphemerisSeconds;

public abstract class SpkFileRecord {

    private final TimeSpan timeSpan;

    protected SpkFileRecord(TimeSpan timeSpan) {
        this.timeSpan = timeSpan;
    }

    public TimeSpan getTimeSpan() {
        return timeSpan;
    }

    public double getStartJulianDay() {
        return EphemerisSeconds.toJde(timeSpan.getFrom());
    }

    public double getEndJulianDay() {
        return EphemerisSeconds.toJde(timeSpan.getTo());
    }

}
