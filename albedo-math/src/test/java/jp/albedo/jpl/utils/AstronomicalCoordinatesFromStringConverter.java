package jp.albedo.jpl.utils;

import jp.albedo.common.AstronomicalCoordinates;
import org.junit.jupiter.api.extension.ParameterContext;
import org.junit.jupiter.params.converter.ArgumentConversionException;
import org.junit.jupiter.params.converter.ArgumentConverter;

public class AstronomicalCoordinatesFromStringConverter implements ArgumentConverter {

    @Override
    public Object convert(Object source, ParameterContext context) throws ArgumentConversionException {
        if (!(source instanceof String)) {
            throw new IllegalArgumentException("The argument should be a string: " + source);
        }

        String[] parts = ((String) source).replace("[", "").replace("]", "").split(",");
        double rightAscensionDegrees = Double.parseDouble(parts[0]);
        double declinationDegrees = Double.parseDouble(parts[1]);

        return new AstronomicalCoordinates(Math.toRadians(rightAscensionDegrees), Math.toRadians(declinationDegrees));
    }
}