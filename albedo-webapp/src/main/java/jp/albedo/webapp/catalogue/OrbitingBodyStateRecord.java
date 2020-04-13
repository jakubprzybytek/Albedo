package jp.albedo.webapp.catalogue;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonUnwrapped;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jp.albedo.webapp.ephemeris.orbitbased.OrbitingBodyRecord;
import jp.albedo.webapp.utils.Precision2Converter;

public class OrbitingBodyStateRecord {

    @JsonUnwrapped
    final private OrbitingBodyRecord orbitingBodyRecord;

    @JsonProperty
    @JsonSerialize(converter = Precision2Converter.class)
    final private double orbitalPeriod;

    @JsonProperty
    @JsonSerialize(converter = Precision2Converter.class)
    final private double orbitalPeriodInDays;

    public OrbitingBodyStateRecord(OrbitingBodyRecord orbitingBodyRecord, double orbitalPeriod, double orbitalPeriodInDays) {
        this.orbitingBodyRecord = orbitingBodyRecord;
        this.orbitalPeriod = orbitalPeriod;
        this.orbitalPeriodInDays = orbitalPeriodInDays;
    }

}
