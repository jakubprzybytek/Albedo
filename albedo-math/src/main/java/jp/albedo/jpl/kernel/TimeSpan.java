package jp.albedo.jpl.kernel;

import jp.albedo.jpl.JplException;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class TimeSpan {

    final private double from;

    final private double to;

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

    public double normalizeFor(double jd) throws JplException {

        if (jd < this.from || jd > this.to) {
            throw new JplException(String.format("Cannot normalize %f for %s", jd, this.toString()));
        }

        return (jd - this.from) * 2 / (this.to - this.from) - 1;
    }

    public List<TimeSpan> splitTo(int spans) {
        List<TimeSpan> timeSpans = new ArrayList<>(spans);

        double length = this.to - this.from;

        for (int i = 0; i < spans; i++) {
            timeSpans.add(new TimeSpan(
                    this.from + length / spans * i,
                    this.from + length / spans * (i + 1)
            ));
        }

        return timeSpans;
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
