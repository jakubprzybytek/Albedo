package jp.albedo.webapp.charts.visibility;

import jp.albedo.common.BodyDetails;

import java.util.List;

public class BodyVisibility {

    final BodyDetails bodyDetails;

    final List<Double> rises;

    final List<Double> transits;

    final List<Double> sets;

    public BodyVisibility(BodyDetails bodyDetails, List<Double> rises, List<Double> transits, List<Double> sets) {
        this.bodyDetails = bodyDetails;
        this.rises = rises;
        this.transits = transits;
        this.sets = sets;
    }

    public BodyDetails getBodyDetails() {
        return bodyDetails;
    }

    public List<Double> getRises() {
        return rises;
    }

    public List<Double> getTransits() {
        return transits;
    }

    public List<Double> getSets() {
        return sets;
    }
}
