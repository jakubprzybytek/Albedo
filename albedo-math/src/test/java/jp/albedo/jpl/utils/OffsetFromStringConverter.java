package jp.albedo.jpl.utils;

import jp.albedo.jpl.WebGeocalc;
import org.junit.jupiter.api.extension.ParameterContext;
import org.junit.jupiter.params.converter.ArgumentConversionException;
import org.junit.jupiter.params.converter.ArgumentConverter;

import static org.assertj.core.api.Assertions.within;

public class OffsetFromStringConverter implements ArgumentConverter {

    @Override
    public Object convert(Object source, ParameterContext context) throws ArgumentConversionException {
        if (!(source instanceof String)) {
            throw new IllegalArgumentException("The argument should be a string: " + source);
        }

        double delta = Double.parseDouble((String) source);

        return delta == 0.0 ? WebGeocalc.WEB_GEOCALC_OFFSET : within(delta);
    }
}