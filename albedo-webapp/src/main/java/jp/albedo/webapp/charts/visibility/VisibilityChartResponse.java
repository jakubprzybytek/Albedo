package jp.albedo.webapp.charts.visibility;

import java.util.List;

public class VisibilityChartResponse {

    final List<Double> sunSets;

    final List<Double> sunCivilDusks;

    final List<Double> sunNauticalDusks;

    final List<Double> sunAstronomicalDusks;

    final List<Double> sunAstronomicalDawns;

    final List<Double> sunNauticalDawns ;

    final List<Double> sunCivilDawns;

    final List<Double> sunRises;

    final List<BodyVisibility> bodiesVisibilityList;

    public VisibilityChartResponse(List<Double> sunSets, List<Double> sunCivilDusks, List<Double> sunNauticalDusks, List<Double> sunAstronomicalDusks, List<Double> sunAstronomicalDawns, List<Double> sunNauticalDawns, List<Double> sunCivilDawns, List<Double> sunRises, List<BodyVisibility> bodiesVisibilityList) {
         this.sunSets = sunSets;
        this.sunCivilDusks = sunCivilDusks;
        this.sunNauticalDusks = sunNauticalDusks;
        this.sunAstronomicalDusks = sunAstronomicalDusks;
        this.sunAstronomicalDawns = sunAstronomicalDawns;
        this.sunNauticalDawns = sunNauticalDawns;
        this.sunCivilDawns = sunCivilDawns;
        this.sunRises = sunRises;
        this.bodiesVisibilityList = bodiesVisibilityList;
    }

    public List<Double> getSunSets() {
        return sunSets;
    }

    public List<Double> getSunCivilDusks() {
        return sunCivilDusks;
    }

    public List<Double> getSunNauticalDusks() {
        return sunNauticalDusks;
    }

    public List<Double> getSunAstronomicalDusks() {
        return sunAstronomicalDusks;
    }

    public List<Double> getSunAstronomicalDawns() {
        return sunAstronomicalDawns;
    }

    public List<Double> getSunNauticalDawns() {
        return sunNauticalDawns;
    }

    public List<Double> getSunCivilDawns() {
        return sunCivilDawns;
    }

    public List<Double> getSunRises() {
        return sunRises;
    }

    public List<BodyVisibility> getBodiesVisibilityList() {
        return bodiesVisibilityList;
    }
}
