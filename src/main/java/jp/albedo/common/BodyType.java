package jp.albedo.common;

import java.util.Set;
import java.util.stream.Collectors;

public enum BodyType {

    // Regular body types
    Star,
    Planet,
    NaturalSatellite,
    Asteroid,

    // Special body types
    Barycenter;

    public static Set<BodyType> parse(Set<String> strings) {
        return strings.stream()
                .map(BodyType::valueOf)
                .collect(Collectors.toSet());
    }

}
