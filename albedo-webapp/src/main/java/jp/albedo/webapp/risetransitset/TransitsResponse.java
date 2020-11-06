package jp.albedo.webapp.risetransitset;

import jp.albedo.webapp.risetransitset.rest.TransitSeries;

import java.util.List;

public class TransitsResponse {

    final private List<Double> timeSeries;

    final private List<TransitSeries> altitudeSeries;

    public TransitsResponse(List<Double> timeSeries, List<TransitSeries> altitudeSeries) {
        this.timeSeries = timeSeries;
        this.altitudeSeries = altitudeSeries;
    }

    public List<Double> getTimeSeries() {
        return timeSeries;
    }

    public List<TransitSeries> getAltitudeSeries() {
        return altitudeSeries;
    }
}
