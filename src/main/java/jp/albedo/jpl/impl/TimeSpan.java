package jp.albedo.jpl.impl;

import java.util.Objects;

public class TimeSpan {

    private double from;

    private double to;

    public TimeSpan(double from, double to) {
        this.from = from;
        this.to = to;
    }

    public double getFrom() {
        return from;
    }

    public double getTo() {
        return to;
    }

    public boolean inside(double jd) {
        return jd >= this.from && jd <= this.to;
    }

    public double normalizeFor(double jd) {
        return (jd - this.from) / (this.to - this.from);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.from, this.to);
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null || !(obj instanceof TimeSpan)) {
            return false;
        }
        TimeSpan other = (TimeSpan) obj;
        return Objects.equals(this.from, other.from) && Objects.equals(this.to, other.to);
    }
}
