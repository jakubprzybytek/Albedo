package jp.albedo.webapp.utils;

import com.fasterxml.jackson.databind.util.StdConverter;
import org.apache.commons.math3.util.Precision;
import org.springframework.boot.jackson.JsonComponent;

@JsonComponent
public class Precision2Converter extends StdConverter<Double, Double> {

    @Override
    public Double convert(Double value) {
        return Precision.round(value, 2);
    }

}
