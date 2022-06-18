export * from './JplBody';
export * from './EphemerisSeconds';

export enum BodyType {

    // Regular body types
    Star,
    Planet,
    NaturalSatellite,
    Asteroid,
    Comet,
    Shadow,

    // Special body types
    Barycenter,
    TimeType

    // public static Set<BodyType> parse(Set<String> strings) {
    //     return strings.stream()
    //             .map(BodyType::valueOf)
    //             .collect(Collectors.toSet());
    // }
}
