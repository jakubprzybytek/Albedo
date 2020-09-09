package jp.albedo.webapp.charts.visibility;

import jp.albedo.webapp.risetransitset.rest.RiseTransitSetEvent;

import java.util.List;

public class VisibilityChartResponse {

    final private List<RiseTransitSetEvent> sunRiseTransitSetEvents;

    public VisibilityChartResponse(List<RiseTransitSetEvent> sunRiseTransitSetEvents) {
        this.sunRiseTransitSetEvents = sunRiseTransitSetEvents;
    }

    public List<RiseTransitSetEvent> getSunRiseTransitSetEvents() {
        return sunRiseTransitSetEvents;
    }

}
