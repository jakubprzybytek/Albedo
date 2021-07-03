package jp.albedo.jpl.kernel;

public abstract class SpkFileRecord {

    private final TimeSpan timeSpan;

    protected SpkFileRecord(TimeSpan timeSpan) {
        this.timeSpan = timeSpan;
    }

    public TimeSpan getTimeSpan() {
        return timeSpan;
    }

}
