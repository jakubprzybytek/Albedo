package jp.albedo.jpl.state;

import org.assertj.core.data.Offset;

import static org.assertj.core.api.Assertions.within;

public class WebGeocalc {

    /**
     * Offset to compensate for differences between WebGeocalc results and those computed here.
     */
    public static final Offset<Double> WEB_GEOCALC_OFFSET = within(0.00000006);

}
