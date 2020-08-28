package jp.albedo.webapp.altitude;

import jp.albedo.webapp.altitude.rest.AltitudeSeries;
import jp.albedo.webapp.risetransitset.rest.RiseTransitSetEvent;

import java.time.ZoneId;
import java.util.List;

public class AltitudeResponse {

    final private List<RiseTransitSetEvent> sunRiseTransitSetEvents;

    final private List<Double> timeSeries;

    final private List<AltitudeSeries> altitudeSeries;

    public AltitudeResponse(List<RiseTransitSetEvent> sunRiseTransitSetEvents, List<Double> timeSeries, List<AltitudeSeries> altitudeSeries) {
        this.sunRiseTransitSetEvents = sunRiseTransitSetEvents;
        this.timeSeries = timeSeries;
        this.altitudeSeries = altitudeSeries;
    }

    public List<RiseTransitSetEvent> getSunRiseTransitSetEvents() {
        return sunRiseTransitSetEvents;
    }

    public List<Double> getTimeSeries() {
        return timeSeries;
    }

    public List<AltitudeSeries> getAltitudeSeries() {
        return altitudeSeries;
    }
}
