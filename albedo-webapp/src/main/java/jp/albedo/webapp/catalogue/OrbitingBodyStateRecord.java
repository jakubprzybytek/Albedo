package jp.albedo.webapp.catalogue;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonUnwrapped;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jp.albedo.common.Year;
import jp.albedo.webapp.ephemeris.orbitbased.OrbitingBodyRecord;
import jp.albedo.webapp.utils.Precision2Converter;

public class OrbitingBodyStateRecord {

    @JsonUnwrapped
    final private OrbitingBodyRecord orbitingBodyRecord;

    @JsonProperty
    @JsonSerialize(converter = Precision2Converter.class)
    private Double orbitalPeriod;

    @JsonProperty
    @JsonSerialize(converter = Precision2Converter.class)
    private Double orbitalPeriodInDays;

    public OrbitingBodyStateRecord(OrbitingBodyRecord orbitingBodyRecord) {
        this.orbitingBodyRecord = orbitingBodyRecord;
    }

    public void setOrbitalPeriod(Double orbitalPeriodInDays) {
        this.orbitalPeriod = orbitalPeriodInDays / Year.SOLAR_DAYS;
        this.orbitalPeriodInDays = orbitalPeriodInDays;
    }

}
