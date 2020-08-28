package jp.albedo.webapp.utils;

import com.fasterxml.jackson.databind.util.StdConverter;
import org.apache.commons.math3.util.Precision;
import org.springframework.boot.jackson.JsonComponent;

import java.util.Arrays;

@JsonComponent
public class RadiansArrayToPrecision1DegreesConverter extends StdConverter<Double[], Double[]> {

    @Override
    public Double[] convert(Double[] values) {
        return Arrays.stream(values)
                .map(value -> Precision.round(Math.toDegrees(value), 1))
                .toArray(Double[]::new);
    }

}
