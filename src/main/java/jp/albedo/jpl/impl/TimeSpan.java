package jp.albedo.jpl.impl;

import jp.albedo.jpl.JPLException;

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

    public double normalizeFor(double jd) throws JPLException {

        if (jd < this.from || jd > this.to) {
            throw new JPLException(String.format("Cannot normalize %f for %s", jd, this.toString()));
        }

        return (jd - this.from) * 2 / (this.to - this.from) - 1;
    }

    @Override
    public String toString() {
        return String.format("[%f,%f]", this.from, this.to);
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
